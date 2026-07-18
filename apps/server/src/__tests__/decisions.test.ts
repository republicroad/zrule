import { describe, it, expect, beforeAll } from "bun:test";
import {
  signUp,
  signIn,
  createOrganization,
  setActiveOrganization,
  request,
  uniqueId,
} from "./helpers.ts";

const email = `decision-test-${uniqueId()}@example.com`;
const password = "Test1234!";
const orgSlug = `org-${uniqueId()}`;

let decisionId: string | null = null;

describe("Decisions API", () => {
  beforeAll(async () => {
    await signUp("Decision Test User", email, password);
    await signIn(email, password);

    const orgResponse = await createOrganization("Decision Org", orgSlug);
    const org = await orgResponse.json();
    await setActiveOrganization(org.id);
  });

  describe("POST /api/decisions", () => {
    it("should create a new decision", async () => {
      const response = await request("/api/decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test Decision",
          slug: `decision-${uniqueId()}`,
          description: "A test decision",
          graph: { nodes: [], edges: [] },
        }),
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.id).toBeDefined();
      expect(data.name).toBe("Test Decision");
      expect(data.version).toBe(1);
      decisionId = data.id;
    });
  });

  describe("GET /api/decisions", () => {
    it("should list all decisions", async () => {
      const response = await request("/api/decisions");
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/decisions/:id", () => {
    it("should get a single decision", async () => {
      expect(decisionId).toBeDefined();
      const response = await request(`/api/decisions/${decisionId}`);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.id).toBe(decisionId);
      expect(data.name).toBe("Test Decision");
      expect(data.version).toBe(1);
    });

    it("should return 404 for non-existent decision", async () => {
      const response = await request(
        "/api/decisions/00000000-0000-0000-0000-000000000000"
      );
      expect(response.status).toBe(404);
    });
  });

  describe("PUT /api/decisions/:id", () => {
    it("should update a decision", async () => {
      expect(decisionId).toBeDefined();
      const response = await request(`/api/decisions/${decisionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Updated Decision",
          description: "Updated description",
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.name).toBe("Updated Decision");
      expect(data.description).toBe("Updated description");
      expect(data.version).toBe(2);
    });
  });

  describe("DELETE /api/decisions/:id", () => {
    it("should soft-delete a decision", async () => {
      expect(decisionId).toBeDefined();
      const response = await request(`/api/decisions/${decisionId}`, {
        method: "DELETE",
      });
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
    });

    it("should not find deleted decision in list", async () => {
      const response = await request("/api/decisions");
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.some((d: any) => d.id === decisionId)).toBe(false);
    });
  });

  describe("Validation", () => {
    it("should reject decision without name", async () => {
      const response = await request("/api/decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: `no-name-${uniqueId()}` }),
      });
      expect(response.status).toBe(400);
    });

    it("should reject decision without slug", async () => {
      const response = await request("/api/decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "No Slug" }),
      });
      expect(response.status).toBe(400);
    });
  });
});

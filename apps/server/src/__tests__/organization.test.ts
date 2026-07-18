import { describe, it, expect, beforeAll } from "bun:test";
import {
  signUp,
  signIn,
  createOrganization,
  setActiveOrganization,
  request,
  uniqueId,
} from "./helpers.ts";

const email = `org-test-${uniqueId()}@example.com`;
const password = "Test1234!";
const orgSlug = `org-${uniqueId()}`;

let organizationId: string | null = null;

describe("Organization API", () => {
  beforeAll(async () => {
    await signUp("Org Test User", email, password);
    await signIn(email, password);
  });

  describe("POST /api/auth/organization/create", () => {
    it("should create a new organization", async () => {
      const response = await createOrganization("Test Organization", orgSlug);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.id).toBeDefined();
      expect(data.name).toBe("Test Organization");
      expect(data.slug).toBe(orgSlug);
      organizationId = data.id;
    });
  });

  describe("POST /api/auth/organization/set-active", () => {
    it("should set active organization", async () => {
      expect(organizationId).toBeDefined();
      const response = await setActiveOrganization(organizationId!);
      expect(response.status).toBe(200);
    });
  });

  describe("GET /api/auth/organization/list", () => {
    it("should list all organizations", async () => {
      const response = await request("/api/auth/organization/list");
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/auth/organization/get-full-organization", () => {
    it("should get full organization details", async () => {
      const response = await request(
        "/api/auth/organization/get-full-organization"
      );
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toBeDefined();
      expect(data.members).toBeDefined();
      expect(Array.isArray(data.members)).toBe(true);
    });
  });

  describe("GET /api/auth/organization/list-members", () => {
    it("should list organization members", async () => {
      const response = await request("/api/auth/organization/list-members");
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.members).toBeDefined();
      expect(Array.isArray(data.members)).toBe(true);
      expect(data.members.length).toBeGreaterThan(0);
    });
  });
});

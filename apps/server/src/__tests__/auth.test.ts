import { describe, it, expect, beforeAll } from "bun:test";
import { signUp, signIn, signOut, getSession, uniqueId } from "./helpers.ts";

const email = `auth-test-${uniqueId()}@example.com`;
const password = "Test1234!";

describe("Auth API", () => {
  describe("POST /api/auth/sign-up/email", () => {
    it("should register a new user", async () => {
      const response = await signUp("Auth Test User", email, password);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.user).toBeDefined();
      expect(data.user.email).toBe(email);
      expect(data.token).toBeDefined();
    });

    it("should reject duplicate email", async () => {
      const response = await signUp("Another User", email, "Password123!");
      expect(response.status).not.toBe(200);
    });
  });

  describe("POST /api/auth/sign-in/email", () => {
    it("should sign in with valid credentials", async () => {
      const response = await signIn(email, password);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.user).toBeDefined();
      expect(data.user.email).toBe(email);
      expect(data.token).toBeDefined();
    });

    it("should reject invalid credentials", async () => {
      const response = await signIn(email, "WrongPassword123!");
      expect(response.status).not.toBe(200);
    });
  });

  describe("GET /api/auth/get-session", () => {
    it("should return current session", async () => {
      await signIn(email, password);
      const response = await getSession();
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.user).toBeDefined();
      expect(data.user.email).toBe(email);
    });
  });

  describe("POST /api/auth/sign-out", () => {
    it("should sign out", async () => {
      const response = await signOut();
      expect(response.status).toBe(200);
    });

    it("should not have session after sign out", async () => {
      const response = await getSession();
      const data = await response.json();
      expect(!data || !data.session).toBe(true);
    });
  });
});

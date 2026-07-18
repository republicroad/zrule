import { app } from "../app.ts";

const BASE_URL = "http://localhost:3001";
const TEST_ORIGIN = "http://localhost:5173";

let sessionCookie: string | null = null;

export async function request(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(options.headers);
  if (sessionCookie) {
    headers.set("Cookie", sessionCookie);
  }
  if (!headers.has("Origin")) {
    headers.set("Origin", TEST_ORIGIN);
  }

  return app.request(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });
}

export async function requestAndUpdateCookie(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const response = await request(path, options);
  const cookie = extractCookie(response);
  if (cookie) {
    sessionCookie = cookie;
  }
  return response;
}

export function setSessionCookie(cookie: string | null) {
  sessionCookie = cookie;
}

export function extractCookie(response: Response): string | null {
  const setCookie = response.headers.getSetCookie?.() ?? [];
  for (const header of setCookie) {
    const match = header.match(/better-auth\.session_token=([^;]+)/);
    if (match) {
      return `better-auth.session_token=${match[1]}`;
    }
  }
  const singleCookie = response.headers.get("set-cookie");
  if (singleCookie) {
    const match = singleCookie.match(/better-auth\.session_token=([^;]+)/);
    if (match) return `better-auth.session_token=${match[1]}`;
  }
  return null;
}

export async function signUp(name: string, email: string, password: string) {
  const response = await requestAndUpdateCookie("/api/auth/sign-up/email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return response;
}

export async function signIn(email: string, password: string) {
  const response = await requestAndUpdateCookie("/api/auth/sign-in/email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return response;
}

export async function signOut() {
  const response = await requestAndUpdateCookie("/api/auth/sign-out", {
    method: "POST",
  });
  return response;
}

export async function getSession() {
  return request("/api/auth/get-session");
}

export async function createOrganization(name: string, slug: string) {
  const response = await requestAndUpdateCookie("/api/auth/organization/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, slug }),
  });
  return response;
}

export async function setActiveOrganization(organizationId: string) {
  const response = await requestAndUpdateCookie(
    "/api/auth/organization/set-active",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organizationId }),
    }
  );
  return response;
}

export function uniqueId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

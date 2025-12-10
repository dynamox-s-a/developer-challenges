import type { AuthUser } from "@/types";

interface JWTPayload {
  sub: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

const JWT_SECRET = "event-management-secret-key";
const TOKEN_EXPIRY_HOURS = 24;

function base64UrlEncode(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  return atob(base64 + padding);
}

export function generateToken(user: AuthUser): string {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const now = Math.floor(Date.now() / 1000);
  const payload: JWTPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    iat: now,
    exp: now + TOKEN_EXPIRY_HOURS * 60 * 60,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  // Fake signature (in real app, this would be cryptographically signed)
  const signature = base64UrlEncode(
    `${encodedHeader}.${encodedPayload}.${JWT_SECRET}`,
  );

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function decodeToken(token: string): JWTPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(base64UrlDecode(parts[1])) as JWTPayload;
    return payload;
  } catch {
    return null;
  }
}

export function isTokenValid(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload) {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  return payload.exp > now;
}

export function getUserFromToken(token: string): AuthUser | null {
  const payload = decodeToken(token);
  if (!payload || !isTokenValid(token)) {
    return null;
  }

  return {
    id: payload.sub,
    email: payload.email,
    role: payload.role as AuthUser["role"],
  };
}

import type { AuthUser, LoginCredentials, User } from "@/types";
import { generateToken, isTokenValid } from "./jwt";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const AUTH_STORAGE_KEY = "event_management_auth";

interface StoredAuth {
  user: AuthUser;
  token: string;
}

// Token management
export function getStoredAuth(): StoredAuth | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored) as StoredAuth;
    if (isTokenValid(parsed.token)) {
      return parsed;
    }
    clearStoredAuth();
    return null;
  } catch {
    clearStoredAuth();
    return null;
  }
}

export function setStoredAuth(user: AuthUser, token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, token }));
}

export function clearStoredAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getAuthToken(): string | null {
  const auth = getStoredAuth();
  return auth?.token ?? null;
}

// API request helper - exported for use by feature APIs
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAuthToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      errorText || `Request failed with status ${response.status}`,
    );
  }

  return response.json();
}

// Auth API
export async function loginApi(
  credentials: LoginCredentials,
): Promise<{ user: AuthUser; token: string }> {
  // Fetch users from json-server
  const users = await apiRequest<User[]>(
    `/users?email=${encodeURIComponent(credentials.email)}`,
  );

  const user = users.find(
    (u) => u.email === credentials.email && u.password === credentials.password,
  );

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const authUser: AuthUser = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const token = generateToken(authUser);
  setStoredAuth(authUser, token);

  return { user: authUser, token };
}

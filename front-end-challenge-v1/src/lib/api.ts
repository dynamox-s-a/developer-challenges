import type {
  AuthUser,
  CreateEventPayload,
  Event,
  LoginCredentials,
  UpdateEventPayload,
  User,
} from "@/types";
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

// API request helper
async function apiRequest<T>(
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

// Events API
export const eventsApi = {
  async getAll(): Promise<Event[]> {
    return apiRequest<Event[]>("/events");
  },

  async getById(id: string): Promise<Event> {
    return apiRequest<Event>(`/events/${id}`);
  },

  async create(payload: CreateEventPayload): Promise<Event> {
    const now = new Date().toISOString();
    const newEvent = {
      ...payload,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    return apiRequest<Event>("/events", {
      method: "POST",
      body: JSON.stringify(newEvent),
    });
  },

  async update(payload: UpdateEventPayload): Promise<Event> {
    const { id, ...updates } = payload;
    const existing = await eventsApi.getById(id);

    const updatedEvent = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return apiRequest<Event>(`/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(updatedEvent),
    });
  },

  async delete(id: string): Promise<void> {
    await apiRequest(`/events/${id}`, {
      method: "DELETE",
    });
  },
};

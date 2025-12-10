import axios, { type AxiosRequestConfig } from "axios";
import type { AuthUser, LoginCredentials, User } from "@/types";
import { generateToken, isTokenValid } from "./jwt";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const AUTH_STORAGE_KEY = "event_management_auth";

interface StoredAuth {
  user: AuthUser;
  token: string;
}

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
  options: AxiosRequestConfig = {},
): Promise<T> {
  try {
    const response = await axiosInstance.request<T>({
      url: endpoint,
      ...options,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.statusText ||
        error.message ||
        `Request failed with status ${error.response?.status}`;
      throw new Error(message);
    }
    throw error;
  }
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

// Export axios instance for direct use if needed
export { axiosInstance };

export type UserRole = "admin" | "reader";

export interface User {
  id: number;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthUser {
  id: number;
  email: string;
  role: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

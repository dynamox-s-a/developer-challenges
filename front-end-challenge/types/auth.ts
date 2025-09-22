/**
 * User-related types and interfaces
 */

// Role enum for better type safety
export enum UserRole {
  ADMIN = "admin",
  READER = "reader",
}

// Alternative: const assertion approach (more modern)
export const USER_ROLES = {
  ADMIN: "admin",
  READER: "reader",
} as const;

export type UserRoleType = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export interface User {
  id: string;
  email: string;
  password?: string;
  role: UserRole;
}

export interface AuthUser {
  userId: string;
  email: string;
  role: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginFormCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: Omit<User, "password">;
  token: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  iat: number;
  exp: number;
}

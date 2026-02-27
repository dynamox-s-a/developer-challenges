/**
 * @fileoverview Auth schemas shared between API and Web App.
 * Defines runtime validation schemas and derived TypeScript types
 * for authentication request/response contracts.
 */
import { Type, Static } from '@sinclair/typebox';

// Shared Schemas

export const UserRoleSchema = Type.Union([
  Type.Literal('USER'),
  Type.Literal('ADMIN'),
  Type.Literal('SUPER_ADMIN'),
]);

// Model Schemas

export const UserSchema = Type.Object({
  id: Type.Number(),
  uuid: Type.String(),
  email: Type.String({ format: 'email' }),
  name: Type.String(),
  role: UserRoleSchema,
});

// Login Schemas

export const LoginRequestSchema = Type.Object({
  email: Type.String({
    format: 'email',
    minLength: 1,
    description: 'Valid email address',
  }),
  password: Type.String({
    minLength: 6,
    maxLength: 100,
    description: 'Password must be at least 6 characters',
  }),
});

// NOTE (@eric-reis): JWT token is intentionally omitted. Auth uses httpOnly cookies via Set-Cookie
//                    header for security.
export const LoginResponseSchema = Type.Object({ user: UserSchema });

// NOTE (@eric-reis): Alias reused in routes that return authenticated user data (e.g. auth/me).
export const UserDataResponseSchema = LoginResponseSchema;

// Types

export type UserRole = Static<typeof UserRoleSchema>;
export type User = Static<typeof UserSchema>;
export type LoginRequest = Static<typeof LoginRequestSchema>;
export type LoginResponse = Static<typeof LoginResponseSchema>;
export type UserDataResponse = LoginResponse;

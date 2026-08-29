import { z } from "zod";

import { isoDateTimeSchema } from "./common.js";

export const loginRequestSchema = z
  .object({
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(1).max(256),
  })
  .strict();

// Registration enforces the password policy; login stays at min(1) so it never leaks the policy
// to a guessing client.
export const registerRequestSchema = z
  .object({
    email: z.string().trim().toLowerCase().email().max(254),
    password: z.string().min(8).max(256),
  })
  .strict();

export const authenticatedUserSchema = z.object({
  email: z.string().email(),
});

export const loginResponseSchema = z.object({
  accessToken: z.string().min(1),
  tokenType: z.literal("Bearer"),
  expiresAt: isoDateTimeSchema,
  user: authenticatedUserSchema,
});

export const meResponseSchema = z.object({
  user: authenticatedUserSchema,
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type AuthenticatedUser = z.infer<typeof authenticatedUserSchema>;
export type MeResponse = z.infer<typeof meResponseSchema>;

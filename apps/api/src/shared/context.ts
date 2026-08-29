import type { AuthenticatedUser } from "@dyn/contracts";

export interface Variables {
  requestId: string;
  user: AuthenticatedUser;
}

// Shared Hono environment so feature routers compose into the root app without widening its type.
export type AppEnv = { Variables: Variables };

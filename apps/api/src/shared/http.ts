import { zValidator } from "@hono/zod-validator";
import type { ValidationTargets } from "hono";
import type { ZodType } from "zod";

import { ValidationError } from "./errors.js";

export function parseWithSchema<T>(schema: ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);

  if (result.success) {
    return result.data;
  }

  throw new ValidationError(result.error);
}

// zValidator's default hook writes its own 400 response shape, so every route shares this hook to
// keep failures on the API error envelope.
export function validated<Target extends keyof ValidationTargets, Schema extends ZodType>(
  target: Target,
  schema: Schema
) {
  return zValidator(target, schema, (result) => {
    if (!result.success) {
      throw new ValidationError(result.error);
    }
  });
}

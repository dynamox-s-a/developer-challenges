import { z } from "zod";

export const apiErrorCodeSchema = z.enum([
  "AUTHENTICATION_REQUIRED",
  "INVALID_CREDENTIALS",
  "INVALID_TOKEN",
  "INVALID_JSON",
  "VALIDATION_ERROR",
  "NOT_FOUND",
  "CONFLICT",
  "SENSOR_INCOMPATIBLE",
  "SENSOR_REQUIRED",
  "INTERNAL_ERROR",
]);

export const apiErrorSchema = z.object({
  error: z.object({
    code: apiErrorCodeSchema,
    message: z.string(),
    requestId: z.string(),
    issues: z
      .array(
        z.object({
          path: z.string(),
          message: z.string(),
        })
      )
      .optional(),
  }),
});

export type ApiErrorCode = z.infer<typeof apiErrorCodeSchema>;
export type ApiError = z.infer<typeof apiErrorSchema>;

import z from 'zod'

export const registerRequestSchema = z.object({
  name: z.string().min(3).max(20),
  email: z.email().max(250),
  password: z.string().min(6).max(20),
})

export const registerResponseSchema = z.object({
  success: z.boolean(),
  data: registerRequestSchema.optional(),
  message: z.string(),
  error: z.string().optional(),
})

export const loginRequestSchema = z.object({
  email: z.email().max(250),
  password: z.string().min(6),
})

export const loginResponseSchema = z.object({
  success: z.boolean(),
  data: loginRequestSchema.optional(),
  message: z.string(),
  error: z.string().optional(),
})

export type registerResponse = z.infer<typeof registerResponseSchema>
export type registerRequest = z.infer<typeof registerRequestSchema>
export type loginResponse = z.infer<typeof loginResponseSchema>
export type loginRequest = z.infer<typeof loginRequestSchema>

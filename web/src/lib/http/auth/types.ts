import z from 'zod'

export const registerRequestSchema = z.object({
  name: z
    .string()
    .max(20)
    .nonempty('username is required.')
    .regex(/^[A-Za-z]+$/i, 'Only letters are allowed'),
  email: z.email().max(250).nonempty('email is required.'),
  password: z.string().nonempty('password is required').min(8).max(20),
})

export const loginRequestSchema = z.object({
  email: z.email().max(250),
  password: z.string().min(6).max(20),
})

export const loginResponseSchema = z.object({
  id: z.string().max(22),
  name: z.string().max(20),
  email: z.email(),
  token: z.string(),
})

export type registerRequest = z.infer<typeof registerRequestSchema>
export type loginResponse = z.infer<typeof loginResponseSchema>
export type loginRequest = z.infer<typeof loginRequestSchema>

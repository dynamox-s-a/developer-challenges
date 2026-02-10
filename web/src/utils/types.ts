import z from 'zod'

export const TokenSchema = z.object({
  name: z.string(),
  value: z.string(),
})

export const objectIdValidator = z.string().regex(/^[0-9a-fA-F]{24}$/)

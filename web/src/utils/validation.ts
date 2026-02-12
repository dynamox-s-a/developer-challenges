import z from 'zod'

export const TokenSchema = z.object({
  name: z.string(),
  value: z.string(),
})

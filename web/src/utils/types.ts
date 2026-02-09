import z from 'zod'

export const TokenSchema = z.object({
  token: z.jwt(),
})

import z from 'zod'

const envSchema = z.object({
  MONGODB_URI: z.url(),
})

const parsed = envSchema.safeParse({
  MONGODB_URI: process.env.MONGODB_URI,
})

if (!parsed.success) console.warn('MONGODB_URI não definida.')

export const env = {
  MONGODB_URI: process.env.MONGODB_URI || '',
}

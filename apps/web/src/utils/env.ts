import z from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_API_PRODUCTION_URL: z.url(),
})

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_API_PRODUCTION_URL: process.env.NEXT_PUBLIC_API_PRODUCTION_URL,
})

if (!parsed.success)
  console.warn('NEXT_PUBLIC_API_PRODUCTION_URL não definida.')

export const env = {
  NEXT_PUBLIC_API_PRODUCTION_URL:
    process.env.NEXT_PUBLIC_API_PRODUCTION_URL || 'http://localhost:3000/api',
}

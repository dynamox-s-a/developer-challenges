import z from 'zod'

const envSchema = z.object({
  MONGODB_URI: z.url(),
  BCRYPT_PASS: z.string().transform(v => +v),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),
})

const parsed = envSchema.safeParse({
  MONGODB_URI: process.env.MONGODB_URI,
  BCRYPT_PASS: process.env.BCRYPT_PASS,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
})

if (!parsed.success)
  throw new Error('Erro ao realizar o parsing das variaveis de ambiente')

export const env = {
  MONGODB_URI: process.env.MONGODB_URI || '',
  BCRYPT_PASS: process.env.BCRYPT_PASS || 0,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1m',
}

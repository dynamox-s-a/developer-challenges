import 'dotenv/config';
import { z } from 'zod';

// Formato esperado das variáveis de ambiente da API
const envSchema = z.object({
  HOST: z.string().default('localhost'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z
    .string()
    .startsWith('postgresql://', 'DATABASE_URL deve começar com postgresql://'),
  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET precisa ter pelo menos 32 caracteres'),
  JWT_EXPIRES_IN: z.coerce.number().int().positive().default(3600),
});

const parsed = envSchema.safeParse(process.env);

// Falha rápido: sem configuração válida, a API nem sobe
if (!parsed.success) {
  console.error('Variáveis de ambiente inválidas:');
  console.error(z.prettifyError(parsed.error));
  process.exit(1);
}

export const env = parsed.data;
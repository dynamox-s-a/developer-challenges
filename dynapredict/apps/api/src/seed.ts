import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from './lib/prisma.ts';

// Variáveis usadas só pelo seed (a API não precisa delas para rodar)
const seedEnvSchema = z.object({
  SEED_USER_EMAIL: z.email('SEED_USER_EMAIL precisa ser um e-mail válido'),
  SEED_USER_PASSWORD: z
    .string()
    .min(8, 'SEED_USER_PASSWORD precisa ter pelo menos 8 caracteres'),
});

const parsed = seedEnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Variáveis do seed inválidas:');
  console.error(z.prettifyError(parsed.error));
  process.exit(1);
}

const seedEnv = parsed.data;

async function main() {
  // Nunca guardamos a senha em si: só o hash dela
  const passwordHash = await bcrypt.hash(seedEnv.SEED_USER_PASSWORD, 10);

  // upsert = cria se não existe, atualiza se já existe (pode rodar várias vezes)
  const user = await prisma.user.upsert({
    where: { email: seedEnv.SEED_USER_EMAIL },
    update: { passwordHash },
    create: { email: seedEnv.SEED_USER_EMAIL, passwordHash },
  });

  console.log(`Usuário de login pronto: ${user.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

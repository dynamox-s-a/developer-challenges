import { hash } from "bcryptjs";
import { envSchema } from "../src/config/env";
import { createPrismaClient } from "../src/database/prisma";

const BCRYPT_ROUNDS = 10;

async function main(): Promise<void> {
  const { DATABASE_URL, SEED_USER_EMAIL, SEED_USER_PASSWORD } = envSchema
    .pick({
      DATABASE_URL: true,
      SEED_USER_EMAIL: true,
      SEED_USER_PASSWORD: true,
    })
    .parse(process.env);

  const prisma = createPrismaClient(DATABASE_URL);

  try {
    const passwordHash = await hash(SEED_USER_PASSWORD, BCRYPT_ROUNDS);

    await prisma.user.upsert({
      where: { email: SEED_USER_EMAIL },
      update: { password: passwordHash },
      create: { email: SEED_USER_EMAIL, password: passwordHash },
    });

    console.log(`Seed fineshed. Login user: ${SEED_USER_EMAIL}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

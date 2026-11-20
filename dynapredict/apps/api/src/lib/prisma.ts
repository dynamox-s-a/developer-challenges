import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.ts';
import { env } from '../config/env.ts';

// O adapter é o "driver" que conecta o Prisma ao Postgres
const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

// Uma única instância do Prisma, reutilizada pela API inteira
export const prisma = new PrismaClient({ adapter });

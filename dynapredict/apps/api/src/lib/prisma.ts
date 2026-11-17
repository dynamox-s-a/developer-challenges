import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.ts';

// O adapter é o "driver" que conecta o Prisma ao Postgres
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// Uma única instância do Prisma, reutilizada pela API inteira
export const prisma = new PrismaClient({ adapter });
import "dotenv/config.js";
import PrismaPkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const { PrismaClient } = PrismaPkg;

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not set. Create apps/backend/.env based on .env.example");
}

const pool = new Pool({ connectionString: url });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'VIEWER');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'VIEWER';

-- Preserva o comportamento existente: o único usuário até aqui é a credencial fixa de
-- demonstração, que administra os dados desde o início do projeto. O default da coluna é
-- VIEWER (menor privilégio) e vale para qualquer usuário criado a partir de agora; esta
-- linha promove apenas quem já existia antes da introdução dos perfis.
UPDATE "users" SET "role" = 'ADMIN';

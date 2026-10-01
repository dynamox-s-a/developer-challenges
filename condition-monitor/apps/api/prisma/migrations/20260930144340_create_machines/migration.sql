-- CreateEnum
CREATE TYPE "machine_type" AS ENUM ('FAN', 'PUMP');

-- CreateTable
CREATE TABLE "machines" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sector_id" UUID NOT NULL,
    "type" "machine_type" NOT NULL,
    "number" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "machines_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "machines_sector_id_type_number_key" ON "machines"("sector_id", "type", "number");

-- AddForeignKey
ALTER TABLE "machines" ADD CONSTRAINT "machines_sector_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "sectors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Written by hand: rules Prisma cannot express (ADR 0006).

-- The number completes the tag (B10): 1 to 999, padded to two digits when shown.
ALTER TABLE "machines" ADD CONSTRAINT "machines_number_range_check"
  CHECK (number BETWEEN 1 AND 999);

-- A free-text name (B2) of 1 to 100 characters, without spaces at either end. It may
-- repeat: the tag identifies the machine.
ALTER TABLE "machines" ADD CONSTRAINT "machines_name_check"
  CHECK (name = btrim(name) AND char_length(name) BETWEEN 1 AND 100);

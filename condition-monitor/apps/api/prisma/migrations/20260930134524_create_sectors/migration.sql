-- CreateTable
CREATE TABLE "sectors" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "owner_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "sectors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sectors_code_key" ON "sectors"("code");

-- CreateIndex
CREATE INDEX "sectors_owner_id_idx" ON "sectors"("owner_id");

-- AddForeignKey
ALTER TABLE "sectors" ADD CONSTRAINT "sectors_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Written by hand: rules Prisma cannot express (ADR 0006).

-- The code prefixes machine tags (B10): 2 to 10 uppercase letters or digits.
ALTER TABLE "sectors" ADD CONSTRAINT "sectors_code_format_check"
  CHECK (code ~ '^[A-Z0-9]{2,10}$');

-- A name is 1 to 100 characters, without spaces at either end.
ALTER TABLE "sectors" ADD CONSTRAINT "sectors_name_check"
  CHECK (name = btrim(name) AND char_length(name) BETWEEN 1 AND 100);

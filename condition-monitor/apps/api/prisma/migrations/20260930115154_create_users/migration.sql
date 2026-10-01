-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- Written by hand: rules Prisma cannot express (ADR 0006).

-- One address cannot exist twice with different casing or stray spaces.
ALTER TABLE "users" ADD CONSTRAINT "users_email_normalized_check"
  CHECK (email = lower(btrim(email)) AND email <> '');

-- Only a bcrypt hash is ever stored: a plain password written by mistake is rejected
-- by the database itself.
ALTER TABLE "users" ADD CONSTRAINT "users_password_hash_bcrypt_check"
  CHECK (password_hash ~ '^\$2[aby]\$[0-9]{2}\$[./A-Za-z0-9]{53}$');

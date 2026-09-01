-- AlterEnum
ALTER TYPE "PhysicalQuantity" ADD VALUE 'ROTATIONAL_SPEED';

-- AlterTable
ALTER TABLE "ingestion_cycles" ADD COLUMN     "payloadFingerprint" CHAR(64) NOT NULL,
ADD COLUMN     "timeSeriesIds" TEXT[],
ALTER COLUMN "idempotencyKey" SET DATA TYPE VARCHAR(128);

-- CreateIndex
CREATE UNIQUE INDEX "ingestion_cycles_payloadFingerprint_key" ON "ingestion_cycles"("payloadFingerprint");


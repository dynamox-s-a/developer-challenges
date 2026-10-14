-- DropIndex
DROP INDEX "Reading_monitoringPointId_timestamp_idx";

-- AlterTable
ALTER TABLE "Reading" DROP CONSTRAINT "Reading_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Reading_pkey" PRIMARY KEY ("monitoringPointId", "timestamp");

-- The quantity a reading measures is required and becomes part of the primary
-- key, but the rows already stored carry no quantity. Assigning one would
-- misrepresent them, so the existing readings are discarded instead. They were
-- leftover manual-test data; the seed creates no readings, so nothing the
-- application depends on is lost. This destructive step was approved before
-- the migration was written.
DELETE FROM "Reading";

-- CreateEnum
CREATE TYPE "MeasurementMetric" AS ENUM ('temperature', 'vibrationAccelerationRms', 'vibrationVelocityRms');

-- AlterTable
ALTER TABLE "Reading" DROP CONSTRAINT "Reading_pkey",
ADD COLUMN     "metric" "MeasurementMetric" NOT NULL,
ADD CONSTRAINT "Reading_pkey" PRIMARY KEY ("monitoringPointId", "metric", "timestamp");

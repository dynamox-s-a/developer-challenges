-- One reading per sensor and instant, so re-uploading a batch is idempotent
-- (POST /sensors/:id/readings uses ON CONFLICT DO NOTHING). The unique index
-- replaces the plain one and serves the same (sensorId, timestamp) queries.
-- Fails if duplicates already exist; the seed never creates them.

-- DropIndex
DROP INDEX "Reading_sensorId_timestamp_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Reading_sensorId_timestamp_key" ON "Reading"("sensorId", "timestamp");

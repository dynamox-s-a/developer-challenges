-- CreateTable
CREATE TABLE "telemetry_batches" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "sensorId" INTEGER NOT NULL,
    "intervalMinutes" INTEGER,
    "pointsCount" INTEGER NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fromTimestamp" TIMESTAMP(3),
    "toTimestamp" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "telemetry_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "telemetry_points" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "sensorId" INTEGER NOT NULL,
    "batchId" INTEGER,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "z" DOUBLE PRECISION NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "accelerationRms" DOUBLE PRECISION,
    "velocityRms" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "telemetry_points_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "telemetry_batches_uuid_key" ON "telemetry_batches"("uuid");

-- CreateIndex
CREATE INDEX "telemetry_batches_sensorId_idx" ON "telemetry_batches"("sensorId");

-- CreateIndex
CREATE UNIQUE INDEX "telemetry_points_uuid_key" ON "telemetry_points"("uuid");

-- CreateIndex
CREATE INDEX "telemetry_points_sensorId_timestamp_idx" ON "telemetry_points"("sensorId", "timestamp");

-- CreateIndex
CREATE INDEX "telemetry_points_batchId_idx" ON "telemetry_points"("batchId");

-- CreateIndex
CREATE UNIQUE INDEX "telemetry_points_sensorId_timestamp_key" ON "telemetry_points"("sensorId", "timestamp");

-- AddForeignKey
ALTER TABLE "telemetry_batches" ADD CONSTRAINT "telemetry_batches_sensorId_fkey" FOREIGN KEY ("sensorId") REFERENCES "sensors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "telemetry_points" ADD CONSTRAINT "telemetry_points_sensorId_fkey" FOREIGN KEY ("sensorId") REFERENCES "sensors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "telemetry_points" ADD CONSTRAINT "telemetry_points_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "telemetry_batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

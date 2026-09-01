-- CreateEnum
CREATE TYPE "MachineType" AS ENUM ('PUMP', 'FAN');

-- CreateEnum
CREATE TYPE "SensorModel" AS ENUM ('TC_AG', 'TC_AS', 'HF_PLUS');

-- CreateEnum
CREATE TYPE "PhysicalQuantity" AS ENUM ('ACCELERATION', 'VELOCITY', 'TEMPERATURE');

-- CreateEnum
CREATE TYPE "Axis" AS ENUM ('X', 'Y', 'Z', 'NONE');

-- CreateEnum
CREATE TYPE "IngestionOrigin" AS ENUM ('SIMULATION', 'ROSBAG_REPLAY', 'SEED', 'MANUAL');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "machines" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "MachineType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "machines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monitoring_points" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "externalResourceId" VARCHAR(24) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monitoring_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sensors" (
    "id" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "model" "SensorModel" NOT NULL,
    "monitoringPointId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sensors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "time_series" (
    "id" TEXT NOT NULL,
    "sensorId" TEXT NOT NULL,
    "physicalQuantity" "PhysicalQuantity" NOT NULL,
    "axis" "Axis" NOT NULL DEFAULT 'NONE',
    "unit" TEXT NOT NULL,
    "displayName" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "time_series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "time_series_samples" (
    "id" TEXT NOT NULL,
    "timeSeriesId" TEXT NOT NULL,
    "timestamp" TIMESTAMPTZ(3) NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "ingestionCycleId" TEXT,

    CONSTRAINT "time_series_samples_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingestion_cycles" (
    "id" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "cycleId" TEXT,
    "measuringSystemUid" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "modelVersion" DOUBLE PRECISION NOT NULL,
    "origin" "IngestionOrigin" NOT NULL,
    "tags" TEXT[],
    "metadata" JSONB NOT NULL,
    "configuration" JSONB NOT NULL,
    "measurementCount" INTEGER NOT NULL DEFAULT 0,
    "sampleCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ingestion_cycles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "machines_name_key" ON "machines"("name");

-- CreateIndex
CREATE UNIQUE INDEX "monitoring_points_externalResourceId_key" ON "monitoring_points"("externalResourceId");

-- CreateIndex
CREATE INDEX "monitoring_points_machineId_idx" ON "monitoring_points"("machineId");

-- CreateIndex
CREATE UNIQUE INDEX "monitoring_points_machineId_name_key" ON "monitoring_points"("machineId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "sensors_serialNumber_key" ON "sensors"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "sensors_monitoringPointId_key" ON "sensors"("monitoringPointId");

-- CreateIndex
CREATE INDEX "time_series_sensorId_idx" ON "time_series"("sensorId");

-- CreateIndex
CREATE UNIQUE INDEX "time_series_sensorId_physicalQuantity_axis_key" ON "time_series"("sensorId", "physicalQuantity", "axis");

-- CreateIndex
CREATE INDEX "time_series_samples_ingestionCycleId_idx" ON "time_series_samples"("ingestionCycleId");

-- CreateIndex
CREATE UNIQUE INDEX "time_series_samples_timeSeriesId_timestamp_key" ON "time_series_samples"("timeSeriesId", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "ingestion_cycles_idempotencyKey_key" ON "ingestion_cycles"("idempotencyKey");

-- CreateIndex
CREATE INDEX "ingestion_cycles_measuringSystemUid_createdAt_idx" ON "ingestion_cycles"("measuringSystemUid", "createdAt");

-- CreateIndex
CREATE INDEX "ingestion_cycles_cycleId_idx" ON "ingestion_cycles"("cycleId");

-- AddForeignKey
ALTER TABLE "monitoring_points" ADD CONSTRAINT "monitoring_points_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "machines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sensors" ADD CONSTRAINT "sensors_monitoringPointId_fkey" FOREIGN KEY ("monitoringPointId") REFERENCES "monitoring_points"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_series" ADD CONSTRAINT "time_series_sensorId_fkey" FOREIGN KEY ("sensorId") REFERENCES "sensors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_series_samples" ADD CONSTRAINT "time_series_samples_timeSeriesId_fkey" FOREIGN KEY ("timeSeriesId") REFERENCES "time_series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_series_samples" ADD CONSTRAINT "time_series_samples_ingestionCycleId_fkey" FOREIGN KEY ("ingestionCycleId") REFERENCES "ingestion_cycles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

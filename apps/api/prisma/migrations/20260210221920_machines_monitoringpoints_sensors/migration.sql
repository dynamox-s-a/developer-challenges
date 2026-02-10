-- CreateEnum
CREATE TYPE "MachineType" AS ENUM ('Pump', 'Fan');

-- CreateEnum
CREATE TYPE "SensorModel" AS ENUM ('TcAg', 'TcAs', 'HF_PLUS');

-- CreateTable
CREATE TABLE "machines" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "MachineType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "machines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monitoring_points" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "machineId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monitoring_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sensors" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "sensorId" TEXT NOT NULL,
    "model" "SensorModel" NOT NULL,
    "monitoringPointId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sensors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "machines_uuid_key" ON "machines"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "monitoring_points_uuid_key" ON "monitoring_points"("uuid");

-- CreateIndex
CREATE INDEX "monitoring_points_machineId_idx" ON "monitoring_points"("machineId");

-- CreateIndex
CREATE UNIQUE INDEX "sensors_uuid_key" ON "sensors"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "sensors_sensorId_key" ON "sensors"("sensorId");

-- CreateIndex
CREATE UNIQUE INDEX "sensors_monitoringPointId_key" ON "sensors"("monitoringPointId");

-- AddForeignKey
ALTER TABLE "monitoring_points" ADD CONSTRAINT "monitoring_points_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "machines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sensors" ADD CONSTRAINT "sensors_monitoringPointId_fkey" FOREIGN KEY ("monitoringPointId") REFERENCES "monitoring_points"("id") ON DELETE CASCADE ON UPDATE CASCADE;

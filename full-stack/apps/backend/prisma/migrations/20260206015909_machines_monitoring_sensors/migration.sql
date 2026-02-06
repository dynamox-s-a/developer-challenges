-- CreateEnum
CREATE TYPE "MachineType" AS ENUM ('Pump', 'Fan');

-- CreateEnum
CREATE TYPE "SensorModel" AS ENUM ('TcAg', 'TcAs', 'HF_plus');

-- CreateTable
CREATE TABLE "Machine" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "MachineType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Machine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonitoringPoint" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonitoringPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sensor" (
    "id" TEXT NOT NULL,
    "uniqueId" TEXT NOT NULL,
    "model" "SensorModel" NOT NULL,
    "monitoringPointId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sensor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Machine_type_idx" ON "Machine"("type");

-- CreateIndex
CREATE INDEX "Machine_name_idx" ON "Machine"("name");

-- CreateIndex
CREATE INDEX "MonitoringPoint_machineId_idx" ON "MonitoringPoint"("machineId");

-- CreateIndex
CREATE INDEX "MonitoringPoint_name_idx" ON "MonitoringPoint"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MonitoringPoint_machineId_name_key" ON "MonitoringPoint"("machineId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Sensor_uniqueId_key" ON "Sensor"("uniqueId");

-- CreateIndex
CREATE UNIQUE INDEX "Sensor_monitoringPointId_key" ON "Sensor"("monitoringPointId");

-- CreateIndex
CREATE INDEX "Sensor_model_idx" ON "Sensor"("model");

-- AddForeignKey
ALTER TABLE "MonitoringPoint" ADD CONSTRAINT "MonitoringPoint_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_monitoringPointId_fkey" FOREIGN KEY ("monitoringPointId") REFERENCES "MonitoringPoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

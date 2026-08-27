-- CreateEnum
CREATE TYPE "MachineType" AS ENUM ('Pump', 'Fan');

-- CreateEnum
CREATE TYPE "SensorModel" AS ENUM ('TcAg', 'TcAs', 'HF+');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

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
    "model" "SensorModel" NOT NULL,
    "monitoringPointId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sensor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SensorReading" (
    "id" TEXT NOT NULL,
    "monitoringPointId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SensorReading_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "MonitoringPoint_machineId_idx" ON "MonitoringPoint"("machineId");

-- CreateIndex
CREATE UNIQUE INDEX "Sensor_monitoringPointId_key" ON "Sensor"("monitoringPointId");

-- CreateIndex
CREATE INDEX "SensorReading_monitoringPointId_timestamp_idx" ON "SensorReading"("monitoringPointId", "timestamp");

-- CreateIndex
CREATE INDEX "SensorReading_timestamp_idx" ON "SensorReading"("timestamp");

-- AddForeignKey
ALTER TABLE "MonitoringPoint" ADD CONSTRAINT "MonitoringPoint_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_monitoringPointId_fkey" FOREIGN KEY ("monitoringPointId") REFERENCES "MonitoringPoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SensorReading" ADD CONSTRAINT "SensorReading_monitoringPointId_fkey" FOREIGN KEY ("monitoringPointId") REFERENCES "MonitoringPoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

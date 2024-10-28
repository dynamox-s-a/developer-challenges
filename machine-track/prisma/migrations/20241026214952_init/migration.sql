-- CreateEnum
CREATE TYPE "modelName" AS ENUM ('TcAg', 'TcAs', 'HFPlus');

-- CreateTable
CREATE TABLE "MonitoringPoint" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "machineId" INTEGER NOT NULL,

    CONSTRAINT "MonitoringPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sensor" (
    "id" SERIAL NOT NULL,
    "uniqueId" TEXT NOT NULL,
    "modelName" "modelName" NOT NULL,
    "monitoringPointId" INTEGER NOT NULL,

    CONSTRAINT "Sensor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sensor_uniqueId_key" ON "Sensor"("uniqueId");

-- AddForeignKey
ALTER TABLE "MonitoringPoint" ADD CONSTRAINT "MonitoringPoint_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_monitoringPointId_fkey" FOREIGN KEY ("monitoringPointId") REFERENCES "MonitoringPoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

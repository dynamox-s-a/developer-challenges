-- CreateTable
CREATE TABLE "Machine" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Machine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonitoringPoint" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "machineId" INTEGER NOT NULL,
    "sensorId" INTEGER,

    CONSTRAINT "MonitoringPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sensor" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,

    CONSTRAINT "Sensor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Machine_uuid_key" ON "Machine"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "MonitoringPoint_uuid_key" ON "MonitoringPoint"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "MonitoringPoint_sensorId_key" ON "MonitoringPoint"("sensorId");

-- CreateIndex
CREATE UNIQUE INDEX "Sensor_uuid_key" ON "Sensor"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Sensor_modelName_key" ON "Sensor"("modelName");

-- AddForeignKey
ALTER TABLE "MonitoringPoint" ADD CONSTRAINT "MonitoringPoint_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonitoringPoint" ADD CONSTRAINT "MonitoringPoint_sensorId_fkey" FOREIGN KEY ("sensorId") REFERENCES "Sensor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

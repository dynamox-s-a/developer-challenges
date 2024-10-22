-- CreateTable
CREATE TABLE "Sensor" (
    "idSensor" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "pointId" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Sensor_pkey" PRIMARY KEY ("idSensor")
);

-- CreateTable
CREATE TABLE "DataSensor" (
    "sensorId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" INTEGER NOT NULL,

    CONSTRAINT "DataSensor_pkey" PRIMARY KEY ("timestamp","sensorId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sensor_idSensor_key" ON "Sensor"("idSensor");

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_pointId_machineId_fkey" FOREIGN KEY ("pointId", "machineId") REFERENCES "MonitoringPoint"("idPoint", "machineId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataSensor" ADD CONSTRAINT "DataSensor_sensorId_fkey" FOREIGN KEY ("sensorId") REFERENCES "Sensor"("idSensor") ON DELETE RESTRICT ON UPDATE CASCADE;

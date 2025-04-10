-- DropForeignKey
ALTER TABLE "Sensor" DROP CONSTRAINT "Sensor_monitoringPointId_fkey";

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_monitoringPointId_fkey" FOREIGN KEY ("monitoringPointId") REFERENCES "MonitoringPoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

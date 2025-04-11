-- DropForeignKey
ALTER TABLE "Sensor" DROP CONSTRAINT "Sensor_monitoringPointId_fkey";

-- AlterTable
ALTER TABLE "Sensor" ALTER COLUMN "monitoringPointId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_monitoringPointId_fkey" FOREIGN KEY ("monitoringPointId") REFERENCES "MonitoringPoint"("id") ON DELETE SET NULL ON UPDATE CASCADE;

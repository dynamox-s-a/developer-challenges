-- DropForeignKey
ALTER TABLE "MonitoringPoint" DROP CONSTRAINT "MonitoringPoint_machineId_fkey";

-- AddForeignKey
ALTER TABLE "MonitoringPoint" ADD CONSTRAINT "MonitoringPoint_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

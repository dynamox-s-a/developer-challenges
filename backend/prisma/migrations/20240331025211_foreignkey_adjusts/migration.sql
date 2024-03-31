/*
  Warnings:

  - You are about to drop the column `machineId` on the `Machine_Type` table. All the data in the column will be lost.
  - You are about to drop the column `monitoringPointId` on the `Sensor` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[machineTypeId]` on the table `Machine` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sensorId]` on the table `Monitoring_Point` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `machineTypeId` to the `Machine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sensorId` to the `Monitoring_Point` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Machine_Type" DROP CONSTRAINT "Machine_Type_machineId_fkey";

-- DropForeignKey
ALTER TABLE "Sensor" DROP CONSTRAINT "Sensor_monitoringPointId_fkey";

-- DropIndex
DROP INDEX "Machine_Type_machineId_key";

-- DropIndex
DROP INDEX "Sensor_monitoringPointId_key";

-- AlterTable
ALTER TABLE "Machine" ADD COLUMN     "machineTypeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Machine_Type" DROP COLUMN "machineId";

-- AlterTable
ALTER TABLE "Monitoring_Point" ADD COLUMN     "sensorId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Sensor" DROP COLUMN "monitoringPointId";

-- CreateIndex
CREATE UNIQUE INDEX "Machine_machineTypeId_key" ON "Machine"("machineTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "Monitoring_Point_sensorId_key" ON "Monitoring_Point"("sensorId");

-- AddForeignKey
ALTER TABLE "Machine" ADD CONSTRAINT "Machine_machineTypeId_fkey" FOREIGN KEY ("machineTypeId") REFERENCES "Machine_Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Monitoring_Point" ADD CONSTRAINT "Monitoring_Point_sensorId_fkey" FOREIGN KEY ("sensorId") REFERENCES "Sensor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

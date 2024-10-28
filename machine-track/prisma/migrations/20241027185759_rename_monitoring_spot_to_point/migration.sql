/*
  Warnings:

  - You are about to drop the column `monitoringSpotId` on the `Sensor` table. All the data in the column will be lost.
  - You are about to drop the `MonitoringSpot` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `monitoringPointId` to the `Sensor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MonitoringSpot" DROP CONSTRAINT "MonitoringSpot_machineId_fkey";

-- DropForeignKey
ALTER TABLE "Sensor" DROP CONSTRAINT "Sensor_monitoringSpotId_fkey";

-- AlterTable
ALTER TABLE "Sensor" DROP COLUMN "monitoringSpotId",
ADD COLUMN     "monitoringPointId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "MonitoringSpot";

-- CreateTable
CREATE TABLE "MonitoringPoint" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "machineId" INTEGER NOT NULL,

    CONSTRAINT "MonitoringPoint_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MonitoringPoint" ADD CONSTRAINT "MonitoringPoint_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_monitoringPointId_fkey" FOREIGN KEY ("monitoringPointId") REFERENCES "MonitoringPoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `monitoringPointId` on the `Sensor` table. All the data in the column will be lost.
  - You are about to drop the `MonitoringPoint` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `monitoringSpotId` to the `Sensor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MonitoringPoint" DROP CONSTRAINT "MonitoringPoint_machineId_fkey";

-- DropForeignKey
ALTER TABLE "Sensor" DROP CONSTRAINT "Sensor_monitoringPointId_fkey";

-- AlterTable
ALTER TABLE "Sensor" DROP COLUMN "monitoringPointId",
ADD COLUMN     "monitoringSpotId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "MonitoringPoint";

-- CreateTable
CREATE TABLE "MonitoringSpot" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "machineId" INTEGER NOT NULL,

    CONSTRAINT "MonitoringSpot_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MonitoringSpot" ADD CONSTRAINT "MonitoringSpot_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_monitoringSpotId_fkey" FOREIGN KEY ("monitoringSpotId") REFERENCES "MonitoringSpot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

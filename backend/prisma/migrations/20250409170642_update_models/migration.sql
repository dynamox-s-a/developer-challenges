/*
  Warnings:

  - You are about to drop the column `machineId` on the `Sensor` table. All the data in the column will be lost.
  - You are about to drop the column `monitoringPoint` on the `Sensor` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[monitoringPointId]` on the table `Sensor` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `type` on the `Machine` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `monitoringPointId` to the `Sensor` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `model` on the `Sensor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MachineType" AS ENUM ('Pump', 'Fan');

-- CreateEnum
CREATE TYPE "SensorModel" AS ENUM ('TcAg', 'TcAs', 'HFPlus');

-- DropForeignKey
ALTER TABLE "Sensor" DROP CONSTRAINT "Sensor_machineId_fkey";

-- AlterTable
ALTER TABLE "Machine" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "type",
ADD COLUMN     "type" "MachineType" NOT NULL;

-- AlterTable
ALTER TABLE "Sensor" DROP COLUMN "machineId",
DROP COLUMN "monitoringPoint",
ADD COLUMN     "monitoringPointId" INTEGER NOT NULL,
DROP COLUMN "model",
ADD COLUMN     "model" "SensorModel" NOT NULL;

-- CreateTable
CREATE TABLE "MonitoringPoint" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "machineId" INTEGER NOT NULL,

    CONSTRAINT "MonitoringPoint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sensor_monitoringPointId_key" ON "Sensor"("monitoringPointId");

-- AddForeignKey
ALTER TABLE "MonitoringPoint" ADD CONSTRAINT "MonitoringPoint_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_monitoringPointId_fkey" FOREIGN KEY ("monitoringPointId") REFERENCES "MonitoringPoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `sensor` on the `MonitoringPoint` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Machine` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `MonitoringPoint` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sensorId` to the `MonitoringPoint` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MonitoringPoint" DROP COLUMN "sensor",
ADD COLUMN     "sensorId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Sensor" (
    "id" SERIAL NOT NULL,
    "model" TEXT NOT NULL,

    CONSTRAINT "Sensor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sensor_model_key" ON "Sensor"("model");

-- CreateIndex
CREATE UNIQUE INDEX "Machine_name_key" ON "Machine"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MonitoringPoint_name_key" ON "MonitoringPoint"("name");

-- AddForeignKey
ALTER TABLE "MonitoringPoint" ADD CONSTRAINT "MonitoringPoint_sensorId_fkey" FOREIGN KEY ("sensorId") REFERENCES "Sensor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

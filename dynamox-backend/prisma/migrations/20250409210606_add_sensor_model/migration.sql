/*
  Warnings:

  - Added the required column `sensorModel` to the `MonitoringPoint` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MonitoringPoint" ADD COLUMN     "sensorModel" "SensorModel" NOT NULL;

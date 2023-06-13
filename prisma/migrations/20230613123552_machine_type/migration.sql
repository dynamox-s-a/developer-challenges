/*
  Warnings:

  - Added the required column `machineTitle` to the `MonitoringPoint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `machineType` to the `MonitoringPoint` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MonitoringPoint" ADD COLUMN     "machineTitle" TEXT NOT NULL,
ADD COLUMN     "machineType" TEXT NOT NULL;

/*
  Warnings:

  - You are about to drop the column `velocityRms` on the `telemetry_points` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "telemetry_points" DROP COLUMN "velocityRms";

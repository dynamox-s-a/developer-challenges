/*
  Warnings:

  - You are about to drop the column `monitoring_point` on the `Sensor` table. All the data in the column will be lost.
  - Added the required column `monitoring_point_id` to the `Sensor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sensor" DROP COLUMN "monitoring_point",
ADD COLUMN     "monitoring_point_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "MonitoringPoint" (
    "monitoring_point_id" SERIAL NOT NULL,
    "machine_id" INTEGER NOT NULL,
    "monitoring_point_name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonitoringPoint_pkey" PRIMARY KEY ("monitoring_point_id")
);

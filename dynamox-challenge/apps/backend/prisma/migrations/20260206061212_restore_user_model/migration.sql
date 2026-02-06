/*
  Warnings:

  - The primary key for the `Machine` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Machine` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `MonitoringPoint` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `MonitoringPoint` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `machineId` on the `MonitoringPoint` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SensorModel" AS ENUM ('TcAg', 'TcAs', 'HF_PLUS');

-- DropForeignKey
ALTER TABLE "MonitoringPoint" DROP CONSTRAINT "MonitoringPoint_machineId_fkey";

-- AlterTable
ALTER TABLE "Machine" DROP CONSTRAINT "Machine_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Machine_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "MonitoringPoint" DROP CONSTRAINT "MonitoringPoint_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "machineId",
ADD COLUMN     "machineId" INTEGER NOT NULL,
ADD CONSTRAINT "MonitoringPoint_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sensor" (
    "id" SERIAL NOT NULL,
    "model" "SensorModel" NOT NULL,
    "monitoringPointId" INTEGER NOT NULL,

    CONSTRAINT "Sensor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "MonitoringPoint" ADD CONSTRAINT "MonitoringPoint_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_monitoringPointId_fkey" FOREIGN KEY ("monitoringPointId") REFERENCES "MonitoringPoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

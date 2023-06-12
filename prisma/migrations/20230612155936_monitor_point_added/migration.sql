/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Made the column `type` on table `Machine` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Machine" ALTER COLUMN "type" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name";

-- CreateTable
CREATE TABLE "MonitoringPoint" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "sensor" TEXT NOT NULL,
    "machineId" INTEGER NOT NULL,

    CONSTRAINT "MonitoringPoint_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MonitoringPoint" ADD CONSTRAINT "MonitoringPoint_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

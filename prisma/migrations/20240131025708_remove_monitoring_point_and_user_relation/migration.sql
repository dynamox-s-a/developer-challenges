/*
  Warnings:

  - You are about to drop the column `userId` on the `MonitoringPoint` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "MonitoringPoint" DROP CONSTRAINT "MonitoringPoint_userId_fkey";

-- AlterTable
ALTER TABLE "MonitoringPoint" DROP COLUMN "userId";

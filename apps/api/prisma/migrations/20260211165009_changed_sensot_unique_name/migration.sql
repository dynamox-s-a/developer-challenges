/*
  Warnings:

  - You are about to drop the column `sensorId` on the `sensors` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sensorUniqueId]` on the table `sensors` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sensorUniqueId` to the `sensors` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "sensors_sensorId_key";

-- AlterTable
ALTER TABLE "sensors" DROP COLUMN "sensorId",
ADD COLUMN     "sensorUniqueId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "sensors_sensorUniqueId_key" ON "sensors"("sensorUniqueId");

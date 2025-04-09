/*
  Warnings:

  - Changed the type of `model` on the `Sensor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SensorModel" AS ENUM ('TcAg', 'TcAs', 'HF_Plus');

-- AlterTable
ALTER TABLE "Sensor" DROP COLUMN "model";
ALTER TABLE "Sensor" ADD COLUMN "model" "SensorModel" NOT NULL;
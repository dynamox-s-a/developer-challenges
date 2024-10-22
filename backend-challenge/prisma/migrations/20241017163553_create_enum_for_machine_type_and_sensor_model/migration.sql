/*
  Warnings:

  - Changed the type of `type` on the `Machine` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `model` on the `Sensor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MachineType" AS ENUM ('Pump', 'Fan');

-- CreateEnum
CREATE TYPE "SensorModel" AS ENUM ('TcAg', 'TcAs', 'HFPlus');

-- AlterTable
ALTER TABLE "Machine" DROP COLUMN "type",
ADD COLUMN     "type" "MachineType" NOT NULL;

-- AlterTable
ALTER TABLE "Sensor" DROP COLUMN "model",
ADD COLUMN     "model" "SensorModel" NOT NULL;

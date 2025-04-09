/*
  Warnings:

  - The values [HF_Plus] on the enum `SensorModel` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SensorModel_new" AS ENUM ('TcAg', 'TcAs', 'HF+');
ALTER TABLE "Sensor" ALTER COLUMN "model" TYPE "SensorModel_new" USING ("model"::text::"SensorModel_new");
ALTER TYPE "SensorModel" RENAME TO "SensorModel_old";
ALTER TYPE "SensorModel_new" RENAME TO "SensorModel";
DROP TYPE "SensorModel_old";
COMMIT;

-- PostgreSQL sorts enum columns by declaration order, not alphabetically, so
-- ORDER BY "type" put Pump before Fan. Recreate both enums in alphabetical
-- order. Values are unchanged, so existing rows convert through text.

-- MachineType: (Pump, Fan) -> (Fan, Pump)
ALTER TYPE "MachineType" RENAME TO "MachineType_old";
CREATE TYPE "MachineType" AS ENUM ('Fan', 'Pump');
ALTER TABLE "Machine"
  ALTER COLUMN "type" TYPE "MachineType" USING "type"::text::"MachineType";
DROP TYPE "MachineType_old";

-- SensorModel: (TcAg, TcAs, HFPlus) -> (HFPlus, TcAg, TcAs)
ALTER TYPE "SensorModel" RENAME TO "SensorModel_old";
CREATE TYPE "SensorModel" AS ENUM ('HFPlus', 'TcAg', 'TcAs');
ALTER TABLE "Sensor"
  ALTER COLUMN "model" TYPE "SensorModel" USING "model"::text::"SensorModel";
DROP TYPE "SensorModel_old";

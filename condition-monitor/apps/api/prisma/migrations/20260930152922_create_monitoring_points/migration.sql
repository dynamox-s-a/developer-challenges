-- CreateEnum
CREATE TYPE "location" AS ENUM ('PUMP_MOTOR_NDE', 'PUMP_MOTOR_DE', 'PUMP_COUPLING_SIDE', 'PUMP_IMPELLER_SIDE', 'PUMP_MECHANICAL_SEAL', 'FAN_MOTOR_NDE', 'FAN_MOTOR_DE', 'FAN_SHAFT_DE', 'FAN_SHAFT_NDE', 'OTHER');

-- CreateTable
CREATE TABLE "monitoring_points" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "machine_id" UUID NOT NULL,
    "machine_type" "machine_type" NOT NULL,
    "location" "location" NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "monitoring_points_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "monitoring_points_machine_id_idx" ON "monitoring_points"("machine_id");

-- CreateIndex
CREATE UNIQUE INDEX "machines_id_type_key" ON "machines"("id", "type");

-- AddForeignKey
ALTER TABLE "monitoring_points" ADD CONSTRAINT "monitoring_points_machine_id_machine_type_fkey" FOREIGN KEY ("machine_id", "machine_type") REFERENCES "machines"("id", "type") ON DELETE CASCADE ON UPDATE CASCADE;

-- Written by hand: rules Prisma cannot express (ADR 0006).

-- A position belongs to its machine type (B11); OTHER fits both. machine_type is the copy
-- the composite foreign key keeps equal to the machine's type, so changing a machine to
-- the other type cascades here and fails this check while a position of the old type
-- remains (B5).
ALTER TABLE "monitoring_points" ADD CONSTRAINT "monitoring_points_location_type_check"
  CHECK (
    location = 'OTHER'
    OR (machine_type = 'PUMP' AND location IN (
      'PUMP_MOTOR_NDE', 'PUMP_MOTOR_DE', 'PUMP_COUPLING_SIDE',
      'PUMP_IMPELLER_SIDE', 'PUMP_MECHANICAL_SEAL'))
    OR (machine_type = 'FAN' AND location IN (
      'FAN_MOTOR_NDE', 'FAN_MOTOR_DE', 'FAN_SHAFT_DE', 'FAN_SHAFT_NDE'))
  );

-- One sensor spot per bearing: a position is unique per machine, except OTHER (B11).
CREATE UNIQUE INDEX "monitoring_points_machine_location_key"
  ON "monitoring_points" ("machine_id", "location")
  WHERE location <> 'OTHER';

-- A free-text name (B2) of 1 to 100 characters, without spaces at either end.
ALTER TABLE "monitoring_points" ADD CONSTRAINT "monitoring_points_name_check"
  CHECK (name = btrim(name) AND char_length(name) BETWEEN 1 AND 100);

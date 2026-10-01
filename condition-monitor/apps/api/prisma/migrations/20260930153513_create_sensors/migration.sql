-- CreateEnum
CREATE TYPE "sensor_model" AS ENUM ('HF_PLUS', 'TC_AG', 'TC_AS');

-- CreateTable
CREATE TABLE "sensors" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "monitoring_point_id" UUID NOT NULL,
    "machine_type" "machine_type" NOT NULL,
    "serial_number" TEXT NOT NULL,
    "model" "sensor_model" NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "sensors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sensors_monitoring_point_id_key" ON "sensors"("monitoring_point_id");

-- CreateIndex
CREATE UNIQUE INDEX "sensors_serial_number_key" ON "sensors"("serial_number");

-- CreateIndex
CREATE UNIQUE INDEX "sensors_monitoring_point_id_machine_type_key" ON "sensors"("monitoring_point_id", "machine_type");

-- CreateIndex
CREATE UNIQUE INDEX "monitoring_points_id_machine_type_key" ON "monitoring_points"("id", "machine_type");

-- AddForeignKey
ALTER TABLE "sensors" ADD CONSTRAINT "sensors_monitoring_point_id_machine_type_fkey" FOREIGN KEY ("monitoring_point_id", "machine_type") REFERENCES "monitoring_points"("id", "machine_type") ON DELETE CASCADE ON UPDATE CASCADE;

-- Written by hand: rules Prisma cannot express (ADR 0006).

-- The challenge rule: no TcAg or TcAs sensor on a pump (B15). machine_type is the copy
-- the composite foreign keys keep equal to the machine's type, so turning a machine into
-- a pump cascades here and fails while such a sensor remains (B5).
ALTER TABLE "sensors" ADD CONSTRAINT "sensors_pump_model_check"
  CHECK (NOT (machine_type = 'PUMP' AND model IN ('TC_AG', 'TC_AS')));

-- A serial number as printed on the sensor label: 3 to 40 uppercase letters, digits or
-- hyphens (B4). The API uppercases what is typed, so dx-0012 and DX-0012 are one sensor.
ALTER TABLE "sensors" ADD CONSTRAINT "sensors_serial_number_format_check"
  CHECK (serial_number ~ '^[A-Z0-9-]{3,40}$');

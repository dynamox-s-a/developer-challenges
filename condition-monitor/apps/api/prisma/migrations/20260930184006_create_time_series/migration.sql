-- CreateEnum
CREATE TYPE "quantity" AS ENUM ('ACCELERATION_RMS', 'VELOCITY_RMS', 'TEMPERATURE');

-- CreateEnum
CREATE TYPE "axis" AS ENUM ('H', 'V', 'A');

-- CreateTable
CREATE TABLE "time_series" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "monitoring_point_id" UUID NOT NULL,
    "quantity" "quantity" NOT NULL,
    "axis" "axis",
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "time_series_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "time_series" ADD CONSTRAINT "time_series_monitoring_point_id_fkey" FOREIGN KEY ("monitoring_point_id") REFERENCES "monitoring_points"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Written by hand: rules Prisma cannot express (ADR 0006).

-- One series per point, quantity and axis (C1). NULLS NOT DISTINCT makes two
-- temperature series on the same point collide, although both axes are null. The
-- leading column also serves the foreign key when a point is deleted.
CREATE UNIQUE INDEX "time_series_point_quantity_axis_key"
  ON "time_series" ("monitoring_point_id", "quantity", "axis") NULLS NOT DISTINCT;

-- Temperature has no direction; vibration always has one (C10). A null axis means
-- "no direction", never "unknown direction".
ALTER TABLE "time_series" ADD CONSTRAINT "time_series_axis_check"
  CHECK ((quantity = 'TEMPERATURE') = (axis IS NULL));

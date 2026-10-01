-- CreateTable
CREATE TABLE "readings" (
    "series_id" UUID NOT NULL,
    "timestamp" TIMESTAMPTZ(3) NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "readings_pkey" PRIMARY KEY ("series_id","timestamp")
);

-- AddForeignKey
ALTER TABLE "readings" ADD CONSTRAINT "readings_series_id_fkey" FOREIGN KEY ("series_id") REFERENCES "time_series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Written by hand: rules Prisma cannot express (ADR 0006).

-- A reading is a measurement, so it is a finite number (C4). PostgreSQL accepts NaN
-- and the infinities in a double precision column; this refuses them.
ALTER TABLE "readings" ADD CONSTRAINT "readings_value_finite_check"
  CHECK (value NOT IN ('NaN'::float8, 'Infinity'::float8, '-Infinity'::float8));

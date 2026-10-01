-- AlterTable
ALTER TABLE "time_series" ADD COLUMN     "reading_count" INTEGER NOT NULL DEFAULT 0;

-- Written by hand: rules Prisma cannot express (ADR 0006).

-- A count of readings is never negative.
ALTER TABLE "time_series" ADD CONSTRAINT "time_series_reading_count_check"
  CHECK (reading_count >= 0);

-- The count follows every insert and delete of readings, whoever makes it: the API,
-- psql or a test. Triggers run once per statement, over the rows the statement actually
-- changed, so a repeated reading skipped by ON CONFLICT DO NOTHING is not counted.
-- Each UPDATE locks the series row: concurrent increments queue instead of being lost.
CREATE FUNCTION count_inserted_readings() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  UPDATE time_series AS t
     SET reading_count = t.reading_count + added.n
    FROM (SELECT series_id, count(*)::int AS n FROM inserted GROUP BY series_id) AS added
   WHERE t.id = added.series_id;
  RETURN NULL;
END
$$;

CREATE FUNCTION count_deleted_readings() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  -- A series deleted with its readings is already gone and matches nothing here.
  UPDATE time_series AS t
     SET reading_count = t.reading_count - removed.n
    FROM (SELECT series_id, count(*)::int AS n FROM deleted GROUP BY series_id) AS removed
   WHERE t.id = removed.series_id;
  RETURN NULL;
END
$$;

CREATE TRIGGER readings_count_inserted
  AFTER INSERT ON "readings"
  REFERENCING NEW TABLE AS inserted
  FOR EACH STATEMENT EXECUTE FUNCTION count_inserted_readings();

CREATE TRIGGER readings_count_deleted
  AFTER DELETE ON "readings"
  REFERENCING OLD TABLE AS deleted
  FOR EACH STATEMENT EXECUTE FUNCTION count_deleted_readings();

-- Series stored before this migration start from their real count.
UPDATE "time_series" AS t
   SET reading_count = (SELECT count(*) FROM "readings" AS r WHERE r.series_id = t.id);

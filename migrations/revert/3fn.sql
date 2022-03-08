-- Revert oparc:3fn from pg

BEGIN;

ALTER TABLE "event"
    ADD COLUMN closing_hour TIME;

UPDATE "event" SET closing_hour = opening_hour + open_duration;

ALTER TABLE "event"
    ALTER COLUMN closing_hour SET NOT NULL;

ALTER TABLE "event"
    DROP COLUMN open_duration;

COMMIT;

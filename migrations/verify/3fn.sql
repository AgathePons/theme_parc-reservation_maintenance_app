-- Verify oparc:3fn on pg

BEGIN;

SELECT open_duration FROM "event" WHERE false;

ROLLBACK;

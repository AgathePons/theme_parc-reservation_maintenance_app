-- Verify oparc:opened_events on pg

BEGIN;

SELECT * FROM opened_events WHERE false;

ROLLBACK;

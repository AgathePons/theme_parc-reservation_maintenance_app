-- Verify oparc:init on pg

BEGIN;

SELECT id FROM "event" WHERE false;
SELECT id FROM visitor WHERE false;
SELECT id FROM booking WHERE false;
SELECT id FROM incident WHERE false;

ROLLBACK;

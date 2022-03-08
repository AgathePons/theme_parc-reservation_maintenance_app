-- Verify oparc:incident_event on pg

BEGIN;

SELECT * FROM incident_events WHERE false;

ROLLBACK;

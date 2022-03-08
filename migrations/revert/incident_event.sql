-- Revert oparc:incident_event from pg

BEGIN;

DROP VIEW incident_events;

COMMIT;

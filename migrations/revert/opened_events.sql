-- Revert oparc:opened_events from pg

BEGIN;

DROP VIEW opened_events;

COMMIT;

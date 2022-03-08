-- Revert oparc:opened_attractions_view from pg
BEGIN;

DROP VIEW opened_attraction;

DROP FUNCTION isItOpen;

DROP FUNCTION isItNotUnderMaintenance;

COMMIT;
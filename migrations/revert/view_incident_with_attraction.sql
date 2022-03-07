-- Revert oparc:view_incident_with_attraction from pg

BEGIN;

DROP VIEW IF EXISTS incident_with_attraction;

COMMIT;

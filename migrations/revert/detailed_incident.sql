-- Revert oparc:detailed_incident from pg

BEGIN;

DROP VIEW detailed_incident;

COMMIT;

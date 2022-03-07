-- Verify oparc:view_incident_with_attraction on pg

BEGIN;

SELECT * FROM incident_with_attraction WHERE false;

ROLLBACK;

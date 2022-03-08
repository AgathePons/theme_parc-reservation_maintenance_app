-- Verify oparc:detailed_incident on pg

BEGIN;

SELECT event_name FROM detailed_incident WHERE false;

ROLLBACK;

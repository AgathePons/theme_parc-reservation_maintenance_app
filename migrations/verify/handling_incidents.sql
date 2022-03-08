-- Verify oparc:handling_incidents on pg

BEGIN;

SELECT comments FROM detailed_incident WHERE false;

ROLLBACK;

-- Revert oparc:new_incident from pg

BEGIN;

DROP FUNCTION new_incident_with_comment(json);

DROP FUNCTION new_incident(json);

DROP FUNCTION clean_bookings(int);

COMMIT;

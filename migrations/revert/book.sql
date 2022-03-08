-- Revert oparc:book from pg

BEGIN;

DROP FUNCTION new_booking(json);
DROP FUNCTION next_ride(json);

COMMIT;

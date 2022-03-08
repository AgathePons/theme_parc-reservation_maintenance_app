-- Revert oparc:modify_event from pg

BEGIN;

DROP FUNCTION modify_event(json);

DROP FUNCTION clean_bookings(json);

COMMIT;

-- Revert oparc:init from pg

BEGIN;

DROP TABLE incident, booking, visitor, "event";

DROP DOMAIN posint;

COMMIT;

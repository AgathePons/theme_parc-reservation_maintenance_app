-- Revert oparc:init from pg

BEGIN;

DROP TABLE attraction_has_visitor, incident, visitor, attraction;

COMMIT;

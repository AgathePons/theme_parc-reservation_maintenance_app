-- Revert oparc:check_max_number_place from pg

BEGIN;

ALTER TABLE attraction_has_visitor
DROP CONSTRAINT number_max_places;

COMMIT;

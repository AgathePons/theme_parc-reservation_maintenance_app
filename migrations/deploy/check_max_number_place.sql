-- Deploy oparc:check_max_number_place to pg

BEGIN;

ALTER TABLE attraction_has_visitor
ADD CONSTRAINT number_max_places
CHECK (
  number_places <= 4
);


COMMIT;

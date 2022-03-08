-- Revert oparc:identified_visitor from pg

BEGIN;

DROP VIEW identified_visitor;

COMMIT;

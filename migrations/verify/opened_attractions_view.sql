-- Verify oparc:opened_attractions_view on pg

BEGIN;

SELECT * FROM opened_attraction WHERE false;

ROLLBACK;

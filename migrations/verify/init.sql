-- Verify oparc:init on pg

BEGIN;

-- XXX Add verifications here.
SELECT * FROM attraction, visitor, incident, attraction_has_visitor WHERE false;


ROLLBACK;

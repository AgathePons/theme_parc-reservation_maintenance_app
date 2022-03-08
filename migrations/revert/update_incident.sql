-- Revert oparc:update_incident from pg

BEGIN;

DROP FUNCTION update_incident(json), update_incident_with_comment(json);

COMMIT;

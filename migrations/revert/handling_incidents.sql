-- Revert oparc:handling_incidents from pg

BEGIN;

DROP VIEW detailed_incident;

CREATE VIEW detailed_incident AS
SELECT 
    incident.*, 
    (SELECT public_name FROM event WHERE id=incident.event_id) AS event_name
FROM incident 
WHERE close_date IS NULL 
ORDER BY open_date;

DROP TABLE comment;

COMMIT;

-- Deploy oparc:view_incident_with_attraction to pg

BEGIN;

CREATE VIEW incident_with_attraction AS
SELECT incident.*, attraction.name AS attraction
FROM incident
JOIN attraction ON attraction.id=incident.attraction_id;

COMMIT;

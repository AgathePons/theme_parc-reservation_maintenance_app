-- Deploy oparc:incident_event to pg

BEGIN;

-- création d'une vue pour que les techniciens aient accès aux infos nécessaires des attractions (on anticipe l'ACL !)

CREATE VIEW incident_events AS
SELECT id, public_name AS name, opening_hour, opening_hour+open_duration AS closing_hour FROM "event"
WHERE id NOT IN (
    SELECT event_id FROM incident WHERE close_date IS NULL
) ORDER BY id;

COMMIT;

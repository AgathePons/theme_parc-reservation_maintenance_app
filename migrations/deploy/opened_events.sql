-- Deploy oparc:opened_events to pg

BEGIN;

CREATE VIEW opened_events AS
SELECT 
    "event".*, 
    -- on calcule l'heure de fermeture
    opening_hour + open_duration AS closing_hour,
    (
        -- l'attraction est ouverte sur une journée
        now() > current_date + opening_hour 
        AND now() < current_date + opening_hour + open_duration
    
    OR
        -- l'attraction (nocturne) est ouverte sur 2 jours
        now() > current_date - '24 hours'::interval + opening_hour 
        AND now() < current_date - '24 hours'::interval + opening_hour + open_duration
    ) AS "open"
FROM "event"
WHERE "event".id NOT IN (
    -- on exclut les attractions ayant un incident ouvert
    SELECT DISTINCT event_id FROM incident
    WHERE close_date IS NULL
);

COMMIT;

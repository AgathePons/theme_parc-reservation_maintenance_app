-- Deploy oparc:book to pg

BEGIN;

-- prochain créneau disponible
-- json
-- {
--    visitorId
--    eventId
--    nbPlaces
--    validity_start
--    validity_end
-- }
CREATE FUNCTION next_ride(json) RETURNS timestamptz AS $$
    SELECT
        y.time::timestamptz
    FROM event
    CROSS JOIN generate_series(
        ($1->>'validity_start')::date, ($1->>'validity_end')::date, '1 day'
    ) d (day) -- on génère les dates pour chaque jour de validité du ticket
    CROSS JOIN generate_series(
        d.day + event.opening_hour,
        d.day + event.opening_hour + event.open_duration - '1 second'::interval,
        event.duration) y (time) -- pour chaque jour, tous les horaires de l'attraction
    WHERE id = ($1->>'eventId')::int AND y.time > now() -- tout ça pour filtrer et ne garder que les horaires futurs
    -- on limite aux dates de validité du billet
    AND y.time >= ($1->>'validity_start')::timestamptz AND y.time <= ($1->>'validity_end')::timestamptz
    -- la réservation n'est possible que si la capacité max n'est pas atteinte
    AND capacity >= COALESCE((SELECT SUM(places) FROM booking WHERE scheduled_time=y.time AND event_id=($1->>'eventId')::int) + ($1->>'nbPlaces')::int, 0)
    ORDER BY y.time
    LIMIT 1;  -- ORDER + LIMIT = on ne garde que le prochain horaire
$$ LANGUAGE sql STRICT;


--nouvelle réservation
-- json
-- {
--    visitorId
--    eventId
--    nbPlaces
--    validity_start
--    validity_end
-- }

CREATE FUNCTION new_booking(json) RETURNS booking AS $$
    INSERT INTO booking (visitor_id, event_id, places, scheduled_time) VALUES(
        ($1->>'visitorId')::int,
        ($1->>'eventId')::int,
        ($1->>'nbPlaces')::int,
        -- on utilise la fonction pour générer un scheduled_time respectant toutes les contraintes
        (SELECT next_ride($1))
    ) RETURNING *;
$$ LANGUAGE sql STRICT;


COMMIT;

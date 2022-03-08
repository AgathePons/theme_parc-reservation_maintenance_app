-- Deploy oparc:new_incident to pg

BEGIN;

-- pour la création d'un incident, j'ai choisi une annulation des réservations pour l'heure qui vient
-- point de départ, à confirmer avec les fronteux :-)
CREATE FUNCTION clean_bookings(int) RETURNS void AS $$
    DELETE FROM booking 
    WHERE event_id=$1
    AND scheduled_time >= now()
    AND scheduled_time <= now()+'1 hour'::interval
$$ LANGUAGE sql STRICT SECURITY DEFINER;

-- annulation des réservation et ajout d'un nouvel incident
CREATE FUNCTION new_incident(json) RETURNS int AS $$
    SELECT clean_bookings(($1->>'event_id')::int);
    INSERT INTO incident (incident_number, nature, technician, event_id) VALUES (
        $1->>'incident_number',
        $1->>'nature',
        $1->>'technician',
        ($1->>'event_id')::int
    ) RETURNING id;
$$ LANGUAGE sql STRICT;

-- ajout d'un commentaire en utilisant l'event_id récupéré par l'appel à la fonction précédente
CREATE FUNCTION new_incident_with_comment(json) RETURNS int AS $$
    INSERT INTO comment ("text", incident_id) VALUES (
        $1->>'comment',
        (SELECT new_incident($1))
    ) RETURNING incident_id
$$ LANGUAGE sql STRICT;

COMMIT;

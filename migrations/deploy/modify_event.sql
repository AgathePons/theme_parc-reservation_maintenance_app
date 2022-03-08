-- Deploy oparc:modify_event to pg

BEGIN;

-- annulation des réservations sur les prochaines 24h en cas de modification des horaires d'ouverture d'une attraction
CREATE FUNCTION clean_bookings(json) RETURNS void AS $$
    DELETE FROM booking 
    WHERE event_id=($1->>'event_id')::int
    -- réservations futures uniquement
    AND scheduled_time >= now()
    AND (
            (
                -- si la plage d'ouverture est sur la même journée
                ($1->>'opening_hour')::time < ($1->>'closing_hour')::time AND 
                -- on limite les annulations  à la journée en cours
                scheduled_time < (current_date+'1 day'::interval+'00:00:00'::time)::timestamptz AND 
				(
                    -- annulation des réservations avant l'heure d'ouverture ou après la fermeture
					scheduled_time < (current_date + ($1->>'opening_hour')::time)::timestamptz
					OR
					scheduled_time > (current_date + ($1->>'closing_hour')::time)::timestamptz
				)
			)
        OR
            (
                -- si la plage d'ouverture est sur 2 journées
                ($1->>'opening_hour')::time > ($1->>'closing_hour')::time AND 
                -- on limite les annulations  à celles avant l'heure de début du lendemain
                scheduled_time < (current_date+'1 day'::interval + ($1->>'opening_hour')::time)::timestamptz AND 
				(
                    -- annulation des réservations avant l'heure d'ouverture du jour ou après l'heure de fermeture du lendemain
                    scheduled_time < (current_date + ($1->>'opening_hour')::time)::timestamptz
					OR
					scheduled_time > (current_date+'1 day'::interval + ($1->>'closing_hour')::time)::timestamptz
				)
			)
    )
$$ LANGUAGE sql STRICT SECURITY DEFINER;

-- suppression des réservations et calcul de la nouvelle d'urée d'ouverture
CREATE FUNCTION modify_event(json) RETURNS void AS $$
    SELECT clean_bookings($1);
    UPDATE event SET 
        opening_hour=($1->>'opening_hour')::time,
        open_duration=
            CASE
                WHEN ($1->>'closing_hour')::time > ($1->>'opening_hour')::time
                THEN
                    ($1->>'closing_hour')::time-($1->>'opening_hour')::time
                ELSE
                    ($1->>'closing_hour')::time-($1->>'opening_hour')::time + '24 hours'::interval
                END
        
        WHERE id=($1->>'event_id')::int
$$ LANGUAGE sql STRICT SECURITY DEFINER;

COMMIT;

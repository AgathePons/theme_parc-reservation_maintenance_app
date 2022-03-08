-- Revert oparc:schemas from pg

BEGIN;


ALTER TABLE booking.visitor SET SCHEMA public;
ALTER TABLE booking.booking SET SCHEMA public;
ALTER TABLE booking."event" SET SCHEMA public;

ALTER VIEW booking.identified_visitor SET SCHEMA public;
ALTER VIEW booking.opened_events SET SCHEMA public;

ALTER FUNCTION booking.next_ride(json) SET SCHEMA public;
ALTER FUNCTION booking.new_booking(json) SET SCHEMA public;

ALTER DOMAIN booking.posint SET SCHEMA public;

DROP SCHEMA booking;


ALTER TABLE incident.incident SET SCHEMA public;
ALTER TABLE incident.comment SET SCHEMA public;

ALTER VIEW incident.detailed_incident SET SCHEMA public;
ALTER VIEW incident.incident_events SET SCHEMA public;

DROP FUNCTION incident.clean_bookings(int);

CREATE FUNCTION clean_bookings(int) RETURNS void AS $$
    DELETE FROM booking 
    WHERE event_id=$1
    AND scheduled_time >= now()
    AND scheduled_time <= now()+'1 hour'::interval
$$ LANGUAGE sql STRICT SECURITY DEFINER;

DROP FUNCTION incident.new_incident(json);

CREATE FUNCTION new_incident(json) RETURNS int AS $$
    SELECT clean_bookings(($1->>'event_id')::int);
    INSERT INTO incident (incident_number, nature, technician, event_id) VALUES (
        $1->>'incident_number',
        $1->>'nature',
        $1->>'technician',
        ($1->>'event_id')::int
    ) RETURNING id;
$$ LANGUAGE sql STRICT;

DROP FUNCTION incident.clean_bookings(json);

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

DROP FUNCTION incident.modify_event(json);

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



ALTER FUNCTION incident.new_incident_with_comment(json) SET SCHEMA public;
ALTER FUNCTION incident.update_incident(json) SET SCHEMA public;
ALTER FUNCTION incident.update_incident_with_comment(json) SET SCHEMA public;

DROP SCHEMA incident;



COMMIT;

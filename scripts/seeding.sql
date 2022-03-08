-- seeding de base

BEGIN;

TRUNCATE TABLE "event", visitor, booking, incident RESTART IDENTITY;

INSERT INTO "event" (public_name, capacity, opening_hour, closing_hour, duration) VALUES 
-- attraction diurne ouverte
('Jean le magicien', 10, '11:00', '18:00', '20 minutes'), 
-- attraction nocturne ouverte
('Grande roue by night', 20, '21:00', '06:00', '15 minutes'),
-- attraction maintenance en cours
('Amaze Zing le jongleur fou', 15, '09:00', '16:00', '10 minutes');


INSERT INTO visitor (ticket_number, validity_start, validity_end) VALUES
-- billet valide
('FR1254', current_date+'08:00:00'::time, current_date+'1 day'::interval + '08:00:00'),
('FR1255', current_date+'08:00:00'::time, current_date+'1 day'::interval + '08:00:00'),
('FR1256', current_date+'08:00:00'::time, current_date+'1 day'::interval + '08:00:00'),
('FR1257', current_date+'08:00:00'::time, current_date+'1 day'::interval + '08:00:00'),
-- billet invalide
('FR1258', current_date-'2 days'::interval + '08:00:00', current_date-'1 day'::interval + '08:00:00');

INSERT INTO booking (visitor_id, event_id, places, scheduled_time) VALUES
--spectacle plein
(1, 1, 4, current_date+'11:00:00'::time),
(2, 1, 4, current_date+'11:00:00'::time),
(3, 1, 2, current_date+'11:00:00'::time),

-- reste 4 places
(1, 2, 4, current_date+'21:00:00'::time),
(2, 2, 4, current_date+'21:00:00'::time),
(2, 2, 4, current_date+'21:00:00'::time),
(2, 2, 4, current_date+'21:00:00'::time);

INSERT INTO incident (incident_number, nature, technician, open_date, close_date, event_id) VALUES
('INC1234', 'Amaze s''est pris une quille sur la tronche', 'Nico', current_date+current_time, NULL, 3);

COMMIT;
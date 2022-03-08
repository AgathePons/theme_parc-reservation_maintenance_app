-- seeding prenant en compte l'ajout de la table comment

BEGIN;

TRUNCATE TABLE "event", visitor, booking, incident, comment RESTART IDENTITY;

INSERT INTO "event" (public_name, capacity, opening_hour, duration, open_duration) VALUES 
-- attraction diurne ouverte
('Jean le magicien', 10, '11:00', '20 minutes', '7 hours'), 
-- attraction nocturne ouverte
('Grande roue by night', 20, '21:00', '15 minutes', '9 hours'),
-- attractions maintenance en cours
('Amaze Zing le jongleur fou', 15, '09:00', '10 minutes', '7 hours'),
('Betty Ragedecarte la voyante', 2, '09:00', '20 minutes', '9 hours');


INSERT INTO visitor (ticket_number, validity_start, validity_end) VALUES
-- billet valide
('FR1254', current_date+'08:00:00'::time, current_date+'1 day'::interval + '08:00:00'),
('FR1255', current_date+'08:00:00'::time, current_date+'1 day'::interval + '08:00:00'),
('FR1256', current_date+'08:00:00'::time, current_date+'1 day'::interval + '08:00:00'),
-- validité finie pour la grande roue
('FR1257', current_date - '1 day'::interval + '20:00:00'::time, current_date + '20:00:00'::time),
-- billet invalide
('FR1258', current_date-'2 days'::interval + '08:00:00', current_date-'1 day'::interval + '08:00:00');

INSERT INTO booking (visitor_id, event_id, places, scheduled_time) VALUES
(1, 1, 2, current_date+'1 day'::interval+'11:00:00'::time),
(2, 1, 2, current_date+'1 day'::interval+'11:00:00'::time),

-- spectacle plein
(1, 2, 4, current_date+'21:00:00'::time),
(1, 2, 4, current_date+'21:00:00'::time),
(2, 2, 4, current_date+'21:00:00'::time),
(2, 2, 4, current_date+'21:00:00'::time),
(3, 2, 4, current_date+'21:00:00'::time);

INSERT INTO incident (incident_number, nature, technician, open_date, close_date, event_id) VALUES
('INC1234', 'Amaze s''est pris une quille sur la tronche', 'Nico', current_date+current_time-'2 hours'::interval, NULL, 3),
('INC1235', 'La boule de cristal s''est explosée par terre', 'Yann', current_date+current_time-'1 hours'::interval, NULL, 4);

INSERT INTO comment("text", "date", incident_id) VALUES
('Bon, il est parti à l''hosto, faudra des points de suture ...', current_date+current_time-'1 hours'::interval, 1),
('Ils le gardent encore un peu, ils le trouvent incohérent (plus que d''habitude ?)', current_date+current_time-'30 minutes'::interval, 1),
('Elle est partie en acheter une autre, faire les soldes et chez le coiffeur', current_date+current_time-'30 minutes'::interval, 2);

COMMIT;
BEGIN;

TRUNCATE
  attraction,
  incident,
  visitor,
  attraction_has_visitor
RESTART IDENTITY;

INSERT INTO attraction ("name", "capacity", "open_hour", "close_hour", "duration") 
VALUES
('labyrinthe', 50, '08:00:00','16:00:00','00:30:00'),
('train fantôme', 30, '12:00:00', '21:00:00', '00:15:00'),
('la tour', 45, '15:00:00', '23:00:00', '00:10:00'),
('le roi lion', 80, '09:30:00', '17:00:00', '01:30:00');


INSERT INTO incident ("nature", "technician", "attraction_id", "start_date", "end_date")
VALUES
('panne moteur', 'Jean-Michèle Répartout', 2, '2022-03-07 10:00:00', NULL),
('météo', NULL, 4, '2022-03-07 08:30:00', NULL),
('Tout est cassé', 'Le stagiaire', 3,'2022-03-07 16:00:00','2022-03-07 17:00:00' );

INSERT INTO visitor ("ticket")
VALUES 
('001'),
('002'),
('003');

INSERT INTO attraction_has_visitor ("number_places", "reservation_hour", "attraction_id", "visitor_id")
VALUES
(3, '2022-03-07 17:00:00', 3, 1),
(1, '2022-03-07 13:00:00', 2, 2),
(4, '2022-03-07 13:00:00', 4, 3);
COMMIT;
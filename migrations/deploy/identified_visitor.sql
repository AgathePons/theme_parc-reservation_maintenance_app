-- Deploy oparc:identified_visitor to pg

-- création d'une vue incluant les infos utiles d'un visitor
-- est-ce que son ticket est valide
-- est-ce qu'il peut encore effectuer une réservation

BEGIN;

CREATE VIEW identified_visitor AS
    SELECT *, 
    (validity_start <= now() AND validity_end >= now()) AS valid_ticket,
    ((SELECT COUNT(*) FROM booking WHERE visitor_id=visitor.id) < 3) AS can_book
    FROM visitor;

COMMIT;

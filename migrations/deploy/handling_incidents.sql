-- Deploy oparc:handling_incidents to pg

-- pour mieux gérer le suivi des incidents, ajout d'une table de commentaires

BEGIN;

CREATE TABLE comment (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "text" TEXT NOT NULL,
    "date" TIMESTAMPTZ NOT NULL DEFAULT now(),
    incident_id INT NOT NULL REFERENCES incident(id)
);

DROP VIEW detailed_incident;

-- on redéfinit la vue pour ajouter un tableau de commentaires au format json
-- si aucun commentaires, on met un tableau vide pour ne pas planter la vue

CREATE VIEW detailed_incident AS
SELECT 
    incident.*, 
    (SELECT public_name FROM event WHERE id=incident.event_id) AS event_name,
	case
		when count(comment.*) > 0
		then
			array_agg(json_build_object('text', comment.text, 'date', comment.date) ORDER BY comment.date DESC)
		else
			'{}'
		end 
	AS comments
FROM incident
-- ce JOIN par la gauche pour ne pas zapper les incidents n'ayant pas de commentaires
LEFT JOIN comment ON comment.incident_id=incident.id
WHERE close_date IS NULL
GROUP BY incident.id
ORDER BY open_date;

COMMIT;

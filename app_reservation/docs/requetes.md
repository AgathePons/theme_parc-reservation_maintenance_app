```SQL
----sql

--calcul de créneau
-- prend en params l'heure de recherche, et l'id de l'attraction à reserver
CREATE FUNCTION creneau(timetz, int) RETURNS timetz AS $$
SELECT
-- si pas encore ouvert, alors prochain créneau = horraire d'ouverture
CASE WHEN $1 < (SELECT open_hour FROM attraction WHERE id=$2) THEN open_hour
-- si fermé (horraire > à l'horraire de fermeture), alors prochain créneau =open_hour (ouverture du lendemain)
WHEN $1 > (SELECT close_hour FROM attraction WHERE id=$2) THEN open_hour
-- si dans le creneau alors on cherche l'interval
WHEN $1 BETWEEN (SELECT open_hour FROM attraction WHERE id=$2) AND (SELECT close_hour FROM attraction WHERE id=$2)  
 -- TODO : retourner le creaneau le plus proche, pour l'instant retourne l'heure donné en params
THEN $1
END
FROM attraction WHERE id=$2;

$$
LANGUAGE SQL STRICT;
```


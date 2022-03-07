-- Deploy oparc:opened_attractions_view to pg

BEGIN;

-- Est-ce que l'attraction est en mainteance ?
-- paramètres : le timestamp, et l'id de l'attraction
CREATE FUNCTION isItUnderMaintenance(timestamptz, int) RETURNS boolean AS $$
    SELECT
        CASE
            --Regarde si un incident non cloturé existe sur l'id
            WHEN (SELECT end_date FROM incident WHERE id=$2 AND start_date < $1) IS NOT NULL
            THEN TRUE
            --sinon retourne faux
            ELSE FALSE
            END
        FROM attraction WHERE id=$2;
$$ LANGUAGE SQL STRICT;
-- Est-ce que l'attraction est ouverte ?
-- 2 paramètres :  le timestamp, et l'id de l'attraction
CREATE FUNCTION isItOpen(timestamptz, int) RETURNS boolean AS
$$
        SELECT
            CASE
            -- si dans l'intervale d'ouverture alors regarde si il y a un incident en cours ou non grâce à l'appel de la function isUnderMaint
            WHEN $1::timetz BETWEEN (SELECT open_hour FROM attraction WHERE id=$2) AND (SELECT close_hour FROM attraction WHERE id=$2)
            THEN isItUnderMaintenance($1,$2)
            --sinon retourne faux
            ELSE FALSE
            END
        FROM attraction WHERE id=$2;
$$ LANGUAGE SQL STRICT;
CREATE VIEW opened_attraction AS
    SELECT *, (SELECT isItOpen(current_timestamp, attraction.id)) AS open FROM attraction ;
    
COMMIT;

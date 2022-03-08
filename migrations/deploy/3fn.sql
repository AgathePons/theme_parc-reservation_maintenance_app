-- Deploy oparc:3fn to pg

-- respect de la 3ème forme normale
-- https://fr.wikipedia.org/wiki/Forme_normale_(bases_de_donn%C3%A9es_relationnelles)#3FN_%E2%80%93_Troisi%C3%A8me_forme_normale
-- la modification d'un champ d'une table ne doit pas impliquer la modification d'un autre champ de cette même table
-- la modification de l'heure de début implique la modif de la date de fin et inversement
-- on contourne le problème en stockant la durée d'ouverture de l'attraction

BEGIN;

ALTER TABLE "event"
    ADD COLUMN open_duration INTERVAL;

UPDATE "event" SET open_duration = closing_hour - opening_hour;

UPDATE "event" SET open_duration = open_duration + '24 hours' WHERE open_duration < '0';

ALTER TABLE "event"
    ALTER COLUMN open_duration SET NOT NULL;

ALTER TABLE "event"
    DROP COLUMN closing_hour;

COMMIT;

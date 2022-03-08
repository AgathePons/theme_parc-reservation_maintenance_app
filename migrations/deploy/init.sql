-- Deploy oparc:init to pg

-- mise en place des tables selon le MCD fourni par le client

BEGIN;

CREATE DOMAIN posint AS INT CHECK (VALUE > 0);

CREATE TABLE "event" (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    public_name TEXT UNIQUE NOT NULL,
    capacity posint NOT NULL,
    opening_hour TIME NOT NULL,
    closing_hour TIME NOT NULL,
    duration INTERVAL NOT NULL
);

CREATE TABLE visitor (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ticket_number TEXT UNIQUE NOT NULL,
    validity_start TIMESTAMPTZ NOT NULL,
    validity_end TIMESTAMPTZ NOT NULL
);

CREATE TABLE booking (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    visitor_id INT NOT NULL REFERENCES visitor(id),
    event_id INT NOT NULL REFERENCES event(id),
    places posint NOT NULL DEFAULT 1 CHECK (places <= 4),
    scheduled_time TIMESTAMPTZ NOT NULL
);

CREATE TABLE incident (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    incident_number TEXT UNIQUE NOT NULL,
    nature TEXT NOT NULL,
    technician TEXT NOT NULL,
    open_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    close_date TIMESTAMPTZ,
    event_id INT NOT NULL REFERENCES event(id)
);

COMMIT;

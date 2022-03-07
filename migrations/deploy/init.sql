-- Deploy oparc:init to pg

BEGIN;

CREATE TABLE attraction (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  capacity INT NOT NULL,
  open_hour TIMETZ NOT NULL,
  close_hour TIMETZ NOT NULL,
  duration INTERVAL NOT NULL
);

CREATE TABLE incident (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nature TEXT NOT NULL,
  technician TEXT,
  start_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_date TIMESTAMPTZ,
  attraction_id INT NOT NULL REFERENCES attraction(id)
);

CREATE TABLE visitor (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ticket TEXT NOT NULL UNIQUE,
  start_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_date TIMESTAMPTZ NOT NULL DEFAULT now()+'24 hours'
);

CREATE TABLE attraction_has_visitor (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  number_places INT NOT NULL DEFAULT 1,
  reservation_hour TIMESTAMPTZ NOT NULL,
  attraction_id INT NOT NULL REFERENCES attraction(id),
  visitor_id INT NOT NULL REFERENCES visitor(id)
);

COMMIT;

-- Deploy oparc:next_reservation to pg

BEGIN;

create function NextSlot(int, int)
   returns timestamptz
   language plpgsql
  as
$$

declare 
-- variable declaration
counter timetz :=(SELECT open_hour FROM opened_attraction WHERE id=$1 AND open=true);
begin
DROP TABLE IF EXISTS timeSlot;
CREATE TEMP TABLE timeSlot(
    slot TIMETZ
);
 -- logic
 while  counter < (SELECT close_hour FROM opened_attraction WHERE id=$1 AND open=true) loop
      INSERT INTO timeSlot (slot) VALUES (DATE(now())+ counter);
      counter := counter + (SELECT duration FROM opened_attraction WHERE id=$1 AND open=true);
   end loop;
   return date (DATE (now())) + ((SELECT * from timeSlot WHERE slot > NOW()::timetz OFFSET $2 LIMIT 1 ));
end;
$$;

-- function

-- create the function with hard values
CREATE FUNCTION isEnoughPlacesRemainig(attractionid int, timeslot timestamptz, numberofplaces int)
RETURNS BOOLEAN AS $$

SELECT --mytable.*,

	CASE
		WHEN mytable.remaining >= $3 THEN true
		ELSE false
	END
	
FROM (
	SELECT *, COALESCE(capacity,0) - COALESCE(reserved_places,0) AS remaining
	FROM
	(SELECT attraction.capacity FROM attraction WHERE id=$1) AS attraction_capacity,
	(SELECT 
		SUM(attraction_has_visitor.number_places) AS reserved_places
		FROM attraction_has_visitor WHERE attraction_id=$1 AND reservation_hour=$2)
	AS reserved_places
) AS mytable;

	
$$ LANGUAGE SQL STRICT;

--SELECT NextSlot(3,0);
--SELECT isEnoughPlacesRemainig(5, '2022-03-08 13:00:00+01', 4);


create function valid_slot(attractionid int, numberofplaces int)
   returns timestamptz
   language plpgsql
  as
$$
declare 
-- variable declaration
counter INT = 0;
begin
 -- logic
 while  (SELECT isEnoughPlacesRemainig($1, (SELECT NextSlot($1,counter)), $2)) = false loop
      counter := counter + 1;
   end loop;
   return date (DATE (now())) + ((SELECT * from timeSlot WHERE slot > NOW()::timetz OFFSET counter LIMIT 1 ));
end;
$$;

COMMIT;

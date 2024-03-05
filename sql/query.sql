-- Select stuff
SELECT * FROM voyages;
SELECT * FROM ferries;
SELECT * FROM destinations;
SELECT * FROM passengers;

-- Voyage info (human readable, suitable for rendering)
SELECT voyages.id, destinations.name AS destination_name, ferries.name AS ferry_name FROM voyages, ferries, destinations WHERE ferry_id = ferries.id AND destination_id = destinations.id;
-- Select stuff
SELECT * FROM voyages;
SELECT * FROM ferries;
SELECT * FROM destinations;
SELECT * FROM passengers ORDER BY passenger_type;

-- Voyage info
SELECT voyages.id,
    voyages.destination_id,
    voyages.ferry_id,
    destinations.name AS destination_name,
    ferries.name AS ferry_name
    FROM voyages, ferries, destinations
    WHERE ferry_id = ferries.id
    AND destination_id = destinations.id;

-- Cargo & auto by voyage
SELECT passengers.name FROM passengers, voyages WHERE passengers.voyage_id = voyages.id;

-- Assignment check
SELECT id FROM voyages WHERE ferry_id = <ferry_id>;
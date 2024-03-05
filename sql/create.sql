-- create.sql: DB creation, role assignment

-- DB & tables creation
CREATE DATABASE port_workstation IF NOT EXISTS;

CREATE TABLE destinations (
    id UUID PRIMARY KEY,
    name VARCHAR(60) NOT NULL
) IF NOT EXISTS;

CREATE TABLE ferries (
    id UUID PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    hold INTEGER NOT NULL CHECK (hold >= 0),
    autopark INTEGER NOT NULL CHECK (autopark >= 0)
) IF NOT EXISTS;

CREATE TABLE voyages (
    id UUID PRIMARY KEY;
    destination_id UUID REFERENCES destinations ON DELETE RESTRICT,
    ferry_id UUID REFERENCES ferries ON DELETE RESTRICT
) IF NOT EXISTS;

CREATE TABLE passengers (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    passenger_type VARCHAR(6) NOT NULL,
    space_occupied INTEGER NOT NULL CHECK (space_occupied > 0),
    voyage_id UUID REFERENCES voyages ON DELETE RESTRICT
) IF NOT EXISTS;

-- Role assignment
CREATE ROLE pw_admin LOGIN ENCRYPTED PASSWORD 'admin';
GRANT SELECT ON ferries TO pw_admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON voyages, destinations, passengers TO pw_admin;
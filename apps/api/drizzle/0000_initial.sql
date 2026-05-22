CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS "locations" (
  "id" serial PRIMARY KEY,
  "name" text NOT NULL,
  "country" text NOT NULL,
  "region" text,
  "geometry" geometry(Point, 4326)
);

CREATE INDEX IF NOT EXISTS locations_geometry_idx ON "locations" USING GIST ("geometry");

CREATE TABLE IF NOT EXISTS "air_measurements" (
  "id" serial PRIMARY KEY,
  "location_id" integer NOT NULL REFERENCES "locations"("id"),
  "source" text NOT NULL,
  "latitude" numeric NOT NULL,
  "longitude" numeric NOT NULL,
  "aqi" numeric,
  "pm25" numeric,
  "pm10" numeric,
  "no2" numeric,
  "ozone" numeric,
  "co" numeric,
  "so2" numeric,
  "timestamp" timestamp NOT NULL
);

CREATE INDEX IF NOT EXISTS air_measurements_location_id_idx ON "air_measurements" ("location_id");
CREATE INDEX IF NOT EXISTS air_measurements_timestamp_idx ON "air_measurements" ("timestamp" DESC);

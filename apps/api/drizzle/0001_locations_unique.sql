ALTER TABLE locations ADD CONSTRAINT locations_name_country_unique UNIQUE (name, country);

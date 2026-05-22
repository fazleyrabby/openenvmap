import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  region: text("region"),
  // Raw WKT string — PostGIS geometry handled via raw SQL migrations
  geometry: text("geometry"),
});

export const airMeasurements = pgTable("air_measurements", {
  id: serial("id").primaryKey(),
  locationId: integer("location_id")
    .notNull()
    .references(() => locations.id),
  source: text("source").notNull(),
  latitude: numeric("latitude").notNull(),
  longitude: numeric("longitude").notNull(),
  aqi: numeric("aqi"),
  pm25: numeric("pm25"),
  pm10: numeric("pm10"),
  no2: numeric("no2"),
  ozone: numeric("ozone"),
  co: numeric("co"),
  so2: numeric("so2"),
  timestamp: timestamp("timestamp").notNull(),
});

export const locationsRelations = relations(locations, ({ many }) => ({
  airMeasurements: many(airMeasurements),
}));

export const airMeasurementsRelations = relations(
  airMeasurements,
  ({ one }) => ({
    location: one(locations, {
      fields: [airMeasurements.locationId],
      references: [locations.id],
    }),
  })
);

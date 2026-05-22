/**
 * Shared TypeScript interfaces for OpenEnvMap.
 * These mirror the Drizzle schema in apps/api/src/db/schema.ts.
 */

export interface Location {
  id: number;
  name: string;
  country: string;
  region: string | null;
  /** Raw WKT string, e.g. "POINT(lon lat)" */
  geometry: string | null;
}

export interface AirMeasurement {
  id: number;
  locationId: number;
  source: string;
  latitude: string;
  longitude: string;
  aqi: string | null;
  pm25: string | null;
  pm10: string | null;
  no2: string | null;
  ozone: string | null;
  co: string | null;
  so2: string | null;
  timestamp: string;
}

/** Measurement enriched with its parent location (used in API responses) */
export interface AirMeasurementWithLocation extends AirMeasurement {
  location: Location;
}

/** Supported pollutant keys */
export type PollutantKey = "aqi" | "pm25" | "pm10" | "no2" | "ozone" | "co" | "so2";

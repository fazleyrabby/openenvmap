import { db } from "../db/index.js";
import { locations, airMeasurements } from "../db/schema.js";
import { and, eq } from "drizzle-orm";

const OPENAQ_BASE = "https://api.openaq.org/v3";
const CONCURRENCY = 10;
const ACTIVE_WINDOW_MS = 48 * 60 * 60 * 1000;

interface OpenAQSensor {
  id: number;
  parameter: { name: string };
}

interface OpenAQDatetime {
  utc: string;
}

interface OpenAQLocation {
  id: number;
  name: string;
  country: { code: string; name: string };
  coordinates: { latitude: number; longitude: number } | null;
  sensors: OpenAQSensor[];
  datetimeLast: OpenAQDatetime | null;
}

interface OpenAQMeasurement {
  value: number;
  parameter: { name: string };
  period: { datetimeTo: OpenAQDatetime };
}

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (process.env.OPENAQ_API_KEY) {
    headers["X-API-Key"] = process.env.OPENAQ_API_KEY;
  }
  return headers;
}

function mapParamName(
  name: string
): "pm25" | "pm10" | "no2" | "ozone" | "co" | "so2" | null {
  switch (name.toLowerCase()) {
    case "pm25": return "pm25";
    case "pm10": return "pm10";
    case "no2": return "no2";
    case "o3":
    case "ozone": return "ozone";
    case "co": return "co";
    case "so2": return "so2";
    default: return null;
  }
}

async function fetchLocations(page: number): Promise<OpenAQLocation[]> {
  const res = await fetch(
    `${OPENAQ_BASE}/locations?limit=100&page=${page}`,
    { headers: buildHeaders() }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  const data = await res.json() as { results: OpenAQLocation[] };
  return data.results ?? [];
}

async function fetchSensorLatest(
  sensorId: number,
  datetimeLastUtc: string
): Promise<OpenAQMeasurement | null> {
  // Use datetimeLast - 2h as datetime_from to get the most recent reading
  const from = new Date(new Date(datetimeLastUtc).getTime() - 2 * 60 * 60 * 1000);
  const url = `${OPENAQ_BASE}/sensors/${sensorId}/measurements?limit=1&datetime_from=${from.toISOString()}`;
  try {
    const res = await fetch(url, { headers: buildHeaders() });
    if (!res.ok) return null;
    const data = await res.json() as { results: OpenAQMeasurement[] };
    return data.results?.[0] ?? null;
  } catch {
    return null;
  }
}

async function upsertLocation(name: string, country: string): Promise<number | null> {
  try {
    await db
      .insert(locations)
      .values({ name, country, region: null, geometry: null })
      .onConflictDoNothing();

    const [loc] = await db
      .select({ id: locations.id })
      .from(locations)
      .where(and(eq(locations.name, name), eq(locations.country, country)));

    return loc?.id ?? null;
  } catch (err) {
    console.error(`[OpenAQ] Failed to upsert location "${name}":`, err);
    return null;
  }
}

// Run tasks concurrently with a max concurrency limit
async function batchRun<T>(
  tasks: (() => Promise<T>)[],
  concurrency: number
): Promise<PromiseSettledResult<T>[]> {
  const results: PromiseSettledResult<T>[] = [];
  for (let i = 0; i < tasks.length; i += concurrency) {
    const batch = tasks.slice(i, i + concurrency).map((t) => t());
    const settled = await Promise.allSettled(batch);
    results.push(...settled);
  }
  return results;
}

export async function runOpenAQIngestion(): Promise<void> {
  console.log("[OpenAQ] Starting ingestion...");

  // Fetch pages 1–3 and filter to active locations (datetimeLast within 48h)
  let allLocations: OpenAQLocation[] = [];
  const cutoff = Date.now() - ACTIVE_WINDOW_MS;

  try {
    for (let page = 1; page <= 3; page++) {
      const locs = await fetchLocations(page);
      if (locs.length === 0) break;
      allLocations.push(...locs);
    }
  } catch (err) {
    console.error("[OpenAQ] Failed to fetch locations:", err);
    return;
  }

  const activeLocs = allLocations.filter((loc) => {
    if (!loc.datetimeLast?.utc) return false;
    if (!loc.coordinates?.latitude || !loc.coordinates?.longitude) return false;
    if (!loc.name || !loc.country?.code) return false;
    return new Date(loc.datetimeLast.utc).getTime() > cutoff;
  });

  console.log(`[OpenAQ] ${allLocations.length} fetched, ${activeLocs.length} active`);

  // Upsert all active locations into DB
  const locationIdMap = new Map<number, number>();
  for (const loc of activeLocs) {
    const dbId = await upsertLocation(loc.name.trim(), loc.country.code.trim());
    if (dbId !== null) locationIdMap.set(loc.id, dbId);
  }

  // Build sensor fetch tasks
  type SensorTask = {
    sensorId: number;
    paramName: string;
    locationId: number;
    openaqLocId: number;
    datetimeLastUtc: string;
    lat: number;
    lng: number;
  };

  const sensorTasks: SensorTask[] = [];
  for (const loc of activeLocs) {
    const dbLocId = locationIdMap.get(loc.id);
    if (!dbLocId) continue;
    for (const sensor of loc.sensors ?? []) {
      const param = mapParamName(sensor.parameter?.name ?? "");
      if (!param) continue;
      sensorTasks.push({
        sensorId: sensor.id,
        paramName: param,
        locationId: dbLocId,
        openaqLocId: loc.id,
        datetimeLastUtc: loc.datetimeLast!.utc,
        lat: loc.coordinates!.latitude,
        lng: loc.coordinates!.longitude,
      });
    }
  }

  // Fetch latest measurement for each sensor in batches
  const sensorResults = await batchRun(
    sensorTasks.map((task) => () => fetchSensorLatest(task.sensorId, task.datetimeLastUtc)),
    CONCURRENCY
  );

  // Group readings by location
  type Reading = { param: string; value: number; timestamp: string };
  const byLocation = new Map<number, { readings: Reading[]; lat: number; lng: number }>();

  for (let i = 0; i < sensorTasks.length; i++) {
    const task = sensorTasks[i];
    const result = sensorResults[i];
    if (result.status !== "fulfilled" || !result.value) continue;

    const measurement = result.value;
    const value = measurement.value;
    const timestamp = measurement.period?.datetimeTo?.utc;
    if (value === null || value === undefined || !timestamp) continue;

    if (!byLocation.has(task.locationId)) {
      byLocation.set(task.locationId, { readings: [], lat: task.lat, lng: task.lng });
    }
    byLocation.get(task.locationId)!.readings.push({
      param: task.paramName,
      value,
      timestamp,
    });
  }

  // Insert one row per location with all its readings
  let inserted = 0;
  for (const [locationId, { readings, lat, lng }] of byLocation) {
    if (readings.length === 0) continue;

    const vals: Record<string, string | null> = {
      pm25: null, pm10: null, no2: null, ozone: null, co: null, so2: null,
    };
    let bestTimestamp = "";
    for (const r of readings) {
      vals[r.param] = String(r.value);
      if (r.timestamp > bestTimestamp) bestTimestamp = r.timestamp;
    }
    if (!bestTimestamp) continue;

    try {
      await db.insert(airMeasurements).values({
        locationId,
        source: "openaq",
        latitude: String(lat),
        longitude: String(lng),
        aqi: null,
        pm25: vals.pm25,
        pm10: vals.pm10,
        no2: vals.no2,
        ozone: vals.ozone,
        co: vals.co,
        so2: vals.so2,
        timestamp: new Date(bestTimestamp),
      });
      inserted++;
    } catch (err) {
      console.error(`[OpenAQ] Insert failed for location ${locationId}:`, err);
    }
  }

  console.log(`[OpenAQ] Ingestion complete. Inserted ${inserted} rows.`);
}

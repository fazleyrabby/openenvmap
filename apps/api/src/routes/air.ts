import type { FastifyInstance } from "fastify";
import { db } from "../db/index.js";
import { airMeasurements, locations } from "../db/schema.js";
import { desc, eq } from "drizzle-orm";
import { runOpenAQIngestion } from "../ingestion/openaq.js";

export async function airRoute(app: FastifyInstance): Promise<void> {
  // GET /api/air/latest — returns latest 200 measurements with location info
  app.get("/air/latest", async (_request, reply) => {
    const rows = await db
      .select({
        id: airMeasurements.id,
        source: airMeasurements.source,
        latitude: airMeasurements.latitude,
        longitude: airMeasurements.longitude,
        aqi: airMeasurements.aqi,
        pm25: airMeasurements.pm25,
        pm10: airMeasurements.pm10,
        no2: airMeasurements.no2,
        ozone: airMeasurements.ozone,
        co: airMeasurements.co,
        so2: airMeasurements.so2,
        timestamp: airMeasurements.timestamp,
        locationName: locations.name,
        country: locations.country,
        region: locations.region,
      })
      .from(airMeasurements)
      .innerJoin(locations, eq(airMeasurements.locationId, locations.id))
      .orderBy(desc(airMeasurements.timestamp))
      .limit(200);

    return reply.send(rows);
  });

  // GET /api/air/ingest — manual trigger for testing
  app.get("/air/ingest", async (_request, reply) => {
    runOpenAQIngestion().catch(console.error);
    return reply.send({ status: "ingestion started" });
  });
}

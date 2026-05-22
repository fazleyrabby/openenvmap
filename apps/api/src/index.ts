import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { healthRoute } from "./routes/health.js";
import { airRoute } from "./routes/air.js";
import { startScheduler } from "./ingestion/scheduler.js";

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: true,
});

await app.register(healthRoute);
await app.register(airRoute, { prefix: "/api" });

const port = Number(process.env.API_PORT) || 3000;

try {
  await app.listen({ port, host: "0.0.0.0" });
  console.log(`API listening on http://0.0.0.0:${port}`);
  startScheduler();
} catch (err) {
  app.log.error(err);
  process.exit(1);
}

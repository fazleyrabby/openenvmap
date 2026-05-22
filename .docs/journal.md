# OpenEnvMap Development Journal

# Purpose

This file tracks:
- architectural decisions
- implementation progress
- blockers
- future ideas
- technical tradeoffs

---

# Initial Decisions

## Stack
Backend:
- Fastify
- TypeScript
- PostgreSQL
- PostGIS
- Drizzle ORM

Frontend:
- Vue 3
- Vite
- TypeScript
- TailwindCSS
- shadcn-vue
- MapLibre GL JS

Data:
- OpenAQ
- Open-Meteo
- Photon
- OpenStreetMap

Infrastructure:
- Docker Compose

---

# Architecture Notes

The project is designed as:
- GIS-oriented
- lightweight
- modular
- API-first

Avoiding:
- enterprise overengineering
- unnecessary abstractions
- microservices initially

---

# MVP Focus

Initial MVP focuses ONLY on:
- air pollution intelligence
- AQI visualization
- geospatial search
- historical analytics

Future pollution types will be added incrementally.

---

# Important Constraints

Priority areas:
- geospatial performance
- clean architecture
- maintainability
- visualization quality

---

# Implementation Log

## 2026-05-23 — Monorepo scaffold + infrastructure

Set up full pnpm monorepo with apps/api, apps/web, packages/shared.
Docker Compose runs postgres (postgis/postgis:16-3.4, port 5433 to avoid conflict with local postgres), api (Fastify), web (Vue/Vite).
Both Dockerfiles pin NODE_ENV=development and use .dockerignore to prevent host node_modules overwriting container install.
Platform pinned to linux/arm64 for Apple Silicon.

## 2026-05-23 — Database migrations

Drizzle ORM migrations set up with drizzle-kit.
Migration 0000: creates locations + air_measurements tables, enables postgis, adds GIST spatial index on locations.geometry, B-tree indexes on air_measurements.location_id and timestamp.
Migration 0001: adds UNIQUE(name, country) constraint on locations for safe upserts.
geometry column stored as text in Drizzle schema; actual PostGIS geometry(Point, 4326) type enforced via raw SQL migration.

## 2026-05-23 — OpenAQ ingestion service

Built src/ingestion/openaq.ts fetching from OpenAQ v3 API (GET /v3/locations?limit=100).
Upserts locations via insert + onConflictDoNothing + select pattern (no Drizzle onConflictDoUpdate needed).
Maps sensor parameter names: pm25, pm10, no2, o3→ozone, co, so2. AQI left null (not provided by OpenAQ directly).
Scheduler runs ingestion on startup then every 15 minutes.
Manual trigger available at GET /api/air/ingest for testing.
GET /api/air/latest returns latest 200 measurements joined with location data.

---

# Future Ideas

Potential future features:
- AI forecasting
- environmental scoring
- satellite overlays
- public APIs
- community reports
- mobile app
<img width="1150" height="578" alt="CleanShot 2026-05-23 at 02 36 31" src="https://github.com/user-attachments/assets/7a88a03f-005e-4553-a3c9-f55cec30f158" />

# OpenEnvMap

Open-source environmental intelligence platform for visualizing pollution and environmental data on an interactive geospatial map.

## Stack

**Backend:** Fastify · TypeScript · PostgreSQL · PostGIS · Drizzle ORM  
**Frontend:** Vue 3 · Vite · TailwindCSS · shadcn-vue · MapLibre GL JS  
**Data:** OpenAQ · Open-Meteo · Photon · OpenStreetMap  
**Infrastructure:** Docker Compose

## MVP Features

- Interactive dark-mode map (CartoDB Dark Matter)
- Air quality markers (PM2.5, PM10, NO₂, Ozone, CO, SO₂)
- AQI color scale (good → hazardous)
- Geospatial search via Photon geocoding
- OpenAQ v3 ingestion with 15-minute refresh
- Historical data storage in PostGIS

## Getting Started

### Prerequisites

- Docker + Docker Compose
- pnpm
- OpenAQ API key (free at [openaq.org](https://openaq.org))

### Local Development

```bash
git clone https://github.com/fazleyrabby/openenvmap.git
cd openenvmap

cp .env.example .env
# Add your OPENAQ_API_KEY to .env

pnpm install
docker compose up --build
```

- Web: http://localhost:5173
- API: http://localhost:3000
- Health: http://localhost:3000/health

### Run Migrations

```bash
cd apps/api
DATABASE_URL=postgres://postgres:postgres@localhost:5433/openenvmap pnpm db:migrate
```

### Trigger Manual Ingestion

```bash
curl http://localhost:3000/api/air/ingest
```

## Project Structure

```
/apps
  /api      Fastify REST API + ingestion
  /web      Vue 3 frontend
/packages
  /shared   Shared TypeScript types
/docker
  /postgres PostGIS init scripts
/.docs      Architecture, spec, design, tasks, journal
```

## Data Sources

| Source | Usage |
|--------|-------|
| OpenAQ | Air quality measurements |
| Photon | Geocoding / search |
| OpenStreetMap | Base map tiles |
| Open-Meteo | Weather (planned) |

## License

MIT

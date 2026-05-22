# OpenEnvMap

OpenEnvMap is a modern environmental intelligence platform focused on visualizing pollution and environmental data on an interactive geospatial map.

The platform will gradually support:
- Air pollution
- Water pollution
- Noise pollution
- Light pollution
- Soil pollution
- Waste/plastic pollution

The initial MVP focuses ONLY on:
# Air Pollution Intelligence

---

# Goals

Build a lightweight, modern, GIS-oriented platform with:
- interactive maps
- pollution heatmaps
- geospatial search
- historical analytics
- environmental intelligence layers

The UI should feel similar to:
- Google Maps
- modern GIS dashboards
- environmental intelligence platforms

---

# Initial MVP Scope

## Phase 1 — Air Pollution

### Features
- Interactive map
- AQI heatmap
- Pollution markers
- Geospatial search
- Historical charts
- Layer toggles
- Pollution detail sidebar

---

# Tech Stack

## Backend
- Fastify
- TypeScript
- PostgreSQL
- PostGIS
- Drizzle ORM

## Frontend
- Vue 3
- Vite
- TypeScript
- TailwindCSS
- shadcn-vue
- MapLibre GL JS

## Infrastructure
- Docker Compose

---

# Architecture Principles

The system must be:
- modular
- lightweight
- API-first
- GIS-oriented
- extensible

Avoid:
- microservices
- Kubernetes
- GraphQL
- enterprise overengineering

---

# Core Modules

## Air Module
Responsible for:
- AQI ingestion
- air pollutant storage
- heatmap APIs
- historical analytics

Future modules:
- water
- noise
- light
- soil
- waste

must be addable without major refactoring.

---

# Data Sources

Initial provider:
- OpenAQ

Future providers:
- WAQI
- satellite data
- government datasets
- community reports

---

# Key Features

## Interactive Map
Support:
- zoom/pan
- pollution markers
- heatmap rendering
- clustering
- dynamic layers

---

## Search
Users can search:
- cities
- regions
- industrial zones

Features:
- autocomplete
- fly-to-location
- suggestions

---

## Pollution Layers
Support:
- AQI
- PM2.5
- PM10
- NO2
- Ozone

Users can toggle layers dynamically.

---

## Historical Analytics
Display:
- hourly trends
- daily trends
- weekly trends

Charts should support:
- zooming
- filtering
- comparison

---

# Backend Requirements

## Database
Use PostgreSQL with PostGIS.

Must support:
- geospatial indexing
- time-series pollution data
- efficient historical queries

---

## APIs

Example endpoints:

GET /api/air/latest
GET /api/air/history
GET /api/search
GET /api/locations/:id

---

## Geospatial Queries
Use PostGIS features:
- ST_DWithin
- ST_AsGeoJSON
- spatial indexing

Prefer raw SQL for complex GIS queries.

---

# Frontend Requirements

## Layout
- full-screen map
- sidebar
- top search bar
- layer controls
- detail panel

---

## UI Style
The UI should be:
- clean
- modern
- dark-mode friendly
- data visualization focused

---

# Infrastructure

Use Docker Compose with:
- api service
- web service
- postgres/postgis service

Support:
- hot reload
- local development
- reproducible environments

---

# Future Scope

Future phases may include:
- water pollution
- noise heatmaps
- light pollution visualization
- satellite overlays
- AI forecasting
- environmental scoring
- public APIs

The architecture should support these expansions cleanly.
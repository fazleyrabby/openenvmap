# OpenEnvMap Architecture

# Overview

OpenEnvMap is designed as a lightweight GIS/data platform.

Architecture priorities:
- simplicity
- maintainability
- geospatial performance
- modularity

---

# Monorepo Structure

/apps
  /api
  /web

/packages
  /shared

/docker

---

# Backend

## Framework
- Fastify
- TypeScript
- Drizzle ORM

## Responsibilities
- REST APIs
- geospatial queries
- ingestion pipelines
- historical analytics
- search endpoints

---

# Database

## PostgreSQL + PostGIS

PostGIS is the core geospatial engine.

Use spatial indexes aggressively.

---

# Initial Tables

## locations
Stores normalized geographic locations.

Fields:
- id
- name
- country
- region
- geometry (PostGIS point)

## air_measurements
Stores pollution measurements.

Fields:
- id
- source
- latitude
- longitude
- location geometry
- aqi
- pm25
- pm10
- no2
- ozone
- co
- so2
- timestamp

---

# Geospatial Strategy

Use:
- geometry/geography columns
- ST_DWithin
- ST_AsGeoJSON
- GiST indexes

Avoid:
- storing only lat/lng floats

---

# Frontend

## Stack
- Vue 3
- Vite
- TypeScript
- TailwindCSS
- shadcn-vue
- MapLibre GL JS

---

# Frontend Responsibilities

- map rendering
- heatmaps
- markers
- charts
- layer controls
- search UX

---

# Data Ingestion

Initial ingestion provider:
- OpenAQ

The ingestion pipeline must support:
- retries
- normalization
- scheduled syncs
- future providers

---

# Search / Geocoding

Provider: Photon (OSS geocoding, OSM-based)

Supports:
- city/region autocomplete
- fly-to-location
- reverse geocoding

---

# API Philosophy

Simple REST APIs.

Avoid:
- GraphQL
- RPC abstractions

---

# Deployment

## Docker Compose

Services:
- api
- web
- postgres/postgis

---

# Scaling Strategy

Initial architecture:
- monolithic API
- single database

Future scaling:
- ingestion workers
- Redis caching
- TimescaleDB
- vector tile services

only when necessary.
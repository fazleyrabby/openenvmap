# OpenEnvMap Data Sources

# Overview

OpenEnvMap is designed as a modular environmental intelligence platform that aggregates environmental datasets from multiple providers.

This document defines:
- current data providers
- future provider plans
- licensing considerations
- ingestion architecture
- normalization strategy

The platform prioritizes:
- open data
- developer-friendly APIs
- reproducibility
- long-term sustainability

---

# Data Source Philosophy

OpenEnvMap should prefer:
- open datasets
- public APIs
- open geospatial standards
- attribution-friendly providers

Avoid:
- vendor lock-in
- proprietary-only dependencies
- unstable scraping systems

---

# Current MVP Scope

Initial MVP focuses ONLY on:
# Air Pollution Intelligence

The first release will support:
- AQI visualization
- PM2.5
- PM10
- NO2
- Ozone
- historical pollution analytics

---

# Base Map Provider

# OpenStreetMap

Primary mapping source:
- OpenStreetMap (OSM)

Website:
https://www.openstreetmap.org/

---

# Why OpenStreetMap

Reasons:
- open-source ecosystem
- open geographic data
- global coverage
- strong community
- self-hosting possibilities
- no Mapbox vendor lock-in

---

# Map Rendering

Frontend map rendering will use:
- MapLibre GL JS

Potential future additions:
- custom vector tiles
- self-hosted tile servers
- terrain layers
- satellite overlays

---

# OSM Attribution

OpenStreetMap attribution is REQUIRED.

The application must display:

© OpenStreetMap contributors

This attribution must remain visible on all map views.

---

# Air Pollution Sources

# OpenAQ

Primary air pollution provider.

Website:
https://openaq.org/

---

# Why OpenAQ

Reasons:
- open environmental data
- global coverage
- normalized pollution measurements
- multiple provider aggregation
- developer-friendly APIs

---

# Supported Metrics

Initial metrics:
- AQI
- PM2.5
- PM10
- NO2
- Ozone
- CO
- SO2

---

# OpenAQ Data Notes

OpenAQ aggregates data from:
- government agencies
- environmental monitoring stations
- research organizations

Data quality may vary by region.

The ingestion pipeline must support:
- validation
- normalization
- deduplication
- missing data handling

---

# Weather Data

# Open-Meteo

Primary weather provider.

Website:
https://open-meteo.com/

---

# Why Open-Meteo

Reasons:
- free
- open API
- no authentication required
- lightweight
- reliable forecasting

---

# Weather Metrics

Planned metrics:
- temperature
- humidity
- wind speed
- wind direction
- atmospheric pressure

Weather data may later support:
- pollution movement analysis
- forecasting
- environmental risk scoring

---

# Search & Geocoding

# Photon

Primary geocoding provider.

Website:
https://photon.komoot.io/

---

# Why Photon

Reasons:
- lightweight
- OpenStreetMap-based
- fast geocoding
- autocomplete support
- open ecosystem

---

# Search Features

Supported search:
- cities
- regions
- industrial zones
- landmarks
- addresses

---

# Future Geocoding Options

Potential future providers:
- Nominatim
- Pelias
- self-hosted geocoding

---

# Future Environmental Sources

# Water Pollution

Potential sources:
- GEMStat
- government environmental agencies
- river monitoring stations

Potential metrics:
- pH
- turbidity
- dissolved oxygen
- heavy metals

---

# Light Pollution

Potential sources:
- VIIRS nighttime datasets
- NASA Earth Observatory

Potential metrics:
- sky brightness
- urban glow
- nighttime emissions

---

# Noise Pollution

Potential sources:
- government urban noise datasets
- transportation datasets
- inferred traffic noise

---

# Soil Pollution

Potential sources:
- agricultural datasets
- environmental agencies
- industrial contamination databases

---

# Satellite Data Sources

# NASA EarthData

Website:
https://www.earthdata.nasa.gov/

Potential usage:
- atmospheric analysis
- wildfire smoke
- flood contamination
- environmental monitoring

---

# Copernicus Programme

Website:
https://www.copernicus.eu/

Potential usage:
- satellite imagery
- environmental monitoring
- air quality analysis
- land monitoring

---

# Ingestion Architecture

# Goals

The ingestion system must support:
- modular providers
- retries
- normalization
- scheduled syncs
- future extensibility

---

# Provider Structure

Example structure:

providers/
├── openaq/
├── openmeteo/
├── photon/
├── nasa/
└── copernicus/

Each provider should contain:
- client
- normalization logic
- validation
- transformers
- sync jobs

---

# Data Normalization

Different providers use:
- different units
- different timestamps
- different coordinate systems
- different schemas

All data must be normalized before storage.

---

# Normalized Environmental Schema

Example normalized fields:
- latitude
- longitude
- timestamp
- pollutant type
- measurement value
- unit
- provider source

---

# Database Requirements

Use:
- PostgreSQL
- PostGIS

Requirements:
- spatial indexing
- geospatial queries
- time-series storage
- efficient aggregation

---

# Licensing Considerations

# OpenStreetMap

Must provide attribution:
© OpenStreetMap contributors

License:
ODbL

---

# OpenAQ

Open environmental data.

Verify attribution requirements periodically.

---

# Open-Meteo

Free/open API.

Check rate limits and attribution rules.

---

# Future Considerations

Potential future additions:
- self-hosted tiles
- vector tile generation
- satellite raster layers
- realtime streams
- community-reported pollution data

---

# Long-Term Goals

OpenEnvMap should evolve into:
- a unified environmental intelligence platform
- a geospatial analytics system
- a public environmental data platform
- a modular GIS infrastructure

while remaining:
- lightweight
- open-data friendly
- extensible
- developer-focused
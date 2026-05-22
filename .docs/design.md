# OpenEnvMap Design System

# Overview

OpenEnvMap is a modern environmental intelligence platform focused on geospatial visualization, pollution analytics, and environmental monitoring.

The design language should feel:

- scientific
- atmospheric
- modern
- map-first
- data-centric
- minimal
- trustworthy

The UI must prioritize:
- readability
- geospatial clarity
- low visual noise
- smooth interaction
- long-session usability

---

# Core Design Philosophy

# Map First

The map is the primary interface.

All UI components should feel layered on top of the map rather than competing with it.

Avoid:
- dashboard-first layouts
- excessive panels
- visually heavy interfaces

Preferred approach:
- floating overlays
- contextual sidebars
- subtle surfaces
- collapsible controls

---

# Visual Style Direction

OpenEnvMap combines:

- modern GIS dashboards
- scientific observability platforms
- environmental intelligence systems

Inspired by:
- Mapbox dashboards
- observability UIs
- satellite intelligence systems
- modern weather platforms

Avoid:
- excessive glassmorphism
- overly playful UI
- enterprise-heavy aesthetics
- aggressive neo-brutalism

---

# UI Technology Stack

## Frontend
- Vue 3
- TailwindCSS
- shadcn-vue
- MapLibre GL JS

---

# Layout Principles

# Primary Layout

┌─────────────────────────────┐
│ Top Search Bar              │
├──────────────┬──────────────┤
│ Sidebar      │              │
│ Layers       │              │
│ Filters      │    MAP       │
│ Charts       │              │
│ Details      │              │
└──────────────┴──────────────┘

---

# Layout Rules

## Map Area
- dominant visual element
- always prioritized
- minimal obstruction

## Sidebar
- collapsible
- compact
- floating if possible

## Panels
- contextual
- lightweight
- scrollable

---

# Color System

# Base Colors

## Background
- charcoal
- deep navy
- dark slate

Suggested palette:
- #0B1220
- #111827
- #0F172A

---

# Surface Colors

Panels and overlays:
- semi-transparent dark surfaces
- subtle layering

Examples:
- rgba(15, 23, 42, 0.85)
- rgba(17, 24, 39, 0.90)

---

# Border Colors

Use:
- subtle low-contrast borders

Avoid:
- thick borders
- harsh separators

Examples:
- rgba(255,255,255,0.08)

---

# Environmental Accent Colors

## AQI
- green → yellow → orange → red → purple

## Water
- cyan → blue

## Noise
- yellow → orange

## Light Pollution
- violet → white

## Soil
- brown → red

---

# Typography

# Fonts

Primary font choices:
- Inter
- Geist
- Satoshi
- Manrope

---

# Typography Rules

## Headings
- clean
- modern
- medium/semi-bold

## Body Text
- highly readable
- neutral spacing

## Data Labels
- compact
- aligned
- low clutter

Avoid:
- decorative typography
- oversized headings

---

# Radius & Shapes

# Border Radius

Use:
- medium rounded corners

Examples:
- rounded-xl
- rounded-2xl

Avoid:
- fully square interfaces
- excessive pill shapes

---

# Shadows

Use:
- soft atmospheric shadows
- subtle depth

Avoid:
- hard neo-brutalist shadows
- exaggerated elevation

---

# Motion & Animation

# Motion Philosophy

Animations should feel:
- smooth
- calm
- responsive
- atmospheric

Avoid:
- bouncy animations
- flashy transitions
- excessive motion

---

# Recommended Motion

## Panels
- fade + slight slide

## Map Layers
- opacity transitions

## Search
- smooth fly-to animations

## Charts
- subtle animated rendering

---

# Component Design Rules

# Cards

Cards should:
- feel lightweight
- contain concise information
- use layered surfaces

Avoid:
- heavy boxed designs
- thick outlines

---

# Buttons

Use:
- clean modern buttons
- subtle hover states

Avoid:
- cartoonish buttons
- overly saturated gradients

---

# Inputs

Search inputs should:
- feel premium
- support autocomplete
- integrate smoothly with map UI

---

# Sidebar

Sidebar should contain:
- layer toggles
- filters
- legends
- charts
- environmental metrics

Must support:
- collapse
- responsive behavior
- mobile adaptation

---

# Popups

Map popups should display:
- AQI score
- pollutant breakdown
- timestamp
- trend preview

Keep concise.

---

# Charts

Charts should:
- prioritize readability
- use restrained color palettes
- support time-series analysis

Avoid:
- excessive gridlines
- overly colorful charts

---

# Layer Visualization Rules

# Pollution Layers

Each layer should have:
- unique color identity
- opacity controls
- legends
- smooth transitions

---

# Heatmaps

Heatmaps should:
- blend naturally into dark maps
- avoid oversaturation
- remain readable at multiple zoom levels

---

# Markers

Markers should:
- scale appropriately
- cluster cleanly
- support hover/click interactions

---

# Map Styling

# Preferred Style

Dark map themes only.

Examples:
- Mapbox Dark
- custom environmental dark themes

Reason:
- pollution overlays become more readable
- charts/panels feel cohesive
- stronger environmental atmosphere

---

# UX Principles

# Prioritize Clarity

Users should quickly understand:
- pollution severity
- affected areas
- historical trends

---

# Reduce Visual Noise

Environmental data is already visually dense.

The UI should simplify interpretation rather than add complexity.

---

# Progressive Disclosure

Do not overwhelm users immediately.

Show:
- summary first
- details on interaction

---

# Mobile Considerations

Mobile experience should:
- prioritize map visibility
- use bottom sheets
- support touch-friendly controls

---

# Accessibility

Support:
- sufficient contrast
- keyboard navigation
- readable typography
- colorblind-safe layer differentiation

---

# Future Design Expansion

The design system must support future modules:
- water pollution
- noise pollution
- light pollution
- soil analytics
- satellite overlays
- AI forecasting

without major redesign.

---

# Design Keywords

Use these keywords for future UI generation/prompts:

- modern GIS dashboard
- environmental intelligence platform
- atmospheric scientific UI
- dark geospatial analytics interface
- satellite monitoring aesthetic
- map-first design
- observability-inspired dashboard
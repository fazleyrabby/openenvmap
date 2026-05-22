<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from "vue";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { AirMeasurement, PollutantKey } from "../composables/useAirData";

const props = defineProps<{
  measurements: AirMeasurement[];
  activePollutant: PollutantKey;
}>();

const mapContainer = ref<HTMLDivElement | null>(null);
let map: maplibregl.Map | null = null;
let popup: maplibregl.Popup | null = null;

function getColor(value: number | null): string {
  if (value === null) return "#6b7280";
  if (value < 12) return "#22c55e";
  if (value < 35) return "#eab308";
  if (value < 55) return "#f97316";
  return "#ef4444";
}

interface PointFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: {
    id: number;
    locationName: string;
    country: string;
    pollutantValue: number | null;
    pollutantKey: string;
    timestamp: string;
    color: string;
  };
}

interface FeatureCollection {
  type: "FeatureCollection";
  features: PointFeature[];
}

function buildGeoJSON(measurements: AirMeasurement[], pollutant: PollutantKey): FeatureCollection {
  return {
    type: "FeatureCollection",
    features: measurements
      .filter((m) => m.latitude && m.longitude)
      .map((m): PointFeature => {
        const raw = m[pollutant];
        const value = raw !== null && raw !== undefined ? parseFloat(raw) : null;
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [parseFloat(m.longitude), parseFloat(m.latitude)],
          },
          properties: {
            id: m.id,
            locationName: m.locationName,
            country: m.country,
            pollutantValue: value,
            pollutantKey: pollutant,
            timestamp: m.timestamp,
            color: getColor(value),
          },
        };
      }),
  };
}

function updateLayer() {
  if (!map || !map.isStyleLoaded()) return;
  const geojson = buildGeoJSON(props.measurements, props.activePollutant);

  if (map.getSource("air-measurements")) {
    map.removeLayer("air-circles");
    map.removeSource("air-measurements");
  }

  map.addSource("air-measurements", { type: "geojson", data: geojson as object });
  map.addLayer({
    id: "air-circles",
    type: "circle",
    source: "air-measurements",
    paint: {
      "circle-radius": 7,
      "circle-color": ["get", "color"],
      "circle-opacity": 0.85,
      "circle-stroke-width": 1,
      "circle-stroke-color": "rgba(255,255,255,0.3)",
    },
  });

  map.on("click", "air-circles", (e) => {
    const feature = e.features?.[0];
    if (!feature) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const featureProps = feature.properties as any;
    const coord = (feature.geometry as { type: "Point"; coordinates: [number, number] }).coordinates;
    const value = featureProps.pollutantValue !== null && featureProps.pollutantValue !== undefined
      ? `${featureProps.pollutantValue}`
      : "N/A";
    const date = new Date(featureProps.timestamp).toLocaleString();

    popup?.remove();
    popup = new maplibregl.Popup({ closeButton: true, maxWidth: "260px" })
      .setLngLat(coord)
      .setHTML(`
        <div style="font-family:sans-serif;font-size:13px;line-height:1.5">
          <strong>${featureProps.locationName}</strong> <span style="color:#9ca3af">${featureProps.country}</span><br/>
          <span style="color:#d1d5db">${String(featureProps.pollutantKey).toUpperCase()}:</span> <strong>${value}</strong><br/>
          <span style="color:#6b7280;font-size:11px">${date}</span>
        </div>
      `)
      .addTo(map!);
  });

  map.on("mouseenter", "air-circles", () => {
    if (map) map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "air-circles", () => {
    if (map) map.getCanvas().style.cursor = "";
  });
}

onMounted(() => {
  if (!mapContainer.value) return;

  map = new maplibregl.Map({
    container: mapContainer.value,
    style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
    center: [0, 0],
    zoom: 2,
    attributionControl: false,
  });

  map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");
  map.addControl(new maplibregl.NavigationControl(), "top-right");
  map.addControl(new maplibregl.ScaleControl({ unit: "metric" }), "bottom-left");

  map.on("load", () => {
    if (props.measurements.length > 0) updateLayer();
  });
});

watch(
  () => [props.measurements, props.activePollutant] as const,
  () => {
    if (map?.isStyleLoaded()) updateLayer();
  },
  { deep: true }
);

onBeforeUnmount(() => {
  popup?.remove();
  map?.remove();
});

function flyTo(lng: number, lat: number) {
  map?.flyTo({ center: [lng, lat], zoom: 10, duration: 1200 });
}

defineExpose({ flyTo });
</script>

<template>
  <div ref="mapContainer" class="h-full w-full" />
</template>

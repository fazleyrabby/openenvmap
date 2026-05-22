<script setup lang="ts">
import { ref } from "vue";
import MapView from "./components/MapView.vue";
import SearchBar from "./components/SearchBar.vue";
import { useAirData } from "./composables/useAirData";
import type { PollutantKey } from "./composables/useAirData";

const activePollutant = ref<PollutantKey>("pm25");
const { measurements, loading, error, fetchData } = useAirData();
const mapRef = ref<InstanceType<typeof MapView> | null>(null);
</script>

<template>
  <div class="relative flex h-full w-full bg-gray-950 overflow-hidden">
    <!-- Sidebar -->
    <aside
      class="relative z-10 flex h-full w-80 flex-shrink-0 flex-col gap-4 bg-gray-900/90 p-4 backdrop-blur-sm border-r border-gray-700/50"
    >
      <!-- Logo / Title -->
      <div class="flex items-center gap-2 pt-1">
        <div class="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.6)]" />
        <h1 class="text-lg font-semibold tracking-tight text-white">
          OpenEnvMap
        </h1>
      </div>

      <p class="text-xs text-gray-400 leading-relaxed">
        Global open-source environmental data viewer. Air quality measurements
        sourced from OpenAQ and other open datasets.
      </p>

      <!-- Search -->
      <div class="flex flex-col gap-2">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-gray-500">Search</h2>
        <SearchBar @select="(r) => mapRef?.flyTo(r.lng, r.lat)" />
      </div>

      <hr class="border-gray-700/60" />

      <!-- Filters -->
      <div class="flex flex-col gap-3">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-gray-500">
          Filters
        </h2>

        <label class="flex flex-col gap-1">
          <span class="text-xs text-gray-400">Pollutant</span>
          <select
            v-model="activePollutant"
            class="rounded bg-gray-800 px-2 py-1.5 text-sm text-gray-200 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="pm25">PM2.5</option>
            <option value="pm10">PM10</option>
            <option value="no2">NO₂</option>
            <option value="ozone">Ozone</option>
            <option value="co">CO</option>
            <option value="so2">SO₂</option>
            <option value="aqi">AQI</option>
          </select>
        </label>
      </div>

      <!-- Stats / Status -->
      <div class="flex flex-col gap-2">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-gray-500">
          Data
        </h2>

        <!-- Loading state -->
        <div v-if="loading" class="flex items-center gap-2 text-xs text-gray-400">
          <svg
            class="h-3 w-3 animate-spin text-emerald-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span>Loading...</span>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="flex items-center gap-2 text-xs text-red-400">
          <span>Error: {{ error }}</span>
          <button
            class="ml-auto text-xs text-emerald-400 underline hover:text-emerald-300"
            @click="fetchData"
          >
            Retry
          </button>
        </div>

        <!-- Loaded state -->
        <div v-else-if="measurements.length > 0" class="text-xs text-gray-400">
          <span class="font-medium text-emerald-400">{{ measurements.length }}</span>
          {{ measurements.length === 1 ? "station" : "stations" }} loaded
        </div>

        <!-- Empty state -->
        <div v-else class="text-xs text-gray-600">
          No data available
        </div>
      </div>

      <!-- Color legend -->
      <div class="flex flex-col gap-2">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-gray-500">
          Legend
        </h2>
        <div class="flex flex-col gap-1.5">
          <div class="flex items-center gap-2">
            <span class="h-2.5 w-2.5 rounded-full bg-[#22c55e] flex-shrink-0" />
            <span class="text-xs text-gray-400">Good (&lt; 12)</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="h-2.5 w-2.5 rounded-full bg-[#eab308] flex-shrink-0" />
            <span class="text-xs text-gray-400">Moderate (12–35)</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="h-2.5 w-2.5 rounded-full bg-[#f97316] flex-shrink-0" />
            <span class="text-xs text-gray-400">Unhealthy (35–55)</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="h-2.5 w-2.5 rounded-full bg-[#ef4444] flex-shrink-0" />
            <span class="text-xs text-gray-400">Very unhealthy (&ge; 55)</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="h-2.5 w-2.5 rounded-full bg-[#6b7280] flex-shrink-0" />
            <span class="text-xs text-gray-400">No data</span>
          </div>
        </div>
      </div>

      <!-- Spacer -->
      <div class="flex-1" />

      <!-- Footer -->
      <p class="text-[10px] text-gray-600 text-center">
        Data: OpenAQ &bull; Map: OpenStreetMap / CartoDB &bull; MIT License
      </p>
    </aside>

    <!-- Map fills remaining space -->
    <main class="relative flex-1 h-full">
      <MapView ref="mapRef" :measurements="measurements" :active-pollutant="activePollutant" />
    </main>
  </div>
</template>

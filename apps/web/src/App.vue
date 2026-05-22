<script setup lang="ts">
import { ref } from "vue";
import MapView from "./components/MapView.vue";
import SearchBar from "./components/SearchBar.vue";
import { useAirData } from "./composables/useAirData";
import type { PollutantKey } from "./composables/useAirData";

const activePollutant = ref<PollutantKey>("pm25");
const { measurements, loading, error, fetchData } = useAirData();
const mapRef = ref<InstanceType<typeof MapView> | null>(null);
const sidebarOpen = ref(true);

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value;
}
</script>

<template>
  <div class="relative flex h-full w-full bg-gray-950 overflow-hidden">

    <!-- Mobile backdrop -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-20 bg-black/50 md:hidden"
      @click="toggleSidebar"
    />

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed md:relative z-30 md:z-10 flex h-full flex-col gap-4 bg-gray-900 md:bg-gray-900/90 p-4 backdrop-blur-sm border-r border-gray-700/50 transition-all duration-300 ease-in-out',
        'w-72 md:w-80 flex-shrink-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:-ml-80',
      ]"
    >
      <!-- Logo / Title + close button -->
      <div class="flex items-center gap-2 pt-1">
        <div class="h-3 w-3 rounded-full bg-emerald-400 flex-shrink-0 shadow-[0_0_8px_2px_rgba(52,211,153,0.6)]" />
        <h1 class="text-lg font-semibold tracking-tight text-white flex-1">
          OpenEnvMap
        </h1>
        <button
          class="ml-auto text-gray-500 hover:text-gray-300 transition-colors"
          @click="toggleSidebar"
          aria-label="Close sidebar"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <p class="text-xs text-gray-400 leading-relaxed">
        Global open-source environmental data viewer. Air quality measurements
        sourced from OpenAQ and other open datasets.
      </p>

      <!-- Search -->
      <div class="flex flex-col gap-2">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-gray-500">Search</h2>
        <SearchBar @select="(r) => { mapRef?.flyTo(r.lng, r.lat); if (window.innerWidth < 768) sidebarOpen = false; }" />
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
        <h2 class="text-xs font-semibold uppercase tracking-widest text-gray-500">Data</h2>
        <div v-if="loading" class="flex items-center gap-2 text-xs text-gray-400">
          <svg class="h-3 w-3 animate-spin text-emerald-400" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>Loading...</span>
        </div>
        <div v-else-if="error" class="flex items-center gap-2 text-xs text-red-400">
          <span>Error: {{ error }}</span>
          <button class="ml-auto text-xs text-emerald-400 underline hover:text-emerald-300" @click="fetchData">
            Retry
          </button>
        </div>
        <div v-else-if="measurements.length > 0" class="text-xs text-gray-400">
          <span class="font-medium text-emerald-400">{{ measurements.length }}</span>
          {{ measurements.length === 1 ? "station" : "stations" }} loaded
        </div>
        <div v-else class="text-xs text-gray-600">No data available</div>
      </div>

      <!-- Legend -->
      <div class="flex flex-col gap-2">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-gray-500">Legend</h2>
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

      <div class="flex-1" />

      <p class="text-[10px] text-gray-600 text-center">
        Data: OpenAQ &bull; Map: OpenStreetMap / CartoDB &bull; MIT License
      </p>
    </aside>

    <!-- Map -->
    <main class="relative flex-1 h-full w-full">
      <MapView ref="mapRef" :measurements="measurements" :active-pollutant="activePollutant" />

      <!-- Toggle button — always visible on map -->
      <button
        class="absolute top-3 left-3 z-20 flex items-center gap-2 rounded-lg bg-gray-900/90 backdrop-blur-sm border border-gray-700/50 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors shadow-lg"
        @click="toggleSidebar"
        aria-label="Toggle sidebar"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span class="text-xs font-medium hidden sm:inline">Menu</span>
      </button>
    </main>
  </div>
</template>

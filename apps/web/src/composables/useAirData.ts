import { ref, onMounted } from "vue";

export type PollutantKey = "pm25" | "pm10" | "no2" | "ozone" | "co" | "so2" | "aqi";

export interface AirMeasurement {
  id: number;
  latitude: string;
  longitude: string;
  aqi: string | null;
  pm25: string | null;
  pm10: string | null;
  no2: string | null;
  ozone: string | null;
  co: string | null;
  so2: string | null;
  timestamp: string;
  locationName: string;
  country: string;
  region: string | null;
}

export function useAirData() {
  const measurements = ref<AirMeasurement[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchData() {
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch("/api/air/latest");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      measurements.value = await res.json();
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to fetch";
    } finally {
      loading.value = false;
    }
  }

  onMounted(fetchData);

  return { measurements, loading, error, fetchData };
}

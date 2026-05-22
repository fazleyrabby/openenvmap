import { ref } from "vue";

export interface PhotonResult {
  name: string;
  country: string;
  state?: string;
  type: string;
  lng: number;
  lat: number;
}

export function usePhotonSearch() {
  const query = ref("");
  const results = ref<PhotonResult[]>([]);
  const searching = ref(false);

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  async function search(q: string) {
    query.value = q;
    if (!q.trim() || q.length < 2) {
      results.value = [];
      return;
    }

    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      searching.value = true;
      try {
        const res = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=5`
        );
        const data = await res.json();
        results.value = (data.features ?? []).map((f: any) => ({
          name: f.properties.name ?? "",
          country: f.properties.country ?? "",
          state: f.properties.state,
          type: f.properties.type ?? "",
          lng: f.geometry.coordinates[0],
          lat: f.geometry.coordinates[1],
        }));
      } catch {
        results.value = [];
      } finally {
        searching.value = false;
      }
    }, 300);
  }

  function clear() {
    query.value = "";
    results.value = [];
  }

  return { query, results, searching, search, clear };
}

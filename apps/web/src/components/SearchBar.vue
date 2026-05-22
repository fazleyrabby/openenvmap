<script setup lang="ts">
import { ref } from "vue";
import { usePhotonSearch, type PhotonResult } from "../composables/usePhotonSearch";

const emit = defineEmits<{ select: [result: PhotonResult] }>();

const inputRef = ref<HTMLInputElement | null>(null);
const showDropdown = ref(false);
const highlightedIndex = ref(-1);
const { query, results, searching, search, clear } = usePhotonSearch();

function onInput(e: Event) {
  const val = (e.target as HTMLInputElement).value;
  search(val);
  showDropdown.value = true;
  highlightedIndex.value = -1;
}

function selectResult(result: PhotonResult) {
  emit("select", result);
  clear();
  showDropdown.value = false;
  if (inputRef.value) inputRef.value.value = "";
}

function onKeydown(e: KeyboardEvent) {
  if (!showDropdown.value || results.value.length === 0) return;
  if (e.key === "ArrowDown") {
    e.preventDefault();
    highlightedIndex.value = Math.min(highlightedIndex.value + 1, results.value.length - 1);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0);
  } else if (e.key === "Enter" && highlightedIndex.value >= 0) {
    e.preventDefault();
    selectResult(results.value[highlightedIndex.value]);
  } else if (e.key === "Escape") {
    showDropdown.value = false;
  }
}

function onBlur() {
  setTimeout(() => { showDropdown.value = false; }, 150);
}
</script>

<template>
  <div class="relative w-full">
    <div class="relative">
      <input
        ref="inputRef"
        type="text"
        placeholder="Search city or region..."
        class="w-full rounded bg-gray-800 px-3 py-2 text-sm text-gray-200 border border-gray-700 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 pr-8"
        @input="onInput"
        @keydown="onKeydown"
        @focus="showDropdown = results.length > 0"
        @blur="onBlur"
      />
      <!-- Spinner or clear -->
      <div class="absolute right-2 top-1/2 -translate-y-1/2">
        <svg v-if="searching" class="h-3.5 w-3.5 animate-spin text-gray-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      </div>
    </div>

    <!-- Dropdown -->
    <ul
      v-if="showDropdown && results.length > 0"
      class="absolute z-50 mt-1 w-full rounded border border-gray-700 bg-gray-800 shadow-xl overflow-hidden"
    >
      <li
        v-for="(result, i) in results"
        :key="i"
        class="flex items-center gap-2 px-3 py-2 cursor-pointer text-sm transition-colors"
        :class="i === highlightedIndex ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700/60'"
        @mousedown.prevent="selectResult(result)"
      >
        <div class="flex-1 min-w-0">
          <span class="font-medium">{{ result.name }}</span>
          <span class="ml-1 text-xs text-gray-500">{{ [result.state, result.country].filter(Boolean).join(", ") }}</span>
        </div>
        <span class="text-[10px] text-gray-600 uppercase tracking-wide flex-shrink-0">{{ result.type }}</span>
      </li>
    </ul>
  </div>
</template>

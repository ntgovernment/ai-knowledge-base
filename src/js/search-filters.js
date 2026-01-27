// Client-side filtering and sorting for search results
import { displayAppliedFilters, getCurrentFilters } from "./applied-filters.js";

let allResults = []; // Store all results for filtering/sorting

/**
 * Store search results for filtering and sorting
 * Deduplicates results based on URL to prevent duplicate entries
 * @param {Array} results - Array of search result objects
 */
export function storeResults(results) {
  // Deduplicate results based on URL before storing
  const seenKeys = new Set();
  const deduplicatedResults = [];

  results.forEach((result, index) => {
    // Create unique identifier - use URL, title, or JSON stringify as final fallback
    const uniqueKey =
      result.liveUrl ||
      result.url ||
      result.title ||
      JSON.stringify(result) + index;

    if (!seenKeys.has(uniqueKey)) {
      seenKeys.add(uniqueKey);
      deduplicatedResults.push(result);
    }
  });

  allResults = deduplicatedResults;
  console.log(
    `Stored ${allResults.length} results for filtering/sorting (${results.length - allResults.length} duplicates removed)`,
  );
}

/**
 * Filter results by work area
 * @param {Array} selectedWorkAreas - Selected work area values
 * @returns {Array} - Filtered results
 */
function filterByWorkArea(selectedWorkAreas) {
  if (!selectedWorkAreas || selectedWorkAreas.length === 0) {
    return allResults; // Return all if no filter selected
  }

  // Filter results and track unique items to prevent duplicates
  const seenKeys = new Set();
  const filtered = [];

  allResults.forEach((result, index) => {
    if (!result.listMetadata || !result.listMetadata["Work area"]) {
      return;
    }

    const resultWorkAreas = result.listMetadata["Work area"];

    // Check if any selected work area matches
    const matches = selectedWorkAreas.some((selectedArea) =>
      resultWorkAreas.includes(selectedArea),
    );

    if (matches) {
      // Create unique identifier - use URL, title, or JSON stringify as final fallback
      const uniqueKey =
        result.liveUrl ||
        result.url ||
        result.title ||
        JSON.stringify(result) + index;

      // Only add if not already seen (prevents duplicates)
      if (!seenKeys.has(uniqueKey)) {
        seenKeys.add(uniqueKey);
        filtered.push(result);
      }
    }
  });

  return filtered;
}

/**
 * Sort results by selected criteria
 * @param {Array} results - Results to sort
 * @param {string} sortBy - Sort criteria (relevance, date-newest, date-oldest, title-az, title-za)
 * @returns {Array} - Sorted results
 */
function sortResults(results, sortBy) {
  const sorted = [...results]; // Create copy to avoid mutating original

  switch (sortBy) {
    case "relevance":
      // Sort by rank (lower is better) or score (higher is better)
      sorted.sort((a, b) => {
        if (a.rank && b.rank) {
          return a.rank - b.rank;
        }
        if (a.score && b.score) {
          return b.score - a.score;
        }
        return 0;
      });
      break;

    case "date-newest":
      sorted.sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA; // Newest first
      });
      break;

    case "date-oldest":
      sorted.sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateA - dateB; // Oldest first
      });
      break;

    case "title-az":
      sorted.sort((a, b) => {
        const titleA = a.title || "";
        const titleB = b.title || "";
        return titleA.localeCompare(titleB);
      });
      break;

    case "title-za":
      sorted.sort((a, b) => {
        const titleA = a.title || "";
        const titleB = b.title || "";
        return titleB.localeCompare(titleA);
      });
      break;

    default:
      // No sorting or unknown sort option
      break;
  }

  return sorted;
}

// Track if filter/sort is currently being applied to prevent concurrent executions
let isApplying = false;

/**
 * Apply filters and sorting, then render results
 */
export async function applyFiltersAndSort() {
  // Prevent concurrent executions
  if (isApplying) {
    console.log("Filter/sort already in progress, skipping duplicate call");
    return;
  }

  isApplying = true;

  try {
    // Get work area dropdown (may be multi-select)
    const workAreaDropdown = document.getElementById("document_type");
    // Support both legacy id="owner" and current id="sort"
    const sortDropdown =
      document.getElementById("sort") || document.getElementById("owner");

    if (!workAreaDropdown || !sortDropdown) {
      console.warn("Required dropdowns not found (document_type or sort)");
      return;
    }

    // Get selected work areas
    let selectedWorkAreas = [];
    if (workAreaDropdown) {
      const selectedOptions = Array.from(
        workAreaDropdown.selectedOptions || [],
      );
      // Remove empty/default values so an unselected state returns all results
      selectedWorkAreas = selectedOptions
        .map((opt) => opt.value)
        .filter((val) => val && val.trim().length > 0);
    }

    const selectedSort = sortDropdown.value || "relevance";

    console.log(
      `Applying filters - Work Areas: [${selectedWorkAreas.join(
        ", ",
      )}], Sort: "${selectedSort}"`,
    );

    // Filter by work areas
    let filtered = filterByWorkArea(selectedWorkAreas);
    console.log(`After filtering: ${filtered.length} results`);

    // Sort results
    let sorted = sortResults(filtered, selectedSort);
    console.log(`After sorting: ${sorted.length} results`);

    // Render filtered and sorted results
    const { renderResults } = await import("./search-card-template.js");
    renderResults(sorted, "search-results-list");

    // Display applied filters
    const currentFilters = getCurrentFilters();
    displayAppliedFilters(currentFilters);
  } finally {
    isApplying = false;
  }
}

// Track if listeners have been initialized to prevent duplicate event handlers
let listenersInitialized = false;

/**
 * Initialize filter and sort listeners
 */
export function initializeFiltersAndSort() {
  // Prevent multiple initializations that would create duplicate event listeners
  if (listenersInitialized) {
    console.log("Filter and sort listeners already initialized, skipping");
    return;
  }

  const workAreaDropdown = document.getElementById("document_type");
  // Support both legacy id="owner" and current id="sort"
  const sortDropdown =
    document.getElementById("sort") || document.getElementById("owner");

  if (workAreaDropdown) {
    workAreaDropdown.addEventListener("change", function () {
      console.log("Work area filter changed");
      applyFiltersAndSort();
    });

    // Listen for custom multi-select events (our custom component) to reapply filters
    const multiSelectContainer = workAreaDropdown.nextElementSibling;
    if (
      multiSelectContainer &&
      multiSelectContainer.classList.contains("aikb-multiselect-container")
    ) {
      multiSelectContainer.addEventListener("multiselect-change", () => {
        console.log("Work area filter applied via custom multi-select");
        applyFiltersAndSort();
      });
    }

    // Legacy SumoSelect support: trigger filtering when the OK button is clicked/closed
    if (typeof window.$ !== "undefined") {
      window.$(workAreaDropdown).on("sumo:closed", function () {
        console.log("Work area filter applied via SumoSelect OK");
        applyFiltersAndSort();
      });
    }
  }

  if (sortDropdown) {
    sortDropdown.addEventListener("change", function () {
      console.log(`Sort changed to: ${this.value}`);
      applyFiltersAndSort();
    });
  }

  listenersInitialized = true;
  console.log("Filter and sort listeners initialized");
}

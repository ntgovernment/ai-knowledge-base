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
        const dateA = a.dateTimestamp || 0;
        const dateB = b.dateTimestamp || 0;
        return dateB - dateA; // Newest first
      });
      break;

    case "date-oldest":
      sorted.sort((a, b) => {
        const dateA = a.dateTimestamp || 0;
        const dateB = b.dateTimestamp || 0;
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

/**
 * Sort cards in the DOM by data attributes
 * @param {string} sortBy - Sort criteria (relevance, date-newest, date-oldest, title-az, title-za)
 */
function sortCardsInDOM(sortBy) {
  const container = document.getElementById("search-results-list");
  if (!container) return;

  const cards = Array.from(container.querySelectorAll(".aikb-search-card"));

  cards.sort((a, b) => {
    switch (sortBy) {
      case "relevance":
        // Higher relevance first
        const relA = parseFloat(a.getAttribute("data-sort-relevance")) || 0;
        const relB = parseFloat(b.getAttribute("data-sort-relevance")) || 0;
        return relB - relA;

      case "date-newest":
        // Newer dates first (higher timestamp)
        const dateA = parseFloat(a.getAttribute("data-sort-date")) || 0;
        const dateB = parseFloat(b.getAttribute("data-sort-date")) || 0;
        return dateB - dateA;

      case "date-oldest":
        // Older dates first (lower timestamp)
        const dateC = parseFloat(a.getAttribute("data-sort-date")) || 0;
        const dateD = parseFloat(b.getAttribute("data-sort-date")) || 0;
        return dateC - dateD;

      case "title-az":
        // A to Z
        const titleA = a.getAttribute("data-sort-title") || "";
        const titleB = b.getAttribute("data-sort-title") || "";
        return titleA.localeCompare(titleB);

      case "title-za":
        // Z to A
        const titleC = a.getAttribute("data-sort-title") || "";
        const titleD = b.getAttribute("data-sort-title") || "";
        return titleD.localeCompare(titleC);

      default:
        return 0;
    }
  });

  // Re-append cards in sorted order
  cards.forEach((card) => container.appendChild(card));
}

// Track if filter/sort is currently being applied to prevent concurrent executions
let isApplying = false;

/**
 * Apply filters and sorting, then render results
 */
export async function applyFiltersAndSort() {
  // Prevent concurrent executions
  if (isApplying) {
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

    // Filter by work areas
    let filtered = filterByWorkArea(selectedWorkAreas);

    // Sort results (for pagination compatibility)
    let sorted = sortResults(filtered, selectedSort);

    // Render filtered and sorted results
    const { renderResults } = await import("./search-card-template.js");
    renderResults(sorted, "search-results-list");

    // Apply DOM-based sorting using data attributes
    sortCardsInDOM(selectedSort);

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
    return;
  }

  const workAreaDropdown = document.getElementById("document_type");
  // Support both legacy id="owner" and current id="sort"
  const sortDropdown =
    document.getElementById("sort") || document.getElementById("owner");

  if (workAreaDropdown) {
    workAreaDropdown.addEventListener("change", function () {
      applyFiltersAndSort();
    });

    // Listen for custom multi-select events (our custom component) to reapply filters
    const multiSelectContainer = workAreaDropdown.nextElementSibling;
    if (
      multiSelectContainer &&
      multiSelectContainer.classList.contains("aikb-multiselect-container")
    ) {
      multiSelectContainer.addEventListener("multiselect-change", () => {
        applyFiltersAndSort();
      });
    }

    // Legacy SumoSelect support: trigger filtering when the OK button is clicked/closed
    if (typeof window.$ !== "undefined") {
      window.$(workAreaDropdown).on("sumo:closed", function () {
        applyFiltersAndSort();
      });
    }
  }

  if (sortDropdown) {
    sortDropdown.addEventListener("change", function () {
      applyFiltersAndSort();
    });
  }

  listenersInitialized = true;
}

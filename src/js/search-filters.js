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
 * @param {string} selectedWorkArea - Selected work area value (or "All work areas")
 * @returns {Array} - Filtered results
 */
function filterByWorkArea(selectedWorkArea) {
  // If "All work areas" or no selection, return all results
  if (!selectedWorkArea || selectedWorkArea === "All work areas") {
    return allResults;
  }

  // Filter results to those containing the selected work area
  const filtered = allResults.filter((result) => {
    if (!result.listMetadata || !result.listMetadata["Work area"]) {
      return false;
    }

    const resultWorkAreas = result.listMetadata["Work area"];

    // Ensure resultWorkAreas is an array before processing
    if (!Array.isArray(resultWorkAreas)) {
      return false;
    }

    // Check if the selected work area is in this result's work areas
    return resultWorkAreas.includes(selectedWorkArea);
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
    // Get work area dropdown
    const workAreaDropdown = document.getElementById("document_type");
    // Support both legacy id="owner" and current id="sort"
    const sortDropdown =
      document.getElementById("sort") || document.getElementById("owner");

    if (!workAreaDropdown || !sortDropdown) {
      return;
    }

    // Get selected work area (single value)
    const selectedWorkArea = workAreaDropdown.value || "All work areas";
    const selectedSort = sortDropdown.value || "relevance";

    // Filter by work area
    let filtered = filterByWorkArea(selectedWorkArea);

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
  }

  if (sortDropdown) {
    sortDropdown.addEventListener("change", function () {
      applyFiltersAndSort();
    });
  }

  listenersInitialized = true;
}

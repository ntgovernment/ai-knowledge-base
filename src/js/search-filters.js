// Client-side filtering and sorting for search results
import { displayAppliedFilters, getCurrentFilters } from "./applied-filters.js";

let allResults = []; // Store all results for filtering/sorting

/**
 * Store search results for filtering and sorting
 * @param {Array} results - Array of search result objects
 */
export function storeResults(results) {
  allResults = results;
  console.log(`Stored ${allResults.length} results for filtering/sorting`);
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

  return allResults.filter((result) => {
    if (!result.listMetadata || !result.listMetadata["Work area"]) {
      return false;
    }

    const resultWorkAreas = result.listMetadata["Work area"];

    // If result has "All work areas", it appears in all filtered views
    if (resultWorkAreas.includes("All work areas")) {
      return true;
    }

    // Check if any selected work area matches
    return selectedWorkAreas.some((selectedArea) =>
      resultWorkAreas.includes(selectedArea)
    );
  });
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

/**
 * Apply filters and sorting, then render results
 */
async function applyFiltersAndSort() {
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
    const selectedOptions = Array.from(workAreaDropdown.selectedOptions || []);
    // Remove empty/default values so an unselected state returns all results
    selectedWorkAreas = selectedOptions
      .map((opt) => opt.value)
      .filter((val) => val && val.trim().length > 0);
  }

  const selectedSort = sortDropdown.value || "relevance";

  console.log(
    `Applying filters - Work Areas: [${selectedWorkAreas.join(
      ", "
    )}], Sort: "${selectedSort}"`
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
}

/**
 * Initialize filter and sort listeners
 */
export function initializeFiltersAndSort() {
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

  console.log("Filter and sort listeners initialized");
}

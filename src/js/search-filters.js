// Client-side filtering and sorting for search results

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
    if (
      !result.listMetadata ||
      !result.listMetadata.keyword ||
      !result.listMetadata.keyword[0]
    ) {
      return false;
    }

    const resultWorkAreas = result.listMetadata.keyword[0];

    // Check if any selected work area matches (handle comma-separated values)
    const workAreaArray = resultWorkAreas.split(",").map((area) => area.trim());

    return selectedWorkAreas.some((selectedArea) =>
      workAreaArray.includes(selectedArea)
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
  const workAreaContainer = document.querySelector(
    ".aikb-multiselect-container"
  );
  const sortDropdown = document.getElementById("owner");

  if (!sortDropdown) {
    console.warn("Sort dropdown not found");
    return;
  }

  // Get selected work areas from multi-select
  let selectedWorkAreas = [];
  if (workAreaContainer && workAreaContainer.__multiSelectInstance) {
    selectedWorkAreas =
      workAreaContainer.__multiSelectInstance.getSelectedValues();
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
}

/**
 * Initialize filter and sort listeners
 */
export function initializeFiltersAndSort() {
  const workAreaContainer = document.querySelector(
    ".aikb-multiselect-container"
  );
  const sortDropdown = document.getElementById("owner");

  if (workAreaContainer) {
    workAreaContainer.addEventListener("multiselect-change", function () {
      console.log("Work area multi-select changed");
      applyFiltersAndSort();
    });
  }

  if (sortDropdown) {
    sortDropdown.addEventListener("change", function () {
      console.log(`Sort changed to: ${this.value}`);
      applyFiltersAndSort();
    });
  }

  console.log("Filter and sort listeners initialized");
}

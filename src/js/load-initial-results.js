// Load initial search results from local search or live API on page load
import { renderResults } from "./search-card-template.js";
import {
  initializeDropdowns,
  setStaticWorkAreas,
} from "./populate-dropdowns.js";
import { storeResults, initializeFiltersAndSort } from "./search-filters.js";
import {
  getPrimaryDataSource,
  getFallbackDataSource,
  getWorkAreasDataSource,
  getConfig,
} from "./config.js";

let fetchedWorkAreas = null;

/**
 * Fetch work areas list from static source
 * @returns {Promise<Array<string>>} Promise that resolves to array of work areas
 */
async function fetchWorkAreasList() {
  const workAreasSource = getWorkAreasDataSource();

  try {
    const response = await fetch(workAreasSource);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return null; // Will fall back to extracting from results
  }
}

// Export for use in search-form-handler
export function loadInitialResults() {
  // Check if we're on a page with search results container
  const searchResultsContainer = document.getElementById("search-results-list");
  if (!searchResultsContainer) {
    return; // Not on search results page
  }

  const config = getConfig();
  const primarySource = getPrimaryDataSource();
  const fallbackSource = getFallbackDataSource();

  // Fetch work areas list first (parallel with results loading)
  fetchWorkAreasList().then((workAreas) => {
    if (workAreas) {
      fetchedWorkAreas = workAreas;
      setStaticWorkAreas(workAreas);
    }
  });

  // Fetch from primary data source
  fetch(primarySource)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      processAndRenderResults(data, config.isProduction ? "live-api" : "local");
    })
    .catch((primaryError) => {
      // Only try fallback if in production
      if (fallbackSource) {
        fetch(fallbackSource)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            processAndRenderResults(data, "fallback");
          })
          .catch((fallbackError) => {
            displayErrorMessage();
          });
      } else {
        // Local dev with no fallback - show error
        displayErrorMessage();
      }
    });
}

function displayErrorMessage() {
  const container = document.getElementById("search-results-list");
  if (container) {
    container.innerHTML =
      '<p class="aikb-error">Unable to load search results. Please check your connection and try again later.</p>';
  }
}

function processAndRenderResults(data, source = "unknown") {
  // Handle array data directly (local JSON format)
  const results = Array.isArray(data) ? data : [];

  // Map to card template format
  const mappedResults = results.map((result) => {
    // Parse timestamp for sorting
    const dateTimestamp = result["last-updated"]
      ? new Date(result["last-updated"]).getTime()
      : 0;

    return {
      title: result.title || "",
      summary: result.description || result.summary || "",
      listMetadata: {
        "Work area": result["work-area"] || [],
        Roles: result.roles || [],
        Benefits: result.benefits || [],
      },
      date: result["last-updated"]
        ? new Date(result["last-updated"]).toLocaleDateString("en-AU", {
            year: "numeric",
            month: "long",
          })
        : "",
      dateTimestamp: dateTimestamp,
      liveUrl: result.url || result.liveUrl || "",
      submittedBy: result["submitted-by"] || "",
      rank: result.rank || 0,
      score: result.score || 0,
    };
  });

  // Deduplicate results before storing/caching
  const seenKeys = new Set();
  const deduplicatedResults = [];

  mappedResults.forEach((result, index) => {
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

  // Store results for filtering/sorting
  storeResults(deduplicatedResults);

  // Cache results for offline search
  window.aikbSearchCache = deduplicatedResults;

  // Initialize dropdowns with work area data
  // Pass fetched work areas if available
  initializeDropdowns(deduplicatedResults, fetchedWorkAreas);

  // Initialize filter and sort listeners after each results update
  initializeFiltersAndSort();

  // Render cards using the template
  renderResults(deduplicatedResults, "search-results-list");
}

// Wait for complete page load (not just DOM ready)
window.addEventListener("load", function () {
  // Extra delay after full page load to ensure all scripts initialized
  setTimeout(loadInitialResults, 200);
});

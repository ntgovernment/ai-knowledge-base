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
  console.log(`Fetching work areas from ${workAreasSource}...`);

  try {
    const response = await fetch(workAreasSource);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(`Work areas loaded successfully:`, data);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Error fetching work areas from ${workAreasSource}:`, error);
    return null; // Will fall back to extracting from results
  }
}

// Export for use in search-form-handler
export function loadInitialResults() {
  // Check if we're on a page with search results container
  const searchResultsContainer = document.getElementById("search-results-list");
  if (!searchResultsContainer) {
    console.warn("search-results-list container not found on page");
    return; // Not on search results page
  }

  const config = getConfig();
  const primarySource = getPrimaryDataSource();
  const fallbackSource = getFallbackDataSource();

  console.log(
    `Loading initial results from ${
      config.isProduction ? "live API" : "local JSON"
    }...`,
  );

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
      console.log(
        `Primary source (${primarySource}) response status:`,
        response.status,
        response.ok,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(
        `Primary source data loaded successfully (${
          config.isProduction ? "live API" : "local JSON"
        }):`,
        data,
      );
      processAndRenderResults(data, config.isProduction ? "live-api" : "local");
    })
    .catch((primaryError) => {
      console.error(
        `Error loading from primary source (${primarySource}):`,
        primaryError,
      );

      // Only try fallback if in production
      if (fallbackSource) {
        console.log("Attempting fallback to local JSON...");
        fetch(fallbackSource)
          .then((response) => {
            console.log(
              "Fallback JSON response status:",
              response.status,
              response.ok,
            );
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            console.log("Fallback JSON data loaded successfully:", data);
            processAndRenderResults(data, "fallback");
          })
          .catch((fallbackError) => {
            console.error("Error loading fallback search.json:", fallbackError);
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
  const mappedResults = results.map((result) => ({
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
    liveUrl: result.url || result.liveUrl || "",
    submittedBy: result["submitted-by"] || "",
  }));

  console.log(`Rendering ${mappedResults.length} cards from ${source}`);

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

  if (mappedResults.length !== deduplicatedResults.length) {
    console.log(
      `Removed ${mappedResults.length - deduplicatedResults.length} duplicate items from source data`,
    );
  }

  // Store results for filtering/sorting
  storeResults(deduplicatedResults);

  // Cache results for offline search
  window.aikbSearchCache = deduplicatedResults;
  console.log(
    `Cached ${deduplicatedResults.length} results for offline search`,
  );

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
  console.log("Page load event fired, loading initial results...");
  // Extra delay after full page load to ensure all scripts initialized
  setTimeout(loadInitialResults, 200);
});

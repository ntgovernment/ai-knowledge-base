// Load initial search results from local search or live API on page load
import { renderResults } from "./search-card-template.js";
import { initializeDropdowns } from "./populate-dropdowns.js";
import { storeResults, initializeFiltersAndSort } from "./search-filters.js";
import {
  getPrimaryDataSource,
  getFallbackDataSource,
  getConfig,
} from "./config.js";

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
    }...`
  );

  // Fetch from primary data source
  fetch(primarySource)
    .then((response) => {
      console.log(
        `Primary source (${primarySource}) response status:`,
        response.status,
        response.ok
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
        data
      );
      processAndRenderResults(data, config.isProduction ? "live-api" : "local");
    })
    .catch((primaryError) => {
      console.error(
        `Error loading from primary source (${primarySource}):`,
        primaryError
      );

      // Only try fallback if in production
      if (fallbackSource) {
        console.log("Attempting fallback to local JSON...");
        fetch(fallbackSource)
          .then((response) => {
            console.log(
              "Fallback JSON response status:",
              response.status,
              response.ok
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

  // Store results for filtering/sorting
  storeResults(mappedResults);

  // Cache results for offline search
  window.aikbSearchCache = mappedResults;
  console.log(`Cached ${mappedResults.length} results for offline search`);

  // Initialize dropdowns with work area data
  initializeDropdowns(mappedResults);

  // Initialize filter and sort listeners after each results update
  initializeFiltersAndSort();

  // Render cards using the template
  renderResults(mappedResults, "search-results-list");
}

// Wait for complete page load (not just DOM ready)
window.addEventListener("load", function () {
  console.log("Page load event fired, loading initial results...");
  // Extra delay after full page load to ensure all scripts initialized
  setTimeout(loadInitialResults, 200);
});

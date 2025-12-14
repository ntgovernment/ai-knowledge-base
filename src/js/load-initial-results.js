// Load initial search results from Funnelback API on page load
import { renderResults } from "./search-card-template.js";
import { initializeDropdowns } from "./populate-dropdowns.js";
import { storeResults, initializeFiltersAndSort } from "./search-filters.js";

// Export for use in search-form-handler
export function loadInitialResults() {
  // Check if we're on a page with search results container
  const searchResultsContainer = document.getElementById("search-results-list");
  if (!searchResultsContainer) {
    console.warn("search-results-list container not found on page");
    return; // Not on search results page
  }

  console.log("Loading initial results (fallback first, then API)...");

  // Load fallback JSON immediately for fast initial display
  fetch("./dist/search.json")
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
      console.error("Attempted path: ./dist/search.json");
      // Continue anyway - API might still work
    });

  // Fetch from Funnelback API in background (will update results when ready)
  const apiURL =
    "https://ntgov-search.funnelback.squiz.cloud/s/search.json?collection=ntgov~sp-ntgc-ai-knowledge-base&s=!FunDoesNotExist:PadreNull";

  fetch(apiURL)
    .then((response) => {
      console.log(
        "Funnelback API response status:",
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
        "Funnelback API data loaded successfully, updating results:",
        data
      );
      processAndRenderResults(data, "api");
    })
    .catch((error) => {
      console.warn("Funnelback API failed:", error);
      console.warn("API URL:", apiURL);
      console.warn("Error type:", error.message);
      // Check if we have cached data
      if (!window.aikbSearchCache || window.aikbSearchCache.length === 0) {
        const container = document.getElementById("search-results-list");
        if (container) {
          container.innerHTML =
            '<p class="aikb-error">Search unavailable. Please try again later.</p>';
        }
      }
    });
}

function processAndRenderResults(data, source = "unknown") {
  // Extract results from Funnelback response structure
  const results =
    data.response && data.response.resultPacket
      ? data.response.resultPacket.results
      : [];

  // Map to card template format
  const mappedResults = results.map((result) => ({
    title: result.title || "",
    summary: result.summary || "",
    listMetadata: result.listMetadata || {},
    date: result.date
      ? new Date(result.date).toLocaleDateString("en-AU", {
          year: "numeric",
          month: "long",
        })
      : "",
    liveUrl: result.liveUrl || "",
    rank: result.rank || 0,
    score: result.score || 0,
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

// Load initial search results from search.json on page load
import { renderResults } from "./search-card-template.js";

(function () {
  function loadInitialResults() {
    // Check if we're on a page with search results container
    const searchResultsContainer = document.getElementById(
      "search-results-list"
    );
    if (!searchResultsContainer) {
      console.warn("search-results-list container not found on page");
      return; // Not on search results page
    }

    console.log("Loading initial results...");

    // Load search.json and render as cards
    fetch("src/data/search.json")
      .then((response) => {
        console.log("Fetch response status:", response.status, response.ok);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("JSON data loaded successfully:", data);

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
        }));

        console.log("Rendering", mappedResults.length, "cards");

        // Render cards using the template
        renderResults(mappedResults, "search-results-list");
      })
      .catch((error) => {
        console.error("Error loading search.json:", error);
        searchResultsContainer.innerHTML =
          "<p>Error loading search data: " + error.message + "</p>";
      });
  }

  // Wait for complete page load (not just DOM ready)
  window.addEventListener("load", function () {
    console.log("Page load event fired, loading initial results...");
    // Extra delay after full page load to ensure all scripts initialized
    setTimeout(loadInitialResults, 200);
  });
})();

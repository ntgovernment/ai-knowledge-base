// Search form handler - Enter key trigger
import { searchLocalData, getCachedData } from "./offline-search.js";
import { loadInitialResults } from "./load-initial-results.js";
import { renderResults } from "./search-card-template.js";
import { storeResults, applyFiltersAndSort } from "./search-filters.js";

// Wait for DOM ready
window.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search");

  if (!searchInput) {
    return;
  }

  // Enter key triggers search
  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      const query = searchInput.value.trim();

      if (query === "") {
        // Empty Enter reloads initial results
        loadInitialResults();
      } else {
        // Perform immediate offline search for fast results
        const cachedData = getCachedData();

        if (cachedData && cachedData.length > 0) {
          const results = searchLocalData(query, cachedData);
          storeResults(results);
          applyFiltersAndSort();
        } else {
          const $container = window.$("#search-results-list");
          if ($container && $container.length > 0) {
            $container.html(
              '<p class="aikb-error">Unable to load search results. Please check your connection and try again.</p>',
            );
          }
        }
      }
    }
  });
});

/**
 * Search Form Handler
 * Wires the #policy-search-form submission to trigger Funnelback API calls
 * and populate #search-results-list with results
 */

import { loadInitialResults } from "./load-initial-results.js";
import { renderResults } from "./search-card-template.js";
import { searchLocalData, getCachedData } from "./offline-search.js";
import { storeResults, initializeFiltersAndSort } from "./search-filters.js";
import { initializeDropdowns } from "./populate-dropdowns.js";
import { displayAppliedFilters, getCurrentFilters } from "./applied-filters.js";

// Initialize search form handler
(function initSearchForm() {
  // Only initialize if jQuery is available
  if (typeof window.$ === "undefined") {
    console.warn("jQuery not loaded; search form handler disabled");
    return;
  }

  const $form = window.$("#policy-search-form");
  const $searchInput = window.$("#search");

  if ($form.length === 0) {
    console.error("Form #policy-search-form not found");
    return;
  }

  /**
   * Extract search parameters from form
   * @returns {Object} Search parameters {query, area, ...}
   */
  function getSearchParams() {
    return {
      query: $searchInput.val() || "",
      area: window.$("#document_type").val() || "",
    };
  }

  /**
   * Prevent form submission (search is triggered by Enter key only)
   */
  function handleFormSubmit(event) {
    event.preventDefault();
    // Form submission prevented - search only happens on Enter key press
  }

  /**
   * Handle clear input button click
   * Clear the search field and reload initial results
   */
  function handleClearInput() {
    $searchInput.val("");
    console.log("Search cleared - reloading initial results");
    loadInitialResults();
  }

  // Attach form submission handler
  $form.on("submit", handleFormSubmit);

  // Attach clear input handler
  window.$("#clear-input").on("click", handleClearInput);

  // Show/hide clear button based on input state (but don't search yet)
  $searchInput.on("input", function () {
    const $clearBtn = window.$("#clear-input");
    if (window.$(this).val().length > 0) {
      $clearBtn.attr("hidden", false);
    } else {
      $clearBtn.attr("hidden", "");
    }
  });

  // Trigger search when user presses Enter in the search input
  $searchInput.on("keydown", function (event) {
    if (event.key === "Enter" || event.keyCode === 13) {
      event.preventDefault();
      const searchText = window.$(this).val();
      if (searchText.trim()) {
        triggerSearch(searchText);
      } else {
        console.log("Empty search via Enter - reloading initial results");
        loadInitialResults();
      }
    }
  });

  /**
   * Trigger search with the given query text
   * @param {string} queryText - The search query from the input field
   */
  function triggerSearch(queryText) {
    if (!queryText.trim()) {
      return; // Don't search for empty text
    }

    console.log(`Triggered search for: "${queryText}"`);

    // Perform local/offline search
    const cachedData = getCachedData();
    if (cachedData && cachedData.length > 0) {
      console.log("Performing local search");
      const localResults = searchLocalData(queryText, cachedData);

      // Store and render local search results
      storeResults(localResults);
      initializeDropdowns(localResults);
      initializeFiltersAndSort();
      renderResults(localResults, "search-results-list");

      // Display applied filters
      const currentFilters = getCurrentFilters();
      displayAppliedFilters(currentFilters);

      console.log(`Local search: Displayed ${localResults.length} results`);
    } else {
      // No cached data - show error
      console.error("No cached data available for search");
      const $container = window.$("#search-results-list");
      if ($container.length > 0) {
        $container.html(
          '<p class="aikb-error">Unable to load search results. Please check your connection and try again.</p>'
        );
      }
    }
  }

  console.log("Search form handler initialized");
})();

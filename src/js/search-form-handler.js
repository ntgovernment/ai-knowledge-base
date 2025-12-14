/**
 * Search Form Handler
 * Wires the #policy-search-form submission to trigger Funnelback API calls
 * and populate #search-results-list with results
 */

import { loadInitialResults } from "./load-initial-results.js";
import { renderResults } from "./search-card-template.js";
import { searchLocalData, getCachedData } from "./offline-search.js";
import { storeResults } from "./search-filters.js";
import { initializeDropdowns } from "./populate-dropdowns.js";

// Dynamically create the search input container markup on page load
(function initSearchForm() {
  window.addEventListener("DOMContentLoaded", function () {
    var textQuestion = document.getElementById("text-question");
    if (textQuestion) {
      // Remove any existing .search-input-container
      var old = textQuestion.querySelector(".search-input-container");
      if (old) old.remove();

      // Create the container
      var container = document.createElement("div");
      container.className = "search-input-container";

      // Label
      var label = document.createElement("label");
      label.className = "ntgc-form-input--label";
      label.setAttribute("for", "search");
      label.textContent = "Search";
      container.appendChild(label);

      // Inner wrapper
      var inner = document.createElement("div");
      inner.style.position = "relative";

      // Input
      var input = document.createElement("input");
      input.type = "text";
      input.name = "query";
      input.id = "search";
      input.className =
        "ntgc-text-input ntgc-text-input--block ntgc-select-input--filter";
      input.placeholder = "Search for a AI prompt or use case...";
      input.value = "";
      input.style.maxWidth = "100%";
      input.style.paddingRight = "44px"; // Make space for icon
      inner.appendChild(input);

      // Search icon
      var icon = document.createElement("span");
      icon.className = "search-icon";
      icon.style.position = "absolute";
      icon.style.right = "16px";
      icon.style.top = "50%";
      icon.style.transform = "translateY(-50%)";
      icon.style.fontFamily =
        "'Font Awesome 5 Pro', 'Font Awesome 5 Free', 'FontAwesome'";
      icon.style.fontWeight = "400";
      icon.style.fontSize = "20px";
      icon.style.color = "#888";
      icon.style.pointerEvents = "none";
      icon.style.zIndex = "2";
      icon.innerHTML = "&#xf002;"; // Font Awesome search icon unicode
      inner.appendChild(icon);

      container.appendChild(inner);
      textQuestion.prepend(container);
      textQuestion.prepend(container);
    }
  });
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
   * Handle form submission
   * Prevent default navigation and trigger API search
   */
  function handleFormSubmit(event) {
    event.preventDefault();

    const params = getSearchParams();

    // If search is empty, reload initial results (top items)
    if (!params.query.trim()) {
      console.log("Empty search - reloading initial results");
      loadInitialResults();
      return;
    }

    // Perform offline search immediately for fast results
    const cachedData = getCachedData();
    if (cachedData && cachedData.length > 0) {
      console.log("Performing immediate offline search for fast results");
      const offlineResults = searchLocalData(params.query, cachedData);

      // Store and render offline results immediately
      storeResults(offlineResults);
      initializeDropdowns(offlineResults);
      renderResults(offlineResults, "search-results-list");

      console.log(
        `Offline search: Displayed ${offlineResults.length} results (will update with API results)`
      );
    } else {
      // No cached data - show loading state
      const $container = window.$("#search-results-list");
      if ($container.length > 0) {
        $container.html('<div class="aikb-loading">Searching...</div>');
      }
    }

    // Trigger Funnelback API call in background to update results
    if (
      window.ntgFunnelback &&
      typeof window.ntgFunnelback.callSearchAPI === "function"
    ) {
      // Set originalterm and call API
      window.ntgFunnelback.originalterm = params.query;
      window.ntgFunnelback.currentPage = 1;

      // Pass onError callback (will only trigger if both API and fallback JSON fail)
      window.ntgFunnelback.callSearchAPI(params.query, function (error) {
        // Only show error if we didn't already show offline results
        if (!cachedData || cachedData.length === 0) {
          console.error("Search failed and no cached data available");
          const $container = window.$("#search-results-list");
          if ($container.length > 0) {
            $container.html(
              '<p class="aikb-error">Unable to load search results. Please check your connection and try again.</p>'
            );
          }
        } else {
          console.log("API failed but offline results already displayed");
        }
      });
    } else {
      console.error("Funnelback API not initialized");
    }
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

  // Show/hide clear button based on input state
  $searchInput.on("input", function () {
    const $clearBtn = window.$("#clear-input");
    if (window.$(this).val().length > 0) {
      $clearBtn.attr("hidden", false);
    } else {
      $clearBtn.attr("hidden", "");
    }
  });

  console.log("Search form handler initialized");
})();

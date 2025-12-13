/**
 * Search Form Handler
 * Wires the #policy-search-form submission to trigger Funnelback API calls
 * and populate #search-results-list with results
 */

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
   * Handle form submission
   * Prevent default navigation and trigger API search
   */
  function handleFormSubmit(event) {
    event.preventDefault();

    const params = getSearchParams();

    // Validate that at least a query is provided
    if (!params.query.trim()) {
      console.warn("Search query is empty");
      return;
    }

    // Clear previous results and show loading state
    const $container = window.$("#search-results-list");
    if ($container.length > 0) {
      $container.html('<div class="aikb-loading">Searching...</div>');
    }

    // Trigger Funnelback API call
    if (
      window.ntgFunnelback &&
      typeof window.ntgFunnelback.callSearchAPI === "function"
    ) {
      // Set originalterm and call API
      window.ntgFunnelback.originalterm = params.query;
      window.ntgFunnelback.currentPage = 1;
      window.ntgFunnelback.callSearchAPI();
    } else {
      console.error("Funnelback API not initialized");
    }
  }

  /**
   * Handle clear input button click
   * Clear the search field and reset results
   */
  function handleClearInput() {
    $searchInput.val("");
    const $container = window.$("#search-results-list");
    if ($container.length > 0) {
      $container.html("");
    }
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

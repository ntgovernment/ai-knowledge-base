// In-page Funnelback search (unminified source)
import { renderResults } from "./search-card-template.js";
import { initializeDropdowns } from "./populate-dropdowns.js";
import { storeResults, initializeFiltersAndSort } from "./search-filters.js";

const ntgFunnelback = {
  originalterm: "",
  filteredterm: "",
  currentPage: 1,

  defaults: {
    sourceField: "#search",
    baseURL: "https://ntgov-search.funnelback.squiz.cloud/s/search.json",
    collection: "ntgov~sp-ntgc-ai-knowledge-base",
    defaultQuery: "!FunDoesNotExist:PadreNull",
    funnelbackParams: {},
    minChars: 3,
    containerSelector: "#content .inner-page.au-body .container",
  },

  noisewords:
    "a au all am an and any are as at be been but by can cant co com de do eg else etc for from get go had has hasnt have he hence her here hers him his how http https i ie if in is it its la me my nor not now of off on or our ours pm put re she so than that the their them then there these they this those thus to too uk un until up upon us very via was we well were what when where which while who why www you your yours",

  init: function (query, doctype, owner, corrections, scopeID = false) {
    console.log("Init Funnelback Search");

    // Check for tags
    const regex = new RegExp("[*<>();/&]", "gi");
    query = query.replace(regex, "");

    // Perform a search immediately based on querystring?
    if (query !== false && query.trim().length > 0) {
      ntgFunnelback.originalterm = query;
      ntgFunnelback.currentPage = 1;
      ntgFunnelback.callSearchAPI();
    }
  },

  callSearchAPI: function (query, onError) {
    // If query parameter provided, set originalterm
    if (query !== undefined && query !== null) {
      ntgFunnelback.originalterm = query;
    }

    console.log(
      "callSearchAPI called with originalterm:",
      ntgFunnelback.originalterm
    );

    // Remove noise words from the query
    ntgFunnelback.filterQuery();
    console.log("After filterQuery, filteredterm:", ntgFunnelback.filteredterm);

    // Calculate start_rank for pagination (Funnelback uses 1-based ranking)
    const startRank = (ntgFunnelback.currentPage - 1) * 10 + 1;

    // Build Funnelback API URL
    let fbUrl = `${ntgFunnelback.defaults.baseURL}?collection=${ntgFunnelback.defaults.collection}`;

    // If there's a filtered search term, use ?query= parameter
    // Otherwise, use ?s= parameter for default top items
    if (
      ntgFunnelback.filteredterm &&
      ntgFunnelback.filteredterm.trim().length > 0
    ) {
      fbUrl += `&query=${encodeURIComponent(ntgFunnelback.filteredterm)}`;

      // Update URL query string for user searches
      const params = new URLSearchParams(window.location.search);
      params.set("query", ntgFunnelback.filteredterm);
      if (ntgFunnelback.currentPage && ntgFunnelback.currentPage !== 1) {
        params.set("page", ntgFunnelback.currentPage);
      } else {
        params.delete("page");
      }
      const newUrl =
        window.location.pathname +
        (params.toString() ? "?" + params.toString() : "");
      window.history.replaceState({}, "", newUrl);
    } else {
      // No search term - use default query for top items
      fbUrl += `&s=${encodeURIComponent(ntgFunnelback.defaults.defaultQuery)}`;
    }

    // Add pagination
    fbUrl += `&num_ranks=10&start_rank=${startRank}`;

    console.log("Loading fallback first, then calling Funnelback API");

    // Load fallback JSON first for instant results
    $.ajax({
      url: "dist/search.json",
      dataType: "JSON",
      type: "GET",
      timeout: 2000,
      success: function (fallbackData) {
        console.log("Loaded fallback search data first (instant results)");
        ntgFunnelback.processResults(fallbackData);
      },
      error: function (xhr, status, error) {
        console.warn("Fallback JSON failed:", error);
        // Continue to API anyway
      },
    });

    // Then call Funnelback API in background to update with fresh results
    console.log("Calling Funnelback API in background:", fbUrl);

    $.ajax({
      url: fbUrl,
      dataType: "JSON",
      type: "GET",
      timeout: 3000, // 3 second timeout - fail fast if Funnelback unreachable
      success: function (dataset) {
        console.log("Funnelback API succeeded, updating results");
        ntgFunnelback.processResults(dataset);
      },
      error: function (xhr, status, error) {
        console.warn(
          "Funnelback API error (fallback already displayed):",
          error
        );

        // Invoke onError callback if provided and no fallback was loaded
        if (typeof onError === "function") {
          onError(new Error("Funnelback API failed"));
        }
      },
    });
  },

  filterQuery: function () {
    // If originalterm is empty or undefined, set filteredterm to empty
    if (
      !ntgFunnelback.originalterm ||
      ntgFunnelback.originalterm.trim() === ""
    ) {
      ntgFunnelback.filteredterm = "";
      return false;
    }

    const noiseList = ntgFunnelback.noisewords.split(" ");
    const searchPhrase = ntgFunnelback.originalterm.trim().split(" ");

    // Check for empty array
    if (searchPhrase.length === 0) {
      ntgFunnelback.filteredterm = "";
      return false;
    }

    const revisedPhrase = [];

    $.each(searchPhrase, function (i, term) {
      if ($.inArray(term.toLowerCase(), noiseList) === -1) {
        revisedPhrase.push(term);
      }
    });

    // Clean for tags
    const regex = new RegExp("[*<>{}();/&]", "gi");
    let phraseAsString = revisedPhrase.join(" ");
    phraseAsString = phraseAsString.replace(regex, "");

    ntgFunnelback.filteredterm = phraseAsString;
    return;
  },

  processResults: function (dataset) {
    // Extract results from Funnelback response structure
    const results =
      dataset.response && dataset.response.resultPacket
        ? dataset.response.resultPacket.results
        : [];

    console.log(`Processing ${results.length} search results`);

    // Filter out excluded URLs
    const excludedUrls = [
      "https://ntgcentral.nt.gov.au/dev/aikb/configuration/listing/articles/_nocache",
    ];

    const filteredResults = results.filter((result) => {
      return !excludedUrls.includes(result.liveUrl);
    });

    console.log(
      `After filtering: ${filteredResults.length} results (excluded ${
        results.length - filteredResults.length
      })`
    );

    // Map results to card template format
    const mappedResults = filteredResults.map((result) => ({
      title: result.title || "",
      summary: result.summary || "",
      listMetadata: result.listMetadata || {},
      date: result.date || "",
      liveUrl: result.liveUrl || "",
      rank: result.rank || 0,
      score: result.score || 0,
    }));

    // Store results for filtering/sorting
    storeResults(mappedResults);

    // Initialize dropdowns with work area data
    initializeDropdowns(mappedResults);

    // Initialize filter and sort listeners
    initializeFiltersAndSort();

    // Render results using card template
    renderResults(mappedResults, "search-results-list");

    console.log(
      "Funnelback API results rendered (updated from offline/fallback)"
    );
  },
};

// Expose globally for legacy usage
window.ntgFunnelback = ntgFunnelback;
export { ntgFunnelback };

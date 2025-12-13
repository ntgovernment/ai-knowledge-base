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
    endpointURL:
      "https://ntgov-search.funnelback.squiz.cloud/s/search.json?collection=ntgov~sp-ntgc-ai-knowledge-base&s=!FunDoesNotExist:PadreNull",
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
    if (query !== false) {
      ntgFunnelback.originalterm = query;
      ntgFunnelback.currentPage = 1;
      ntgFunnelback.callSearchAPI();
    }

    // Submit policy search on click
    $(".search-icon").on("click", function () {
      $("#policy-search-form").trigger("submit");
    });

    // Trigger search on form submission
    $("#policy-search-form").on("submit", function (e) {
      e.preventDefault();

      let sourcefieldval = $(ntgFunnelback.defaults.sourceField).val();

      // Check for tags
      const regex = new RegExp("[*<>();/&]", "gi");
      sourcefieldval = sourcefieldval.replace(regex, "");
      $(ntgFunnelback.defaults.sourceField).val(sourcefieldval);

      ntgFunnelback.originalterm = sourcefieldval;
      ntgFunnelback.currentPage = 1;
      ntgFunnelback.callSearchAPI();
    });
  },

  callSearchAPI: function () {
    // Clear container while loading
    $(ntgFunnelback.defaults.containerSelector).html("");

    // Remove noise words from the query
    ntgFunnelback.filterQuery();

    // Update URL only when there's a meaningful query or an explicit page change
    // Avoid appending ?query=&page=1 on initial load
    const hasQueryParamAlready = new URLSearchParams(
      window.location.search
    ).has("query");
    const shouldUpdateQuery =
      ntgFunnelback.filteredterm &&
      ntgFunnelback.filteredterm.trim().length > 0;
    const shouldUpdatePage =
      ntgFunnelback.currentPage && ntgFunnelback.currentPage !== 1;
    if (shouldUpdateQuery || shouldUpdatePage || hasQueryParamAlready) {
      const params = new URLSearchParams(window.location.search);
      if (shouldUpdateQuery) {
        params.set("query", ntgFunnelback.filteredterm);
      }
      if (shouldUpdatePage) {
        params.set("page", ntgFunnelback.currentPage);
      } else {
        // Remove page param if default
        params.delete("page");
      }
      const newUrl =
        window.location.pathname +
        (params.toString() ? "?" + params.toString() : "");
      window.history.replaceState({}, "", newUrl);
    }

    // Calculate start_rank for pagination (Funnelback uses 1-based ranking)
    const startRank = (ntgFunnelback.currentPage - 1) * 10 + 1;

    // Build Funnelback API URL with required parameters (direct external call)
    let base = ntgFunnelback.defaults.endpointURL;
    // Replace the start_rank in base with current startRank
    base = base.replace(/start_rank=\d+/, "start_rank=" + startRank);
    // Append query and num_ranks
    const fbUrl =
      base +
      "&query=" +
      encodeURIComponent(ntgFunnelback.filteredterm) +
      "&num_ranks=10";

    console.log("Calling Funnelback API directly:", fbUrl);

    $.ajax({
      url: fbUrl,
      dataType: "JSON",
      type: "GET",
      success: function (dataset) {
        ntgFunnelback.processResults(dataset);
      },
      error: function (xhr, status, error) {
        console.warn("Funnelback API error, loading fallback data:", error);
        // Load fallback search.json
        $.ajax({
          url: "src/data/search.json",
          dataType: "JSON",
          type: "GET",
          success: function (fallbackData) {
            console.log("Loaded fallback search data");
            ntgFunnelback.processResults(fallbackData);
          },
          error: function () {
            console.error("Failed to load fallback search data");
            $(ntgFunnelback.defaults.containerSelector).html(
              "<p>Unable to load search results. Please try again later.</p>"
            );
          },
        });
      },
    });
  },

  filterQuery: function () {
    const noiseList = ntgFunnelback.noisewords.split(" ");
    const searchPhrase = ntgFunnelback.originalterm.split(" ");

    // Check for false
    if (searchPhrase.length === 0) {
      ntgFunnelback.filteredterm = searchPhrase;
      return false;
    }

    const revisedPhrase = [];

    $.each(searchPhrase, function (i, term) {
      if ($.inArray(term, noiseList) === -1) {
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

    // Map results to card template format
    const mappedResults = results.map((result) => ({
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

    console.log("Search results rendered successfully");
  },
};

// Expose globally for legacy usage
window.ntgFunnelback = ntgFunnelback;
export { ntgFunnelback };

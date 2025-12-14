# 02 - Search Engine & Query Processing

## Overview

The AI Knowledge Base uses a **dual-search approach**: offline keyword search for immediate results plus background Funnelback API updates. This document covers how searches are initiated, processed, filtered, and how results are rendered.

> **Current Implementation (Dec 2025):** Search uses cached local data (`dist/search.json`) for instant offline filtering with real-time keyword matching. User presses Enter to trigger search; results display immediately from cached data while Funnelback API updates in background. Filters (work area, sort) apply via custom multi-select dropdown with OK/Cancel controls. Legacy header/global search remains Coveo-powered and unchanged.

---

## Search Architecture

### Offline-First Approach

The landing page uses an **offline-first search** strategy:

**Data Source:**

- Cached results stored in `window.aikbSearchCache`
- Fallback data at `dist/search.json`
- Updated via Funnelback API in background

**Search Trigger:**

- User presses **Enter** key in search input (`#search`)
- Empty Enter reloads initial results
- No automatic search-as-you-type

**Search Flow:**

1. User enters search term and presses Enter
2. Offline search runs immediately on cached data
3. Results render instantly (no API wait)
4. Funnelback API called in background
5. Cache updates when API returns
6. Filter/sort listeners initialized after each result update

**Modules:**

- `src/js/offline-search.js` - Keyword scoring and matching
- `src/js/load-initial-results.js` - Cache management and initialization
- `src/js/search-form-handler.js` - Enter key trigger and search coordination
- `src/js/search-filters.js` - Filter application and result rendering

---

## Funnelback Search Engine Integration

### What is Funnelback?

Funnelback is an **enterprise search platform** that provides:

- Intelligent query processing and filtering
- Faceted search (filtering by metadata)
- Result ranking based on relevance
- Enterprise-grade performance and scalability

### Integration Method

**Technology:** Direct REST API via jQuery AJAX

**API Endpoint:**

```
GET https://ntgov-search.funnelback.squiz.cloud/s/search.json
```

**Required Parameters:**

- `collection`: ntgov~sp-ntgc-ai-knowledge-base
- `profile`: ai-knowledge-base-search-results_live
- `log`: false
- `s`: !FunDoesNotExist:PadreNull
- `start_rank`: Page-based (1-indexed)
- `query`: User search term (noise words removed)
- `num_ranks`: Results per page (default: 10)

---

## ntgFunnelback Search Object

### Initialization

The search engine is initialized when the page loads:

```javascript
ntgFunnelback.init(
  query, // Initial search term (from URL parameter)
  doctype, // Document type filter (reserved for future use)
  owner, // Role/owner filter (reserved for future use)
  corrections, // Corrections flag (reserved for future use)
  scopeID // Optional scope identifier
);
```

### Core Properties

```javascript
var ntgFunnelback = {
  // Search Terms Storage
  originalterm: "", // User's actual input
  filteredterm: "", // Term after noise removal
  currentPage: 1, // Current pagination page

  // Configuration Defaults
  defaults: {
    sourceField: "#search",
    endpointURL:
      "https://ntgov-search.funnelback.squiz.cloud/s/search.json?collection=ntgov~sp-ntgc-ai-knowledge-base&profile=ai-knowledge-base-search-results_live&log=false&s=!FunDoesNotExist:PadreNull&start_rank=1",
    funnelbackParams: {},
    minChars: 3,
    containerSelector: "#content .inner-page.au-body .container",
  },

  // Noise Words List
  noisewords:
    "a au all am an and any are as at be been but by can cant co com de do eg else etc for from get go had has hasnt have he hence her here hers him his how http https i ie if in is it its la me my nor not now of off on or our ours pm put re she so than that the their them then there these they this those thus to too uk un until up upon us very via was we well were what when where which while who why www you your yours",
};
```

### Noise Words

The engine filters common, non-meaningful words:

```javascript
noisewords: "a au all am an and any are as at be been but by can cant co com de do eg else etc for from get go had has hasnt have he hence her here hers him his how http https i ie if in is it its la me my nor not now of off on or our ours pm put re she so than that the their them then there these they this those thus to too uk un until up upon us very via was we well were what when where which while who why www you your yours";
```

**Example:**

- User enters: `"What are the best practices for AI implementation?"`
- Filtered: `"best practices AI implementation"`
- Noise words removed: `what, are, the, for` (ignored)

---

## Query Processing Pipeline

### Step 1: Input Validation & Sanitization

```javascript
// Remove potentially dangerous characters
var regex = new RegExp("[*>();/&]", "gi");
query = query.replace(regex, "");
```

**Removed Characters:** `* > ; < / &`

**Reason:** Prevent injection attacks and special character issues

### Step 2: Store Original Term

```javascript
ntgFunnelback.originalterm = sourcefieldval; // Exactly as user typed
```

### Step 3: Noise Word Removal

```javascript
ntgFunnelback.filterQuery = function () {
  var words = ntgFunnelback.originalterm.toLowerCase().split(/\s+/);
  var filtered = words.filter((word) => !noiseWords.includes(word));
  ntgFunnelback.filteredterm = filtered.join(" ");
};
```

### Step 4: Build Query Parameters

```javascript
let params = new URLSearchParams(window.location.search);

// Set search term
params.set("query", ntgCOVEO.filteredterm);

// Set document type filters (semicolon-separated)
if (Array.isArray(ntgCOVEO.doctype) && ntgCOVEO.doctype.length > 0) {
  params.set("doctype", ntgCOVEO.doctype.join(";"));
}

// Set owner/role filters (semicolon-separated)
if (Array.isArray(ntgCOVEO.owner) && ntgCOVEO.owner.length > 0) {
  params.set("owner", ntgCOVEO.owner.join(";"));
}

// Update browser URL
let newUrl = window.location.pathname + "?" + params.toString();
window.history.replaceState({}, "", newUrl);
```

### Step 5: Execute API Call

```javascript
$.ajax({
  url: ntgCOVEO.defaults.endpointURL,
  data: {
    searchterm: ntgCOVEO.filteredterm,
    scope: scopeID,
  },
  dataType: "JSON",
  type: "GET",
  complete: function (result) {
    // Parse and process response
    var dataset = result.responseJSON;
    // ... handle results
  },
});
```

### Step 6: Process Results

```javascript
if (result.hasOwnProperty("responseJSON")) {
  var dataset = result.responseJSON;

  // Store results
  ntgCOVEO.searchresults.all = dataset.results || [];
  ntgCOVEO.searchmeta = dataset.metadata || {};

  // Render to page
  ntgCOVEO.renderResults();
}
```

---

## Filtering System

> Note: The current runtime does not apply document type or owner filters; the examples in this section describe the intended/legacy behavior and may require additional implementation before they take effect.

### Document Type Filter

**Selector:** `#document_type` (dropdown/multi-select)

**Available Types:**

```javascript
[
  "Instruction",
  "General order",
  "Form",
  "Guideline",
  "Procedure",
  "Report",
  "Plan",
  "Fees",
  "Informational",
  "Legislation",
  "Delegation",
  "Policy",
  "Memorandum",
  "Training program",
  "Template",
];
```

**How It Works:**

```javascript
ntgCOVEO.doctype = $("#document_type").val(); // Get selected values
// Result: Array like ["Policy", "Guideline"]
```

### Role/Owner Filter

**Selector:** `#owner` (dropdown/multi-select)

**Department Mapping:**

```javascript
{
  '68': 'DCDD - Department of Corporate and Digital Development',
  '70': 'Northern Command',
  // ... other departments
}
```

**How It Works:**

```javascript
ntgCOVEO.owner = $("#owner").val(); // Get selected values
// Result: Array like ["68", "70"]
```

### Filter Application

When filters are applied:

```javascript
// Multiple values are joined with semicolons
var doctypeString = ntgCOVEO.doctype.join(";"); // "Policy;Guideline"
var ownerString = ntgCOVEO.owner.join(";"); // "68;70"

// Passed to API
$.ajax({
  url: endpoint,
  data: {
    searchterm: query,
    doctype: doctypeString,
    owner: ownerString,
  },
});
```

---

## Result Structure

### Result Object Format

```javascript
{
  title: "AI Implementation Guide",
  description: "Step-by-step guide for implementing AI in your team",
  doctype: "Policy",
  owner: "68",
  size: "2.5 MB",
  lastmodified: "2025-12-11T15:30:00",
  downloadurl: "https://...",
  viewurl: "https://...",
  icon: "fas fa-file-pdf"
}
```

### Result Rendering Template

**Location:** Dynamic insertion via jQuery

**HTML Structure:**

```html
<div class="search-result au-card">
  <div class="au-card__inner">
    <h3 class="search-result__title">
      <i class="[icon-class]"></i> Result Title
    </h3>
    <p class="search-result__description">Result summary/description text</p>
    <div class="search-result__meta">
      <span class="badge">[Document Type]</span>
      <span class="meta-info">Updated: [Date]</span>
      <span class="meta-info">Size: [File Size]</span>
    </div>
    <div class="search-result__actions">
      <a href="[downloadurl]" class="au-btn au-btn--secondary">
        <i class="fal fa-download"></i> Download
      </a>
      <a href="[viewurl]" class="au-btn au-btn--secondary" target="_blank">
        <i class="fal fa-external-link-alt"></i> Open
      </a>
    </div>
  </div>
</div>
```

---

## Pagination

### Configuration

```javascript
defaults: {
  paginationPerPage: 12; // Results per page
}
```

### Pagination Controls

**Location:** `#sync-pagination`

**Structure:**

```html
<div class="pagination">
  <a href="?...&page=1" class="page-link">1</a>
  <a href="?...&page=2" class="page-link active">2</a>
  <a href="?...&page=3" class="page-link">3</a>
  <span class="page-info">Showing 13-24 of 47 results</span>
</div>
```

### Page Navigation

```javascript
// Pagination.min.js handles:
// - Click events on page links
// - Update URL parameters (?page=N)
// - Fetch and display new results
// - Scroll to results
```

---

## User Feedback

### Searching Status Message

**Location:** Dynamic message area

```javascript
if (ntgCOVEO.searchmethod === "original") {
  ntgCOVEO.setUserMessage(
    "Searching for <strong>" + ntgCOVEO.originalterm + "</strong>"
  );
}
```

### No Results

**Message:** `"No information was found"`

**Display:** Shown in results container when API returns empty

```javascript
if (ntgCOVEO.searchresults.all.length === 0) {
  $("#search-results-list").html(ntgCOVEO.defaults.noResultHTML);
}
```

---

## Search Event Binding

### Form Submission

```javascript
$("#policy-search-form").on("submit", function (e) {
  e.preventDefault();

  // Reset state
  ntgCOVEO.reset();
  ntgCOVEO.clearResults();

  // Get current values
  var sourcefieldval = $(ntgCOVEO.defaults.sourceField).val();
  ntgCOVEO.doctype = $("#document_type").val();
  ntgCOVEO.owner = $("#owner").val();

  // Sanitize input
  var regex = new RegExp("[*>();/&]", "gi");
  sourcefieldval = sourcefieldval.replace(regex, "");

  // Execute search
  ntgCOVEO.originalterm = sourcefieldval;
  ntgCOVEO.callSearchAPI();
});
```

### Search Icon Click

```javascript
$(".search-icon").on("click", function () {
  $("#policy-search-form").trigger("submit");
});
```

### Filter Changes

```javascript
// When dropdown selection changes
$("#document_type, #owner").on("change", function () {
  // Form submission handler processes the change
  $("#policy-search-form").trigger("submit");
});
```

---

## API Response Handling

### Success Response

```javascript
complete: function(result) {
  // jQuery AJAX complete handler

  if (typeof(result) !== 'object') {
    result = $.parseJSON(result);
  }

  if (result.hasOwnProperty('responseJSON')) {
    var dataset = result.responseJSON;

    // Verify response structure
    if (dataset.results && Array.isArray(dataset.results)) {
      // Store results
      ntgCOVEO.searchresults.all = dataset.results;

      // Render to page
      ntgCOVEO.renderResults();

      // Initialize pagination
      setupPagination(dataset.total, 12);
    }
  }
}
```

### Error Handling

```javascript
error: function(xhr, status, error) {
  console.error('Search API Error:', error);

  // Display error message
  ntgCOVEO.showErrorMessage(
    'Search service temporarily unavailable. Please try again later.'
  );
}
```

---

## Query Correction

### Spell Checking

When `allowCorrections` is true:

```javascript
// Coveo API detects misspellings
// Example: "polcy" → suggests "policy"

if (ntgCOVEO.correctedterm !== ntgCOVEO.originalterm) {
  // Show correction to user
  console.log("Did you mean: " + ntgCOVEO.correctedterm);

  // Optional: Automatically search with corrected term
}
```

### Correction Toggle

**User Option:** Can enable/disable spell correction in settings

```javascript
ntgCOVEO.allowCorrections = true; // Default
// User can toggle this via UI setting
```

---

## Code Example: Complete Search Flow

```javascript
// User types "AI and machine learning" and clicks search

// Step 1: Form submission triggered
$("#policy-search-form").on("submit", function (e) {
  e.preventDefault();

  // Step 2: Get input value
  var sourcefieldval = $("#search").val(); // "AI and machine learning"

  // Step 3: Sanitize
  sourcefieldval = sourcefieldval.replace(/[*<>();/&]/gi, "");

  // Step 4: Remove noise words
  ntgCOVEO.originalterm = sourcefieldval;
  ntgCOVEO.filterQuery();
  // Result: "AI machine learning" (removed "and")

  // Step 5: Get filters
  ntgCOVEO.doctype = ["Policy", "Guideline"];
  ntgCOVEO.owner = ["68"];

  // Step 6: Build URL
  let params = new URLSearchParams();
  params.set("query", "AI machine learning");
  params.set("doctype", "Policy;Guideline");
  params.set("owner", "68");
  window.history.replaceState(
    {},
    "",
    window.location.pathname + "?" + params.toString()
  );

  // Step 7: API call
  $.ajax({
    url: "[removed for local dev]",
    data: {
      searchterm: "AI machine learning",
      doctype: "Policy;Guideline",
      owner: "68",
    },
    dataType: "JSON",
    type: "GET",
    complete: function (result) {
      var data = result.responseJSON;
      ntgCOVEO.searchresults.all = data.results;

      // Step 8: Render results
      $("#search-results-list").html(
        data.results
          .map(
            (r) => `
          <div class="search-result au-card">
            <h3>${r.title}</h3>
            <p>${r.description}</p>
            <span class="badge">${r.doctype}</span>
            <a href="${r.downloadurl}">Download</a>
          </div>
        `
          )
          .join("")
      );

      // Step 9: Setup pagination
      setupPagination(data.total);
    },
  });
});
```

---

## Best Practices

### When Implementing Search

1. **Always Sanitize Input**

   ```javascript
   query = query.replace(/[*>();/&]/gi, "");
   ```

2. **Handle Empty Results**

   ```javascript
   if (results.length === 0) {
     showMessage("No results found. Try different keywords.");
   }
   ```

3. **Show Loading State**

   ```javascript
   $("#search-results-list").html("<p>Searching...</p>");
   ```

4. **Log User Intent**

   ```javascript
   gtag("event", "search", {
     search_term: ntgCOVEO.originalterm,
     filters_applied: ntgCOVEO.doctype.length > 0,
   });
   ```

5. **Cache Results**
   ```javascript
   // Avoid repeated calls for same query
   if (lastQuery === currentQuery && cachedResults) {
     return cachedResults;
   }
   ```

---

## Next Steps

Read **[03-USER-SYSTEM.md](03-USER-SYSTEM.md)** to understand user authentication and profile management.

/**
 * Rewrite DOCUMENTATION files with accurate, consolidated content
 * Run with: node scripts/rewrite-docs.js
 */
const fs = require('fs');
const path = require('path');

const DOCS = path.join(__dirname, '..', 'DOCUMENTATION');

const files = {

// ─────────────────────────────────────────────────────────────────────────────
'01-ARCHITECTURE.md': `# 01 - Architecture & System Design

## System Overview

The NTG Central AI Knowledge Base is a **client-side search portal** built on a modular JavaScript/CSS architecture. All search and filtering runs in the browser — no server-side processing required.

**Two page types, two independent bundles:**

| Page | Entry JS | Entry CSS | Purpose |
|------|----------|-----------|---------|
| Landing (search) | \`src/js/landing-page.js\` | \`src/css/landing-page.css\` | Search, filters, results, pagination |
| Content (article) | \`src/js/content-page.js\` | \`src/css/content-page.css\` | Code blocks, copy button, sidebar |

---

## Technology Stack

### Frontend Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| **jQuery** | 3.4.1 | DOM manipulation, AJAX (Funnelback background call) |
| **Australian Design System (AUS)** | v7+ | Gov web standards, accessibility-first components |
| **Bootstrap Grid** | 4.1.3 | 12-column responsive layout |
| **SumoSelect** | 3.4.9 | Enhanced multi-select dropdown (work area filter) |
| **Fotorama** | Latest | Image carousel (header) |
| **jQuery TableSort** | Latest | Sortable tables |

### Build Tools

| Tool | Purpose | Config |
|------|---------|--------|
| **esbuild** | Bundle + minify JS (IIFE format) | \`package.json\` scripts |
| **PostCSS** | Process CSS (autoprefixer + cssnano) | \`postcss.config.js\` |
| **postcss-import** | Inline \`@import\` statements | n/a |
| **npm-run-all** | Parallel/sequential script runner | \`package.json\` |

### Fonts & Icons

| Asset | Source | Notes |
|-------|--------|-------|
| Roboto | \`roboto.css\` (local) | Body text |
| neue-haas-grotesk | Adobe Typekit (\`yht7rxj.css\`) | Display headings |
| Font Awesome Pro 5.15.4 | CDN (\`pro.fontawesome.com\`) | Icons; local copy removed |

---

## File Structure

\`\`\`
ai-knowledge-base/
├── src/
│   ├── js/
│   │   ├── landing-page.js          # Entry point: imports all landing modules
│   │   ├── content-page.js          # Entry point: imports content modules
│   │   ├── config.js                # Environment detection, data URLs, NOISE_WORDS
│   │   ├── offline-search.js        # TF-scoring keyword search engine
│   │   ├── search-form-handler.js   # Enter-key listener, triggers search
│   │   ├── search-filters.js        # Client-side filter/sort, storeResults()
│   │   ├── search-card-template.js  # Result card HTML generator + highlighting
│   │   ├── load-initial-results.js  # Page-load data fetch, work areas fetch
│   │   ├── populate-dropdowns.js    # Build work-area <select> options
│   │   ├── applied-filters.js       # Filter pills display and removal
│   │   ├── pagination.js            # Client-side pagination controls
│   │   ├── cta-button-alias.js      # CTA button class aliasing (legacy)
│   │   ├── wrap-pre-blocks.js       # Wraps h2+pre into .aikb-pre-block
│   │   └── copy-to-clipboard.js     # Copy button injection and state toggle
│   ├── css/
│   │   ├── landing-page.css         # Landing entry: @imports all landing CSS
│   │   ├── content-page.css         # Content entry: @imports all content CSS
│   │   ├── search-interface.css     # Filter inputs and grid layout
│   │   ├── search-card.css          # Result card component styles
│   │   ├── search-results.css       # Results list wrapper
│   │   ├── applied-filters.css      # Filter pill styles
│   │   ├── pagination.css           # Pagination controls
│   │   ├── tags.css                 # Tag/badge styles
│   │   ├── sidebar.css              # Content page sidebar
│   │   ├── aikb-pre-block.css       # Code block + copy button styles
│   │   ├── copy-to-clipboard.css    # Copy button component
│   │   └── inset-text.css           # Inset/callout text blocks
│   └── data/
│       ├── search.json              # Local search data (dev fallback)
│       ├── agencies.json            # Agency metadata
│       └── work-areas.json          # Work area list (dev)
├── dist/                            # Compiled output (do not edit directly)
│   ├── landing-page.min.js
│   ├── landing-page.min.css
│   ├── content-page.min.js
│   ├── content-page.min.css
│   └── search.json                  # Copied from src/data/ by prepare:dist
├── scripts/
│   └── prepare-dist.js              # Copies search.json to dist/
├── AI knowledge base _ NTG Central.html  # Landing page (snapshot from CMS)
├── AI knowledge base _ NTG Central_files/ # Page-level assets (design system)
├── server.js                        # Local dev HTTP server (port 8000)
├── package.json
├── postcss.config.js
└── DOCUMENTATION/
\`\`\`

---

## Build System

### npm Scripts

\`\`\`bash
npm run build           # Full build: prepare:dist + all CSS + all JS
npm run dev             # Watch mode: rebuilds on file change + starts server
npm run serve           # Start local server only (port 8000)
npm run clean           # Delete dist/ folder
\`\`\`

### Individual Build Targets

\`\`\`bash
npm run build:landing-css   # PostCSS: src/css/landing-page.css → dist/landing-page.min.css
npm run build:content-css   # PostCSS: src/css/content-page.css → dist/content-page.min.css
npm run build:landing-js    # esbuild: src/js/landing-page.js → dist/landing-page.min.js
npm run build:content-js    # esbuild: src/js/content-page.js → dist/content-page.min.js
\`\`\`

---

## DOM Structure

### Landing Page

\`\`\`html
<html lang="en">
<head>
  <!-- Fonts, main.css, Font Awesome CDN, status-toolbar.css -->
  <script src=".../jquery-3.4.1.min.js"></script>
</head>
<body class="ntg-central au-grid">
  <nav class="au-skip-link">...</nav>            <!-- Skip links (a11y) -->
  <header class="ntgc-header">                   <!-- Logo, nav, search, profile -->
    ...
  </header>

  <div id="content" class="ntgc-body">
    <link rel="stylesheet" href="./dist/landing-page.min.css">

    <!-- Welcome section -->
    <div class="inner-page au-body">
      <div class="container">
        <div class="nt-two-column" data-instance-id="...">
          <div class="nt-two-column__left">...</div>
          <div class="nt-two-column__right">...</div>
        </div>
      </div>
    </div>

    <!-- Search section -->
    <div class="inner-page au-body">
      <div class="container">
        <div class="aikb-search-section">
          <form id="policy-search-form">
            <div id="ntgc-page-filters">
              <div id="text-question">          <!-- Search input -->
              <div id="select-question-2">     <!-- Work area dropdown -->
              <div id="select-question-3">     <!-- Sort dropdown -->
            </div>
          </form>
          <div id="appliedFiltersSection">...</div>
        </div>
        <div id="search-results-list">...</div>   <!-- Cards injected here -->
        <div id="aikb-pagination">...</div>       <!-- Pagination controls -->
      </div>
    </div>

    <script src=".../jquery.sumoselect.min.js"></script>
    <script src="./dist/landing-page.min.js"></script>
  </div>

  <footer class="ntgc-footer">...</footer>
</body>
</html>
\`\`\`

---

## Data Flow

### Landing Page Initialisation

\`\`\`
Page Load
  │
  ├─ fetch(primaryDataSource)        ← src/js/load-initial-results.js
  │    Production: live Squiz Matrix API
  │    Development: ./dist/search.json
  │
  ├─ fetch(workAreasDataSource)      ← async, parallel
  │    Production: live work-areas API
  │    Development: ./src/data/work-areas.json
  │
  ├─ storeResults(results)           ← src/js/search-filters.js
  ├─ initializeDropdowns(results)    ← src/js/populate-dropdowns.js
  ├─ initializeFiltersAndSort()      ← src/js/search-filters.js
  └─ renderResults(currentPage)      ← src/js/search-card-template.js
\`\`\`

### Search Query Flow

\`\`\`
User types in #search + presses Enter
  │
  ├─ get cached data (window.aikbSearchCache)
  ├─ searchLocalData(query, cache)   ← offline-search.js (instant)
  │    tokenizeQuery() → NOISE_WORDS filter → TF scoring
  │
  ├─ storeResults(results)
  └─ applyFiltersAndSort()
       ├─ filterByWorkArea(selected)
       ├─ sortResults(method)
       ├─ initializePagination(results)
       ├─ renderResults(currentPage)  ← search-card-template.js
       └─ displayAppliedFilters()     ← applied-filters.js
\`\`\`

---

## Environment Detection

The \`config.js\` module auto-detects environment:

\`\`\`javascript
// Production: hostname === 'ntgcentral.nt.gov.au'
// Development: everything else (localhost, file://, etc.)

isProduction()      → boolean
getPrimaryDataSource()   → live API URL (prod) | ./dist/search.json (dev)
getFallbackDataSource()  → ./dist/search.json (prod) | null (dev)
getWorkAreasDataSource() → live work-areas URL (prod) | ./src/data/work-areas.json (dev)
\`\`\`

---

## State Management

### Search State (in-memory, not persisted)

The current search state lives in module-level variables inside \`search-filters.js\`:

\`\`\`javascript
let allResults = [];  // All results after last fetch/search (deduplicated)
\`\`\`

Pagination state lives in \`pagination.js\`:

\`\`\`javascript
let currentPage = 1;
let itemsPerPage = 10;
let totalItems = 0;
\`\`\`

### User Profile (localStorage)

See [03-USER-SYSTEM.md](03-USER-SYSTEM.md) for details.

### No URL State

The current implementation does **not** use URL query parameters for search state. The URL remains clean during search and filter interactions.

---

## Security Considerations

- Input sanitization in \`offline-search.js\`: special characters stripped via regex before scoring
- CSP header in HTML: \`upgrade-insecure-requests\` forces all HTTP→HTTPS
- jQuery 3.4.1 loaded from CDN with local fallback; no known critical CVEs for this usage
- No sensitive data stored client-side beyond user profile metadata (no tokens)
`,

// ─────────────────────────────────────────────────────────────────────────────
'02-SEARCH-ENGINE.md': `# 02 - Search Engine & Query Processing

## Overview

The AI Knowledge Base uses an **offline-first search strategy**: all searching and filtering runs 100% in the browser on cached data, providing instant results. A Funnelback API call runs in the background to refresh the cache, but never blocks rendering.

> **Key modules:** \`src/js/offline-search.js\`, \`src/js/search-form-handler.js\`, \`src/js/search-filters.js\`, \`src/js/load-initial-results.js\`

---

## Offline-First Search Architecture

### Data Sources

| Environment | Primary Source | Work Areas Source |
|-------------|---------------|-------------------|
| Production (\`ntgcentral.nt.gov.au\`) | Live Squiz Matrix listing API | Live work-areas API |
| Development (localhost) | \`./dist/search.json\` | \`./src/data/work-areas.json\` |

Environment is auto-detected by \`config.js\`. See [01-ARCHITECTURE.md](01-ARCHITECTURE.md) for details.

### Cache

Fetched results are stored in \`window.aikbSearchCache\` (set by \`load-initial-results.js\`). All subsequent searches operate against this in-memory cache — no network round-trip.

---

## Search Trigger

**File:** \`src/js/search-form-handler.js\`

Search fires **only on Enter key** in the \`#search\` input. There is no search-as-you-type.

\`\`\`javascript
searchInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    const query = searchInput.value.trim();

    if (query === '') {
      loadInitialResults();  // Empty Enter: reload all results
    } else {
      const results = searchLocalData(query, getCachedData());
      storeResults(results);
      applyFiltersAndSort();
    }
  }
});
\`\`\`

---

## Offline Search Algorithm

**File:** \`src/js/offline-search.js\`

### Step 1 — Tokenize Query

\`\`\`javascript
function tokenizeQuery(query) {
  // Remove special chars, split into words
  // Filter noise words (from NOISE_WORDS set in config.js)
  // Exception: uppercase acronyms (e.g. "IT", "AI") are kept even if noise words
  // Normalize to lowercase
}
\`\`\`

**Example:**
- Input: \`"What are the best practices for AI?"\`
- After noise removal: \`["best", "practices", "AI"]\`  ← "AI" kept (uppercase acronym)
- Normalized: \`["best", "practices", "ai"]\`

### Step 2 — TF Scoring Per Result

Each search result is scored against all query terms. Fields are weighted:

| Field | Weight | Notes |
|-------|--------|-------|
| Title | High | Strong relevance signal |
| Summary/description | Medium | Body text match |
| Work area / tags | Medium | Metadata match |

Term Frequency is counted with support for both full-word and partial matches (substring).

### Step 3 — Sort by Score

Results are sorted descending by total score. Zero-score results (no token matched) are excluded.

### Noise Words

Defined as a \`Set\` in \`src/js/config.js\` and exported as \`NOISE_WORDS\`. Imported by \`offline-search.js\`.

Common filtered words: \`a, au, all, am, an, and, any, are, as, at, be, been, but, by, can, ...\`

---

## Filter & Sort System

**File:** \`src/js/search-filters.js\`

After search (or on page load), filters and sort are applied client-side before rendering.

### storeResults(results)

Stores results deduplicating by \`liveUrl\` or \`title\`:

\`\`\`javascript
export function storeResults(results) {
  // Dedup by liveUrl || url || title
  allResults = deduplicatedResults;
}
\`\`\`

### applyFiltersAndSort()

Called after every search, filter change, or sort change:

1. Get active filters via \`getCurrentFilters()\` (from \`applied-filters.js\`)
2. Apply work area filter (OR logic)
3. Apply sort
4. Initialize pagination with filtered results
5. Render current page
6. Update applied-filters pills

### Work Area Filter Logic

\`\`\`javascript
function filterByWorkArea(selectedWorkAreas) {
  // No selection → return all results
  // "All work areas" selected → return all results
  // Otherwise: OR logic — result included if it matches AT LEAST ONE selected area
  const isMatch = workAreasArray.some(area =>
    result.listMetadata['Work area'].includes(area)
  );
}
\`\`\`

### Sort Options

Results can be sorted by: **Relevance** (default, search score), **Date** (newest first), **Title** (A–Z).

---

## Background Funnelback Refresh

**File:** \`src/js/load-initial-results.js\` / \`src/js/search-form-handler.js\`

After loading from the primary data source, a call to the Funnelback REST API may be made in the background. This:
- Does **not** block the UI
- Updates \`window.aikbSearchCache\` when it returns
- Re-runs \`initializeDropdowns\` and \`initializeFiltersAndSort\` on completion

See [06-API-REFERENCE.md](06-API-REFERENCE.md) for the Funnelback endpoint details.

---

## Result Rendering

**File:** \`src/js/search-card-template.js\`

Renders an array of result objects into \`#search-results-list\` as \`.aikb-search-card\` HTML elements.

### Matched Term Highlighting

Terms matched during search are passed to the card template and wrapped in \`<mark>\` tags:

\`\`\`javascript
function highlightMatches(text, matchedTerms) {
  // Sort terms by length (longest first — prevents partial replacements)
  // Wrap each occurrence in <mark>term</mark> using case-insensitive regex
}
\`\`\`

### Result Card Structure

See [04-COMPONENTS.md](04-COMPONENTS.md) for the full card HTML and CSS.

---

## Initial Page Load

**File:** \`src/js/load-initial-results.js\`

On \`DOMContentLoaded\`:

1. Check \`#search-results-list\` exists (skip if not on search page)
2. Fetch work areas list (parallel)
3. Fetch primary data source
4. On success: \`storeResults → initializeDropdowns → initializeFiltersAndSort\`
5. On failure (production only): retry with \`dist/search.json\` fallback
`,

// ─────────────────────────────────────────────────────────────────────────────
'03-USER-SYSTEM.md': `# 03 - User System & Profile Management

## Overview

The AI Knowledge Base implements a user profile system that persists user information across sessions using localStorage, populated from the NT Government SAML authentication system.

---

## Authentication System

**Type:** SAML (Security Assertion Markup Language) — Single sign-on with NT Government directory

The portal itself does not handle authentication. The NTG Central platform handles SAML, extracts user attributes, and makes them available to page scripts via the \`ntg-central-update-user-profile.js\` module and DOM data attributes.

---

## User Profile Data

### localStorage Keys

\`\`\`javascript
{
  "user_name":       "Sarah Thompson",
  "user_email":      "sarah.thompson@nt.gov.au",
  "user_phone":      "+61889991234",
  "user_title":      "Senior Policy Advisor",
  "user_location":   "Darwin Plaza 3rd Floor",
  "user_department": "72",
  "user_asset_id":   "845621"
}
\`\`\`

### Intranet Personalisation

The \`intra-user-departmentInfo\` key stores an object:

\`\`\`javascript
{
  "intranetURL":  "https://intranet.agency.nt.gov.au",
  "intranetName": "Agency Intranet"
}
\`\`\`

If present, an intranet link is injected into the header navigation.

---

## Persona System

The page uses a persona system to show/hide content based on the user's department.

- Active personas are stored in \`data-personas-active\` on \`<body>\`
- Persona definitions are embedded as JSON in a \`<script>\` block (variable \`personaDataJSON\`)
- Each persona maps department codes to AU Design System component visibility rules

---

## Profile Data Flow

\`\`\`
SAML login (handled by NTG Central platform)
        ↓
ntg-central-update-user-profile.js
        ↓
localStorage.setItem(key, value) for each field
        ↓
DOM data attributes updated ([data-profile="UIgivenName"] etc.)
        ↓
profile-menu.js reads and displays profile in header
\`\`\`

---

## DOM Profile Attributes

The footer contains hidden spans used by profile scripts:

\`\`\`html
<div class="d-none">
  <span data-profile="UIgivenName"></span>
  <span data-profile="businessCategoryDesc"></span>
  <span data-profile="departmentNumber"></span>
  <span data-profile="title"></span>
</div>
\`\`\`

---

## Local Development

In local development, \`server.js\` mocks the user data endpoints:

\`\`\`
GET /cdn/userdata/get-userinfo-xhr
    → { UIgivenName, sn, telephoneNumber, mail, title, location, departmentNumber }

GET /cdn/userdata/get-displayname-xhr
    → { displayName: "Yes" }

GET /cdn/userdata/get-favourites-xhr
    → { systems: [], content: [], contacts: [] }
\`\`\`

---

## Department Codes

| Code | Department |
|------|------------|
| 68 | DCDD — Department of Corporate and Digital Development |
| 70 | Northern Command |
| 72 | People and Wellbeing |
| 74 | Professional Standards Command |
| 76 | Governance and Strategy |

(Full list is in the \`personaDataJSON\` embedded in the HTML page.)
`,

// ─────────────────────────────────────────────────────────────────────────────
'04-COMPONENTS.md': `# 04 - UI Components & Interactive Elements

## Overview

This document is the canonical reference for all UI components on both the landing (search) page and the content (article) page. For styling details see [05-STYLING.md](05-STYLING.md). For the search algorithm see [02-SEARCH-ENGINE.md](02-SEARCH-ENGINE.md).

---

## Two-Column Layout (\`.nt-two-column\`)

**Used on:** Landing page welcome section  
**CSS:** \`src/css/landing-page.css\`

A mobile-first responsive two-column grid.

### HTML Structure

\`\`\`html
<div class="nt-two-column" data-instance-id="tc-zav07cvrd">
  <div class="nt-two-column__left">
    <h2>Welcome to NTG's AI knowledge base</h2>
    <p>Your central hub for AI advice...</p>
  </div>
  <div class="nt-two-column__right">
    <p>Are you using AI in your role...</p>
    <a href="mailto:ai.advice@nt.gov.au" class="ntgc-btn ntgc-btn--primary">
      Submit your own use case
    </a>
  </div>
</div>
\`\`\`

### CSS Behaviour

- **Mobile:** Single column (block layout); full width
- **Desktop (≥992px):** CSS Grid, \`53.125fr / 46.875fr\` split, 2rem gap
- **First child margin:** \`.nt-two-column__left > :first-child\` and \`.nt-two-column__right > :first-child\` have \`margin-top: 0\` to prevent design-system spacing overrides

---

## Search Interface

**File:** \`src/js/populate-dropdowns.js\`, \`src/css/search-interface.css\`  
**Container:** \`#ntgc-page-filters\` (inside \`<form id="policy-search-form">\`)

The filter row is a 12-column CSS Grid (\`grid-template-columns: repeat(12, 1fr)\`, gap 24px) that contains:

| Element | ID | Type |
|---------|-----|------|
| Search input | \`#search\` | text input |
| Work area dropdown | \`#document_type\` (sumoselect) | multi-select |
| Sort dropdown | \`#sort\` | select |

### Search Input

\`\`\`html
<div id="text-question" class="search-input-container">
  <label for="search" class="ntgc-form-input--label">Search</label>
  <input type="text" id="search" name="query"
    placeholder="Search for a AI prompt or use case..."
    class="ntgc-text-input ntgc-text-input--block">
</div>
\`\`\`

A search icon (\`fa-search\`) is injected via CSS \`::after\` pseudo-element on \`.search-input-container\`. The HTML icon span (\`.fal.fa-search\`) is hidden.

**Trigger:** Enter key only. See [02-SEARCH-ENGINE.md](02-SEARCH-ENGINE.md).

### Work Area Dropdown (SumoSelect)

\`\`\`html
<div id="select-question-2">
  <select id="document_type" name="document_type"
    class="ntgc-select sumoselect" multiple>
    <!-- Options populated dynamically by populate-dropdowns.js -->
  </select>
</div>
\`\`\`

Options are built dynamically from fetched work areas data. SumoSelect is initialized with:

\`\`\`javascript
$('.sumoselect').SumoSelect({
  selectAll: true,          // "Select All" checkbox
  okCancelInMulti: true,    // OK/Cancel buttons
  isClickAwayOk: true,      // Clicking away confirms
  search: true,
  placeholder: 'Select...',
});
\`\`\`

**Filtering:** OR logic. "All work areas" bypasses all filtering. See [02-SEARCH-ENGINE.md](02-SEARCH-ENGINE.md).

---

## Applied Filters Pills

**File:** \`src/js/applied-filters.js\`, \`src/css/applied-filters.css\`  
**Container:** \`#appliedFiltersSection\`

Displays active filters as removable pills below the filter bar.

### HTML Structure (runtime-generated)

\`\`\`html
<div id="appliedFiltersSection">
  <strong>Filters:</strong>
  <div id="appliedFilters">
    <!-- Search query pill (green) -->
    <span class="filter-pill badge bg-success">
      Search: ai writing
      <button aria-label="Remove filter">×</button>
    </span>
    <!-- Work area pill (blue) per area -->
    <span class="filter-pill badge bg-primary">
      Work area: Finance
      <button aria-label="Remove filter">×</button>
    </span>
  </div>
  <button id="clearAllBtn">Clear all</button>
</div>
\`\`\`

- Each work area gets its own pill (individual removal supported)
- Sort is not shown as a pill
- Clear All button is visible only when at least one filter is active

---

## Search Result Cards

**File:** \`src/js/search-card-template.js\`, \`src/css/search-card.css\`  
**Container:** \`#search-results-list\`

Cards are generated entirely by JavaScript and injected into the DOM.

### Card HTML Structure

\`\`\`html
<div class="aikb-search-card">
  <div class="aikb-search-card__inner">
    <div class="aikb-search-card__content">
      <div class="aikb-search-card__text">
        <h3 class="aikb-search-card__title">
          Result Title (with <mark>highlighted</mark> terms)
        </h3>
        <p class="aikb-search-card__summary">
          Summary text (with <mark>highlighted</mark> terms)
        </p>
      </div>
      <div class="aikb-search-card__meta">
        <!-- Tags, work area, date -->
      </div>
    </div>
    <div class="aikb-search-card__actions">
      <a href="..." class="ntgc-btn ntgc-btn--secondary">
        View <span class="fal fa-long-arrow-right"></span>
      </a>
    </div>
  </div>
</div>
\`\`\`

**Highlighting:** Matched search terms are wrapped in \`<mark>\` tags. Terms are sorted by length (longest first) to prevent double-wrapping.

---

## Pagination

**File:** \`src/js/pagination.js\`, \`src/css/pagination.css\`  
**Container:** \`#aikb-pagination\` (created dynamically after \`#search-results-list\`)

Client-side pagination (10 results per page by default).

### Controls Structure

\`\`\`html
<div id="aikb-pagination" class="aikb-pagination">
  <div class="aikb-pagination__wrapper">
    <button class="aikb-pagination__control aikb-pagination__control--disabled">
      <span class="aikb-pagination__icon-label">
        <i class="fal fa-chevron-left"></i>
        <span class="aikb-pagination__text">Previous</span>
      </span>
    </button>
    <!-- Page number buttons -->
    <button class="aikb-pagination__page aikb-pagination__page--active">1</button>
    <button class="aikb-pagination__page">2</button>
    <!-- ... -->
    <button class="aikb-pagination__control">
      <span class="aikb-pagination__icon-label">
        <span class="aikb-pagination__text">Next</span>
        <i class="fal fa-chevron-right"></i>
      </span>
    </button>
  </div>
</div>
\`\`\`

### Key API

\`\`\`javascript
initializePagination(results, perPage)  // Set up pagination for result array
getCurrentPageResults()                  // Returns slice for current page
getCurrentPage()                         // Returns current page number (1-based)
getTotalPages()                          // Returns total page count
\`\`\`

---

## Sidebar Component

**Used on:** Content (article) pages  
**CSS:** \`src/css/sidebar.css\`

### HTML Structure

\`\`\`html
<div class="aikb-sidebar">
  <div class="aikb-sidebar__inner">
    <div class="aikb-sidebar__section">
      <div class="aikb-sidebar__row">
        <div class="aikb-sidebar__label">Label</div>
        <div class="aikb-sidebar__value">Value</div>
      </div>
    </div>
    <div class="aikb-sidebar__divider"></div>
  </div>
</div>
\`\`\`

**Responsive:** Stacks below content on mobile; floats to fixed ~300px width at 1024px+.

---

## Code Block + Copy Button

**Content page only**  
**Files:** \`src/js/wrap-pre-blocks.js\`, \`src/js/copy-to-clipboard.js\`, \`src/css/aikb-pre-block.css\`

### Runtime Behaviour

On \`DOMContentLoaded\`, \`copy-to-clipboard.js\` scans all \`<pre>\` elements and:

1. Wraps each \`<pre>\` (and its preceding heading sibling if present) in \`.copy-pre-btn-wrapper\`
2. Injects a \`<button class="copy-pre-btn">\` in the top-right corner

\`wrap-pre-blocks.js\` performs a similar wrapping into \`.aikb-pre-block\` for styled code blocks.

### HTML Structure (after JS runs)

\`\`\`html
<div class="copy-pre-btn-wrapper" style="position:relative;">
  <h2>Example heading</h2>
  <pre class="copyable">Code content here</pre>
  <button type="button" class="copy-pre-btn" aria-label="Copy code block to clipboard"
    style="position:absolute; top:8px; right:8px;">
    Copy
  </button>
</div>
\`\`\`

### Copy Button States

| State | Text | Behaviour |
|-------|------|-----------|
| Default | "Copy" | Ready to copy |
| Success | "Copied!" | ~1.6s then reverts |
| Error | Shows error indication | Clipboard API failed |

**Clipboard API:** Uses \`navigator.clipboard.writeText()\` (secure context). Falls back to \`document.execCommand('copy')\` via a hidden textarea.

### .aikb-pre-block Styling

\`\`\`css
.aikb-pre-block {
  padding: 24px;
  background: var(--clr-surface-secondary, #f5f5f5);
  outline: 1px solid var(--clr-stroke-default, #afb5bf);
}
\`\`\`

---

## Back-to-Search Button

**Used on:** Content pages  
**Classes:** \`ntgc-btn ntgc-btn--tertiary\`

\`\`\`html
<a href="..." class="ntgc-btn ntgc-btn--tertiary">
  <span class="fal fa-arrow-left mr-2"></span>Back to search
</a>
\`\`\`

**Hover animation:** The arrow icon slides 4px left over 0.3s ease.
`,

// ─────────────────────────────────────────────────────────────────────────────
'05-STYLING.md': `# 05 - Styling Framework & Design System

## CSS Architecture

### Source Files (\`src/css/\`)

Landing page CSS is assembled via \`@import\` in \`src/css/landing-page.css\`:

\`\`\`css
@import "./search-interface.css";  /* Filter bar, grid layout, search icon */
@import "./search-card.css";       /* Result card component */
@import "./search-results.css";    /* Results list wrapper */
@import "./applied-filters.css";   /* Filter pills */
@import "./pagination.css";        /* Pagination controls */
@import "./tags.css";              /* Tag/badge styles */
/* Plus landing-page.css own rules: .nt-two-column, search icon pseudo-element */
\`\`\`

Content page CSS is assembled via \`@import\` in \`src/css/content-page.css\`:

\`\`\`css
@import "./sidebar.css";
@import "./aikb-pre-block.css";
@import "./copy-to-clipboard.css";
@import "./inset-text.css";
/* Plus content-page.css own rules */
\`\`\`

PostCSS inlines all \`@import\`s and runs autoprefixer + cssnano to produce \`dist/*.min.css\`.

### Page-level CSS Load Order (landing page)

\`\`\`html
<!-- Adobe Typekit and Roboto fonts -->
<link href="yht7rxj.css" rel="stylesheet">
<link href="roboto.css" rel="stylesheet">

<!-- Font Awesome Pro 5.15.4 (CDN) -->
<link href="https://pro.fontawesome.com/releases/v5.15.4/css/all.css" crossorigin="anonymous">

<!-- Design system (must come before dist/) -->
<link href="main.css" rel="stylesheet">
<link href="status-toolbar.css" rel="stylesheet">

<!-- Built source bundle (last — overrides design system where needed) -->
<link href="./dist/landing-page.min.css" rel="stylesheet">
\`\`\`

---

## Two-Column Grid Layout

**Class:** \`.nt-two-column\`  
**Breakpoint:** 992px  
**Pattern:** Mobile-first (single column → side-by-side at desktop)

\`\`\`css
/* Mobile: single column */
.nt-two-column {
  display: block;
  width: 100%;
}

.nt-two-column__left,
.nt-two-column__right {
  width: 100%;
}

/* Remove design-system top margin from first element in each column */
.nt-two-column__left > :first-child,
.nt-two-column__right > :first-child {
  margin-top: 0;
}

/* Desktop: side-by-side */
@media (min-width: 992px) {
  .nt-two-column {
    display: grid;
    grid-template-columns: 53.125fr 46.875fr;
    gap: 2rem;
    align-items: start;
  }
  .nt-two-column__right {
    padding-left: 2rem;
  }
}
\`\`\`

---

## Color Palette

### Primary Colors

\`\`\`css
#102040  /* Primary blue — headers, dark backgrounds, primary buttons */
#304060  /* Hover/secondary variant */
#d0e0e0  /* Pale/background variant */
\`\`\`

### Secondary Colors

\`\`\`css
#208820  /* Secondary green — success, CTA icons, back-arrow */
#107810  /* Darker variant */
#dcf0dc  /* Pale background */
\`\`\`

### Tertiary Colors

\`\`\`css
#e44808  /* Tertiary orange — attention, calls-to-action */
#c43004  /* Dark variant (error) */
#fce4d8  /* Pale background */
\`\`\`

### Neutral Colors

\`\`\`css
#6c7074  /* Dark gray — body text */
#acb0b4  /* Medium gray */
#d3dfe0  /* Light gray — borders */
#ecf0f0  /* Very light — backgrounds */
\`\`\`

### Search/Card Custom Colors

\`\`\`css
--clr-surface-primary: white         /* Card backgrounds */
--clr-surface-secondary: #f5f5f5    /* Code block backgrounds */
--clr-stroke-default: #afb5bf       /* Borders and outlines */
--clr-text-default: #102040         /* Primary text */
--clr-text-body: #384560            /* Body/summary text */
--clr-text-helper: #606a80          /* Placeholder/helper */
\`\`\`

---

## Typography

### Font Families

\`\`\`css
/* Display/Headings — Adobe Typekit (loaded via yht7rxj.css) */
font-family: neue-haas-grotesk-display, neue-haas-grotesk-text, sans-serif;

/* Body text — Google Fonts */
font-family: Roboto, arial, sans-serif;

/* Code/Monospace */
font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace;
\`\`\`

### Type Scale (Design System)

Base font size is 16px (1rem). The design system uses REM units throughout.

| Size | Value | Usage |
|------|-------|-------|
| xl heading | ~26px | h1 |
| card title | 20px | .aikb-search-card__title |
| body | 16px | .aikb-search-card__summary |
| label | 16px | filter labels |
| small | 14px | filter pills |

---

## Key Utility Classes (NTG Central Design System)

| Class | Purpose |
|-------|---------|
| \`.ntgc-btn\` | Base button style |
| \`.ntgc-btn--primary\` | Filled blue button |
| \`.ntgc-btn--secondary\` | Outlined button |
| \`.ntgc-btn--tertiary\` | Text/ghost button |
| \`.ntgc-text-input\` | Styled text input |
| \`.ntgc-select\` | Styled select dropdown |
| \`.ntgc-body\` | Page content wrapper (applies body styles) |
| \`.ntgc-body--neutral\` | Neutral/light section background |
| \`.au-body\` | AU Design System body region |
| \`.au-grid\` | AU Design System grid wrapper |
| \`.container\` | Bootstrap-style max-width container |
| \`.inner-page\` | Page content section wrapper |

---

## Responsive Breakpoints

| Name | Min-width | Usage |
|------|-----------|-------|
| xs | 0 | Mobile baseline |
| sm | 576px | Small devices |
| md | 768px | Tablets |
| lg | 992px | Desktop (two-column, sidebar) |
| xl | 1200px | Large desktop |

---

## Design System Overrides

The built CSS (\`dist/landing-page.min.css\`) is loaded last and overrides design system styles where needed. Key overrides:

- **Search input focus ring:** \`outline: 4px solid #88bc88\` replaces default focus style
- **Card title margin:** \`margin-top: 0 !important\` prevents .ntgc-body h3 top spacing
- **Filter pill colours:** \`!important\` used to override Bootstrap badge background utilities
- **Two-column first child:** \`margin-top: 0\` prevents h2/p spacing from design system
`,

// ─────────────────────────────────────────────────────────────────────────────
'06-API-REFERENCE.md': `# 06 - API Reference & External Integrations

## Data Sources

### Primary Data Source (Squiz Matrix Listing API)

**Environment:** Production only  
**URL:** \`https://ntgcentral.nt.gov.au/services-and-support/ict-services-websites/artificial-intelligence/ai-knowledge-base/configuration/listing/articles/_nocache\`  
**Method:** GET  
**Response:** JSON array of search result objects

**Development fallback:** \`./dist/search.json\` (copied from \`src/data/search.json\` by \`prepare:dist\`)

### Work Areas Data Source

**Environment:** Production  
**URL:** \`https://ntgcentral.nt.gov.au/services-and-support/ict-services-websites/artificial-intelligence/ai-knowledge-base/configuration/listing/work-areas/_nocache\`  
**Development fallback:** \`./src/data/work-areas.json\`

### Result Object Schema

\`\`\`json
{
  "title": "Using AI to summarise meeting notes",
  "summary": "Learn how to use AI to create concise...",
  "liveUrl": "https://ntgcentral.nt.gov.au/...",
  "date": "December 2025",
  "listMetadata": {
    "Work area": ["All work areas"],
    "Tags": ["Writing", "Productivity"]
  }
}
\`\`\`

---

## Funnelback Search REST API

**Role:** Background cache refresh (non-blocking). The primary search runs offline against cached data.

### Endpoint

\`\`\`
GET https://ntgov-search.funnelback.squiz.cloud/s/search.json
\`\`\`

### Query Parameters

| Parameter | Value | Notes |
|-----------|-------|-------|
| \`collection\` | \`ntgov~sp-ntgc-ai-knowledge-base\` | Search collection |
| \`profile\` | \`ai-knowledge-base-search-results_live\` | Search profile |
| \`log\` | \`false\` | Disable logging |
| \`s\` | \`!FunDoesNotExist:PadreNull\` | Sort/filter parameter |
| \`start_rank\` | integer (1-based) | Starting result rank |
| \`query\` | string | Noise-word-filtered search term |
| \`num_ranks\` | integer (default: 10) | Results per page |

### Local dev proxy

The local \`server.js\` provides a proxy endpoint that forwards requests to Funnelback, adding CORS headers:

\`\`\`
GET /api/funnelback?<funnelback query params>
\`\`\`

This avoids CORS issues during local development.

### Response Shape (Funnelback)

\`\`\`json
{
  "response": {
    "resultPacket": {
      "results": [
        {
          "title": "...",
          "summary": "...",
          "liveUrl": "...",
          "date": "...",
          ...
        }
      ]
    }
  }
}
\`\`\`

---

## Squiz Matrix JS API

**Purpose:** Read and write user profile metadata in the CMS

**Script:** \`ntg-central-update-user-profile.js\` (page-level, not in source bundle)

### Initialization

\`\`\`javascript
var api = new Squiz_Matrix_API({ key: 'YOUR_API_KEY' });
\`\`\`

### getMetadata()

\`\`\`javascript
api.getMetadata({
  asset_id: 845621,
  dataCallback: function(data) { /* use data.fields */ },
  errorCallback: function(error) { /* handle error */ }
});
\`\`\`

### setMetadata()

\`\`\`javascript
api.setMetadata({
  asset_id: 845621,
  field_id: 'user_preferences',
  field_val: 'dark_mode',
  dataCallback: function(data) { console.log('Updated'); }
});
\`\`\`

### Authentication

Requests require a nonce token from the hidden \`#token\` input:

\`\`\`javascript
var nonce = document.getElementById('token').value;
\`\`\`

---

## Google Analytics 4

**Tracking ID:** \`G-09TV1G846C\`

### Implementation

\`\`\`html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-09TV1G846C"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-09TV1G846C');
</script>
\`\`\`

### Events Tracked

Standard GA4 page-view events are captured automatically. Custom event tracking can be added via:

\`\`\`javascript
gtag('event', 'search', { search_term: query });
gtag('event', 'select_content', { content_type: 'filter', item_id: workArea });
\`\`\`

---

## Font Awesome Pro 5.15.4

**Loaded from CDN:**

\`\`\`html
<link rel="stylesheet"
  href="https://pro.fontawesome.com/releases/v5.15.4/css/all.css"
  crossorigin="anonymous">
\`\`\`

> **Note:** The local \`all.css\` copy is commented out in the HTML because it references \`../webfonts/\` paths that do not exist locally.

### Icon Classes Used

| Icon | Class | Location |
|------|-------|----------|
| Search | \`fal fa-search\` | Search input (CSS pseudo-element) |
| Arrow right | \`fal fa-long-arrow-right\` | View button in cards |
| Arrow left | \`fal fa-arrow-left\` | Back to search button |
| Chevron left/right | \`fal fa-chevron-left/right\` | Pagination controls |
| Bars | \`fal fa-bars\` | Mobile menu toggle |
`,

// ─────────────────────────────────────────────────────────────────────────────
'07-ACCESSIBILITY.md': `# 07 - Accessibility & Compliance

## Overview

The NTG Central AI Knowledge Base is built on **accessibility-first principles** using the Australian Design System (AUS) which targets **WCAG 2.1 Level AA** compliance.

---

## WCAG 2.1 Compliance

### Accessibility Level: AA

| Principle | Requirements |
|-----------|-------------|
| **Perceivable** | Sufficient color contrast (4.5:1 for body text), alt text for images, resizable text (REM units) |
| **Operable** | Keyboard accessible, skip links, visible focus indicators, no keyboard traps, 48×48px minimum touch targets |
| **Understandable** | Plain language, consistent navigation, predictable interactions, error prevention |
| **Robust** | Valid HTML5, ARIA attributes, semantic markup, assistive technology compatible |

---

## Keyboard Navigation

### Tab Order

\`\`\`
1. Skip Links (at top — appear on focus)
2. Logo / Search Button (mobile)
3. Main Navigation Menu
4. User Profile Menu
5. Search Input (#search)
6. Work Area Dropdown
7. Sort Dropdown
8. Result Cards (top to bottom)
9. Pagination Links
10. Footer Links
\`\`\`

### Skip Links

\`\`\`html
<nav class="au-skip-link" aria-label="skip links navigation">
  <a class="au-skip-link__link" href="#content">Skip to main content</a>
  <a class="au-skip-link__link" href="#mainmenu">Skip to main navigation</a>
</nav>
\`\`\`

Skip links are visually hidden until focused, then appear as a prominent overlay.

---

## Focus Indicators

All interactive elements (buttons, links, inputs, dropdowns) have visible focus styles:

\`\`\`css
/* Search input focus — from src/css/landing-page.css */
#policy-search-form .search-input-container #search.ntgc-text-input:focus {
  outline: 4px solid #88bc88 !important;
  outline-offset: 0 !important;
}

/* Filter pills focus */
.filter-pill:focus-within {
  outline: 4px solid #88bc88;
  outline-offset: 0;
}
\`\`\`

---

## Screen Reader Support

### Semantic Landmarks

\`\`\`html
<nav aria-label="skip links navigation">...</nav>
<header role="banner">...</header>
<nav aria-label="footer">...</nav>
<footer role="contentinfo">...</footer>
\`\`\`

\`#content\` serves as the main content region (no explicit \`<main>\` tag — inherits from design system structure).

### ARIA Attributes

- Filter pill remove buttons: \`aria-label="Remove filter"\`
- Copy button: \`aria-label="Copy code block to clipboard"\`
- Mobile menu button: \`aria-controls\` linking to nav
- Search form: associated \`<label for="search">\` on input

### Form Labels

All filter inputs have associated \`<label>\` elements:

\`\`\`html
<label for="search" class="ntgc-form-input--label">Search</label>
<input type="text" id="search" ...>
\`\`\`

---

## Colour Contrast

| Element | Foreground | Background | Ratio |
|---------|-----------|-----------|-------|
| Body text | #6c7074 | white | ≥4.5:1 |
| Card title | #102040 | white | ≥7:1 |
| Primary button | white | #102040 | ≥7:1 |
| Placeholder | #606a80 | white | ~4.6:1 |

---

## Australian Design System (AUS)

The portal uses AU Design System components loaded from \`components.js\`:

- \`au-accordion\` — Collapsible content panels (footer navigation)
- \`au-skip-link\` — Accessibility skip navigation
- \`au-page-alerts\` — Page-level alert messages
- \`au-body\` — Styled content region

All AUS components meet Australian Government accessibility requirements and are tested with common screen readers (NVDA, JAWS, VoiceOver).

---

## Testing Checklist

- [ ] Keyboard-only navigation works through all interactive elements
- [ ] Screen reader announces filter changes and result counts
- [ ] Color contrast passes for all text (use browser DevTools or axe extension)
- [ ] Focus is visible on all interactive elements
- [ ] Skip links appear and function on keyboard focus
- [ ] Search results announce count to screen readers
- [ ] Copy button state change is announced (consider adding \`aria-live\`)
`,

// ─────────────────────────────────────────────────────────────────────────────
'08-DEVELOPER-GUIDE.md': `# 08 - Developer Guide

## Prerequisites

- **Node.js** v18+ (project developed on v23.8.0)
- **npm** v9+
- A modern browser (Chrome/Edge recommended for DevTools)

---

## Quick Start

\`\`\`bash
# 1. Install dependencies
npm install

# 2. Build all assets
npm run build

# 3. Start local dev server (port 8000)
npm run serve

# 4. Open http://localhost:8000
\`\`\`

For watch mode (auto-rebuild on file changes) + server in one command:

\`\`\`bash
npm run dev
\`\`\`

---

## Build Commands

| Command | What it does |
|---------|-------------|
| \`npm run build\` | Full build: prepare:dist + all CSS + all JS |
| \`npm run dev\` | Watch all files + start server (parallel) |
| \`npm run serve\` | Start \`server.js\` on port 8000 only |
| \`npm run clean\` | Delete \`dist/\` folder |
| \`npm run build:landing-css\` | PostCSS: landing CSS → \`dist/landing-page.min.css\` |
| \`npm run build:content-css\` | PostCSS: content CSS → \`dist/content-page.min.css\` |
| \`npm run build:landing-js\` | esbuild: landing JS → \`dist/landing-page.min.js\` |
| \`npm run build:content-js\` | esbuild: content JS → \`dist/content-page.min.js\` |
| \`npm run watch:landing-css\` | Watch + rebuild landing CSS |
| \`npm run watch:landing-js\` | Watch + rebuild landing JS |

> **Always run \`npm run build\` after editing source files before testing.**  
> **Never edit files in \`dist/\` directly — they are overwritten by build.**

---

## Local Dev Server

\`server.js\` is a custom Node.js HTTP server that:

- Serves all static files from the project root
- Routes \`/\` and \`/landing\` → \`AI knowledge base _ NTG Central.html\`
- Proxies \`/api/funnelback?...\` → Funnelback API (adds CORS headers)
- Mocks \`/cdn/userdata/*\` endpoints (returns test user data)
- Silently ignores \`/.well-known/*\` requests (Chrome DevTools noise)

---

## Development Workflow

### Edit CSS

1. Edit files in \`src/css/\`
2. Run \`npm run build:landing-css\` (or \`npm run watch:landing-css\` in dev mode)
3. Hard-refresh browser (\`Ctrl+Shift+R\`)

### Edit JavaScript

1. Edit files in \`src/js/\`
2. Run \`npm run build:landing-js\` (or \`npm run watch:landing-js\` in dev mode)
3. Hard-refresh browser

### Add a new CSS component

1. Create new file: \`src/css/my-component.css\`
2. Add \`@import "./my-component.css";\` to \`src/css/landing-page.css\` (or content)
3. Run build

### Add a new JS module

1. Create new file: \`src/js/my-module.js\`
2. Import in \`src/js/landing-page.js\` (or content-page.js)
3. Run build

---

## Common Development Tasks

### Debug Search Results

Open browser console and inspect the cache:

\`\`\`javascript
// Check cached results
console.log(window.aikbSearchCache);

// Check result count
console.log('Results:', window.aikbSearchCache?.length);

// Check first result structure
console.log(window.aikbSearchCache?.[0]);
\`\`\`

### Debug Filters

\`\`\`javascript
// Active filters come from the SumoSelect dropdown values
const workAreaSelect = document.getElementById('document_type');
console.log('Selected work areas:', $(workAreaSelect).val());

// Trigger filter reapplication manually (from browser console)
// applyFiltersAndSort is not exposed globally — use UI controls
\`\`\`

### Test Search Manually

\`\`\`javascript
// Simulate Enter key on search input
const search = document.getElementById('search');
search.value = 'meeting notes';
search.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
\`\`\`

### Monitor Network Requests

1. Open DevTools → Network tab
2. Filter by \`funnelback\` or \`search.json\`
3. Perform a search or page load
4. Inspect: GET to \`/api/funnelback?...\` (dev) or Funnelback directly (prod)

### Modify Working Search Data (dev)

Edit \`src/data/search.json\`, then run \`npm run build\` (the \`prepare:dist\` step copies it to \`dist/\`).

### Add a Work Area (dev)

Edit \`src/data/work-areas.json\` — it is a simple JSON array of strings.

---

## Adding a New Filter

The filter system is client-side in \`src/js/search-filters.js\`.

1. **Add UI:** New \`<select>\` or \`<input>\` in the HTML inside \`#ntgc-page-filters\`
2. **Read value:** In \`applyFiltersAndSort()\`, read the new field and filter \`allResults\`
3. **Update pills:** Update \`displayAppliedFilters()\` in \`applied-filters.js\` to show a pill for the new filter
4. **Clear:** Update \`initClearAllButton()\` to reset the new filter on clear all

---

## Debugging Common Issues

### No Search Results

\`\`\`javascript
// 1. Check if data loaded
console.log('Cache:', window.aikbSearchCache?.length, 'items');

// 2. Check fetch requests in Network tab
// Dev: should see successful fetch of ./dist/search.json
// Prod: should see fetch of live Squiz Matrix URL

// 3. Check #search-results-list exists
console.log(document.getElementById('search-results-list'));
\`\`\`

### Styles Not Updating

\`\`\`bash
npm run build          # Rebuild
# Then in browser: Ctrl+Shift+R (hard refresh, bypasses cache)
\`\`\`

Check that the HTML references \`./dist/landing-page.min.css\` (not \`_files/landing-page.min.css\`).

### jQuery Not Defined

jQuery must load before any \`$(document).ready()\` call. Check that in the HTML:
\`\`\`html
<!-- In <head>, before first use: -->
<script src="./AI knowledge base _ NTG Central_files/jquery-3.4.1.min.js"></script>
\`\`\`

### Font Awesome Icons Not Showing

The local \`all.css\` is intentionally commented out (missing webfonts). The CDN link must be active:
\`\`\`html
<link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.15.4/css/all.css" crossorigin="anonymous">
\`\`\`

If offline, icons will show as empty squares — this is expected behaviour.

### SumoSelect Dropdown Looks Unstyled

\`\`\`html
<link rel="stylesheet" href="./AI knowledge base _ NTG Central_files/sumoselect.min.css">
<script src="./AI knowledge base _ NTG Central_files/jquery.sumoselect.min.js"></script>
\`\`\`

Both must load before \`dist/landing-page.min.js\`.

---

## Project Conventions

- **No \`var\`** in source JS — use \`const\`/\`let\`
- **ES modules** (\`import\`/\`export\`) in all \`src/js/\` files; esbuild bundles to IIFE
- **CSS custom properties** (\`--clr-*\`) for theming tokens in component CSS
- **BEM-style class names** for custom components: \`.aikb-search-card__title\`
- **Mobile-first CSS** — base styles for mobile, \`@media (min-width: X)\` for larger screens
- **Never mix landing and content bundles** — they are independent

---

## Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome / Edge | 90+ |
| Firefox | 88+ |
| Safari | 14+ |

IE is not supported. The design system assets (\`main.css\`, \`components.js\`) may include legacy support but the source JS/CSS does not.
`,

};

// Write all files
let count = 0;
for (const [filename, content] of Object.entries(files)) {
  const filepath = path.join(DOCS, filename);
  fs.writeFileSync(filepath, content, 'utf8');
  console.log(\`✓ Written: \${filename}\`);
  count++;
}

console.log(\`\\nDone. Wrote \${count} documentation files.\`);

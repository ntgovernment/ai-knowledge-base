# AI Knowledge Base - NTG Central

**Modern search interface for AI use cases in the Northern Territory Government**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Bundle Size](https://img.shields.io/badge/bundle-22.3kb-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Development](#development)
- [Architecture](#architecture)
- [Components](#components)
- [API Integration](#api-integration)
- [Styling System](#styling-system)
- [Build System](#build-system)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🎯 Overview

The AI Knowledge Base is a searchable repository that helps NT Government employees discover practical AI applications and use cases across various work areas. The application features:

- **Card-based search results** with rich metadata
- **Multi-select work area filter** with OK/Cancel buttons
- **Offline search capability** using cached local data
- **Parallel loading strategy** (immediate fallback + API updates)
- **Funnelback API integration** with local JSON fallback
- **Auto-loading results** on page initialization
- **Responsive design** optimized for desktop and mobile
- **Modular architecture** built with ES6 modules and PostCSS

### Key Features

✅ **Search Functionality**

- **Immediate offline search**: Displays cached results instantly while API loads in background
- **Offline fallback**: Client-side keyword search when API completely unavailable
- Dynamic query parameter switching: `&s=` for top items, `&query=` for searches
- Primary: Funnelback API (`ntgov~sp-ntgc-ai-knowledge-base` collection)
- Fallback: Local `search.json` file when API unavailable
- Auto-load top items on page load with parallel loading (fallback + API)
- Manual search via form submission with noise word filtering
- URL exclusion filter (e.g., configuration pages)
- Scoring algorithm for offline search: Title matches ×3, Summary ×1, Metadata ×2

✅ **Dynamic Filters & Sorting**

- **Multi-select work area filter** with checkboxes and OK/Cancel buttons
- Select All functionality with indeterminate state
- Sort by: Relevance, Date (newest/oldest), Title (A-Z/Z-A)
- Client-side filtering and sorting for instant results
- Preserves search state during filter/sort operations
- Multiple work area filtering with OR logic

✅ **Card-Based Results**

- Title, summary, work area tags (comma-separated tags split)
- "Good for" metadata and submission dates
- Responsive layout (breakpoint at 768px)
- "See more" button with Font Awesome arrow icons (positioned absolutely)
- Validation ensures required fields (title, summary, liveUrl)

✅ **Build System**

- esbuild for JavaScript bundling (ES6 → IIFE)
- PostCSS for CSS processing
- Source maps for debugging
- ~22.3kb total bundle size (22.0kb JS + 2.4kb CSS minified)

## 🚀 Quick Start

### Prerequisites

```bash
Node.js 14+ and npm
Local web server (http-server, Live Server, etc.)
```

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ntgc-aikb

# Install dependencies
npm install

# Build the project
npm run build

# Start local server
npx http-server -p 8000 -c-1
```

### Access the Application

Open `http://localhost:8000/AI%20knowledge%20base%20_%20NTG%20Central.html` in your browser.

## 📁 Project Structure

```
ntgc-aikb/
├── 📄 AI knowledge base _ NTG Central.html    # Main HTML page
├── 📁 AI knowledge base _ NTG Central_files/   # Legacy assets
│   ├── global-v2.js                            # Modified for local dev (favorites disabled)
│   ├── jquery-3.4.1.min.js                     # jQuery 3.4.1
│   ├── ntgov-funnelback-search.js             # Legacy Funnelback script (not used)
│   └── [other legacy assets]
│
├── 📁 src/                                     # Source files (EDIT THESE)
│   ├── 📁 js/
│   │   ├── landing-page.js                     # Landing page JS (all main logic)
│   │   ├── content-page.js                     # Content page JS (if needed)
│   │   ├── search-card-template.js             # Card rendering logic
│   │   ├── ntg-funnelback.js                   # Funnelback API integration
│   │   ├── search-form-handler.js              # Form submission handler
│   │   ├── load-initial-results.js             # Auto-load with parallel strategy
│   │   ├── populate-dropdowns.js               # Dynamic dropdown population
│   │   ├── search-filters.js                   # Client-side filtering & sorting
│   │   ├── multi-select-dropdown.js            # Multi-select component
│   │   ├── offline-search.js                   # Offline keyword search
│   │   └── cta-button-alias.js                 # CTA button styling
│   │
│   ├── 📁 css/
│   │   ├── landing-page.css                    # Landing page CSS (all main styles)
│   │   ├── content-page.css                    # Content page CSS (if needed)
│   │   ├── search-card.css                     # Card styling
│   │   ├── search-interface.css                # Search UI styling
│   │   ├── multi-select-dropdown.css           # Multi-select dropdown styling
│   │   └── call-to-action.css                  # CTA styling (empty placeholder)
│   │
│   └── 📁 data/
│       └── search.json                         # Fallback search data (Funnelback format)
│
├── 📁 dist/                                    # Build output (AUTO-GENERATED)
│   ├── landing-page.min.js                     # Landing page JS (main bundle)
│   ├── landing-page.min.css                    # Landing page CSS (main bundle)
│   ├── content-page.min.js                     # Content page JS (if needed)
│   └── content-page.min.css                    # Content page CSS (if needed)
│
├── 📁 DOCUMENTATION/                           # Project documentation
│   ├── 00-README.md                            # Original documentation
│   ├── 01-ARCHITECTURE.md                      # System architecture
│   ├── 02-SEARCH-ENGINE.md                     # Search implementation
│   ├── 04-COMPONENTS.md                        # Component details
│   ├── 05-STYLING.md                           # CSS architecture
│   └── [other docs]
│
├── 📄 package.json                             # Dependencies & scripts
├── 📄 postcss.config.js                        # PostCSS configuration
└── 📄 server.js                                # Optional local server
```

## 💻 Development

### npm Scripts

```bash
npm run clean            # Delete dist folder
npm run prepare:dist     # Create dist directory
npm run build            # Build all landing/content assets (recommended)
npm run build:landing-js # Build landing page JS only
npm run build:landing-css# Build landing page CSS only
npm run build:content-js # Build content page JS only
npm run build:content-css# Build content page CSS only
npm start                # Start local server (if using server.js)
```

### Development Workflow

1. **Edit source files** in `src/js/landing-page.js` and `src/css/landing-page.css` (or content-page equivalents)
2. **Build the project**: `npm run build`
3. **Refresh browser** to see changes
4. **Commit changes**: `git add -A && git commit -m "message"`

### Adding a New Module

**JavaScript Module:**

```javascript
// 1. Create src/js/my-module.js
export function myFunction() {
  // ...
}

// 2. Import in src/js/landing-page.js (or content-page.js)
import "./my-module.js";

// 3. Build
npm run build:landing-js
```

**CSS Module:**

```css
/* 1. Create src/css/my-styles.css */
.my-class {
  /* ... */
}

/* 2. Import in src/css/landing-page.css (or content-page.css) */
@import "./my-styles.css";

/* 3. Build */
npm run build:landing-css
```

### Local Development Notes

**Disabled for Local Dev:**

- Roboto fonts (commented out to prevent CORS)
- Favorites API (mocked in `global-v2.js`)
- Some external CDN assets

**Important Element IDs:**

- `#search-results-list` - Main results container (line 1173)
- `#policy-search-form` - Search form (line 1060)
- `#search` - Search input field (line 1069)
- `#document_type` - Work area filter dropdown (line 1088)
- `#owner` - Sort dropdown (line 1118)
- `#clear-input` - Clear search button (line 1077)
- `.search-icon` - Search icon trigger (line 1073)

## 🏗 Architecture

### Data Flow

**Initial Page Load:**

```
Page Load
    ↓
load-initial-results.js
    ↓
Parallel Loading:
├─→ Fetch search.json (immediate display)
│       ↓
│   processAndRenderResults(data, "fallback")
│       ↓
│   Cache to window.aikbSearchCache
│       ↓
│   Filter excluded URLs → Map to card format
│       ↓
│   storeResults() → initializeDropdowns() → renderResults()
│
└─→ Fetch Funnelback API (background update)
        ↓
    processAndRenderResults(data, "api")
        ↓
    Update cache → Filter → Map
        ↓
    Re-render with API results (updates fallback)
```

**User Search (with Offline Priority):**

```
User enters "English" in #search input
    ↓
Form submission (search-form-handler.js)
    ↓
Immediate Offline Search:
├─→ getCachedData() from window.aikbSearchCache
│       ↓
│   searchLocalData("English", cachedData)
│       ↓
│   Score results: Title ×3, Summary ×1, Metadata ×2
│       ↓
│   Display offline results instantly
│
└─→ Fetch Funnelback API (background update)
        ↓
    Set originalterm = "English"
        ↓
    filterQuery() → Remove noise words → filteredterm = "English"
        ↓
    Build URL: ?collection=...&query=English
        ↓
    Fetch API → processResults()
        ↓
    Update display with API results (replaces offline)
        ↓
    If API fails: Keep offline results displayed
```

**Filter/Sort (Multi-Select):**

```
User clicks multi-select dropdown
    ↓
Opens panel with checkboxes + Select All
    ↓
User checks multiple work areas
    ↓
User clicks OK button
    ↓
multiselect-change event fires
    ↓
filterByWorkArea(selectedWorkAreas[])
    ↓
Filter with OR logic (any match)
    ↓
sortResults() → Re-render filtered/sorted results
```

### Module Dependencies

```
index.js
├── ntg-funnelback.js
│   ├── → search-card-template.js (renderResults)
│   ├── → populate-dropdowns.js (initializeDropdowns)
│   └── → search-filters.js (storeResults, initializeFiltersAndSort)
├── cta-button-alias.js
├── search-card-template.js
├── search-form-handler.js
│   ├── → offline-search.js (searchLocalData, getCachedData)
│   ├── → search-card-template.js (renderResults)
│   ├── → search-filters.js (storeResults)
│   └── → populate-dropdowns.js (initializeDropdowns)
├── populate-dropdowns.js
│   └── → multi-select-dropdown.js (initMultiSelect)
├── search-filters.js
├── multi-select-dropdown.js
├── offline-search.js
└── load-initial-results.js
    ├── → search-card-template.js (renderResults)
    ├── → populate-dropdowns.js (initializeDropdowns)
    └── → search-filters.js (storeResults, initializeFiltersAndSort)
```

### Key Modules

#### `search-card-template.js` (228 lines)

**Purpose:** Renders search results as styled card DOM elements

**Exports:**

```javascript
export function renderResults(results, containerId = "search-results-list")
```

**Functions:**

- `createSearchCard(result)` - Creates a single card DOM element
- `formatDate(dateStr)` - Formats dates to "Month YYYY"
- `renderResults(results, containerId)` - Main rendering function

**Card Structure:**

```html
<div class="aikb-search-card">
  <div class="aikb-search-card__inner">
    <div class="aikb-search-card__content">
      <div class="aikb-search-card__text">
        <h3 class="aikb-search-card__title">...</h3>
        <p class="aikb-search-card__summary">...</p>
      </div>
      <div class="aikb-search-card__tags">
        <div class="aikb-search-card__tag">...</div>
      </div>
    </div>
    <div class="aikb-search-card__actions">
      <a class="ntgc-btn ntgc-btn--secondary">
        <span>See more</span>
        <span class="fal fa-arrow-right"></span>
      </a>
      <div class="aikb-search-card__metadata">
        <div class="aikb-search-card__useful-for">...</div>
        <div class="aikb-search-card__date">...</div>
      </div>
    </div>
  </div>
</div>
```

#### `ntg-funnelback.js` (221 lines)

**Purpose:** Funnelback API integration with dynamic query parameters and offline fallback

**Key Properties:**

```javascript
defaults: {
  baseURL: "https://ntgov-search.funnelback.squiz.cloud/s/search.json",
  collection: "ntgov~sp-ntgc-ai-knowledge-base",
  defaultQuery: "!FunDoesNotExist:PadreNull",
  sourceField: "#search",
  minChars: 3
}
```

**Key Methods:**

```javascript
init(query); // Initialize with optional querystring parameter
callSearchAPI(query, onError); // Makes AJAX request (accepts query + error callback)
filterQuery(); // Removes noise words from originalterm → filteredterm
processResults(data); // Filters URLs, maps results, initializes dropdowns/filters, renders
```

**Query Parameter Logic:**

```javascript
// Initial load or no search term:
?collection=ntgov~sp-ntgc-ai-knowledge-base&s=!FunDoesNotExist:PadreNull

// User searches for "English":
?collection=ntgov~sp-ntgc-ai-knowledge-base&query=English
```

**URL Exclusion:**

```javascript
const excludedUrls = [
  "https://ntgcentral.nt.gov.au/dev/aikb/configuration/listing/articles/_nocache",
];
const filteredResults = results.filter(
  (r) => !excludedUrls.includes(r.liveUrl)
);
```

**Noise Words:** Filters out common words (a, the, and, etc.) before API call

**Fallback:** Loads `src/data/search.json` if API fails

#### `load-initial-results.js` (128 lines)

**Purpose:** Auto-load results on page load with parallel loading strategy

**Flow:**

1. Wait for `window.load` event
2. Delay 200ms for scripts to initialize
3. Check for `#search-results-list` container
4. **Parallel Loading:**
   - Fetch `search.json` immediately → Display fallback results instantly
   - Fetch Funnelback API in background → Update when ready
5. Parse Funnelback response structure
6. Filter excluded URLs
7. Map results to card format (including rank/score)
8. **Cache to window.aikbSearchCache** for offline search
9. Store results for filtering/sorting
10. Initialize dropdowns with work area data
11. Initialize filter and sort listeners (once, on fallback load)
12. Call `renderResults()`

**Key Features:**

- Immediate display of fallback data (no waiting for API)
- Background API update replaces fallback when ready
- Caches results for offline search capability
- Logs source: "from fallback" or "from api"

**Key Features:**

- Immediate display of fallback data (no waiting for API)
- Background API update replaces fallback when ready
- Caches results for offline search capability
- Logs source: "from fallback" or "from api"

#### `offline-search.js` (120 lines)

**Purpose:** Client-side keyword search using cached data when API unavailable

**Exports:**

```javascript
export function searchLocalData(keywords, results)
export function getCachedData()
```

**Scoring Algorithm:**

```javascript
// Match count scoring (simple, no TF-IDF)
Title matches:    3 points per occurrence (prioritized)
Summary matches:  1 point per occurrence
Metadata matches: 2 points per keyword match

// Results sorted by total score descending
```

**Features:**

- Regex-based partial matching (case-insensitive)
- Special character removal for normalization
- Filters out zero-score results
- Console logs: search query, result count, top 3 matches with scores
- Returns scored results with `_offlineScore` and `_offlineMatches` metadata

**Usage:**

```javascript
const cachedData = getCachedData(); // Get window.aikbSearchCache
const results = searchLocalData("English", cachedData);
// Returns: [{...result, _offlineScore: 5, _offlineMatches: {title: 1, summary: 2}}]
```

#### `populate-dropdowns.js` (200 lines)

**Purpose:** Dynamically populate work area and sort dropdowns

**Exports:**

```javascript
export function initializeDropdowns(results)
export function initializeEmptyDropdowns()
```

**Functions:**

- `extractWorkAreas(results)` - Gets unique work areas from results (splits comma-separated)
- `populateWorkAreaDropdown(workAreas)` - Populates `#document_type` dropdown
- `populateSortDropdown()` - Populates `#owner` with sort options
- `addDropdownIcons()` - Adds Font Awesome chevron-down icons

**Sort Options:**

- Relevance (default)
- Date (newest first)
- Date (oldest first)
- Title (A-Z)
- Title (Z-A)

#### `multi-select-dropdown.js` (344 lines)

**Purpose:** Custom multi-select dropdown component with OK/Cancel buttons

**Class:** `MultiSelectDropdown`

**Features:**

- Replaces standard `<select>` with custom component
- Checkboxes for each option
- "Select All" with indeterminate state support
- OK/Cancel buttons (changes only applied on OK)
- Click outside to cancel (same as Cancel button)
- Display shows: "Select Options", item count, or item names (max 2 shown)
- Stores instance reference on container: `container.__multiSelectInstance`

**Methods:**

```javascript
constructor(selectElement); // Initialize with <select> element
init(); // Setup component
createDropdownStructure(); // Build custom DOM
open() / close(); // Toggle dropdown
handleOk(); // Apply selections and close
handleCancel(); // Revert to previous state
handleSelectAll(e); // Select/deselect all items
getSelectedValues(); // Returns array of selected values
reset(); // Clear all selections
destroy(); // Remove component, restore original select
```

**Events:**

```javascript
// Dispatched on OK click
container.addEventListener("multiselect-change", (e) => {
  console.log(e.detail.values); // Array of selected values
});
```

**Helper Function:**

```javascript
export function initMultiSelect(selector)
// Accepts CSS selector string or DOM element
// Returns MultiSelectDropdown instance
```

#### `search-filters.js` (171 lines)

**Purpose:** Client-side filtering and sorting

**Exports:**

```javascript
export function storeResults(results)
export function initializeFiltersAndSort()
```

**Functions:**

- `storeResults(results)` - Stores results in module-level array
- `filterByWorkArea(workArea)` - Filters by work area (handles comma-separated)
- `sortResults(results, sortBy)` - Sorts by relevance/date/title
- `applyFiltersAndSort()` - Combines filtering + sorting + rendering
- `initializeFiltersAndSort()` - Attaches change event listeners to dropdowns

**Filtering Logic:**

```javascript
// "Management, Health" matches both "Management" and "Health"
const workAreaArray = result.listMetadata.keyword[0]
  .split(",")
  .map((a) => a.trim());
return workAreaArray.includes(selectedWorkArea);
```

**Sorting Logic:**

- **Relevance:** Sort by rank (lower better) or score (higher better)
- **Date:** Parse date field, sort by timestamp
- **Title:** Locale-aware alphabetical sort

#### `search-form-handler.js` (124 lines)

**Purpose:** Handle search form submissions with immediate offline search

**Features:**

- **Immediate offline search**: Displays cached results instantly while API loads
- Prevents default form submission
- Shows loading state (only if no cached data)
- Calls `ntgFunnelback.callSearchAPI()` with `onError` callback
- Handles clear input button
- Shows/hides clear button based on input
- Reloads initial results on empty search

**Offline Search Integration:**

```javascript
// 1. Perform offline search immediately
const cachedData = getCachedData();
if (cachedData) {
  const offlineResults = searchLocalData(query, cachedData);
  renderResults(offlineResults); // Display instantly
}

// 2. Fetch API in background
callSearchAPI(query, function onError(error) {
  // Only triggers if both API and fallback JSON fail
  // Offline results remain displayed
});
```

## 🎨 Styling System

### CSS Architecture

```
index.css
├── @import "./call-to-action.css"  (empty)
├── @import "./search-card.css"     (158 lines)
├── @import "./search-interface.css" (155 lines)
└── @import "./multi-select-dropdown.css" (168 lines)
```

### Design Tokens (CSS Variables)

```css
/* Colors */
--clr-surface-primary: white
--clr-stroke-default: #AFB5BF
--clr-stroke-subtle: #D0E0E0
--clr-text-default: #102040
--clr-text-body: #384560
--clr-text-helper: #606A80
--clr-icon-subtle: #878F9F
--clr-tag-tag-subtle: white
```

### Search Interface Styling

**Container:**

```css
.aikb-search-section {
  padding: 48px 54px;
  background: white;
}

.aikb-search-controls {
  display: flex;
  gap: 48px;
}
```

**Search Input:**

```css
.aikb-search-input-wrapper {
  flex: 1;
  height: 48px;
  padding: 24px;
  outline: 1px solid #afb5bf;
}

input::placeholder {
  color: #606a80;
}

.search-icon .fa-search {
  color: #878f9f;
  font-size: 20px;
}
```

**Dropdowns:**

```css
.aikb-dropdown-wrapper {
  width: 278px;
  padding: 12px 24px;
  outline: 1px solid #afb5bf;
}

.aikb-dropdown-icon .fa-chevron-down {
  color: #878f9f;
  font-size: 20px;
}
```

**Responsive (<1024px):**

- Stacked layout
- Full-width dropdowns
- Reduced padding

### Multi-Select Dropdown Styling

**Display Button:**

```css
.aikb-multiselect-button {
  width: 100%;
  padding: 12px 24px;
  outline: 1px solid #afb5bf;
  display: flex;
  justify-content: space-between;
}

.aikb-multiselect-text {
  color: #606a80; /* Helper text color */
}

.aikb-multiselect-text.aikb-multiselect-has-selection {
  color: #102040; /* Default text color when items selected */
}

.aikb-multiselect-icon {
  transition: transform 0.2s ease;
}

.aikb-multiselect-open .aikb-multiselect-icon {
  transform: rotate(180deg); /* Chevron rotates when open */
}
```

**Dropdown Panel:**

```css
.aikb-multiselect-panel {
  position: absolute;
  top: calc(100% + 4px);
  border: 1px solid #afb5bf;
  box-shadow: 0 4px 12px rgba(16, 32, 64, 0.1);
  max-height: 320px;
  z-index: 1000;
}

.aikb-multiselect-options {
  max-height: 240px;
  overflow-y: auto; /* Scrollable options list */
}

.aikb-multiselect-option {
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.aikb-multiselect-option:hover {
  background-color: #f5f6f7;
}

.aikb-multiselect-option-all {
  border-bottom: 1px solid #afb5bf;
  font-weight: 500; /* Select All stands out */
}
```

**Action Buttons:**

```css
.aikb-multiselect-actions {
  display: flex;
  border-top: 1px solid #afb5bf;
}

.aikb-multiselect-btn {
  flex: 1;
  padding: 12px 16px;
  font-weight: 500;
  cursor: pointer;
}

.aikb-multiselect-btn:hover {
  background-color: #f5f6f7;
}

.aikb-multiselect-btn-ok {
  border-right: 1px solid #afb5bf;
}
```

**Checkboxes:**

```css
.aikb-multiselect-checkbox {
  width: 18px;
  height: 18px;
  margin-right: 12px;
  accent-color: #208820; /* Green checkmark */
}
```

### Card Styling

**Desktop (default):**

- Padding: 24px 48px
- Title: 20px Roboto Bold (margin-top: 0 !important)
- Summary: 16px Roboto Regular
- Tags: Uppercase, 12px, splits comma-separated values
- Arrow icon: Absolutely positioned (right: 2rem, top: 1rem, color: #208820)

**Mobile (<768px):**

- Padding: 16px 24px
- Stacked layout
- Tags wrap

### Build System

### esbuild Configuration

```javascript
// Landing page JS
{
  entryPoint: "src/js/landing-page.js",
  bundle: true,
  format: "iife",
  minify: true,
  sourcemap: true,
  outfile: "dist/landing-page.min.js"
}
// Content page JS (if needed)
{
  entryPoint: "src/js/content-page.js",
  ...
  outfile: "dist/content-page.min.js"
}
```

### PostCSS Configuration

```javascript
// Landing page CSS
postcss src/css/landing-page.css --env production --map --output dist/landing-page.min.css
// Content page CSS (if needed)
postcss src/css/content-page.css --env production --map --output dist/content-page.min.css
```

### Build Output

```
dist/landing-page.min.js      # Landing page JS
dist/landing-page.min.css     # Landing page CSS
dist/content-page.min.js      # Content page JS (if needed)
dist/content-page.min.css     # Content page CSS (if needed)
```

      "results": [
        {
          "title": "Use case title",
          "summary": "Description...",
          "liveUrl": "https://...",
          "date": 1765584000000,
          "listMetadata": {
            "keyword": ["Work Area Category", "Good for audience"]
          }
        }
      ]
    }

}
}

````

### Card Template Mapping

```javascript
{
  title: result.title || "",
  summary: result.summary || "",
  listMetadata: result.listMetadata || {},
  date: new Date(result.date).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long"
  }),
  liveUrl: result.liveUrl || ""
}
````

### Work Area Tags

**Comma-separated categories are split:**

```
"Management, Health" → 2 tags: ["Management", "Health"]
"All work areas"     → 1 tag:  ["All work areas"]
```

## 🔧 Build System

### esbuild Configuration

```javascript
{
  entryPoint: "src/js/index.js",
  bundle: true,
  format: "iife",
  minify: true,
  sourcemap: true,
  outfile: "dist/aikb_scripts.min.js"
}
```

### PostCSS Configuration

```javascript
{
  plugins: {
    "postcss-import": {},        // Inline @import
    "autoprefixer": {},          // Browser prefixes
    "cssnano": {                 // Minify
      preset: "default"
    }
  }
}
```

### Build Output

```
dist/aikb_scripts.min.js      22.0kb (minified)
dist/aikb_scripts.min.js.map  75.4kb (source map)
dist/AIKB_styles.min.css      2.4kb (minified)
```

## 🐛 Troubleshooting

### Build Issues

**Error: Cannot find module**

```bash
npm install
```

**Build hangs or fails**

```bash
# Press Ctrl+C and use direct commands:
npx esbuild src/js/index.js --bundle --format=iife --minify --sourcemap --outfile=dist/aikb_scripts.min.js
npx postcss src/css/index.css --env production --map --output dist/AIKB_styles.min.css
```

### Runtime Issues

**No results display**

- Check browser console (F12) for errors
- Look for "Page load event fired" message
- Verify `#search-results-list` exists in HTML

**Container not found**

- Ensure element ID matches exactly
- Check script is loaded after HTML
- Verify import in `src/js/index.js`

**CORS errors**

- Use local server (not `file://` protocol)
- Try: `npx http-server -p 8000 -c-1`

**404 on search.json**

- Check path: `src/data/search.json`
- Verify file exists
- Check relative path from HTML location

### Styling Issues

**Styles not applying**

```bash
npm run build:css
# Hard refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
```

**CSS not updating**

- Check `dist/AIKB_styles.min.css` timestamp
- Clear browser cache
- Verify PostCSS import plugin installed

## 📊 Browser Console Debugging

**Expected console logs on page load:**

```
Search form handler initialized
Page load event fired, loading initial results...
Loading initial results (fallback first, then API)...
Fallback JSON response status: 200 true
Fallback JSON data loaded successfully: {...}
Rendering 14 cards from fallback
Stored 14 results for filtering/sorting
Cached 14 results for offline search
Populated work area dropdown with 7 options
Multi-select changed: []
Populated sort dropdown with 5 options
Filter and sort listeners initialized
Renderering 14 cards
Funnelback API response status: 200 true
Funnelback API data loaded successfully, updating results: {...}
Rendering 14 cards from api
Funnelback API results rendered (updated from offline/fallback)
```

**Expected console logs on search:**

```
Performing immediate offline search for fast results
Offline search: Searching for "English" in 14 cached results
Offline search: Found 3 results matching "English"
Offline search: Top results:
  1. "English as a Second Language" (score: 9, title:3, summary:0, metadata:0)
  2. "Translation Services" (score: 2, title:0, summary:2, metadata:0)
  3. "Language Support Programs" (score: 1, title:0, summary:1, metadata:0)
Offline search: Displayed 3 results (will update with API results)
callSearchAPI called with originalterm: English
After filterQuery, filteredterm: English
Calling Funnelback API: https://...?query=English
Processing 3 search results
After filtering: 3 results
Funnelback API results rendered (updated from offline/fallback)
```

**Expected console logs on multi-select filter:**

```
Multi-select changed: ["Legal", "Health"]
Work area multi-select changed
Applying filters - Work Areas: [Legal, Health], Sort: "relevance"
After filtering: 5 results
After sorting: 5 results
renderResults called with 5 results for container #search-results-list
Rendered 5 search result cards
```

**Expected console logs when API fails (offline fallback):**

```
Funnelback API error, loading fallback data: ...
Loaded fallback search data
Failed to load fallback search data
Triggering offline search fallback
Activating offline search mode
Offline search: Retrieved 14 cached results
Offline search: Searching for "test" in 14 cached results
API failed but offline results already displayed
```

## 🧪 Testing

### Manual Testing Checklist

**Initial Load:**

- [ ] Page loads without errors
- [ ] Fallback results display immediately ("from fallback" in console)
- [ ] API results update display after load ("from api" in console)
- [ ] Results cached to window.aikbSearchCache
- [ ] Top items display automatically (using ?s= parameter)
- [ ] Cards show title, summary, tags
- [ ] Work area tags split on commas
- [ ] Dates format as "Month YYYY"
- [ ] "Good for" displays when available
- [ ] Arrow icons positioned absolutely (right: 2rem, top: 1rem)

**Search Functionality:**

- [ ] Offline results display instantly (before API responds)
- [ ] API results update display when ready
- [ ] Offline search scores: title ×3, summary ×1, metadata ×2
- [ ] Console shows offline match details and scores
- [ ] Search form submission works
- [ ] Query parameter switches to ?query=<term>
- [ ] "Searching..." loading state (only if no cached data)
- [ ] Results update with searched items
- [ ] Clear button appears/disappears
- [ ] URL updates with query parameter
- [ ] Noise words filtered (a, the, and, etc.)
- [ ] Excluded URLs don't appear (Articles config page)
- [ ] Empty search reloads initial results

**Filtering & Sorting:**

- [ ] Work area shows multi-select dropdown (not standard select)
- [ ] Clicking dropdown opens panel with checkboxes
- [ ] "Select All" checkbox works with indeterminate state
- [ ] Multiple work areas can be selected
- [ ] Selections persist when Cancel is clicked
- [ ] OK button applies selections and triggers filtering
- [ ] Cancel button reverts to previous selections
- [ ] Click outside dropdown cancels (same as Cancel)
- [ ] Display shows "Select Options", count, or names
- [ ] Display shows "All selected" when all checked
- [ ] Multiple work areas filter with OR logic
- [ ] Sort dropdown has 6 options (default + 5 sorts)
- [ ] Sorting updates results (no page reload)
- [ ] Filter + sort combination works
- [ ] Dropdowns have chevron-down icons
- [ ] Multi-select chevron rotates when open

**Offline Functionality:**

- [ ] Block API in DevTools → Offline search activates
- [ ] Cached results searchable when API down
- [ ] Console shows "Offline search: Searching for..." message
- [ ] Results display even when fully offline
- [ ] Offline results show match scores in console
- [ ] Title matches ranked higher than summary matches

**Responsive Design:**

- [ ] Desktop: Horizontal layout with 48px gap
- [ ] Mobile (<768px): Stacked cards
- [ ] Tablet (<1024px): Stacked search controls
- [ ] Touch targets adequate on mobile

### Debug Mode

Add to HTML `<script>` tag:

```javascript
window.DEBUG = true;
```

## 📦 Dependencies

### Production

- **jQuery 3.4.1** - DOM manipulation and AJAX
- **Font Awesome** - Icons (fal fa-arrow-right, fal fa-search)

### Development

```json
{
  "esbuild": "^0.23.1",
  "postcss": "^8.4.32",
  "postcss-cli": "^11.0.0",
  "autoprefixer": "^10.4.16",
  "cssnano": "^6.0.2",
  "postcss-import": "^16.0.0",
  "npm-run-all": "^4.1.5",
  "rimraf": "^5.0.5"
}
```

## 🌐 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**Requirements:**

- ES6 support (arrow functions, const/let, template literals)
- CSS custom properties support
- Fetch API support

## 📈 Performance

**Bundle Sizes:**

- JavaScript: 22.0kb minified (with offline search + multi-select)
- CSS: 2.4kb minified
- Total: 24.4kb (gzips to ~8kb)

**Build Times:**

- JavaScript: ~100ms
- CSS: ~50ms
- Total: ~150ms

**Initial Load:**

- Fallback JSON displays in <100ms
- API update typically <500ms
- Results cached for offline search
- ~14 cards rendered in <50ms

**Search Performance:**

- Offline search: <10ms for 100 items
- Multi-select filtering: <5ms
- Instant results (no network delay)

## � AI Agent Development Guide

### For AI Coding Assistants

When working with this codebase:

**1. Understanding the Search Flow:**

- Initial load uses `?s=!FunDoesNotExist:PadreNull` for top items
- User searches use `?query=<term>` for keyword searches
- Results are stored in `search-filters.js` for client-side operations

**2. Key Integration Points:**

```javascript
// Add new filter criterion:
// 1. Update filterBy* function in search-filters.js
// 2. Add dropdown in HTML
// 3. Initialize in populate-dropdowns.js
// 4. Attach listener in initializeFiltersAndSort()

// Add new sort option:
// 1. Add case in sortResults() switch statement
// 2. Add option in populateSortDropdown()
```

**3. Module Communication:**

- `ntg-funnelback.js` → Fetches data, calls initialization functions
- `populate-dropdowns.js` → Extracts metadata, populates UI
- `search-filters.js` → Stores data, handles filter/sort logic
- `search-card-template.js` → Renders results (called by all)

**4. Common Tasks:**

**Add new metadata field to cards:**

```javascript
// 1. Update mapping in processResults() (ntg-funnelback.js)
// 2. Update createSearchCard() (search-card-template.js)
// 3. Add CSS class (search-card.css)
```

**Change API endpoint:**

```javascript
// Update defaults.baseURL in ntg-funnelback.js
// Update apiURL in load-initial-results.js
```

**Exclude additional URLs:**

```javascript
// Add to excludedUrls array in processResults() (ntg-funnelback.js)
```

**5. Debug Commands:**

```javascript
// Check stored results:
window.searchFilters = { results: allResults }; // Add to search-filters.js
console.log(window.searchFilters.results);

// Test filtering:
const filtered = filterByWorkArea("Legal");
console.log(filtered);

// Test API call:
window.ntgFunnelback.originalterm = "test";
window.ntgFunnelback.callSearchAPI();
```

**6. Build Verification:**

```bash
# After code changes:
npm run build

# Check bundle size:
ls -lh dist/

# Verify imports:
grep -r "import.*from" src/js/
```

## �🤝 Contributing

### Git Workflow

```bash
# Check status
git status

# View changes
git diff

# Stage changes
git add -A

# Commit
git commit -m "feat: add new feature"

# View history
git log --oneline -10
```

### Commit Message Format

```
feat: add new search filter
fix: resolve card rendering issue
docs: update README
style: format code with prettier
refactor: simplify card template logic
test: add unit tests for renderResults
chore: update dependencies
```

### Code Style

- Use ES6 modules (import/export)
- Prefer `const` over `let`
- Use template literals for strings
- Add JSDoc comments for functions
- Follow existing naming conventions

## 📚 Additional Resources

- [DOCUMENTATION/](DOCUMENTATION/) - Comprehensive docs
- [01-ARCHITECTURE.md](DOCUMENTATION/01-ARCHITECTURE.md) - System architecture
- [02-SEARCH-ENGINE.md](DOCUMENTATION/02-SEARCH-ENGINE.md) - Search details
- [04-COMPONENTS.md](DOCUMENTATION/04-COMPONENTS.md) - Component API
- [05-STYLING.md](DOCUMENTATION/05-STYLING.md) - CSS architecture

## 📝 Version History

**1.1.0** (December 13, 2025)

- ✅ Multi-select work area filter with OK/Cancel buttons
- ✅ Offline search capability with scoring algorithm
- ✅ Parallel loading strategy (immediate fallback + API updates)
- ✅ Client-side keyword search when API unavailable
- ✅ Search result caching for offline functionality
- ✅ Improved search performance (instant offline results)

**1.0.0** (December 13, 2025)

- ✅ Initial implementation
- ✅ Funnelback API integration
- ✅ Card-based search results
- ✅ Auto-load functionality
- ✅ Responsive design
- ✅ Build system (esbuild + PostCSS)

## 📧 Support

For questions or issues:

1. Check browser console for errors
2. Review documentation in `/DOCUMENTATION/`
3. Verify build output in `/dist/`
4. Check git history: `git log --oneline`

---

**Last Updated**: December 13, 2025  
**Version**: 1.1.0  
**Bundle Size**: 24.4kb (22.0kb JS + 2.4kb CSS)  
**License**: MIT

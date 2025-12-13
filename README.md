# AI Knowledge Base - NTG Central

**Modern search interface for AI use cases in the Northern Territory Government**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Bundle Size](https://img.shields.io/badge/bundle-11.7kb-blue)]()
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
- **Funnelback API integration** with local JSON fallback
- **Auto-loading results** on page initialization
- **Responsive design** optimized for desktop and mobile
- **Modular architecture** built with ES6 modules and PostCSS

### Key Features

✅ **Search Functionality**

- Dynamic query parameter switching: `&s=` for top items, `&query=` for searches
- Primary: Funnelback API (`ntgov~sp-ntgc-ai-knowledge-base` collection)
- Fallback: Local `search.json` file when API unavailable
- Auto-load top items on page load
- Manual search via form submission with noise word filtering
- URL exclusion filter (e.g., configuration pages)

✅ **Dynamic Filters & Sorting**

- Work area filter dropdown (dynamically populated from results)
- Sort by: Relevance, Date (newest/oldest), Title (A-Z/Z-A)
- Client-side filtering and sorting for instant results
- Preserves search state during filter/sort operations

✅ **Card-Based Results**

- Title, summary, work area tags (comma-separated tags split)
- "Useful for" metadata and submission dates
- Responsive layout (breakpoint at 768px)
- "See more" button with Font Awesome arrow icons (positioned absolutely)
- Validation ensures required fields (title, summary, liveUrl)

✅ **Build System**

- esbuild for JavaScript bundling (ES6 → IIFE)
- PostCSS for CSS processing
- Source maps for debugging
- ~11.7kb total bundle size (9.3kb JS + 2.4kb CSS)

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
│   │   ├── index.js                            # Entry point - imports all modules
│   │   ├── search-card-template.js             # Card rendering logic (228 lines)
│   │   ├── ntg-funnelback.js                   # Funnelback API integration (204 lines)
│   │   ├── search-form-handler.js              # Form submission handler (95 lines)
│   │   ├── populate-dropdowns.js               # Dynamic dropdown population (180 lines)
│   │   ├── search-filters.js                   # Client-side filtering & sorting (165 lines)
│   │   ├── cta-button-alias.js                 # CTA button styling (15 lines)
│   │   └── load-initial-results.js             # Auto-load on page load (105 lines)
│   │
│   ├── 📁 css/
│   │   ├── index.css                           # Entry point - imports all styles
│   │   ├── search-card.css                     # Card styling (158 lines)
│   │   ├── search-interface.css                # Search UI styling (155 lines)
│   │   └── call-to-action.css                  # CTA styling (empty placeholder)
│   │
│   └── 📁 data/
│       └── search.json                         # Fallback search data (Funnelback format)
│
├── 📁 dist/                                    # Build output (AUTO-GENERATED)
│   ├── aikb_scripts.min.js                     # Bundled JS (9.3kb)
│   ├── aikb_scripts.min.js.map                 # Source map
│   └── AIKB_styles.min.css                     # Bundled CSS (2.4kb)
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
npm run clean          # Delete dist folder
npm run prepare:dist   # Create dist directory
npm run build:js       # Build JavaScript only
npm run build:css      # Build CSS only
npm run build          # Full build (recommended)
npm start              # Start local server (if using server.js)
```

### Development Workflow

1. **Edit source files** in `src/` directory
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

// 2. Import in src/js/index.js
import "./my-module.js";

// 3. Build
npm run build
```

**CSS Module:**

```css
/* 1. Create src/css/my-styles.css */
.my-class {
  /* ... */
}

/* 2. Import in src/css/index.css */
@import "./my-styles.css";

/* 3. Build */
npm run build:css
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
Fetch Funnelback API (?s=!FunDoesNotExist:PadreNull)
    ↓
Parse response.resultPacket.results
    ↓
Filter excluded URLs
    ↓
Map to card format (title, summary, metadata, date, liveUrl, rank, score)
    ↓
storeResults() → Store for filtering/sorting
    ↓
initializeDropdowns() → Extract work areas & populate dropdowns
    ↓
initializeFiltersAndSort() → Attach event listeners
    ↓
renderResults() → Display cards in #search-results-list
```

**User Search:**

```
User enters "English" in #search input
    ↓
Form submission (search-form-handler.js)
    ↓
Set originalterm = "English"
    ↓
filterQuery() → Remove noise words → filteredterm = "English"
    ↓
Build URL: ?collection=...&query=English
    ↓
Fetch Funnelback API
    ↓
processResults() → Filter, map, store, initialize, render
```

**Filter/Sort:**

```
User selects work area or sort option
    ↓
Dropdown change event (search-filters.js)
    ↓
filterByWorkArea() → Filter stored results
    ↓
sortResults() → Sort by selected criteria
    ↓
renderResults() → Re-render filtered/sorted results
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
├── populate-dropdowns.js
├── search-filters.js
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

#### `ntg-funnelback.js` (204 lines)

**Purpose:** Funnelback API integration with dynamic query parameters

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
callSearchAPI(query); // Makes AJAX request (accepts optional query param)
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

#### `load-initial-results.js` (105 lines)

**Purpose:** Auto-load results on page load

**Flow:**

1. Wait for `window.load` event
2. Delay 200ms for scripts to initialize
3. Check for `#search-results-list` container
4. Fetch Funnelback API with `?s=` parameter (top items)
5. Fallback to `src/data/search.json` on network error
6. Parse Funnelback response structure
7. Filter excluded URLs
8. Map results to card format (including rank/score)
9. Store results for filtering/sorting
10. Initialize dropdowns with work area data
11. Initialize filter and sort listeners
12. Call `renderResults()`

#### `populate-dropdowns.js` (180 lines)

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

#### `search-filters.js` (165 lines)

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

#### `search-form-handler.js` (95 lines)

**Purpose:** Handle search form submissions

**Features:**

- Prevents default form submission
- Shows loading state
- Calls `ntgFunnelback.callSearchAPI()`
- Handles clear input button
- Shows/hides clear button based on input

## 🎨 Styling System

### CSS Architecture

```
index.css
├── @import "./call-to-action.css"  (empty)
├── @import "./search-card.css"     (158 lines)
└── @import "./search-interface.css" (155 lines)
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

### Key CSS Classes

```css
.aikb-search-card                        /* Card container */
/* Card container */
.aikb-search-card__title                 /* H3 title (margin-top: 0 !important) */
.aikb-search-card__summary               /* Description text */
.aikb-search-card__tag                   /* Work area tag */
.aikb-search-card__useful-for            /* "Useful for" metadata */
.aikb-search-card__date                  /* Submission date */
.aikb-search-card__actions .ntgc-btn .fa-long-arrow-right; /* Arrow icon positioning */
```

**Arrow Icon Styles:**

```css
.aikb-search-card__actions .ntgc-btn .fa-long-arrow-right {
  font-size: 1rem;
  color: #208820;
  position: absolute;
  right: 2rem;
  top: 1rem;
  transition: right 300ms ease;
}
```

## 🔌 API Integration

### Funnelback Response Format

```json
{
  "response": {
    "resultPacket": {
      "results": [
        {
          "title": "Use case title",
          "summary": "Description...",
          "liveUrl": "https://...",
          "date": 1765584000000,
          "listMetadata": {
            "keyword": ["Work Area Category", "Useful for audience"]
          }
        }
      ]
    }
  }
}
```

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
```

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
dist/aikb_scripts.min.js      9.3kb (minified)
dist/aikb_scripts.min.js.map  30.6kb (source map)
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
Loading initial results from Funnelback API...
Funnelback API response status: 200 true
Funnelback API data loaded successfully: {...}
Processing 15 search results
After filtering: 14 results (excluded 1)
Stored 14 results for filtering/sorting
Populated work area dropdown with 7 options
Populated sort dropdown with 5 options
Filter and sort listeners initialized
Renderering 14 cards
renderResults called with 14 results for container #search-results-list
document.getElementById("search-results-list"): <div...>
Rendered 14 search result cards
Search results rendered successfully
```

**Expected console logs on search:**

```
Search query: "English"
callSearchAPI called with originalterm: English
After filterQuery, filteredterm: English
Calling Funnelback API: https://ntgov-search.funnelback.squiz.cloud/s/search.json?collection=ntgov~sp-ntgc-ai-knowledge-base&query=English&num_ranks=10&start_rank=1
Processing 8 search results
After filtering: 8 results (excluded 0)
...
```

**Expected console logs on filter/sort:**

```
Work area filter changed to: Legal
Applying filters - Work Area: "Legal", Sort: "relevance"
After filtering: 2 results
After sorting: 2 results
renderResults called with 2 results for container #search-results-list
Rendered 2 search result cards
```

## 🧪 Testing

### Manual Testing Checklist

**Initial Load:**

- [ ] Page loads without errors
- [ ] Top items display automatically (using ?s= parameter)
- [ ] Cards show title, summary, tags
- [ ] Work area tags split on commas
- [ ] Dates format as "Month YYYY"
- [ ] "Useful for" displays when available
- [ ] Arrow icons positioned absolutely (right: 2rem, top: 1rem)

**Search Functionality:**

- [ ] Search form submission works
- [ ] Query parameter switches to ?query=<term>
- [ ] "Searching..." loading state displays
- [ ] Results update with searched items
- [ ] Clear button appears/disappears
- [ ] URL updates with query parameter
- [ ] Noise words filtered (a, the, and, etc.)
- [ ] Excluded URLs don't appear (Articles config page)

**Filtering & Sorting:**

- [ ] Work area dropdown populates from data
- [ ] Sort dropdown has 6 options (default + 5 sorts)
- [ ] Selecting work area filters results instantly
- [ ] Sorting updates results (no page reload)
- [ ] Filter + sort combination works
- [ ] "All work areas" shows all results
- [ ] Dropdowns have chevron-down icons

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

- JavaScript: 9.3kb minified
- CSS: 2.4kb minified
- Total: 11.7kb

**Build Times:**

- JavaScript: ~70ms
- CSS: ~50ms
- Total: ~120ms

**Initial Load:**

- Auto-fetches results on page load
- 200ms delay after window.load event
- ~10 cards rendered in <50ms

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
**Version**: 1.0.0  
**Bundle Size**: 11.7kb (9.3kb JS + 2.4kb CSS)  
**License**: MIT

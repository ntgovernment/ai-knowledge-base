# AI Knowledge Base - NTG Central

**Modern search interface for AI use cases in the Northern Territory Government**

> **Note:** All search and filtering is performed client-side in the browser. No server-side or external API search is used at runtime.

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
- [AI Agent & Copilot Usage](#ai-agent--copilot-usage)

## 🎯 Overview

The AI Knowledge Base is a searchable repository that helps NT Government employees discover practical AI applications and use cases across various work areas. The application features:

- **Card-based search results** with rich metadata
- **Multi-select work area filter** with OK/Cancel buttons
- **Offline search capability** using cached local data
- **Parallel loading strategy** (immediate fallback + API updates)
- **API integration** with local JSON fallback
- **Auto-loading results** on page initialization
- **Responsive design** optimized for desktop and mobile
- **Modular architecture** built with ES6 modules and PostCSS

### Key Features

- **Client-side search and filtering**: All search logic, filtering, and sorting are performed in the browser using local data (no server-side search).
- **Offline support**: Results are available instantly from cached data, even when offline.
- **Multi-select work area filter**: Select multiple work areas with checkboxes and OK/Cancel buttons.
- **Dynamic sorting**: Sort by relevance, date, or title instantly.
- **Responsive card-based results**: Modern UI with tags, metadata, and accessible design.

# AI Knowledge Base - NTG Central

**Modern, client-side search interface for AI use cases in the Northern Territory Government.**

> **Note:** All search and filtering is performed client-side in the browser. No server-side or external API search is used at runtime.

## Overview

The AI Knowledge Base helps NT Government employees discover practical AI applications and use cases. All search, filtering, and sorting is performed instantly in the browser using local data. No server-side search is used.

### Key Features

- Instant, client-side search and filtering
- Offline support (works with cached data)
- Multi-select work area filter
- Dynamic sorting (relevance, date, title)
- Responsive, accessible UI
- Small bundle size

## Quick Start

1. Clone the repository and `cd ai-knowledge-base`
2. Run `npm install` and `npm run build`
3. Start a local server (e.g. `npx http-server -p 8000`)
4. Open the main HTML file in your browser

## Project Structure

- Main HTML: `AI knowledge base _ NTG Central.html`
- Source: `src/js/` (JavaScript), `src/css/` (CSS), `src/data/search.json` (local data)
- Build output: `dist/`
- Docs: `DOCUMENTATION/`

## Development

- Edit source files in `src/js/` and `src/css/`
- Build with `npm run build`
- Refresh browser to see changes
- Add new JS or CSS files in `src/` and import as needed. Rebuild to apply changes.

## Architecture

- All search, filtering, and sorting is performed in the browser using local data.
- No server-side or external API search is performed at runtime.
- Key modules: search-card-template.js, ntg-funnelback.js, offline-search.js, populate-dropdowns.js, multi-select-dropdown.js, search-filters.js, search-form-handler.js

## Styling System

- Modular CSS in `src/css/`, built with PostCSS
- Responsive, accessible design

## Testing

- Manual: Load the app, search, filter, and sort results in the browser
- Offline: Block network and verify search still works

## Dependencies

- jQuery 3.4.1 (DOM/AJAX)
- Font Awesome (icons)
- esbuild, postcss, autoprefixer, cssnano (build/dev)

# AI Knowledge Base – NTG Central

**A fast, client-side search tool for AI use cases in the Northern Territory Government.**

## What is it?

This project provides a searchable knowledge base for NTG staff to discover practical AI applications. All search, filtering, and sorting is performed instantly in the browser using local data—no server-side or external API search is used.

## Features

- Instant, offline-capable search and filtering
- Multi-select work area filter
- Dynamic sorting (relevance, date, title)
- Responsive, accessible UI

## Getting Started

1. Clone the repository and enter the folder
2. Run `npm install` and `npm run build`
3. Start a local server (e.g. `npx http-server -p 8000`)
4. Open the main HTML file in your browser

## Structure

- Main HTML: `AI knowledge base _ NTG Central.html`
- Source: `src/js/`, `src/css/`, `src/data/search.json`
- Build output: `dist/`
- Docs: `DOCUMENTATION/`

## Development

- Edit files in `src/js/` and `src/css/`, then rebuild
- See [COPILOT_INSTRUCTIONS.md](COPILOT_INSTRUCTIONS.md) and [AGENTS.md](AGENTS.md) for agent and Copilot usage

## Support

- See `/DOCUMENTATION/` for more details
- Check browser console for errors

---

**Last Updated:** December 13, 2025  
**Version:** 1.1.0  
**License:** MIT
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

#### `ntg-funnelback.js`

**Purpose:** Handles loading and processing of local data, filtering, and search logic in the browser.

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

#### `offline-search.js`

**Purpose:** Performs all keyword search and scoring in the browser using cached data. No network requests are made for search.

#### `populate-dropdowns.js`

**Purpose:** Populates work area and sort dropdowns dynamically from local data.

#### `multi-select-dropdown.js`

**Purpose:** Provides a custom multi-select dropdown with checkboxes, Select All, and OK/Cancel buttons.

#### `search-filters.js`

**Purpose:** Handles all client-side filtering and sorting of results.

#### `search-form-handler.js`

**Purpose:** Handles search form submissions and triggers instant client-side search and filtering.

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

## 🤖 AI Agent & Copilot Usage

This project supports both human and AI contributors. For best practices, prompt engineering, and agent collaboration guidelines, see:

- [COPILOT_INSTRUCTIONS.md](COPILOT_INSTRUCTIONS.md) — Tips for using GitHub Copilot and prompt engineering
- [AGENTS.md](AGENTS.md) — Agent behaviors, troubleshooting, escalation, and handoff guidelines

These resources help ensure consistent, high-quality contributions from both developers and coding agents.

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
- ✅ API integration
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

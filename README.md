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

- Primary: Funnelback API (`ntgov~sp-ntgc-ai-knowledge-base` collection)
- Fallback: Local `search.json` file when API unavailable
- Auto-load results on page load
- Manual search via form submission

✅ **Card-Based Results**

- Title, summary, work area tags
- "Useful for" metadata and submission dates
- Responsive layout (breakpoint at 768px)
- "See more" button with Font Awesome icons

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
│   │   ├── ntg-funnelback.js                   # Funnelback API integration (218 lines)
│   │   ├── search-form-handler.js              # Form submission handler (95 lines)
│   │   ├── cta-button-alias.js                 # CTA button styling (15 lines)
│   │   └── load-initial-results.js             # Auto-load on page load (60 lines)
│   │
│   ├── 📁 css/
│   │   ├── index.css                           # Entry point - imports all styles
│   │   ├── search-card.css                     # Card styling (152 lines)
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

- `#search-results-list` - Main container (line 1173)
- `#policy-search-form` - Search form (line 1060)
- `#search` - Search input field

## 🏗 Architecture

### Data Flow

```
Page Load
    ↓
load-initial-results.js
    ↓
fetch("src/data/search.json")
    ↓
Parse Funnelback response
    ↓
Map to card format
    ↓
search-card-template.js → renderResults()
    ↓
Display cards in #search-results-list
```

### Module Dependencies

```
index.js
├── ntg-funnelback.js
├── cta-button-alias.js
├── search-card-template.js ← imported by load-initial-results.js
├── search-form-handler.js
└── load-initial-results.js
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

#### `ntg-funnelback.js` (218 lines)

**Purpose:** Funnelback API integration with fallback

**Key Methods:**

```javascript
callSearchAPI(); // Makes AJAX request to Funnelback
filterQuery(); // Removes noise words
processResults(data); // Maps results and calls renderResults
```

**API Endpoint:**

```
https://ntgov-search.funnelback.squiz.cloud/s/search.json
?collection=ntgov~sp-ntgc-ai-knowledge-base
&s=!FunDoesNotExist:PadreNull
&query=<search-term>
&num_ranks=10
&start_rank=1
```

#### `load-initial-results.js` (60 lines)

**Purpose:** Auto-load results on page load

**Flow:**

1. Wait for `window.load` event
2. Delay 200ms for scripts to initialize
3. Check for `#search-results-list` container
4. Fetch `src/data/search.json`
5. Parse Funnelback response structure
6. Map results to card format
7. Call `renderResults()`

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
└── @import "./search-card.css"     (152 lines)
```

### Design Tokens (CSS Variables)

```css
--clr-surface-primary: white
--clr-stroke-default: #afb5bf
--clr-text-default: #102040
--clr-text-body: #384560
```

### Card Styling

**Desktop (default):**

- Padding: 24px 48px
- Title: 20px Roboto Bold
- Summary: 16px Roboto Regular
- Tags: Uppercase, 12px

**Mobile (<768px):**

- Padding: 16px 24px
- Stacked layout
- Tags wrap

### Key CSS Classes

```css
.aikb-search-card              /* Card container */
/* Card container */
.aikb-search-card__title       /* H3 title (margin-top: 0 !important) */
.aikb-search-card__summary     /* Description text */
.aikb-search-card__tag         /* Work area tag */
.aikb-search-card__useful-for  /* "Useful for" metadata */
.aikb-search-card__date; /* Submission date */
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
Loading initial results...
Fetch response status: 200 true
JSON data loaded successfully: {...}
Rendering 10 cards
renderResults called with 10 results for container #search-results-list
document.getElementById("search-results-list"): <div...>
Rendered 10 search result cards
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Page loads without errors
- [ ] 10 results display on load
- [ ] Cards show title, summary, tags
- [ ] "See more" buttons have arrow icons
- [ ] Work area tags split on commas
- [ ] Dates format as "Month YYYY"
- [ ] "Useful for" displays when available
- [ ] Search form submission works
- [ ] Clear button appears/disappears
- [ ] Responsive layout works <768px

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

## 🤝 Contributing

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

# 04 - UI Components & Interactive Elements

## Overview

This document covers all interactive UI components, form elements, filters, and layout patterns used in the AI Knowledge Base portal.

---

## Content Page Components (2025 Update)

### Sidebar Component

**Container:** `.aikb-sidebar` with `.aikb-sidebar__inner`

**Responsive Behavior:**

- Mobile/tablet: Full width of column
- Medium+ (1024px+): Max-width 300px for optimal readability

**Structure:**

```html
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
```

### Code Example Blocks

**Runtime Wrapping:**

- JS automatically wraps `h2`-`h6` + `<pre>` into `.aikb-pre-block` for unified styling
- Copy button injected in `.copy-pre-btn-wrapper` outside `<pre>` (not included in copied text)

**Copy Button States:**

- Default: "Copy" text + copy icon (dual-page SVG)
- Success: "Copied" text + checkmark icon for ~1.6s, then reverts
- No toast overlay; button state change only

**Styling:**

- Borderless button, top-right aligned
- Contents wrap without horizontal scroll (`white-space: pre-wrap`, `word-break: break-word`)

### Back to Search Button

**Styling:**

- Icon color: `#208820` (green)
- Hover: Icon smoothly moves 4px left with 0.3s ease transition

**HTML:**

```html
<a href="..." class="ntgc-btn ntgc-btn--tertiary">
  <span class="fal fa-arrow-left mr-2"></span>Back to search
</a>
```

---

## Component Architecture

### Component Initialization

**File:** `components.js`

**Initialization Sequence:**

```javascript
$(document).ready(function () {
  // Initialize all components on page load

  // 1. Layout components
  initializeLayouts();

  // 2. Form components
  initializeForms();

  // 3. Interactive elements
  initializeAccordions();
  initializeDropdowns();
  initializeCarousels();

  // 4. Display modes
  initializeViewToggles();
});
```

---

## Filter System

### Filter Container

**HTML Location:** `#ntgc-page-filters`

**Structure:**

```html
<div id="ntgc-page-filters">
  <!-- Text Search Filter -->
  <div id="text-question">
    <!-- Content -->
  </div>

  <!-- Document Type Filter -->
  <div id="select-question-2">
    <!-- Content -->
  </div>

  <!-- Role/Owner Filter -->
  <div id="select-question-3">
    <!-- Content -->
  </div>
</div>
```

### Text Search Filter

**Purpose:** Free-form keyword search

**HTML:**

```html
<div id="text-question" class="search-input-container">
  <label for="search" class="ntgc-form-input--label">Search</label>
  <input
    type="text"
    id="search"
    name="query"
    placeholder="Search for a AI prompt or use case..."
    class="ntgc-text-input ntgc-text-input--block"
  />
  <!-- Search icon added via CSS ::after pseudo-element -->
</div>
```

**CSS-Based Search Icon:**

```css
/* Module: src/css/landing-page.css */

/* Hide any HTML-based search icon spans */
#policy-search-form .fal.fa-search {
  display: none;
}

/* Position container for absolute icon */
#policy-search-form .search-input-container {
  position: relative;
}

/* Add space for icon inside input */
#policy-search-form .search-input-container #search.ntgc-text-input {
  padding-right: 48px;
}

/* Search icon via pseudo-element */
#policy-search-form .search-input-container::after {
  content: "\f002"; /* Font Awesome search icon */
  font-family: "Font Awesome 5 Pro", "Font Awesome 5 Free", "FontAwesome";
  position: absolute;
  right: 24px; /* 24px from input's right border */
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  pointer-events: none;
}
```

**JavaScript Handling:**

```javascript
// Module: src/js/search-form-handler.js

// Enter key triggers search
$("#search").on("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    const query = $(this).val().trim();

    if (query === "") {
      // Empty Enter reloads initial results
      loadInitialResults();
    } else {
      // Execute offline search immediately
      triggerSearch(query);
    }
  }
});

function triggerSearch(query) {
  // 1. Run offline search on cached data (instant)
  const results = searchLocalData(query);
  storeResults(results);

  // 2. Initialize dropdowns and filters
  initializeDropdowns(results);
  initializeFiltersAndSort();

  // 3. Render results immediately
  renderResults(results);

  // 4. Call Funnelback API in background (no blocking)
  fetchFunnelbackResults(query).then((apiResults) => {
    storeResults(apiResults);
    initializeDropdowns(apiResults);
    initializeFiltersAndSort();
  });
}
```

**Key Features:**

- Search triggered **only on Enter key** (no auto-search)
- Empty Enter reloads initial results
- Offline search runs immediately on cached data
- API updates cache in background without blocking UI
- URL stays clean (no `?query=` parameter added)

````

### Document Type Filter (Dropdown)

**Purpose:** Filter by document category

**HTML:**

```html
<div id="select-question-2" class="ntgc-filter">
  <label for="document_type">Work Area / Document Type</label>
  <select
    id="document_type"
    name="document_type"
    class="ntgc-select sumoselect"
    multiple="multiple"
  >
    <option value="Instruction">Instruction</option>
    <option value="General order">General Order</option>
    <option value="Form">Form</option>
    <option value="Guideline">Guideline</option>
    <option value="Procedure">Procedure</option>
    <option value="Report">Report</option>
    <option value="Plan">Plan</option>
    <option value="Fees">Fees</option>
    <option value="Informational">Informational</option>
    <option value="Legislation">Legislation</option>
    <option value="Delegation">Delegation</option>
    <option value="Policy">Policy</option>
    <option value="Memorandum">Memorandum</option>
    <option value="Training program">Training Program</option>
    <option value="Template">Template</option>
  </select>
</div>
````

**Enhancement with SumoSelect:**

```javascript
// SumoSelect adds enhanced UI
$(".sumoselect").SumoSelect({
  selectableOptgroup: true,
  placeholder: "Select...",
  search: true,
  searchText: "Search options",
  noMatch: "No matching options",
});
```

**Result:** Improved dropdown with:

- Search/filter options
- Multiple selection UI
- Better mobile experience
- "Select All" option

### Role/Owner Filter (Dropdown)

**Purpose:** Filter by user's department/role

**HTML:**

```html
<div id="select-question-3" class="ntgc-filter">
  <label for="owner">Role / Department</label>
  <select
    id="owner"
    name="owner"
    class="ntgc-select sumoselect"
    multiple="multiple"
  >
    <option value="68">DCDD</option>
    <option value="70">Northern Command</option>
    <option value="72">People and Wellbeing</option>
    <option value="74">Professional Standards Command</option>
    <option value="76">Governance and Strategy</option>
  </select>
</div>
```

### Filter Submission

**Form Element:**

```html
<form id="policy-search-form">
  <!-- Filters -->

  <button type="submit" class="ntgc-btn ntgc-btn--primary">
    Apply Filters
  </button>
</form>
```

**Event Handler:**

```javascript
$("#policy-search-form").on("submit", function (e) {
  e.preventDefault();

  // Gather filter values
  var query = $("#search").val();
  var doctype = $("#document_type").val();
  var owner = $("#owner").val();

  // Execute search with filters
  ntgCOVEO.originalterm = query;
  ntgCOVEO.doctype = doctype;
  ntgCOVEO.owner = owner;
  ntgCOVEO.callSearchAPI();
});
```

---

## Result Card Component

### Result Card Structure

**CSS Classes:** `au-card`, `search-result`

**HTML Template:**

```html
<div class="au-card search-result">
  <div class="au-card__inner">
    <!-- Title Section -->
    <h3 class="au-card__title search-result__title">
      <i class="fas fa-file-pdf"></i>
      AI Implementation Guide
    </h3>

    <!-- Description -->
    <p class="search-result__description">
      Step-by-step guide for implementing AI systems in your department. This
      comprehensive resource covers best practices, tools, and training.
    </p>

    <!-- Metadata -->
    <div class="search-result__meta">
      <span class="badge ntgc-badge--primary">Policy</span>
      <span class="meta-item">
        <i class="far fa-calendar"></i>
        Updated: Dec 10, 2025
      </span>
      <span class="meta-item">
        <i class="far fa-file"></i>
        2.5 MB
      </span>
    </div>

    <!-- Action Buttons -->
    <div class="search-result__actions">
      <a href="[download-url]" class="au-btn au-btn--secondary" download>
        <i class="fas fa-download"></i> Download
      </a>
      <a
        href="[view-url]"
        class="au-btn au-btn--secondary"
        target="_blank"
        rel="noopener"
      >
        <i class="fas fa-external-link-alt"></i> Open in New Tab
      </a>
    </div>
  </div>
</div>
```

### Card Styling

**Color Scheme:**

```css
.au-card {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background: #ffffff;
  transition: box-shadow 0.2s ease;
}

.au-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.au-card__title {
  color: #102040; /* Primary blue */
  font-weight: bold;
  margin-bottom: 1rem;
}
```

### Dynamic Rendering

**JavaScript:**

```javascript
function renderSearchResults(results) {
  var html = results
    .map(
      (result) => `
    <div class="au-card search-result">
      <div class="au-card__inner">
        <h3 class="au-card__title">
          <i class="${getIconClass(result.doctype)}"></i>
          ${escapeHtml(result.title)}
        </h3>
        <p class="search-result__description">
          ${escapeHtml(result.description)}
        </p>
        <div class="search-result__meta">
          <span class="badge">${result.doctype}</span>
          <span class="meta-item">Updated: ${formatDate(result.modified)}</span>
          <span class="meta-item">${formatFileSize(result.size)}</span>
        </div>
        <div class="search-result__actions">
          <a href="${
            result.downloadUrl
          }" class="au-btn au-btn--secondary" download>
            <i class="fas fa-download"></i> Download
          </a>
          <a href="${
            result.viewUrl
          }" class="au-btn au-btn--secondary" target="_blank">
            <i class="fas fa-external-link-alt"></i> Open
          </a>
        </div>
      </div>
    </div>
  `
    )
    .join("");

  $("#search-results-list").html(html);
}

function getIconClass(doctype) {
  const icons = {
    Policy: "fas fa-file-pdf",
    Guideline: "fas fa-list-check",
    Form: "fas fa-file-form",
    "Training program": "fas fa-graduation-cap",
    default: "fas fa-file",
  };
  return icons[doctype] || icons["default"];
}
```

---

## Pagination Component

### Pagination Container

**HTML Location:** `#sync-pagination`

**HTML Structure:**

```html
<div id="sync-pagination" class="ntgc-pagination">
  <nav aria-label="Search results pagination">
    <ul class="pagination">
      <!-- Previous Button -->
      <li>
        <a href="?...&page=1" class="page-link prev">
          <i class="fal fa-chevron-left"></i>
          Previous
        </a>
      </li>

      <!-- Page Numbers -->
      <li><a href="?...&page=1" class="page-link">1</a></li>
      <li><a href="?...&page=2" class="page-link active">2</a></li>
      <li><a href="?...&page=3" class="page-link">3</a></li>
      <li><span class="page-ellipsis">...</span></li>

      <!-- Next Button -->
      <li>
        <a href="?...&page=3" class="page-link next">
          Next
          <i class="fal fa-chevron-right"></i>
        </a>
      </li>
    </ul>

    <!-- Results Info -->
    <div class="pagination-info">
      <span class="result-count">Showing 13-24 of 47 results</span>
    </div>
  </nav>
</div>
```

### Pagination JavaScript

**File:** `pagination.min.js`

```javascript
// Handle pagination
$(".pagination a").on("click", function (e) {
  e.preventDefault();

  // Get page number from URL
  var url = $(this).attr("href");
  var pageMatch = url.match(/page=(\d+)/);
  var pageNum = pageMatch ? pageMatch[1] : 1;

  // Update URL
  window.history.replaceState({}, "", url);

  // Scroll to results
  $("html, body").animate(
    {
      scrollTop: $("#search-results-list").offset().top - 100,
    },
    300
  );

  // Fetch and display results
  ntgCOVEO.callSearchAPI();
});
```

---

## Navigation Components

### Main Navigation Menu

**HTML:**

```html
<nav class="ntgc-navigation--main" id="mainmenu">
  <ul class="ntgc-nav-list">
    <li>
      <a href="/my-job">My Job</a>
    </li>
    <li>
      <a href="/services-support">Services & Support</a>
    </li>
    <li>
      <a href="/safety">Safety</a>
    </li>
    <li>
      <a href="/our-government">Our Government</a>
    </li>
    <li>
      <a href="/online-systems">Online Systems</a>
    </li>
  </ul>
</nav>
```

### Mobile Navigation

**Responsive Behavior:**

```css
@media (max-width: 768px) {
  .ntgc-navigation--main {
    display: none; /* Hidden on mobile */
  }

  .ntgc-navigation--mobile {
    display: block; /* Show mobile menu */
  }

  .ntgc-nav-toggle {
    display: block; /* Show hamburger icon */
  }
}
```

**Toggle JavaScript:**

```javascript
$(".ntgc-nav-toggle").on("click", function () {
  $(this).toggleClass("active");
  $(".ntgc-navigation--mobile").fadeToggle(200);
});
```

---

## Accordion Component (AU Design System)

### Accordion Structure

**Purpose:** Collapsible sections

**HTML:**

```html
<div class="au-accordion">
  <!-- Accordion Title (Clickable) -->
  <button
    class="au-accordion__title"
    aria-expanded="false"
    aria-controls="accordion-content-1"
  >
    <i class="fas fa-chevron-down"></i>
    Advanced Filters
  </button>

  <!-- Accordion Body (Hidden initially) -->
  <div class="au-accordion__body" id="accordion-content-1">
    <div class="au-accordion__body-wrapper">
      <!-- Content -->
      <p>Additional filtering options...</p>
    </div>
  </div>
</div>
```

### Accordion JavaScript

```javascript
// AU.accordion is provided by auds.js

// Toggle accordion
AU.accordion.Toggle(
  $("#accordion-button"), // Button element
  250, // Animation speed (ms)
  {
    onOpen: function () {
      console.log("Accordion opened");
    },
    afterOpen: function () {
      // Content fully visible
    },
    onClose: function () {
      console.log("Accordion closing");
    },
    afterClose: function () {
      // Content fully hidden
    },
  }
);

// Open accordion
AU.accordion.Open($("#accordion-button"), 250);

// Close accordion
AU.accordion.Close($("#accordion-button"), 250);
```

### CSS States

```css
/* Closed state */
.au-accordion__body.au-accordion--closed {
  display: none;
  height: 0;
}

/* Open state */
.au-accordion__body.au-accordion--open {
  display: block;
  height: auto;
}

/* Animated chevron icon */
.au-accordion__title:after {
  transition: transform 0.25s ease-in;
}

.au-accordion__title.au-accordion--closed:after {
  transform: rotate(-180deg);
}
```

---

## Tabs Component

### Tab Structure

**HTML:**

```html
<div class="ntgc-tabs">
  <!-- Tab Navigation -->
  <ul class="ntgc-tabs__nav">
    <li class="ntgc-tabs__item">
      <a href="#tab-1" class="ntgc-tabs__link ntgc-tabs__active"> Overview </a>
    </li>
    <li class="ntgc-tabs__item">
      <a href="#tab-2" class="ntgc-tabs__link"> Details </a>
    </li>
    <li class="ntgc-tabs__item">
      <a href="#tab-3" class="ntgc-tabs__link"> Resources </a>
    </li>
  </ul>

  <!-- Tab Content -->
  <div class="ntgc-tabs__content">
    <div id="tab-1" class="ntg-tabs__content" style="display: block;">
      <h3>Overview</h3>
      <p>Content for overview tab...</p>
    </div>

    <div id="tab-2" class="ntg-tabs__content" style="display: none;">
      <h3>Details</h3>
      <p>Detailed information...</p>
    </div>

    <div id="tab-3" class="ntg-tabs__content" style="display: none;">
      <h3>Resources</h3>
      <p>Resource links...</p>
    </div>
  </div>
</div>
```

### Tab JavaScript

```javascript
$(".ntgc-tabs__nav .ntgc-tabs__item").click(function (e) {
  e.preventDefault();

  var currentNav = $(this).closest(".ntgc-tabs__nav");
  var tabLink = $(this).find("a");
  var targetTab = tabLink.attr("href");

  // Remove active class from all items
  currentNav.find(".ntgc-tabs__item").removeClass("ntgc-tabs__active");

  // Add active class to clicked item
  $(this).addClass("ntgc-tabs__active");

  // Hide all content
  $(".ntg-tabs__content").hide();

  // Show target content
  $(targetTab).fadeIn(200);
});
```

---

## Image Carousel (Fotorama)

### Carousel HTML

**File:** `imageslider-fotorama.js`, `imageslider-fotorama.css`

```html
<div class="fotorama" data-width="100%" data-ratio="16/9">
  <img src="image-1.jpg" alt="Slide 1" />
  <img src="image-2.jpg" alt="Slide 2" />
  <img src="image-3.jpg" alt="Slide 3" />
</div>
```

### Carousel Configuration

```javascript
// Fotorama initialization
$(".fotorama").fotorama({
  width: "100%",
  ratio: 16 / 9,
  arrows: true,
  dots: true,
  autoplay: false,
  hash: false,
  transition: "slide",
});
```

### Controls

- **Previous/Next Arrows:** Navigate between slides
- **Dots:** Jump to specific slide
- **Keyboard:** Arrow keys to navigate
- **Touch:** Swipe on mobile

---

## Table Component

### Table Styling

**CSS Class:** `ntgc-table`

```html
<table class="ntgc-table">
  <caption>
    Data Table Caption
  </caption>

  <thead class="ntgc-table__head">
    <tr class="ntgc-table__row">
      <th class="ntgc-table__header">Column 1</th>
      <th class="ntgc-table__header">Column 2</th>
      <th class="ntgc-table__header ntgc-table__header--numeric">Number</th>
    </tr>
  </thead>

  <tbody class="ntgc-table__body">
    <tr class="ntgc-table__row">
      <td class="ntgc-table__cell">Data 1</td>
      <td class="ntgc-table__cell">Data 2</td>
      <td class="ntgc-table__cell ntgc-table__cell--numeric">123</td>
    </tr>
  </tbody>
</table>
```

### Table Sorting

**File:** `jquery.tablesort.min.js`

```javascript
// Enable sorting on table
$("table.ntgc-table").tablesort();

// Click column headers to sort
// Automatic handling of:
// - Text sorting (A-Z)
// - Number sorting (0-9)
// - Date sorting
```

### Responsive Tables

```css
@media (max-width: 768px) {
  .ntgc-table__wrapper {
    overflow-x: auto;
  }

  table {
    font-size: 14px;
  }
}
```

---

## Button Components

### Button Styles

**Primary Button:**

```html
<button class="au-btn au-btn--primary">Apply Filters</button>
```

**Secondary Button:**

```html
<button class="au-btn au-btn--secondary">Cancel</button>
```

**Link Button:**

```html
<a href="/path" class="au-btn au-btn--secondary"> View More </a>
```

### Button Sizing

```css
/* Default size */
.au-btn {
  padding: 10px 20px;
  font-size: 16px;
}

/* Small button */
.au-btn--small {
  padding: 6px 12px;
  font-size: 14px;
}

/* Large button */
.au-btn--large {
  padding: 14px 28px;
  font-size: 18px;
}
```

### Button States

```css
/* Normal */
.au-btn {
  background: #102040;
  color: white;
}

/* Hover */
.au-btn:hover {
  background: #304060;
}

/* Focus (Keyboard) */
.au-btn:focus {
  outline: 3px solid #90d898;
  outline-offset: 2px;
}

/* Disabled */
.au-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

---

## Form Components

### Text Input

```html
<input
  type="text"
  class="ntgc-text-input ntgc-text-input--block"
  placeholder="Enter text..."
/>
```

### Checkbox

```html
<div class="au-control-input au-control-input--block">
  <input type="checkbox" class="au-control-input__input" id="checkbox-1" />
  <label class="au-control-input__text" for="checkbox-1"> Option 1 </label>
</div>
```

### Radio Button

```html
<div class="au-control-input au-control-input--block">
  <input
    type="radio"
    class="au-control-input__input"
    id="radio-1"
    name="group"
  />
  <label class="au-control-input__text" for="radio-1"> Option 1 </label>
</div>
```

### Select Dropdown

```html
<select class="ntgc-select ntgc-select--block">
  <option value="">Choose an option...</option>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
</select>
```

---

## Next Steps

Read **[05-STYLING.md](05-STYLING.md)** to understand the CSS framework and styling system.

# 01 - Architecture & System Design

## System Overview

The NTG Central AI Knowledge Base is a **modern enterprise search portal** built on a multi-layered architecture combining frontend search UI with backend API integration. It serves as a centralized discovery platform for NT government employees seeking AI guidance and resources.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Browser / Client                    │
│  (HTML Page, jQuery, Components, Event Handlers)    │
└────────────────┬────────────────────────────────────┘
                 │
     ┌───────────┴─────────────┬──────────────────┐
     │                         │                  │
┌────▼────────┐    ┌──────────▼──────┐   ┌───────▼──────┐
│ localStorage │    │ URL Parameters  │   │  Form Input  │
│ (User Data)  │    │ (State Mgmt)    │   │  (Filters)   │
└──────────────┘    └─────────────────┘   └──────────────┘
                 │
        ┌────────▼─────────┐
        │  jQuery AJAX     │
        │  Search Engine   │
        │  (ntgFunnelback) │
        └────────┬─────────┘
                 │
    ┌────────────┴────────────────┐
    │                             │
┌───▼──────────────────┐  ┌──────▼──────────────┐
│ Funnelback Search API│  │ Google Analytics   │
│ (Query & Filtering)  │  │ (Event Tracking)   │
└──────────────────────┘  └────────────────────┘
```

---

## Technology Stack

### Frontend Framework & Libraries

#### Core Dependencies

| Library                            | Version | Purpose                                                  |
| ---------------------------------- | ------- | -------------------------------------------------------- |
| **jQuery**                         | 3.4.1   | DOM manipulation, AJAX calls, event handling             |
| **Australian Design System (AUS)** | v7+     | Government web standards, accessibility-first components |
| **Bootstrap Grid**                 | 4.1.3   | 12-column responsive layout system                       |
| **Modernizr**                      | 3.6.0   | Feature detection for browser compatibility              |

#### UI Enhancement Libraries

| Library              | Version | Purpose                                  |
| -------------------- | ------- | ---------------------------------------- |
| **SumoSelect**       | 3.4.9   | Enhanced multi-select dropdown filtering |
| **Fotorama**         | Latest  | Image carousel/slider component          |
| **jQuery TableSort** | Latest  | Table sorting functionality              |
| **Moment.js**        | Latest  | Date/time formatting utilities           |

### Styling & Typography

#### CSS Framework

- **Bootstrap Grid System** - Responsive columns (xs, sm, md, lg)
- **NTG Custom Styles** - Brand-specific components via `main.css`
- **AU Design System CSS** - Accessibility-compliant components

#### Font Families

```css
Primary Text: Roboto (Google Fonts)
Display/Headings: neue-haas-grotesk (Adobe Typekit)
Monospace: SFMono-Regular, Courier
```

#### Icon System

- **Font Awesome Pro** v5.15.4
- Glyph-based icons (fa, fal, fas classes)

### Search & Discovery

#### Funnelback Search (in-page)

- **API Type:** REST-based enterprise search (Squiz Cloud)
- **Integration Method:** jQuery AJAX GET directly to Funnelback
- **Features (current runtime):**
  - Input sanitization and noise-word filtering
  - Start-rank pagination (10 results per page)
  - URL state for `query` and `page`
  - Results currently rendered as pretty-printed JSON in the main container

#### Query Processing Flow

```javascript
User Input
  ↓
Validation & Sanitization (remove special chars)
  ↓
Noise Word Removal (filter common words)
  ↓
Funnelback API Request (query + start_rank + num_ranks)
  ↓
Render raw JSON into results container (current state)
  ↓
Analytics Logging (GA4)
```

### Analytics & Tracking

- **Google Analytics 4** (Tracking ID: G-09TV1G846C)
- Event tracking for:
  - Search queries
  - Filter selections
  - Result clicks
  - User interactions

---

## HTML Structure & DOM Organization

### Root Element

```html
<html class="js objectfit object-fit is-pointer" lang="en">
  <body class="ntg-central au-grid" data-personas-active="[]"></body>
</html>
```

### Main Layout Regions

#### 1. Skip Links (Accessibility)

```html
<nav class="au-skip-link" aria-label="skip links navigation">
  <a class="au-skip-link__link" href="#content">Skip to main content</a>
  <a class="au-skip-link__link" href="#mainmenu">Skip to main navigation</a>
</nav>
```

**Purpose:** Keyboard-only users can jump directly to main content

#### 2. Header Section

```html
<header class="ntgc-header ntgc-header--dark ntgc-header--graphic">
  <div class="container header-wrapper">
    <!-- Logo, Search, Navigation, Profile -->
  </div>
</header>
```

**Key Components:**

- NTG Logo (SVG)
- Mobile search button
- Main navigation menu
- User profile section

#### 3. Main Content Area

```html
<div id="content" class="ntgc-body">
  <div class="inner-page au-body">
    <form id="policy-search-form">
      <!-- Filters, Search Box, Dropdowns -->
    </form>
    <div id="search-results-list">
      <!-- Dynamic results inserted here -->
    </div>
    <div id="sync-pagination">
      <!-- Pagination controls -->
    </div>
  </div>
</div>
```

#### 4. Footer Section

```html
<footer class="ntgc-footer">
  <!-- Navigation links, legal, acknowledgments -->
</footer>
```

### Component Hierarchy

```
<body class="ntg-central au-grid">
├── <nav class="au-skip-link"> (Accessibility)
├── <header class="ntgc-header">
│   ├── Logo & Branding
│   ├── Navigation Menu
│   └── User Profile
├── <main id="content" class="ntgc-body">
│   ├── <form id="policy-search-form">
│   │   ├── Text Search Input
│   │   ├── Document Type Dropdown
│   │   └── Role/Owner Dropdown
│   ├── <div id="search-results-list"> (Dynamic)
│   └── <div id="sync-pagination"> (Dynamic)
├── <footer class="ntgc-footer">
└── <div class="ntgc-status--toolbar"> (Admin only)
```

---

## State Management

### Storage Mechanisms

#### 1. localStorage (Client-Side Persistence)

**Purpose:** Cache user profile information across sessions

**Data Structure:**

```javascript
// User Profile Data
{
  "user_name": "Roy Galet",
  "user_email": "roy.galet@nt.gov.au",
  "user_phone": "+61889996162",
  "user_title": "Manager Frontend Design",
  "user_location": "Charles Darwin Centre 10th Floor",
  "user_department": "68",
  "user_asset_id": "770097"
}
```

**Usage Example:**

```javascript
// Saving user data
localStorage.setItem("user_name", "Roy Galet");

// Retrieving user data
const userName = localStorage.getItem("user_name");
```

#### 2. URL Query Parameters (State in URL)

**Purpose:** Maintain search state across page refreshes

**Parameters:**

```
?query=AI+productivity       // Search term
&doctype=Policy;Guideline   // Document types (semicolon-separated)
&owner=68;70                // Department IDs (semicolon-separated)
&page=2                     // Results page number
```

**Example URL:**

```
Local dev copy; external URL removed for offline use.
```

#### 3. JavaScript Variables

**Purpose:** Runtime state during session

**Key Variables:**

```javascript
ntgCOVEO.originalterm; // User's original search term
ntgCOVEO.correctedterm; // Spell-corrected term
ntgCOVEO.filteredterm; // Term after noise word removal
ntgCOVEO.doctype; // Selected document types (array)
ntgCOVEO.owner; // Selected departments (array)
ntgCOVEO.searchresults; // Result data from API
ntgCOVEO.searchmeta; // Metadata about results
```

---

## Data Flow Diagram

### Search Query Flow

```
┌─────────────────┐
│ User Types Query│
└────────┬────────┘
         │
         ▼
┌──────────────────────────────┐
│ Validate & Sanitize Input    │
│ (remove special characters)  │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ Apply Filters                │
│ - Document Type              │
│ - Role/Department            │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ Build URL Parameters         │
│ Update window.location.search│
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ Remove Noise Words           │
│ (a, the, and, etc.)          │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ Call Coveo Search API        │
│ (AJAX POST/GET)              │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ Process API Response         │
│ Parse JSON results           │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ Render Results               │
│ 12 per page                  │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ Log to Google Analytics      │
└──────────────────────────────┘
```

---

### Key JavaScript Objects

### ntgFunnelback Object (In-page Search Engine)

**Namespace:** Global `window.ntgFunnelback`

**Properties (current runtime):**

```javascript
{
  originalterm: '',       // User input as typed
  filteredterm: '',       // After noise-word removal
  currentPage: 1,         // 1-based page index
  defaults: {
    sourceField: '#search',
    endpointURL: 'https://ntgov-search.funnelback.squiz.cloud/s/search.json?collection=ntgov~sp-ntgc-ai-knowledge-base&profile=ai-knowledge-base-search-results_live&log=false&s=!FunDoesNotExist:PadreNull&start_rank=1',
    funnelbackParams: {},
    minChars: 3,
    containerSelector: '#content .inner-page.au-body .container'
  },
  noisewords: 'a au all am an and ... yours'
}
```

**Key Methods (current runtime):**

```javascript
ntgFunnelback.init(query); // Binds form and kicks off initial search
ntgFunnelback.callSearchAPI(); // Builds URL, calls Funnelback, prints JSON
ntgFunnelback.filterQuery(); // Removes noise words and sanitizes input
```

### Squiz_Matrix_API Object (Profile Management)

**Purpose:** Handle user profile data and API calls

**Key Methods:**

```javascript
new Squiz_Matrix_API({key: 'api_key'})
  .getMetadata({asset_id: 770097, dataCallback: function(data) {...}})
  .setMetadata({asset_id: 770097, field_id: '...', field_val: '...'})
```

---

## Page Initialization Sequence

### On Page Load

```javascript
// 1. Feature Detection
// Modernizr detects browser capabilities

// 2. Set JS Class
document.documentElement.classList.add("js");

// 3. Initialize Search Engine
ntgCOVEO.init(
  query, // From URL parameter
  doctype, // From URL parameter
  owner, // From URL parameter
  corrections, // Enable spell check
  scopeID // Optional scope
);

// 4. Load User Profile
// Pull from localStorage if cached
// Otherwise fetch from API

// 5. Bind Event Handlers
// Form submission
// Filter changes
// Click events

// 6. Load Components
// Initialize dropdowns (SumoSelect)
// Setup pagination
// Setup galleries (Fotorama)
```

---

## Security Considerations

### Content Security Policy (CSP)

```html
<meta
  http-equiv="Content-Security-Policy"
  content="upgrade-insecure-requests"
/>
```

**Effect:** Forces all HTTP requests to HTTPS

### Input Validation

```javascript
// Remove potentially dangerous characters
var regex = new RegExp("[*<>();/&]", "gi");
query = query.replace(regex, "");
```

### Authentication

- **Method:** SAML integration with NT Government directory
- **Session:** Stored in localStorage (user data only, no tokens)
- **Nonce Tokens:** Required for API calls

---

## Browser Compatibility

### Supported Browsers

- Modern versions (Chrome, Firefox, Safari, Edge)
- IE 9+ support (via Modernizr feature detection)
- Mobile browsers (responsive design)

### Polyfills & Fallbacks

- **HTML5 Features:** Modernizr detects and provides fallbacks
- **CSS Grid:** Bootstrap grid fallback for older browsers
- **Object Fit:** CSS background image fallback for IE

---

## Performance Considerations

### Key Optimizations

1. **Lazy Loading**

   - Images loaded on demand
   - Results paginated (12 per page)

2. **Caching**

   - localStorage for user data
   - Browser cache for assets

3. **Minified Resources**

   - JavaScript minified (e.g., `jquery-3.4.1.min.js`)
   - CSS combined in `main.css`

4. **Asset Delivery**
   - Font Awesome Pro served locally
   - Google Fonts async loaded
   - SVG logo (scalable, small file size)

---

## Integration Points

### External Services

| Service              | Type         | Purpose              |
| -------------------- | ------------ | -------------------- |
| **Coveo Search API** | REST         | Search & filtering   |
| **Google Analytics** | Tracking     | Usage analytics      |
| **Font Awesome**     | Icon Library | UI icons             |
| **Google Fonts**     | Typography   | Roboto font family   |
| **Adobe Typekit**    | Typography   | Custom display fonts |

### Internal Services

| Service                  | Purpose                |
| ------------------------ | ---------------------- |
| **NTG Directory**        | Phone/email lookup     |
| **myForms**              | Form submission portal |
| **Department Intranets** | Resource links         |
| **Policy Library**       | Policy documents       |

---

## Next Steps

Read **[02-SEARCH-ENGINE.md](02-SEARCH-ENGINE.md)** to understand how the Coveo search engine works and how queries are processed.

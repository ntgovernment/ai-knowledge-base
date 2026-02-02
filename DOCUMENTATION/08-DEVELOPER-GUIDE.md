# 08 - Developer Guide & Best Practices

## Overview

This guide covers setup, development workflow, debugging, and best practices for working with the NTG Central AI Knowledge Base codebase.

---

## Important: Active Codebase

This codebase is actively maintained. Source lives in `src/` (modular CSS/JS per page type plus shared utilities) and builds to `dist/` via npm scripts.

---

## Project Structure

```
ntgc-aikb/
├── src/
│   ├── css/
│   │   ├── landing-page.css
│   │   ├── content-page.css
│   │   └── aikb-pre-block.css (code block & copy-button styling)
│   └── js/
│       ├── landing-page.js
│       ├── content-page.js
│       ├── wrap-pre-blocks.js (runtime heading+pre wrapper)
│       └── copy-to-clipboard.js (copy button + state toggle)
├── dist/
│   ├── landing-page.min.{js,css}
│   └── content-page.min.{js,css}
├── AI knowledge base _ NTG Central.html (legacy snapshot)
├── AI knowledge base _ NTG Central_files/ (legacy assets)
└── DOCUMENTATION/
```

---

## Development Environment

### Prerequisites

- **Web Browser:** Modern Chrome, Firefox, Safari, or Edge
- **Text Editor:** VS Code, Sublime Text, or similar
- **HTTP Server:** Local development server (not file:// protocol)
- **Developer Tools:** Browser DevTools (F12)

### Local Development Server

**Using Python 3:**

```bash
cd c:\Projects\ntgc-aikb
python -m http.server 8000
# Visit http://localhost:8000
```

**Using Node.js (http-server):**

```bash
npm install -g http-server
cd c:\Projects\ntgc-aikb
http-server -p 8000
# Visit http://localhost:8000
```

**Using PHP:**

```bash
cd c:\Projects\ntgc-aikb
php -S localhost:8000
# Visit http://localhost:8000
```

---

## Browser DevTools

### Opening DevTools

| Browser     | Shortcut            |
| ----------- | ------------------- |
| Chrome/Edge | F12 or Ctrl+Shift+I |
| Firefox     | F12 or Ctrl+Shift+I |
| Safari      | Cmd+Option+I        |

### Console

**View JavaScript errors:**

```bash
# Open DevTools > Console tab
# Look for red error messages
```

**Log debugging info:**

```javascript
console.log("Value:", ntgCOVEO.originalterm);
console.error("Error message:", error);
console.warn("Warning message");
console.table(ntgCOVEO.searchresults.all); // Table format
```

### Network Tab

**Monitor API calls:**

1. Open DevTools > Network tab
2. Perform a search
3. See GET requests to:

- `https://ntgov-search.funnelback.squiz.cloud/s/search.json?...` (in-page)
- `/api/funnelback?...` (optional local proxy)
- `www.googletagmanager.com` (Analytics)

**Check response:**

- Click request name
- View "Response" tab to see JSON
- View "Headers" to see query parameters

### Build & Watch

- Full build: `npm run build` (runs PostCSS + esbuild for landing/content bundles)
- Landing only: `npm run build:landing-css`, `npm run build:landing-js`
- Content only: `npm run build:content-css`, `npm run build:content-js`
- Dist folder is recreated/updated on each build.

### Application/Storage Tab

**Inspect localStorage:**

1. Open DevTools > Application/Storage tab
2. Click "Local Storage"
3. Select `http://localhost:8000`
4. View key-value pairs:
   - `user_name`
   - `user_email`
   - etc.

---

## Common Development Tasks

### Task 1: Debug Search Functionality

**Steps:**

```javascript
// 1. Open Console
// 2. Examine search object
console.log("Search Config:", ntgCOVEO);

// 3. Check current terms
console.log("Original Term:", ntgCOVEO.originalterm);
console.log("Filtered Term:", ntgCOVEO.filteredterm);

// 4. Check filters
console.log("Document Types:", ntgCOVEO.doctype);
console.log("Owners:", ntgCOVEO.owner);

// 5. Check results
console.log("Results:", ntgCOVEO.searchresults.all);

// 6. Test API call manually
ntgCOVEO.callSearchAPI();
```

### Task 2: Test User Profile

**Steps:**

```javascript
// 1. Check localStorage
console.log("User Name:", localStorage.getItem("user_name"));
console.log("User Email:", localStorage.getItem("user_email"));

// 2. Update profile
localStorage.setItem("user_name", "Test User");

// 3. Refresh page to verify
// 4. Check if profile updated
```

### Task 3: Modify Filter Logic

**Location:** `src/js/search-filters.js`

**Current filter logic (Work Areas - OR Logic):**

```javascript
// In src/js/search-filters.js - filterByWorkArea()
// Uses OR logic: results match AT LEAST ONE selected work area
const filtered = allResults.filter((result) => {
  const resultWorkAreas = result.listMetadata["Work area"];

  // Check if AT LEAST ONE selected work area is present
  return workAreasArray.some((selectedArea) =>
    resultWorkAreas.includes(selectedArea),
  );
});
```

**Note:** Filtering happens client-side in `search-filters.js`, not in API calls. The old `ntgCOVEO` code is legacy/unused.

**To add a new filter:**

```javascript
// 1. Add new form field:
// <select id="language">
//   <option value="en">English</option>
//   <option value="ar">Arabic</option>
// </select>

// 2. Add to submission handler:
ntgCOVEO.language = $("#language").val();

// 3. Add to API parameters:
if (ntgCOVEO.language) {
  params.set("language", ntgCOVEO.language);
}
```

### Task 4: Add Custom JavaScript

**LOCATION:** Insert before `</body>` tag or in `components.js`

**Pattern:**

```javascript
$(document).ready(function () {
  // Your code runs when DOM is ready

  // Example: Custom button click handler
  $(".custom-button").on("click", function () {
    console.log("Button clicked");
  });
});
```

### Task 5: Monitor Analytics Events

**In Console:**

```javascript
// Log all GA events
gtag("event", "page_view", {
  page_title: document.title,
  page_path: window.location.pathname,
});

// Monitor existing events
window.addEventListener("message", function (e) {
  if (e.data.event === "gtag_event") {
    console.log("GA Event:", e.data);
  }
});
```

---

## Debugging Common Issues

### Issue 1: Search Returns No Results

**Debug Steps:**

```javascript
// 1. Check if API endpoint is reachable
$.ajax({
  url: ntgCOVEO.defaults.endpointURL,
  type: "GET",
  complete: function (result) {
    console.log("API Status:", result.status);
    console.log("Response:", result.responseJSON);
  },
});

// 2. Verify search parameters
console.log("Query:", ntgCOVEO.originalterm);
console.log("Filters:", {
  doctype: ntgCOVEO.doctype,
  owner: ntgCOVEO.owner,
});

// 3. Check for API errors
// Network tab > find API request > Response tab
```

**Common Causes:**

- Network connectivity issues
- Invalid API endpoint URL
- Missing SAML authentication
- Overly restrictive filters

### Issue 2: localStorage Not Working

**Debug Steps:**

```javascript
// 1. Check if localStorage is available
console.log("localStorage available:", typeof Storage !== "undefined");

// 2. Test write/read
localStorage.setItem("test_key", "test_value");
console.log("Read back:", localStorage.getItem("test_key"));

// 3. Check for quota exceeded
try {
  localStorage.setItem("large_data", new Array(1000000).join("x"));
} catch (e) {
  console.error("Quota exceeded:", e);
}
```

**Common Causes:**

- Private browsing mode (doesn't allow localStorage)
- localStorage disabled in browser settings
- Storage quota exceeded
- Browser security policy

### Issue 3: UI Not Updating After Search

**Debug Steps:**

```javascript
// 1. Check if results rendered
console.log("Results HTML:", $("#search-results-list").html());

// 2. Check jQuery selector
console.log("Results container exists:", $("#search-results-list").length > 0);

// 3. Verify data exists
console.log("Search results data:", ntgCOVEO.searchresults.all);

// 4. Manually trigger update
$("#search-results-list").html("<p>Test</p>");
```

**Common Causes:**

- jQuery selector not matching
- Results container not found
- JavaScript error preventing render
- CSS `display: none` hiding results

### Issue 4: Profile Not Loading

**Debug Steps:**

```javascript
// 1. Check SAML authentication
console.log("Is authenticated:", !!localStorage.getItem("user_email"));

// 2. Check API call
// Network tab > look for profile API request

// 3. Verify profile data
console.log("Profile Data:", {
  name: localStorage.getItem("user_name"),
  email: localStorage.getItem("user_email"),
  phone: localStorage.getItem("user_phone"),
});

// 4. Check profile display elements
console.log("Profile container:", $(".ntgc-profile").length);
```

**Common Causes:**

- SAML authentication failed
- Profile API endpoint unreachable
- localStorage clearing between sessions
- HTML elements missing or wrong selectors

---

## Performance Optimization

### Caching Search Results

```javascript
// Add caching layer
var searchCache = {};

function getCachedSearch(query, doctype, owner) {
  var cacheKey = query + "|" + doctype + "|" + owner;

  if (searchCache[cacheKey]) {
    console.log("Using cached results");
    return searchCache[cacheKey];
  }

  return null;
}

function cacheSearchResults(query, doctype, owner, results) {
  var cacheKey = query + "|" + doctype + "|" + owner;
  searchCache[cacheKey] = results;
}

// Use in search logic
var cached = getCachedSearch(query, doctype, owner);
if (cached) {
  ntgCOVEO.searchresults.all = cached;
  renderResults();
} else {
  ntgCOVEO.callSearchAPI(); // Fetch from API
}
```

### Debouncing Search Input

```javascript
// Don't search on every keystroke
var searchTimeout;

$("#search").on("keyup", function () {
  clearTimeout(searchTimeout);

  searchTimeout = setTimeout(function () {
    ntgCOVEO.callSearchAPI();
  }, 300); // Wait 300ms after user stops typing
});
```

### Lazy Load Images

```javascript
// Only load images when visible
if ("IntersectionObserver" in window) {
  var imageObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var img = entry.target;
        img.src = img.dataset.src;
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img);
  });
}
```

---

## Code Quality

### Linting (ESLint)

**Check JavaScript for errors:**

```bash
npm install -g eslint
eslint ntgov-coveo-search.js
```

**Common issues:**

- Undefined variables
- Unused variables
- Inconsistent spacing
- Missing semicolons

### Code Formatting (Prettier)

**Auto-format code:**

```bash
npm install -g prettier
prettier --write ntgov-coveo-search.js
```

### Testing with Console

```javascript
// Simple unit tests
function test(description, condition) {
  console.log(condition ? "✓ " + description : "✗ " + description);
}

// Test noise word removal
var terms = ["the", "best", "practices", "for", "ai"];
var filtered = terms.filter((w) => !ntgCOVEO.noisewords.includes(w));
test("Noise words removed", filtered.length < terms.length);

// Test API parameters
var params = new URLSearchParams();
params.set("query", "test");
test("URL params created", params.toString().includes("query=test"));
```

---

## Documentation

### When to Update Documentation

Update documentation when you:

- Add new features
- Change API endpoints
- Modify component structure
- Fix critical bugs
- Update dependencies

### Documentation Format

Follow Markdown conventions:

````markdown
# Heading Level 1

## Heading Level 2

### Heading Level 3

**Bold text**
_Italic text_
`Code inline`

```code block
multi-line
code
```
````

- Bullet list
- Another item

1. Numbered list
2. Another item

[Link text](url)

````

---

## Best Practices

### JavaScript

✓ **DO:**
```javascript
// 1. Use const by default
const apiUrl = '...';

// 2. Use let for loop variables
for (let i = 0; i < items.length; i++) {
  // ...
}

// 3. Use arrow functions
items.map(item => item.value);

// 4. Use template literals
const msg = `Hello, ${name}!`;

// 5. Always check for null/undefined
if (result && result.data) {
  processData(result.data);
}
````

✗ **DON'T:**

```javascript
// 1. Don't use var (use const/let)
var x = 5;

// 2. Don't use eval()
eval("dangerous code");

// 3. Don't use == (use ===)
if (x == 5) {
  // Unsafe comparison
}

// 4. Don't create global variables
window.myVar = "global"; // Pollutes global scope

// 5. Don't use console.log in production
console.log("Debug info"); // Should be removed/controlled
```

### CSS

✓ **DO:**

```css
/* 1. Use semantic class names */
.search-results {
}
.filter-button {
}

/* 2. Use REM units */
padding: 1rem;
font-size: 1rem;

/* 3. Group related styles */
.button {
  display: inline-block;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
}

/* 4. Use CSS variables */
:root {
  --primary-color: #102040;
}
body {
  color: var(--primary-color);
}

/* 5. Mobile-first media queries */
.element {
  width: 100%;
}
@media (min-width: 768px) {
  .element {
    width: 50%;
  }
}
```

✗ **DON'T:**

```css
/* 1. Don't use vague class names */
.box1 {
}
.red {
}

/* 2. Don't use absolute pixel sizes */
padding: 16px; /* Should be rem */

/* 3. Don't use !important */
color: red !important; /* Breaks cascade */

/* 4. Don't use inline styles */
<div style="color: red; font-size: 14px;">

/* 5. Don't use universal selector */
* {
  margin: 0;
  padding: 0;
}
```

### HTML

✓ **DO:**

```html
<!-- 1. Use semantic HTML -->
<header>
  <nav>...</nav>
</header>
<main>
  <article>...</article>
</main>
<footer>...</footer>

<!-- 2. Include ARIA labels -->
<button aria-label="Close">
  <i class="fal fa-times" aria-hidden="true"></i>
</button>

<!-- 3. Properly structure forms -->
<form>
  <label for="email">Email</label>
  <input type="email" id="email" name="email" />
</form>

<!-- 4. Use alt text on images -->
<img src="logo.png" alt="Company logo" />

<!-- 5. Include skip links -->
<a href="#content" class="skip-link">Skip to content</a>
```

✗ **DON'T:**

```html
<!-- 1. Don't use <div> for everything -->
<div class="header">
  <div class="nav"></div>

  <!-- 2. Don't omit alt text -->
  <img src="chart.png" />

  <!-- 3. Don't use obsolete HTML -->
  <font color="red">Old HTML</font>

  <!-- 4. Don't nest divs excessively -->
  <div>
    <div>
      <div><div>Content</div></div>
    </div>
  </div>

  <!-- 5. Don't forget accessibility -->
  <button onclick="search()">
    <i class="fa-search"></i>
  </button>
</div>
```

---

## Version Control (Git)

### Repository Status

```bash
# Check what changed
git status

# View changes
git diff

# View commit history
git log --oneline
```

### Making Changes (Read-Only Note)

Standard git workflow applies; commit changes to your feature branch and open a PR when ready.

---

## Troubleshooting Checklist

- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Check browser console for JavaScript errors (F12)
- [ ] Check Network tab for failed API requests
- [ ] Verify localStorage has data (DevTools > Application)
- [ ] Try in a different browser
- [ ] Try with JavaScript disabled (to test fallbacks)
- [ ] Check if problem persists in private/incognito mode
- [ ] Review recent changes and revert if necessary

---

## Resources

### Documentation

- [00-README.md](00-README.md) - Overview
- [01-ARCHITECTURE.md](01-ARCHITECTURE.md) - System design
- [02-SEARCH-ENGINE.md](02-SEARCH-ENGINE.md) - Search functionality
- [03-USER-SYSTEM.md](03-USER-SYSTEM.md) - User management
- [04-COMPONENTS.md](04-COMPONENTS.md) - UI components
- [05-STYLING.md](05-STYLING.md) - CSS framework
- [06-API-REFERENCE.md](06-API-REFERENCE.md) - External APIs
- [07-ACCESSIBILITY.md](07-ACCESSIBILITY.md) - WCAG compliance

### External Resources

- [MDN Web Docs](https://developer.mozilla.org/)
- [jQuery Documentation](https://jquery.com/)
- [Australian Design System](https://designsystem.gov.au/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Coveo Search](https://docs.coveo.com/)

---

## Getting Help

1. **Check the documentation** - Read the relevant doc file
2. **Search the code** - Find examples of similar functionality
3. **Use browser DevTools** - Debug interactively
4. **Check error messages** - Red text in console often explains issues
5. **Test in isolation** - Create a simple test case to verify behavior

---

## Document Information

- **Created:** December 12, 2025
- **Status:** Comprehensive Documentation
- **Audience:** Full-stack developers, AI agents, technical teams
- **Notes:** Active development with modular src → dist builds; copy button uses icon swap on success instead of toast.

---

**Thank you for reading the complete NTG Central AI Knowledge Base documentation!**

For questions or clarifications, refer to the specific documentation section or examine the source code directly.

---

src/
css/
landing-page.css # Landing page specific styles
content-page.css # Content page specific styles
js/
landing-page.js # Landing page specific scripts
content-page.js # Content page specific scripts
dist/

## Landing vs Content Page Asset Structure (2025 Update)

### File Structure

```
src/
  css/
    landing-page.css      # Landing page specific styles
    content-page.css      # Content page specific styles
  js/
    landing-page.js       # Landing page specific scripts
    content-page.js       # Content page specific scripts


  landing-page.min.css    # Compiled landing page CSS
  content-page.min.css    # Compiled content page CSS
  landing-page.min.js     # Compiled landing page JS
  content-page.min.js     # Compiled content page JS
```

### Naming Conventions

- Use `landing-` and `content-` prefixes for all page-specific CSS and JS files.
- Do not share styles/scripts between landing and content pages. Keep them separate for clarity and maintainability.

### Build Process

- Only build changed assets for each page type.
- Example build commands (see `package.json`):
  - `npm run build:landing-css`
  - `npm run build:content-css`
  - `npm run build:landing-js`
  - `npm run build:content-js`

### HTML Usage

- Reference only the relevant CSS/JS for each page type in your HTML templates.
- Example:

```html
<!-- Landing page -->
<link rel="stylesheet" href="dist/landing-page.min.css" />
<script src="dist/landing-page.min.js"></script>

<!-- Content page -->
<link rel="stylesheet" href="dist/content-page.min.css" />
<script src="dist/content-page.min.js"></script>
```

### Further Notes

- Do not factor shared code into a common file. Keep landing and content page assets fully separate.
- If you add new page types, follow the same naming and build conventions.

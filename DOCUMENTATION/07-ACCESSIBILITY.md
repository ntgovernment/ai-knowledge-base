# 07 - Accessibility & Compliance

## Overview

The NTG Central AI Knowledge Base is built on **accessibility-first principles** using the Australian Design System (AUS) which enforces **WCAG 2.1 Level AA compliance** and **Section 508** standards.

---

## WCAG 2.1 Compliance

### Accessibility Level: AA

The portal meets **WCAG 2.1 Level AA** standards across:

#### Perceivable

- ✓ Sufficient color contrast (4.5:1 for body text)
- ✓ Alternative text for images
- ✓ Resizable text (REM-based sizing)
- ✓ Captions for multimedia

#### Operable

- ✓ Keyboard accessible navigation
- ✓ Skip links for keyboard users
- ✓ Focus indicators visible on all interactive elements
- ✓ No keyboard traps
- ✓ Sufficient target size for touch (48x48px minimum)

#### Understandable

- ✓ Plain language (reading level 12)
- ✓ Consistent navigation
- ✓ Predictable interactions
- ✓ Error prevention and recovery

#### Robust

- ✓ Valid HTML5
- ✓ ARIA attributes for screen readers
- ✓ Semantic HTML markup
- ✓ Compatible with assistive technologies

---

## Keyboard Navigation

### Tab Order

Users should navigate elements in logical order using Tab and Shift+Tab:

```
1. Skip Links (at top)
   ↓
2. Logo/Search Button
   ↓
3. Main Navigation Menu
   ↓
4. User Profile Menu
   ↓
5. Search Input Field
   ↓
6. Filter Dropdowns (Document Type, Owner)
   ↓
7. Search Button
   ↓
8. Result Cards (top to bottom)
   ↓
9. Pagination Links
   ↓
10. Footer Links
```

### Skip Links

**Purpose:** Allow keyboard users to jump to main content

**HTML:**

```html
<nav class="au-skip-link" aria-label="skip links navigation">
  <a class="au-skip-link__link" href="#content"> Skip to main content </a>
  <a class="au-skip-link__link" href="#mainmenu"> Skip to main navigation </a>
</nav>
```

**CSS:**

```css
.au-skip-link__link {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0); /* Hidden by default */
}

.au-skip-link__link:focus {
  position: absolute;
  width: auto;
  height: auto;
  overflow: visible;
  clip: auto;
  padding: 24px;
  background-color: #102040;
  color: #ffffff;
  z-index: 600; /* Appears on top when focused */
}
```

### Focus Indicators

**All interactive elements must have visible focus:**

```css
/* Standard focus indicator (green outline) */
*:focus {
  outline: 3px solid #8fc38f; /* Green focus ring */
  outline-offset: 2px;
}

/* Example: Button focus */
.au-btn:focus {
  outline: 3px solid #8fc38f;
  outline-offset: 2px;
  box-shadow: 0 0 0 5px rgba(144, 216, 152, 0.25);
}

/* Example: Link focus */
a:focus {
  outline: 3px solid #8fc38f;
  text-decoration: underline;
}
```

### Keyboard Handlers

**Enter key submits forms:**

```javascript
$("input, textarea").on("keypress", function (e) {
  if (e.which === 13) {
    // Enter key
    $(this).closest("form").trigger("submit");
  }
});
```

**Escape key closes modals/menus:**

```javascript
$(document).on("keydown", function (e) {
  if (e.which === 27) {
    // Escape key
    closeOpenMenus();
  }
});
```

---

## Screen Reader Support

### ARIA Attributes

#### Landmarks (Semantic HTML)

```html
<!-- Navigation -->
<nav aria-label="Main navigation" id="mainmenu">
  <ul role="menubar">
    <li role="none">
      <a href="/my-job" role="menuitem">My Job</a>
    </li>
  </ul>
</nav>

<!-- Main Content -->
<main id="content">
  <!-- Page content -->
</main>

<!-- Complementary -->
<aside aria-label="Sidebar">
  <!-- Sidebar content -->
</aside>

<!-- Footer -->
<footer role="contentinfo">
  <!-- Footer content -->
</footer>
```

#### Form Labels

```html
<!-- ✓ Properly labeled input -->
<label for="search">Search</label>
<input type="text" id="search" name="search" />

<!-- ✓ Alternative: aria-label -->
<input type="text" aria-label="Search knowledge base" />

<!-- ✓ With description -->
<label for="doctype">Document Type</label>
<select id="doctype" aria-describedby="doctype-help">
  <option>Choose...</option>
</select>
<span id="doctype-help">Select the type of document you're looking for</span>
```

#### Buttons with Icons

```html
<!-- ✓ Good: Icon button with label -->
<button class="search-icon" aria-label="Search">
  <i class="fal fa-search" aria-hidden="true"></i>
</button>

<!-- ✓ Good: Icon button with text -->
<button class="au-btn">
  <i class="fal fa-download" aria-hidden="true"></i>
  Download
</button>

<!-- ✗ Bad: Icon without label -->
<button class="search-icon">
  <i class="fal fa-search"></i>
  <!-- No label -->
</button>
```

#### Live Regions

```html
<!-- Results update dynamically - notify screen reader users -->
<div class="results-count" aria-live="polite" aria-atomic="true">
  Showing 1-12 of 47 results
</div>

<!-- Status messages (urgent) -->
<div class="error-message" aria-live="assertive" role="alert">
  Search failed. Please try again.
</div>
```

#### Expandable Sections

```html
<button aria-expanded="false" aria-controls="accordion-1">
  Advanced Filters
</button>

<div id="accordion-1" hidden>
  <!-- Filter options -->
</div>

<!-- JavaScript updates aria-expanded when toggled -->
<script>
  button.addEventListener("click", function () {
    var expanded = this.getAttribute("aria-expanded") === "true";
    this.setAttribute("aria-expanded", !expanded);
    document.getElementById("accordion-1").hidden = expanded;
  });
</script>
```

### Screen Reader Testing

**Tested with:**

- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS/iOS)
- TalkBack (Android)

**Test Scenarios:**

- Page announces page title and structure
- All form inputs are properly labeled
- Error messages are announced
- Loading states are communicated
- Navigation options are clear

---

## Color & Contrast

### Contrast Requirements

**WCAG AA Standard:**

- Body text: **4.5:1** contrast ratio
- Large text (18pt+): **3:1** contrast ratio
- UI components: **3:1** contrast ratio

### Verified Color Combinations

```css
/* ✓ Good: Dark text on light background */
body {
  color: #102040; /* Dark blue */
  background-color: #ffffff;
  /* Contrast: ~14:1 (exceeds AAA) */
}

/* ✓ Good: White text on dark background */
.au-body--dark {
  color: #ffffff;
  background-color: #1a1a1a;
  /* Contrast: ~12:1 (exceeds AAA) */
}

/* ✓ Good: Link colors */
a {
  color: #127cbf; /* Sky blue */
  background: #ffffff;
  /* Contrast: ~5.8:1 (exceeds AA) */
}

/* ✗ Bad: Light gray on light background */
.example {
  color: #d3dfe0; /* Too light */
  background-color: #ffffff;
  /* Contrast: ~1.2:1 (FAILS) */
}
```

### Color Not Alone

**Important:** Don't use color as the only way to convey information

```html
<!-- ✓ Good: Uses icon + color -->
<span class="success" aria-label="Success">
  <i class="fal fa-check-circle"></i> Updated
</span>

<!-- ✗ Bad: Color only -->
<span style="color: green;">Updated</span>

<!-- ✓ Good: Uses text + styling -->
<span class="required"> <abbr title="required">*</abbr> Name </span>

<!-- ✗ Bad: Red color only -->
<input style="border: 2px solid red;" />
```

---

## Text Sizing & Readability

### Resizable Text

All text must be resizable up to 200% without loss of content:

```css
/* ✓ Good: Using REM units (scales with user preference) */
body {
  font-size: 16px;  /* 1rem = 16px */
}

p {
  font-size: 1rem;
}

h1 {
  font-size: 1.875rem;  /* 30px */
}

/* ✗ Bad: Fixed pixel sizes -->
body {
  font-size: 12px;  /* Can't be resized */
}
```

### Line Height & Spacing

```css
/* Readable line height */
body {
  line-height: 1.5; /* 150% of font size */
  letter-spacing: 0.02em;
}

/* Paragraph spacing */
p {
  margin-bottom: 1rem; /* 16px */
}

/* List spacing */
li {
  margin-bottom: 0.5rem; /* 8px */
}
```

### Font Legibility

- **Font Family:** Roboto (sans-serif) - excellent readability
- **Font Weight:** 400 (regular) for body, 700 (bold) for emphasis
- **Font Size:** 16px minimum for body text
- **Letter Spacing:** 0.02em for body text

---

## Alternative Text

### Images

```html
<!-- ✓ Good: Descriptive alt text -->
<img src="chart.png" alt="Sales growth chart showing 25% increase in Q4" />

<!-- ✗ Bad: Generic alt text -->
<img src="chart.png" alt="Chart" />

<!-- ✗ Bad: Empty alt (use only for decorative images) -->
<img src="spacer.gif" alt="" />

<!-- Decorative image (hidden from screen readers) -->
<img src="logo.png" alt="" aria-hidden="true" />
```

### Icons

```html
<!-- ✓ Good: Icon with aria-label on button -->
<button aria-label="Download" class="au-btn">
  <i class="fal fa-download" aria-hidden="true"></i>
</button>

<!-- ✓ Good: Icon with visible text -->
<a href="/help">
  <i class="fal fa-question-circle" aria-hidden="true"></i>
  Help
</a>

<!-- Icon decoration: hidden from screen readers -->
<span class="icon" aria-hidden="true">→</span>
```

---

## Forms & Validation

### Accessible Form Structure

```html
<form id="search-form">
  <!-- Text input with label -->
  <div class="form-group">
    <label for="search">Search Terms</label>
    <input
      type="text"
      id="search"
      name="search"
      aria-describedby="search-help"
      required
    />
    <span id="search-help" class="help-text">
      Enter keywords related to your search
    </span>
  </div>

  <!-- Dropdown with label -->
  <div class="form-group">
    <label for="document-type">Document Type</label>
    <select
      id="document-type"
      name="doctype"
      aria-label="Filter by document type"
    >
      <option value="">All Types</option>
      <option value="policy">Policy</option>
      <option value="guideline">Guideline</option>
    </select>
  </div>

  <!-- Checkbox group with fieldset -->
  <fieldset>
    <legend>Filter by Department</legend>
    <div class="au-control-input">
      <input type="checkbox" id="dcdd" name="owner" value="68" />
      <label for="dcdd">DCDD</label>
    </div>
    <div class="au-control-input">
      <input type="checkbox" id="nc" name="owner" value="70" />
      <label for="nc">Northern Command</label>
    </div>
  </fieldset>

  <!-- Submit button -->
  <button type="submit" class="au-btn au-btn--primary">Apply Filters</button>
</form>
```

### Error Messages

```html
<!-- Error highlighting -->
<div class="form-group">
  <label for="email">Email <abbr title="required">*</abbr></label>
  <input
    type="email"
    id="email"
    name="email"
    aria-invalid="true"
    aria-describedby="email-error"
    value="invalid-email"
  />
  <span id="email-error" role="alert" class="error-message">
    <i class="fal fa-exclamation-circle" aria-hidden="true"></i>
    Please enter a valid email address
  </span>
</div>
```

---

## Australian Design System Compliance

### Component Standards

All components follow AUS (Australian Design System) guidelines:

| Component      | Standard                     | Implementation          |
| -------------- | ---------------------------- | ----------------------- |
| **Buttons**    | Minimum 48x48px touch target | `au-btn` class          |
| **Links**      | Underlined, color + style    | AUS link styles         |
| **Forms**      | Fieldset/legend for groups   | AUS form-group          |
| **Navigation** | Skip links, landmarks        | `au-skip-link`, `<nav>` |
| **Tables**     | Proper headers, scope        | `th scope="col"`        |
| **Headings**   | Semantic hierarchy           | h1-h6 tags              |
| **Lists**      | Proper markup                | `<ul>`, `<ol>`, `<li>`  |

### AU Design System Resources

- [Australian Design System](https://designsystem.gov.au/)
- [Accessibility Guidelines](https://designsystem.gov.au/guides/accessible-design/)
- [Component Library](https://designsystem.gov.au/components/)

---

## Mobile & Touch Accessibility

### Touch Targets

```css
/* Minimum 48x48px touch target size */
.au-btn,
a,
button {
  min-width: 48px;
  min-height: 48px;
  padding: 12px 16px;
}

/* Spacing between touch targets */
button + button {
  margin-left: 8px;
}
```

### Responsive Text

```css
/* Readable on small screens */
@media (max-width: 768px) {
  body {
    font-size: 16px; /* Prevents auto-zoom on iOS */
  }

  h1 {
    font-size: 1.5rem; /* 24px */
  }
}
```

### Touch Gestures

```html
<!-- Clear labels for touch controls -->
<button aria-label="Next slide" class="carousel-next">
  <i class="fal fa-chevron-right" aria-hidden="true"></i>
</button>

<!-- Swipe support documented -->
<div class="carousel" role="region" aria-label="Image carousel">
  <p class="carousel-help">Use arrow buttons or swipe to navigate</p>
</div>
```

---

## Testing & Verification

### Automated Tools

- **axe DevTools** - Accessibility checker browser extension
- **WAVE** - Web accessibility evaluator
- **Lighthouse** - Chrome DevTools accessibility audit
- **NVDA** - Free screen reader (Windows)

### Manual Testing Checklist

- [ ] Navigate entire site with keyboard only (Tab, Enter, Escape)
- [ ] All interactive elements have visible focus indicators
- [ ] Forms have proper labels and error messages
- [ ] Images have descriptive alt text
- [ ] Color contrast meets WCAG AA standard
- [ ] Text resizes to 200% without layout breaking
- [ ] No content hidden from keyboard users
- [ ] Screen reader announces page structure correctly
- [ ] Skip links work as expected
- [ ] Touch targets are at least 48x48px

### Accessibility Statement

The NTG Central is committed to:

- **WCAG 2.1 Level AA** compliance
- **Section 508** (US) and **Disability Discrimination Act** (AU) standards
- **Australian Design System** best practices
- Continuous accessibility testing and improvement

---

## Next Steps

Read **[08-DEVELOPER-GUIDE.md](08-DEVELOPER-GUIDE.md)** for development workflow and best practices.

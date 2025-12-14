# 05 - Styling Framework & Design System

## CSS Architecture

### CSS File Organization

| File                         | Size     | Purpose                                   |
| ---------------------------- | -------- | ----------------------------------------- |
| **main.css**                 | ~500+ KB | Primary stylesheet, custom NTG components |
| **all.css**                  | ~200 KB  | Font Awesome Pro 5.15.4 icon library      |
| **roboto.css**               | ~30 KB   | Google Fonts - Roboto family              |
| **yht7rxj.css**              | ~50 KB   | Adobe Typekit fonts (neue-haas-grotesk)   |
| **status-toolbar.css**       | ~5 KB    | Admin/dev toolbar styling                 |
| **imageslider-fotorama.css** | ~20 KB   | Image carousel component                  |

### Load Order

```html
<!-- Import external fonts first -->
<link href="yht7rxj.css" rel="stylesheet" />
<link href="roboto.css" rel="stylesheet" />

<!-- Font Awesome icons -->
<link href="all.css" rel="stylesheet" />

<!-- Component-specific styles -->
<link href="imageslider-fotorama.css" rel="stylesheet" />

<!-- Primary stylesheet (must be last) -->
<link href="main.css" rel="stylesheet" />

<!-- Admin toolbar -->
<link href="status-toolbar.css" rel="stylesheet" />
```

---

## Color Palette

### Primary Colors

```css
Primary Blue (Dark):
#102040 - Main brand color for headers, text, buttons
#304060 - Hover/secondary variant
#506080 - Light variant
#d0e0e0 - Pale/background variant
```

**Usage:**

```css
.header {
  background-color: #102040;
}
.link:hover {
  color: #304060;
}
.callout {
  background-color: #d0e0e0;
}
```

### Secondary Colors

```css
Secondary Green:
#208820 - Success, positive actions
#107810 - Darker variant
#20a030 - Light variant
#dcf0dc - Pale background
```

**Usage:**

```css
.success-badge {
  background-color: #208820;
}
.notification--success {
  color: #107810;
}
```

### Tertiary Colors

```css
Tertiary Orange:
#e44808 - Attention, calls-to-action
#c43004 - Dark variant (error)
#e47024 - Light variant
#fce4d8 - Pale background
```

**Usage:**

```css
.cta-button {
  background-color: #e44808;
}
.error-message {
  color: #c43004;
}
```

### Neutral Colors

```css
Neutral Grays:
#6c7074 - Dark gray text (body text)
#acb0b4 - Medium gray
#d3dfe0 - Light gray (borders)
#ecf0f0 - Very light (backgrounds)
```

### Notification Level Colors

```css
5-tier Notification System:
Level 5: #107810 - Green (success)
Level 4: #107cc0 - Blue (info)
Level 3: #fcc000 - Yellow (warning)
Level 2: #e47024 - Orange (alert)
Level 1: #c43004 - Red (error)
```

**Usage:**

```html
<div class="au-page-alerts au-page-alerts--success">
  <p>Success message</p>
</div>

<div class="au-page-alerts au-page-alerts--warning">
  <p>Warning message</p>
</div>

<div class="au-page-alerts au-page-alerts--error">
  <p>Error message</p>
</div>
```

### CSS Variables (Color Classes)

```css
/* Text Color Classes */
.ntgc-color--primary-default {
  color: #102040;
}
.ntgc-color--secondary-default {
  color: #208820;
}
.ntgc-color--tertiary-default {
  color: #e44808;
}

/* Background Color Classes */
.ntgc-bg-color--primary-default {
  background-color: #102040;
}
.ntgc-bg-color--secondary-default {
  background-color: #208820;
}
.ntgc-bg-color--tertiary-default {
  background-color: #e44808;
}

/* Extended Palette */
.text-ochre {
  color: #e35205;
}
.text-arafura-blue {
  color: #1f1f5f;
}
.text-sky-blue {
  color: #127cbf;
}
.bg-charcoal-grey {
  background-color: #454347;
}
.border-hot-coral {
  border-color: #c25062;
}
```

---

## Typography

### Font Families

```css
/* Display/Headings - Adobe Typekit */
neue-haas-grotesk-display
neue-haas-grotesk-text

/* Body Text - Google Fonts */
Roboto, arial, sans-serif

/* Code/Monospace */
SFMono-Regular, Courier, monospace
```

### Heading Styles

```css
/* Heading Sizes */
h1 {
  font-size: 30px;
  line-height: 1.2;
} /* Display XXL */
h2 {
  font-size: 26px;
  line-height: 1.23;
} /* Display XL */
h3 {
  font-size: 22px;
  line-height: 1.27;
} /* Display LG */
h4 {
  font-size: 20px;
  line-height: 1.2;
} /* Display MD */
h5 {
  font-size: 16px;
  line-height: 1.25;
} /* Display SM */
h6 {
  font-size: 14px;
  line-height: 1.14;
} /* Display XS */

/* Display Classes (use without semantic tags) */
.au-display-xxxl {
  font-size: 36px;
}
.au-display-xxl {
  font-size: 30px;
}
.au-display-xl {
  font-size: 26px;
}
.au-display-lg {
  font-size: 22px;
}
.au-display-md {
  font-size: 20px;
}
.au-display-sm {
  font-size: 16px;
}
.au-display-xs {
  font-size: 14px;
}
```

### Body Text

```css
/* Standard body text */
body,
p,
.au-body {
  font-size: 16px; /* 1rem */
  line-height: 1.5;
  color: #102040;
  font-family: "Roboto", arial, sans-serif;
}

/* Small text */
.small,
small {
  font-size: 14px; /* 0.875rem */
  line-height: 1.14;
}

/* Emphasized text */
strong,
.bold {
  font-weight: bold;
}
em,
.italic {
  font-style: italic;
}
```

### Font Sizing Scale

All sizes use REM units for accessibility:

```css
36px = 2.25rem   (Display XXXL)
30px = 1.875rem  (Display XXL / H1)
26px = 1.625rem  (Display XL / H2)
22px = 1.375rem  (Display LG / H3)
20px = 1.25rem   (Display MD / H4)
16px = 1rem      (Standard / H5)
14px = 0.875rem  (Small / H6)
```

### Margin & Spacing

```css
/* Standard margins between elements */
* + h1,
* + h2 {
  margin-top: 48px;
} /* 3rem */
* + h3,
* + h4,
* + h5,
* + h6 {
  margin-top: 24px;
} /* 1.5rem */
* + p {
  margin-top: 16px;
} /* 1rem */

/* Heading relationships */
h1 + h2 {
  margin-top: 24px;
} /* Reduced space */
h2 + h3 {
  margin-top: 24px;
} /* Reduced space */
```

---

## Layout System

### Grid Framework

**Bootstrap Grid System** (12-column)

```html
<div class="au-grid">
  <div class="container">
    <div class="row">
      <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
        <!-- Content -->
      </div>
    </div>
  </div>
</div>
```

### Breakpoints

```css
/* Mobile-first approach */
Extra Small (xs):  < 576px   (default)
Small (sm):        768px+
Medium (md):       1024px+
Large (lg):        1280px+
```

### Container Sizes

```css
.au-grid .container {
  box-sizing: border-box;
  margin: 0 auto;
  padding: 0 12px; /* 0.75rem padding */
}

/* Responsive widths */
@media (min-width: 768px) {
  .container {
    width: 744px;
  }
}
@media (min-width: 1024px) {
  .container {
    width: 1000px;
  }
}
@media (min-width: 1280px) {
  .container {
    width: 1256px;
  }
}
```

### Column Classes

```css
/* Column widths (12 column grid) */
.col-xs-1 {
  width: 8.33%;
}
.col-xs-2 {
  width: 16.67%;
}
.col-xs-3 {
  width: 25%;
}
.col-xs-4 {
  width: 33.33%;
}
.col-xs-6 {
  width: 50%;
}
.col-xs-12 {
  width: 100%;
}

/* Offset classes */
.col-xs-offset-1 {
  margin-left: 8.33%;
}
.col-xs-offset-3 {
  margin-left: 25%;
}

/* Pull/Push classes */
.col-xs-pull-1 {
  right: 8.33%;
}
.col-xs-push-1 {
  left: 8.33%;
}
```

---

## Component Styling

### Buttons

```css
/* Button Base Styles */
.au-btn {
  padding: 10px 20px; /* 0.625rem 1.25rem */
  font-size: 16px; /* 1rem */
  font-weight: bold;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* Primary Button */
.au-btn--primary {
  background-color: #102040; /* Primary Blue */
  color: #ffffff;
}

.au-btn--primary:hover {
  background-color: #304060; /* Lighter blue */
}

/* Secondary Button */
.au-btn--secondary {
  background-color: #acb0b4; /* Neutral gray */
  color: #102040;
}

.au-btn--secondary:hover {
  background-color: #d3dfe0; /* Lighter gray */
}

/* Focus State (Accessibility) */
.au-btn:focus {
  outline: 3px solid #90d898; /* Green focus ring */
  outline-offset: 2px;
}

/* Disabled State */
.au-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Cards

```css
.au-card {
  display: block;
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: #ffffff;
  position: relative;
  overflow: hidden;
}

.au-card:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.au-card__inner {
  padding: 16px; /* 1rem */
}

.au-card__title {
  margin: 0 0 16px 0;
  color: #102040;
  font-weight: bold;
  font-size: 20px;
}

.au-card__divider {
  border: 1px solid #e0e0e0;
  margin: 16px 0;
}
```

### Callout Boxes

```css
.au-callout {
  padding: 24px; /* 1.5rem */
  border-left: 4px solid #8890a0;
  background-color: #ecf0f0; /* Light gray */
  color: #102040;
  word-wrap: break-word;
}

.au-callout--alt {
  background-color: #e0e0e0; /* Darker gray */
}

.au-callout--dark {
  background-color: #454347; /* Dark gray */
  color: #ffffff;
  border-color: #a2a1a3;
}
```

### Alerts/Notifications

```css
.au-page-alerts {
  padding: 16px; /* 1rem */
  border: 3px solid #00bfe9; /* Blue */
  border-left-width: 48px; /* 3rem */
  border-radius: 4px;
  background-color: #ffffff;
}

/* Success Alert */
.au-page-alerts--success {
  border-color: #0b996c; /* Green */
}

/* Warning Alert */
.au-page-alerts--warning {
  border-color: #f69900; /* Orange */
}

/* Error Alert */
.au-page-alerts--error {
  border-color: #d60000; /* Red */
}
```

### Form Inputs

```css
.au-text-input {
  padding: 8px 16px; /* 0.5rem 1rem */
  height: 46px; /* 2.875rem */
  border: 3px solid #8890a0;
  background-color: #ffffff;
  font-size: 16px; /* 1rem */
  border-radius: 4px;
  font-family: "Roboto", arial, sans-serif;
  color: #102040;
}

.au-text-input:focus {
  outline: 3px solid #90d898;
  outline-offset: 2px;
  border-radius: 0;
}

.au-text-input--block {
  display: block;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}
```

---

## Responsive Design

### Mobile-First Strategy

```css
/* Base styles for mobile */
.component {
  width: 100%;
  font-size: 14px;
}

/* Tablet and up */
@media (min-width: 768px) {
  .component {
    width: 50%;
    font-size: 16px;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .component {
    width: 33.33%;
  }
}
```

### Common Responsive Patterns

**Hide/Show by Breakpoint:**

```css
/* Hide on mobile */
@media (max-width: 767px) {
  .desktop-only {
    display: none;
  }
}

/* Show only on mobile */
@media (min-width: 768px) {
  .mobile-only {
    display: none;
  }
}
```

**Responsive Padding:**

```css
.container {
  padding: 16px; /* Mobile: 1rem */
}

@media (min-width: 768px) {
  .container {
    padding: 32px; /* Tablet: 2rem */
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 48px; /* Desktop: 3rem */
  }
}
```

---

## Accessibility Features

### Focus Styles

```css
/* Standard focus ring */
:focus {
  outline: 3px solid #90d898; /* Green outline */
  outline-offset: 2px;
}

/* Keyboard-only focus (hide for mouse users) */
.is-pointer *:focus {
  outline: none;
}

.is-keyboard *:focus {
  outline: 3px solid #90d898;
}
```

### Skip Links

```css
.au-skip-link__link {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
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
  z-index: 600;
}
```

### Color Contrast

```css
/* Meets WCAG AA standard (4.5:1 for body text) */
.au-body {
  color: #102040; /* Dark blue */
  background-color: #ffffff; /* White */
  /* Contrast ratio: ~14:1 */
}

/* Meets WCAG AAA standard (7:1) */
.au-body--dark {
  color: #ffffff;
  background-color: #1a1a1a;
  /* Contrast ratio: ~12:1 */
}
```

---

## Print Styles

```css
@media print {
  /* Hide interactive elements */
  .au-skip-link,
  .ntgc-header,
  nav,
  .au-btn {
    display: none !important;
  }

  /* Print-friendly colors */
  body {
    color: #000;
    background-color: #fff;
  }

  a {
    color: #000;
    text-decoration: underline;
  }

  /* Expand accordions */
  .au-accordion__body {
    display: block !important;
    height: auto !important;
  }
}
```

---

## Using CSS Classes

### Layout Example

```html
<div class="au-grid">
  <div class="container">
    <div class="row">
      <!-- 25% width on desktop, 50% on tablet, 100% on mobile -->
      <div class="col-xs-12 col-sm-6 col-md-3">
        <div class="au-card">
          <div class="au-card__inner">
            <h3 class="au-card__title">Card Title</h3>
            <p>Card content goes here</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Text Styling Example

```html
<article class="au-body">
  <h1>Main Heading</h1>
  <p>Regular paragraph text with <strong>bold</strong> and <em>italic</em>.</p>

  <h2>Subheading</h2>
  <p class="ntgc-color--secondary-default">Green text</p>

  <div class="au-callout">
    <h3>Important Note</h3>
    <p>Callout content with left border</p>
  </div>
</article>
```

### Alert Example

```html
<div class="au-page-alerts au-page-alerts--success">
  <h3>Success!</h3>
  <p>Your changes have been saved.</p>
</div>

<div class="au-page-alerts au-page-alerts--error">
  <h3>Error</h3>
  <p>Something went wrong. Please try again.</p>
</div>
```

---

## Best Practices

### When Adding Styles

1. **Use Existing Classes First**

   ```css
   /* ✓ Good - uses framework class */
   <button class="au-btn au-btn--primary">Submit</button>

   /* ✗ Bad - creates custom style */
   <button style="background: blue; padding: 10px;">Submit</button>
   ```

2. **Follow Mobile-First Approach**

   ```css
   /* ✓ Good - base styles first, then add at breakpoints */
   .element {
     width: 100%;
   }
   @media (min-width: 768px) {
     .element {
       width: 50%;
     }
   }

   /* ✗ Bad - desktop-first */
   @media (max-width: 768px) {
     .element {
       width: 100%;
     }
   }
   ```

3. **Use REM Units**

   ```css
   /* ✓ Good - scales with user's font size preference */
   padding: 1rem;
   font-size: 1rem;

   /* ✗ Bad - fixed pixel size */
   padding: 16px;
   ```

4. **Include Focus Styles**

   ```css
   /* ✓ Good - keyboard accessible */
   button:focus {
     outline: 3px solid #90d898;
     outline-offset: 2px;
   }

   /* ✗ Bad - removes focus indicator */
   button:focus {
     outline: none;
   }
   ```

---

## Next Steps

Read **[06-API-REFERENCE.md](06-API-REFERENCE.md)** to understand external APIs and integrations.

## Landing vs Content Page Styles (2025 Update)

- Use `landing-page.css` for landing page only styles.
- Use `content-page.css` for content page only styles.
- Do not share or import styles between these files.
- Reference only the relevant CSS in your HTML for each page type.

Example:

```html
<!-- Landing page -->
<link rel="stylesheet" href="dist/landing-page.min.css" />
<!-- Content page -->
<link rel="stylesheet" href="dist/content-page.min.css" />
```

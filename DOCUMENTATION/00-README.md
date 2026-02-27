# NTG Central - AI Knowledge Base Portal Documentation

## Overview

This documentation covers the **AI Knowledge Base Portal** for NTG Central (Northern Territory Government). The codebase is actively maintained with a modular source structure in `src/`, compiled to `dist/` via npm scripts.

**Purpose:** Help NT government employees discover AI-related guidance, use cases, and resources to boost workplace productivity.

**Two entry bundles:**
- `dist/landing-page.min.{js,css}` — search interface, filtering, cards, pagination
- `dist/content-page.min.{js,css}` — code block wrapping, copy-to-clipboard, sidebar

---

## Documentation Structure

This documentation is organized into the following modules:

### Core Documentation Files

1. **[01-ARCHITECTURE.md](01-ARCHITECTURE.md)** - High-level technical architecture, technology stack, and system design
2. **[02-SEARCH-ENGINE.md](02-SEARCH-ENGINE.md)** - Funnelback search integration, API details, and search functionality
3. **[03-USER-SYSTEM.md](03-USER-SYSTEM.md)** - User authentication, profile management, and data persistence
4. **[04-COMPONENTS.md](04-COMPONENTS.md)** - UI components, filters, interactive elements, and DOM structure
5. **[05-STYLING.md](05-STYLING.md)** - CSS framework, color palette, typography, and responsive design
6. **[06-API-REFERENCE.md](06-API-REFERENCE.md)** - External APIs, endpoints, and third-party integrations
7. **[07-ACCESSIBILITY.md](07-ACCESSIBILITY.md)** - WCAG compliance, accessibility features, and AU Design System standards
8. **[08-DEVELOPER-GUIDE.md](08-DEVELOPER-GUIDE.md)** - Setup, development workflow, and best practices

---

## Quick Reference

### Key Snapshot (current build)

- **Bundles (dist):** landing-page.min.{js,css}, content-page.min.{js,css}
- **Source (src):** modular CSS/JS per page type plus shared utilities (e.g., wrap-pre-blocks.js, copy-to-clipboard.js)
- **Libraries:** jQuery 3.4.1, PostCSS (autoprefixer/cssnano), esbuild, AU Design System assets preserved
- **Fonts:** Roboto, neue-haas-grotesk (Typekit)

### Technology Stack

**Frontend:**

- jQuery 3.4.1
- ES modules bundled via esbuild
- Australian Design System (AUS)
- Bootstrap Grid 4.1.3
- SumoSelect 3.4.9 (enhanced dropdowns)

**Search & Discovery:**

- Offline-first keyword search using cached local data (instant, no API wait)
- TF (Term Frequency) scoring with multi-word tokenization and partial matching
- Work-area filter with OR logic and "Select All" SumoSelect dropdown
- Applied filter pills with per-pill removal
- Pagination (10 results per page, client-side)
- Background Funnelback API refresh (non-blocking, updates cache)
- Header/global search remains NTG Central Coveo-powered (unchanged)

**Styling:**

- Modular CSS per page type (landing vs content)
- Two-column responsive grid (`.nt-two-column`) for welcome section
- Dedicated styling for sidebar and code blocks (`.aikb-pre-block`, copy button)
- Accessibility-first approach

**Analytics:**

- Google Analytics 4 (GA4, tracking ID: G-09TV1G846C)

---

### Important Notes

- Source lives in `src/`; never edit files in `dist/` directly — they are compiled output.
- Landing and content pages ship distinct CSS/JS bundles — do not mix imports between them.
- In production (`ntgcentral.nt.gov.au`), data loads from the live Squiz Matrix API. In development, it loads from `dist/search.json`.
- Font Awesome Pro 5.15.4 is loaded from CDN (`pro.fontawesome.com`). Local `all.css` is commented out (missing webfonts).
- jQuery 3.4.1 is loaded in `<head>` before any `$(document).ready()` calls.

### Asset Locations

**Stylesheets (page-level files, not source):**

- `main.css` — Primary NTG Central design system styles
- `roboto.css` — Google Fonts (Roboto)
- `yht7rxj.css` — Adobe Typekit (neue-haas-grotesk)
- `status-toolbar.css` — Admin toolbar
- `imageslider-fotorama.css` — Image carousel

**Page scripts (not source):**

- `components.js` — AU Design System component initialization
- `global-v2.js` — NTG Central global utilities
- `profile-menu.js` — User profile dropdown
- `ntg-central-update-user-profile.js` — Profile sync from SAML

**Built source assets (edit `src/`, run `npm run build`):**

- `dist/landing-page.min.js` / `dist/landing-page.min.css`
- `dist/content-page.min.js` / `dist/content-page.min.css`

---

## Getting Started

1. Read **[01-ARCHITECTURE.md](01-ARCHITECTURE.md)** for system overview and file map
2. Read **[02-SEARCH-ENGINE.md](02-SEARCH-ENGINE.md)** for the offline search algorithm and data flow
3. Read **[04-COMPONENTS.md](04-COMPONENTS.md)** for all UI component markup and behaviour
4. Read **[08-DEVELOPER-GUIDE.md](08-DEVELOPER-GUIDE.md)** for build commands and debugging

---

## Document Index

| Document              | Canonical Topic                                                                 |
| --------------------- | ------------------------------------------------------------------------------- |
| 01-ARCHITECTURE.md    | Tech stack, build system, DOM structure, state management, data flow            |
| 02-SEARCH-ENGINE.md   | Offline search algorithm, scoring, tokenization, Funnelback background refresh  |
| 03-USER-SYSTEM.md     | SAML auth, user profile, localStorage, persona system                          |
| 04-COMPONENTS.md      | All UI components: search interface, cards, filters, pagination, sidebar, pre-blocks, two-column layout |
| 05-STYLING.md         | CSS architecture, color palette, typography, two-column grid                    |
| 06-API-REFERENCE.md   | External APIs: Funnelback REST, Squiz Matrix JS API, GA4                        |
| 07-ACCESSIBILITY.md   | WCAG 2.1 AA, keyboard nav, ARIA, AU Design System compliance                   |
| 08-DEVELOPER-GUIDE.md | Local setup, build commands, watch mode, debugging, common tasks                |

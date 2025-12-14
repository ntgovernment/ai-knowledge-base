# NTG Central - AI Knowledge Base Portal Documentation

## Overview

This documentation covers the **AI Knowledge Base Portal** for NTG Central (Northern Territory Government). The current codebase is an actively maintained, modular build with separate landing and content bundles, runtime JS enhancements (search UI, sidebar, code block wrapping, copy-to-clipboard), and a streamlined build pipeline using esbuild and PostCSS.

**Purpose:** Help NT government employees discover AI-related guidance, policies, and resources to boost workplace productivity.

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

- Funnelback Enterprise Search API (Squiz Cloud) for in-page results
- AJAX integration with noise-word filtering
- Pagination (10 results per page)
- Header/global search remains NTG Central Coveo-powered (unchanged)

**Styling:**

- Modular CSS per page type (landing vs content)
- Dedicated styling for sidebar and code blocks (.aikb-pre-block, copy button)
- Accessibility-first approach

**Analytics:**

- Google Analytics 4 (GA4)

---

### Important Notes

- Codebase is actively maintained; source lives in `src/` and builds to `dist/`.
- Landing and content pages ship distinct CSS/JS bundles—do not mix imports between them.
- Runtime JS wraps heading+pre blocks, injects copy buttons (with icon swap on success), and styles sidebars/search UI.

### Asset Locations

**Stylesheets:**

- `main.css` - Primary styling
- `all.css` - Font Awesome Pro 5.15.4 icons
- `roboto.css` - Google Fonts
- `yht7rxj.css` - Adobe Typekit fonts
- `status-toolbar.css` - Admin toolbar
- `imageslider-fotorama.css` - Image carousel

**Scripts:**

- `ntgov-funnelback-search.js` - Funnelback in-page search engine (active)
- `ntgov-coveo-search.js` - Legacy header/global Coveo search (unchanged/preserved)
- `components.js` - Component initialization
- `global-v2.js` - Global utilities
- `profile-menu.js` - User profile interactions
- `ntg-central-update-user-profile.js` - Profile sync

**Assets:**

- `logo-ntg-color.svg` - NTG Central logo

---

## User Profile Information (Embedded)

The saved page includes test user data:

- **Name:** Roy Galet
- **Email:** roy.galet@nt.gov.au
- **Title:** Manager Frontend Design
- **Department:** 68 (DCDD - Department of Corporate and Digital Development)
- **Location:** Charles Darwin Centre 10th Floor [100DCX10]

---

## Getting Started

1. Start with **[01-ARCHITECTURE.md](01-ARCHITECTURE.md)** for system overview
2. Read **[02-SEARCH-ENGINE.md](02-SEARCH-ENGINE.md)** to understand Funnelback search functionality
3. Review **[06-API-REFERENCE.md](06-API-REFERENCE.md)** for Funnelback API integration details
4. Review **[04-COMPONENTS.md](04-COMPONENTS.md)** for UI structure
5. Check **[07-ACCESSIBILITY.md](07-ACCESSIBILITY.md)** for compliance requirements

---

## Document Metadata

- **Created:** December 12, 2025
- **Last Updated:** December 14, 2025 (Search system & filter updates)
- **Format:** Markdown with code examples
- **Audience:** Full-stack developers, AI agents, technical teams
- **Audience Level:** Intermediate (includes beginner explanations)

---

## Support & References

### External Resources

- [Australian Design System](https://designsystem.gov.au/)
- [Funnelback Documentation](https://docs.funnelback.com/)
- [jQuery Documentation](https://jquery.com/)
- [Font Awesome Icons](https://fontawesome.com/)

### Internal Links

- [HTML Page](AI%20knowledge%20base%20_%20NTG%20Central.html)
- [Assets Directory](AI%20knowledge%20base%20_%20NTG%20Central_files/)

---

## Document Index

| Document              | Purpose               | Key Sections                              |
| --------------------- | --------------------- | ----------------------------------------- |
| 01-ARCHITECTURE.md    | System design         | Structure, Tech Stack, Data Flow          |
| 02-SEARCH-ENGINE.md   | Search functionality  | Funnelback API, Query Processing, Results |
| 03-USER-SYSTEM.md     | User management       | Auth, Profile, localStorage               |
| 04-COMPONENTS.md      | UI elements           | Filters, Dropdowns, Navigation            |
| 05-STYLING.md         | Styling framework     | Colors, Typography, Layout                |
| 06-API-REFERENCE.md   | External integrations | Endpoints, Third-party Services           |
| 07-ACCESSIBILITY.md   | Compliance            | WCAG, A11Y, AU Standards                  |
| 08-DEVELOPER-GUIDE.md | Development           | Setup, Workflow, Best Practices           |

---

**Next Step:** Read [01-ARCHITECTURE.md](01-ARCHITECTURE.md) for a comprehensive overview of the system architecture.

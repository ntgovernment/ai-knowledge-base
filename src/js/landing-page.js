// Import all JS modules for landing page bundle (except content-page.js)
import "./search-form-handler.js";
import "./search-filters.js";
import "./search-card-template.js";
import "./populate-dropdowns.js";
import "./offline-search.js";
import "./ntg-funnelback.js";
import "./multi-select-dropdown.js";
import "./load-initial-results.js";
import "./cta-button-alias.js";

// Confirm bundle loaded successfully
console.log("[aikb] Landing page bundle loaded successfully");
console.log("[aikb] jQuery available:", typeof window.jQuery !== "undefined");
console.log("[aikb] DOM ready state:", document.readyState);

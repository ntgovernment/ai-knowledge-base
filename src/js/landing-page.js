// Import all JS modules for landing page bundle (except content-page.js)
import "./config.js";
import "./search-form-handler.js";
import "./search-filters.js";
import "./search-card-template.js";
import "./populate-dropdowns.js";
import "./offline-search.js";
import "./load-initial-results.js";
import "./cta-button-alias.js";
import "./pagination.js";
import { initClearAllButton } from "./applied-filters.js";

// Confirm bundle loaded successfully

// Initialize clear all button after page loads
window.addEventListener("load", function () {
  initClearAllButton();
});

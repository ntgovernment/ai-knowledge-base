/**
 * Applied Filters Display Module
 * Manages the display and interaction of applied filter pills
 */

/**
 * Display applied filters as pills
 * @param {Object} filters - Object containing active filters
 */
export function displayAppliedFilters(filters) {
  const section = document.getElementById("appliedFiltersSection");
  const container = document.getElementById("appliedFilters");
  const clearAllBtn = document.getElementById("clearAllBtn");

  if (!section || !container) {
    return;
  }

  // Clear existing pills
  container.innerHTML = "";

  let hasFilters = false;

  // Add search query pill (green)
  if (filters.searchQuery && filters.searchQuery.trim()) {
    hasFilters = true;
    const pill = createFilterPill(
      "Search",
      filters.searchQuery,
      "bg-success",
      "search",
    );
    container.appendChild(pill);
  }

  // Add work area pill (primary blue) - only show if not "All work areas"
  if (
    filters.workArea &&
    filters.workArea !== "All work areas" &&
    filters.workArea.trim()
  ) {
    hasFilters = true;
    const pill = createFilterPill(
      "Work area",
      filters.workArea,
      "bg-primary",
      "work-area",
    );
    container.appendChild(pill);
  }

  // Do not add sort pill

  // Always show Clear All button when any filter is active
  if (clearAllBtn) {
    clearAllBtn.style.display = hasFilters ? "inline-flex" : "none";
    clearAllBtn.style.marginLeft = "8px";
    clearAllBtn.style.verticalAlign = "middle";
    clearAllBtn.style.alignItems = "center";
    container.appendChild(clearAllBtn);
  }

  // Show/hide section based on whether filters are active
  section.style.display = hasFilters ? "block" : "none";
}

/**
 * Get user-friendly label for sort option
 * @param {string} sortValue - Sort value
 * @returns {string} - User-friendly label
 */
function getSortLabel(sortValue) {
  const sortLabels = {
    relevance: "Relevance",
    "date-newest": "Date (newest first)",
    "date-oldest": "Date (oldest first)",
    "title-az": "Title (A-Z)",
    "title-za": "Title (Z-A)",
  };
  return sortLabels[sortValue] || sortValue;
}

/**
 * Create a filter pill element
 * @param {string} label - Filter category label
 * @param {string} value - Filter value
 * @param {string} badgeClass - Bootstrap badge class (bg-success, bg-primary, etc.)
 * @param {string} filterType - Type of filter for removal
 * @param {string} filterValue - Specific value to remove (for multi-value filters)
 * @returns {HTMLElement} - Filter pill element
 */
function createFilterPill(label, value, badgeClass, filterType, filterValue) {
  const pill = document.createElement("span");
  pill.className = `badge ${badgeClass} filter-pill d-inline-flex align-items-center`;

  const pillLabel = document.createElement("span");
  pillLabel.className = "pill-label";
  pillLabel.textContent = `${label}:`;

  const pillValue = document.createElement("span");
  pillValue.className = "pill-value";
  pillValue.textContent = value;

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "pill-remove";
  removeButton.title = `Remove ${label}: ${value}`;
  removeButton.setAttribute("data-filter-type", filterType);
  if (filterValue) {
    removeButton.setAttribute("data-filter-value", filterValue);
  }

  const icon = document.createElement("span");
  icon.className = "fas fa-times";

  removeButton.appendChild(icon);

  // Add click handler
  removeButton.addEventListener("click", (e) => {
    e.preventDefault();
    removeFilter(filterType, filterValue);
  });

  pill.appendChild(pillLabel);
  pill.appendChild(pillValue);
  pill.appendChild(removeButton);

  return pill;
}

/**
 * Remove a specific filter
 * @param {string} filterType - Type of filter to remove
 * @param {string} filterValue - Specific value to remove (optional)
 */
async function removeFilter(filterType, filterValue) {
  switch (filterType) {
    case "search":
      // Clear search input
      const searchInput = document.getElementById("search");
      if (searchInput) {
        searchInput.value = "";

        // Update applied filters display immediately
        const updatedFilters = getCurrentFilters();
        displayAppliedFilters(updatedFilters);

        // Trigger reload of initial results
        const { loadInitialResults } =
          await import("./load-initial-results.js");
        loadInitialResults();
      }
      break;

    case "work-area":
      // Reset work area dropdown to "All work areas"
      const workAreaDropdown = document.getElementById("document_type");
      if (workAreaDropdown) {
        workAreaDropdown.value = "All work areas";

        // Trigger change event to reapply filters
        const changeEvent = new Event("change", { bubbles: true });
        workAreaDropdown.dispatchEvent(changeEvent);
      }
      break;

    // ...existing code...
  }
}

/**
 * Clear all filters
 */
export async function clearAllFilters() {
  // Clear search input
  const searchInput = document.getElementById("search");
  if (searchInput) {
    searchInput.value = "";
  }

  // Reset work area dropdown to "All work areas"
  const workAreaDropdown = document.getElementById("document_type");
  if (workAreaDropdown) {
    workAreaDropdown.value = "All work areas";
  }

  // Hide applied filters section
  const section = document.getElementById("appliedFiltersSection");
  if (section) {
    section.style.display = "none";
  }

  // Reload initial results
  const { loadInitialResults } = await import("./load-initial-results.js");
  loadInitialResults();
}

/**
 * Initialize "Clear All" button
 */
export function initClearAllButton() {
  const clearAllBtn = document.getElementById("clearAllBtn");
  if (clearAllBtn) {
    clearAllBtn.addEventListener("click", (e) => {
      e.preventDefault();
      clearAllFilters();
    });
  }
}

/**
 * Get current filter state
 * @returns {Object} - Current filter state
 */
export function getCurrentFilters() {
  const searchInput = document.getElementById("search");
  const workAreaDropdown = document.getElementById("document_type");
  const sortDropdown =
    document.getElementById("sort") || document.getElementById("owner");

  const filters = {
    searchQuery: searchInput ? searchInput.value : "",
    workArea: workAreaDropdown ? workAreaDropdown.value : "All work areas",
    sort: sortDropdown ? sortDropdown.value : "relevance",
  };

  return filters;
}

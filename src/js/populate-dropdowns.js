/**
 * Dynamically create the search input and icon to match the attached design
 */
export function populateSearchInput() {
  const container = document.getElementById("search-container");
  if (!container) return;
  container.innerHTML = "";

  // Outer wrapper
  const wrapper = document.createElement("div");
  wrapper.style.width = "100%";
  wrapper.style.height = "100%";
  wrapper.style.padding = "24px";
  wrapper.style.background = "var(--clr-surface-primary, white)";
  wrapper.style.overflow = "hidden";
  wrapper.style.outline = "1px var(--clr-stroke-default, #AFB5BF) solid";
  wrapper.style.outlineOffset = "-1px";
  wrapper.style.justifyContent = "flex-start";
  wrapper.style.alignItems = "center";
  wrapper.style.gap = "10px";
  wrapper.style.display = "inline-flex";

  // Inner flex
  const inner = document.createElement("div");
  inner.style.flex = "1 1 0";
  inner.style.justifyContent = "space-between";
  inner.style.alignItems = "center";
  inner.style.display = "flex";

  // Placeholder text
  const placeholder = document.createElement("div");
  placeholder.textContent = "Search for a AI prompt or use case...";
  placeholder.style.color = "var(--clr-text-helper, #606A80)";
  placeholder.style.fontSize = "16px";
  placeholder.style.fontFamily = "Roboto";
  placeholder.style.fontWeight = "400";
  placeholder.style.lineHeight = "24px";
  placeholder.style.wordWrap = "break-word";

  // Icon container
  const iconContainer = document.createElement("div");
  iconContainer.setAttribute("data-colour", "NTGC blue");
  iconContainer.style.width = "24px";
  iconContainer.style.height = "24px";
  iconContainer.style.position = "relative";
  iconContainer.style.overflow = "hidden";

  // Icon (small colored div)
  const icon = document.createElement("div");
  icon.style.width = "20px";
  icon.style.height = "20px";
  icon.style.left = "2px";
  icon.style.top = "2px";
  icon.style.position = "absolute";
  icon.style.background = "var(--clr-icon-subtle, #878F9F)";

  iconContainer.appendChild(icon);
  inner.appendChild(placeholder);
  inner.appendChild(iconContainer);
  wrapper.appendChild(inner);
  container.appendChild(wrapper);
}
// Dynamically populate work area and sort dropdowns from search data

let staticWorkAreas = [];

/**
 * Extract unique work areas from search results (used as fallback if static fetch fails)
 * @param {Array} results - Array of search result objects
 * @returns {Array<string>} - Sorted array of unique work area values
 */
function extractWorkAreas(results) {
  const workAreaSet = new Set();

  results.forEach((result) => {
    if (result.listMetadata && result.listMetadata["Work area"]) {
      const workAreas = result.listMetadata["Work area"];
      // Work areas is already an array
      if (Array.isArray(workAreas)) {
        workAreas.forEach((area) => {
          const trimmed = area.trim();
          if (trimmed) {
            workAreaSet.add(trimmed);
          }
        });
      }
    }
  });

  // Convert to array and sort alphabetically
  return Array.from(workAreaSet).sort((a, b) => {
    return a.localeCompare(b);
  });
}

/**
 * Store static work areas list for later use
 * @param {Array<string>} workAreas - Array of work area names from static source
 */
export function setStaticWorkAreas(workAreas) {
  staticWorkAreas = workAreas;
}

/**
 * Populate work area dropdown with dynamic options
 * @param {Array<string>} workAreas - Array of work area values
 */
function populateWorkAreaDropdown(workAreas) {
  const dropdown = document.getElementById("document_type");
  if (!dropdown) {
    return;
  }

  // Unload existing SumoSelect instance if it exists
  if (window.jQuery && window.jQuery.fn.SumoSelect && dropdown.sumo) {
    window.jQuery(dropdown)[0].sumo.unload();
  }

  // Enable multiple selection
  dropdown.setAttribute("multiple", "multiple");

  // Clear existing options
  dropdown.innerHTML = "";

  // Add "All work areas" as an option (not selected by default)
  const allOption = document.createElement("option");
  allOption.value = "All work areas";
  allOption.textContent = "All work areas";
  dropdown.appendChild(allOption);

  // Add work area options
  workAreas.forEach((workArea) => {
    // Skip "All work areas" if it's in the data to avoid duplicates
    if (workArea === "All work areas") {
      return;
    }
    const option = document.createElement("option");
    option.value = workArea;
    option.textContent = workArea;
    dropdown.appendChild(option);
  });

  // Initialize SumoSelect plugin for dropdown with tickable items
  if (window.jQuery && window.jQuery.fn.SumoSelect) {
    window.jQuery(dropdown).SumoSelect({
      placeholder: "Select work areas",
      search: true,
      selectAll: true, // Enable "Select All" checkbox
      searchText: "Search work areas...",
      noMatch: "No matches found",
      captionFormat: "{0} work areas selected",
      csvDispCount: 2, // Show up to 2 items before switching to count format
      okCancelInMulti: true, // Add OK/Cancel buttons for better UX
      isClickAwayOk: true, // Accept selections when clicking away
      onChange: function () {
        // Trigger native change event for search-filters.js listener
        const event = new Event("change", { bubbles: true });
        dropdown.dispatchEvent(event);
      },
    });
  }
}

/**
 * Populate sort dropdown with sort options
 */
function populateSortDropdown() {
  const container = document.getElementById("select-question-3");
  if (!container) {
    return;
  }

  // Check if dropdown already exists
  let dropdown = document.getElementById("owner");

  // If dropdown doesn't exist, create the entire structure
  if (!dropdown) {
    // Clear container content (except label)
    const label = container.querySelector("label");
    container.innerHTML = "";
    if (label) {
      container.appendChild(label);
    } else {
      // Create label if it doesn't exist
      const newLabel = document.createElement("label");
      newLabel.className = "ntgc-form-input--label";
      newLabel.setAttribute("for", "select-input-2");
      newLabel.textContent = "Sort";
      container.appendChild(newLabel);
    }

    // Create dropdown wrapper
    const wrapper = document.createElement("div");
    wrapper.className = "aikb-dropdown-wrapper";

    // Create inner wrapper
    const inner = document.createElement("div");
    inner.className = "aikb-dropdown-inner";

    // Create select element
    dropdown = document.createElement("select");
    dropdown.name = "sort";
    dropdown.className =
      "ntgc-select ntgc-select--block ntgc-select-input--filter";
    dropdown.id = "owner";

    // Append elements
    inner.appendChild(dropdown);
    wrapper.appendChild(inner);
    container.appendChild(wrapper);
  } else {
    // Clear existing options if dropdown exists
    dropdown.innerHTML = "";
  }

  // Define sort options
  const sortOptions = [
    { value: "relevance", label: "Relevance", selected: true },
    { value: "date-newest", label: "Date (newest first)" },
    { value: "date-oldest", label: "Date (oldest first)" },
    { value: "title-az", label: "Title (A-Z)" },
    { value: "title-za", label: "Title (Z-A)" },
  ];

  // Add options to dropdown
  sortOptions.forEach((opt) => {
    const option = document.createElement("option");
    option.value = opt.value;
    option.textContent = opt.label;
    if (opt.selected) option.selected = true;
    dropdown.appendChild(option);
  });
}

/**
 * Add chevron-down icons to dropdowns
 * Icons are displayed via CSS ::before pseudo-elements
 */
function addDropdownIcons() {
  // Add icon to work area dropdown
  const workAreaDropdown = document.getElementById("document_type");
  if (
    workAreaDropdown &&
    !workAreaDropdown.parentElement.querySelector(".aikb-dropdown-icon")
  ) {
    const icon = document.createElement("div");
    icon.className = "aikb-dropdown-icon";
    icon.setAttribute("data-colour", "NTG Blue");

    const wrapper = workAreaDropdown.closest(".aikb-dropdown-wrapper");
    if (wrapper) {
      const inner = wrapper.querySelector(".aikb-dropdown-inner");
      if (inner) {
        inner.appendChild(icon);
      }
    }
  }

  // Add icon to sort dropdown
  const sortDropdown = document.getElementById("owner");
  if (
    sortDropdown &&
    !sortDropdown.parentElement.querySelector(".aikb-dropdown-icon")
  ) {
    const icon = document.createElement("div");
    icon.className = "aikb-dropdown-icon";
    icon.setAttribute("data-colour", "NTG Blue");

    const wrapper = sortDropdown.closest(".aikb-dropdown-wrapper");
    if (wrapper) {
      const inner = wrapper.querySelector(".aikb-dropdown-inner");
      if (inner) {
        inner.appendChild(icon);
      }
    }
  }
}

/**
 * Initialize dropdowns with data from search results
 * @param {Array} results - Array of search result objects
 * @param {Array<string>} workAreasFromFetch - Optional pre-fetched work areas list
 */
export function initializeDropdowns(results, workAreasFromFetch = null) {
  // Use static work areas if available, otherwise extract from results
  let workAreas;
  if (workAreasFromFetch && workAreasFromFetch.length > 0) {
    workAreas = workAreasFromFetch;
  } else if (staticWorkAreas.length > 0) {
    workAreas = staticWorkAreas;
  } else {
    workAreas = extractWorkAreas(results);
  }

  populateWorkAreaDropdown(workAreas);

  // Populate sort options
  populateSortDropdown();

  // Add chevron icons
  addDropdownIcons();
}

/**
 * Initialize on page load with empty state
 */
export function initializeEmptyDropdowns() {
  // Dynamically create the search input and icon
  populateSearchInput();

  // Populate sort options (not data-dependent)
  populateSortDropdown();

  // Add default "Select a work area" to work area dropdown
  populateWorkAreaDropdown([]);

  // Add chevron icons
  addDropdownIcons();
}

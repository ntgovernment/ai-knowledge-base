// Dynamically populate work area and sort dropdowns from search data
import { initMultiSelect } from "./multi-select-dropdown.js";

let multiSelectInstance = null;

/**
 * Extract unique work areas from search results
 * @param {Array} results - Array of search result objects
 * @returns {Array<string>} - Sorted array of unique work area values
 */
function extractWorkAreas(results) {
  const workAreaSet = new Set();

  results.forEach((result) => {
    if (
      result.listMetadata &&
      result.listMetadata.keyword &&
      result.listMetadata.keyword[0]
    ) {
      const workArea = result.listMetadata.keyword[0];
      // Split comma-separated values and add each individually
      workArea.split(",").forEach((area) => {
        const trimmed = area.trim();
        if (trimmed) {
          workAreaSet.add(trimmed);
        }
      });
    }
  });

  // Convert to array and sort alphabetically
  return Array.from(workAreaSet).sort((a, b) => {
    // Put "All work areas" first if it exists
    if (a === "All work areas") return -1;
    if (b === "All work areas") return 1;
    return a.localeCompare(b);
  });
}

/**
 * Populate work area dropdown with dynamic options
 * @param {Array<string>} workAreas - Array of work area values
 */
function populateWorkAreaDropdown(workAreas) {
  const dropdown = document.getElementById("document_type");
  if (!dropdown) {
    console.warn("Work area dropdown #document_type not found");
    return;
  }

  // Clear existing options
  dropdown.innerHTML = "";

  // Add default "Select a work area" option
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select a work area";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  dropdown.appendChild(defaultOption);

  // Add work area options
  workAreas.forEach((workArea) => {
    const option = document.createElement("option");
    option.value = workArea;
    option.textContent = workArea;
    dropdown.appendChild(option);
  });

  console.log(`Populated work area dropdown with ${workAreas.length} options`);

  // Initialize multi-select after populating options
  if (multiSelectInstance) {
    // Destroy previous instance if exists
    multiSelectInstance.destroy();
    multiSelectInstance = null;
  }

  // Only initialize if not already initialized
  if (
    !dropdown.nextElementSibling ||
    !dropdown.nextElementSibling.classList.contains(
      "aikb-multiselect-container"
    )
  ) {
    multiSelectInstance = initMultiSelect(dropdown);
  }
}

/**
 * Populate sort dropdown with sort options
 */
function populateSortDropdown() {
  const container = document.getElementById("select-question-3");
  if (!container) {
    console.warn("Sort dropdown container #select-question-3 not found");
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

  console.log(`Populated sort dropdown with ${sortOptions.length} options`);
}

/**
 * Add chevron-down icons to dropdowns
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
    icon.innerHTML =
      '<span class="fal fa-chevron-down" aria-hidden="true"></span>';

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
    icon.innerHTML =
      '<span class="fal fa-chevron-down" aria-hidden="true"></span>';

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
 */
export function initializeDropdowns(results) {
  console.log("Initializing dropdowns with search data...");

  // Extract and populate work areas
  const workAreas = extractWorkAreas(results);
  populateWorkAreaDropdown(workAreas);

  // Populate sort options
  populateSortDropdown();

  // Add chevron icons
  addDropdownIcons();

  console.log("Dropdowns initialized successfully");
}

/**
 * Initialize on page load with empty state
 */
export function initializeEmptyDropdowns() {
  console.log("Initializing dropdowns with default state...");

  // Populate sort options (not data-dependent)
  populateSortDropdown();

  // Add default "Select a work area" to work area dropdown
  populateWorkAreaDropdown([]);

  // Add chevron icons
  addDropdownIcons();

  console.log("Empty dropdowns initialized");
}

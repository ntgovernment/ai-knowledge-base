// Pagination component for search results

let currentPage = 1;
let itemsPerPage = 10;
let totalItems = 0;
let allResults = [];
let paginationContainer = null;

/**
 * Initialize pagination
 * @param {Array} results - All search results
 * @param {number} perPage - Items per page (default: 10)
 */
export function initializePagination(results, perPage = 10) {
  allResults = results;
  itemsPerPage = perPage;
  totalItems = results.length;
  currentPage = 1;

  // Find or create pagination container
  ensurePaginationContainer();

  // Render pagination controls
  renderPaginationControls();
}

/**
 * Get current page of results
 * @returns {Array} - Results for current page
 */
export function getCurrentPageResults() {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return allResults.slice(startIndex, endIndex);
}

/**
 * Get current page number
 * @returns {number}
 */
export function getCurrentPage() {
  return currentPage;
}

/**
 * Get total number of pages
 * @returns {number}
 */
export function getTotalPages() {
  return Math.ceil(totalItems / itemsPerPage);
}

/**
 * Ensure pagination container exists in DOM
 */
function ensurePaginationContainer() {
  paginationContainer = document.getElementById("aikb-pagination");

  if (!paginationContainer) {
    // Create pagination container after search results
    const searchResultsContainer = document.getElementById(
      "search-results-list"
    );
    if (searchResultsContainer && searchResultsContainer.parentNode) {
      paginationContainer = document.createElement("div");
      paginationContainer.id = "aikb-pagination";
      paginationContainer.className = "aikb-pagination";
      searchResultsContainer.parentNode.insertBefore(
        paginationContainer,
        searchResultsContainer.nextSibling
      );
    }
  }
}

/**
 * Render pagination controls
 */
function renderPaginationControls() {
  if (!paginationContainer) return;

  const totalPages = getTotalPages();

  // Hide pagination if only 1 page or no results
  if (totalPages <= 1) {
    paginationContainer.innerHTML = "";
    paginationContainer.style.display = "none";
    return;
  }

  paginationContainer.style.display = "flex";

  // Create pagination wrapper
  const wrapper = document.createElement("div");
  wrapper.className = "aikb-pagination__wrapper";

  // Previous button
  const prevButton = createControlButton("Previous", currentPage > 1, () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  });
  wrapper.appendChild(prevButton);

  // Page numbers
  const pageNumbers = createPageNumbers(totalPages);
  wrapper.appendChild(pageNumbers);

  // Next button
  const nextButton = createControlButton(
    "Next",
    currentPage < totalPages,
    () => {
      if (currentPage < totalPages) {
        goToPage(currentPage + 1);
      }
    }
  );
  wrapper.appendChild(nextButton);

  // Clear and update
  paginationContainer.innerHTML = "";
  paginationContainer.appendChild(wrapper);
}

/**
 * Create Previous/Next control button
 * @param {string} label - Button label
 * @param {boolean} enabled - Whether button is enabled
 * @param {Function} onClick - Click handler
 * @returns {HTMLElement}
 */
function createControlButton(label, enabled, onClick) {
  const button = document.createElement("div");
  button.className = "aikb-pagination__control";
  if (!enabled) {
    button.classList.add("aikb-pagination__control--disabled");
  }

  const iconLabel = document.createElement("div");
  iconLabel.className = "aikb-pagination__icon-label";

  if (label === "Previous") {
    const icon = document.createElement("span");
    icon.className = "fal fa-chevron-left";
    icon.setAttribute("aria-hidden", "true");
    iconLabel.appendChild(icon);
  }

  const text = document.createElement("span");
  text.className = "aikb-pagination__text";
  text.textContent = label;
  iconLabel.appendChild(text);

  if (label === "Next") {
    const icon = document.createElement("span");
    icon.className = "fal fa-chevron-right";
    icon.setAttribute("aria-hidden", "true");
    iconLabel.appendChild(icon);
  }

  button.appendChild(iconLabel);

  if (enabled) {
    button.addEventListener("click", onClick);
    button.style.cursor = "pointer";
  }

  return button;
}

/**
 * Create page number buttons
 * @param {number} totalPages - Total number of pages
 * @returns {HTMLElement}
 */
function createPageNumbers(totalPages) {
  const container = document.createElement("div");
  container.className = "aikb-pagination__pages";

  const pages = calculatePageRange(currentPage, totalPages);

  pages.forEach((page) => {
    if (page === "...") {
      const ellipsis = document.createElement("span");
      ellipsis.className = "aikb-pagination__ellipsis";
      ellipsis.textContent = "...";
      container.appendChild(ellipsis);
    } else {
      const pageButton = document.createElement("div");
      pageButton.className = "aikb-pagination__page-number";

      if (page === currentPage) {
        pageButton.classList.add("aikb-pagination__page-number--active");
      }

      const pageText = document.createElement("span");
      pageText.textContent = page;
      pageButton.appendChild(pageText);

      pageButton.addEventListener("click", () => goToPage(page));
      pageButton.style.cursor = "pointer";

      container.appendChild(pageButton);
    }
  });

  return container;
}

/**
 * Calculate which page numbers to display
 * @param {number} current - Current page
 * @param {number} total - Total pages
 * @returns {Array} - Array of page numbers and ellipsis
 */
function calculatePageRange(current, total) {
  if (total <= 7) {
    // Show all pages if 7 or fewer
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = [];

  // Always show first page
  pages.push(1);

  if (current > 3) {
    pages.push("...");
  }

  // Show pages around current
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push("...");
  }

  // Always show last page
  pages.push(total);

  return pages;
}

/**
 * Navigate to specific page
 * @param {number} page - Page number to navigate to
 */
function goToPage(page) {
  const totalPages = getTotalPages();

  if (page < 1 || page > totalPages || page === currentPage) {
    return;
  }

  currentPage = page;

  // Re-render pagination controls
  renderPaginationControls();

  // Trigger custom event for page change
  const event = new CustomEvent("aikb-pagination-change", {
    detail: {
      page: currentPage,
      results: getCurrentPageResults(),
    },
  });
  document.dispatchEvent(event);

  // Scroll to top of results
  const searchResultsContainer = document.getElementById("search-results-list");
  if (searchResultsContainer) {
    const offset = 100; // Offset for fixed header
    const top =
      searchResultsContainer.getBoundingClientRect().top +
      window.pageYOffset -
      offset;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

/**
 * Update pagination with new results
 * @param {Array} results - New results array
 */
export function updatePagination(results) {
  allResults = results;
  totalItems = results.length;
  currentPage = 1; // Reset to first page

  renderPaginationControls();
}

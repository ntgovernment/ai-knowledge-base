// Search card template generator for AI Knowledge Base results

/**
 * Parse date string and extract "Month YYYY" format
 * @param {string} dateStr - Raw date string (e.g., "December 2025")
 * @returns {string} Formatted date or original string if parsing fails
 */
function formatDate(dateStr) {
  if (!dateStr) return "";

  // If already in "Month YYYY" format, return as-is
  const monthYearPattern = /^[A-Z][a-z]+ \d{4}$/;
  if (monthYearPattern.test(dateStr)) {
    return dateStr;
  }

  // Try to parse as Date object
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      return `${months[date.getMonth()]} ${date.getFullYear()}`;
    }
  } catch (e) {
    // Fall through to return original
  }

  return dateStr;
}

/**
 * Highlight matched search terms in text (including partial matches)
 * @param {string} text - Original text
 * @param {Array<string>} matchedTerms - Terms to highlight
 * @returns {string} HTML string with <mark> tags around matched terms
 */
function highlightMatches(text, matchedTerms) {
  if (!text || !matchedTerms || matchedTerms.length === 0) {
    return text;
  }

  let highlighted = text;

  // Sort terms by length (longest first) to avoid partial replacements
  const sortedTerms = [...matchedTerms].sort((a, b) => b.length - a.length);

  sortedTerms.forEach((term) => {
    // Create case-insensitive regex without word boundaries to match partial words
    // Use negative lookahead/lookbehind to avoid matching already highlighted text
    const regex = new RegExp(`(?!<mark[^>]*>)(${term})(?![^<]*<\/mark>)`, "gi");
    highlighted = highlighted.replace(regex, "<mark>$1</mark>");
  });

  return highlighted;
}

/**
 * Set HTML content safely (creates text nodes and mark elements)
 * @param {HTMLElement} element - Target element
 * @param {string} htmlString - HTML string with <mark> tags
 */
function setHighlightedHTML(element, htmlString) {
  element.innerHTML = ""; // Clear existing content

  // Parse the HTML string and create DOM nodes
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  // Append all child nodes from parsed content
  Array.from(doc.body.childNodes).forEach((node) => {
    element.appendChild(node.cloneNode(true));
  });
}

/**
 * Create a search result card DOM element
 * @param {Object} result - Result data object
 * @param {string} result.title - Card title
 * @param {string} result.summary - Card summary/description
 * @param {Object} result.listMetadata - Metadata object
 * @param {Array<string>} result.listMetadata["Work area"] - Array of work area tags
 * @param {Array<string>} result.listMetadata["Roles"] - Array of roles for "Good for"
 * @param {string} result.date - Submission date
 * @param {string} result.liveUrl - URL for "See more" button
 * @param {string} result.submittedBy - Person who submitted
 * @param {Array<string>} result._matchedTerms - Matched search terms for highlighting
 * @param {number} result._offlineScore - Offline search relevance score
 * @returns {HTMLElement|null} Card element or null if required fields missing
 */
function createSearchCard(result) {
  // Validate required fields
  if (!result.title || !result.summary || !result.liveUrl) {
    console.warn("Skipping card with missing required fields:", result);
    return null;
  }

  // Create card container
  const card = document.createElement("div");
  card.className = "aikb-search-card";

  // Add data attributes for sorting
  // Use offline score if available, otherwise rank or score
  const relevance =
    result._offlineScore || (result.rank ? -result.rank : result.score || 0);
  card.setAttribute("data-sort-relevance", relevance);

  // Title: store for alphabetical sorting
  card.setAttribute("data-sort-title", result.title);

  // Date: store timestamp for date sorting
  const dateTimestamp = result.dateTimestamp || 0;
  card.setAttribute("data-sort-date", dateTimestamp);

  // Create inner wrapper
  const inner = document.createElement("div");
  inner.className = "aikb-search-card__inner";

  // Create content section
  const content = document.createElement("div");
  content.className = "aikb-search-card__content";

  // Text section
  const textSection = document.createElement("div");
  textSection.className = "aikb-search-card__text";

  // Title (with highlighting if matched terms exist)
  const title = document.createElement("h3");
  title.className = "aikb-search-card__title";

  if (result._matchedTerms && result._matchedTerms.length > 0) {
    const highlightedTitle = highlightMatches(
      result.title,
      result._matchedTerms,
    );
    setHighlightedHTML(title, highlightedTitle);
  } else {
    title.textContent = result.title;
  }

  textSection.appendChild(title);

  // Summary (with highlighting if matched terms exist)
  const summary = document.createElement("p");
  summary.className = "aikb-search-card__summary";

  if (result._matchedTerms && result._matchedTerms.length > 0) {
    const highlightedSummary = highlightMatches(
      result.summary,
      result._matchedTerms,
    );
    setHighlightedHTML(summary, highlightedSummary);
  } else {
    summary.textContent = result.summary;
  }

  textSection.appendChild(summary);

  content.appendChild(textSection);

  // Tags section (work areas from JSON payload)
  const workAreas =
    result.listMetadata && result.listMetadata["Work area"]
      ? result.listMetadata["Work area"]
      : [];
  if (workAreas && workAreas.length > 0) {
    const tagsContainer = document.createElement("div");
    tagsContainer.className = "aikb-search-card__tags";

    // Create a tag for each work area
    workAreas.forEach((workArea) => {
      if (workArea && workArea.trim()) {
        const tag = document.createElement("div");
        tag.className = "aikb-search-card__tag";
        tag.textContent = workArea.trim();
        tagsContainer.appendChild(tag);
      }
    });

    if (tagsContainer.children.length > 0) {
      content.appendChild(tagsContainer);
    }
  }

  inner.appendChild(content);

  // Actions section
  const actions = document.createElement("div");
  actions.className = "aikb-search-card__actions";

  // "See more" button
  const button = document.createElement("a");
  button.href = result.liveUrl;
  button.className = "ntgc-btn ntgc-btn--secondary";

  const buttonText = document.createElement("span");
  buttonText.textContent = "See more";
  button.appendChild(buttonText);

  const icon = document.createElement("span");
  icon.className = "fal fa-long-arrow-right";
  icon.setAttribute("aria-hidden", "true");
  button.appendChild(icon);

  actions.appendChild(button);

  // Metadata section
  const metadata = document.createElement("div");
  metadata.className = "aikb-search-card__metadata";

  // "Good for" row (roles from JSON payload)
  const roles =
    result.listMetadata && result.listMetadata["Roles"]
      ? result.listMetadata["Roles"]
      : [];
  if (roles && roles.length > 0) {
    const usefulRow = document.createElement("div");
    usefulRow.className = "aikb-search-card__useful-for";

    const value = document.createElement("span");
    value.className = "aikb-search-card__useful-value";

    const label = document.createElement("strong");
    label.textContent = "Good for: ";
    value.appendChild(label);

    const rolesText = roles.join(", ");

    // Apply highlighting if matched terms exist
    if (result._matchedTerms && result._matchedTerms.length > 0) {
      const highlightedRoles = highlightMatches(
        rolesText,
        result._matchedTerms,
      );
      const tempSpan = document.createElement("span");
      setHighlightedHTML(tempSpan, highlightedRoles);
      // Append all child nodes from the temp span
      Array.from(tempSpan.childNodes).forEach((node) => {
        value.appendChild(node);
      });
    } else {
      const text = document.createTextNode(rolesText);
      value.appendChild(text);
    }

    usefulRow.appendChild(value);

    metadata.appendChild(usefulRow);
  }

  // Last updated date
  if (result.date) {
    const dateEl = document.createElement("div");
    dateEl.className = "aikb-search-card__date";
    dateEl.textContent = `Last updated: ${formatDate(result.date)}`;
    metadata.appendChild(dateEl);
  }

  actions.appendChild(metadata);
  inner.appendChild(actions);

  card.appendChild(inner);

  return card;
}

/**
 * Render search results to the container
 * @param {Array<Object>} results - Array of result objects
 * @param {string} containerId - ID of the container element (default: "search-results-list")
 * @param {boolean} usePagination - Whether to use pagination (default: true)
 */
export function renderResults(
  results,
  containerId = "search-results-list",
  usePagination = true,
) {
  console.log(
    `renderResults called with ${results.length} results for container #${containerId}`,
  );

  // Try multiple selection methods
  let container = document.getElementById(containerId);
  console.log(`document.getElementById("${containerId}"):`, container);

  if (!container) {
    // Try jQuery selector as fallback
    const $container = window.$ ? window.$(`#${containerId}`) : null;
    console.log(`jQuery selector $("#${containerId}"):`, $container);
    container = $container && $container.length > 0 ? $container[0] : null;
  }

  if (!container) {
    console.error(`Container #${containerId} not found`);
    console.log(
      "Available elements with id:",
      Array.from(document.querySelectorAll("[id]")).map((el) => el.id),
    );
    return;
  }

  // Clear existing content
  container.innerHTML = "";

  if (results.length === 0) {
    const noResults = document.createElement("p");
    noResults.textContent = "No results found.";
    noResults.style.padding = "24px 48px";
    container.appendChild(noResults);
    return;
  }

  // Initialize or update pagination
  if (usePagination) {
    // Dynamic import to avoid circular dependencies
    import("./pagination.js").then(
      ({ initializePagination, getCurrentPageResults }) => {
        initializePagination(results, 10);
        const pageResults = getCurrentPageResults();

        // Render cards for current page
        const cards = pageResults
          .map((result) => createSearchCard(result))
          .filter((card) => card !== null);

        cards.forEach((card) => container.appendChild(card));
        console.log(
          `Rendered ${cards.length} of ${results.length} search result cards (page 1)`,
        );
      },
    );
  } else {
    // Render all cards without pagination
    const cards = results
      .map((result) => createSearchCard(result))
      .filter((card) => card !== null);

    cards.forEach((card) => container.appendChild(card));
    console.log(`Rendered ${cards.length} search result cards`);
  }
}

// Expose globally for legacy usage
window.aikbRenderResults = renderResults;

// Track if pagination listener has been added to prevent duplicates
let paginationListenerAdded = false;

// Listen for pagination page changes
if (!paginationListenerAdded) {
  document.addEventListener("aikb-pagination-change", (event) => {
    const { results } = event.detail;
    const container = document.getElementById("search-results-list");

    if (container && results) {
      container.innerHTML = "";

      const cards = results
        .map((result) => createSearchCard(result))
        .filter((card) => card !== null);

      cards.forEach((card) => container.appendChild(card));
      console.log(
        `Rendered ${cards.length} cards for page ${event.detail.page}`,
      );
    }
  });
  paginationListenerAdded = true;
}

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
 * Create a search result card DOM element
 * @param {Object} result - Result data object
 * @param {string} result.title - Card title
 * @param {string} result.summary - Card summary/description
 * @param {Object} result.listMetadata - Metadata object
 * @param {Array<string>} result.listMetadata.keyword - Array of keywords [category, usefulFor]
 * @param {string} result.date - Submission date
 * @param {string} result.liveUrl - URL for "See more" button
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

  // Create inner wrapper
  const inner = document.createElement("div");
  inner.className = "aikb-search-card__inner";

  // Create content section
  const content = document.createElement("div");
  content.className = "aikb-search-card__content";

  // Text section
  const textSection = document.createElement("div");
  textSection.className = "aikb-search-card__text";

  // Title
  const title = document.createElement("h3");
  title.className = "aikb-search-card__title";
  title.textContent = result.title;
  textSection.appendChild(title);

  // Summary
  const summary = document.createElement("p");
  summary.className = "aikb-search-card__summary";
  summary.textContent = result.summary;
  textSection.appendChild(summary);

  content.appendChild(textSection);

  // Tags section (split comma-separated categories into individual tags)
  const category =
    result.listMetadata && result.listMetadata.keyword
      ? result.listMetadata.keyword[0]
      : null;
  if (category) {
    const tagsContainer = document.createElement("div");
    tagsContainer.className = "aikb-search-card__tags";

    // Split by comma to create multiple tags if needed
    const categories = category.split(",");
    categories.forEach((cat) => {
      const trimmedCat = cat.trim();
      if (trimmedCat) {
        const tag = document.createElement("div");
        tag.className = "aikb-search-card__tag";
        tag.textContent = trimmedCat;
        tagsContainer.appendChild(tag);
      }
    });

    content.appendChild(tagsContainer);
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

  // "Useful for" row (only if keyword[1] exists)
  const usefulFor =
    result.listMetadata && result.listMetadata.keyword
      ? result.listMetadata.keyword[1]
      : null;
  if (usefulFor) {
    const usefulRow = document.createElement("div");
    usefulRow.className = "aikb-search-card__useful-for";

    const label = document.createElement("span");
    label.className = "aikb-search-card__useful-label";
    label.textContent = "Useful for: ";
    usefulRow.appendChild(label);

    const value = document.createElement("span");
    value.className = "aikb-search-card__useful-value";
    value.textContent = usefulFor;
    usefulRow.appendChild(value);

    metadata.appendChild(usefulRow);
  }

  // Submitted date
  if (result.date) {
    const dateEl = document.createElement("div");
    dateEl.className = "aikb-search-card__date";
    dateEl.textContent = `Submitted: ${formatDate(result.date)}`;
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
 */
export function renderResults(results, containerId = "search-results-list") {
  console.log(
    `renderResults called with ${results.length} results for container #${containerId}`
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
      Array.from(document.querySelectorAll("[id]")).map((el) => el.id)
    );
    return;
  }

  // Clear existing content
  container.innerHTML = "";

  // Filter and render valid cards
  const cards = results
    .map((result) => createSearchCard(result))
    .filter((card) => card !== null);

  if (cards.length === 0) {
    const noResults = document.createElement("p");
    noResults.textContent = "No results found.";
    noResults.style.padding = "24px 48px";
    container.appendChild(noResults);
    return;
  }

  cards.forEach((card) => container.appendChild(card));

  console.log(`Rendered ${cards.length} search result cards`);
}

// Expose globally for legacy usage
window.aikbRenderResults = renderResults;

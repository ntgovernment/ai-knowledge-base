/**
 * Callout Component JavaScript
 *
 * Optional initialization for dynamic callout functionality.
 * Currently static, but can be extended for interactive features.
 */

/**
 * Initialize callout components
 * Scans for callout elements and applies any necessary enhancements
 */
export function initializeCallouts() {
  const callouts = document.querySelectorAll(".aikb-callout");

  if (callouts.length === 0) {
    return;
  }

  // Log for debugging (can be removed in production)
  console.log(`[Callout] Initialized ${callouts.length} callout(s)`);

  // Future enhancements can be added here:
  // - Dismiss functionality
  // - Collapse/expand
  // - Animation on scroll
  // - Analytics tracking
}

/**
 * Create a callout element programmatically
 * @param {Object} config - Callout configuration
 * @param {string} [config.heading] - Optional heading text
 * @param {string} config.content - Content text (required)
 * @param {HTMLElement} [config.container] - Container to append to (optional)
 * @returns {HTMLElement} The created callout element
 */
export function createCallout({ heading, content, container }) {
  if (!content) {
    console.error("[Callout] Content is required");
    return null;
  }

  const callout = document.createElement("div");
  callout.className = "aikb-callout";

  const calloutContent = document.createElement("div");
  calloutContent.className = "aikb-callout__content";

  const textContainer = document.createElement("div");
  textContainer.className = "aikb-callout__text-container";

  // Add heading if provided
  if (heading) {
    const headingEl = document.createElement("div");
    headingEl.className = "aikb-callout__heading";
    headingEl.textContent = heading;
    textContainer.appendChild(headingEl);
  }

  // Add content
  const contentEl = document.createElement("div");
  contentEl.className = "aikb-callout__text";
  contentEl.innerHTML = content; // Allows HTML in content
  textContainer.appendChild(contentEl);

  calloutContent.appendChild(textContainer);
  callout.appendChild(calloutContent);

  // Append to container if provided
  if (container) {
    container.appendChild(callout);
  }

  return callout;
}

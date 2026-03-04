/**
 * Callout DXP Component - Main Entry Point
 *
 * Server-side rendering function for the Callout component.
 * Renders HTML markup compatible with the aikb-callout CSS classes.
 */

/**
 * Escape HTML to prevent XSS
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeHtml(str) {
  if (typeof str !== "string") return "";

  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };

  return str.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Main rendering function for Callout component
 * @param {Object} input - Component input from DXP
 * @param {string} [input.heading] - Optional heading text
 * @param {string} input.content - Content text (required)
 * @returns {Promise<string>} HTML markup
 */
const main = async (input) => {
  const { heading = "", content = "" } = input || {};

  // Validate required content
  if (!content) {
    return `
      <div class="aikb-callout" style="border-left-color: red;">
        <div class="aikb-callout__content">
          <div class="aikb-callout__text-container">
            <div class="aikb-callout__heading">Configuration Error</div>
            <div class="aikb-callout__text">Callout content is required.</div>
          </div>
        </div>
      </div>
    `;
  }

  // Build heading markup if provided
  const headingHtml = heading
    ? `<div class="aikb-callout__heading">${escapeHtml(heading)}</div>`
    : "";

  // Build callout markup
  // Note: content is FormattedText (HTML), so we don't escape it
  return `
<div class="aikb-callout">
  <div class="aikb-callout__content">
    <div class="aikb-callout__text-container">
      ${headingHtml}
      <div class="aikb-callout__text">${content}</div>
    </div>
  </div>
</div>
  `.trim();
};

export default { main };

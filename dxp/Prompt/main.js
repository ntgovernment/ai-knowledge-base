/**
 * Prompt DXP Component - Main Entry Point
 *
 * Renders prompt content as text inside a <pre> block with Prompt-specific
 * styling classes. Copy button functionality is provided by copy-to-clipboard.js.
 */

/**
 * Escape HTML to prevent XSS when injecting text into markup.
 * @param {string} str - String to escape.
 * @returns {string} Escaped string.
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
 * Decode a limited set of HTML entities commonly produced by WYSIWYG editors.
 * @param {string} str - Entity encoded text.
 * @returns {string} Decoded text.
 */
function decodeEntities(str) {
  if (typeof str !== "string") return "";

  return str
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0*39;/gi, "'");
}

/**
 * Convert FormattedText HTML to readable plain text for preformatted output.
 * @param {string} html - FormattedText input from DXP.
 * @returns {string} Plain text representation.
 */
function formattedTextToPlain(html) {
  if (typeof html !== "string") return "";

  return decodeEntities(
    html
      .replace(/\r\n?/g, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>|<\/div>|<\/h[1-6]>/gi, "\n")
      .replace(/<li\b[^>]*>/gi, "- ")
      .replace(/<\/li>/gi, "\n")
      .replace(/<[^>]+>/g, ""),
  )
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Main rendering function for Prompt component.
 * @param {Object} input - Component input from DXP.
 * @param {string} [input.heading] - Optional prompt heading.
 * @param {string} input.content - Required prompt content (FormattedText).
 * @returns {Promise<string>} HTML markup.
 */
const main = async (input) => {
  const { heading = "", content = "" } = input || {};

  if (!content) {
    return `
<div class="aikb-prompt">
  <div class="aikb-prompt__wrapper" style="outline-color: red;">
    <h3 class="aikb-prompt__heading">Configuration Error</h3>
    <pre class="aikb-prompt__pre">Prompt content is required.</pre>
  </div>
</div>
    `.trim();
  }

  const headingHtml = heading
    ? `<h3 class="aikb-prompt__heading">${escapeHtml(heading)}</h3>`
    : "";

  const promptText = formattedTextToPlain(content);
  const promptTextHtml = escapeHtml(promptText || " ");

  return `
<div class="aikb-prompt">
  <div class="aikb-prompt__wrapper">
    ${headingHtml}
    <pre class="aikb-prompt__pre">${promptTextHtml}</pre>
  </div>
</div>
  `.trim();
};

export default { main };

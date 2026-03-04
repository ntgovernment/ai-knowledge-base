# Prompt DXP Component

Prompt component for Squiz DXP deployment. Renders content as a standard `<pre>` block so pages that already load the AIKB content-page assets display the same pre styling and copy-to-clipboard button.

## Component Details

- **Namespace**: `ntg-aikb`
- **Name**: `prompt`
- **Type**: `edge` (server-side rendering)
- **Version**: `1.0.0`
- **Status**: Production (deployed March 2026)

## Production Usage

Currently in use on:

- [Improve your emails before you send them](https://ntgcentral-dev.nt.gov.au/services-and-support/ict-services-websites/artificial-intelligence/ai-knowledge-base/articles/improve-your-emails-before-you-send-them) - AI Knowledge Base article

## Usage

### In Squiz Matrix

Add the component to a page and configure via DXP.

**Input Properties:**

- `heading` (optional, string): Optional heading shown above the pre block
- `content` (required, FormattedText): Prompt text from WYSIWYG editor

FormattedText input is normalized to plain text before rendering into `<pre>`.

**Example (from production):**

```json
{
  "heading": "",
  "content": "<p>Draft a meeting invite that is professional in tone and states in plain language:</p><br><br><p>- The meeting contains sensitive information and AI assistants/Copilot are not permitted.</p><p>- A short rationale for the meeting 'insert a description of your meeting' for Copilot.</p><p>- A reminder that transcription and recording has been disabled.</p>"
}
```

**Additional example:**

```json
{
  "heading": "Prompt",
  "content": "<p>You are an assistant that summarises policy documents.</p><p>Output:</p><ul><li>3 key points</li><li>2 risks</li></ul>"
}
```

### HTML Output

The component renders the following structure:

```html
<div class="aikb-prompt">
  <div class="aikb-prompt__wrapper">
    <h3 class="aikb-prompt__heading">Prompt</h3>
    <pre class="aikb-prompt__pre">
You are an assistant that summarises policy documents.
Output:
- 3 key points
- 2 risks</pre
    >
  </div>
</div>
```

## Styling And Copy Button Behavior

This component uses Prompt-specific CSS classes and relies on copy-to-clipboard functionality.

Required dependencies:

- `src/css/copy-to-clipboard.css` (for copy button styling)
- `src/js/copy-to-clipboard.js` (for copy button functionality)

Required Prompt-specific styling (must be added to page CSS):

```css
.aikb-prompt__wrapper {
  width: 100%;
  padding: 24px;
  background: #f5f5f5;
  overflow: hidden;
  outline: 1px solid #afb5bf;
  outline-offset: -1px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;
  display: inline-flex;
}

.aikb-prompt__wrapper > * {
  align-self: stretch;
}

.aikb-prompt__heading {
  color: #102040;
  font-family:
    Roboto,
    system-ui,
    -apple-system,
    "Segoe UI",
    "Helvetica Neue",
    Arial,
    sans-serif;
  font-weight: 700;
  line-height: 24px;
  margin: 0 0 8px 0;
  word-wrap: break-word;
}

.aikb-prompt__pre {
  color: #384560;
  font-size: 16px;
  font-family:
    Roboto,
    system-ui,
    -apple-system,
    "Segoe UI",
    "Helvetica Neue",
    Arial,
    sans-serif;
  font-weight: 400;
  line-height: 24px;
  margin: 0;
  padding: 1.25rem 0 0 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  background: none;
  border: none;
  box-shadow: none;
}
```

Runtime behavior:

1. Prompt renders with its own `.aikb-prompt__wrapper` class (independent of generic pre blocks)
2. `copy-to-clipboard.js` wraps each `<pre>` in `.copy-pre-btn-wrapper`
3. A copy button (`.copy-pre-btn`) is appended in the wrapper top-right corner
4. Clipboard copy uses `navigator.clipboard` when available and falls back to `document.execCommand("copy")`
5. Button state changes to `Copied` for ~1.6s (`.is-copied`) then reverts to `Copy`

### Styling Notes

- Wrapper: `.aikb-prompt__wrapper` (Prompt-specific, must be added to page CSS)
- Heading: `.aikb-prompt__heading` (optional, Prompt-specific)
- Pre block: `.aikb-prompt__pre` (Prompt-specific)
- Copy wrapper: `.copy-pre-btn-wrapper` (added by `copy-to-clipboard.js`)
- Button: `.copy-pre-btn` and `.copy-pre-btn.is-copied` (`src/css/copy-to-clipboard.css`)
- Pre text wrapping: `white-space: pre-wrap` and `word-wrap: break-word`

### Rendering Notes

- `main.js` converts FormattedText HTML to plain text before rendering into `<pre>`.
- Heading is escaped before output.
- Prompt body text is escaped after normalization to prevent HTML injection.
- Missing content renders a visible configuration error block.

## Accessibility

- Uses semantic heading and preformatted text structure
- Inherits existing copy button labels and keyboard behavior from shared script
- Keeps prompt text as plain text to avoid hidden markup in copied content

## Troubleshooting

### Copy button not visible

Check that both `src/css/copy-to-clipboard.css` and `src/js/copy-to-clipboard.js` are loaded on the page.

### Prompt styling is missing or incorrect

Ensure the Prompt-specific CSS (`.aikb-prompt__wrapper`, `.aikb-prompt__heading`, `.aikb-prompt__pre`) is added to your page stylesheet and that output contains `.aikb-prompt__wrapper`.

### Copied text includes unexpected spacing

Review FormattedText source HTML and normalization rules in `dxp/Prompt/main.js` (`formattedTextToPlain`).

## Testing Checklist

1. Render with heading and verify heading appears above `<pre>`.
2. Render without heading and verify `<pre>` remains styled.
3. Click copy and verify text is copied and button switches to `Copied` then resets.
4. Test long lines and confirm wrapping/no horizontal overflow issues.
5. Test rich FormattedText input (`<p>`, `<ul>`, `<li>`) and verify normalized output in `<pre>`.

## Files

- `manifest.json` - DXP component metadata
- `main.js` - Server-side rendering function
- `preview.html` - Local preview wrapper
- `README.md` - This file

## Version History

- **1.0.0** (2026-03-05): Initial release and production deployment
  - Added Prompt component with `FormattedText` input
  - Normalized rich text to plain text in `<pre>` output
  - Reused existing AIKB pre styling and copy-button pipeline
  - Deployed to NTG Central AI Knowledge Base articles

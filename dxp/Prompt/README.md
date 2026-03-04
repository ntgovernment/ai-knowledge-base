# Prompt DXP Component

Prompt component for Squiz DXP deployment. Renders content as a standard `<pre>` block so pages that already load the AIKB content-page assets display the same pre styling and copy-to-clipboard button.

## Component Details

- **Namespace**: `ntg-aikb`
- **Name**: `prompt`
- **Type**: `edge` (server-side rendering)
- **Version**: `1.0.0`

## Usage

### In Squiz Matrix

Add the component to a page and configure via DXP.

**Input Properties:**

- `heading` (optional, string): Optional heading shown above the pre block
- `content` (required, FormattedText): Prompt text from WYSIWYG editor

FormattedText input is normalized to plain text before rendering into `<pre>`.

**Example:**

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
  <div class="aikb-pre-block">
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

This component intentionally relies on existing content-page assets.

Required dependencies:

- `src/css/aikb-pre-block.css`
- `src/css/copy-to-clipboard.css`
- `src/js/wrap-pre-blocks.js`
- `src/js/copy-to-clipboard.js`

Runtime behavior:

1. Prompt already renders inside `.aikb-pre-block` (shared pre visual style)
2. `copy-to-clipboard.js` wraps each `<pre>` in `.copy-pre-btn-wrapper`
3. A copy button (`.copy-pre-btn`) is appended in the wrapper top-right corner
4. Clipboard copy uses `navigator.clipboard` when available and falls back to `document.execCommand("copy")`
5. Button state changes to `Copied` for ~1.6s (`.is-copied`) then reverts to `Copy`

This keeps Prompt output visually and behaviorally aligned with existing pre blocks.

### Styling Notes

- Wrapper: `.aikb-pre-block` (`src/css/aikb-pre-block.css`)
- Copy wrapper: `.copy-pre-btn-wrapper` (`src/css/aikb-pre-block.css`)
- Button: `.copy-pre-btn` and `.copy-pre-btn.is-copied` (`src/css/copy-to-clipboard.css`)
- Pre text wrapping: `white-space: pre-wrap` and `word-wrap: break-word` (`src/css/copy-to-clipboard.css`)

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

### Prompt does not match pre styling

Check that `src/css/aikb-pre-block.css` is loaded and that output contains `.aikb-pre-block`.

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

- **1.0.0** (2026-03-05): Initial release
  - Added Prompt component with `FormattedText` input
  - Normalized rich text to plain text in `<pre>` output
  - Reused existing AIKB pre styling and copy-button pipeline

# Callout DXP Component

Informational callout component for Squiz DXP deployment. Displays important information with a distinct 8px left border for visual emphasis.

## Component Details

- **Namespace**: `ntg-aikb`
- **Name**: `callout`
- **Type**: `edge` (server-side rendering)
- **Version**: `1.0.1`

## Usage

### In Squiz Matrix

Add the component to a page and configure via DXP:

**Input Properties:**

- `heading` (optional, string): Callout heading (3-7 words recommended)
- `content` (required, FormattedText): Main callout content with rich HTML formatting support

**Example:**

```json
{
  "heading": "Important Notice",
  "content": "<p>This information is <strong>critical</strong> for understanding the process.</p><ul><li>Item 1</li><li>Item 2</li></ul>"
}
```

### HTML Output

The component renders the following structure:

```html
<div class="aikb-callout">
  <div class="aikb-callout__content">
    <div class="aikb-callout__text-container">
      <div class="aikb-callout__heading">Important Notice</div>
      <div class="aikb-callout__text">This information is critical...</div>
    </div>
  </div>
</div>
```

## Styling

Requires `src/css/callout.css` to be included in the page. The CSS defines:

- **Border**: 8px solid #1f1f5f (NTG Central dark blue)
- **Background**: White (#ffffff)
- **Padding**: 24px
- **Text Color**: #1f1e27 (dark)
- **Typography**: H3-sized heading (24px/700), body text (16px/400)

**CSS Custom Properties:**

- `--aikb-callout-border-color`: Border color
- `--aikb-callout-border-width`: Border width (8px)
- `--aikb-callout-padding`: Inner padding (24px)
- `--aikb-callout-gap-sm`: Small gap (8px)
- `--aikb-callout-gap-md`: Medium gap (16px)

## Previews

Three preview variants are defined in `manifest.json`:

1. **default**: Standard callout with heading and content
2. **without-heading**: Content-only callout
3. **long-content**: Demonstrates text wrapping with extensive content

View previews by opening `preview.html` in a browser.

## Accessibility

- WCAG AAA compliant color contrast (7:1 ratio)
- Semantic HTML structure
- Responsive text wrapping with `word-wrap: break-word`
- Mobile-optimized with reduced padding on small screens

## Best Practices

1. **Keep headings concise** (3-7 words)
2. **Use for non-urgent information** (tips, notices, highlights)
3. **Place near related content** being clarified
4. For urgent messages, use a Notification component instead

## Dependencies

- **CSS**: `src/css/callout.css` (must be loaded in page)
- **JavaScript**: None (static component)
- **Themes**: NTG Central compatible

## Files

- `manifest.json` - DXP component metadata (validated against schemas)
- `main.js` - Server-side rendering function
- `preview.html` - Local preview page
- `README.md` - This file

## Deployment

1. Validate `manifest.json` against `schemas/component-manifest.schema.json`
2. Deploy to Squiz DXP Component Services
3. Ensure `callout.css` is included in target pages
4. Configure component properties in Matrix interface

## Version History

- **1.0.1** (2026-03-05): FormattedText support
  - Changed `content` property from `string` to `FormattedText`
  - Added WYSIWYG HTML editor support for rich content
  - Content now accepts formatted HTML without escaping
  - Updated preview wrapper configuration

- **1.0.0** (2026-03-04): Initial release
  - Server-side rendering support
  - NTG Central theme compatibility
  - Accessibility compliant
  - Three preview variants

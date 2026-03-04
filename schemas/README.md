# Squiz DXP Component Schemas

This directory contains JSON Schema files for building Squiz DXP components compatible with the NT Government platform.

## Schema Files

### component-manifest.schema.json

Defines the structure of a DXP component manifest. This includes:

- Component metadata (name, namespace, version, description)
- Function definitions (entry points, input/output schemas)
- Static file references (CSS, JavaScript)
- Preview configurations
- Environment variables

**Required properties:**

- `$schema`: Schema version URI
- `namespace`: Component namespace (kebab-case, e.g., "ntg-aikb")
- `name`: Component name (kebab-case, e.g., "callout")
- `displayName`: Human-readable name
- `description`: Component description
- `version`: Semver version (e.g., "1.0.0")
- `mainFunction`: Name of the main entry function
- `functions`: Array of component functions

### component-icons.schema.json

Validates component icons for the DXP interface. Includes:

- 180+ curated Font Awesome icon names (without 'fa-' prefix)
- Color options (hex or predefined enum: gray, blue, green, orange, red, purple, teal, yellow, pink)

Icons are rendered as `fa-light fa-{id}` in the NT Gov Design System.

### component-input.schema.json

Defines the input schema for component functions. Extends `content-meta.schema.json` and enforces:

- Input type must be "object"
- Additional properties default to false

Supports custom types: FormattedText, SquizImage, SquizLink

### content-meta.schema.json

Core meta-schema providing validation patterns for:

- Standard JSON Schema draft-07 properties
- Custom types: FormattedText, SquizImage, SquizLink
- Matrix asset type enumerations
- Format validators (matrix-asset-uri, multi-line, phone, etc.)

## Usage

### Validating a Manifest

Use a JSON Schema validator to check your `manifest.json` against `component-manifest.schema.json`:

```json
{
  "$schema": "./schemas/component-manifest.schema.json",
  "namespace": "ntg-aikb",
  "name": "callout",
  "displayName": "Callout",
  "description": "Informational callout component with visual emphasis",
  "version": "1.0.0",
  "type": "edge",
  "mainFunction": "main",
  "icon": {
    "id": "lightbulb",
    "color": {
      "type": "enum",
      "value": "orange"
    }
  },
  "functions": [
    {
      "name": "main",
      "entry": "main.js",
      "input": {
        "type": "object",
        "properties": {
          "heading": {
            "type": "string",
            "description": "Optional callout heading"
          },
          "content": {
            "type": "FormattedText",
            "description": "Callout content (required)"
          }
        },
        "required": ["content"]
      },
      "output": {
        "responseType": "html"
      }
    }
  ]
}
```

## References

Based on patterns from:

- [webdesignsystem.nt.gov.au](https://github.com/ntg/webdesignsystem.nt.gov.au) - NT Gov WDS component schemas
- Squiz DXP Component Services documentation
- JSON Schema draft-07 specification

## Naming Conventions

- **Namespace**: Lowercase with hyphens (e.g., "ntg-aikb", "web-design-system")
- **Component name**: Lowercase with hyphens (e.g., "callout", "page-card")
- **Function names**: Lowercase with underscores/hyphens (e.g., "main", "preview_default")

## Type Support

### Standard Types

- `string`, `number`, `integer`, `boolean`, `array`, `object`, `null`

### Custom DXP Types

- **FormattedText**: Rich text content from WYSIWYG editors
- **SquizImage**: Matrix image asset reference
- **SquizLink**: Matrix link/asset reference

### Format Validators

- `matrix-asset-uri`: Matrix asset URI format
- `multi-line`: Multi-line text
- `phone`: Phone number
- Standard formats: `date-time`, `email`, `uri`, `uuid`, etc.

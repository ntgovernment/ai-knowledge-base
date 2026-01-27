# AI Knowledge Base – NTG Central

A searchable knowledge base for NT Government staff to discover practical AI applications and use cases.

## What is it?

This project provides fast, client-side search and filtering for AI use cases across NTG work areas. All search functionality runs in the browser—no server-side processing required.

## Key Features

- **Instant search** with multi-word support and partial matching
- **Smart relevance scoring** using term frequency analysis
- **Highlighted results** showing matched terms
- **Multi-select filtering** by work area
- **Dynamic sorting** by relevance, date, or title
- **Offline capability** using cached local data
- **Responsive design** for desktop and mobile

## Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Build the project:**

   ```bash
   npm run build
   ```

3. **Start a local server:**

   ```bash
   npx http-server -p 8000
   ```

4. **Open the main HTML file** in your browser

## Project Structure

```
ai-knowledge-base/
├── src/
│   ├── js/              # JavaScript modules
│   ├── css/             # Stylesheets
│   └── data/            # Local search data
├── dist/                # Built assets
├── DOCUMENTATION/       # Detailed technical docs
├── AGENTS.md           # AI agent guidelines
└── COPILOT_INSTRUCTIONS.md  # Copilot usage tips
```

## Development Workflow

1. **Edit source files** in `src/js/` or `src/css/`
2. **Run build:** `npm run build`
3. **Refresh browser** to see changes

For detailed technical documentation, see the [DOCUMENTATION](DOCUMENTATION/) folder.

## AI Agent Support

This project supports AI-assisted development. See:

- [COPILOT_INSTRUCTIONS.md](COPILOT_INSTRUCTIONS.md) for prompt engineering tips
- [AGENTS.md](AGENTS.md) for agent collaboration guidelines

## Browser Support

Modern browsers with ES6 support:

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

**Build fails:**

```bash
npm install
npm run build
```

**No results display:**

- Check browser console (F12) for errors
- Verify local server is running
- Check `src/data/search.json` exists

**Styles not updating:**

```bash
npm run build
# Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
```

For more help, see [DOCUMENTATION/08-DEVELOPER-GUIDE.md](DOCUMENTATION/08-DEVELOPER-GUIDE.md)

## Support

- **Documentation:** `/DOCUMENTATION/` folder
- **Console errors:** Press F12 in browser
- **Build issues:** Check `package.json` scripts

---

**Version:** 1.2.0  
**Last Updated:** January 27, 2026  
**License:** MIT

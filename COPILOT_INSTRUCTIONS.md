# Copilot & AI Coding Agent Instructions

## Project Overview

This codebase powers the NTG Central AI Knowledge Base. It uses vanilla JS, modular CSS, and a clear separation of UI, data, and logic. All code should be readable, maintainable, and accessible.

## Prompt Engineering & Usage Tips

- **Be explicit:** State the feature, bug, or refactor you want. Example: "Add pagination to search results, 10 per page."
- **Reference files/symbols:** Mention filenames, functions, or CSS classes to target. Example: "Update `search-card-template.js` to use `last-updated` instead of `date-published`."
- **Multi-step tasks:** Break down large requests. Use a todo list or numbered steps for clarity.
- **UI/CSS:** Attach screenshots or describe the desired layout. Specify if you want pixel-perfect or just functional.
- **Testing:** Ask Copilot to run or suggest test commands after code changes.
- **Documentation:** Request doc updates for new features or major changes.

## Code Style & Formatting

- **JS:** Use ES6+ syntax, modular imports, and descriptive variable names. Prefer const/let over var.
- **CSS:** Use BEM-like class names, modular files, and variables for colors/sizes. Avoid inline styles unless necessary.
- **HTML:** Semantic tags, ARIA roles where needed, and accessible labels.
- **Comments:** Use line comments for context, especially around complex logic or workarounds.
- **Commits:** Group related changes. Reference the feature or bug in the commit message.

## Example Prompts

- "Fix the Work area filter so cards and applied filters are in sync."
- "Add a horizontally centered pagination bar below search results."
- "Update applied filters pills to match the attached screenshot."
- "Document the new agent workflow in AGENTS.md."

## Multi-file & Integration Changes

- Specify all affected files.
- Ask Copilot to update imports/exports as needed.
- For UI, ensure CSS is imported in the main bundle.
- For new features, request a README or doc update.

## Reviewing & Validating Changes

- Ask Copilot to run the build/test command after edits.
- Review diffs for unrelated changes.
- Test UI in browser after CSS/JS changes.

## When to Ask for Help

- If Copilot is unsure, ask for clarification or escalate to a human reviewer.
- For ambiguous UI, request a screenshot or design reference.

---

For more agent-specific guidance, see `AGENTS.md`.

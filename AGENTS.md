# Coding Agents & Automation Guide

## What is an Agent?

An agent is an automated coding assistant (like GitHub Copilot, GPT-4, or custom bots) that can read, write, and refactor code, update docs, and collaborate with human developers in this repo.

## Agent Collaboration Patterns

- **Event-driven:** Agents respond to explicit user prompts or triggers (e.g., "Fix filter bug").
- **File-based:** Agents read/write specific files, respecting modular boundaries.
- **Conversational:** Agents may ask clarifying questions, but should act autonomously when possible.

## Expected Behaviors

- **Autonomy:** Complete tasks end-to-end unless blocked or ambiguous.
- **Transparency:** Use todo lists for multi-step work. Mark progress after each step.
- **Minimal Disruption:** Avoid unnecessary changes. Only touch files relevant to the task.
- **Escalation:** If a task is unclear, risky, or blocked, escalate to a human (leave a clear note in the PR or commit).

## Troubleshooting & Common Issues

- **Build errors:** Run the build/test command and report errors with context.
- **UI bugs:** Attach screenshots or describe the issue. Suggest a fix or escalate.
- **Merge conflicts:** Flag for human review if unable to resolve cleanly.
- **Ambiguous requirements:** Ask for clarification or escalate.

## Escalation & Handoff Guidelines

- **When to escalate:**
  - Requirements are unclear or conflicting
  - Task requires business/domain knowledge
  - Security, privacy, or data risks
  - Build/test failures that can't be auto-fixed
- **How to escalate:**
  - Leave a clear comment in the PR or commit
  - Summarize what was done, what is blocked, and what info is needed
  - Tag a human reviewer if possible

## Example Agent Workflows

- **Filtering:** Update filter logic, sync UI, and test with sample data.
- **Pagination:** Add/adjust pagination, update CSS, and verify navigation.
- **UI Update:** Refactor markup, update styles, and check accessibility.
- **Documentation:** Add or update markdown files for new features or workflows.

## Best Practices

- Always read the latest context and file state before editing.
- Prefer small, incremental changes with clear explanations.
- Use the todo list tool for complex or multi-step tasks.
- Document any assumptions or workarounds in code comments or PRs.

---

For prompt and code style tips, see `COPILOT_INSTRUCTIONS.md`.

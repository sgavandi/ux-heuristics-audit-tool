# GitHub Copilot instructions

These instructions apply to all Copilot interactions in this repository.

**Primary context lives in [AGENTS.md](../AGENTS.md).** Read it before making
any change — it applies to Copilot as well as every other AI assistant used on
this project.

## Project one-liner

Mobile-first Vue 3 PWA for UX practitioners running heuristic audits in the
field. Case-study target: **P303 — Mobile Experience**.

## Reading order for context

1. [AGENTS.md](../AGENTS.md) — non-negotiable rules for AI assistants
2. [BRIEF.md](../BRIEF.md) — product brief
3. [PLAN.md](../PLAN.md) — phased build order
4. [src/styles/tokens.css](../src/styles/tokens.css) — design tokens
5. [README.md](../README.md) — stack and scripts
6. [docs/context/](../docs/context/) — deeper notes

## Hard rules (short version)

- **Never hardcode design values.** Reference tokens from `tokens.css`. If a
  token is missing, add it first.
- **Vue 3 `<script setup>` + Composition API only.** No Options API.
- **Custom `Base*` components** for UI primitives. Vuetify is only the app
  shell (`<v-app>`, `<v-main>`).
- **Phosphor Icons** only. **Inter** font only.
- **Pinia** for state, **Vue Router** for routing (lazy imports).
- **WCAG 2.2 AA.** Zero axe-core violations baseline. Visible focus rings.
  Tap targets ≥ 44 × 44 px. `aria-label` on icon-only buttons.
- **Mobile-first.** Design for one-handed portrait use, from 320 px up.
- **Loading, empty, and error states** are required on every data-driven view.
  Reuse `LoadingState`, `EmptyState`, `ErrorState`.
- **Conventional Commits.** Do not rewrite the phased history in `git log`.
- **Do not commit** `.env*`, `.DS_Store`, `dist/`, `.vercel/`, `node_modules/`.

## Code style

- 2-space indentation.
- Single quotes in JS, double quotes in HTML/template attributes.
- Prefer named exports for utilities; default export the Vue component.
- Keep components small; extract composables for reusable logic.
- Write comments only when they add information the code cannot express.

## When suggesting code

- Prefer editing an existing file over creating a new one.
- Match the patterns of neighbouring components.
- Any diff that introduces a raw hex code, a raw `px` value in a component, or
  an inline `rgba()` should be rewritten to use a design token.

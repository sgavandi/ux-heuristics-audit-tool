# AGENTS.md

Machine-readable context for AI coding assistants (Copilot, Claude, Cursor,
Codex, etc.) working on the **UX Heuristics Audit Tool**.

If you are an AI assistant reading this file: treat these instructions as
authoritative for this repository. Read the linked docs before editing.

---

## Read these first

Before making any change, load the following files into context:

1. [BRIEF.md](BRIEF.md) — product brief: users, design language, features.
2. [PLAN.md](PLAN.md) — phased build order and per-phase review checklists.
3. [src/styles/tokens.css](src/styles/tokens.css) — the single source of truth
   for colors, spacing, radii, typography, elevation, and motion.
4. [README.md](README.md) — stack, scripts, project structure, data model.
5. [docs/context/](docs/context/) — deeper design and engineering notes.

---

## What this project is

A mobile-first Vue 3 PWA for UX practitioners and design leaders running
heuristic audits in the field (P303 — Mobile Experience case study).

- **Primary user:** UX researcher / design leader running a live audit on a
  phone during a product review, competitive analysis, or client meeting.
- **Secondary user:** PM / developer reading the generated report.
- **One-handed, mobile-first, portrait orientation.**
- **Look and feel:** "Ambient Gradient & 3D Accent" — soft sky→lavender→blush
  background, pure white 24 px-radius cards, rose→violet accent gradient for
  score rings and CTAs. Never glassmorphism.

---

## Non-negotiable rules

### Design tokens
- **Never hardcode design values.** Every color, spacing, radius, font size,
  shadow, or transition **must** reference a CSS custom property defined in
  [src/styles/tokens.css](src/styles/tokens.css).
- If a needed token does not exist, add it to `tokens.css` first, then use it.
- Spacing is on an 8 px grid (`--space-2` = 8 px, `--space-3` = 16 px, etc.).
  `--space-1` (4 px) is for micro-adjustments only.
- Buttons are pill-shaped (`--radius-button`). Primary cards are 24 px radius
  (`--radius-card`). Nested cards are 16 px (`--radius-card-nested`).

### Accessibility (WCAG 2.2 AA)
- All text/interactive elements must meet **4.5 : 1** contrast on their
  background. Use the `*-strong` variants of severity colors on tinted chips.
- Every interactive element needs a **visible focus ring**.
- Icon-only buttons need an `aria-label`.
- Tap targets are ≥ **44 × 44 px**.
- Do not ship a change that adds axe-core violations. The baseline is **0**
  violations across all routes.

### Framework conventions
- Vue 3 with **`<script setup>` and the Composition API**. No Options API.
- **Pinia** for state (see [src/stores/audits.js](src/stores/audits.js)).
- **Vue Router** for routing (see [src/router/index.js](src/router/index.js)).
  Use lazy imports for pages.
- **Vuetify 3** is used only for the `<v-app>` / `<v-main>` shell. All UI
  primitives are custom `Base*` components in
  [src/components/](src/components/). Do not reach for Vuetify components for
  cards, buttons, inputs, chips, etc.
- **Phosphor Icons** (`@phosphor-icons/vue`) is the only icon library.
- **Inter** is the only font family (`@fontsource/inter`).

### Data layer
- All data flows through
  [src/services/dataService.js](src/services/dataService.js).
- When `VITE_API_BASE_URL` is empty, the service uses the in-memory dataset in
  [src/services/mockData.js](src/services/mockData.js) with simulated latency
  so loading and empty states are exercised in dev.
- Every list view must render its **loading**, **empty**, and **error** state
  explicitly. Reuse [EmptyState.vue](src/components/EmptyState.vue),
  [ErrorState.vue](src/components/ErrorState.vue), and
  [LoadingState.vue](src/components/LoadingState.vue).

### Files never to commit
- `.env`, `.env.local`, `.env.*.local`
- `.DS_Store`, `Thumbs.db`
- `dist/`, `.vite/`, `node_modules/`, `.vercel/`

---

## Repository structure

```
src/
├── assets/        static assets bundled with the app
├── components/    Base* primitives, shared UI, charts
├── composables/   useAudits (Pinia wrappers) etc.
├── layouts/       AppLayout shell (ambient bg + bottom nav)
├── pages/         OverviewPage, NewAuditPage, AuditDetailPage, ...
├── router/        Vue Router config with lazy routes
├── services/      dataService (mock + fetch) + mockData
├── stores/        Pinia stores
├── styles/        tokens.css (design tokens) + global.css
└── utils/         format, scoring
```

Dev-only routes (e.g. `/dev/components`) are gated behind `import.meta.env.DEV`
and must never ship in a production bundle.

---

## Workflow for AI assistants

1. **Understand before editing.** Read the files listed under "Read these
   first" and any file you're changing before proposing edits.
2. **Prefer editing over creating.** Do not create new files unless there is
   no reasonable home for the change in an existing file.
3. **Match existing patterns.** Look at neighbouring components before you
   write new ones. Reuse `Base*` primitives.
4. **Verify tokens.** Any raw hex code, px value, or `rgba()` in a diff is a
   red flag — replace it with a token reference.
5. **Explain design decisions in the commit message**, not in comments in the
   code. Comments should explain what the code cannot show on its own.
6. **Never disable a lint or a11y rule** to make an error go away. Fix the
   underlying issue.

---

## Commit conventions

- Conventional Commits style: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`.
- The phased history in `git log` (`phase 1 — project scaffold`, …) is part of
  the case-study evidence and must not be rewritten.
- Prefer several small commits per session over one large squash.

---

## Definition of done for a change

- [ ] Uses design tokens; no hardcoded colors / spacing / radii / motion.
- [ ] Loading, empty, and error states considered where relevant.
- [ ] Keyboard navigable; visible focus ring on every interactive element.
- [ ] No new axe-core violations (target: 0 across all routes).
- [ ] Works at 320 px width and up.
- [ ] Dev server runs with no console errors or warnings.
- [ ] Commit message follows the conventions above.

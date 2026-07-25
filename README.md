# UX Heuristics Audit Tool

A mobile-first Vue 3 app for running lightweight UX heuristic audits — pick a
framework (e.g. Nielsen's 10), tap through the heuristics, mark each Pass /
Warning / Critical, add notes, and watch the score update live.

## Design

- Ambient sky → lavender → blush gradient background
- Pure-white 24px-radius cards floating over the ambient
- Rose → violet accent gradient for score rings and primary CTAs
- Pill buttons, Inter font, mobile-first 4-tab bottom navigation
- WCAG 2.2 AA compliant (axe-core: 0 violations across all routes)

Full brief: [BRIEF.MD](BRIEF.MD). Build plan: [PLAN.MD](PLAN.MD).

## Stack

- [Vue 3](https://vuejs.org/) (composition API, `<script setup>`)
- [Vite](https://vitejs.dev/)
- [Pinia](https://pinia.vuejs.org/) for state
- [Vue Router](https://router.vuejs.org/) for routing
- [Vuetify 3](https://vuetifyjs.com/) — used only for the `<v-app>`/`<v-main>`
  shell; all UI primitives are custom components styled with CSS design tokens
- [@phosphor-icons/vue](https://phosphoricons.com/) for iconography
- [@fontsource/inter](https://fontsource.org/fonts/inter) for the Inter font

## Getting started

```sh
npm install
npm run dev       # http://localhost:5173
npm run build     # production build to dist/
npm run preview   # preview the built output
```

## Environment

Copy `.env.example` to `.env.local` if you want to point the app at a real
backend:

```sh
cp .env.example .env.local
```

| Variable            | Purpose                                              |
| ------------------- | ---------------------------------------------------- |
| `VITE_API_BASE_URL` | Base URL for the audits API. Leave blank to use the local mock dataset in `src/services/mockData.js`. |

## Project structure

```
src/
├── assets/          # static assets bundled with the app
├── components/      # Base* primitives, shared UI, charts
├── composables/     # useAudits (Pinia wrappers) etc.
├── layouts/         # AppLayout shell
├── pages/           # OverviewPage, AuditDetailPage, etc.
├── router/          # Vue Router config with lazy routes
├── services/        # dataService (mock + fetch) + mockData
├── stores/          # Pinia stores
├── styles/          # tokens.css (design tokens) + global.css
└── utils/           # format, scoring
```

Design tokens live in [src/styles/tokens.css](src/styles/tokens.css) and are
the single source of truth for colors, spacing, radii, typography, and motion.
No component hardcodes design values.

## Data

The app ships with a mock dataset in
[src/services/mockData.js](src/services/mockData.js) including Nielsen's 10
heuristics and a handful of sample audits. All CRUD operations (create audit,
rate heuristic, set status, delete) work against this in-memory store when
`VITE_API_BASE_URL` is empty. Mock latency is ~350ms per read and ~175ms per
write so loading and empty states are exercised in dev.

When `VITE_API_BASE_URL` is set, the same data service functions hit the
configured backend via `fetch` — see
[src/services/dataService.js](src/services/dataService.js) for the expected
routes and payload shapes.

## Development helpers

- `/dev/components` — a component gallery route showing every Base* primitive
  and chart with sample data. Only registered when `import.meta.env.DEV` is
  true, so it is never bundled in production.

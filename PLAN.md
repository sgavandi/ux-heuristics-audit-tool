# Plan

> This document defines the step-by-step build order for the project.
> At the end of each phase, the AI assistant must stop, review for bugs,
> and wait for explicit approval before continuing.

---

## How This Plan Works

- Each phase is broken into small, focused tasks
- After every phase the assistant will:
  1. Review all code written in that phase for bugs and inconsistencies
  2. Cross-check against the project brief
  3. Surface any issues or decisions that need attention
  4. **Wait for your approval before moving to the next phase**
- Do not proceed to the next phase unless explicitly told to continue
- Do not proceed to the next phase until a commit has been made

---

## Phase 1 — Project Scaffold

**Goal:** Get a clean, working base project with nothing unnecessary.

- [ ] Initialise git with `git init`
- [ ] Create and configure `.gitignore` before any other files are created. It must include at minimum:
  ```
  # TypeScript
  *.tsbuildinfo

  # Vite
  dist/
  .vite/

  # Environment variables
  .env
  .env.local
  .env.*.local

  # Editor
  .vscode/
  .idea/

  # OS
  .DS_Store
  Thumbs.db

  # Dependencies
  node_modules/
  ```
- [ ] Initialise Vite + Vue 3 project
- [ ] Install and configure Vuetify 3
- [ ] Install Phosphor Icons for Vue
- [ ] Install and configure Inter font via Fontsource
- [ ] Set up folder structure:
  ```
  src/
  ├── assets/
  ├── components/
  ├── composables/
  ├── layouts/
  ├── pages/
  ├── router/
  ├── stores/
  ├── styles/
  └── utils/
  ```
- [ ] Confirm dev server runs without errors

### Phase 1 Review Checklist
- [ ] Dev server starts cleanly with no console errors or warnings
- [ ] Vuetify 3 is rendering correctly
- [ ] Inter font is loading
- [ ] Phosphor Icons resolve without errors
- [ ] Folder structure matches the plan above
- [ ] No unused dependencies in `package.json`
- [ ] `.gitignore` is present and covers all required entries
- [ ] No unintended files are staged

### Phase 1 Commit
- [ ] Stage all changes: `git add .`
- [ ] Commit: `git commit -m "feat: phase 1 — project scaffold"`

> ⏸️ **STOP — Review complete and commit made. Confirm commit before starting Phase 2.**

---

## Phase 2 — Global Styles and Tokens

**Goal:** Establish the design system foundation before building any components.

- [ ] Create global CSS file with all color tokens from the project brief
- [ ] Define spacing scale using the 8px grid as CSS custom properties
- [ ] Define border radius tokens (`--radius-card`, `--radius-button`, etc.)
- [ ] Define typography scale using Inter with weight-first hierarchy
- [ ] Configure Vuetify theme to use project color tokens
- [ ] Define global transition values (`--transition-default: 300ms ease-in-out`)
- [ ] Confirm tokens are accessible throughout the app

### Phase 2 Review Checklist
- [ ] All color tokens are defined and match the project brief
- [ ] Spacing tokens are multiples of 8px
- [ ] Border radius tokens are applied correctly
- [ ] Typography scale renders correctly in the browser
- [ ] Vuetify theme reflects project colors, not defaults
- [ ] Transition variable is defined and usable
- [ ] No hardcoded values — everything references a token

### Phase 2 Commit
- [ ] Stage all changes: `git add .`
- [ ] Commit: `git commit -m "feat: phase 2 — global styles and tokens"`

> ⏸️ **STOP — Review complete and commit made. Confirm commit before starting Phase 3.**

---

## Phase 3 — Layout and Navigation

**Goal:** Build the shell of the application — the frame everything else sits inside.

- [ ] Build the base layout component (`AppLayout.vue`)
- [ ] Build the navigation component (sidebar or top nav — confirm with brief)
- [ ] Set up Vue Router with placeholder routes
- [ ] Ensure layout is responsive across breakpoints
- [ ] Apply spacing tokens to all layout regions
- [ ] Confirm navigation transitions use the defined timing

### Phase 3 Review Checklist
- [ ] Layout renders correctly at all breakpoints
- [ ] Navigation links route correctly with no 404s
- [ ] Active route state is visually distinct
- [ ] Spacing uses 8px grid tokens throughout
- [ ] Transitions on route changes are smooth and within 250–350ms
- [ ] No layout shift or overflow issues
- [ ] Keyboard navigation works through all nav items

### Phase 3 Commit
- [ ] Stage all changes: `git add .`
- [ ] Commit: `git commit -m "feat: phase 3 — layout and navigation"`

> ⏸️ **STOP — Review complete and commit made. Confirm commit before starting Phase 4.**

---

## Phase 4 — Data Layer

**Goal:** Connect to the data source and confirm data is flowing before building any UI that depends on it.

- [ ] Set up data service file (`src/services/dataService.js`)
- [ ] Configure API connection or load mock dataset (per project brief Data section)
- [ ] Set up Pinia store(s) for data state management
- [ ] Write a composable for fetching and exposing data (`useData.js`)
- [ ] Handle loading, error, and empty states explicitly
- [ ] Log a sample response to confirm data shape is correct
- [ ] Document the key fields being used from the dataset

### Phase 4 Review Checklist
- [ ] API connection or mock data loads without errors
- [ ] Data shape matches what the UI will need
- [ ] Loading state is handled and does not cause layout shift
- [ ] Error state is handled gracefully with a user-facing message
- [ ] Empty state is handled and does not break the UI
- [ ] No API keys or credentials are hardcoded — use `.env`
- [ ] Pinia store updates correctly when data changes

### Phase 4 Commit
- [ ] Confirm `.env` is listed in `.gitignore` and will not be committed
- [ ] Confirm `.env.example` is present and documents all required variables
- [ ] Stage all changes: `git add .`
- [ ] Commit: `git commit -m "feat: phase 4 — data layer"`

> ⏸️ **STOP — Review complete and commit made. Confirm commit before starting Phase 5.**

---

## Phase 5 — Core Components

**Goal:** Build the reusable UI components the application depends on.
Build and review each component individually before moving to the next.

### 5a — Cards
- [ ] Build base card component with `12px` border radius
- [ ] Apply surface color and border tokens
- [ ] Confirm spacing inside card uses 8px grid

### 5b — Buttons
- [ ] Build primary, secondary, and ghost button variants
- [ ] Apply `12px` border radius
- [ ] Confirm hover, focus, and active states are distinct
- [ ] Confirm transitions are within 250–350ms

### 5c — Form Inputs
- [ ] Build text input with `12px` border radius
- [ ] Build select / dropdown component
- [ ] Ensure all inputs have associated labels
- [ ] Confirm focus state meets WCAG 2.2 AA visibility requirements

### 5d — Icons
- [ ] Confirm Phosphor outlined icons are rendering correctly
- [ ] Build a small icon usage example to validate sizing and alignment
- [ ] Confirm no filled icons are used outside of active/selected states

### Phase 5 Review Checklist
- [ ] All components render without console errors
- [ ] All components use design tokens — no hardcoded values
- [ ] Hover, focus, and active states work on all interactive components
- [ ] All form inputs have visible, associated labels
- [ ] Keyboard interaction works on all components
- [ ] Transitions are smooth and within the defined timing range
- [ ] Components are consistent with each other visually

### Phase 5 Commit
- [ ] Stage all changes: `git add .`
- [ ] Commit: `git commit -m "feat: phase 5 — core components"`

> ⏸️ **STOP — Review complete and commit made. Confirm commit before starting Phase 6.**

---

## Phase 6 — Charts and Data Visualisation

**Goal:** Build the data visualisation layer using real or mock data.

- [ ] Install and configure the chosen charting library
- [ ] Build the first chart component using project color tokens
- [ ] Remove all chartjunk (unnecessary gridlines, shadows, 3D effects)
- [ ] Ensure all labels are visible without requiring hover
- [ ] Add a text-based summary or alternative for each chart
- [ ] Confirm charts are responsive across breakpoints
- [ ] Repeat for each additional chart type required

### Phase 6 Review Checklist
- [ ] Charts render correctly with real or mock data
- [ ] Color usage is restrained and uses project tokens only
- [ ] Labels are always visible — not hover-dependent
- [ ] Each chart has a text alternative for accessibility
- [ ] Charts are responsive and do not overflow their containers
- [ ] No console errors from the charting library

### Phase 6 Commit
- [ ] Stage all changes: `git add .`
- [ ] Commit: `git commit -m "feat: phase 6 — charts and data visualisation"`

> ⏸️ **STOP — Review complete and commit made. Confirm commit before starting Phase 7.**

---

## Phase 7 — Pages and Feature Assembly

**Goal:** Assemble components and data into the actual pages of the application.

- [ ] Build each page defined in the project brief one at a time
- [ ] Connect each page to the relevant Pinia store and data composable
- [ ] Apply layout, spacing, and typography tokens throughout
- [ ] Confirm loading, error, and empty states render on every page
- [ ] Confirm all routes resolve correctly

### Phase 7 Review Checklist
- [ ] All pages render without errors
- [ ] Data flows correctly from store to page to component
- [ ] Loading, error, and empty states are present on every page
- [ ] No hardcoded data visible in the UI
- [ ] Spacing and typography are consistent across all pages
- [ ] All routes are reachable and resolve correctly

### Phase 7 Commit
- [ ] Stage all changes: `git add .`
- [ ] Commit: `git commit -m "feat: phase 7 — pages and feature assembly"`

> ⏸️ **STOP — Review complete and commit made. Confirm commit before starting Phase 8.**

---

## Phase 8 — Accessibility Audit

**Goal:** Confirm the application meets WCAG 2.2 AA standards before final review.

- [ ] Run axe DevTools audit on every page and resolve all critical issues
- [ ] Run Lighthouse accessibility audit and resolve all failures
- [ ] Manually test full keyboard navigation through every page
- [ ] Confirm all focus indicators are clearly visible
- [ ] Confirm color is never the sole means of conveying information
- [ ] Confirm all images and icons have `alt` text or `aria-label`
- [ ] Confirm all form inputs have associated labels
- [ ] Confirm contrast ratios meet minimums:
  - Body text: **4.5:1**
  - Large text and UI components: **3:1**

### Phase 8 Review Checklist
- [ ] axe DevTools returns zero critical or serious violations
- [ ] Lighthouse accessibility score is 90 or above
- [ ] Full keyboard navigation works on every page
- [ ] No accessibility issues remain unresolved or undocumented

### Phase 8 Commit
- [ ] Stage all changes: `git add .`
- [ ] Commit: `git commit -m "fix: phase 8 — accessibility audit fixes"`

> ⏸️ **STOP — Review complete and commit made. Confirm commit before starting Phase 9.**

---

## Phase 9 — Final Review and Cleanup

**Goal:** Clean, consistent, production-ready code with no loose ends.

- [ ] Remove all `console.log` statements and debug code
- [ ] Remove all unused components, imports, and dependencies
- [ ] Confirm `.env` variables are documented in `.env.example`
- [ ] Confirm no API keys or secrets are committed to the repository
- [ ] Review all components for consistency against the project brief
- [ ] Confirm the build compiles cleanly with `vite build`
- [ ] Update this plan with any deviations or decisions made during the build

### Phase 9 Review Checklist
- [ ] `vite build` completes with no errors or warnings
- [ ] No dead code, unused imports, or leftover debug statements
- [ ] `.env.example` is present and accurate
- [ ] Codebase is consistent with the project brief
- [ ] All phases of this plan are marked complete

### Phase 9 Commit
- [ ] Stage all changes: `git add .`
- [ ] Commit: `git commit -m "chore: phase 9 — final cleanup"`

> ✅ **Build complete. All phases committed. Ready for handoff or deployment.**

---

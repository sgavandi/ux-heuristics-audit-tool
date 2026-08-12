# Design decisions

A short log of the intentional calls behind the visual and interaction design.
Read this alongside [BRIEF.md](../../BRIEF.md) for the reasoning behind the
build.

## Why "Ambient Gradient & 3D Accent"

Heuristic-audit tooling today is dominated by spreadsheets and stark utility
apps. UX practitioners are our persona — they will judge the tool by its
craft. The ambient gradient (sky → lavender → blush) plus pure-white cards
signals *modern, considered, opinionated* without slipping into
glassmorphism, which the brief explicitly rules out.

## Mobile-first, one-handed

Audits happen in the field — during a product review, a client meeting, or a
competitive walkthrough. The user is holding their phone, not sitting at a
desk. Consequences:

- Bottom navigation, not a top nav or a hamburger.
- Pill buttons and 44 × 44 px minimum tap targets throughout.
- Portrait-first layout; landscape and tablet are "works fine", not primary.
- Primary CTAs anchored near the bottom of the viewport where the thumb sits.

## Card hierarchy

- **Primary card:** 24 px radius, soft drop shadow, generous internal padding.
  Holds the main content of a view.
- **Nested card:** 16 px radius, subtle 1 px border, no shadow. Groups
  related insights (peer benchmarks, category breakdowns) inside a primary
  card.

## Severity language

Ratings are **Pass / Warning / Critical** rather than a numeric scale. This is
the language UX practitioners already use in heuristic evaluations and it
compresses the decision into three tap targets — a better fit for a
mobile-first flow than a 1–5 slider.

Each severity has both a base color (`--color-pass`, `--color-warning`,
`--color-critical`) and a `-strong` variant used for accessible text/borders
on tinted chips. Chips are hand-tuned to ≥ 4.5 : 1 contrast on their tint.

## Score ring

The overall score uses a thick, gradient-filled ring (rose → violet) rather
than a number-in-a-box. It:

- Reads as a "score" from across the room during a review.
- Uses the accent gradient in a way that feels intentional, not decorative.
- Scales cleanly with container queries — see
  [ScoreRing.vue](../../src/components/ScoreRing.vue).

## Why Vue + Vuetify, but custom primitives

Vue 3 with Composition API is compact and readable for a small team. Vuetify
gives us a well-tested `<v-app>` / `<v-main>` shell so we don't reinvent
viewport handling. Everything else is custom because Vuetify's default look
would fight the brief. Result: Vuetify components are limited to the shell;
`Base*` primitives own the UI.

## Why mock data with fake latency

`dataService` simulates ~350 ms reads and ~175 ms writes when
`VITE_API_BASE_URL` is empty. This is deliberate — it forces every list view
to render its loading, empty, and error states in normal development, not
just when a backend is broken.

## What is intentionally *not* in scope

- Native mobile (React Native / Swift / Kotlin). This is a responsive PWA.
- Real authentication. The reviewer version is password-protected at the
  deployment layer.
- Multi-tenant data. One evaluator, many audits.
- Server-side rendering. The value here is a fast, offline-tolerant client
  app, not SEO.

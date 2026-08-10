# Architecture

## Runtime shape

```
┌─────────────────────────────────────────────┐
│  App.vue                                    │
│  └── AppLayout.vue                          │
│      ├── ambient gradient background        │
│      ├── <router-view />                    │
│      │     └── OverviewPage / NewAuditPage  │
│      │        AuditDetailPage / HistoryPage │
│      │        SettingsPage                  │
│      └── AppBottomNav                       │
└─────────────────────────────────────────────┘
```

- [App.vue](../../src/App.vue) mounts `AppLayout` inside Vuetify's `<v-app>`.
- [AppLayout.vue](../../src/layouts/AppLayout.vue) renders the ambient
  gradient, the routed page, and the bottom navigation.
- [AppBottomNav.vue](../../src/components/AppBottomNav.vue) is a four-tab
  bottom bar: Overview · Active Audits · History · Settings.

## State

- Pinia store: [src/stores/audits.js](../../src/stores/audits.js) holds the
  list of audits, the currently-selected audit, and mutation actions.
- Composable: [src/composables/useAudits.js](../../src/composables/useAudits.js)
  wraps the store with reactive loading/error state and a stable public API
  that pages consume. Pages **should not** import the store directly.

## Data flow

```
page ─▶ useAudits() ─▶ audits store ─▶ dataService ─▶ mockData | fetch
                                            ▲
                                            └── VITE_API_BASE_URL toggle
```

- When `VITE_API_BASE_URL` is empty, `dataService` returns cloned records from
  [mockData.js](../../src/services/mockData.js) with simulated latency
  (~350 ms read / ~175 ms write). This is deliberate — the app must exercise
  loading and empty states in dev.
- When set, the same functions issue `fetch` calls against the configured
  base URL. Payload shapes are documented in
  [dataService.js](../../src/services/dataService.js).

## Routing

Defined in [src/router/index.js](../../src/router/index.js). All page
components are lazy-imported. The dev-only `/dev/components` gallery is only
registered when `import.meta.env.DEV` is true and is therefore stripped from
production bundles.

## Design system

- Every design decision lives in
  [src/styles/tokens.css](../../src/styles/tokens.css) as a CSS custom
  property. Components consume tokens; they never define raw values.
- Global resets and body-level ambient gradient live in
  [src/styles/global.css](../../src/styles/global.css).
- Primitives (`BaseButton`, `BaseCard`, `BaseInput`, `BaseSelect`,
  `SeverityBadge`, `ScoreRing`, …) live in
  [src/components/](../../src/components/) and are showcased at
  `/dev/components` in dev.

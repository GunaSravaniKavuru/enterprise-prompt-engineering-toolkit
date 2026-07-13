# Enterprise Prompt Engineering Toolkit — Phase 1 (Frontend Prototype)

A premium, dark-themed React frontend for an AI prompt-engineering SaaS platform.
This is **frontend only**: every page runs on dummy data, there is no backend,
no database, no auth, and no live model calls.

## Stack

- React 19 + Vite
- Tailwind CSS v4
- React Router v7
- Framer Motion (micro-interactions, transitions)
- Recharts (dashboards & analytics)
- React Icons (Feather icon set)
- Axios (installed and stubbed in `src/services/api.js`, not yet wired to anything)

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run build     # production build to dist/
npm run preview   # preview the production build
```

## Design system

- **Palette**: deep indigo base (`#0a0c14`), glass panels, violet → cyan gradient
  as the primary accent, amber/rose/emerald as semantic status colors.
- **Type**: Space Grotesk for display/headings, Inter for body copy, JetBrains
  Mono for prompt text and data.
- **Signature element**: the gradient `QualityRing` (`src/components/common/QualityRing.jsx`)
  — an animated circular score indicator reused across the Dashboard, Prompt
  Builder, Optimizer, Evaluator, and Version History to visually tie the whole
  "prompt quality" concept together.

All color/spacing/font tokens live in `src/index.css` under the Tailwind v4
`@theme` block — change them there to re-theme the whole app.

## Folder structure

```
src/
  assets/            static images/icons
  components/
    common/          Button, Card, Badge, Input, Modal, Toast, Loader,
                      StatCard, MetricCard, QualityRing, Icon
    layout/           Sidebar, Navbar, Footer, DashboardLayout
    prompt/           PromptCard (used in Dashboard + Library)
    charts/           Recharts wrappers (area/bar/line/pie), themed once
  pages/              one file per sidebar route (11 pages)
  data/               dummyData.js — single source of mock data for every page
  hooks/              useTheme.js (dark/light toggle scaffold)
  services/           api.js — Axios instance stub, ready for backend wiring
  App.jsx             route table
  main.jsx            React entry point
  index.css           Tailwind v4 theme tokens + global styles
```

## Pages implemented

Dashboard · Prompt Builder · Prompt Library · Playground · Prompt Optimizer ·
Prompt Evaluator · Multi-model Comparison · Prompt Version History · Analytics
Dashboard · Export / Import · Settings

## Connecting a real backend later

- Replace imports from `src/data/dummyData.js` in each page with calls through
  `src/services/api.js`.
- The Axios instance already reads `VITE_API_BASE_URL` from the environment.
- No page currently performs a network request — every "Run", "Generate",
  "Save", "Optimize", etc. action is simulated with local state and toast
  notifications so the UI/UX can be evaluated in isolation before backend
  integration begins.

This is Phase 1 only. Stopping here per the brief — no FastAPI, no database,
no auth, and no prompt-engineering logic have been added.

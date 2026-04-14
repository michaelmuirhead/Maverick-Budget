# Maverick Budget

A clean, minimal budget tracker inspired by [Fudget](https://fudget.com). Organize your finances with nested folders, track income and expenses with inline editing, and set budget limits with smart alerts.

## Features

- **Nested Folders** — unlimited depth: Folders → Budgets → Sub-budgets → etc.
- **Inline Editing** — tap any transaction to edit it in place, Fudget-style
- **Swipe to Delete** — swipe left on mobile to remove transactions
- **Running Balance** — cumulative balance shown on every transaction row
- **Recurring Transactions** — weekly, bi-weekly, monthly, or yearly auto-entries
- **Budget Limits** — per-category spending limits with progress bars
- **Smart Alerts** — warnings at 80% spend, red alerts when over budget
- **Search & Filter** — find transactions by label or category
- **Rename on Tap** — tap any folder or budget title to rename inline
- **Donut Chart** — visual spending breakdown by category
- **Dark Theme** — mobile-first design

## Quick Start

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000`.

## Project Structure

```
src/
├── App.jsx      # Full application
├── index.css    # Global styles & animations
└── main.jsx     # Entry point
```

## Build

```bash
npm run build
```

Output goes to `dist/`.

## Data

All data persists in `localStorage` under `maverick-budget-data`. The data model uses a recursive node tree with entries attached to leaf nodes.

## License

MIT

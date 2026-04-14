# Maverick Budget

A clean, minimal budget tracker inspired by [Fudget](https://fudget.com). Installable as a PWA with offline support.

## Features

- **Nested Folders** — unlimited depth: Folders → Budgets → Sub-budgets
- **Inline Editing** — tap any transaction to edit in place
- **Date Picker** — choose the actual date for each entry
- **Swipe to Delete** — swipe left on mobile to remove
- **Running Balance** — cumulative balance on every row
- **Recurring Transactions** — weekly, bi-weekly, monthly, yearly auto-entries
- **Budget Limits** — per-category limits with progress bars and alerts
- **Search & Filter** — find transactions by label or category
- **CSV Export/Import** — download or upload transactions
- **Color Picker** — choose custom colors for folders and budgets
- **Drag to Reorder** — rearrange folders and budgets
- **Rename on Tap** — tap any title to rename inline
- **Donut Chart** — visual spending breakdown
- **PWA** — install to home screen, works offline

## Quick Start

```bash
npm install
npm run dev
```

## Install as App

After deploying (e.g. to Vercel or Netlify), open the URL on your phone and tap "Add to Home Screen". The app works offline after first load.

## Build

```bash
npm run build
```

## Project Structure

```
src/
├── App.jsx      # Full application
├── index.css    # Styles & animations
└── main.jsx     # Entry point
public/
├── manifest.json   # PWA manifest
├── sw.js           # Service worker
├── icon-192.png    # App icon
├── icon-512.png    # App icon large
└── favicon.svg
```

## Data

All data in `localStorage` under `maverick-budget-data`. Recursive node tree with entries on leaf nodes.

## License

MIT

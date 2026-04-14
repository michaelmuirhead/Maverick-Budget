# Maverick Budget

A clean, minimal budget tracker with real-time cloud sync via Firebase.

## Features

- **Cloud Sync** — real-time sync via Firebase Firestore, works across devices
- **Authentication** — email/password and Google sign-in
- **Nested Folders** — unlimited depth: Folders → Budgets → Sub-budgets
- **Inline Editing** — tap any transaction to edit in place
- **Date Picker** — choose the actual date for each entry
- **Swipe to Delete** — swipe left on mobile to remove
- **Running Balance** — cumulative balance on every row
- **Recurring Transactions** — weekly, bi-weekly, semi-monthly, monthly, yearly
- **Budget Limits** — per-category limits with progress bars and alerts
- **Tags** — freeform tags on transactions, searchable
- **Search & Filter** — find transactions by label, category, or tag
- **CSV Export/Import** — download or upload transactions
- **Color Picker** — custom colors for folders and budgets
- **Drag to Reorder** — rearrange folders and budgets
- **Archive** — hide old budgets without deleting
- **Monthly Trends** — bar chart at folder level
- **Year-in-Review** — annual summary at folder level
- **Haptic Feedback** — vibration on key actions
- **Pull-to-Refresh** — native-feeling refresh gesture
- **PWA** — install to home screen, works offline

## Quick Start

```bash
npm install
npm run dev
```

## Sharing with Family

To share budgets with your wife/partner, you have two options:

1. **Same account** — both sign in with the same email/password. All data syncs in real time.
2. **Separate accounts** — each person creates their own account. Data is per-user (household sharing coming soon).

## Firebase Setup

The app is pre-configured with Firebase. To use your own project:

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password + Google)
3. Create Firestore Database
4. Update credentials in `src/firebase.js`
5. Deploy Firestore rules from `firestore.rules`

## Build & Deploy

```bash
npm run build    # Build to dist/
```

Deploy to Vercel, Netlify, or Firebase Hosting.

## Project Structure

```
src/
├── App.jsx       # Full application with Firebase sync
├── Auth.jsx      # Login/signup screens
├── firebase.js   # Firebase config & exports
├── index.css     # Styles
└── main.jsx      # Entry point with auth routing
```

## License

MIT

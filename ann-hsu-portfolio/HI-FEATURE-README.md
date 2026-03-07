# "Say Hi" Feature — Setup & Usage

## Overview

Visitors can send a daily "hi" via a minimal chat input. Each hi is counted and displayed on a GitHub-style contribution heatmap. The feature ships with a **local prototype** (localStorage) and an optional **Firebase production** mode.

---

## Local Prototype (default)

Works out of the box — no backend required.

### How it works
- `HiBox` component: single-line input, Enter to send
- Counts stored in `localStorage` under key `hi-counts` (`{ "YYYY-MM-DD": number }`)
- Rate limited: 1 hi per browser per day (tracked via `hi-sent-today` key)
- Cross-tab sync: `storage` event listener updates the heatmap when another tab sends a hi
- Visual feedback: placeholder briefly shows "thanks!" (800ms)

### Run locally
```bash
cd ann-hsu-portfolio
npm install
npm run dev
```

### Test plan
1. Open the site, scroll to the GitHub profile section
2. Type anything in the "say hi" input and press Enter
3. Verify: input clears, placeholder shows "thanks!" briefly, then "see you tomorrow!"
4. Verify: the heatmap shows today's cell colored (navy level 1)
5. Open a second tab — verify the heatmap updates there too
6. Refresh — verify the cell persists and input shows "see you tomorrow!"
7. Try pressing Enter again — verify it's blocked (disabled input)

---

## Firebase Production Mode

### Prerequisites
- Firebase project with Firestore enabled
- `firebase-tools` CLI installed (`npm i -g firebase-tools`)

### Setup

1. Create a `.env` file in the project root:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc
```

2. Deploy Firestore rules:
```bash
firebase deploy --only firestore:rules
# Uses src/firebase-example/firestore.rules
```

3. Deploy Cloud Function (for rate limiting):
```bash
firebase deploy --only functions
```

4. Switch HiBox to Firebase mode:

In `HiBox.jsx`, replace the localStorage logic:
```jsx
// Replace:
import { getHiCounts } from './HiBox';
// With:
import { sendHi, subscribeHiCounts } from '../firebase-example/firebase-hi';
```

In `ContributionGraph.jsx`, replace the localStorage reads:
```jsx
// Replace readCounts() with subscribeHiCounts()
// Use onSnapshot for real-time updates instead of storage events
```

See `src/firebase-example/firebase-hi.js` for the complete integration API.

### Rollback to local mode
Simply revert the imports back to the localStorage-based functions. No data migration needed — the two modes are independent.

---

## Anti-Abuse Measures

### Local prototype
- **Client-side**: `localStorage` flag (`hi-sent-today`) prevents same-browser repeat
- Limitation: savvy users can clear localStorage. This is acceptable for a portfolio prototype.

### Firebase production
- **Client-side**: same localStorage flag as above (first line of defense)
- **Server-side (Cloud Function)**: IP-based daily rate limit
  - IP is SHA-256 hashed before storage (privacy)
  - Stored in `rate-limits/{ipHash}` with `{ lastDate: "YYYY-MM-DD" }`
  - Rejects requests if `lastDate === today`
- **Firestore rules**: direct client writes are denied; all writes go through the Cloud Function

---

## Privacy

This feature is designed to be anonymous:
- **No personal information collected**: no email, name, or account required
- **No message content stored**: only a daily count (integer) per date
- **IP addresses**: used only for server-side rate limiting in production mode. IPs are hashed (SHA-256) before storage and cannot be reversed. Hash records are overwritten daily.
- **localStorage**: data is local to the user's browser and not transmitted anywhere in prototype mode
- **Data deletion**: in production mode, hi-counts can be cleared by deleting the `hi-counts` Firestore collection. Rate-limit hashes auto-expire (overwritten daily).

---

## Files Changed

| File | Change |
|------|--------|
| `src/components/GitHubProfile.jsx` | Removed activity block, follow button, stats, username. Added sidebar divider, moved orgs to sidebar, added HiBox. |
| `src/components/GitHubProfile.css` | Cleaned up removed element styles, added divider and sidebar orgs styles. |
| `src/components/ContributionGraph.jsx` | Rewritten to read from localStorage hi-counts with real dates, tooltips, cross-tab sync. |
| `src/components/HiBox.jsx` | **New** — chat input with localStorage logic. |
| `src/components/HiBox.css` | **New** — styling for HiBox. |
| `src/styles/variables.css` | Added `--color-hi-l1` through `--color-hi-l4` (navy heatmap palette). |
| `src/firebase-example/` | **New** — Firebase integration code, Firestore rules, Cloud Function. |

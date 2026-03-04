# Ann Hsu — Portfolio

A 3-section personal portfolio with scroll-driven animations.
Built with React + Vite. No runtime animation library required (pure CSS + rAF scroll bindings).

---

## Quick Start

```bash
npm install
npm run dev      # → http://localhost:5173
npm run build    # → production build in dist/
npm run preview  # → preview production build
```

---

## Architecture

```
src/
├── components/
│   ├── Hero.jsx / Hero.css                 # Section A — full-screen hero
│   ├── IntellectualTrajectory.jsx / .css    # Section B — airplane flight path
│   ├── GitHubProfile.jsx / .css            # Section C — GitHub layout replica
│   ├── PinnedCard.jsx / .css               # GitHub pinned repo card
│   ├── ContributionGraph.jsx / .css        # GitHub contribution grid (grayscale)
│   └── ProjectModal.jsx / .css             # Project detail modal
├── hooks/
│   └── useScrollProgress.js                # Scroll progress hook (0–1 per section)
├── utils/
│   └── generatePlaceholders.js             # Canvas-generated grayscale placeholders
├── assets/
│   └── AirplaneSVG.jsx                     # Line-art airplane (nose-down)
├── styles/
│   ├── variables.css                       # All CSS custom properties
│   └── global.css                          # Reset & base styles
├── App.jsx
└── main.jsx
```

---

## Scroll Progress → Element Property Mapping

### Section A — Hero Photo Fade

Each floating photo's properties are bound to Section A scroll progress `p ∈ [0, 1]`:

| Property     | Formula                                              |
|-------------|------------------------------------------------------|
| `opacity`    | `max(0, 1 - p)`                                     |
| `translateY` | `-p × fadeTranslateY` where `fadeTranslateY ∈ [20, 40]px` |
| `scale`      | unchanged (no scale on scroll, per spec)             |

**CSS/SASS snippet:**

```css
/* Conceptual — actual binding is in React via inline styles */
.hero__photo {
  --scroll-progress: 0; /* set via JS: (scrollY - sectionTop) / sectionHeight */
  opacity: calc(1 - clamp(0, var(--scroll-progress), 1));
  transform: translateY(calc(-1 * var(--scroll-progress) * 30px));
}
```

**JS implementation (Hero.jsx):**

```js
// progress = clamp((sectionTop - rect.top) / sectionHeight, 0, 1)
const opacity = 1 - progress;              // 1 → 0
const scrollTranslateY = -progress * 30;   // 0 → -30px
```

### Section B — Airplane & Path

| Element             | Property             | Formula                                           |
|--------------------|----------------------|---------------------------------------------------|
| Airplane position   | `top`                | `progress × 85%` of container height              |
| Flight path stroke  | `stroke-dashoffset`  | `pathLength - (progress × pathLength)`             |
| Node `i` visibility | `opacity`            | `progress >= node.threshold ? 1 : 0`              |
| Node scale          | `transform: scale`   | `progress >= node.threshold ? 1 : 0.85`           |
| "becoming." text    | `opacity`            | `progress >= 0.92 ? 1 : 0`                        |

**Node thresholds (% of Section B scroll):**

| Node | Threshold | Label                      |
|------|-----------|----------------------------|
| 0    | 12%       | "learned to question"      |
| 1    | 30%       | "built at scale"           |
| 2    | 48%       | "explored product thinking"|
| 3    | 66%       | "confronted complexity"    |
| 4    | 82%       | "refining ideas"           |

### useScrollProgress Hook

```js
// Calculates 0–1 progress for any section ref
const rect = sectionRef.current.getBoundingClientRect();
const sectionHeight = sectionRef.current.offsetHeight;
const progress = clamp(-rect.top / sectionHeight, 0, 1);
```

---

## CSS Variables Reference

All design tokens are in `src/styles/variables.css`:

| Variable               | Value          | Usage                        |
|------------------------|----------------|------------------------------|
| `--color-bg`           | `#FAFAFA`      | Page background              |
| `--color-text-primary` | `#121212`      | Primary text                 |
| `--color-text-secondary`| `#6E6E6E`    | Muted text                   |
| `--color-accent-navy`  | `#1B2A4A`      | Accent color (links, tags)   |
| `--font-sans`          | Inter/SF Pro   | Body & headings              |
| `--font-mono`          | JetBrains Mono | Code elements                |
| `--fw-thin`            | `100`          | Hero title weight            |
| `--duration-hover`     | `200ms`        | Hover transitions            |
| `--duration-reveal`    | `600ms`        | Node/element reveal          |
| `--ease-default`       | `cubic-bezier(0.4, 0, 0.2, 1)` | Standard easing |
| `--radius-md`          | `6px`          | Card/button corners          |
| `--shadow-photo`       | `0 2px 8px rgba(0,0,0,0.12)` | Photo drop shadow |

---

## Key Class Names

| Class                        | Element                         |
|-----------------------------|---------------------------------|
| `.hero`                      | Section A container (100vh)     |
| `.hero__photo`               | Individual floating photo       |
| `.hero__title`               | "ANN HSU" heading               |
| `.trajectory`                | Section B container             |
| `.trajectory__airplane`      | Airplane icon wrapper           |
| `.trajectory__node`          | Flight path node                |
| `.trajectory__node--visible` | Revealed node state             |
| `.trajectory__becoming`      | "becoming." text                |
| `.gh-profile`                | Section C container             |
| `.gh-sidebar`                | GitHub left sidebar             |
| `.gh-pinned-grid`            | Pinned repos 2-column grid      |
| `.contrib-graph`             | Contribution graph container    |
| `.pinned-card`               | Individual pinned repo card     |
| `.modal-overlay`             | Project detail modal backdrop   |

---

## Tweaking Scroll Thresholds

To adjust when nodes appear in Section B, edit the `NODES` array in `IntellectualTrajectory.jsx`:

```js
const NODES = [
  { threshold: 0.12, label: 'learned to question' },    // appears at 12% scroll
  { threshold: 0.30, label: 'built at scale' },          // appears at 30% scroll
  // ... adjust thresholds between 0 and 1
];
```

To adjust the hero photo fade speed, modify `fadeTranslateY` values in `generatePlaceholders.js`:
```js
fadeTranslateY: 20 + (i % 4) * 5,  // range 20–35px; increase for faster fade-out
```

---

## Placeholder Assets

- **Photos**: Generated at runtime via canvas (grayscale rectangles). Replace `createPlaceholderDataURI()` calls with actual image imports.
- **Airplane SVG**: Available at `public/assets/airplane.svg` and as React component in `src/assets/AirplaneSVG.jsx`.

---

## Accessibility Checklist

- [x] `prefers-reduced-motion`: All CSS animations and JS scroll transitions respect this media query. When enabled, animations snap instead of interpolating.
- [x] Keyboard navigation: Arrow keys scroll the page, advancing the airplane and revealing nodes. Modal closes with Escape.
- [x] Focus management: Modal traps focus and auto-focuses close button on open.
- [x] ARIA labels: Sections have `aria-label`, decorative elements have `aria-hidden="true"`, contribution graph has `role="img"`.
- [x] Screen reader text: `.sr-only` utility class provides hidden labels.
- [x] Color contrast: Primary text (#121212) on background (#FAFAFA) = 17.4:1 ratio (WCAG AAA).
- [x] Semantic HTML: Proper heading hierarchy (`h1` → `h2` → `h3`), `main`/`aside`/`section` elements.
- [ ] **Production TODO**: Add skip-to-content link. Run axe-core audit.

---

## Test Plan

### Section A — Hero

| Test                        | How to verify                                                       |
|----------------------------|----------------------------------------------------------------------|
| Photos visible at top       | Load page; 10 grayscale photos visible around "ANN HSU"             |
| Scroll fades photos         | Scroll Section A; photos fade to opacity 0 and shift upward         |
| Photos invisible at B start | At the boundary where Section B starts, all photos must be at 0     |
| Title stays sharp           | Title "ANN HSU" must not fade or move during Section A scroll       |
| Cursor parallax             | Move cursor; photos shift slightly relative to cursor position      |
| Idle bobbing                | At rest, photos bob vertically ~3px (6s cycle)                      |
| No extra decorations        | Verify no extra buttons, nav, or text elements in hero              |
| Reduced motion              | Enable reduced-motion in OS; bobbing stops, fades snap              |

### Section B — Intellectual Trajectory

| Test                        | How to verify                                                       |
|----------------------------|----------------------------------------------------------------------|
| Airplane at top             | Start of Section B: airplane is near top of flight path             |
| Airplane moves down         | Scroll through Section B; airplane moves strictly vertically        |
| Path draws behind           | Thin curved line progressively appears behind airplane              |
| No horizontal movement      | Airplane moves only vertically, no horizontal drift                  |
| Nodes hidden initially      | Before airplane reaches node position, node is invisible            |
| Node reveals on reach       | When airplane passes threshold, node fades in with scale            |
| Labels appear with nodes    | Each node reveals its label text on the correct side                |
| Life markers appear         | Below path, timeline markers appear as corresponding nodes reveal   |
| Dotted line at end          | At 92%+ progress, stroke becomes dotted; "becoming." appears        |
| Arrow key navigation        | Arrow-down scrolls page; airplane and nodes respond                 |
| Reduced motion              | Transitions snap; no interpolated motion                             |

### Section C — GitHub Profile

| Test                        | How to verify                                                       |
|----------------------------|----------------------------------------------------------------------|
| Layout matches GitHub       | Desktop: left sidebar (296px) + right content, matching GitHub      |
| Avatar prominent            | Large circular avatar with initials, matching GitHub proportions     |
| Sidebar: no Education       | Education is NOT in the sidebar                                      |
| Pinned cards (6)            | 2-column grid; thin border, language dot, star count, Public badge  |
| Card click → modal          | Click a pinned card; modal opens with project details               |
| Modal: Escape closes        | Press Escape; modal closes and focus returns                         |
| Modal: overlay click        | Click outside modal content; modal closes                           |
| Contribution graph          | 52-week grayscale grid with month labels, day labels, legend        |
| Activity section            | Recent commits/PRs/issues listed with icons                         |
| Organizations               | USC and KCL listed with colored avatars (not in sidebar)            |
| Mobile collapse             | Resize to <768px; layout stacks, sidebar collapses                  |
| Card hover                  | Hovering pinned card shows subtle shadow elevation                  |

---

## Hand-off Note for Frontend Engineers

### What's implemented
A complete 3-section portfolio with scroll-driven animations. All scroll bindings use `requestAnimationFrame` for performance. The `useScrollProgress` hook provides a normalized 0–1 progress value per section.

### What needs production work
1. **Photos**: Replace canvas-generated placeholders with real B&W photographs (90–140px). Import them directly or use a CMS.
2. **GitHub data**: The contribution graph and pinned repos use static data. Connect to GitHub API if dynamic data is desired.
3. **Routing**: Currently a single page. Add React Router if project modals need unique URLs.
4. **SEO**: Add Open Graph tags, structured data, and a proper favicon.
5. **Performance**: Consider replacing the scroll event listener with `IntersectionObserver` for nodes, and CSS `animation-timeline: scroll()` when browser support broadens.
6. **Skip-to-content**: Add a skip link for keyboard users.

### How to adjust animations
- All timing/easing values are CSS custom properties in `src/styles/variables.css`
- Scroll thresholds for node reveals are in the `NODES` array in `IntellectualTrajectory.jsx`
- Photo positions and parallax factors are in `PHOTO_CONFIGS` in `generatePlaceholders.js`
- The flight path curve is defined in `generateFlightPath()` — adjust control points to change the curve shape

### Reduced motion
All animations check `prefers-reduced-motion`. When enabled:
- CSS animations are disabled (`animation: none`)
- JS transitions snap to final values instead of interpolating
- Modal fade-in is instant

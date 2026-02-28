# AgriStoreSmart — PRD

## Problem Statement
Redesign the AgriStoreSmart landing page UI with a dark agricultural theme (inspired by AgroVault reference design). Keep all features/content from the existing website at https://agristoresmart.vercel.app/. Add smooth animations, loading page, and professional frontend engineering.

## Architecture
- **Stack**: React 19, Tailwind CSS, Lucide React icons
- **Routing**: React Router DOM (single `/` route)
- **Styling**: Custom CSS (App.css) with CSS variables for the theme
- **State**: Local useState/useEffect hooks

## Files Created
- `/app/frontend/src/App.css` — Complete dark agricultural theme with all CSS
- `/app/frontend/src/App.js` — Routing entry point
- `/app/frontend/src/components/LandingPage.jsx` — Full landing page (13 sections)
- `/app/frontend/src/components/Loader.jsx` — Wheat stalk loader animation
- `/app/frontend/src/components/Cursor.jsx` — Custom cursor (dot + ring)

## Color Palette (AgroVault-inspired)
- `--g-darkest: #060f09` (primary background)
- `--g-dark: #0b1f12` (section alternating bg)
- `--g-bright: #4caf7d` (accent green)
- `--gold-mid: #e0a820` (CTA gold)
- `--gold-bright: #f0c040` (stats/highlight gold)
- `--cream: #f5f0e8` (body text)

## Implemented Sections (13 total)
1. **Loader** — Wheat stalk CSS animation, progress bar, brand name
2. **Navbar** — Glassmorphism on scroll, mobile hamburger
3. **Hero** — Dark gradient bg, animated headline, CTAs, 4-stat bar
4. **Problem** — 2-col layout with warehouse image + 5 pain points
5. **Solution** — 4 pillar cards (IoT, AI, Dispatch, Traceability)
6. **Features** — 3×2 grid of 6 feature cards with hover glow
7. **How It Works** — 4-step horizontal timeline
8. **Infrastructure** — 2-col: infra cards + animated system status panel
9. **Impact Stats** — 4 animated counters (62%, +3x, 99%, 200+)
10. **Tech Strip** — 7 technology chips
11. **Testimonials** — 3 testimonial cards (Ramesh, Gurpreet, Sunita)
12. **CTA** — Centered headline + 2 buttons + trust note
13. **Contact + Footer** — Form with success state + 4-col footer

## Animations Implemented
1. Wheat stalk loader (CSS `scaleY` + `scale/rotate` keyframes)
2. Glassmorphism navbar (`backdrop-filter: blur(18px)` on scroll)
3. Scroll reveal (IntersectionObserver → `.visible` class)
4. Counter animation (count-up with ease-out cubic on scroll-into-view)
5. Custom cursor (dot exact position + ring with `lerp` lag at 12% per frame)

## User Personas
- Indian farmers (Ramesh, Sunita)
- Cold storage operators (Gurpreet)
- FPC directors
- NABARD-aligned organizations
- Agricultural tech stakeholders

## Test Results (iteration_1)
- 95% success rate
- All sections: PASS
- Loader: PASS
- Navbar glassmorphism: PASS
- Contact form: PASS
- Mobile responsive: PASS

## What's Been Implemented
- [2026-02-27] Full UI redesign with dark agricultural theme
- [2026-02-27] 5 animation types (loader, navbar, reveal, counter, cursor)
- [2026-02-27] All 13 sections with full content from original site
- [2026-02-27] Responsive design (mobile/tablet/desktop)

## Backlog / Future Enhancements
- P1: YouTube video hero background (like original AgroVault reference)
- P1: Dashboard preview section with mock charts (Recharts)
- P2: Blog/resources section
- P2: Pricing/plans section
- P3: Particle animation in hero
- P3: Page transitions between sections

# NOBLE · Premium Barbershop — Landing Page

A premium barbershop landing page for a practice project. Built with vanilla HTML, CSS and JavaScript — no frameworks.

## Location

153 N 100 E, Lehi, UT 84043

## Tech Stack

- **HTML5** — semantic markup, accessible (ARIA, skip-link, labels)
- **CSS3** — custom properties, Grid, Flexbox, transitions, `@keyframes`, responsive (mobile-first)
- **Vanilla JS** — no dependencies
- **APIs** — Browser Geolocation + OpenWeatherMap (temp + icon in header)
- **Storage** — `localStorage` for booking form (remembers visitor)

## Features

- Sticky header with logo, navbar, weather widget, language switch (EN/ES), user greeting and mobile hamburger menu
- Hero with fluid typography that scales to large viewports (up to 5rem / 80px on 1600px+ screens)
- Services masonry grid (6 cards with pricing, 12-col layout with wide/normal spans)
- **Masonry-style haircut gallery** — 13 cards in a 12-column CSS Grid with varied spans:
  - Wide cards (span 8 cols, 2 rows) for featured styles
  - Tall cards (span 4 cols, 2 rows) for visual interest
  - Normal cards (span 4 cols) for standard styles
  - Responsive: collapses to single column on mobile
- FAQ accordion with toggle: single-open or multi-open mode
- Booking form with validation, localStorage persistence and "forget me" button — submit opens WhatsApp with the request pre-filled
- Floating WhatsApp button with default message (language-aware)
- Bilingual UI via segmented EN|ES switch in header, persisted in localStorage (`noble-lang`)
- Header shows "Welcome, {name}" (or "Hola, {name}") when the visitor is registered; no "Welcome back" banners
- Scroll-reveal animations via IntersectionObserver
- Fully responsive (mobile / tablet / desktop / large desktop)
- `prefers-reduced-motion` support

## Typography & Viewport Scaling

The site uses `clamp()` for fluid typography that adapts to any viewport:

| Element | Mobile | Desktop (1200px+) | Large (1600px+) |
|---------|--------|-------------------|-----------------|
| Hero title | 2.5rem | 4.5rem | 5rem |
| Section title | 2rem | 3.5rem | 3.5rem |
| Body text | 1rem | 1.05rem | 1.05rem |

Container max-width scales from `80rem` (1280px) to `90rem` (1440px) on large screens.

## Masonry Grid Layout

Both the services menu and the haircut styles gallery use a 12-column CSS Grid with varied card spans.

### Services (6 cards)

```
Row 1-2: [Cut+Beard Noble wide 8col × 2row] [Classic Cut 4col]
Row 3:   [Beard Trim 4col] [Straight-Razor 4col]
Row 4:   [Color 4col] [Facial 4col]
```

- `.card-wide` — `grid-column: span 8; grid-row: span 2` (featured service)
- `.card-normal` — `grid-column: span 4`

### Haircut Styles Gallery (13 cards)

```
Row 1: [C1 wide 8col × 2row] [C2 4col]
Row 2: [C1 continues    ] [C3 4col]
Row 3: [C4 4col] [C5 tall 4col × 2row] [C6 4col]
Row 4: [C7 4col] [C5 continues         ] [C8 4col]
Row 5: [C9 4col] [C10 wide 8col        ]
Row 6: [C11 4col] [C12 4col] [C13 4col]
```

**CSS classes:**
- `.masonry-card-wide` — `grid-column: span 8; grid-row: span 2; min-height: 400px`
- `.masonry-card-tall` — `grid-column: span 4; grid-row: span 2; min-height: 400px`
- `.masonry-card-normal` — `grid-column: span 4; min-height: 200px`

**Responsive behavior:**
- ≤1024px: wide → 12col, tall → 6col, normal → 6col
- ≤768px: all → 12col (single column stack)

## APIs Used

| API | Purpose |
|-----|---------|
| Browser Geolocation | Detect visitor location for weather |
| OpenWeatherMap | Current temperature + icon in header |

**OpenWeatherMap Key:** `3eacb37d511e5b347ccd8d2b00f3be54`

**Fallback:** If geolocation is denied or unavailable, the site defaults to Lehi, UT coordinates (40.3916, -111.8505).

## Running Locally

```bash
# Any static server works:
python3 -m http.server 8000
# or
npx serve .
```

Then open `http://localhost:8000`.

## Verification Checklist

- [ ] Lighthouse ≥ 95 in Accessibility, Best Practices, SEO
- [ ] [W3C HTML Validator](https://validator.w3.org/nu/) — 0 errors
- [ ] [W3C CSS Validator](https://jigsaw.w3.org/css-validator/) — 0 errors
- [ ] [WAVE](https://wave.webaim.org/) — 0 errors

## Project Structure

```
.
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── assets/
│   └── favicon.svg
├── docs/
│   └── plan.md
└── README.md
```

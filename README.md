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

- Sticky header with logo, navbar, weather widget and mobile hamburger menu
- Hero with badge, headline, dual CTAs and personalized greeting
- Services grid (6 cards with pricing)
- Gallery (6 items, lazy-loaded)
- FAQ accordion with toggle: single-open or multi-open mode
- Booking form with validation, localStorage persistence and "forget me" button
- Scroll-reveal animations via IntersectionObserver
- Fully responsive (mobile / desktop)
- `prefers-reduced-motion` support

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

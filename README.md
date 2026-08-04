# Gateway Intelligence — website

One-page marketing site for Gateway Intelligence: AI help for nature nonprofits, park partners, and gateway businesses.

**Live:** https://goehringcory-lang.github.io/gateway-intelligence/

## Stack

Static HTML, CSS, and vanilla JavaScript — no build step, no dependencies. Push to `main` and GitHub Pages redeploys.

```
index.html        content, inline SVG sprite, meta + JSON-LD
css/style.css     design tokens, bands, components, motion
js/main.js        sticky nav, scroll reveals, count-up stats, accordion, mobile menu
assets/           favicons and social share image
```

## Editing

- **Copy** lives directly in `index.html`, one section per `<section>` with an `id`.
- **Colors, spacing, and type scale** are CSS custom properties in the `:root` block at the top of `css/style.css`.
- **Hide all prices** by changing the opening tag to `<body data-prices="off">` — no other edits needed.
- **Contact address** is a placeholder. Search for `TODO(contact)` to find every spot that needs the real business email or scheduling link.
- **Positioning** is deliberately impersonal: the site sells the business case for AI help, not a founder biography. There is no About/founder section, and no individual is named anywhere in the copy or structured data.
- **Reading level** is held to roughly 5th grade (Flesch-Kincaid ~4.5, reading ease ~80). Keep sentences short, prefer common words over industry terms, and stay in active voice. Service names are plain on purpose — "AI Readiness Check," "Build Sprint," "Part-Time AI Director" — and the mailto `subject=` values match those names.
- **Statistics** each carry a `.source` line naming the study they come from. If you edit a number, edit its source line with it — and check `data-count-to` on the `.stat__value`, which drives the count-up animation and must match the displayed figure.

## Local preview

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

## Accessibility and motion

Semantic landmarks, skip link, keyboard-operable menu and accordion, and visible focus rings. All animation is disabled under `prefers-reduced-motion`, and the page stays fully readable with JavaScript off.

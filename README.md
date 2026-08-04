# Gateway Intelligence — website

One-page marketing site for Gateway Intelligence: AI enablement for nature nonprofits, park partners, and gateway tourism businesses.

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
- **Employer naming** in the About section is intentionally generic; see the `EMPLOYER NAMING` comment.
- A commented-out `<figure>` in the About section is ready for a real headshot.

## Local preview

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

## Accessibility and motion

Semantic landmarks, skip link, keyboard-operable menu and accordion, and visible focus rings. All animation is disabled under `prefers-reduced-motion`, and the page stays fully readable with JavaScript off.

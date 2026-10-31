# Gateway Intelligence — website

One-page marketing site for Gateway Intelligence: AI help for tourism businesses, park partners, and gateway organizations. The audience is general business first — lodges, tour companies, outfitters, shops, restaurants — with nature nonprofits and park partners present but secondary.

**Live:** https://goehringcory-lang.github.io/gateway-intelligence/

## Stack

Static HTML, CSS, and vanilla JavaScript — no build step, no dependencies. Push to `main` and GitHub Pages redeploys.

```
index.html        content, inline SVG sprite, meta + JSON-LD
checklist.html    the AI Readiness Checklist — free self-check the finale CTA links to
css/style.css     design tokens, bands, components, motion, checklist + print styles
js/main.js        sticky nav, scroll reveals, count-up stats, accordion, mobile menu
js/flow.js        "How Intelligence Flows" scroll story: sticky canvas behind the #flow panes
js/checklist.js   checklist live score, verdict highlight, print, localStorage persistence, sign-up form
assets/           favicons and social share image
```

## Editing

- **Copy** lives directly in `index.html`, one section per `<section>` with an `id`.
- **Colors, spacing, and type scale** are CSS custom properties in the `:root` block at the top of `css/style.css`.
- **Hide all prices** by changing the opening tag to `<body data-prices="off">` — no other edits needed. Prices written inside a sentence are wrapped in `<span class="price-text">` so the switch hides them too; keep doing that for any new ones.
- **Services** are six cards, cheapest first. The two entry offers — the AI Fluency Course ($350) and the Quick Win ($750, one task built in one week) — carry the "Start small" tag. The founding price ($1,500 for an AI Readiness Check) appears in the Readiness Check chip, the founding badge, and the founding lede; change all three together.
- **Checklist sign-up** is an optional Buttondown form under the score on `checklist.html`. It stays hidden until `data-list` on `#signup` is set to a Buttondown username (search `TODO(newsletter)`). It sends the email, a `checklist` tag, and the score count.
- **Contact address** is a placeholder. Search for `TODO(contact)` to find every spot that needs the real business email or scheduling link.
- **The AI Fluency Course** is delivered live online — four classes, one a week, small group, $350 a seat — and is the one offering with no geographic limit. Copy sells it on what it is (live, small, hands-on, your own real work), never on being "an online course." Keep it that way: the format words to use are "live," "class," and "small group," not "webinar," "modules," or "self-paced." The format appears in four places that must stay in sync — the `#course` section, FAQ q3 and q8, and the `Course` JSON-LD block in `<head>`.
- **Positioning** is deliberately impersonal: the site sells the business case for AI help, not a founder biography. There is no About/founder section, and no individual is named anywhere in the copy or structured data.
- **Reading level** is held to roughly 5th grade (Flesch-Kincaid ~4.5, reading ease ~80). Keep sentences short, prefer common words over industry terms, and stay in active voice. Service names are plain on purpose — "AI Readiness Check," "Build Sprint," "Part-Time AI Director" — and the mailto `subject=` values match those names.
- **Page order** puts the offer early: one short "Why it matters" section with four numbers, then Services. Resist adding stat sections back above Services.
- **Statistics** each carry a `.source` line naming the study they come from. If you edit a number, edit its source line with it — and check `data-count-to` on the `.stat__value`, which drives the count-up animation and must match the displayed figure.

- **How Intelligence Flows** (`#flow`, between What We Build and How It Works) is a scroll story. Text panes scroll over a sticky canvas, and each open gap between panes plays one step: read, filter in, sort, filter out, pay off. The sources, needs, jobs, and results are listed twice: in the `#flow` chips and lists in `index.html`, and in the `SOURCES` and `NEEDS` arrays at the top of `js/flow.js`. Change both together. The counts are an example week and the pane says so; keep that note if you change them.

## Local preview

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

## Accessibility and motion

Semantic landmarks, skip link, keyboard-operable menu and accordion, and visible focus rings. All animation is disabled under `prefers-reduced-motion`, and the page stays fully readable with JavaScript off.

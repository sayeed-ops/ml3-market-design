# ML3 — Link Market redesign (design mockup)

Static HTML/CSS/JS prototype of the **Link Market** (media marketplace) redesign. This is a
**design prototype**, not the production app — devs convert it to Vue/Tailwind later.

## Live site
Hosted on GitHub Pages — the root redirects into the design:
- **Market table page:** `market-ml3/index.html`
- **Media details page:** `market-ml3/details.html`
- **Drafts page:** `market-ml3/drafts.html`

## Structure
- `market-ml3/` — the pages (`index.html`, `details.html` + `details.css`, `drafts.html`,
  `styles.css`, `pager.js`, logos) and `HANDOFF.md` (full current-state doc).
- `system-ml3/` — shared design system (`tokens.css`, `base.css`, `components.css`).

No build step — open the HTML directly in a browser. Needs internet (favicons + flag CDNs).

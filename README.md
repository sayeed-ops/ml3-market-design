# ML3 — Link Market redesign (design mockup)

Static HTML/CSS/JS prototype of the **Link Market** (media marketplace) redesign. This is a
**design prototype**, not the production app — devs convert it to Vue/Tailwind later.

## 🔗 Live site
**https://sayeed-ops.github.io/ml3-market-design/**

(The root redirects into the market table page.) Direct links:

| Page | Live URL | Prod route |
|---|---|---|
| Market table | https://sayeed-ops.github.io/ml3-market-design/market-ml3/index.html | `/market` |
| Media details | https://sayeed-ops.github.io/ml3-market-design/market-ml3/details.html | `/market/{id}` |
| Drafts | https://sayeed-ops.github.io/ml3-market-design/market-ml3/drafts.html | `market/drafts` |
| Checkout | https://sayeed-ops.github.io/ml3-market-design/market-ml3/checkout.html | `/cart` |

## Structure
- `market-ml3/` — the pages (`index.html`, `details.html` + `details.css`, `drafts.html`,
  `checkout.html` + `checkout.css`, `styles.css`, `pager.js`, logos) and **`HANDOFF.md`** (full
  current-state doc — read this first).
- `system-ml3/` — shared design system (`tokens.css`, `base.css`, `components.css`).

No build step — open the HTML directly in a browser. Needs internet (favicons + flag CDNs).

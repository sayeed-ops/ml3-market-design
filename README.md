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
| Orders | https://sayeed-ops.github.io/ml3-market-design/market-ml3/orders.html | `/orders` |
| All links | https://sayeed-ops.github.io/ml3-market-design/market-ml3/all-links.html | `/orders/items/all` |
| Order item | https://sayeed-ops.github.io/ml3-market-design/market-ml3/order-item.html | `/orders/items/{slug}` |
| Settings | https://sayeed-ops.github.io/ml3-market-design/settings-ml3/index.html | `/settings` |
| Component library | https://sayeed-ops.github.io/ml3-market-design/library/index.html | — |

The full market → cart → checkout → orders → all-links → order-item flow is navigable, and the
sidebar links the pages together.

## Structure
- `market-ml3/` — the pages and **`HANDOFF.md`** (full current-state doc — read this first):
  - `index.html` (market table), `details.html` + `details.css` (media details), `drafts.html`,
    `checkout.html` + `checkout.css` (cart), `orders.html`, `all-links.html`,
    `order-item.html` + `order-item.css`, plus `styles.css`, `pager.js`, logos.
- `settings-ml3/` — the settings ecosystem (Users, roles, billing, currencies, publishers, …).
- `system-ml3/` — shared design system (`tokens.css`, `base.css`, `components.css`).
- `library/` — single-page **component library / design-system reference** (tokens, App bar,
  buttons, badges, and a gallery of every page).

No build step — open the HTML directly in a browser. Needs internet (favicons + flag CDNs).

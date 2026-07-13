# ML3 — Motherlink PRO redesign (design mockup)

Static HTML/CSS/JS prototype of the **Motherlink PRO** app redesign — the Link Market and the
areas around it (Orders, Projects, Account, Settings). This is a **design prototype**, not the
production app; devs convert it to Vue/Tailwind later.

## 🔗 Live site
**https://sayeed-ops.github.io/ml3-market-design/**

(The root redirects into the market table page.) Direct links:

| Page | Live URL | Prod route |
|---|---|---|
| Market table | https://sayeed-ops.github.io/ml3-market-design/market-ml3/index.html | `/market` |
| Media details | https://sayeed-ops.github.io/ml3-market-design/market-ml3/details.html | `/market/{id}` |
| Drafts | https://sayeed-ops.github.io/ml3-market-design/market-ml3/drafts.html | `market/drafts` |
| Managed services | https://sayeed-ops.github.io/ml3-market-design/market-ml3/managed-services.html | `/market` · Managed services tab |
| Manage packages (admin) | https://sayeed-ops.github.io/ml3-market-design/market-ml3/managed-services-admin.html | admin · `MARKET_CREATE_PACKAGES` |
| Package editor (admin) | https://sayeed-ops.github.io/ml3-market-design/market-ml3/package-editor.html | admin · create / edit package |
| Checkout | https://sayeed-ops.github.io/ml3-market-design/market-ml3/checkout.html | `/cart` |
| Orders | https://sayeed-ops.github.io/ml3-market-design/orders-ml3/orders.html | `/orders` |
| All links | https://sayeed-ops.github.io/ml3-market-design/orders-ml3/all-links.html | `/orders/items/all` |
| Order item | https://sayeed-ops.github.io/ml3-market-design/orders-ml3/order-item.html | `/orders/items/{slug}` |
| Projects | https://sayeed-ops.github.io/ml3-market-design/projects-ml3/projects.html | `/brands` |
| Project detail | https://sayeed-ops.github.io/ml3-market-design/projects-ml3/project.html | `/brands/{slug}/projects/{id}` |
| Account | https://sayeed-ops.github.io/ml3-market-design/account-ml3/account.html | `/account` |
| Settings | https://sayeed-ops.github.io/ml3-market-design/settings-ml3/index.html | `/settings` |
| Component library | https://sayeed-ops.github.io/ml3-market-design/library/index.html | — |

The full **market → cart → checkout → orders → all-links → order-item** flow is navigable, plus the
**Managed services** storefront (kept combined with Link market via the tab toggle, with its admin
package-authoring surfaces), the **Projects** workspace (brand as a scope switcher) → project detail,
and the **Account** area. The universal sidebar links the areas together, and the sidebar user card
opens the account menu.

## Structure
Pages are grouped by the app's **top-level nav area** — each area is its own folder, all siblings
of `system-ml3/`, so the shared-CSS links (`../system-ml3/*.css`) work from anywhere:

- `market-ml3/` — **Market**: `index.html` (market table — Link market tab), `details.html` +
  `details.css` (media details), `drafts.html`, `checkout.html` + `checkout.css` (cart), and the
  **Managed services** storefront (`managed-services.html` + `managed-services.css`) with its admin
  surfaces (`managed-services-admin.html` = Manage packages, `package-editor.html` = the create/edit
  flow with a live buyer-card preview). Owns the shared shell styles (`styles.css`) + `pager.js` +
  logos that the other areas reference.
- `orders-ml3/` — **Orders**: `orders.html`, `all-links.html`, `order-item.html` + `order-item.css`.
- `projects-ml3/` — **Projects** (the brands area): `projects.html` (project-first list, brand as an
  App-Bar scope switcher), `project.html` (project detail) + `projects.css`, `project.css`,
  `access.js` (shared invite-users / manage-access control).
- `account-ml3/` — **Account**: `account.html` (Profile / Password / Notifications).
- `settings-ml3/` — the settings ecosystem (Users, roles, billing entities, currencies, publishers,
  integrations, customization).
- `system-ml3/` — shared design system: `tokens.css`, `base.css`, `components.css`, plus
  `usermenu.js` (the shared sidebar account menu).
- `library/` — single-page **component library / design-system reference** (tokens, App bar,
  buttons, badges, and a gallery of every page).

The full current-state doc lives in **`market-ml3/HANDOFF.md`** (and `settings-ml3/HANDOFF.md` for
the settings area) — read those first to continue the work.

No build step — open the HTML directly in a browser. Needs internet (favicons + flag CDNs).

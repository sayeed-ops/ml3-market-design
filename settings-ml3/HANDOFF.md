# Settings redesign — handoff (ML3)

Static HTML/CSS/JS mockup of the **Settings** area of the Motherlink PRO app, redesigned in the
ML3 design language. A **design prototype**, not the production app. The real Vue/Nuxt app in the
repo root is the **source of truth for data/fields/labels/copy** — read the referenced `.vue` files
before building each tab. Sibling of the market mockup (`design-mockups/market-ml3/`, see its
`HANDOFF.md`) and shares the design system in `design-mockups/system-ml3/`.

Git branch: `redesign/market`.

## How to view
Open via a local server (NOT `file://` — Safari/Chrome block the `../system-ml3/*.css` relative
links): `cd design-mockups && python3 -m http.server` → open `settings-ml3/index.html`.

**Self-verify with headless Chrome** (Read the PNG afterwards):
`"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --screenshot=/tmp/x.png --window-size=1440,1000 --virtual-time-budget=2500 "file://<abs-path>"`
- To drive JS state (open a menu/modal), copy the page to a `_v_*.html`, append a `<script>` that
  runs on a `setTimeout(...,300)` calling the right clicks, screenshot, then delete the temp file.
- **Headless gotcha:** CSS entrance animations DON'T settle under `--virtual-time-budget` (elements
  stay `opacity:0`). Inject `<style>*{animation-duration:0.001s!important;transition:none!important}</style>`
  into the temp file to see modals/menus in screenshots.
- **CSS gotcha:** the `[hidden]` attribute is overridden by any `display:flex/grid` class — add an
  explicit `.x[hidden]{display:none}` rule when hiding flex/grid elements.

## Publish / live site (GitHub Pages)
The mockups are published to a **separate GitHub repo** (NOT the GitLab app repo): local clone at
`/Users/sayeed/ml3-market-design` → `github.com/sayeed-ops/ml3-market-design` → GitHub Pages.
- **Publish command:** `cd /Users/sayeed/ml3-market-design && ./sync.sh "commit message"`. It rsyncs
  `market-ml3/ system-ml3/ settings-ml3/ library/` from `design-mockups/` (with `--delete`; excludes
  `.DS_Store` and `settings-ml3/.backup-pre-ux/`), then commits + pushes to `main`. Pages rebuilds in
  ~30–90s (poll a live URL; the CDN caches, so hard-refresh / add `?cb=<ts>` to bust).
- **Live URLs:** app entry `https://sayeed-ops.github.io/ml3-market-design/market-ml3/index.html` ·
  settings `.../settings-ml3/index.html` · library `.../library/index.html`. The market app's left-nav
  **Settings** item links to `../settings-ml3/index.html`; other market nav items are intentionally `#`.
- The root `index.html` redirects to the market app; `.nojekyll` is present. Root files (index/README/
  sync.sh) are left untouched by the sync.

## Repo state (updated this session)
- `ml3-ui` (GitLab, this working copy): `redesign/market` was 229 behind `main` / 0 ahead — **fast-forwarded
  to latest `main`**. The one local change (`yarn.lock`, a `yarn install` artifact) is **stashed**
  (`stash@{0}`), not applied. Run `yarn install` before running the app locally. `design-mockups/` is
  **untracked** here (lives only in git via the GitHub publish repo) — it survives all branch ops.
- `ml3-api` (GitLab, `/Users/sayeed/Ai projects/ml3-api`): pulled latest `main`.

## Design system
`design-mockups/system-ml3/` → `tokens.css` · `base.css` · `components.css`. Clean white, Geist/Inter,
`#3d3aad` purple accent, CSS variables for color/space/radius/shadow. **Reuse tokens/components —
never hardcode colors or spacing.** Page-specific additions go at the END of `settings-ml3/styles.css`.

## App shell / sidebar (the reusable "internal-page sidebar" pattern)
Every settings page shares the same shell (copy the markup from any existing page):
- `.m-app > .m-shell > (aside.m-sidebar + main.m-main)`. **Flat, flush, full-height sidebar** identical
  to the market design (grey `#f7f8fa` body, hairline right border — NOT a floating framed panel anymore;
  de-floated 2026-07-05 to align with the App Bar). Brand/`.s-head` top row is 56px with a bottom hairline
  so it forms one continuous top band with the App Bar. Collapse toggle `#m-side-toggle`, user card foot.
  Every `main.m-main` starts with a sticky `<header class="appbar">` (see App Bar note below).
- **Sidebar is scoped to Settings:** a compact header `<a class="s-head">` whose WHOLE ROW links back
  to the app (back-chevron icon + centered "Settings" title) — NOT a big title, NOT an eyebrow, NOT a
  separate "Back to app" button. Below it a **flat** nav list (`.m-nav__item`), no section headers.
- Nav items: Users · User roles · Billing entities · Currencies · Publishers · Integrations ·
  Customization. **Cross-link every built page** (nav item → its `.html`); unbuilt tabs stay `href="#"`.
  The active page's item gets `is-active`.
- Content sits in `.m-content`. Table pages use it full-width with `.m-head` (h1 + `.sub`). Form/card
  pages (Integrations, Customization) center the column: `style="max-width:820px;margin:0 auto;width:100%"`.

## Conventions (learned from user feedback — FOLLOW for every tab)
- **Copy MUST follow the production app.** Don't invent UI elements or copy; rephrase at most. Read
  the real `.vue` page + its modal components and reuse their exact labels/paragraphs.
- **Modals are icon-less** (title + X in the head). The shared `modal()` helper (copy from
  `currencies.html`/`publishers.html`) supports: `title, sub, body, danger, confirm, cancel, footLeft,
  hideCancel, noFoot, onMount, onConfirm`. Danger = red confirm button.
- **Empty states** use `.s-empty` (icon + title + sub + CTA). Preview with `?empty` where supported.
- **Toasts**: `.toast` (bottom-center) for save/create/delete feedback, with the app's real toast copy.
- **Sub-tabs** use `.s-tabs`/`.s-tab` (underline). Filter/menu dropdowns and row `⋯` menus use the
  floating `.amenu` (appended to body so table overflow never clips it; closes on outside-click/scroll/Esc).
- Roles are **single-select** everywhere (users table shows ONE role chip, no `+1`).

## Reusable components already in styles.css
`.m-table` / `.m-table-card` (+ `.m-table--wide` sticky first/last col) · `.s-tabs`/`.s-tab` ·
`.s-toolbar` · `.s-search` · `.s-badge` (+ `--active/--blue/--gray/--invited/--pending/--susp`) ·
`.s-empty` · `.amenu` · `.modal`/`.ovl` · `.field`/`.input`/`.select`/`.textarea` · `.ssel` (searchable
combobox) · `.ig` (URL + copy input group) · `.switch` + `.switch-row` · `.acc` (accordion) · `.pcard`
(identity card) · `.i-card` (section card) + `.i-prov`/`.input-key`/`.i-metrics`/`.i-stat` · `.dr`
(date-range popover) · `.cz-*` (customization status list + price table) · `.r-chip` · `.rlist` (radio list).

## Pages built (source .vue in parentheses)
- **Users** — `index.html` (`pages/users/index.vue`). Table (User ID, user, source, single role, status,
  manager, dates), row selection + bulk bar, row `⋯` context-aware by status. Modals: Invite (share
  signup URL, no form), Assign account manager (searchable combobox), Change role (single-select radios,
  current role on chip, no descriptions), Review request, Suspend, Reactivate, Resend/Revoke invite.
- **Currencies** — `currencies.html` (`pages/currencies/index.vue` + `components/currencies/*`). Table
  (Currency name, Conversion rate, Primary badge on base — no flags, no code col, no picker dropdown),
  empty state (`?empty`), Add (free-text Name + rate), Update (rate only), Delete.
- **Publishers** — `publishers.html` (`pages/publisher/index.vue`, `components/publishers/*`). Sub-tabs
  Imported / Registered (`?tab=registered`, `?empty`). Imported: bulk Actions (Edit currency/Delete) +
  currency filter, row Edit/Delete. Registered: wide sticky table (all company/billing cols), status
  filter + Invite, status-based row actions. Modals: Edit, Delete, Bulk delete, Bulk edit currency,
  Review request (identity card + Business/Billing accordion + billing-entity picker + Reject/Approve),
  Edit registered, Suspend, Reactivate, Invite publishers.
- **Integrations** — `integrations.html` (`pages/integrations/index.vue` + `components/integrations/indexer-form.vue`).
  Centered card column: Indexer API Keys, Media API Keys (Ahrefs/Majestic/Moz provider cards with active
  switch that dims+disables metric checkboxes; Moz has 2 key inputs), API Requests (date-range popover +
  per-provider stat cards). Save → toast.
- **Customization** — `customization.html` (`pages/customization/index.vue` + `components/customization/*`).
  Sub-tabs Orders and Order Items / Price Formation (`?tab=price`). Orders: status list (locked root
  ORDER_QUEUE edit-only, draggable manual statuses Edit+Delete, locked automated edit-only), New. Price
  Formation: inline-editable rules table (Range from/to, Fee %, Additional fee) + per-row Save/Delete,
  New adds row, empty state. Modals: New status, Edit status, Delete status (conditional reassign block
  when status has order items — "Yes, delete" disabled until a target is picked), last-manual guard.
  NOTE: no page-level H1 (the real page has none — per-tab heading instead).

- **Billing entities** — `billing.html` (`pages/billings/index.vue` + `components/billingEntities/*`) and
  `billing-detail.html` (`pages/billings/_id/index.vue` + `components/billingEntities/details/*`).
  - List: table (Company name + reg. no, Status green-dot Active / amber-dot Verification, Created by,
    Created, Projects, Reserve/Spent/Available in EUR), row click → detail, status-aware row `⋯` menu
    (Open, Deposit, Set active [disabled if Active], Set verification [disabled if Verification], Edit,
    Delete), search by name/reg, empty state (`?empty`). Modals: **Add** = 2-step wizard (Company details
    → Company address; `.wz-steps` stepper; VAT input + "No VAT number" switch), **Update** = tabbed
    (Company details / Company address), **Delete** (danger).
  - Detail (`billing-detail.html?id=1|3&tab=…`): back-link + title + status badge inside the settings
    shell (real app uses a `page` layout; kept in-shell for nav consistency). Tabs: **Details** (company
    card + Balance meter Reserved/Spent/Available + Deposit btn), **Deposit** (Bank cards 4% / Wire transfer
    payment cards + To-balance summary with fee/VAT/total; VAT rate computed like `deposit_vat`: EU+no-VAT
    24%, reverse-charge / non-EU 0% + directive; Wire → "Invoice ready" modal), **Transaction history**
    (balance summary + search/Filters/Date/Export toolbar + typed rows w/ inflow-outflow icons + Filters
    modal), **Linked projects** (project/brand table), **Invoices** (Prepayment/Paid subtabs; status
    badges + Stripe/Wire pills; context actions View/Pay/Approve/Cancel). Detail modals: **Cancel
    prepayment** (danger), **Approve wire transfer** (details + paid date). Deposit tab is gated to a
    permission message when status ≠ Active (try `?id=3`).
  - CSS: all billing classes appended to `styles.css` under the "BILLING ENTITIES" banner (`.b-*`,
    `.wz-*`, `.pill/.pill--stripe/.pill--wire`, `.tx-*`). No production data/copy invented —
    labels/paragraphs lifted from the `.vue` sources.
  - Post-review tweaks (user feedback): Billing nav item cross-linked from every settings page;
    Balance uses soft dots + a stacked proportion `.b-meter` (not saturated bars); Deposit cards use a
    left radio + white-tile method icon (no checkmark/icon collision); Transaction icons are the
    supplied incoming(green)/outgoing(dark) badge SVGs (`ICON_IN`/`ICON_OUT`); tx reference numbers are
    clickable `.tx-ref` buttons; Project/Brand shows project domain + brand underneath; the Date button
    is a working `.dr` range popover that actually filters (parses "DD Mon YYYY"); method chips are soft
    tinted `.pill`s; invoice action buttons are `btn--xs`. Transaction icons recoloured to tokens
    (`var(--bg-sunken)` tile, `var(--text-muted)` glyph, `var(--green)` in-badge, `var(--accent)`
    out-badge). Deposit "To balance" summary reorganised as an itemized receipt (`.b-receipt`/`.b-rrow`/
    `.b-rtotal`): restates "Amount to balance" so the breakdown adds up, total is the emphasised figure
    with a divider, VAT reason + directive demoted to muted footnotes.

- **User roles** — `roles.html` (`pages/roles/index.vue`) + `role-create.html`
  (`pages/roles/create.vue`, `pages/roles/_slug/index.vue`, all `components/roles-wizard/*`).
  - Index: two tables — **Admin roles** (custom; Name + a single-select **Registration** radio that
    picks the default signup role + Edit/Duplicate) and **Other roles** (predefined; Edit/Duplicate).
    "New role" → `role-create.html`; Edit → `role-create.html?edit=<name>`; **Duplicate** modal
    (name input, "same permissions as X"). `.rl-*` classes.
  - Wizard (`role-create.html`): left step rail (`.rw-side`, checkmarks for completed steps) + content
    (`.rw-main`) + footer. **Schema-driven** — a `STEPS` array in JS encodes every step→section→row so
    the whole permission tree is data, not hand-written markup. Row types: `toggle` (switch), `select`
    (opens the shared floating `.amenu`), `input` (extra-price + EUR addon), `notif` (In-app/Email
    checkbox pair), `rolename`. Each step (except General/Onboarding/Complete) has a **master switch** in
    its header; when off the sections dim + controls disable. Steps + copy lifted verbatim from the
    12 `Step*.vue`: General, Market, Orders, Brands, Invoices, Analytics, Settings, Background tasks, FAQ,
    Notifications, Onboarding, Complete setup. **Create mode**: Back/Next, "Create role" on last step
    (needs a role name), "New role" heading. **Edit mode** (`?edit=`): "Role settings" heading, all steps
    pre-completed, no Complete step, per-tab Cancel/Save (enabled once dirty), name prefilled.
  - CSS under the "USER ROLES" banner (`.rl-*`, `.rw-*`). NOTE: publisher-variant steps
    (`roles-wizard/publisher/*`) and the predefined `_slug` page were not separately built — the admin
    wizard covers the pattern; add publisher variants later if a publisher-role builder is needed.

**All seven settings tabs are now built** (Users · User roles · Billing entities · Currencies ·
Publishers · Integrations · Customization).

## Also update
`~/.claude/.../memory/settings-ml3-mockup.md` tracks progress — update the Done/Next lists when a tab
is finished. (Auto-memory index: `MEMORY.md`.)

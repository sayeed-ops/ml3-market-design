# Market redesign — handoff (ML3)

> **Naming:** this design was formerly "Mercury v2" and is now the **main ML3 design**, living at
> `design-mockups/market-ml3/` (design system: `design-mockups/system-ml3/`). The older
> explorations (`market`, `market-linear`, `market-mercury` v1, `system`, `system-linear`) were moved
> to `design-mockups/archive/`. "Mercury" below refers to this design system's visual style (clean
> white, Geist/Inter) — the name was kept for the style, not the directory.

Static HTML/CSS/JS mockup of the **Link market** (media marketplace) redesign — a **design
prototype**, not the production app. The real Vue/Nuxt app in the repo root is the **source of
truth for data/fields/labels** (see "Data model" below). Designer works in plain HTML/CSS; devs
convert to Vue/Tailwind later. Git branch: `redesign/market`.

> **Read this first if resuming:** the app **shell was reworked** — there is **no full-width top
> header anymore**. Navigation/brand/account all live in a **light floating sidebar** (table page
> only); the details page has **no sidebar and no header** (focused record view). See "App shell &
> navigation" below — it supersedes any older "sidebar/topbar shell" wording.

## Files
`design-mockups/market-ml3/`
- `index.html` — **market table page**. Markup + several inline `<script>` IIFEs at the bottom
  (table/cart logic, the filters popover, the row-actions relocation pass, and the sidebar
  collapse/group-toggle).
- `pager.js` — **shared pagination component** (`window.renderPager(el, {page,pageSize,total,sizes}, {page,size})`).
  Linked by index.html + drafts.html. Page-based, **Prev/Next only** (rows-per-page pill select ·
  "X–Y of N" · "Page p of P" · refined Prev/Next buttons) — no numbered strip, so it's clean at any
  page count. CSS: `.m-pager`/`.pg-*` in styles.css.
- `details.html` + `details.css` — **media details page** (prod route `/market/{id}`).
- `drafts.html` — **Drafts page** (prod route `market/drafts`). Links `styles.css`. See "Drafts page".
- `checkout.html` + `checkout.css` — **checkout page** (prod route `/cart`). See "Checkout page".
- `styles.css` — table-page + **shell/sidebar** styles (details.html + drafts.html also link it for
  shared chips/buttons and the shell).
- `logo-mlpro-light.png` — Motherlink PRO wordmark (light bg), used in the sidebar. Copied from
  repo `static/logo/`. (`logo-mlpro-dark.svg` also present but currently unused — was for the old
  dark sidebar.)
- `_drv.html` (stale duplicate of index.html — ignore) · `*.bak` (old snapshots — ignore).

`design-mockups/system-ml3/` → `tokens.css` · `base.css` · `components.css` — the shared
ML3 design system (clean white, Geist/Inter, CSS variables for color/space/radius/shadow).
**Reuse these tokens/components — never hardcode colors or spacing.** Append page-specific
overrides at the END of styles.css / details.css.
- **Note:** `.checkbox` (components.css) now shows a **white tick when `:checked`** and a **dash when
  `:indeterminate`** (SVG data-URI backgrounds) — affects every checkbox across the system.
- **Note:** `--space-7: 28px` was added to tokens.css this session (it was referenced but
  undefined, which had silently zeroed `.d-content` padding). The scale is 1=4 2=8 3=12 4=16 5=20
  6=24 7=28 8=32 10=40.

Reference only (archived): `design-mockups/archive/market-mercury/` (v1) and other archived
`market*`/`system*` dirs under `design-mockups/archive/`.

**View:** open the HTML directly in a browser (no build step). Needs internet — favicons (Google)
and flags (Twemoji) load from CDNs. **Self-verify** with headless Chrome:
`"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --screenshot=/tmp/x.png --window-size=1440,1000 "file://<abs-path>"` then Read the PNG. To drive JS state for a shot,
copy the file to `_verify.html`, append a `<script>` that runs on load (e.g. open a popover/modal),
screenshot with `--virtual-time-budget=4000`, then delete it.

## App shell & navigation (current — replaces old header/sidebar)
Layout root: `.m-app` is a **flex column**. Its child is `.m-shell` (**flex row**) containing the
sidebar + `.m-main`. **There is no `.m-topbar` global header** (removed — markup + the `.m-topbar`
CSS is dead but harmless if any remains).

**Sidebar (`#m-sidebar`, table page only) — the sole navigation/brand/account.**
- **Floating panel framed like Untitled UI:** body is light grey `#f5f6f8` on a slightly lighter
  canvas (`.m-shell` `#f9fafb`); separated by a **white outline** (`border: 3px solid #fff`) **+ a
  hairline border** (`box-shadow: 0 0 0 1px var(--border)`) + soft lift shadow. Rounded, floats with
  16px margin (`margin:16px 0 16px 16px`, sticky `top:16px`, `height:calc(100vh - 32px)`).
- **Top row `.m-side-top`:** logo (`.m-brand` → `logo-mlpro-light.png`) left, **collapse toggle**
  (`#m-side-toggle`) right.
- **Nav `.m-nav`** mirrors the **real app's top-level nav** (from `values/pages/*`, by `position`),
  **no Dashboard/Tasks**. Items with sub-pages are **expandable accordion groups**
  (`.m-nav__group`/`.m-nav__parent` + `.m-nav__sub`/`.m-nav__child`, chevron `.m-nav__chev`):
  - **Market** ▸ Link market (active) · Managed services · Drafts `12`
  - **Orders** ▸ Orders · Order items `5` · All links
  - **Projects** (single) · **Invoices** (single)
  - **Analytics** ▸ By ordered date · By live date
  - `.m-nav__spacer` (flex), divider (`.m-nav__div`), then **Support** · **Settings**.
- Labels are **semibold**, icons/children `text-secondary` (deliberately bolder/darker for contrast
  on the grey body). Hover = white lift; active = `accent-tint` purple pill. Optional count badges
  `.m-nav__cnt`.
- **Foot `.m-side-foot`:** white bordered **user card** `.m-user` (avatar + green dot · name · email
  · ⋯).
- **Collapse:** toggle collapses to a **64px icon rail** (`--side-w` 224↔64). Labels/text hide,
  icons center, single items show **hover tooltips** (`data-label`), accordion groups show a
  **hover flyout** of their children. **Defaults to collapsed below 1280px viewport**; remembers
  choice in `localStorage['ml-sidebar']`. JS (bottom of each file): toggles `is-collapsed` on
  `#m-sidebar`; a delegated click on `.m-nav__parent` toggles `is-open` (ignored when collapsed).
  Guarded with `if (!sb) return` so it no-ops on the sidebar-less details page.

**Floating page-action bar (`.m-pageacts`, table page).** Absolute top-right inside `.m-content`
(which is `position:relative`). Holds **page-specific actions on the left** (Drafts button · Settings
as an **icon-only** dropdown) then a divider, then the **persistent global icons on the right**:
**Notifications · Basket** (always the last two). Basket = `#hdr-cart` (badge `#hdr-cart-count`,
opens the basket drawer; kept in sync by `syncCart`). Currently **scrolls with the page** (not
pinned) so it never covers the table's Price column — could be made sticky if a sticky table header
is added too.

## Architecture / conventions
The table is **static HTML enhanced by JS on load** (DRY across the 16 sample rows):
- Per-row data lives in a **`ROWDATA`** map keyed by domain (top of the table `<script>`):
  conditions (do/sp/dur), tags, content, last-order. Per-niche prices live in each row's
  `data-prices` attribute. Edit a row's data there, not in markup.
- A **final column-restructure `<script>`** (last in the file) runs after all other passes: it
  (1) **enriches `data-prices`** — the non-standard niches get realistic premiums (`MULT`, e.g.
  casino ×1.6) with deterministic per-domain availability (hash; ~68% available), writing back to
  `data-prices` so the buy-box, niche picker and Niches column all agree; (2) **rebuilds each
  row's buy-box `.ntable`** + "Not priced" line from those prices; (3) **folds the standard Price
  into the Media cell** and **removes the Price column**; (4) **reorders columns** (perm derived
  from header labels) and **inserts the Niches column** after Conditions. The standard Price chip
  keeps class `.price-cell`/`.price-pill` so `setNiche`/`priceInfo` keep working.
- JS renders: flags+language, the **Tags** column (injected after Category), conditions/duration
  pills, the buy-box pricing table, the price chips. A late IIFE **relocates the row ⋯ menu next to
  the + Add button** inside the media cell and **removes the empty trailing actions column** (expand
  `colSpan` is recomputed). Open-site row icon was removed (still in the ⋯ menu).
- One unified `applyFilters()` (status `data-status` + text search) filters rows, then `paginate()`
  page-slices the surviving rows (off-page rows get `.pg-hide`) and renders `#m-pager` via
  `renderPager`. Default page size 10 (options 10/25/50/100); any filter/search/tab change resets to
  page 1. **Production drives `total` from the server (thousands)** — the mockup shows the honest
  sample count (e.g. "of 16"); the ellipsis page-list already scales to hundreds of pages.
- A few late-in-file CSS rules intentionally override earlier ones — append new overrides at the end.

## Current state — table page (`index.html`)
- **Columns (buyer-first):** Media·Publisher **(+ standard Price chip · Add · ⋯)** → Traffic →
  Country·Language → Authority → Spam → Conditions → **Niches** → Category → Tags. The old right-hand
  actions column was removed; the **standard Price was folded into the Media cell** as a single
  horizontal cluster (`.m-buy`): the **price chip is anchored at the cell's right edge** (always
  visible, **semibold**) and **Add + ⋯ reveal on hover to its LEFT** (`.m-buy-acts`), reserving space
  so the price never shifts. **Add is an ink/black CTA** (`background:var(--text)`) so it doesn't
  clash with the purple price chip; in-cart → green "✓ Added". The **"Price · <niche>" label** lives
  in the Media `<th>`, right-aligned above the chips (the original `price-th` content — incl. the live
  `.price-ctx-niche` node — is *moved* there, not recreated, so `setNiche` keeps updating it).
  Status = top sub-tabs; Assignee in the expand.
- **Category / Tags "+N" overflow** → hovering the cell shows the full list in the shared
  `.niche-tip` tooltip (generic `[data-tip-h]`/`[data-tip-b]` triggers; the `.cnt` gets a dotted
  underline hint). Tags now sits **after** Category (last column).
- **Sticky first column (market):** the media cell + header are `position:sticky; left:0` with opaque
  state backgrounds, a **persistent `border-right` separator**, + an edge shadow once scrolled. A
  `scroll` handler on `.m-table-card` toggles `.m-table.is-scrolled` at the threshold and, on crossing,
  **moves the single `.price-cell` under the domain** (publisher line + header Price label hide via
  CSS); scrolling back restores it. One node is moved (not duplicated) so `setNiche` stays in sync.
  The swap is **eased** (publisher collapses via `max-height`/opacity, price fades+slides in via the
  `mPriceTuck` keyframe) so it's a micro transition, not a hard snap.
  `.m-table-card` has `overscroll-behavior-x: contain` so the h-scroll doesn't rubber-band the layout.
  Because the frozen cells carry a z-index, the floating cart bar (`.m-cart`) was raised to `z-index:45`
  (above the sticky column, below the drawer at 60) so it spans the full width over the media column.
- **The domain is NOT a link** — opening details by clicking the row felt misleading; use the ⋯ menu's
  "View details" or the expanded panel's button (both call `openDetails`).
- **Return-to-position:** `openDetails` stashes `sessionStorage['ml-return']` (domain · open? · status ·
  search · niche · page · scrollLeft). A final script on index.html consumes it on Back: re-applies the
  view (clicks the status tab / sets search / picks niche / advances the pager), re-expands the row if
  it was open, briefly highlights it (`.is-justviewed`), then `scrollIntoView`s it (+ restores
  horizontal scroll). So coming back from details lands on the same media — works from both the
  expanded panel and the ⋯ dropdown. (Whole-page vertical scroll behaves normally; a headless-only
  blank band can appear when scrolled far — not a real-browser issue.)
- **Wide table scrolls horizontally** (`.m-table-card` `overflow-x:auto`). To keep the expanded
  panel's buy-box + **Add to cart** CTA from scrolling off-screen, **`.m-exp-inner` is sticky-left**
  and JS (`fitExpands()` in the restructure pass, re-run via a `ResizeObserver` on the card — covers
  window resize + sidebar collapse) sets its width to the card's **visible** width. So the whole
  expanded detail stays pinned in the viewport no matter how far right the row is scrolled.
- **Authority cell** (`.auth`): each line is a 3-col grid — faint `SOURCE` (Ahrefs/Moz/Maj) · muted
  metric key (DR/DA/TF) · **value chip right-aligned** (`.auth-v`, neutral `--bg-sunken`; tier-hi
  keeps accent), so all values align in a column and read clearly as values vs labels.
- **Niches column** = crisp icon tiles (`.nicheic`, `--bg-sunken` rounded tiles) showing **only the
  non-standard niches this media is actually offered for** (casino·betting·crypto·forex·cbd·loans·
  adult). Availability reads at a glance from which/how-many tiles appear (none → faint `—`); hovering
  a tile shows a styled tooltip (`.niche-tip`) with the niche price. Icons are inline SVGs in
  `NICHE_ICON` (dice/trophy/coin/swap/leaf/bank/heart). Earlier greyed-out "unavailable" icons were
  dropped as too noisy/unnoticeable.
- **Content header:** the **"Link market" H1 was removed** (the `Managed services | Link market`
  tabs already label the page); the description sub-line stays. Page/global actions are in the
  floating `.m-pageacts` bar (above). Status sub-tabs unchanged (no "All"; **Market** default).
  Toolbar: **Saved searches**/Offers/Niche dropdowns, **Filters** popover, Clear all, right-side
  Search. **Saved searches** (`#saved-drop`, was the "All publishers / Saved views" dropdown):
  button label defaults to "Saved searches" (the empty state) and shows the active search name when
  one is applied; the list is **working** — pick to apply/toggle, **+ Save current** names + stores
  the current view (captures the mock result count), **Manage** toggles per-row delete. Persisted to
  `localStorage['ml-saved-searches'/'ml-saved-active']` (seeded with 3 samples). The
  **active-filter chips row** under the toolbar was **removed** (`#active-filters` markup deleted);
  the `Filters [N]` badge still tracks the applied-filter count (`renderChips` sets it before the
  now-absent chip render).
- **Color discipline (Price is the hero):** **Price** = filled-tint accent pill (`.price-pill`).
  **Authority high-DR** keeps the purple chip (`.auth-v.tier-hi`). **Category** chips are now
  **grey, identical to Tags** (`.tagchip`, 11px). **Duration** chips are a single **deep blue**
  (`#1f4fbf` on `#e7edfa`) for Permanent / 1 year / 1yr·upgradable — no hierarchy between them (not a
  buying signal). **Traffic** numbers are medium (500) weight. Condition status colors
  (Dofollow green / Sponsored amber / Nofollow red) unchanged.
- **One row expanded at a time** (accordion): opening a row collapses any other open row.
- **Spacing:** uniform **16px** rhythm — `.m-content` padding 16, sidebar margin 16 (right margin 0
  so the sidebar→table gap is just the content's 16px padding). Table cell horizontal padding 14px.
- **Note indicator / Read-more popover / buy-box pricing table** — unchanged (see below + Gotchas).
- **Buy-box pricing table** (in each expand) column order = **Niche · Stock price · Margin · Price**,
  set by DOM. ⚠️ Don't reintroduce a `grid-column` reorder (wraps Stock/Margin to a 2nd row).

### Filters popover (`#filter-drop` → `.filterpop`)
Unchanged this session. Left-rail grouped popover mirroring `filter.data.js` (General · Media
properties · Metrics · Price) with live count badges + 2-col field grid. Active-filter chips under
the toolbar (`#active-filters`, removable + Clear all; `Filters [N]` = chip count). Conditions =
toggle pills; Metrics grouped by source + quick-presets; Price = active-niche min/max + "by other
niche" expander. **Mock:** count is a formula; filters don't actually filter the 16 rows; a sample
state is seeded on load.

### Cart / basket
- **Cart keys by `domain||niche`** → `{dom,niche,str,num}`. **Persisted to `localStorage['ml-cart']`**
  — **shared with the details page**.
- **Add to cart = multi-select niche picker** (`#niche-pop`): + Add opens a popover of priced niches;
  toggling adds/removes lines. Bulk "Add to cart" adds selected rows at the active niche.
- **Cart bar** (`.m-cart`): muted `Clear all` + `View basket` (ghost) + `Checkout →` (primary).
  `View basket` **and the global header-basket (`#hdr-cart`)** open the **basket side drawer**
  (`#basket-drawer`): lines, subtotal, `Complete purchase`.
- `toNum()`/`fmtEur()` handle price parsing (decimals kept, thousands-commas dropped). `Checkout →`
  / full checkout route is a **stub**.

## Current state — media details page (`details.html`)
Faithful Mercury rebuild of `pages/market/_id.vue` (admin view), now a **focused record view: no
sidebar, no global header.** The only top chrome is the **sticky sub-bar `.d-bar`** (`top:0`):
**‹ Market back**, favicon, domain (accent pill + external link), history icon, Update metrics,
**Add to cart**, then the persistent global **Notifications · Basket** icons (basket links back to
`index.html`). Content (`.d-content`) is a centered max-1280 column with 16px side gutters.

Sections (all covered): **General** (Publisher · Activities · Info for admin · Note · Offers) ·
**Media properties** (Country/Languages · Conditions + Prepayment · Category #1–3 · Tags) ·
**Metrics** (Overview · Topical · Ahrefs · Majestic · Moz + "Metrics updated") · **Stock price** ·
**Price** (+ Publisher original currency · Original price) · **Margin** · **Link history**
(Imported/Purchased tabs). Layout in `details.css`.

- **Data-driven from the clicked row** (`sessionStorage['ml-media:<domain>']`, falls back to a
  thecricketpaper SAMPLE). Section bodies carry ids; `window.__media` holds the data. "Agency" is
  labeled **Publisher**. Link history is illustrative sample.
- **Stock/Price/Margin tiles** (`.d-panel--niche`): equal-width flex tiles that now **wrap**
  (`flex-wrap`, `flex:1 1 200px`, min-width 200) — 3 niches fill one row, more wrap to additional
  rows. "Not priced: …" note (`#d-niche-un`) lists the rest of the 8 niches.
- **Edit modals** (`#edit-modal`, event-delegated so they survive section rebuilds; prefill from
  `window.__media`). This session:
  - **Price section's Edit button was removed** (Price is derived server-side; read-only).
  - **Stock price modal edits ALL 8 niches** (standard·casino·betting·crypto·cbd·forex·loans·adult)
    as full-width rows; **Price modal edits only the media's priced niches**.
  - **Permanent-post-price field is conditional** — only shown when Publication duration =
    "1 year (permanent available for extra price)"; toggles live on duration change.
  - **Country / Language / Category #1–3 use a searchable combobox** (`searchSelect()` →
    `.fm-combo`: trigger + search input + filtered option list, fixed-positioned so the modal's
    overflow can't clip it). Option lists expanded to realistic lengths.
  - **Stock-price Save is wired** (the only one): it reads the niche inputs, derives Price (mock
    ~12% markup) + Margin, writes to `sessionStorage`, and reloads — so you can **preview how a
    listing renders with any number of niches**. All other modal Saves just close.
- **Add to cart** opens the niche picker (`#d-niche-pop`), writes to shared `localStorage['ml-cart']`;
  button shows "✓ In basket (N)". Back button uses `history.back()` else `index.html`.

## Current state — Drafts page (`drafts.html`)
Prod route `market/drafts` (`pages/market/drafts/index.vue`). **A Draft = a saved cart** — a named
basket of media (+ niche + price) parked instead of checked out; it can be assigned, approved, then
turned into an order. Statuses: `DRAFT→Pending`, `APPROVED→Approved` (mockup adds `Ordered`).
- **Self-contained page**, reuses the shell/sidebar (Drafts active) + table/segment/bulk/checkbox
  styles from `styles.css`. Rows are **rendered by JS from a `DRAFTS` data array** (id · name ·
  created · createdBy · assignee · status · items[]); media count + total are derived.
- **Layout:** H1 + sub → status segments (All/Pending/Approved/Ordered, also **filter** the table) +
  **Parked value** total → toolbar (Project/Created by/Assignee dropdowns — visual mock — + working
  search) → bulk bar → table → empty state.
- **Columns:** Draft (name + **stacked media favicons** `.fav-stack`) · **Project · Brand**
  (`.dr-proj`: project bold + brand muted) · Created · Created by (avatar `.av` + name) · Assignee
  (avatar, or **"+ Assign"** affordance when empty) · Media count · **Total** (accent `.price-pill`) ·
  Status pill (`.st-pending/-approved/-ordered`) · hover actions. (Expand colspan = 9.)
- **Inline expand** (accordion, reuses `.m-exp`/`is-open`): line-items grid (media · niche · price)
  + footer "N media · €total" with **Approve** + **Resume in Market →** CTAs. NB the niche chip is
  wrapped in a `.dr-item-n` cell — `.dr-item` is `display:contents`, so a bare `.tagchip` would
  become a grid cell and inherit the cell flex/padding/border (renders as a tall grey block).
- **Working interactions:** row click expands; checkbox select → bulk bar (**Approve/Assign/Delete**);
  row ⋯ menu (Resume/Rename/Duplicate/Assign/Delete); status-segment filter + search; summary +
  parked-value recompute. Edits are in-memory (reset on reload).
- **Pagination** (`#dr-pager`, shared `renderPager`): `render()` slices `visible()` by `state.page`/
  `state.pageSize` (default 10; options 10/25/50). Filter/search/status changes reset to page 1.
  Seed has 13 drafts so it spans 2 pages.
- **Create path:** `drafts.html` reads **`localStorage['ml-drafts']`** and **prepends** any drafts
  found there above the seed samples. The **checkout page's "Save as draft"** now writes this key
  (shape `{id,name,project,brand,created,createdAbs,createdBy,assignee,note,status:'pending',items:[{dom,niche,num}]}`)
  then redirects here — so parking a basket as a draft round-trips end-to-end.

## Current state — Checkout page (`checkout.html` + `checkout.css`)
Prod route `/cart` (`pages/cart/index.vue` + `components/cart/PlaceCard.vue`, per-item
`components/orders/ContentRequirementsForm.vue`). **Full flow** built this session — was the last
stub (`Checkout →` / drawer "Complete purchase" now navigate here). **Focused record view like the
details page: no sidebar, no global header**, just the sticky `.d-bar` (‹ Basket · "Checkout" ·
Notifications · Basket icon). Reuses `system-ml3` tokens + `details.css` `.d-*`/`.fm-*` controls.
- **Layout:** centered `.co-content` → `.co-grid` = main column + **sticky `.co-summary` rail**.
- **Step ① Connect a project:** **searchable dropdown** `.co-combo` (mirrors `CartProjectDropdown.vue`):
  rows **grouped by brand**, each showing **Project budget** + **Entity balance** (red + ⚠ when short
  of the order total). Sample `PROJECTS` carry `brand · name · budget · wallet · billing`
  (`verified|unverified|none`). **Billing model:** a billing **entity funds many projects**, so
  **entity balance (`wallet`) is always ≥ a single project `budget`**; projects under one entity share
  its balance (Acme's two projects both show €45k). Keep this invariant if editing the sample data.
  On select, `.co-flag` checks show billing ✓/⚠ + entity-balance covers-total ✓/⚠ (prod late-blockers,
  surfaced **up front**). (No verification badge — there's no entity name shown to anchor it.)
- **Adaptive CTA** (mirrors `PlaceCard.vue` state machine, in `update()`): billing **unverified** →
  alert, Place disabled, no Deposit. Wallet **short** (and not unverified) → "Insufficient wallet
  balance" alert (msg differs if `billing:'none'`) + a deposit CTA labelled **Deposit** (entity exists)
  or **Set up billing** (`billing:'none'`), which **replaces Place**. Otherwise **Place order** (enabled
  once all items ready). The deposit CTA is mirrored in **two places** — the summary rail (`#co-deposit`)
  AND inline in the project card (`#co-proj-cta`, with a hint) — both use class `.co-depositbtn` (one
  delegated mock handler). Real route TBD.
- **Step ② Items & requirements:** one `.co-item` card per basket line (read from
  `localStorage['ml-cart']`). Header = fav · domain · niche · type · `.price-pill` · **Ready/Needs-info
  badge** · chevron · remove. Body is built by `coreForm()` + `extraForm()` and **the field set varies
  by toggle** (mirrors `ContentRequirementsForm.vue`):
  - **Order type** `guest_post | link_insertion`. **Link insertion** = NO content-by; just Target URL +
    Anchor + Comment.
  - **Guest post** shows **Content by** `motherlink | me`. **Motherlink** = Target URL, Anchor,
    placement, language, **Number of words + live fee** (`words × €0.075`), then extras: article topic,
    keywords, **trust links** (addable chips), images dropzone + "Let Motherlink choose images",
    comment. **Me** = Target URL, Anchor, comment, **article upload** dropzone.
  - Per-item state in `reqs{}` keyed by cart key. **Ready** = url+anchor (+ language+words when
    Motherlink-guest). Completion **meter** ("X of N ready" + bar). Content fee only for Motherlink-guest.
  - **Expanded body is 2-col:** editable form in `.co-reqs` (left) + a **read-only `.co-info` media
    panel** (right): conditions (dofollow/sponsor/**permanent** — shown as `+€N` when upgradable),
    publisher + emails, a prominent amber **Info for admin** note, **Price** (+ a **Permanent post +€N
    checkbox** when `permExtra>0`), and **Invite users**. Built by `infoPanel(e,k)` from `info(dom)`
    (memoized `mediaInfo` — **mock, derived deterministically from the domain**; cart only stores
    dom/niche/str/num, so wire to real media data in Vue). `rerenderScope()` swaps only `.co-reqs`;
    `rerenderInfo()` swaps `.co-info`. Stacks (`column-reverse`) under 980px.
  - **Permanent upgrade:** `reqs[k].perm` adds `info(dom).permExtra` to that line via `lineNum(k)` →
    flows into subtotal/VAT/total + the header "· +Permanent" tag. (Prod: `permanent_post_checked`.)
  - **Invite users** (`reqs[k].invited`): the panel's + Add opens the **`#invite-modal`** — searchable
    `USERS` directory (avatar · name · email · role), multi-select, Save. Invited users then show as
    overlapping avatars in the panel. Per item.
  - **View details** opens a **right slide-over drawer** (`#co-drawer`, `drawerHTML()`) — NOT a nav to
    details.html. Full read-only record (Info for admin · Media properties · Media metrics · Activity
    log · Prices) so you keep checkout context; footer has Close + "View media page" (→ details.html).
- **Fill once → apply to all** (`<details>` `.co-applyall`): a compact template carrying its **own type +
  content-by toggles** + core fields (rendered via the SAME `coreForm`). "Apply to all items" copies
  type/by/url/anchor/placement/language/words/comment into every item — **so the field set stays
  consistent when the toggle differs** (the issue raised in review). Per-item overrides still allowed.
- **Save for later** = a single **`.co-menu` dropdown** (not separate buttons): **New draft** (→ name
  modal) · **Add to existing draft** (→ picker modal, appends to a draft) · **Add to package** (→ mock
  picker). New/existing-draft both write `ml-drafts` (shared with drafts.html) then go to Drafts.
- **Summary rail:** sites subtotal · content · **Total** (no VAT — removed per request; total = items +
  permanent upgrades + content). CTAs are 44px (`.co-cta`); Place order is iconless (the lock lives only
  on the `.co-secure` line). Place → clears `ml-cart` + **success overlay** (`.co-success`).
- **Mock:** projects/wallet/fees/packages are sample; no real payment or file upload. Totals,
  field-set switching, validation + CTA state are all live.
- **Visual polish:** segmented toggles carry icons (`IC` map → `.co-seg__ic`); status pills are built
  by `badgeHTML()` (check / clock icon); the completion meter swaps its bar for a check when done
  (`.co-meter.is-done`); step badges are filled-accent; Place order has a lock + a `.co-secure` line;
  Order summary has a header icon. Item cards lift on hover. All using existing tokens — keep it
  restrained (no heavy gradients/shadows) if extending.

## Data model = the real app (source of truth)
When you need exact fields/labels/enums, read these (NOT the mockup):
- `pages/market/_id.vue` + `pages/market/view/admin.vue` — the detail page
- `pages/market/data/fields.data.js` — table column keys + labels
- `pages/market/data/filter.data.js` — filter form structure
- `components/market/details/{MediaProperties,MetricsProperties,PriceProperties}.vue`
- `components/market/details/Update*Modal.vue` — edit-modal field lists
- `pages/market/publisher.vue` (~L730) — Conditions pills + tooltips
- **Navigation:** `components/v/nav/Sidebar.vue` renders `values/pages/*` (`market`, `order`,
  `brand`→"Projects", `invoice`, `analytics`, `tasks`, `index`), filtered by `meta.top === true`
  **AND `$acl.isAllowAny(page.access)`**. So items are **permission-gated** — e.g. **Invoices**
  requires `access:["INVOICE"]`; a role without it won't see it. The mockup shows the full admin set.

Metric sourcing: Country = Ahrefs · Language = Majestic · DR/RefDomains/Keywords/Traffic = Ahrefs ·
TF/CF/IP/IndexedURLs/TTF1/TTF2 = Majestic · DA/PA/SpamScore = Moz.

## Gotchas
- **Row ⋯ menu clipping:** `.m-table-card` is `overflow-x:auto`, which makes `overflow-y` clip too, so
  a `.menu__pop` opening downward gets cut off on the bottom rows. Both index.html and drafts.html have
  a `toggle`-capture detector that adds `.menu.is-up` (CSS flips the pop above the trigger) when it
  would clip at the card's bottom. Keep this if you add more `<details class="menu">` row menus.
- **No global header** anymore; the sidebar is the only nav on the table page; the details page has
  neither sidebar nor header (just `.d-bar`). Don't "restore" a topbar without checking with the user.
- `_drv.html` is a stale duplicate of `index.html` — NOT kept in sync.
- Needs internet (favicon + Twemoji CDNs).
- Table is JS-built — after structural edits verify column alignment (header `<th>` count vs each
  row's `<td>` count + the JS-injected Tags column; expand `colSpan` set by JS; the actions column
  is removed by a late IIFE).
- Sidebar/group JS keys off `#m-sidebar` / `#m-side-toggle` / `.m-nav__parent`; it's guarded so the
  details page (no sidebar) is safe.
- Don't reintroduce `grid-column` reorder in the buy-box `.ntr`.
- `--space-7` now exists (28px) — earlier its absence silently dropped `.d-content` padding.

## Open items / decisions pending (not done)
- **Width:** the standard Price is no longer its own column (folded into Media), which freed space,
  but the new **Niches** column adds some back. Tags still overlaps Category conceptually — merging
  them is still worth considering. Trim cell padding 14→~11px if it clips at laptop width.
- **Niche data is mock/derived:** premiums + availability are generated deterministically from the
  domain (not real). When wiring to Vue, drive the Niches strip + buy-box from the real per-niche
  price data instead of the `MULT`/hash enrichment in the final `<script>`.
- **Nav redundancy:** the sidebar **Market** accordion (Link market/Managed services/Drafts)
  duplicates the in-page `Managed services | Link market` tabs. Considered making **Market a single
  link** (keep Orders/Analytics as accordions) — not done.
- **Floating `.m-pageacts`** scrolls away (not pinned). Pin-on-scroll would need a sticky table header
  to avoid covering Price.
- **Checkout** (`checkout.html`) is built (full flow incl. per-type field sets, searchable project
  dropdown w/ budget/balance, adaptive Deposit/Place CTA, save-draft dropdown). Remaining polish:
  real content-fee schedule (mock is `words × €0.075`), actual file-upload wiring (dropzones are
  visual), `invited_users` + `permanent_post` per item (not yet surfaced), real Deposit/Add-to-package
  routes (mocks), and the **order/tracking page** the success overlay's "Track order" should land on
  (still → index.html).
- **Link-history** on details: real data or explicit empty state.
- Edit modals: validation/persistence if ever made interactive beyond the stock-price preview.

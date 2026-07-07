/* ============================================================================
   Shared sidebar user menu (system-ml3)
   ----------------------------------------------------------------------------
   Turns the sidebar `.m-user` card into a click-to-open account menu, mirroring
   the real app's ProfileDropdown.vue: header (avatar · name · email · role) →
   "Account settings" (→ account-ml3/account.html) → "Sign out" (mock toast).

   Self-contained: injects its own CSS + toast, reads name/email/initials from
   the existing card DOM. Drop `<script src="../system-ml3/usermenu.js"></script>`
   before </body> on any page that renders the `.m-user` card. The account link
   `../account-ml3/account.html` resolves from every sibling area folder.
   ============================================================================ */
(function () {
  "use strict";
  if (window.__mlUserMenu) return;            // guard against double-load
  window.__mlUserMenu = true;

  var ACCOUNT_HREF = "../account-ml3/account.html";
  var IC_ACCOUNT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="10" r="3"/><path d="M6.5 19a6 6 0 0 1 11 0"/></svg>';
  var IC_SIGNOUT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M15 12H4M8 8l-4 4 4 4"/><path d="M10 4h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-8"/></svg>';
  var IC_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-11"/></svg>';

  function inject() {
    if (document.getElementById("ml-usermenu-css")) return;
    var s = document.createElement("style");
    s.id = "ml-usermenu-css";
    s.textContent = [
      ".m-usermenu{position:fixed;z-index:300;width:244px;padding:5px;background:var(--bg,#fff);",
      "border:1px solid var(--border,#e6e8ec);border-radius:var(--radius-lg,12px);",
      "box-shadow:var(--shadow-lg,0 12px 32px rgba(16,24,40,.16));opacity:0;transform:translateY(4px);",
      "transition:opacity .13s ease,transform .13s ease;pointer-events:none;}",
      ".m-usermenu.is-open{opacity:1;transform:translateY(0);pointer-events:auto;}",
      ".m-usermenu__head{display:flex;gap:10px;padding:9px 9px 10px;}",
      ".m-usermenu__av{flex:none;width:38px;height:38px;border-radius:50%;display:grid;place-items:center;",
      "background:var(--accent,#3d3aad);color:#fff;font-size:13px;font-weight:600;letter-spacing:.02em;}",
      ".m-usermenu__meta{min-width:0;flex:1;line-height:1.35;}",
      ".m-usermenu__name{font-size:13px;font-weight:600;color:var(--text,#101828);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}",
      ".m-usermenu__email{font-size:12px;color:var(--text-muted,#667085);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}",
      ".m-usermenu__role{display:inline-block;margin-top:4px;font-size:11px;font-weight:600;color:var(--accent,#3d3aad);",
      "background:var(--accent-tint,#efeffb);padding:1px 7px;border-radius:999px;}",
      ".m-usermenu__div{height:1px;background:var(--border,#e6e8ec);margin:3px 0;}",
      ".m-usermenu__item{display:flex;align-items:center;gap:10px;width:100%;height:34px;padding:0 9px;",
      "font:inherit;font-size:13px;font-weight:500;color:var(--text-secondary,#344054);text-align:left;",
      "background:none;border:0;border-radius:var(--radius-md,8px);cursor:pointer;text-decoration:none;}",
      ".m-usermenu__item:hover{background:var(--bg-sunken,#f2f4f7);color:var(--text,#101828);}",
      ".m-usermenu__item svg{width:17px;height:17px;flex:none;color:var(--text-faint,#98a2b3);}",
      ".m-usermenu__item:hover svg{color:var(--text-secondary,#344054);}",
      ".m-usermenu__item--danger{color:var(--red,#d92d20);}",
      ".m-usermenu__item--danger svg{color:var(--red,#d92d20);}",
      ".m-usermenu__item--danger:hover{background:var(--red-bg,#fef3f2);color:var(--red,#d92d20);}",
      ".m-usermenu-toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:320;",
      "display:flex;align-items:center;gap:9px;padding:10px 16px;background:var(--text,#101828);color:#fff;",
      "border-radius:var(--radius-md,8px);box-shadow:var(--shadow-lg,0 12px 32px rgba(16,24,40,.16));",
      "font-size:13px;font-weight:500;opacity:0;transition:opacity .18s ease;}",
      ".m-usermenu-toast.is-show{opacity:1;}",
      ".m-usermenu-toast svg{width:16px;height:16px;color:#6ee7a8;}"
    ].join("");
    document.head.appendChild(s);
  }

  var menu = null, anchor = null;

  function build() {
    menu = document.createElement("div");
    menu.className = "m-usermenu";
    menu.setAttribute("role", "menu");
    document.body.appendChild(menu);
    menu.addEventListener("click", function (e) { e.stopPropagation(); });
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function populate(card) {
    var initials = (card.querySelector(".m-user__av") || {}).textContent || "?";
    var name = (card.querySelector(".m-user__name") || {}).textContent || "Account";
    var email = (card.querySelector(".m-user__email") || {}).textContent || "";
    var role = card.getAttribute("data-role") || "Super admin";
    menu.innerHTML =
      '<div class="m-usermenu__head">' +
        '<span class="m-usermenu__av">' + esc(initials.trim()) + "</span>" +
        '<div class="m-usermenu__meta">' +
          '<span class="m-usermenu__name">' + esc(name.trim()) + "</span>" +
          '<span class="m-usermenu__email">' + esc(email.trim()) + "</span>" +
          '<span class="m-usermenu__role">' + esc(role) + "</span>" +
        "</div>" +
      "</div>" +
      '<div class="m-usermenu__div"></div>' +
      '<a class="m-usermenu__item" role="menuitem" href="' + ACCOUNT_HREF + '">' + IC_ACCOUNT + "Account settings</a>" +
      '<button type="button" class="m-usermenu__item m-usermenu__item--danger" role="menuitem" data-signout>' + IC_SIGNOUT + "Sign out</button>";
    menu.querySelector("[data-signout]").addEventListener("click", function () { close(); signOut(); });
  }

  function place(card) {
    var r = card.getBoundingClientRect();
    var w = Math.max(r.width, 244);
    menu.style.width = w + "px";
    menu.style.left = Math.round(r.left) + "px";
    // measure height, decide above (default) / below if not enough room
    menu.style.top = "-9999px";
    menu.style.visibility = "hidden";
    menu.classList.add("is-open");
    var h = menu.offsetHeight;
    menu.classList.remove("is-open");
    menu.style.visibility = "";
    var top = r.top - h - 8;                       // open above the card
    if (top < 8) top = r.bottom + 8;               // fall back to below
    // keep within viewport horizontally
    var maxLeft = window.innerWidth - w - 8;
    menu.style.left = Math.max(8, Math.min(Math.round(r.left), maxLeft)) + "px";
    menu.style.top = Math.round(top) + "px";
  }

  function open(card) {
    if (!menu) build();
    anchor = card;
    populate(card);
    place(card);
    // reflow then animate in
    void menu.offsetWidth;
    menu.classList.add("is-open");
    card.setAttribute("aria-expanded", "true");
    document.addEventListener("click", onDocClick, true);
    document.addEventListener("keydown", onKey, true);
    window.addEventListener("resize", close, true);
    window.addEventListener("scroll", close, true);
  }

  function close() {
    if (!menu || !menu.classList.contains("is-open")) return;
    menu.classList.remove("is-open");
    if (anchor) anchor.setAttribute("aria-expanded", "false");
    anchor = null;
    document.removeEventListener("click", onDocClick, true);
    document.removeEventListener("keydown", onKey, true);
    window.removeEventListener("resize", close, true);
    window.removeEventListener("scroll", close, true);
  }

  function onDocClick(e) { if (!menu.contains(e.target) && !e.target.closest(".m-user")) close(); }
  function onKey(e) { if (e.key === "Escape") close(); }

  var toastEl = null, toastTimer = null;
  function signOut() {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "m-usermenu-toast";
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML = IC_CHECK + "You have been signed out";
    void toastEl.offsetWidth;
    toastEl.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("is-show"); }, 2400);
    // mock only — no real auth. Real app calls $auth.logout() then routes to /login.
  }

  function init() {
    inject();
    document.querySelectorAll(".m-user").forEach(function (card) {
      card.setAttribute("aria-haspopup", "menu");
      card.setAttribute("aria-expanded", "false");
      card.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (menu && menu.classList.contains("is-open") && anchor === card) { close(); return; }
        if (menu && menu.classList.contains("is-open")) close();
        open(card);
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

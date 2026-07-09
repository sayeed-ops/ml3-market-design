/* ============================================================================
   Shared "manage access" invite control — mirrors components/v/InviteUsers.vue
   (used by brand/project ShareModal + AddModal). A search-to-add input over a
   people directory + a bordered member list (avatar · name · email · role ·
   remove); the dedicated manager row is locked (no remove).

   Used by projects.html (brand create / new project / brand manage-access) and
   project.html (project manage-access). Loaded before those pages' scripts:
   <script src="access.js"></script>. Members are passed/mutated as an array of
   NAMES; email/role/manager are looked up from DIR.
   ============================================================================ */
window.mlAccess = (function () {
  "use strict";
  var DIR = [
    { name: 'Sayeed Khan', email: 'sayeed@motherlink.io', role: 'Account manager', manager: true },
    { name: 'Liviu Pop', email: 'liviu@motherlink.io', role: 'Outreach manager' },
    { name: 'Maria Silva', email: 'maria@motherlink.io', role: 'Content manager' },
    { name: 'Jose Garcia', email: 'jose@motherlink.io', role: 'Account manager' },
    { name: 'Priya Nair', email: 'priya@motherlink.io', role: 'SEO manager' },
    { name: 'Wong Wei', email: 'wong@motherlink.io', role: 'Outreach manager' },
    { name: 'Ana Ruiz', email: 'ana@brightspark.com', role: 'Client' },
    { name: 'Tom Lee', email: 'tom@brightspark.com', role: 'Client' }
  ];
  var AVC = ['#3d3aad', '#128a5a', '#b0791a', '#2f6bdd', '#d23b34', '#7c3aed'];
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function initials(n) { var p = n.trim().split(' '); return (p[0][0] + (p[1] ? p[1][0] : '')).toUpperCase(); }
  function color(n) { var h = 0; for (var i = 0; i < n.length; i++) h = n.charCodeAt(i) + h; return AVC[h % AVC.length]; }
  function av(n) { return '<span class="av" style="background:' + color(n) + '" title="' + esc(n) + '">' + initials(n) + '</span>'; }
  function info(name) { for (var i = 0; i < DIR.length; i++) if (DIR[i].name === name) return DIR[i]; return { name: name, email: name.toLowerCase().replace(/[^a-z]+/g, '.') + '@example.com', role: 'Member' }; }
  var TRASH = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>';
  var SEARCH = '<svg class="acc-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>';

  /* control(hostEl, members[names], opts) — renders + wires; mutates `members` in place */
  function control(host, members, opts) {
    opts = opts || {};
    function rowHtml(name) {
      var u = info(name), locked = !!u.manager;
      return '<div class="acc-row" data-name="' + esc(name) + '">' + av(name) +
        '<div class="acc-meta"><div class="acc-nm">' + esc(u.name) + (locked ? '<span class="acc-mgr">Manager</span>' : '') + '</div><div class="acc-em">' + esc(u.email) + '</div></div>' +
        '<span class="acc-role">' + esc(u.role) + '</span>' +
        (locked ? '' : '<button class="acc-rm" data-rm="' + esc(name) + '" title="Remove">' + TRASH + '</button>') +
        '</div>';
    }
    function render() {
      host.innerHTML =
        (opts.label === false ? '' : '<label class="pj-field__label acc-label">Invite users</label>') +
        '<div class="acc-search">' + SEARCH + '<input class="acc-input" type="text" placeholder="Search by name or email…" />' +
        '<div class="acc-results" hidden></div></div>' +
        '<div class="acc-list">' + members.map(rowHtml).join('') + '</div>';
      bindLocal();
    }
    function bindLocal() {
      var inp = host.querySelector('.acc-input'), res = host.querySelector('.acc-results'), list = host.querySelector('.acc-list');
      function showResults(q) {
        var avail = DIR.filter(function (u) { return members.indexOf(u.name) === -1 && (!q || (u.name + ' ' + u.email).toLowerCase().indexOf(q) !== -1); });
        res.innerHTML = avail.length ? avail.map(function (u) {
          return '<button type="button" class="acc-opt" data-add="' + esc(u.name) + '">' + av(u.name) +
            '<span class="acc-meta"><span class="acc-nm">' + esc(u.name) + '</span><span class="acc-em">' + esc(u.email) + '</span></span><span class="acc-role">' + esc(u.role) + '</span></button>';
        }).join('') : '<div class="acc-empty">No people found</div>';
        res.hidden = false;
      }
      inp.addEventListener('input', function () { showResults(inp.value.trim().toLowerCase()); });
      inp.addEventListener('focus', function () { showResults(inp.value.trim().toLowerCase()); });
      res.addEventListener('click', function (e) { var o = e.target.closest('[data-add]'); if (o) { members.unshift(o.getAttribute('data-add')); render(); host.querySelector('.acc-input').focus(); } });
      list.addEventListener('click', function (e) { var r = e.target.closest('[data-rm]'); if (r) { var i = members.indexOf(r.getAttribute('data-rm')); if (i > -1) members.splice(i, 1); render(); } });
    }
    var outside = function (e) { var res = host.querySelector('.acc-results'); if (res && !host.contains(e.target)) res.hidden = true; };
    document.addEventListener('click', outside);
    render();
  }

  /* dedicated-manager card HTML (the read-only block above the invite list) */
  function managerCard() {
    var m = DIR.filter(function (u) { return u.manager; })[0]; if (!m) return '';
    return '<div class="pj-mgr" style="margin-bottom:14px"><div class="pj-mgr__h">Your dedicated manager</div>' +
      '<div class="pj-mgr__row">' + av(m.name) + '<div class="pj-mgr__meta"><div class="pj-mgr__nm">' + esc(m.name) + '</div><div class="pj-mgr__sub">' + esc(m.email) + ' · ' + esc(m.role) + '</div></div></div></div>';
  }

  return { DIR: DIR, control: control, av: av, info: info, managerCard: managerCard };
})();

/* Reusable page-based pagination bar — Prev/Next only (scales to any number of
   pages without an infinite number strip). Shows rows-per-page · "X–Y of N" ·
   "Page p of P" · Prev/Next. Used by index.html (Market) and drafts.html (Drafts).
   renderPager(el, { page, pageSize, total, sizes? }, { page: fn(n), size: fn(n) }) */
(function () {
  var CHEVL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>';
  var CHEVR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';
  window.renderPager = function (el, st, cb) {
    if (!el) return;
    var sizes = st.sizes || [10, 25, 50, 100];
    var ps = st.pageSize, total = st.total;
    var pages = Math.max(1, Math.ceil(total / ps));
    var page = Math.min(Math.max(1, st.page || 1), pages);
    var from = total === 0 ? 0 : (page - 1) * ps + 1;
    var to = Math.min(total, page * ps);
    el.innerHTML =
      '<div class="pg-left">' +
        '<label class="pg-size">Rows per page <span class="pg-selwrap"><select class="pg-select">' +
          sizes.map(function (s) { return '<option value="' + s + '"' + (s === ps ? ' selected' : '') + '>' + s + '</option>'; }).join('') +
        '</select></span></label>' +
        '<span class="pg-range">' + from.toLocaleString() + '–' + to.toLocaleString() + ' of ' + total.toLocaleString() + '</span>' +
      '</div>' +
      '<div class="pg-right">' +
        '<span class="pg-page">Page ' + page.toLocaleString() + ' of ' + pages.toLocaleString() + '</span>' +
        '<div class="pg-steps">' +
          '<button class="pg-step" data-pg="prev"' + (page <= 1 ? ' disabled' : '') + '>' + CHEVL + '<span>Prev</span></button>' +
          '<button class="pg-step" data-pg="next"' + (page >= pages ? ' disabled' : '') + '><span>Next</span>' + CHEVR + '</button>' +
        '</div>' +
      '</div>';
    var sel = el.querySelector('.pg-select');
    if (sel) sel.addEventListener('change', function () { cb.size(parseInt(this.value, 10)); });
    Array.prototype.forEach.call(el.querySelectorAll('[data-pg]'), function (b) {
      b.addEventListener('click', function () {
        var np = b.getAttribute('data-pg') === 'prev' ? page - 1 : page + 1;
        np = Math.min(Math.max(1, np), pages);
        if (np !== page) cb.page(np);
      });
    });
  };
})();

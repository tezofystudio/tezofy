/* ============================================================
   TEZOFY Masonry — Pinterest-style layout engine · v1.2
   ------------------------------------------------------------
   v1.2 change:
   • Discover page ONLY: the title block under each image is now
     hidden (pure image feed). One scoped CSS rule — the layout
     engine itself is 100% untouched; cards just measure shorter
     and re-span automatically. Every other page that uses this
     engine (home sections, category grids, related prompts)
     keeps its titles exactly as before.
   v1.1 notes:
   • PALETTE is 9:16-native (most photos are 9:16) — the rest are
     near-portrait ratios, a slight crop works fine. To go back to
     4:5-native photos on the site, change PALETTE below.
   How it works:
   • CSS Grid + a tiny row unit (grid-auto-rows: 4px) + per-card
     grid-row-end: span N → true masonry; DOM/visual order stays
     left→right (CSS columns would flip it top→bottom).
   • Card height is known upfront (CSS aspect-ratio) → the layout
     never shifts by a single pixel, image loaded or not
     (zero CLS, LCP-friendly).
   • Stable hash of the image path → fixed aspect ratio; the same
     prompt gets the same shape on every page/filter (no jumping).
   • New/filtered cards (renderGrid, chip filters, infinite scroll)
     are picked up automatically via MutationObserver — nothing to
     change in app.js.

   Usage:
   1. Add masonry.css (or swap the block inside style.css)
   2. class="masonry" on the container (cards must be direct children)
   3. <script src="assets/js/masonry.js" defer></script>

   If JS is off/broken: the .ms-ready class never lands → the old
   uniform grid shows, nothing breaks (graceful fallback).

   Manual control: data-ar="1/1" on a card overrides the palette;
   otherwise it's auto from the hash. Manual relayout: Masonry.refresh()
   ============================================================ */
(function () {
  "use strict";
  if (window.Masonry) return; /* double-include guard */

  /* ---------------- v1.2: Discover page — image-only feed ----------------
     On the Discover page ONLY (body[data-page="discover"]), hide the title
     block under each image (.card-info). One scoped <style> rule, injected
     once — the layout engine below stays 100% untouched. Hidden titles make
     cards shorter and spans re-measure automatically, so the Pinterest
     layout stays pixel-perfect. Every other page using this engine (home
     sections, category grids, related prompts) keeps its titles. */
  function hideDiscoverTitles() {
    var b = document.body;
    if (!b || b.getAttribute("data-page") !== "discover") return;
    if (document.getElementById("msDiscoverStyle")) return;
    var st = document.createElement("style");
    st.id = "msDiscoverStyle";
    st.textContent = 'body[data-page="discover"] .card .card-info{display:none !important}';
    document.head.appendChild(st);
  }
  if (document.body) hideDiscoverTitles();
  else document.addEventListener("DOMContentLoaded", hideDiscoverTitles);

  /* Pinterest-leaning ratio palette (W/H) — 9:16-native, weighted.
     If the source is 9:16 (0.56): 9/16 = zero crop, 5/8 = 10%,
     2/3 = 16%, 7/10 = 20%, 3/4 = 25% (all height-crops; the main
     subject never gets cut).
     ▸ If your photos are 4:5, swap it to:
       ["4/5","4/5","4/5","4/5","9/16","9/16","5/8","2/3","3/4","3/4"] */
  var PALETTE = ["9/16", "9/16", "9/16", "9/16", "5/8", "5/8", "2/3", "2/3", "7/10", "3/4"];

  function hash(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; }
    return h < 0 ? -h : h;
  }

  /* Stable ratio for a card: data-ar attribute wins, else image-path hash */
  function ratioFor(card) {
    var ar = card.getAttribute("data-ar");
    if (ar) return ar;
    var img = card.querySelector("img");
    var src = img ? (img.currentSrc || img.getAttribute("src") || "") : "";
    src = String(src).split("?")[0]; /* drop cache-busting query */
    return src ? PALETTE[hash(src) % PALETTE.length] : "9/16";
  }

  var registry = new Map(); /* grid → { ro: ResizeObserver, mo: MutationObserver } */
  var queued = new Set();

  function schedule(grid) {
    if (queued.has(grid)) return;
    queued.add(grid);
    requestAnimationFrame(function () { queued.delete(grid); layout(grid); });
  }

  function layout(grid) {
    if (!grid.isConnected || !grid.clientWidth) return; /* hidden → ResizeObserver will catch it when shown */

    /* Add ms-ready FIRST → CSS activates grid-auto-rows: 4px; writing the
       span in the same frame means no flash/overlap is ever visible. */
    grid.classList.add("ms-ready");

    var unit = parseFloat(getComputedStyle(grid).gridAutoRows);
    if (!isFinite(unit) || unit < 1) { /* CSS stale-cached → fall back to uniform */
      grid.classList.remove("ms-ready");
      return;
    }

    var kids = grid.children;
    try {
      for (var i = 0; i < kids.length; i++) {
        var card = kids[i];
        if (card.nodeType !== 1) continue;
        if (!card.style.getPropertyValue("--ar")) card.style.setProperty("--ar", ratioFor(card));
        var mb = parseFloat(getComputedStyle(card).marginBottom) || 0;
        var need = Math.ceil((card.offsetHeight + mb) / unit);
        if (need < 1) need = 1;
        /* Write to the DOM only when it changed — avoids layout thrash */
        if (card.__span !== need) { card.__span = need; card.style.gridRowEnd = "span " + need; }
      }
    } catch (e) {
      grid.classList.remove("ms-ready"); /* anything odd → uniform fallback */
    }
  }

  function watch(grid) {
    if (registry.has(grid)) return;
    var ro = null;
    if ("ResizeObserver" in window) {
      ro = new ResizeObserver(function () { schedule(grid); });
      ro.observe(grid);
    }
    var mo = new MutationObserver(function () { schedule(grid); }); /* new/filtered cards */
    mo.observe(grid, { childList: true });
    registry.set(grid, { ro: ro, mo: mo });
    layout(grid);
  }

  function unwatch(grid) {
    var rec = registry.get(grid);
    if (!rec) return;
    if (rec.ro) rec.ro.disconnect();
    rec.mo.disconnect();
    registry.delete(grid);
  }

  /* When the .masonry class goes away (toggle/switch), clear the spans */
  function cleanup(grid) {
    var kids = grid.children;
    for (var i = 0; i < kids.length; i++) {
      kids[i].style.gridRowEnd = "";
      kids[i].__span = null;
    }
    grid.classList.remove("ms-ready");
  }

  function scan() {
    var grids = document.querySelectorAll(".masonry");
    for (var i = 0; i < grids.length; i++) watch(grids[i]);
    registry.forEach(function (rec, grid) {
      if (!grid.isConnected || !grid.classList.contains("masonry")) {
        cleanup(grid);
        unwatch(grid);
      }
    });
  }

  /* Document-level observer: .masonry containers added later (e.g. by
     pageDiscover(), or on re-render) are picked up automatically.
     The engine never changes classes itself, so there is no loop risk. */
  var scanQueued = false;
  function queueScan() {
    if (scanQueued) return;
    scanQueued = true;
    requestAnimationFrame(function () { scanQueued = false; scan(); });
  }
  new MutationObserver(queueScan).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributeFilter: ["class"]
  });

  function onReady() {
    scan();
    /* Backup for old browsers without ResizeObserver */
    window.addEventListener("resize", function () {
      registry.forEach(function (rec, grid) { schedule(grid); });
    });
    /* Font swap/late load can shift text height a little */
    window.addEventListener("load", scan);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { scan(); });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady);
  } else {
    onReady();
  }

  /* ---------------- Public API ---------------- */
  window.Masonry = {
    version: "1.2",
    /* Masonry.refresh() → everything; Masonry.refresh(el) → a specific grid/section */
    refresh: function (root) {
      scan();
      if (root && root.querySelectorAll) {
        if (root.classList && root.classList.contains("masonry")) schedule(root);
        var inner = root.querySelectorAll(".masonry");
        for (var i = 0; i < inner.length; i++) schedule(inner[i]);
      } else {
        registry.forEach(function (rec, grid) { schedule(grid); });
      }
    },
    /* Turns the layout engine off and returns to the uniform grid (rarely needed) */
    destroy: function (root) {
      var list = root ? [root] : Array.prototype.slice.call(document.querySelectorAll(".masonry"));
      list.forEach(function (g) { cleanup(g); unwatch(g); });
    }
  };
})();

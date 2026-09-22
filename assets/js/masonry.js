/* ============================================================
   TEZOFY Masonry — Pinterest-style layout engine · v1.1
   ------------------------------------------------------------
   v1.1 পরিবর্তন:
   • PALETTE এখন 9:16-নেটিভ (বেশির ভাগ ছবি 9:16) — বাকিগুলো
     কাছাকাছি পোর্ট্রেট রেশিও, সামান্য ক্রপেই কাজ চলে।
     4:5-নেটিভ ছবির সাইটে ফেরত যেতে চাইলে নিচের PALETTE বদলান।
   কীভাবে কাজ করে:
   • CSS Grid + ছোট রো-ইউনিট (grid-auto-rows: 4px) + প্রতি কার্ডে
     grid-row-end: span N → সত্যিকারের ম্যাসনরি; DOM/ভিজ্যুয়াল ক্রম
     বাঁ→ডান ঠিক থাকে (CSS columns-এর মতো উপর→নিচে উল্টো যায় না)।
   • কার্ডের উচ্চতা আগেই জানা (CSS aspect-ratio) → ছবি লোড হোক বা
     না হোক লেআউট এক পিক্সেলও নড়ে না (zero CLS, LCP-friendly)।
   • ছবির path থেকে stable hash → নির্দিষ্ট aspect ratio; একই প্রম্পট
     সব পেজে-সব ফিল্টারে একই শেপ পায় (লাফালাফি করে না)।
   • নতুন/ফিল্টার করা কার্ড (renderGrid, চিপ ফিল্টার, infinite scroll)
     MutationObserver দিয়ে নিজে নিজেই ধরা পড়ে — app.js-এ কিছু বদলাতে
     হয় না।

   ব্যবহার:
   1. masonry.css যোগ করুন (বা style.css-এর ব্লক বদলে দিন)
   2. কনটেইনারে class="masonry" (কার্ডগুলো সরাসরি চাইল্ড হতে হবে)
   3. <script src="assets/js/masonry.js" defer></script>

   JS বন্ধ/ব্যর্থ থাকলে: .ms-ready ক্লাস যোগ হয় না → আগের মতো
   uniform grid-ই দেখায়, কিছু ভাঙে না (graceful fallback)।

   ম্যানুয়াল কন্ট্রোল: কার্ডে data-ar="1/1" দিলে সেটাই লাগবে;
   নাহলে hash-palette থেকে অটো। ম্যানুয়াল রিলেআউট: Masonry.refresh()
   ============================================================ */
(function () {
  "use strict";
  if (window.Masonry) return; /* ডাবল-ইনক্লুড গার্ড */

  /* Pinterest-ঘেঁষা রেশিও প্যালেট (W/H) — 9:16-নেটিভ, ওয়েটেড।
     সোর্স 9:16 (০.৫৬) হলে: 9/16 = ক্রপ শূন্য, 5/8 = ১০%, 2/3 = ১৬%,
     7/10 = ২০%, 3/4 = ২৫% (সবাই উচ্চতা-ক্রপ, মূল সাবজেক্ট কাটা পড়ে না)।
     ▸ আপনার ছবি যদি 4:5 হয়, বদলে নিন:
       ["4/5","4/5","4/5","4/5","9/16","9/16","5/8","2/3","3/4","3/4"] */
  var PALETTE = ["9/16", "9/16", "9/16", "9/16", "5/8", "5/8", "2/3", "2/3", "7/10", "3/4"];

  function hash(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; }
    return h < 0 ? -h : h;
  }

  /* কার্ডের stable ratio: data-ar attribute থাকলে সেটাই, নাহলে ছবির path-hash */
  function ratioFor(card) {
    var ar = card.getAttribute("data-ar");
    if (ar) return ar;
    var img = card.querySelector("img");
    var src = img ? (img.currentSrc || img.getAttribute("src") || "") : "";
    src = String(src).split("?")[0]; /* cache-busting query বাদ */
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
    if (!grid.isConnected || !grid.clientWidth) return; /* লুকানো আছে → দেখা গেলে ResizeObserver ধরবে */

    /* ms-ready আগে বসাই → CSS-এ grid-auto-rows: 4px সক্রিয় হয়;
       একই ফ্রেমে span লিখে ফেলায় কোনো ঝলক/ওভারল্যাপ দেখা যায় না। */
    grid.classList.add("ms-ready");

    var unit = parseFloat(getComputedStyle(grid).gridAutoRows);
    if (!isFinite(unit) || unit < 1) { /* CSS পুরনো ক্যাশ — fallback-এ ফেরত */
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
        /* শুধু বদলালেই DOM-এ লিখি — layout thrash এড়াতে */
        if (card.__span !== need) { card.__span = need; card.style.gridRowEnd = "span " + need; }
      }
    } catch (e) {
      grid.classList.remove("ms-ready"); /* কিছু গোলমাল হলে uniform fallback */
    }
  }

  function watch(grid) {
    if (registry.has(grid)) return;
    var ro = null;
    if ("ResizeObserver" in window) {
      ro = new ResizeObserver(function () { schedule(grid); });
      ro.observe(grid);
    }
    var mo = new MutationObserver(function () { schedule(grid); }); /* নতুন/ফিল্টার করা কার্ড */
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

  /* .masonry ক্লাস সরে গেলে (টগল/সুইচ) span-গুলো পরিষ্কার করে দিই */
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

  /* ডকুমেন্ট-লেভেল অবজার্ভার: পরে যোগ হওয়া .masonry কনটেইনার
     (যেমন pageDiscover() ক্লাস বসায়, বা রি-রেন্ডার হয়) অটো-ধরা পড়ে।
     engine নিজে কখনো class বদলায় না বলে লুপের ঝুঁকি নেই। */
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
    /* ResizeObserver নেই এমন পুরনো ব্রাউজারের জন্য ব্যাকআপ */
    window.addEventListener("resize", function () {
      registry.forEach(function (rec, grid) { schedule(grid); });
    });
    /* ফন্ট সোয়াপ/লেট লোডে টেক্সট-হাইট সামান্য বদলাতে পারে */
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
    version: "1.1",
    /* Masonry.refresh() → সব; Masonry.refresh(el) → নির্দিষ্ট গ্রিড/সেকশন */
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
    /* লেআউট ইঞ্জিন বন্ধ করে uniform grid-এ ফেরত (খুব কম লাগবে) */
    destroy: function (root) {
      var list = root ? [root] : Array.prototype.slice.call(document.querySelectorAll(".masonry"));
      list.forEach(function (g) { cleanup(g); unwatch(g); });
    }
  };
})();

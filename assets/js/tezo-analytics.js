/* ============================================================
   TEZOFY — FILE 03: TEZO ANALYTICS (ক্লায়েন্ট ট্র্যাকার) v2
   ------------------------------------------------------------
   কাজ: প্রতিটি প্রম্পটের view / copy / like / unlike / share / save
   আসল সংখ্যায় (শূন্য থেকে) গোনে → Google Apps Script-এ পাঠায় →
   লাইভ কাউন্ট ফেরত এনে সাইটজুড়ে দেখায়।

   ⚡ v2 পরিবর্তন (আপনার আসল কোডের সাথে মিলিয়ে):
   • action নাম বদলেছে — আপনার ব্যাকএন্ডে "stats" ইতিমধ্যে
     ভিজিটর-অ্যানালিটিক্সের জন্য ব্যস্ত (admin-এর 📈 Analytics ট্যাব)।
     তাই: track → "ptrack" · stats → "pstats"  (p = prompt)
   • localStorage কী "tezo:" প্রিফিক্স — আপনার "chitro:" ও "tzvid"
     কীগুলোর সাথে কোনো সংঘর্ষ নেই
   ============================================================ */

var TezoStats = (function () {
  var ENDPOINT = (typeof AUTH_CONFIG !== "undefined" && AUTH_CONFIG && AUTH_CONFIG.sheetUrl) || "";
  var LS_CACHE = "tezo:stats";
  var LS_QUEUE = "tezo:queue";
  var SS_SEEN  = "tezo:seen";      // sessionStorage — ভিউ-ডিডুপ
  var REFRESH_MS = 5 * 60 * 1000;  // প্রতি ৫ মিনিটে লাইভ কাউন্ট রিফ্রেশ

  var cache = { v: {}, c: {}, l: {}, collections: { trending: [], popular: [] }, ts: 0 };

  /* প্রথমে localStorage থেকে ক্যাশ রিস্টোর (তাৎক্ষণিক দেখায়) */
  try {
    var saved = JSON.parse(localStorage.getItem(LS_CACHE));
    if (saved && saved.v) cache = saved;
  } catch (e) {}

  /* ---------- লাইভ কাউন্ট লোড ---------- */
  function load(cb) {
    if (!ENDPOINT) { if (cb) cb(); return; }
    fetch(ENDPOINT + "?action=pstats&t=" + Date.now())
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d && d.ok) {
          cache.v = d.views || {};
          cache.c = d.copies || {};
          cache.l = d.likes || {};
          cache.collections = d.collections || { trending: [], popular: [] };
          cache.ts = Date.now();
          try { localStorage.setItem(LS_CACHE, JSON.stringify(cache)); } catch (e) {}
        }
        if (cb) cb();
      })
      .catch(function () { if (cb) cb(); });
  }

  /* ---------- ইভেন্ট ট্র্যাক ---------- */
  function track(type, id) {
    if (!id || !ENDPOINT) return;
    var types = ["view", "copy", "like", "unlike", "share", "save"];
    if (types.indexOf(type) < 0) return;

    /* ভিউ-ডিডুপ: এক সেশনে একবারই */
    if (type === "view") {
      var seen = {};
      try { seen = JSON.parse(sessionStorage.getItem(SS_SEEN)) || {}; } catch (e) {}
      if (seen[id]) return;
      seen[id] = 1;
      try { sessionStorage.setItem(SS_SEEN, JSON.stringify(seen)); } catch (e) {}
    }

    /* লোকাল অপটিমিস্টিক আপডেট (সাথে সাথে স্ক্রিনে দেখায়) */
    if (type === "view")   cache.v[id] = (cache.v[id] || 0) + 1;
    if (type === "copy")   cache.c[id] = (cache.c[id] || 0) + 1;
    if (type === "like")   cache.l[id] = (cache.l[id] || 0) + 1;
    if (type === "unlike") cache.l[id] = Math.max(0, (cache.l[id] || 0) - 1);

    /* কিউতে রাখো */
    var q = [];
    try { q = JSON.parse(localStorage.getItem(LS_QUEUE)) || []; } catch (e) {}
    q.push({ t: type, id: id, ts: Date.now() });
    try { localStorage.setItem(LS_QUEUE, JSON.stringify(q.slice(-300))); } catch (e) {}
    flush();
  }

  /* ---------- সার্ভারে পাঠানো (ব্যাচ) ---------- */
  var flushing = false;
  function flush() {
    if (flushing || !ENDPOINT) return;
    flushing = true;
    var q = [];
    try { q = JSON.parse(localStorage.getItem(LS_QUEUE)) || []; } catch (e) {}
    if (!q.length) { flushing = false; schedule(); return; }

    var batch = q.slice(0, 20);
    var rest  = q.slice(20);
    try { localStorage.setItem(LS_QUEUE, JSON.stringify(rest)); } catch (e) {}

    var url = ENDPOINT + "?action=ptrack&batch=" + encodeURIComponent(JSON.stringify(batch));
    fetch(url, { mode: "no-cors", keepalive: true })
      .catch(function () {})
      .then(function () {
        flushing = false;
        if (rest.length) flush(); else schedule();
      });
  }
  /* আস্তে আস্তে পাঠাও — সার্ভারে চাপ কম */
  function schedule() { setTimeout(flush, 40000 + Math.random() * 40000); }

  window.addEventListener("online", flush);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") flush();
  });

  /* ---------- রিড-API (app.js এ ব্যবহার) ---------- */
  function views(id)  { return cache.v[id] || 0; }
  function copies(id) { return cache.c[id] || 0; }
  function likes(id)  { return cache.l[id] || 0; }

  /* ট্রেন্ডিং/পপুলার কালেকশন → প্রম্পট অবজেক্টের লিস্ট */
  function collection(name) {
    var ids = (cache.collections && cache.collections[name]) || [];
    var list = (typeof PROMPTS !== "undefined") ? PROMPTS : [];
    var out = [];
    for (var i = 0; i < ids.length; i++)
      for (var j = 0; j < list.length; j++)
        if (list[j].id === ids[i]) { out.push(list[j]); break; }
    return out;
  }

  return {
    track: track, load: load, flush: flush,
    views: views, copies: copies, likes: likes,
    collection: collection, cache: cache
  };
})();

/* ---------- অটো-স্টার্ট ---------- */
TezoStats.load();
setInterval(TezoStats.load, 5 * 60 * 1000);

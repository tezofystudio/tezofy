/* ==========================================================================
   TEZOFY 🌐📝 i18n-content — প্রম্পট-কনটেন্ট অটো-অনুবাদক (drop-in, নতুন ফাইল)
   ──────────────────────────────────────────────────────────────────────────
   ✅ কী অনুবাদ করে: প্রম্পট-কার্ডের টাইটেল, সার্চ-রেজাল্টের টাইটেল,
        ডিটেইল-পেজের টাইটেল + ট্যাগলাইন, ক্যাটাগরি-চিপ
   🛡️ কী অনুবাদ করে না (সচেতন সিদ্ধান্ত): আসল প্রম্পট-টেক্সট —
        AI-টুল (Gemini/Bing/Midjourney) ইংরেজি প্রম্পটেই সেরা রেজাল্ট দেয়,
        তাই .prompt-text/কাস্টমাইজ-এলাকা সবসময় ইংরেজিই থাকে ✅
   ✅ ইন্সটল: index.html + template.html-এ i18n.js-এর লাইনের পরে মাত্র ১ লাইন:
        <script src="assets/js/i18n-content.js" defer></script>
   ✅ English (ডিফল্ট) মোডে একদম চুপ — শূন্য নেটওয়ার্ক-খরচ
   ✅ অনুবাদ localStorage-ক্যাশে জমা থাকে — একবার অনুবাদ = সারাজীবন তাৎক্ষণিক
   ========================================================================== */
(function () {
  "use strict";
  var cur = localStorage.getItem("tz_lang") || "en";
  if (cur !== "bn" && cur !== "hi") return;                               // English হলে পুরো ফাইল no-op

  /* ---------- 💾 ক্যাশ (localStorage) ---------- */
  var CK = "tzx_v1", cache = {}, dirty = 0;
  try { cache = JSON.parse(localStorage.getItem(CK) || "{}"); } catch (e) { cache = {}; }
  function flush() {
    if (!dirty) return; dirty = 0;
    try {
      var s = JSON.stringify(cache);
      if (s.length > 550000) cache = {};                                  // ক্যাশ বড় হলে রিসেট — লাগবে না বেশি
      localStorage.setItem(CK, JSON.stringify(cache));
    } catch (e) {}
  }
  addEventListener("beforeunload", flush);
  setInterval(flush, 2500);

  /* ---------- 🌍 ফ্রি ট্রান্সলেট-এন্ডপয়েন্ট (Lingva → Google-gtx fallback) ---------- */
  function viaLingva(q) {
    return fetch("https://lingva.ml/api/v1/en/" + cur + "/" + encodeURIComponent(q))
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { return j && j.translation ? j.translation : null; });
  }
  function viaGtx(q) {
    return fetch("https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=" + cur + "&dt=t&q=" + encodeURIComponent(q))
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { return j && j[0] ? j[0].map(function (x) { return x[0]; }).join("") : null; });
  }
  function remoteTr(q) {
    return viaLingva(q).catch(function () { return null; })
      .then(function (a) { return a ? a : viaGtx(q).catch(function () { return null; }); });
  }

  /* ---------- ⏳ সিরিাল-কিউ (সর্বোচ্চ ৩ সমান্তরাল — সার্ভারে চাপ দিই না) ---------- */
  var queue = [], running = 0, inflight = {};
  function pump() {
    while (running < 3 && queue.length) {
      (function (j) {
        running++;
        remoteTr(j.q).then(function (out) {
          running--;
          var k = cur + "|" + j.q;
          var good = out && out.toLowerCase() !== j.q.toLowerCase() ? out : null;
          if (good) { cache[k] = good; dirty++; }
          (inflight[k] || []).forEach(function (fn) { fn(good); });      // একই স্ট্রিংয়ের সব অপেক্ষমাণের রিজলভ
          delete inflight[k];
          flush(); pump();
        });
      })(queue.shift());
    }
  }
  function tr(text) {
    return new Promise(function (ok) {
      var q = String(text || "").replace(/\s+/g, " ").trim();
      if (q.length < 2) return ok(null);
      var k = cur + "|" + q;
      if (cache[k]) return ok(cache[k]);
      (inflight[k] = inflight[k] || []).push(ok);
      if (inflight[k].length === 1) queue.push({ q: q });                // ডুপ্লিকেট রিমোট-কল বন্ধ
      pump();
    });
  }

  /* ---------- 🎯 সহকারী: একটা নোড অনুবাদ (মূল সোর্স সংরক্ষণ + শিমার) ---------- */
  function trEl(el) {
    if (!el || el._tzcDone || el.closest("[data-i18nc-skip],.notranslate")) return;
    var src = (el.textContent || "").replace(/\s+/g, " ").trim();
    if (src.length < 2) return;
    el._tzcDone = 1; el._tzcSrc = src;
    el.classList.add("tzc-pending");
    tr(src).then(function (out) {
      el.classList.remove("tzc-pending");
      if (out && (el.textContent || "").replace(/\s+/g, " ").trim() === src) {
        el.textContent = out;
        el.setAttribute("lang", cur);
      }
    });
  }

  /* ---------- 🧭 টার্গেট-এলাকা (কার্ড/সার্চ/ডিটেইল/চিপ — প্রম্পট-বডি নয়!) ---------- */
  var SEL_NOW = ".chip, .cat-chip, .detail-head h1, .detail-head .sub";   // অল্পসংখ্যক — সঙ্গে সঙ্গে অনুবাদ
  var SEL_CARD = ".card .card-info h3, .result-row h4";                   // অনেক — স্ক্রলে চোখে পড়লেই অনুবাদ

  var io = new IntersectionObserver(function (ents) {
    ents.forEach(function (en) {
      if (en.isIntersecting) { trEl(en.target); io.unobserve(en.target); }
    });
  }, { rootMargin: "120px" });

  function collect(root) {
    if (!root.querySelectorAll) return;
    if (root.matches && root.matches(SEL_NOW)) trEl(root);
    root.querySelectorAll(SEL_NOW).forEach(trEl);
    if (root.matches && root.matches(SEL_CARD) && !root._tzcDone) io.observe(root);
    root.querySelectorAll(SEL_CARD).forEach(function (el) { if (!el._tzcDone) io.observe(el); });
  }

  /* ---------- 👁 পরে যোগ হওয়া কার্ড/চিপও ধরা ---------- */
  var t = null;
  new MutationObserver(function (muts) {
    clearTimeout(t);
    t = setTimeout(function () {
      muts.forEach(function (mu) {
        mu.addedNodes && mu.addedNodes.forEach(function (ad) { if (ad.nodeType === 1) collect(ad); });
      });
    }, 60);
  }).observe(document.body, { childList: true, subtree: true });

  function start() { collect(document.body); }
  if (document.readyState === "loading") addEventListener("DOMContentLoaded", start);
  else start();

  /* ---------- ✨ অনুবাদ চলাকালীন হালকা শিমার ---------- */
  var st = document.createElement("style");
  st.textContent = ".tzc-pending{opacity:.55;transition:opacity .25s ease}";
  (document.head || document.documentElement).appendChild(st);
})();

/* ============================================================
   TEZOFY — AI Tools Menu (v1.0)
   ♾️ মূল আইডিয়া: লুকানো AI-টুলগুলোকে সবসময় এক ক্লিকে আনা।

   কী করে:
   ১) বটমবারের ai-hub লিংক → মেনু-ট্রিগার বাটন (চাপলেই বাটনের
      উপরে সব টুলের পপআপ তালিকা ভেসে ওঠে)। মূল সাইটের কেন্দ্রীয়
      .bb-ai বাটন পায় টুল-পেজের মতোই উঁচু গ্র্যাডিয়েন্ট চেহারা।
   ২) ডেস্কটপে (≥860px) হেডারে "✨ AI Tools" পিল-বাটন — টুলগুলো
      আর কোথাও লুকানো থাকে না, প্রতিটা পেজ থেকেই এক ক্লিক।

   নতুন টুল যোগ করতে: নিচের TOOLS অ্যারেতে এক লাইন যোগ করুন,
   অথবা যেকোনো পেজে এই স্ক্রিপ্টের আগে
   window.TEZOFY_AI_TOOLS = [ … ] বসিয়ে দিন।
   ============================================================ */
(function () {
  "use strict";
  if (window.__tezofyAiMenu) return;
  window.__tezofyAiMenu = true;

  var TOOLS = [
    { emoji: "🎡", name: "AI Hub",           desc: "All tools in one place", href: "ai-hub.html" },
    { emoji: "💡", name: "Idea Maker",       desc: "Idea → pro prompt",      href: "idea-maker.html" },
    { emoji: "✨", name: "AI Generator",     desc: "Text → AI image",        href: "ai-generator.html" },
    { emoji: "🪄", name: "Photo Enhance",    desc: "One-tap HD fix",         href: "photo-enhance.html" },
    { emoji: "♾️", name: "Infinite Library", desc: "23M+ prompt combos",     href: "infinite.html" },
    { emoji: "🧬", name: "Prompt Maker",     desc: "DNA remix lab",          href: "maker.html" }
  ];
  if (Array.isArray(window.TEZOFY_AI_TOOLS) && window.TEZOFY_AI_TOOLS.length) {
    TOOLS = window.TEZOFY_AI_TOOLS;
  }

  var SPARK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></svg>';

  /* ---------- styles ---------- */
  var css =
    "/* AI Tools pill (desktop) */" +
    ".ai-pill { display: none; align-items: center; gap: 8px; padding: 9px 16px; border-radius: 999px;" +
    "  border: none; cursor: pointer; font: inherit; font-size: .84rem; font-weight: 700; color: #fff;" +
    "  background: var(--grad); box-shadow: 0 4px 16px rgba(255,45,170,.35); transition: .2s; text-decoration: none; }" +
    ".ai-pill svg { width: 16px; height: 16px; }" +
    ".ai-pill:hover { transform: translateY(-1px); box-shadow: 0 6px 22px rgba(255,45,170,.5); }" +
    ".ai-pill:active { transform: scale(.96); }" +
    "@media (min-width: 860px) { .ai-pill { display: inline-flex; } }" +

    /* veil + flyout */
    ".ai-veil { position: fixed; inset: 0; background: rgba(0,0,0,.45); z-index: 88; opacity: 0; pointer-events: none; transition: .22s; }" +
    ".ai-veil.open { opacity: 1; pointer-events: auto; }" +
    ".ai-fly { position: fixed; z-index: 89; width: min(92vw, 330px); background: var(--card);" +
    "  border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); padding: 8px;" +
    "  opacity: 0; pointer-events: none; transition: .22s; }" +
    ".ai-fly.open { opacity: 1; pointer-events: auto; }" +
    ".ai-fly.ai-from-bar { bottom: calc(var(--bottombar-h) + env(safe-area-inset-bottom, 0px) + 16px);" +
    "  left: 50%; transform: translateX(-50%) translateY(14px) scale(.97); transform-origin: bottom center; }" +
    ".ai-fly.ai-from-bar.open { transform: translateX(-50%) translateY(0) scale(1); }" +
    ".ai-fly.ai-from-head { top: calc(var(--header-h) + 8px); right: 14px; transform: translateY(-8px) scale(.97); transform-origin: top right; }" +
    ".ai-fly.ai-from-head.open { transform: translateY(0) scale(1); }" +

    /* flyout কন্টেন্ট */
    ".ai-fly-head { display: flex; align-items: center; gap: 8px; padding: 10px 12px 8px;" +
    "  font-size: .7rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: var(--muted-2); }" +
    ".ai-fly-head svg { width: 14px; height: 14px; stroke: var(--pink); }" +
    ".ai-fly-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px;" +
    "  border-radius: var(--radius-sm); text-decoration: none; color: var(--text); transition: .16s; }" +
    ".ai-fly-item:hover { background: var(--card-2); }" +
    ".ai-fly-item .ic { width: 36px; height: 36px; flex: none; display: grid; place-items: center;" +
    "  font-size: 1.12rem; background: var(--grad-soft); border: 1px solid rgba(255,45,170,.25); border-radius: 11px; }" +
    ".ai-fly-item .tx { flex: 1 1 auto; min-width: 0; }" +
    ".ai-fly-item .tx b { display: block; font-size: .88rem; font-weight: 700; }" +
    ".ai-fly-item .tx small { display: block; font-size: .72rem; color: var(--muted-2); margin-top: 1px; }" +
    ".ai-fly-item .go { flex: none; color: var(--pink); font-weight: 800; }" +

    /* কেন্দ্রীয় AI/Home বাটন → গোল, অ্যালাইনড, পালস-অ্যানিমেটেড কোর
       (নিচে কোনো লেখা নেই; AI বাটনের কোরের মাঝে "AI" লেখা) */
    "@media (max-width: 859px) {" +
    "  .bottombar .bb-ai { position: relative; }" +
    "  .bottombar .bb-ai .bb-core { position: relative; width: 52px; height: 52px; border-radius: 999px;" +
    "    background: var(--grad); color: #fff; display: grid; place-items: center;" +
    "    box-shadow: 0 6px 20px rgba(255,45,170,.5); animation: bb-breathe 2.4s ease-in-out infinite; }" +
    "  .bottombar .bb-ai .bb-core::after { content: \"\"; position: absolute; inset: -3px; border-radius: 999px;" +
    "    border: 2px solid rgba(255,45,170,.55); animation: bb-ring 2.4s ease-out infinite; }" +
    "  .bottombar .bb-ai .bb-core svg { width: 26px; height: 26px; stroke: #fff; }" +
    "  .bottombar .bb-ai .bb-core .bb-txt { font-size: 1.02rem; font-weight: 800; letter-spacing: .02em; }" +
    "  .bottombar .bb-ai > span { display: none; }" +
    "}" +
    "@keyframes bb-breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }" +
    "@keyframes bb-ring { 0% { transform: scale(.92); opacity: .85; } 70%, 100% { transform: scale(1.38); opacity: 0; } }" +
    "@media (prefers-reduced-motion: reduce) {" +
    "  .bottombar .bb-ai .bb-core, .bottombar .bb-ai .bb-core::after { animation: none; }" +
    "}";

  /* ---------- মেনু DOM ---------- */
  var veil = null, fly = null, openTrigger = null;

  function ensureStyle() {
    if (document.querySelector("style[data-ai-menu-css]")) return;
    var st = document.createElement("style");
    st.textContent = css;
    st.dataset.aiMenuCss = "1";
    document.head.appendChild(st);
  }

  function ensureFly() {
    if (fly) return;
    ensureStyle();
    veil = document.createElement("div");
    veil.className = "ai-veil";

    fly = document.createElement("div");
    fly.className = "ai-fly";
    fly.setAttribute("role", "menu");
    fly.innerHTML =
      '<div class="ai-fly-head">' + SPARK + 'TEZOFY AI Studio</div>' +
      TOOLS.map(function (t) {
        return '<a class="ai-fly-item" role="menuitem" href="' + t.href + '">' +
                 '<span class="ic">' + t.emoji + '</span>' +
                 '<span class="tx"><b>' + t.name + '</b><small>' + t.desc + '</small></span>' +
                 '<span class="go">→</span>' +
               '</a>';
      }).join("");

    veil.addEventListener("click", close);
    document.body.appendChild(veil);
    document.body.appendChild(fly);

    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    window.addEventListener("resize", close);
  }

  function open(trigger) {
    ensureFly();
    var mode = trigger.getAttribute("data-ai-trigger") === "bar" ? "ai-from-bar" : "ai-from-head";
    fly.className = "ai-fly open " + mode;
    veil.classList.add("open");
    document.body.style.overflow = "hidden";
    openTrigger = trigger;
    trigger.setAttribute("aria-expanded", "true");
  }
  function close() {
    if (!fly || !fly.classList.contains("open")) return;
    fly.classList.remove("open");
    veil.classList.remove("open");
    document.body.style.overflow = "";
    if (openTrigger) openTrigger.setAttribute("aria-expanded", "false");
    openTrigger = null;
  }
  function toggle(trigger) {
    if (fly && fly.classList.contains("open") && openTrigger === trigger) close();
    else open(trigger);
  }

  /* ---------- chrome এনহ্যান্সমেন্ট ---------- */
  function enhance() {
    ensureStyle();

    /* ১) বটমবারের ai-hub লিংক → মেনু-ট্রিগার
          (ai-hub পেজে নিজে অ্যাক্টিভ থাকলে লিংকই থাকবে) */
    var links = document.querySelectorAll('.bottombar a[href="ai-hub.html"]');
    Array.prototype.forEach.call(links, function (a) {
      if (a.classList.contains("active")) return;
      var b = document.createElement("button");
      b.type = "button";
      b.className = a.className;
      b.setAttribute("data-ai-trigger", "bar");
      b.setAttribute("aria-haspopup", "menu");
      b.setAttribute("aria-expanded", "false");
      b.setAttribute("aria-label", "TEZOFY AI tools");
      if (a.classList.contains("bb-ai")) {
        /* কেন্দ্রীয় AI বাটন → গোল পালস-কোর, মাঝখানে "AI" লেখা, নিচে কোনো লেবেল নেই */
        b.innerHTML = '<b class="bb-core"><span class="bb-txt">AI</span></b>';
      } else {
        b.innerHTML = a.innerHTML;
      }
      a.parentNode.replaceChild(b, a);
      b.addEventListener("click", function (e) { e.preventDefault(); toggle(b); });
    });

    /* ২) ডেস্কটপ হেডার-পিল (≥860px-এ দৃশ্যমান) */
    var ha = document.querySelector(".header-actions");
    if (ha && !ha.querySelector(".ai-pill")) {
      var pill = document.createElement("button");
      pill.type = "button";
      pill.className = "ai-pill";
      pill.setAttribute("data-ai-trigger", "head");
      pill.setAttribute("aria-haspopup", "menu");
      pill.setAttribute("aria-expanded", "false");
      pill.setAttribute("aria-label", "TEZOFY AI tools");
      pill.innerHTML = SPARK + "<span>AI Tools</span>";
      ha.insertBefore(pill, ha.firstChild);
      pill.addEventListener("click", function (e) { e.preventDefault(); toggle(pill); });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enhance);
  } else {
    enhance();
  }
})();

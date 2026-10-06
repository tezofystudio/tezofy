/* ============================================================
   TEZOFY — Desktop Navigation (desktop-nav.js) · v2.0
   ------------------------------------------------------------
   CapCut-style desktop header menu:
   Discover · Templates ▾ · AI Tools ▾ · Blog

   v2 fixes:
   · AI Tools now lists ALL 6 site tools (same list as ai-menu.js)
   · De-duplicates the header on desktop: hides the old "AI"
     pill and the small search icon while the menu is active
     (mobile < 900px stays 100% untouched)
   · Alignment polish: single-line header, brand tagline
     collapses, nothing wraps

   Zero edits to any page's HTML, zero changes to app.js /
   ai-menu.js. Remove the <script> line and everything
   returns exactly as before.

   ============================================================ */
(function () {
  "use strict";

  /* ==========================================================
     MENU CONFIG — এখানে ১টি লাইন যোগ/বদল করলেই মেনু বদলে যায়
     ----------------------------------------------------------
     Simple link:  { label: "Name", href: "page.html" }
     With dropdown:
       { label: "Name", href: "page.html", children: [
           { icon: "🎨", label: "Sub item", href: "sub.html" },
           { icon: "✨", label: "Highlighted", href: "x.html", strong: true }
       ] }
     ========================================================== */
  var MENU = [
    { label: "Discover", href: "discover.html" },
    {
      label: "Templates",
      href: "discover.html",
      children: [
        { icon: "👗", label: "Women Fashion", href: "category.html?c=women-fashion" },
        { icon: "👔", label: "Men Style", href: "category.html?c=men-style" },
        { icon: "🎉", label: "Festival", href: "category.html?c=festival" },
        { icon: "🎂", label: "Birthday", href: "category.html?c=birthday" },
        { icon: "💍", label: "Wedding", href: "category.html?c=wedding" },
        { icon: "❤️", label: "Love & Couple", href: "category.html?c=love-couple" },
        { icon: "🗂️", label: "All categories", href: "discover.html", strong: true }
      ]
    },
    {
      label: "AI Tools",
      href: "ai-hub.html",
      children: [
        { icon: "🎡", label: "AI Hub — all tools", href: "ai-hub.html", strong: true },
        { icon: "💡", label: "Idea Maker", href: "idea-maker.html" },
        { icon: "✨", label: "AI Generator", href: "ai-generator.html" },
        { icon: "🪄", label: "Photo Enhance", href: "photo-enhance.html" },
        { icon: "♾️", label: "Infinite Library", href: "infinite.html" },
        { icon: "🧬", label: "Prompt Maker", href: "maker.html" }
      ]
    },
    { label: "Blog", href: "blog.html" }
  ];

  /* ---------- styles (desktop-only) ---------- */
  var STYLE_ID = "tzdNavStyle";
  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var st = document.createElement("style");
    st.id = STYLE_ID;
    st.textContent = [
      "@media (min-width:900px){",
      /* single-line, perfectly aligned header */
      ".site-header.tzd-has-nav .wrap{flex-wrap:nowrap;align-items:center;gap:16px}",
      ".site-header.tzd-has-nav .brand{flex-shrink:0}",
      ".site-header.tzd-has-nav .brand small{display:none}",           /* tagline collapses */
      ".site-header.tzd-has-nav .brand > span:not(.brand-mark){white-space:nowrap}",
      ".site-header.tzd-has-nav .header-actions{flex-shrink:0;margin-left:0}",
      ".site-header.tzd-has-nav .header-search-pill{max-width:230px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      /* de-duplicate: old AI pill + small search icon are replaced by this menu */
      ".site-header.tzd-has-nav .ai-pill{display:none!important}",
      ".site-header.tzd-has-nav .icon-btn[data-open-search]{display:none!important}",
      "}",
      /* the menu itself */
      ".tzd-nav{display:flex;align-items:center;gap:2px;margin-left:8px;flex:1;min-width:0;overflow-x:auto;scrollbar-width:none}",
      ".tzd-nav::-webkit-scrollbar{display:none}",
      ".tzd-item{position:relative;flex-shrink:0}",
      ".tzd-link{display:inline-flex;align-items:center;gap:5px;color:var(--muted,#a1a1aa);font:600 14px/1 inherit;font-family:inherit;text-decoration:none;padding:9px 13px;border-radius:10px;cursor:pointer;background:none;border:none;transition:color .18s,background .18s;white-space:nowrap}",
      ".tzd-link:hover,.tzd-link.tzd-on{color:var(--text,#fafafa);background:var(--card-2,#18181f)}",
      ".tzd-link.tzd-active{color:var(--text,#fafafa)}",
      ".tzd-link.tzd-active::after{content:\"\";display:block;height:2.5px;border-radius:2px;background:var(--grad,linear-gradient(135deg,#ff2daa,#ff7a00));margin-top:5px}",
      ".tzd-caret{font-size:9px;transition:transform .18s;opacity:.7}",
      ".tzd-item.tzd-open .tzd-caret{transform:rotate(180deg)}",
      ".tzd-drop{position:absolute;top:calc(100% + 8px);left:0;min-width:236px;background:var(--card,#131318);border:1px solid var(--border,#232329);border-radius:14px;padding:7px;box-shadow:0 18px 44px rgba(0,0,0,.45);opacity:0;visibility:hidden;transform:translateY(6px);transition:opacity .18s,transform .18s,visibility .18s;z-index:120}",
      ".tzd-item.tzd-open .tzd-drop{opacity:1;visibility:visible;transform:translateY(0)}",
      ".tzd-drop a{display:flex;align-items:center;gap:10px;color:var(--text,#fafafa);font:500 13.5px/1 inherit;font-family:inherit;text-decoration:none;padding:10px 12px;border-radius:9px;transition:background .15s;white-space:nowrap}",
      ".tzd-drop a:hover{background:var(--card-2,#18181f)}",
      ".tzd-drop a.tzd-strong{font-weight:700;color:var(--pink,#ff2daa)}",
      ".tzd-drop .tzd-ico{width:22px;text-align:center;font-size:15px;flex-shrink:0}",
      "@media (max-width:899px){.tzd-nav{display:none!important}}"
    ].join("\n");
    document.head.appendChild(st);
  }

  /* ---------- helpers ---------- */
  function pagePath() {
    return (location.pathname.split("/").pop() || "index.html").toLowerCase();
  }
  function isActive(href) {
    try {
      var target = (href || "").split("?")[0].toLowerCase() || "index.html";
      return target === pagePath();
    } catch (e) { return false; }
  }
  function itemIsActive(m) {
    if (isActive(m.href)) return true;
    if (m.children) {
      for (var i = 0; i < m.children.length; i++) {
        if (isActive(m.children[i].href)) return true;
      }
    }
    return false;
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- build & inject ---------- */
  var INJECTED_ID = "tzdNav";

  function buildNav() {
    var nav = document.createElement("nav");
    nav.className = "tzd-nav";
    nav.id = INJECTED_ID;
    nav.setAttribute("aria-label", "Main menu");

    MENU.forEach(function (m) {
      var item = document.createElement("div");
      item.className = "tzd-item";

      if (m.children && m.children.length) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "tzd-link" + (itemIsActive(m) ? " tzd-active" : "");
        btn.setAttribute("aria-expanded", "false");
        btn.innerHTML = esc(m.label) + ' <span class="tzd-caret">▼</span>';
        item.appendChild(btn);

        var drop = document.createElement("div");
        drop.className = "tzd-drop";
        drop.setAttribute("role", "menu");
        m.children.forEach(function (c) {
          var a = document.createElement("a");
          a.href = c.href;
          a.className = c.strong ? "tzd-strong" : "";
          a.setAttribute("role", "menuitem");
          a.innerHTML = '<span class="tzd-ico">' + esc(c.icon || "•") + "</span>" + esc(c.label);
          drop.appendChild(a);
        });
        item.appendChild(drop);

        btn.addEventListener("click", function (e) {
          e.stopPropagation();
          var willOpen = !item.classList.contains("tzd-open");
          closeAll();
          if (willOpen) { item.classList.add("tzd-open"); btn.setAttribute("aria-expanded", "true"); }
        });
        item.addEventListener("mouseenter", function () {
          closeAll();
          item.classList.add("tzd-open");
          btn.setAttribute("aria-expanded", "true");
        });
      } else {
        var link = document.createElement("a");
        link.href = m.href;
        link.className = "tzd-link" + (itemIsActive(m) ? " tzd-active" : "");
        link.textContent = m.label;
        item.appendChild(link);
      }
      nav.appendChild(item);
    });
    return nav;
  }

  function closeAll() {
    var items = document.querySelectorAll("#" + INJECTED_ID + " .tzd-item.tzd-open");
    for (var i = 0; i < items.length; i++) {
      items[i].classList.remove("tzd-open");
      var b = items[i].querySelector(".tzd-link");
      if (b) b.setAttribute("aria-expanded", "false");
    }
  }

  function inject() {
    if (document.getElementById(INJECTED_ID)) return;
    var header = document.querySelector(".site-header");
    var wrap = header ? header.querySelector(".wrap") : null;
    if (!wrap) return;
    var actions = wrap.querySelector(".header-actions");
    if (!actions) return;
    ensureStyle();
    header.classList.add("tzd-has-nav"); /* activates alignment + de-dup rules */
    var nav = buildNav();
    wrap.insertBefore(nav, actions);

    document.addEventListener("click", function (e) {
      if (!e.target.closest || !e.target.closest("#" + INJECTED_ID)) closeAll();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeAll();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
  /* re-inject guard for late-rendered headers (app.js builds the header async) */
  var tries = 0;
  var timer = setInterval(function () {
    tries++;
    if (document.getElementById(INJECTED_ID) || tries > 20) { clearInterval(timer); return; }
    if (document.querySelector(".site-header .wrap")) { inject(); clearInterval(timer); }
  }, 250);
})();

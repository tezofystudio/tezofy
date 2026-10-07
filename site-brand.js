/* ====================================================================
   TEZOFY BRAND CONTROL — site-brand.js  (ENGINE v2.1)
   --------------------------------------------------------------------
   এই একটি ফাইল = পুরো সাইটের ব্র্যান্ড-কন্ট্রোল সিস্টেম।
   • প্রতিটি পেজের <head>-এ লিখুন (stylesheet-লিংকের ঠিক নিচে):
       <script src="site-brand.js"></script>
   • রং / ফন্ট / নাম / লোগো / ঘোষণা-ব্যানার / ফুটার / ডিফল্ট-থিম /
     শেপ-লেখা / ছায়া / কনটেন্ট-চওড়া / পেজ-ভিত্তিক স্টাইল / কাস্টম CSS
     বদলাতে brand-admin.html প্যানেল ব্যবহার করুন —
     অথবা নিচের __TZBRAND_CONFIG__ অংশে হাতে মান বসান।
   • প্যানেল: https://tezofystudio.github.io/tezofy/brand-admin.html
   • ডিফল্ট মান = বর্তমান লাইভ সাইট → প্রথম কমিটে কোনো দৃশ্যমান
     পরিবর্তন হবে না (zero-change install)।
   • v2.1 নতুন: লাইট-মোডে হেডার ও নিচের বার এখন পঠনযোগ্য (সাইটের কালো বারে
     গাঢ় লেখা অদৃশ্য হয়ে যেত — এখন বার লাইট-প্যালেট ফলো করে)।
   • v2.0 নতুন: shape (প্রম্পট-কার্ডের পটভূমি ও ভেতরের লেখার রং —
     ডার্ক/লাইট আলাদা), shadow (ছায়া), layout.wrapMax (কনটেন্ট-চওড়া),
     pages (প্রতি-পেজ আলাদা primary/secondary + CSS), প্রিভিউ-মোডে
     ডিফল্ট-থিম জোর করে দেখানো, আর প্রাইমারি বদলালে পিংক-টিন্ট
     অ্যাকসেন্টগুলোও (হার্ট, চিপ, মার্ক) স্বয়ংক্রিয়ভাবে বদলায়।
   • ⚠️ ENGINE অংশে (নিচের লাইন) হাত দেবেন না।
   ==================================================================== */

/*__TZBRAND_CONFIG_START__*/
window.TZ_BRAND = {
  "siteName": "TEZOFY",
  "tagline": "Premium AI Prompt Library",
  "nameScope": "all",
  "logo": { "type": "keep", "url": "", "emoji": "✦", "height": 0 },
  "favicon": "",
  "colors": {
    "primary": "#ff2daa",
    "secondary": "#ff7a00",
    "autoGrad": true,
    "dark":  { "bg": "#09090b", "bgSoft": "#0f0f14", "card": "#131318", "card2": "#18181f", "border": "#232329", "borderSoft": "#1c1c22", "text": "#fafafa", "muted": "#a1a1aa", "muted2": "#71717a" },
    "light": { "bg": "#f4f4f8", "bgSoft": "#ffffff", "card": "#ffffff", "card2": "#eeeef4", "border": "#e2e2eb", "borderSoft": "#ebebf2", "text": "#17171c", "muted": "#565660", "muted2": "#8a8a95" },
    "shape": {
      "dark":  { "bg": "", "textBg": "", "head": "", "text": "", "muted": "" },
      "light": { "bg": "", "textBg": "", "head": "", "text": "", "muted": "" }
    }
  },
  "fonts": { "body": "", "head": "", "bodySize": 0 },
  "radius": { "base": 18, "sm": 12 },
  "shadow": "",
  "layout": { "wrapMax": 0 },
  "pages": {},
  "theme": { "default": "" },
  "banner": { "on": false, "text": "", "href": "", "dismissible": true },
  "footerText": "",
  "customCss": ""
};
/*__TZBRAND_CONFIG_END__*/

/* ==================== ENGINE v2.1 (সম্পাদনা নিষেধ) ==================== */
(function () {
  "use strict";

  /* ---------- ১) ডিফল্ট = বর্তমান লাইভ সাইটের হুবহু মান ---------- */
  var DEF = {
    siteName: "TEZOFY",
    tagline: "Premium AI Prompt Library",
    nameScope: "all",
    logo: { type: "keep", url: "", emoji: "✦", height: 0 },
    favicon: "",
    colors: {
      primary: "#ff2daa", secondary: "#ff7a00", autoGrad: true,
      dark:  { bg: "#09090b", bgSoft: "#0f0f14", card: "#131318", card2: "#18181f", border: "#232329", borderSoft: "#1c1c22", text: "#fafafa", muted: "#a1a1aa", muted2: "#71717a" },
      light: { bg: "#f4f4f8", bgSoft: "#ffffff", card: "#ffffff", card2: "#eeeef4", border: "#e2e2eb", borderSoft: "#ebebf2", text: "#17171c", muted: "#565660", muted2: "#8a8a95" },
      shape: {
        dark:  { bg: "", textBg: "", head: "", text: "", muted: "" },
        light: { bg: "", textBg: "", head: "", text: "", muted: "" }
      }
    },
    fonts: { body: "", head: "", bodySize: 0 },
    radius: { base: 18, sm: 12 },
    shadow: "",
    layout: { wrapMax: 0 },
    pages: {},
    theme: { default: "" },
    banner: { on: false, text: "", href: "", dismissible: true },
    footerText: "",
    customCss: ""
  };
  var PKEY = "chitro:tz:brand-preview";
  var ORIG = { name: "TEZOFY", tagline: "Premium AI Prompt Library" };
  var NAME_RE = /TEZOFY|Tezofy/g;

  /* ---------- হেল্পার ---------- */
  function merge(base, over) {
    var out = {}, k, v;
    for (k in base) out[k] = base[k];
    if (!over || typeof over !== "object") return out;
    for (k in over) {
      v = over[k];
      if (v && typeof v === "object" && !Array.isArray(v) && base[k] && typeof base[k] === "object" && !Array.isArray(base[k])) out[k] = merge(base[k], v);
      else if (v !== undefined && v !== null && v !== "") out[k] = v;
    }
    return out;
  }
  function hexToRgb(h) {
    h = String(h || "").replace("#", "").trim();
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    if (h.length !== 6) return null;
    var n = parseInt(h, 16);
    if (isNaN(n)) return null;
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgba(hex, a) {
    var c = hexToRgb(hex);
    return c ? "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")" : null;
  }
  function escH(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function escA(s) { return escH(s).replace(/"/g, "&quot;"); }
  function firstTextNode(el) {
    for (var i = 0; i < el.childNodes.length; i++) {
      var n = el.childNodes[i];
      if (n.nodeType === 3 && n.nodeValue.trim()) return n;
    }
    return null;
  }
  function isHex(v) { return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(String(v || "").trim()); }
  function mixHex(a, b, r) {
    var ca = hexToRgb(a), cb = hexToRgb(b);
    if (!ca || !cb) return null;
    var out = "#", i, v;
    for (i = 0; i < 3; i++) {
      v = Math.round(ca[i] + (cb[i] - ca[i]) * r);
      out += ("0" + Math.max(0, Math.min(255, v)).toString(16)).slice(-2);
    }
    return out;
  }
  /* বর্তমান পেজের আইডি — pages-ওভাররাইডের জন্য (index/discover/…/profile) */
  var PAGE_ID = (function () {
    try {
      var p = String(location.pathname).split("?")[0].split("#")[0];
      var m = p.match(/\/([^\/]+)\.html?$/i);
      var id = m ? m[1] : (/\/$/i.test(p) ? "index" : "");
      return id.toLowerCase();
    } catch (e) { return ""; }
  })();

  /* ---------- কনফিগ একত্রীকরণ (committed + লাইভ-প্রিভিউ) ---------- */
  var committed = window.TZ_BRAND || {};
  var cfg = merge(DEF, committed);
  var previewOn = false;
  try {
    var raw = localStorage.getItem(PKEY);
    if (raw) {
      var pv = JSON.parse(raw);
      if (pv && pv.on && pv.config) { cfg = merge(cfg, pv.config); previewOn = true; }
    }
  } catch (e) {}

  /* ============================================================
     পাস ১ — CSS টোকেন-ওভাররাইড (স্টাইলশিট লোডের সাথে সাথেই কার্যকর)
     ============================================================ */
  function cssPass() {
    var C = cfg.colors, D = DEF.colors, css = "", el, k;
    /* ব্যানার-বেস CSS (সবসময় থাকে — ব্যানার চালু হলেই কাজ করবে) */
    var bnCss = ".tz-brand-banner{display:flex;align-items:center;justify-content:center;gap:10px;padding:9px 38px 9px 14px;background:var(--grad,linear-gradient(135deg,#ff2daa,#ff7a00));color:#fff;font-size:13.5px;font-weight:600;position:relative;z-index:80;text-align:center}" +
      ".tz-brand-banner .tz-bn-link{color:inherit;text-decoration:none;display:flex;align-items:center;gap:8px}" +
      ".tz-brand-banner .tz-bn-link:hover{text-decoration:underline}" +
      ".tz-brand-banner .tz-bn-text{opacity:.97}" +
      ".tz-brand-banner .tz-bn-x{position:absolute;right:10px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.18);border:none;color:#fff;width:22px;height:22px;border-radius:7px;cursor:pointer;font-size:11px;line-height:1;display:flex;align-items:center;justify-content:center}";
    /* v2.1: লাইট-মোড রিডেবিলিটি-ফিক্স — সাইটের হেডার/বটমবারের ব্যাকগ্রাউন্ড হার্ডকোড
       ডার্ক ছিল, ফলে লাইট-মোডে গাঢ় লেখা অদৃশ্য হয়ে যেত। এখন ওই বারগুলো
       লাইট-প্যালেট ফলো করবে (শুধু [data-theme="light"]-এ সক্রিয় — ডার্ক অপরিবর্তিত)। */
    bnCss += ':root[data-theme="light"] .site-header{background:var(--bg-soft) !important;}';
    bnCss += ':root[data-theme="light"] .bottombar{background:var(--bg-soft) !important;}';
    bnCss += ':root[data-theme="light"] .site-header .brand{color:var(--text) !important;}';
    bnCss += ':root[data-theme="light"] .site-header .brand small{color:var(--muted) !important;}';
    el = document.getElementById("tz-brand-base");
    if (!el) {
      el = document.createElement("style");
      el.id = "tz-brand-base";
      (document.head || document.documentElement).appendChild(el);
    }
    if (el.textContent !== bnCss) el.textContent = bnCss;
    /* কাস্টম CSS (অ্যাডমিন-প্যানেল → অ্যাডভান্সড সেকশন) */
    if (cfg.customCss) {
      var cEl = document.getElementById("tz-brand-custom");
      if (!cEl) {
        cEl = document.createElement("style");
        cEl.id = "tz-brand-custom";
        (document.head || document.documentElement).appendChild(cEl);
      }
      if (cEl.textContent !== cfg.customCss) cEl.textContent = cfg.customCss;
    }
    var dmap = { bg: "--bg", bgSoft: "--bg-soft", card: "--card", card2: "--card-2", border: "--border", borderSoft: "--border-soft", text: "--text", muted: "--muted", muted2: "--muted-2" };
    function block(sel, obj, def) {
      var b = "";
      for (k in dmap) if (obj[k] && String(obj[k]).toLowerCase() !== String(def[k]).toLowerCase()) b += dmap[k] + ":" + obj[k] + " !important;";
      return b ? sel + "{" + b + "}" : "";
    }
    css += block(":root", C.dark, D.dark);
    css += block(':root[data-theme="light"]', C.light, D.light);
    if (String(C.primary).toLowerCase() !== String(D.primary).toLowerCase()) css += ":root{--pink:" + C.primary + " !important;}";
    if (String(C.secondary).toLowerCase() !== String(D.secondary).toLowerCase()) css += ":root{--orange:" + C.secondary + " !important;}";
    if (C.autoGrad && (String(C.primary).toLowerCase() !== String(D.primary).toLowerCase() || String(C.secondary).toLowerCase() !== String(D.secondary).toLowerCase())) {
      var g1 = rgba(C.primary, .16), g2 = rgba(C.secondary, .16);
      css += ":root{--grad:linear-gradient(135deg," + C.primary + "," + C.secondary + ") !important;";
      if (g1 && g2) css += "--grad-soft:linear-gradient(135deg," + g1 + "," + g2 + ") !important;";
      css += "}";
    }
    if (cfg.radius.base !== DEF.radius.base) css += ":root{--radius:" + cfg.radius.base + "px !important;}";
    if (cfg.radius.sm !== DEF.radius.sm) css += ":root{--radius-sm:" + cfg.radius.sm + "px !important;}";
    if (cfg.fonts.body) css += ":root{--font:'" + cfg.fonts.body + "',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Noto Sans',sans-serif !important;}";
    if (cfg.fonts.head) css += "h1,h2,h3,h4,h5,h6,a.brand>span:not(.brand-mark){font-family:'" + cfg.fonts.head + "',var(--font) !important;}";
    if (cfg.fonts.bodySize) css += "body{font-size:" + cfg.fonts.bodySize + "px !important;}";
    if (cfg.logo.height) css += ".brand-mark img,.brand-mark svg{height:" + cfg.logo.height + "px !important;width:auto !important;}";
    if (cfg.logo.type === "emoji") css += ".brand-mark .tz-emoji{font-size:24px;line-height:1;display:block;}";
    /* ---------- v2.0: শেপ (প্রম্পট-কার্ড) — পটভূমি + ভেতরের লেখার রং ---------- */
    (function () {
      var SH = (cfg.colors && cfg.colors.shape) || {}, pre, o, decl;
      ["dark", "light"].forEach(function (mode) {
        o = SH[mode] || {};
        pre = mode === "dark" ? ":root" : ':root[data-theme="light"]';
        if (isHex(o.bg)) css += pre + " .prompt-inner{background:" + o.bg.trim() + " !important;}";
        decl = "";
        if (isHex(o.textBg)) decl += "background:" + o.textBg.trim() + " !important;";
        if (isHex(o.text)) decl += "color:" + o.text.trim() + " !important;";
        if (decl) css += pre + " .prompt-text{" + decl + "}";
        if (isHex(o.head)) css += pre + " .prompt-head h2{color:" + o.head.trim() + " !important;}";
        if (isHex(o.muted)) css += pre + " .prompt-count," + pre + " .paste-into," + pre + " .cust-sub{color:" + o.muted.trim() + " !important;}";
      });
    })();
    /* ---------- v2.0: ছায়া (shadow) ---------- */
    var SHV = { "off": "none", "soft": "0 6px 18px rgba(0,0,0,.16)", "strong": "0 18px 50px rgba(0,0,0,.55)" };
    if (SHV[cfg.shadow]) css += ":root{--shadow:" + SHV[cfg.shadow] + " !important;}";
    /* ---------- v2.0: কনটেন্ট-চওড়া (layout.wrapMax) ---------- */
    if (cfg.layout && +cfg.layout.wrapMax >= 900) css += ".wrap{max-width:" + Math.round(+cfg.layout.wrapMax) + "px !important;}";
    if (css) {
      el = document.getElementById("tz-brand-style");
      if (!el) {
        el = document.createElement("style");
        el.id = "tz-brand-style";
        (document.head || document.documentElement).appendChild(el);
      }
      if (el.textContent !== css) el.textContent = css;
    }
    /* Google Fonts লোড */
    if ((cfg.fonts.body || cfg.fonts.head) && !document.getElementById("tz-brand-fonts")) {
      var fams = [], q = function (n) { return "family=" + encodeURIComponent(n).replace(/%20/g, "+"); };
      if (cfg.fonts.body) fams.push(q(cfg.fonts.body) + ":wght@400;500;600;700");
      if (cfg.fonts.head && cfg.fonts.head !== cfg.fonts.body) fams.push(q(cfg.fonts.head) + ":wght@500;600;700;800");
      var lk = document.createElement("link");
      lk.id = "tz-brand-fonts"; lk.rel = "stylesheet";
      lk.href = "https://fonts.googleapis.com/css2?" + fams.join("&") + "&display=swap";
      (document.head || document.documentElement).appendChild(lk);
    }
    /* মোবাইল ব্রাউজার-বার রং */
    if (C.dark.bg !== D.dark.bg) {
      var mt = document.querySelector('meta[name="theme-color"]');
      if (mt) mt.setAttribute("content", C.dark.bg);
    }
    /* ---------- v2.0: পেজ-ভিত্তিক ওভাররাইড (এই পেজেই সীমাবদ্ধ) ---------- */
    var pg = (cfg.pages && PAGE_ID && cfg.pages[PAGE_ID]) || null, pcss = "";
    if (pg) {
      if (isHex(pg.primary)) pcss += ":root{--pink:" + pg.primary.trim() + " !important;}";
      if (isHex(pg.secondary)) pcss += ":root{--orange:" + pg.secondary.trim() + " !important;}";
      if (isHex(pg.primary) && isHex(pg.secondary) && pg.autoGrad !== false) {
        pcss += ":root{--grad:linear-gradient(135deg," + pg.primary.trim() + "," + pg.secondary.trim() + ") !important;}";
        var pg1 = rgba(pg.primary, .16), pg2 = rgba(pg.secondary, .16);
        if (pg1 && pg2) pcss += ":root{--grad-soft:linear-gradient(135deg," + pg1 + "," + pg2 + ") !important;}";
      }
    }
    if (pcss) {
      var pEl = document.getElementById("tz-brand-page");
      if (!pEl) {
        pEl = document.createElement("style");
        pEl.id = "tz-brand-page";
        (document.head || document.documentElement).appendChild(pEl);
      }
      if (pEl.textContent !== pcss) pEl.textContent = pcss;
    } else {
      var pOld = document.getElementById("tz-brand-page");
      if (pOld) pOld.remove();
    }
    if (pg && pg.customCss) {
      var pcEl = document.getElementById("tz-brand-pagecss");
      if (!pcEl) {
        pcEl = document.createElement("style");
        pcEl.id = "tz-brand-pagecss";
        (document.head || document.documentElement).appendChild(pcEl);
      }
      if (pcEl.textContent !== pg.customCss) pcEl.textContent = pg.customCss;
    } else {
      var pcOld = document.getElementById("tz-brand-pagecss");
      if (pcOld) pcOld.remove();
    }
  }

  /* ============================================================
     পাস ২ — CSSOM রিরাইট: স্টাইলশিটের ভেতরে হার্ডকোড করা রং
     (#ff2daa / rgba(255,45,170,…) → নতুন রং) — রানটাইমে, ফাইল না ছুঁয়ে
     ============================================================ */
  var CMAP = null, CFAST = null;
  function buildColorMap() {
    var list = [], fast = [], C = cfg.colors, D = DEF.colors;
    /* প্রতিটি রঙের জন্য ৩টি প্যাটার্ন: #হেক্স · rgb() · rgba(…,α) — ব্রাউজার/CSSOM
       মান নরমালাইজ করলেও (স্পেসসহ rgb(255, 45, 170)) ধরা পড়বে */
    function pushColor(oldH, newH) {
      if (!oldH || !newH || String(oldH).toLowerCase() === String(newH).toLowerCase()) return;
      var o = String(oldH), n = String(newH);
      list.push([new RegExp("#" + o.slice(1), "ig"), n]);
      var c = hexToRgb(o);
      if (c) {
        var pat = "rgba?\\(\\s*" + c[0] + "\\s*,\\s*" + c[1] + "\\s*,\\s*" + c[2] + "\\s*(?:,\\s*([\\d.]+)\\s*)?\\)";
        list.push([new RegExp(pat, "g"), function (m, a) { return rgba(n, a === undefined ? 1 : a) || m; }]);
        fast.push(c.join(","));
      }
      fast.push(o.slice(1).toLowerCase());
    }
    pushColor(D.primary, C.primary);
    pushColor(D.secondary, C.secondary);
    /* v2.0: প্রাইমারি/সেকেন্ডারি বদলালে সাইটের হার্ডকোড টিন্ট-অ্যাকসেন্টগুলোও
       (হার্ট ❤, ক্যাট-চিপ, mark-হাইলাইট ইত্যাদি) নতুন রঙের সাথে মিলিয়ে যাবে */
    var TINTS = [
      ["#ffb0da", "primary", .60], ["#ffc4e3", "primary", .70], ["#ff7ec3", "primary", .40],
      ["#ffd4ee", "primary", .82], ["#ff9de0", "primary", .55], ["#ffb35e", "secondary", .55],
      ["#ff7ec2", "primary", .42]
    ];
    TINTS.forEach(function (tt) {
      var nv = mixHex(C[tt[1]] || D[tt[1]], "#ffffff", tt[2]);
      if (nv && String(C[tt[1]]).toLowerCase() !== String(D[tt[1]]).toLowerCase()) pushColor(tt[0], nv);
    });
    ["dark", "light"].forEach(function (mode) {
      var nm = C[mode] || {}, od = D[mode];
      ["bg", "bgSoft", "card", "card2", "border", "borderSoft", "text", "muted", "muted2"].forEach(function (k) { pushColor(od[k], nm[k]); });
    });
    CFAST = fast;
    return list;
  }
  function mapValue(v) {
    if (!CMAP) CMAP = buildColorMap();
    if (!CMAP.length) return v;
    /* দ্রুত প্রি-চেক: হোয়াইটস্পেস বাদ দিয়ে খোঁজা */
    var low = String(v).toLowerCase().replace(/\s+/g, ""), i;
    for (i = 0; i < CFAST.length; i++) if (low.indexOf(CFAST[i]) > -1) break;
    if (i >= CFAST.length) return v;
    for (i = 0; i < CMAP.length; i++) v = v.replace(CMAP[i][0], CMAP[i][1]);
    return v;
  }
  function rwStyle(st) {
    var n = 0, i, p, v, nv;
    for (i = 0; i < st.length; i++) {
      p = st.item(i);
      try { v = st.getPropertyValue(p); } catch (e) { continue; }
      if (!v) continue;
      nv = mapValue(v);
      if (nv !== v) {
        try { st.setProperty(p, nv, st.getPropertyPriority(p) || ""); n++; } catch (e2) {}
      }
    }
    return n;
  }
  function rwRules(rules) {
    var n = 0, i, r;
    for (i = 0; i < rules.length; i++) {
      r = rules[i];
      try {
        if (r.cssRules) n += rwRules(r.cssRules);
        if (r.style) n += rwStyle(r.style);
      } catch (e) {}
    }
    return n;
  }
  function rwSheet(sheet) {
    try { return rwRules(sheet.cssRules); } catch (e) { return 0; }
  }
  var sheetStats = [], cssomCount = 0;
  function cssomIncremental() {
    if (!CMAP) CMAP = buildColorMap();
    if (!CMAP.length) return;
    var sheets = document.styleSheets || [];
    for (var i = 0; i < sheets.length; i++) {
      var sh = sheets[i], key, cnt = 0, prev = null, j;
      try { cnt = sh.cssRules.length; } catch (e) { continue; }
      key = (sh.href || "inline") + "#" + i;
      for (j = 0; j < sheetStats.length; j++) if (sheetStats[j].key === key) { prev = sheetStats[j]; break; }
      if (prev && prev.count === cnt) continue;
      cssomCount += rwSheet(sh);
      if (prev) prev.count = cnt; else sheetStats.push({ key: key, count: cnt });
    }
  }

  /* ============================================================
     পাস ৩ — DOM ব্র্যান্ডিং (নাম / লোগো / ফেভিকন / ট্যাগলাইন)
     ============================================================ */
  function applyMark(mark) {
    var cur;
    if (cfg.logo.type === "emoji" && cfg.logo.emoji) {
      cur = mark.querySelector(".tz-emoji");
      if (!cur || cur.getAttribute("data-tz") !== cfg.logo.emoji) {
        mark.innerHTML = '<span class="tz-emoji" data-tz="' + escA(cfg.logo.emoji) + '">' + escH(cfg.logo.emoji) + "</span>";
      }
    } else if (cfg.logo.type === "image" && cfg.logo.url) {
      cur = mark.querySelector("img");
      if (!cur || cur.getAttribute("src") !== cfg.logo.url) {
        mark.innerHTML = '<img src="' + escA(cfg.logo.url) + '" alt="' + escH(cfg.siteName) + ' logo">';
        mark.classList.add("mark-img");
      }
    }
    /* type "keep" → app.js-এর বর্তমান লোগো অপরিবর্তিত থাকবে */
  }
  function brandPass() {
    var name = cfg.siteName, i, b, sp, tn, sm, mark, fi, ap, ds;
    /* ফেভিকন */
    if (cfg.favicon) {
      fi = document.querySelector('link[rel="icon"]');
      if (!fi) {
        fi = document.createElement("link");
        fi.rel = "icon";
        (document.head || document.documentElement).appendChild(fi);
      }
      if (fi.getAttribute("href") !== cfg.favicon) fi.setAttribute("href", cfg.favicon);
      ap = document.querySelector('link[rel="apple-touch-icon"]');
      if (ap && ap.getAttribute("href") !== cfg.favicon) ap.setAttribute("href", cfg.favicon);
    }
    /* সব ব্র্যান্ড-অ্যাঙ্কর (হেডার + ফুটার) */
    var brands = document.querySelectorAll("a.brand");
    for (i = 0; i < brands.length; i++) {
      b = brands[i];
      if (name !== ORIG.name) {
        sp = b.querySelector("span:not(.brand-mark)");
        if (sp) {
          tn = firstTextNode(sp);
          if (tn && NAME_RE.test(tn.nodeValue)) { NAME_RE.lastIndex = 0; tn.nodeValue = tn.nodeValue.replace(/TEZOFY|Tezofy/g, name); }
          NAME_RE.lastIndex = 0;
        }
        var al = b.getAttribute("aria-label");
        if (al && /TEZOFY|Tezofy/.test(al)) b.setAttribute("aria-label", al.replace(/TEZOFY|Tezofy/g, name));
      }
      /* ট্যাগলাইন — নাম বদলুক বা না বদলুক, ডিফল্ট-ট্যাগলাইনের জায়গায় প্রযোজ্য */
      sm = b.querySelector("small");
      if (sm && cfg.tagline !== ORIG.tagline && sm.textContent.trim() === ORIG.tagline) sm.textContent = cfg.tagline;
      mark = b.querySelector(".brand-mark");
      if (mark) applyMark(mark);
    }
    /* ইনডেক্স-স্প্ল্যাশ লোগো */
    ds = document.querySelector(".ds-logo img");
    if (ds) {
      if (cfg.logo.type === "image" && cfg.logo.url && ds.getAttribute("src") !== cfg.logo.url) ds.setAttribute("src", cfg.logo.url);
      if (name !== ORIG.name) {
        var da = ds.getAttribute("alt");
        if (da && /TEZOFY|Tezofy/.test(da)) ds.setAttribute("alt", da.replace(/TEZOFY|Tezofy/g, name));
      }
    }
    /* ফুটার © লাইন (অ্যাডমিন-প্যানেল → কনটেন্ট সেকশন) */
    if (cfg.footerText) {
      var fbEl = document.querySelector(".footer-bottom span");
      if (fbEl && fbEl.textContent.trim() !== cfg.footerText) fbEl.textContent = cfg.footerText;
    }
  }

  /* ---------- ঘোষণা-ব্যানার (সব পেজের উপরে) ---------- */
  var BKEY = "chitro:tz:banner-off";
  function bannerPass() {
    var bn = cfg.banner || {}, el = document.getElementById("tz-brand-banner");
    if (!bn.on || !bn.text || !document.body) { if (el) el.remove(); return; }
    try {
      if (bn.dismissible !== false && sessionStorage.getItem(BKEY) === "1") { if (el) el.remove(); return; }
    } catch (e) {}
    var sig = JSON.stringify(bn);
    if (el && el.getAttribute("data-tz") !== sig) { el.remove(); el = null; }
    if (el) return;
    el = document.createElement("div");
    el.id = "tz-brand-banner";
    el.className = "tz-brand-banner";
    el.setAttribute("data-tz", sig);
    var inner = '<span class="tz-bn-text">' + escH(bn.text) + "</span>";
    if (bn.href) inner = '<a class="tz-bn-link" href="' + escA(bn.href) + '">' + inner + "</a>";
    if (bn.dismissible !== false) inner += '<button class="tz-bn-x" aria-label="বন্ধ করুন">✕</button>';
    el.innerHTML = inner;
    var header = document.querySelector("header.site-header, .site-header");
    if (header && header.parentNode) header.parentNode.insertBefore(el, header.nextSibling);
    else document.body.insertBefore(el, document.body.firstChild);
    var x = el.querySelector(".tz-bn-x");
    if (x) x.addEventListener("click", function () {
      try { sessionStorage.setItem(BKEY, "1"); } catch (e2) {}
      el.remove();
    });
  }

  /* ---------- ডিফল্ট থিম (নতুন ভিজিটর — ইউজার-পছন্দ থাকলে স্পর্শ নয়) ---------- */
  var THEME_KEY = "chitro:theme";
  function themePass() {
    var t = cfg.theme && cfg.theme.default;
    if (t !== "dark" && t !== "light") return;
    /* v2.0: প্রিভিউ-মোডে (নিজের ব্রাউজারে 👁) ডিফল্ট-থিম জোর করে দেখাই —
       মালিক নিজের সেভ-করা থিমের পেছনে লুকিয়ে থাকলেও নতুন ভিজিটর যা দেখবে তা বোঝা যাবে */
    if (previewOn) {
      if (document.documentElement.getAttribute("data-theme") !== t) document.documentElement.setAttribute("data-theme", t);
      return;
    }
    try { if (localStorage.getItem(THEME_KEY) !== null) return; } catch (e) { return; }
    if (document.documentElement.getAttribute("data-theme") !== t) document.documentElement.setAttribute("data-theme", t);
  }

  /* নাম-পরিবর্তন: <title>, og/twitter meta, বডি-টেক্সট */
  var SKIP = { SCRIPT: 1, STYLE: 1, CODE: 1, PRE: 1, TEXTAREA: 1, NOSCRIPT: 1 };
  function walkText(root, name) {
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentNode;
        if (p && SKIP[p.nodeName]) return NodeFilter.FILTER_REJECT;
        return /TEZOFY|Tezofy/.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    }), n, batch = [];
    while ((n = w.nextNode())) batch.push(n);
    for (var i = 0; i < batch.length; i++) batch[i].nodeValue = batch[i].nodeValue.replace(/TEZOFY|Tezofy/g, name);
  }
  function textPass() {
    if (cfg.siteName === ORIG.name) return;
    var name = cfg.siteName, i, c;
    if (document.title && /TEZOFY|Tezofy/.test(document.title)) document.title = document.title.replace(/TEZOFY|Tezofy/g, name);
    var metas = document.querySelectorAll('meta[property="og:site_name"],meta[property="og:title"],meta[name="twitter:title"]');
    for (i = 0; i < metas.length; i++) {
      c = metas[i].getAttribute("content");
      if (c && /TEZOFY|Tezofy/.test(c)) metas[i].setAttribute("content", c.replace(/TEZOFY|Tezofy/g, name));
    }
    if (!document.body) return;
    if (cfg.nameScope === "brand") {
      var scopes = document.querySelectorAll(".site-header, .site-footer, footer, .bottombar, .ds-splash");
      for (i = 0; i < scopes.length; i++) walkText(scopes[i], name);
    } else {
      walkText(document.body, name);
    }
  }

  /* ইনলাইন style="" অ্যাট্রিবিউটে হার্ডকোড রং */
  function inlineStylePass() {
    if (!CMAP) CMAP = buildColorMap();
    if (!CMAP.length || !document.body) return;
    var els = document.querySelectorAll("[style]"), i, sv, nv;
    for (i = 0; i < els.length; i++) {
      sv = els[i].getAttribute("style");
      if (!sv || !/(#[0-9a-f]{3,8})|(rgb)/i.test(sv)) continue;
      nv = mapValue(sv);
      if (nv !== sv) els[i].setAttribute("style", nv);
    }
  }

  /* ---------- অর্কেস্ট্রেশন + MutationObserver ---------- */
  var applying = false, scheduled = false, mo = null;
  function applyAll() {
    applying = true;
    try { cssPass(); themePass(); brandPass(); bannerPass(); textPass(); inlineStylePass(); cssomIncremental(); }
    finally { applying = false; }
  }
  function scheduleApply() {
    if (scheduled || applying) return;
    scheduled = true;
    setTimeout(function () { scheduled = false; applyAll(); }, 80);
  }
  function startObserver() {
    if (mo || typeof MutationObserver === "undefined") return;
    mo = new MutationObserver(function () { if (!applying) scheduleApply(); });
    mo.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  }

  /* প্যানেল অন্য ট্যাবে প্রিভিউ টগল করলে অটো-রিফ্রেশ */
  try {
    window.addEventListener("storage", function (ev) {
      if (ev && ev.key === PKEY) { try { location.reload(); } catch (e) {} }
    });
  } catch (e) {}

  /* ---------- বুট ---------- */
  cssPass();
  cssomIncremental();
  function boot() { applyAll(); startObserver(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  /* ---------- পাবলিক API ---------- */
  window.TezoBrand = {
    version: "2.1",
    page: PAGE_ID,
    config: cfg,
    committed: committed,
    defaults: DEF,
    previewOn: previewOn,
    apply: applyAll,
    cssomRewrites: function () { return cssomCount; }
  };
})();

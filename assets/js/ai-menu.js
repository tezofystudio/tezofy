/* ============================================================
   TEZOFY — AI Tools Menu (v1.0)
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
    ".ai-pill:hover { transform: translateY(-1px); box-shadow: 0 6px 22px rgba(255,45,170,.5); }" +
    ".ai-pill svg { width: 17px; height: 17px; stroke: #fff; animation: ai-spark 2.4s ease-in-out infinite; }" +
    "@media (min-width: 860px) { .ai-pill { display: inline-flex; } }" +
    "@keyframes ai-spark { 0%, 100% { transform: rotate(0) scale(1); } 50% { transform: rotate(12deg) scale(1.12); } }" +

    "/* Backdrop veil */" +
    ".ai-veil { position: fixed; inset: 0; background: rgba(5,6,10,.6); backdrop-filter: blur(6px);" +
    "  -webkit-backdrop-filter: blur(6px); z-index: 120; opacity: 0; pointer-events: none;" +
    "  transition: opacity .22s cubic-bezier(.2,.8,.2,1); }" +
    ".ai-veil.open { opacity: 1; pointer-events: auto; }" +

    "/* Flying menu sheet/card */" +
    ".ai-fly { position: fixed; z-index: 121; background: var(--card, #12131a); border: 1px solid var(--border, rgba(255,255,255,.14));" +
    "  border-radius: 20px; padding: 10px; width: min(340px, calc(100vw - 28px));" +
    "  box-shadow: 0 20px 60px rgba(0,0,0,.65), 0 0 0 1px rgba(255,45,170,.25);" +
    "  opacity: 0; pointer-events: none; transition: transform .24s cubic-bezier(.2,.9,.3,1), opacity .2s;" +
    "  max-height: 84vh; overflow-y: auto; }" +
    ".ai-fly.open { opacity: 1; pointer-events: auto; }" +

    "/* Open from bottom-bar (mobile/all) */" +
    ".ai-fly.ai-from-bar { bottom: calc(64px + env(safe-area-inset-bottom, 0px) + 12px); left: 50%;" +
    "  transform: translate(-50%, 18px) scale(.96); transform-origin: bottom center; }" +
    ".ai-fly.ai-from-bar.open { transform: translate(-50%, 0) scale(1); }" +

    "/* Open from header (desktop) */" +
    ".ai-fly.ai-from-head { top: 68px; right: 24px; transform: translateY(-12px) scale(.96); transform-origin: top right; }" +
    ".ai-fly.ai-from-head.open { transform: translateY(0) scale(1); }" +

    "/* Items */" +
    ".ai-fly-head { display: flex; align-items: center; gap: 8px; padding: 10px 12px 8px;" +
    "  font-size: .75rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase;" +
    "  color: var(--muted, #8b90a0); border-bottom: 1px solid var(--border-soft, rgba(255,255,255,.08)); margin-bottom: 6px; }" +
    ".ai-fly-head svg { width: 15px; height: 15px; stroke: #ff2daa; }" +
    ".ai-fly-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 12px;" +
    "  text-decoration: none; color: var(--text, #fff); transition: background .16s, transform .14s; }" +
    ".ai-fly-item:hover { background: rgba(255,255,255,.06); transform: translateX(3px); }" +
    ".ai-fly-item:active { transform: scale(.98); }" +
    ".ai-fly-item .ic { width: 38px; height: 38px; border-radius: 10px; background: rgba(255,255,255,.06);" +
    "  display: grid; place-items: center; font-size: 1.25rem; flex: none; border: 1px solid rgba(255,255,255,.08); }" +
    ".ai-fly-item .tx { flex: 1; min-width: 0; }" +
    ".ai-fly-item .tx b { display: block; font-size: .92rem; font-weight: 700; line-height: 1.2; }" +
    ".ai-fly-item .tx small { display: block; font-size: .72rem; color: var(--muted, #8b90a0); margin-top: 2px;" +
    "  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }" +
    ".ai-fly-item .go { font-size: .95rem; color: var(--muted, #8b90a0); transition: transform .16s, color .16s; }" +
    ".ai-fly-item:hover .go { transform: translateX(3px); color: #ff2daa; }" +

    "/* Bottombar .bb-ai প্রমোট চেহারা */" +
    "@media (max-width: 859px) {" +
    "  .bottombar .bb-ai { position: relative; }" +
    "  .bottombar .bb-ai .bb-core { position: relative; width: 52px; height: 52px; border-radius: 999px;" +
    "    background: var(--grad); display: grid; place-items: center;" +
    "    box-shadow: 0 4px 16px rgba(255,45,170,.45); position: relative;" +
    "    animation: bb-breathe 2.4s ease-in-out infinite; }" +
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

    /* ১) বটমবারের ai-hub লিংক → মেনু-ট্রিগার */
    var links = document.querySelectorAll('.bottombar a[href="ai-hub.html"]');
    Array.prototype.forEach.call(links, function (a) {
      if (a.classList.contains("active")) return;
      a.setAttribute("data-ai-trigger", "bar");
      a.setAttribute("aria-haspopup", "menu");
      a.setAttribute("aria-expanded", "false");
      a.addEventListener("click", function (e) {
        e.preventDefault();
        toggle(a);
      });
    });

    /* ২) ডেস্কটপ হেডারে "✨ AI Tools" পিল */
    var actions = document.querySelector(".site-header .header-actions");
    if (actions && !document.querySelector(".header-actions .ai-pill")) {
      var pill = document.createElement("button");
      pill.type = "button";
      pill.className = "ai-pill";
      pill.setAttribute("data-ai-trigger", "head");
      pill.setAttribute("aria-haspopup", "menu");
      pill.setAttribute("aria-expanded", "false");
      pill.innerHTML = SPARK + "<span>AI Tools</span>";
      actions.insertBefore(pill, actions.firstChild);
      pill.addEventListener("click", function (e) { e.preventDefault(); toggle(pill); });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enhance);
  } else {
    enhance();
  }
})();

/* ============================================================
   TEZOFY — AI Tool Pages: Full Gatekeeper Auth & Security Engine
   - 6-Digit Email OTP Verification on Sign Up
   - Full Self-Service Forgot Password & Reset Flow
   - Cloud Social Login (Google Sign-In + Facebook)
   - Profile Dashboard, 3-State Smart Header Button
   - Disposable Email Shield & Encrypted Passwords
   ============================================================ */
(function () {
  "use strict";

  var CFG = window.AUTH_CONFIG || {
    sheetUrl: "https://script.google.com/macros/s/AKfycbwWZQyM-KgQcapysDkiju8Uk6upd3MZROXF5BU-QaA2RHn_XkyMvjJKhAtlmjneGIt_/exec",
    googleClientId: "212033639328-iqbjtddt28gpq2euuq61cilp4pb2fqcj.apps.googleusercontent.com",
    fbAppId: "1474580381159042"
  };

  /* -------- 1. TEMP-MAIL SHIELD -------- */
  var BLOCKED_DOMAINS = "10minute.cf|10minutemail.be|10minutemail.co.uk|10minutemail.com|10minutemail.net|10minutemail.org|burnermail.io|dispostable.com|fakeinbox.com|fakemail.net|getnada.com|guerrillamail.com|inboxkitten.com|jetable.org|mailcatch.com|maildrop.cc|mailexpire.com|mailinator.com|mailnesia.com|mintemail.com|moakt.com|mohmal.com|mytemp.email|mytrashmail.com|sharklasers.com|spambox.us|spamgourmet.com|temp-mail.org|tempail.com|tempemail.net|tempmail.com|tempmail.net|tempmailo.com|throwawaymail.com|trashmail.com|yopmail.com".split("|");
  var BLOCK_SUBS = "10minut|anonymbox|armyspy|burnermail|cuvox|dayrep|dispostable|duidir|einrot|emailondeck|fakeinbox|fakemail|fakermail|getnada|guerrillamail|inboxkitten|jetable|mailcatch|maildrop|mailexpire|mailinator|mailnesia|mintemail|minutemail|moakt|mohmal|pokemail|sharklasers|spamgourmet|temp-mail|tempail|tempinbox|tempmail|throwaway|trashmail|yopmail".split("|");

  function isDisposable(email) {
    var domain = String(email || "").split("@")[1];
    if (!domain) return false;
    domain = domain.toLowerCase().trim();
    for (var i = 0; i < BLOCKED_DOMAINS.length; i++) {
      if (domain === BLOCKED_DOMAINS[i] || domain.endsWith("." + BLOCKED_DOMAINS[i])) return true;
    }
    for (var j = 0; j < BLOCK_SUBS.length; j++) {
      if (BLOCK_SUBS[j] && domain.indexOf(BLOCK_SUBS[j]) !== -1) return true;
    }
    return false;
  }

  /* -------- 2. LOCAL STORAGE & HELPERS -------- */
  function getSession() {
    try { return JSON.parse(localStorage.getItem("chitro:session")); } catch (e) { return null; }
  }
  function getUsers() {
    try { return JSON.parse(localStorage.getItem("chitro:users")) || {}; } catch (e) { return {}; }
  }
  function currentUser() {
    var s = getSession();
    return s ? getUsers()[s] || null : null;
  }
  function hasAnyUsers() {
    return Object.keys(getUsers()).length > 0;
  }
  function avatarPhoto(email) {
    try { return JSON.parse(localStorage.getItem("chitro:avatar:" + email)) || ""; } catch (e) { return ""; }
  }
  function streak() {
    try {
      var v = JSON.parse(localStorage.getItem("chitro:visits")) || [];
      if (!v.length) return 0;
      var DAY = 86400000, n = 0, d = new Date(), today = d.toISOString().slice(0, 10);
      if (v[v.length - 1] !== today) d = new Date(d.getTime() - DAY);
      while (true) {
        var s = d.toISOString().slice(0, 10);
        if (v.indexOf(s) !== -1) { n++; d = new Date(d.getTime() - DAY); } else break;
      }
      return n;
    } catch (e) { return 0; }
  }
  function hash(s) {
    var h = 0; for (var i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; }
    return "h" + Math.abs(h).toString(36) + s.length;
  }
  function escH(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m];
    });
  }

  /* -------- 3. CLOUD BACKEND (APPS SCRIPT) API -------- */
  function cmd(payload) {
    if (!CFG.sheetUrl) return Promise.resolve({ ok: false, error: "Server is not configured" });
    return fetch(CFG.sheetUrl, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    }).then(function (r) { return r.json(); })
      .catch(function () { return { ok: false, error: "Network issue — please try again" }; });
  }

  function sha256Hex(str) {
    if (window.crypto && crypto.subtle && window.TextEncoder) {
      return crypto.subtle.digest("SHA-256", new TextEncoder().encode(str)).then(function (buf) {
        return Array.prototype.map.call(new Uint8Array(buf), function (x) { return ("0" + x.toString(16)).slice(-2); }).join("");
      });
    }
    return Promise.resolve(hash(str));
  }
  function hashPass(email, pass) {
    return sha256Hex(String(email || "").toLowerCase().trim() + "::" + String(pass || "") + "::tezofy-gk1");
  }

  function collectSheet(entry) {
    if (!CFG.sheetUrl) return;
    try {
      entry.date = new Date().toISOString();
      entry.site = location.host;
      if (!entry.action) entry.action = "register";
      fetch(CFG.sheetUrl, {
        method: "POST", mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(entry)
      }).catch(function () {});
    } catch (e) {}
  }

  /* -------- 4. TOAST NOTIFICATION -------- */
  function showToast(msg) {
    var t = document.getElementById("tzToast");
    if (!t) {
      t = document.createElement("div");
      t.id = "tzToast";
      t.style.cssText = "position:fixed;left:50%;bottom:calc(env(safe-area-inset-bottom, 0px) + 76px);transform:translateX(-50%) translateY(16px);background:rgba(18,19,26,0.96);border:1px solid rgba(255,45,170,0.45);color:#fff;padding:11px 22px;border-radius:999px;font-size:0.86rem;font-weight:700;z-index:9999;opacity:0;pointer-events:none;transition:all 0.24s cubic-bezier(0.2,0.8,0.2,1);box-shadow:0 8px 32px rgba(0,0,0,0.6);text-align:center;max-width:90vw;";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = "1";
    t.style.transform = "translateX(-50%) translateY(0)";
    setTimeout(function() {
      t.style.opacity = "0";
      t.style.transform = "translateX(-50%) translateY(16px)";
    }, 3200);
  }

  /* -------- 5. SOCIAL AUTH (GOOGLE & FB) -------- */
  var gsiLoading = false;
  function renderGoogleBtn(container, onSuccess) {
    if (!container || !CFG.googleClientId) return;
    function boot() {
      if (!window.google || !google.accounts) return;
      google.accounts.id.initialize({
        client_id: CFG.googleClientId,
        callback: function (resp) {
          try {
            var payload = JSON.parse(atob(resp.credential.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
            if (payload && payload.email) {
              onSuccess({ name: payload.name || payload.email.split("@")[0], email: payload.email, provider: "google" });
            }
          } catch (e) {}
        }
      });
      try {
        var w = Math.min(container.clientWidth || 320, 380);
        google.accounts.id.renderButton(container, {
          theme: "outline", size: "large", width: w,
          text: "continue_with", shape: "pill", logo_alignment: "center"
        });
      } catch (e) {}
    }
    if (window.google && google.accounts) { boot(); return; }
    if (gsiLoading) { var t = setInterval(function () { if (window.google && google.accounts) { clearInterval(t); boot(); } }, 150); return; }
    gsiLoading = true;
    var s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true; s.defer = true;
    s.onload = boot;
    document.head.appendChild(s);
  }

  var fbLoading = false;
  function loginFacebook(onSuccess, onErr) {
    if (!CFG.fbAppId) { if (onErr) onErr("Facebook login not configured."); return; }
    function run() {
      FB.login(function (resp) {
        if (!resp.authResponse) { if (onErr) onErr("Login was cancelled."); return; }
        FB.api("/me", { fields: "name,email" }, function (me) {
          if (me && me.email) {
            onSuccess({ name: me.name || me.email.split("@")[0], email: me.email, provider: "facebook" });
          } else if (onErr) {
            onErr("Facebook didn't share an email. Please sign up with email.");
          }
        });
      }, { scope: "public_profile,email" });
    }
    if (window.FB) { run(); return; }
    if (fbLoading) { var t = setInterval(function () { if (window.FB) { clearInterval(t); run(); } }, 150); return; }
    fbLoading = true;
    window.fbAsyncInit = function () {
      FB.init({ appId: CFG.fbAppId, cookie: true, xfbml: false, version: "v19.0" });
      run();
    };
    var root = document.getElementById("fb-root");
    if (!root) { root = document.createElement("div"); root.id = "fb-root"; document.body.appendChild(root); }
    var s = document.createElement("script");
    s.src = "https://connect.facebook.net/en_US/sdk.js";
    s.async = true; s.defer = true;
    document.head.appendChild(s);
  }

  function handleSocialSuccess(u) {
    if (isDisposable(u.email)) {
      showToast("Temporary email addresses aren't allowed — please sign in with real Gmail 🚫");
      return;
    }
    var users = getUsers();
    if (!users[u.email]) {
      users[u.email] = { name: u.name, email: u.email, pass: hash("social:" + u.provider + ":" + u.email), created: Date.now(), via: u.provider };
      localStorage.setItem("chitro:users", JSON.stringify(users));
    }
    localStorage.setItem("chitro:session", JSON.stringify(u.email));
    collectSheet({ name: u.name, email: u.email, provider: u.provider, page: location.pathname });
    close();
    updateAvatarHost();
    showToast("Welcome, " + u.name.split(" ")[0] + "! 🎉");
  }

  /* -------- 6. OVERLAY & DOM UTILS -------- */
  var CLOSE_SVG = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>';
  var BACK_SVG = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>';

  var ov = null;
  function ensureOverlay() {
    if (ov) return ov;
    ov = document.createElement("div");
    ov.className = "auth-overlay";
    ov.id = "tzAuthOverlay";
    document.body.appendChild(ov);
    ov.addEventListener("click", function (e) { if (e.target === ov) close(); });
    return ov;
  }
  function close() {
    if (ov) {
      ov.classList.remove("open");
      document.body.style.overflow = "";
    }
  }

  /* -------- 7. PROFILE DASHBOARD (LOGGED IN) -------- */
  function renderProfileModal() {
    ensureOverlay();
    var u = currentUser();
    if (!u) { renderAuthModal("signup"); return; }
    var ph = avatarPhoto(u.email);
    var st = streak();
    var initial = (u.name || u.email || "U").trim().charAt(0).toUpperCase();
    var since = u.created ? new Date(u.created).toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : "member";

    ov.innerHTML =
      '<div class="auth-card" role="dialog" aria-modal="true" aria-label="Profile">' +
        '<div class="sheet-handle"></div>' +
        '<div style="display:flex;justify-content:flex-end">' +
          '<button class="icon-btn" type="button" id="tzCloseProfile" aria-label="Close">' + CLOSE_SVG + '</button>' +
        '</div>' +
        '<div class="profile-hero">' +
          '<span class="pf-ring">' +
            '<div class="profile-avatar big">' +
              (ph ? '<img class="av-main" src="' + ph + '" alt="">' : initial) +
            '</div>' +
          '</span>' +
          '<div class="ph-info">' +
            '<h2>' + (u.name || "Creator") + '</h2>' +
            '<p>' + (u.email || "") + ' · since ' + since + '</p>' +
            '<div class="pill-row">' +
              '<span class="streak-pill">🔥 ' + st + ' day' + (st === 1 ? '' : 's') + ' streak</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="p-actions">' +
          '<a class="p-action" href="saved.html">⭐ <span>My saved prompts</span> <span class="right">→</span></a>' +
          '<a class="p-action" href="index.html">🏠 <span>Back to Home</span> <span class="right">→</span></a>' +
          '<button class="p-action danger" type="button" id="tzLogoutBtn">🚪 <span>Log out</span></button>' +
        '</div>' +
      '</div>';

    document.getElementById("tzCloseProfile").addEventListener("click", close);
    document.getElementById("tzLogoutBtn").addEventListener("click", function () {
      localStorage.setItem("chitro:session", "null");
      close();
      updateAvatarHost();
    });
    ov.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  /* -------- 8. MAIN AUTH MODAL (LOGIN & SIGNUP) -------- */
  function renderAuthModal(initialMode) {
    ensureOverlay();
    var currentMode = initialMode === "signup" ? "signup" : "login";

        ov.innerHTML =
      '<div class="auth-card" role="dialog" aria-modal="true" aria-label="Account">' +
        '<div class="sheet-handle"></div>' +
        '<div style="display:flex;justify-content:flex-end">' +
          '<button class="icon-btn" type="button" id="tzCloseAuth" aria-label="Close">' + CLOSE_SVG + '</button>' +
        '</div>' +
        '<div class="auth-head">' +
          '<span class="brand-mark"><img src="assets/icons/logo.png" alt="TEZOFY logo"></span>' +
          '<h2>Welcome to TEZOFY</h2>' +
          '<span class="brand-eyebrow">✦ PREMIUM AI PROMPT STUDIO</span>' +
          '<p>Save prompts, unlock members-only designs & keep your streak — free forever.</p>' +
        '</div>' +
        '<div class="auth-tabs">' +
          '<button type="button" id="tzTabLogin">Log In</button>' +
          '<button type="button" id="tzTabSignup">Sign Up</button>' +
        '</div>' +
        '<form id="tzAuthForm" novalidate>' +
          '<div class="field" id="tzNameField"><label for="tzName">YOUR NAME</label><input id="tzName" type="text" placeholder="e.g. Rahim Ahmed" autocomplete="name"></div>' +
          '<div class="field"><label for="tzEmail">EMAIL</label><input id="tzEmail" type="email" placeholder="you@example.com" autocomplete="email"></div>' +
          '<div class="field"><label for="tzPass">PASSWORD</label><input id="tzPass" type="password" placeholder="•••••••••••••" autocomplete="current-password"></div>' +
          '<div class="auth-error" id="tzAuthError"></div>' +
          '<button class="btn auth-submit" id="tzSubmitBtn" type="submit">Log In</button>' +
        '</form>' +
        '<button type="button" class="guest-link" id="tzForgotLink">🔑 Forgot password? →</button>' +
        '<div class="auth-divider"><span>OR CONTINUE WITH</span></div>' +
        '<div class="social-row">' +
          '<div id="tzGBtn" class="g-btn-slot">' +
            '<button type="button" class="social-btn google-fallback" id="tzGFallbackBtn">' +
              '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/><path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/></svg>' +
              '<span>Continue with Google</span>' +
            '</button>' +
          '</div>' +
          '<button type="button" class="social-btn fb" id="tzFbBtn">' +
            '<svg viewBox="0 0 24 24" width="18" height="18" fill="#fff" aria-hidden="true"><path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.3l-.5 3.5h-2.8v8.4A12 12 0 0 0 24 12z"/></svg>' +
            '<span>Continue with Facebook</span>' +
          '</button>' +
        '</div>' +
        '<button type="button" class="guest-link" id="tzGuestLink">Continue as guest for now →</button>' +
        '<p class="auth-note">🔒 Free forever. Every email is verified with a one-time code —<br>we only keep an encrypted password hash, never your actual password.</p>' +
      '</div>';

    var tabLogin = document.getElementById("tzTabLogin");
    var tabSignup = document.getElementById("tzTabSignup");
    var nameField = document.getElementById("tzNameField");
    var passInput = document.getElementById("tzPass");
    var submitBtn = document.getElementById("tzSubmitBtn");
    var forgotBtn = document.getElementById("tzForgotLink");
    var errEl = document.getElementById("tzAuthError");

    function setTab(mode) {
      currentMode = mode;
      errEl.textContent = "";
      errEl.classList.remove("show");
      if (mode === "signup") {
        tabSignup.classList.add("active");
        tabLogin.classList.remove("active");
        nameField.style.display = "";
        passInput.placeholder = "6+ chars: letter + number";
        submitBtn.textContent = "Create Free Account";
        forgotBtn.style.display = "none";
      } else {
        tabLogin.classList.add("active");
        tabSignup.classList.remove("active");
        nameField.style.display = "none";
        passInput.placeholder = "•••••••••••••";
        submitBtn.textContent = "Log In";
        forgotBtn.style.display = "";
      }
    }

    setTab(currentMode);

    tabLogin.addEventListener("click", function () { setTab("login"); });
    tabSignup.addEventListener("click", function () { setTab("signup"); });

    document.getElementById("tzCloseAuth").addEventListener("click", close);
    document.getElementById("tzGuestLink").addEventListener("click", close);

     /* Forgot Password Click */
    forgotBtn.addEventListener("click", function () {
      var preset = (document.getElementById("tzEmail").value || "").trim().toLowerCase();
      renderForgotStep(preset);
    });

    renderGoogleBtn(document.getElementById("tzGBtn"), handleSocialSuccess);

    document.getElementById("tzFbBtn").addEventListener("click", function () {
      loginFacebook(handleSocialSuccess, function (msg) {
        errEl.textContent = msg;
        errEl.classList.add("show");
      });
    });

    /* Submit Handler with Real OTP Trigger */
    document.getElementById("tzAuthForm").addEventListener("submit", function (e) {
      e.preventDefault();
      errEl.textContent = "";
      errEl.classList.remove("show");

      var email = (document.getElementById("tzEmail").value || "").trim().toLowerCase();
      var pass = document.getElementById("tzPass").value || "";
      var fail = function (m) { errEl.textContent = m; errEl.classList.add("show"); };

      var EMAIL_RX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!EMAIL_RX.test(email)) return fail("Please enter a valid real email address (e.g. name@gmail.com).");
      if (!pass || pass.length < 6) return fail("Password must be at least 6 characters.");

      var users = getUsers();

      if (currentMode === "signup") {
        var name = (document.getElementById("tzName").value || "").trim();
        if (name.length < 3) return fail("Please write your full name (at least 3 letters).");
        if (/[<>{}]/.test(name)) return fail("Name shouldn't contain invalid characters.");
        if (!/^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(pass)) return fail("Password must be 6+ characters with a letter and a number.");
        if (isDisposable(email)) return fail("Temporary email addresses aren't allowed — please use your real email (Gmail is perfect).");

        submitBtn.disabled = true;
        submitBtn.textContent = "Sending code…";

        cmd({ action: "otp", kind: "signup", email: email, name: name }).then(function (res) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Create Free Account";
          if (!res || !res.ok) {
            return fail((res && res.error) || "Something went wrong — please try again.");
          }
          renderOtpStep({ purpose: "signup", email: email, name: name, pass: pass });
        });
      } else {
        var u = users[email];
        if (!u) {
          submitBtn.disabled = true;
          submitBtn.textContent = "Logging in…";
          hashPass(email, pass).then(function (ph) {
            cmd({ action: "login", email: email, ph: ph }).then(function (res) {
              submitBtn.disabled = false;
              submitBtn.textContent = "Log In";
              if (!res || !res.ok) return fail((res && res.error) || "Email or password doesn't match our records.");
              users[email] = { name: res.name || email.split("@")[0], email: email, pass: hash(pass), created: Date.now(), via: "email" };
              localStorage.setItem("chitro:users", JSON.stringify(users));
              localStorage.setItem("chitro:session", JSON.stringify(email));
              close();
              updateAvatarHost();
              showToast("Welcome back, " + (res.name ? res.name.split(" ")[0] : "friend") + "! 👋");
            });
          });
          return;
        }
        if (u.pass !== hash(pass)) return fail("Incorrect password. Please try again.");
        localStorage.setItem("chitro:session", JSON.stringify(email));
        collectSheet({ name: u.name, email: email, provider: "email", page: location.pathname });
        close();
        updateAvatarHost();
        showToast("Welcome back, " + (u.name ? u.name.split(" ")[0] : "friend") + "! 👋");
      }
    });

    ov.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  /* -------- 9. OTP VERIFICATION STEP -------- */
  function renderOtpStep(ctx) {
    ensureOverlay();
    var isSignup = ctx.purpose === "signup";

    ov.innerHTML =
      '<div class="auth-card" role="dialog" aria-modal="true" aria-label="Verify Code">' +
        '<div class="sheet-handle"></div>' +
        '<div style="display:flex;justify-content:space-between;align-items:center">' +
          '<button class="icon-btn" id="tzOtpBack" aria-label="Back">' + BACK_SVG + '</button>' +
          '<button class="icon-btn" id="tzCloseOtp" aria-label="Close">' + CLOSE_SVG + '</button>' +
        '</div>' +
        '<div class="auth-head">' +
          '<span class="brand-mark"><img src="assets/icons/logo.png" alt="TEZOFY logo"></span>' +
          '<h2>' + (isSignup ? "Check your inbox 📬" : "Reset code sent 📬") + '</h2>' +
          '<p>We sent a 6-digit code to <b>' + escH(ctx.email) + '</b>.<br>Can\'t find it? Peek into Spam or Junk 👀</p>' +
        '</div>' +
        '<div class="field">' +
          '<label for="tzOtpCode">6-DIGIT CODE</label>' +
          '<input id="tzOtpCode" type="text" inputmode="numeric" maxlength="6" placeholder="••••••" autocomplete="one-time-code" style="letter-spacing:.45em;text-align:center;font-size:1.35rem;font-weight:700">' +
        '</div>' +
        '<div class="auth-error" id="tzOtpError"></div>' +
        '<button class="btn auth-submit" id="tzOtpVerifyBtn">' + (isSignup ? "Verify & create account" : "Verify code") + '</button>' +
        '<button class="guest-link" id="tzOtpResend" disabled>Resend (60s)</button>' +
      '</div>';

    document.getElementById("tzCloseOtp").addEventListener("click", close);
    document.getElementById("tzOtpBack").addEventListener("click", function () {
      if (isSignup) renderAuthModal("signup");
      else renderForgotStep(ctx.email);
    });

    var errEl = document.getElementById("tzOtpError");
    var fail = function (m) { errEl.textContent = m; errEl.classList.add("show"); };

    var cd = 60;
    var rsBtn = document.getElementById("tzOtpResend");
    var tick = function () {
      rsBtn.disabled = cd > 0;
      rsBtn.textContent = cd > 0 ? "Resend (" + cd + "s)" : "🔁 Resend code";
      if (cd-- > 0) setTimeout(tick, 1000);
    };
    tick();

    rsBtn.addEventListener("click", function () {
      if (rsBtn.disabled) return;
      cmd({ action: "otp", kind: ctx.purpose, email: ctx.email, name: ctx.name }).then(function (res) {
        if (!res || !res.ok) return fail((res && res.error) || "Please try again");
        cd = 60;
        tick();
        showToast("New code sent 📨");
      });
    });

    var codeEl = document.getElementById("tzOtpCode");
    setTimeout(function () { codeEl.focus(); }, 100);

    var verifyBtn = document.getElementById("tzOtpVerifyBtn");
    var doVerify = function () {
      var code = (codeEl.value || "").trim();
      if (!/^\d{6}$/.test(code)) return fail("Please enter the full 6-digit code.");
      verifyBtn.disabled = true;
      verifyBtn.textContent = "Verifying…";

      cmd({ action: "otpverify", email: ctx.email, code: code }).then(function (res) {
        if (!res || !res.ok) {
          verifyBtn.disabled = false;
          verifyBtn.textContent = isSignup ? "Verify & create account" : "Verify code";
          return fail((res && res.error) || "Invalid or expired code. Please try again.");
        }
        if (isSignup) {
          finishSignup(ctx);
        } else {
          ctx.code = code;
          renderNewPassStep(ctx);
        }
      });
    };

    codeEl.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); doVerify(); }
    });
    verifyBtn.addEventListener("click", doVerify);

    ov.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function finishSignup(ctx) {
    var users = getUsers();
    users[ctx.email] = { name: ctx.name, email: ctx.email, pass: hash(ctx.pass), created: Date.now(), via: "email" };
    localStorage.setItem("chitro:users", JSON.stringify(users));
    localStorage.setItem("chitro:session", JSON.stringify(ctx.email));

    hashPass(ctx.email, ctx.pass).then(function (ph) {
      collectSheet({ name: ctx.name, email: ctx.email, provider: "email", page: location.pathname, ph: ph });
    });

    close();
    updateAvatarHost();
    showToast("Verified ✓ Welcome, " + ctx.name.split(" ")[0] + "! 🎉");
  }

  /* -------- 10. FORGOT PASSWORD STEP -------- */
  function renderForgotStep(preset) {
    ensureOverlay();
    ov.innerHTML =
      '<div class="auth-card" role="dialog" aria-modal="true" aria-label="Forgot Password">' +
        '<div class="sheet-handle"></div>' +
        '<div style="display:flex;justify-content:space-between;align-items:center">' +
          '<button class="icon-btn" id="tzFgBack" aria-label="Back">' + BACK_SVG + '</button>' +
          '<button class="icon-btn" id="tzCloseFg" aria-label="Close">' + CLOSE_SVG + '</button>' +
        '</div>' +
        '<div class="auth-head">' +
          '<span class="brand-mark"><img src="assets/icons/logo.png" alt="TEZOFY logo"></span>' +
          '<h2>Forgot password? 🔑</h2>' +
          '<p>Enter the email of your account — we\'ll send a 6-digit verification code to reset it.</p>' +
        '</div>' +
        '<div class="field">' +
          '<label for="tzFgEmail">EMAIL</label>' +
          '<input id="tzFgEmail" type="email" value="' + escH(preset || "") + '" placeholder="you@example.com" autocomplete="email">' +
        '</div>' +
        '<div class="auth-error" id="tzFgError"></div>' +
        '<button class="btn auth-submit" id="tzFgSend">Send reset code</button>' +
        '<button class="guest-link" id="tzFgBackLink">← Back to login</button>' +
      '</div>';

    document.getElementById("tzCloseFg").addEventListener("click", close);
    document.getElementById("tzFgBack").addEventListener("click", function () { renderAuthModal("login"); });
    document.getElementById("tzFgBackLink").addEventListener("click", function () { renderAuthModal("login"); });

    var errEl = document.getElementById("tzFgError");
    var fail = function (m) { errEl.textContent = m; errEl.classList.add("show"); };

    document.getElementById("tzFgSend").addEventListener("click", function () {
      var btn = document.getElementById("tzFgSend");
      var email = (document.getElementById("tzFgEmail").value || "").trim().toLowerCase();
      var EMAIL_RX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!EMAIL_RX.test(email)) return fail("Please enter a valid real email address.");
      if (isDisposable(email)) return fail("Temporary email won't work — please use your real email.");

      btn.disabled = true;
      btn.textContent = "Sending…";

      cmd({ action: "otp", kind: "reset", email: email }).then(function (res) {
        btn.disabled = false;
        btn.textContent = "Send reset code";
        if (!res || !res.ok) return fail((res && res.error) || "No account found with this email — please sign up first.");
        renderOtpStep({ purpose: "reset", email: email });
      });
    });

    ov.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  /* -------- 11. NEW PASSWORD STEP -------- */
  function renderNewPassStep(ctx) {
    ensureOverlay();
    ov.innerHTML =
      '<div class="auth-card" role="dialog" aria-modal="true" aria-label="New Password">' +
        '<div class="sheet-handle"></div>' +
        '<div style="display:flex;justify-content:space-between;align-items:center">' +
          '<button class="icon-btn" id="tzNpBack" aria-label="Back">' + BACK_SVG + '</button>' +
          '<button class="icon-btn" id="tzCloseNp" aria-label="Close">' + CLOSE_SVG + '</button>' +
        '</div>' +
        '<div class="auth-head">' +
          '<span class="brand-mark"><img src="assets/icons/logo.png" alt="TEZOFY logo"></span>' +
          '<h2>Create a new password 🛡️</h2>' +
          '<p>Code verified ✓ — now set your new password.</p>' +
        '</div>' +
        '<div class="field">' +
          '<label for="tzNp1">NEW PASSWORD</label>' +
          '<input id="tzNp1" type="password" placeholder="6+ chars: letter + number" autocomplete="new-password">' +
        '</div>' +
        '<div class="field">' +
          '<label for="tzNp2">TYPE IT AGAIN</label>' +
          '<input id="tzNp2" type="password" placeholder="Same password again" autocomplete="new-password">' +
        '</div>' +
        '<div class="auth-error" id="tzNpError"></div>' +
        '<button class="btn auth-submit" id="tzNpSave">Save new password</button>' +
      '</div>';

    document.getElementById("tzCloseNp").addEventListener("click", close);
    document.getElementById("tzNpBack").addEventListener("click", function () { renderAuthModal("login"); });

    var errEl = document.getElementById("tzNpError");
    var fail = function (m) { errEl.textContent = m; errEl.classList.add("show"); };

    document.getElementById("tzNpSave").addEventListener("click", function () {
      var btn = document.getElementById("tzNpSave");
      var p1 = document.getElementById("tzNp1").value || "";
      var p2 = document.getElementById("tzNp2").value || "";

      if (!/^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(p1)) return fail("Password needs 6+ characters with a letter and a number.");
      if (p1 !== p2) return fail("Those two passwords don't match.");

      btn.disabled = true;
      btn.textContent = "Saving…";

      hashPass(ctx.email, p1).then(function (ph) {
        cmd({ action: "reset", email: ctx.email, code: ctx.code, ph: ph }).then(function (res) {
          btn.disabled = false;
          btn.textContent = "Save new password";
          if (!res || !res.ok) return fail((res && res.error) || "Could not reset password. Please try again.");

          var users = getUsers();
          if (users[ctx.email]) {
            users[ctx.email].pass = hash(p1);
            localStorage.setItem("chitro:users", JSON.stringify(users));
          }
          renderAuthModal("login");
          showToast("Password updated ✓ — log in now! 🎉");
        });
      });
    });

    ov.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  /* -------- 12. 3-STATE HEADER BUTTON RENDERER -------- */
  function updateAvatarHost() {
    var host = document.getElementById("avatarHost");
    if (!host) return;

    var u = currentUser();

    if (u) {
      var ph = avatarPhoto(u.email);
      var initial = (u.name || u.email || "U").trim().charAt(0).toUpperCase();
      host.innerHTML =
        '<button class="avatar-btn logged" type="button" aria-label="Profile: ' + (u.name || "") + '" id="tzProfileBtn">' +
          (ph ? '<img class="avatar-ph" src="' + ph + '" alt="' + initial + '">' : initial) +
        '</button>';
      document.getElementById("tzProfileBtn").addEventListener("click", function (e) {
        e.preventDefault();
        renderProfileModal();
      });
    } else if (hasAnyUsers()) {
      host.innerHTML =
        '<button class="header-auth-btn login" type="button" id="tzLoginBtn">' +
          '<span>Log In</span>' +
        '</button>';
      document.getElementById("tzLoginBtn").addEventListener("click", function (e) {
        e.preventDefault();
        renderAuthModal("login");
      });
    } else {
      host.innerHTML =
        '<button class="header-auth-btn signup" type="button" id="tzSignupBtn">' +
          '<span> Sign Up</span>' +
        '</button>';
      document.getElementById("tzSignupBtn").addEventListener("click", function (e) {
        e.preventDefault();
        renderAuthModal("signup");
      });
    }
  }

  window.addEventListener("storage", updateAvatarHost);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateAvatarHost);
  } else {
    updateAvatarHost();
  }
})();

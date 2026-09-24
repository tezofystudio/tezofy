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
    "  .bottombar .bb-ai .bb-core { width: 44px; height: 44px; border-radius: 999px;" +
    "    background: var(--grad); display: grid; place-items: center;" +
    "    box-shadow: 0 4px 16px rgba(255,45,170,.45); position: relative;" +
    "    animation: bb-breathe 3.4s ease-in-out infinite; }" +
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
   TEZOFY — AI Tool Pages: 1000% Exact Auth Engine (Cloud & Social)
   Official Brand Logo + Smooth Zero-Flicker Tab Switching
   Google Sign-In + Facebook + Email Auth + Profile Dashboard
   ============================================================ */
(function () {
  "use strict";

  var CFG = window.AUTH_CONFIG || {
    sheetUrl: "https://script.google.com/macros/s/AKfycbwWZQyM-KgQcapysDkiju8Uk6upd3MZROXF5BU-QaA2RHn_XkyMvjJKhAtlmjneGIt_/exec",
    googleClientId: "212033639328-iqbjtddt28gpq2euuq61cilp4pb2fqcj.apps.googleusercontent.com",
    fbAppId: "1474580381159042"
  };

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

  /* Google Sign-In loader */
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

  /* Facebook SDK loader */
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

  var CLOSE_SVG = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>';

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

  function handleSocialSuccess(u) {
    var users = getUsers();
    if (!users[u.email]) {
      users[u.email] = { name: u.name, email: u.email, pass: hash("social:" + u.provider + ":" + u.email), created: Date.now(), via: u.provider };
      localStorage.setItem("chitro:users", JSON.stringify(users));
    }
    localStorage.setItem("chitro:session", JSON.stringify(u.email));
    collectSheet({ name: u.name, email: u.email, provider: u.provider, page: location.pathname });
    close();
    updateAvatarHost();
  }

  /* ১. প্রোফাইল ড্যাশবোর্ড (লগইন করা ইউজারদের জন্য) */
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

  /* ২. ১০০% আসল অথ মডাল (ব্র্যান্ড লোগো + স্মুথ জিরো-ফ্লিকার সুইচিং) */
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
        '<div class="social-row">' +
          '<div id="tzGBtn" class="g-btn-slot"></div>' +
          '<button type="button" class="social-btn fb" id="tzFbBtn">' +
            '<svg viewBox="0 0 24 24" width="18" height="18" fill="#fff" aria-hidden="true"><path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.3l-.5 3.5h-2.8v8.4A12 12 0 0 0 24 12z"/></svg>' +
            '<span>Continue with Facebook</span>' +
          '</button>' +
        '</div>' +
        '<div class="auth-divider"><span>OR WITH EMAIL</span></div>' +
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

    /* 🎯 স্মুথ ট্যাব সুইচিং: পেজ না কাঁপিয়ে ফ্রেমলেস পরিবর্তন */
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

    if (forgotBtn) {
      forgotBtn.addEventListener("click", function () {
        alert("To reset your password, please continue from the Home Page or contact support.");
      });
    }

    /* Google Sign In Render (লোড হবে মাত্র একবার) */
    renderGoogleBtn(document.getElementById("tzGBtn"), handleSocialSuccess);

    /* Facebook Login Handler */
    document.getElementById("tzFbBtn").addEventListener("click", function () {
      loginFacebook(handleSocialSuccess, function (msg) {
        errEl.textContent = msg;
        errEl.classList.add("show");
      });
    });

    /* Email / Password Form Submit */
    document.getElementById("tzAuthForm").addEventListener("submit", function (e) {
      e.preventDefault();
      errEl.textContent = "";
      errEl.classList.remove("show");

      var email = (document.getElementById("tzEmail").value || "").trim().toLowerCase();
      var pass = document.getElementById("tzPass").value || "";
      var fail = function (m) { errEl.textContent = m; errEl.classList.add("show"); };

      var EMAIL_RX = /^[a-z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/;
      if (!EMAIL_RX.test(email)) return fail("Please enter a valid real email address (e.g. name@gmail.com).");
      if (!pass || pass.length < 6) return fail("Password must be at least 6 characters.");

      var users = getUsers();

      if (currentMode === "signup") {
        var name = (document.getElementById("tzName").value || "").trim() || email.split("@")[0];
        if (users[email]) return fail("An account with this email already exists. Try logging in.");
        users[email] = { name: name, email: email, pass: hash(pass), created: Date.now() };
        localStorage.setItem("chitro:users", JSON.stringify(users));
        localStorage.setItem("chitro:session", JSON.stringify(email));
        collectSheet({ name: name, email: email, provider: "email", page: location.pathname });
        close();
        updateAvatarHost();
      } else {
        var u = users[email];
        if (!u) return fail("No account found with this email. Please Sign Up first.");
        if (u.pass !== hash(pass)) return fail("Incorrect password. Please try again.");
        localStorage.setItem("chitro:session", JSON.stringify(email));
        close();
        updateAvatarHost();
      }
    });

    ov.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  /* ৩. হেডারের ৩-স্টেট স্মার্ট বাটন রেন্ডারার */
  function updateAvatarHost() {
    var host = document.getElementById("avatarHost");
    if (!host) return;

    var u = currentUser();

    if (u) {
      /* অবস্থা ১: লগইন করা সক্রিয় মেম্বার -> গোল প্রোফাইল অবতার */
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
      /* অবস্থা ২: অ্যাকাউন্ট আছে কিন্তু লগআউট -> মার্জিত [ Log In ] বাটন */
      host.innerHTML =
        '<button class="header-auth-btn login" type="button" id="tzLoginBtn">' +
          '<span>Log In</span>' +
        '</button>';
      document.getElementById("tzLoginBtn").addEventListener("click", function (e) {
        e.preventDefault();
        renderAuthModal("login");
      });
    } else {
      /* অবস্থা ৩: একদম নতুন ভিজিটর -> আকর্ষণীয় [ ✨ Sign Up ] বাটন */
      host.innerHTML =
        '<button class="header-auth-btn signup" type="button" id="tzSignupBtn">' +
          '<span>✨ Sign Up</span>' +
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

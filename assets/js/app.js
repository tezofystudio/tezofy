/* ============================================================
   TEZOFY — App engine (shared chrome + auth + page renderers)
   Vanilla JS, no dependencies. Data comes from data.js
   ============================================================ */
(function () {
  "use strict";

  /* ---------- tiny helpers ---------- */
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

  const store = {
    get(k, fallback) {
      try { const v = JSON.parse(localStorage.getItem("chitro:" + k)); return v ?? fallback; }
      catch (e) { return fallback; }
    },
    set(k, v) { try { localStorage.setItem("chitro:" + k, JSON.stringify(v)); } catch (e) {} }
  };

  const fmt = (n) => (n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, "") + "K" : String(n));
  const extraCopies = () => store.get("copies", {});
  const totalCopiesMade = () => Object.values(extraCopies()).reduce((a, b) => a + b, 0);
  const getUses = (p) => p.uses + (extraCopies()[p.id] || 0);
  const likeMap = () => store.get("likes", {});
  const likeCount = () => Object.values(likeMap()).filter(Boolean).length;
  const getLikes = (p) => p.likes + (likeMap()[p.id] ? 1 : 0);
  const savedList = () => store.get("saved", []);
  const isSaved = (id) => savedList().includes(id);
  const byId = (id) => PROMPTS.find((p) => p.id === id);
  const catName = (id) => (CATEGORIES.find((c) => c.id === id) || {}).name || id;
  const param = (k) => new URLSearchParams(location.search).get(k);

  /* ---------- rich-share URL (per-prompt OG page when available) ---------- */
  function shareUrlFor(p) {
    const base = location.origin + location.pathname.replace(/[^/]*$/, "");
    if (!p._remote && typeof OG_PAGES !== "undefined" && OG_PAGES.indexOf(p.id) !== -1)
      return base + "share/" + p.id + "/";
    if (p._remote && typeof AUTH_CONFIG !== "undefined" && AUTH_CONFIG.sheetUrl) {
      var hasPage = p.ogpage === 1 || p.ogpage === "1" || p.ogpage === true;
      if (hasPage)
        return base + "share/rp-" + encodeURIComponent(String(p.id).replace(/^rp-/, "")) + "/";
      return String(AUTH_CONFIG.sheetUrl) + "?action=share&id=" + encodeURIComponent(p.id);
    }
    return base + "template.html?id=" + encodeURIComponent(p.id);
  }

  /* ---------- og-friendly resolver: static share page first (Messenger loves static) ---------- */
  function resolveShareUrl(p) {
    return new Promise(function (res) {
      var fallback = shareUrlFor(p);
      if (!p._remote) return res(fallback);
      var raw = String(p.id).replace(/^rp-/, "");
      var base = location.origin + location.pathname.replace(/[^/]*$/, "");
      var u = base + "share/rp-" + encodeURIComponent(raw) + "/";
      if (p.ogpage === 1 || p.ogpage === "1" || p.ogpage === true) return res(u);
      var settled = false;
      var t = setTimeout(function () { if (!settled) { settled = true; res(fallback); } }, 1600);
      try {
        fetch(u, { method: "HEAD", cache: "no-store" }).then(function (r) {
          if (settled) return; settled = true; clearTimeout(t);
          res(r.ok ? u : fallback);
        }).catch(function () {
          if (settled) return; settled = true; clearTimeout(t);
          res(fallback);
        });
      } catch (e) { if (!settled) { settled = true; clearTimeout(t); res(fallback); } }
    });
  }

  /* ---------- icons ---------- */
  const I = {
    spark: '<img src="assets/icons/logo.png" alt="TEZOFY logo">',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5L12 3l9 7.5"/><path d="M5 9.5V21h5v-6h4v6h5V9.5"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/></svg>',
    bookmark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12a1 1 0 011 1v17l-7-4.5L5 21V4a1 1 0 011-1z"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.5C7 16.5 3 13.3 3 9.3 3 6.4 5.2 4.5 7.7 4.5c1.7 0 3.3.9 4.3 2.4 1-1.5 2.6-2.4 4.3-2.4 2.5 0 4.7 1.9 4.7 4.8 0 4-4 7.2-9 11.2z"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2.5"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.5 8.5 0 01-12.4 7.5L3 21l2-5.4A8.5 8.5 0 1121 11.5z"/><path d="M9 9.8c0 3.4 2.8 6.2 6.2 6.2l1.6-1.6-2-1.3-1 .7a4.6 4.6 0 01-1.8-1.8l.7-1-1.3-2z" fill="currentColor" stroke="none"/></svg>',
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M11 18l-6-6 6-6"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>',
    zap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L4.5 13.5H11l-1 8.5L18.5 10H12z"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c.9-3.8 4-6 8-6s7.1 2.2 8 6"/></svg>',
    logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H6a2 2 0 01-2-2V5a2 2 0 012-2h3"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M4 21h16"/></svg>',
    dice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r="1.4" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.4" fill="currentColor"/><circle cx="15.5" cy="8.5" r="1.4" fill="currentColor"/><circle cx="8.5" cy="15.5" r="1.4" fill="currentColor"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>'
  };

  /* ---------- toast ---------- */
  let toastTimer;
  function toast(msg) {
    let t = $(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
    t.innerHTML = I.check + "<span>" + esc(msg) + "</span>";
    requestAnimationFrame(() => t.classList.add("show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 1900);
  }

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
    { rootMargin: "0px 0px -40px 0px" }
  );
  function watchReveals(root = document) { $$(".reveal", root).forEach((el) => io.observe(el)); }

  /* ============================================================
     AUTH (device-local accounts — swap with Supabase/Firebase later)
     ============================================================ */
  const users = () => store.get("users", {});
  const session = () => store.get("session", null);
  const currentUser = () => { const s = session(); return s ? users()[s] : null; };
  function hash(s) { // light obfuscation for a demo-grade local account
    let h = 0; for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; }
    return "h" + Math.abs(h).toString(36) + s.length;
  }
  function signup(name, email, pass) {
    const u = users();
    if (u[email]) return { err: "An account with this email already exists. Try logging in." };
    u[email] = { name, email, pass: hash(pass), created: Date.now() };
    store.set("users", u); store.set("session", email);
    return { ok: true };
  }
  function login(email, pass) {
    const u = users()[email];
    if (!u || u.pass !== hash(pass)) return { err: "Email or password doesn't match our records." };
    store.set("session", email);
    return { ok: true };
  }
  function logout() { store.set("session", null); }

  const DAY = 86400000;
  const todayStr = () => new Date().toISOString().slice(0, 10);
  function recordVisit() {
    const v = store.get("visits", []);
    const t = todayStr();
    if (v[v.length - 1] !== t) { v.push(t); store.set("visits", v.slice(-60)); }
  }
  function streak() {
    const v = store.get("visits", []);
    if (!v.length) return 0;
    let n = 0, d = new Date();
    if (v[v.length - 1] !== todayStr()) d = new Date(d.getTime() - DAY);
    for (;;) {
      const s = d.toISOString().slice(0, 10);
      if (v.includes(s)) { n++; d = new Date(d.getTime() - DAY); } else break;
    }
    return n;
  }

   function avatarPhoto() { const s = session(); return s ? store.get("avatar:" + s, "") : ""; }
  function avatarHTML() {
    const u = currentUser();
    if (!u) {
      const hasAccounts = Object.keys(users()).length > 0;
      return hasAccounts
        ? `<button class="header-auth-btn login" data-open-auth="login" aria-label="Log in"><span>Log In</span></button>`
        : `<button class="header-auth-btn signup" data-open-auth="signup" aria-label="Sign up"><span>✨ Sign Up</span></button>`;
    }
    const ph = avatarPhoto();
    return `<button class="avatar-btn logged" data-open-auth="profile" aria-label="Profile">${ph ? `<img class="avatar-ph" src="${ph}" alt="">` : esc(u.name.trim()[0].toUpperCase())}</button>`;
  }



  /* ---------- profile pride: level tiers + random ring themes ---------- */
  var LEVEL_TIERS = [
    { name: "Rookie",      icon: "\u{1F331}", min: 0,   c: "#9ca3af" },
    { name: "Explorer",    icon: "\u26A1",    min: 15,  c: "#5eead4" },
    { name: "Creator",     icon: "\u{1F3A8}", min: 45,  c: "#fbbf24" },
    { name: "Trendsetter", icon: "\u{1F525}", min: 100, c: "#fb7185" },
    { name: "Pro",         icon: "\u{1F48E}", min: 200, c: "#7dd3fc" },
    { name: "Legend",      icon: "\u{1F451}", min: 400, c: "#ff2daa" }
  ];
  function levelInfo() {
    var score = savedList().length * 2 + likeCount() * 2 + totalCopiesMade() * 3 + streak() * 5;
    var tier = LEVEL_TIERS[0], next = null;
    for (var i = 0; i < LEVEL_TIERS.length; i++) {
      if (score >= LEVEL_TIERS[i].min) tier = LEVEL_TIERS[i];
      else { next = LEVEL_TIERS[i]; break; }
    }
    var pct = next ? Math.min(100, Math.round(((score - tier.min) / (next.min - tier.min)) * 100)) : 100;
    return { tier: tier, next: next, score: score, pct: pct, toGo: next ? next.min - score : 0 };
  }
  var RING_THEMES = [
    { grad: "conic-gradient(from 0deg,#ff2daa,#ff7a00,#ffd36e,#ff2daa)", dur: "3.2s", dir: "normal" },
    { grad: "conic-gradient(from 0deg,#22d3ee,#6366f1,#a855f7,#22d3ee)", dur: "2.8s", dir: "reverse" },
    { grad: "conic-gradient(from 0deg,#34d399 0 42%,transparent 42% 50%,#3b82f6 50% 92%,transparent 92% 100%)", dur: "1.9s", dir: "normal" },
    { grad: "conic-gradient(from 0deg,transparent 0 60%,#f472b6 78%,#fde68a 90%,#ffffff 94%,transparent 95%)", dur: "1.6s", dir: "normal" },
    { grad: "conic-gradient(from 0deg,#fde047,#22c55e,#14b8a6,#fde047)", dur: "4.4s", dir: "reverse" },
    { grad: "conic-gradient(from 0deg,#f43f5e 0 24%,transparent 24% 34%,#fb923c 34% 58%,transparent 58% 68%,#e879f9 68% 92%,transparent 92% 100%)", dur: "2.4s", dir: "reverse" }
  ];
  function camIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3.2l1.8-2.7h6l1.8 2.7H20v11H4z"/><circle cx="12" cy="13" r="3.4"/></svg>';
  }

  function buildAuthChrome() {
    const ov = document.createElement("div");
    ov.className = "auth-overlay";
    ov.id = "authOverlay";
    document.body.appendChild(ov);

    function open() { renderAuth(); ov.classList.add("open"); document.body.style.overflow = "hidden"; }
    function close() { ov.classList.remove("open"); document.body.style.overflow = ""; }

    window.__chitroOpenAuth = open;

    function socialHTML() {
      if (!window.CloudAuth || !CloudAuth.socialEnabled()) return "";
      var buttons = "";
      if (CloudAuth.googleConfigured()) buttons += '<div id="gBtn" class="g-btn-slot"></div>';
      if (CloudAuth.fbReady()) buttons += '<button type="button" class="social-btn fb" id="fbBtn"><svg viewBox="0 0 24 24" width="18" height="18" fill="#fff" aria-hidden="true"><path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.3l-.5 3.5h-2.8v8.4A12 12 0 0 0 24 12z"/></svg><span>Continue with Facebook</span></button>';
      return '<div class="social-row">' + buttons + '</div><div class="auth-divider"><span>or with email</span></div>';
    }

    function unlockRefresh() { setTimeout(() => { if ($(".lock-overlay") && window.__chitroRerender) window.__chitroRerender(); }, 300); }

    function socialSuccess(u) {
      /* ⛔ টেম্প-মেইল ব্লক (সোশ্যাল পথেও) */
      if (window.CloudAuth && CloudAuth.isDisposable(u.email)) {
        toast("Temporary email addresses aren't allowed — please sign in with your real Gmail 🚫");
        return;
      }
      /* 🚪 ব্যান-গেট: সার্ভারে ব্যানড হলে এখানেই থামবে (নেট না থাকলে রেজিস্টার-সার্ভার ব্লকই শেষ সীমা) */
      if (window.CloudAuth && CloudAuth.check) {
        CloudAuth.check(u.email).then(function (res) {
          if (res && res.banned) { toast("⛔ This account is banned — please contact support"); return; }
          doSocialSuccess(u);
        });
        return;
      }
      doSocialSuccess(u);
    }

    function doSocialSuccess(u) {
      var list = users();
      if (!list[u.email]) list[u.email] = { name: u.name, email: u.email, pass: hash("social:" + u.provider + ":" + u.email), created: Date.now(), via: u.provider };
      store.set("users", list);
      store.set("session", u.email);
      CloudAuth.collect({ name: u.name, email: u.email, provider: u.provider, page: location.pathname });
      close();
      refreshAvatar();
      unlockRefresh();
      toast("Welcome, " + u.name.split(" ")[0] + "! 🎉");
    }

    function renderAuth(mode = "login") {
      ov.innerHTML = `
        <div class="auth-card" role="dialog" aria-modal="true" aria-label="Account">
          <div class="sheet-handle"></div>
          <div style="display:flex;justify-content:flex-end"><button class="icon-btn" data-close-auth aria-label="Close">${I.close}</button></div>
          <div class="auth-head">
            <span class="brand-mark">${I.spark}</span>
            <h2>Welcome to ${SITE.name}</h2>
            <span class="brand-eyebrow">✦ Premium AI Prompt Studio</span>
            <p>Save prompts, unlock members-only designs & keep your streak — free forever.</p>
          </div>
          ${socialHTML()}
          <div class="auth-tabs">
            <button class="${mode === "login" ? "active" : ""}" data-tab="login">Log In</button>
            <button class="${mode === "signup" ? "active" : ""}" data-tab="signup">Sign Up</button>
          </div>
          <form id="authForm" novalidate>
            ${mode === "signup" ? `<div class="field"><label for="aName">Your Name</label><input id="aName" type="text" placeholder="e.g. Rahim Ahmed" autocomplete="name"></div>` : ""}
            <div class="field"><label for="aEmail">Email</label><input id="aEmail" type="email" placeholder="you@example.com" autocomplete="email"></div>
            <div class="field"><label for="aPass">Password</label><input id="aPass" type="password" placeholder="${mode === "signup" ? "6+ chars: letter + number" : "Your password"}" autocomplete="${mode === "signup" ? "new-password" : "current-password"}"></div>
            <div class="auth-error" id="authError"></div>
            <button class="btn auth-submit" type="submit">${mode === "signup" ? "Create Free Account" : "Log In"}</button>
          </form>
          ${mode === "login" ? '<button type="button" class="guest-link" id="forgotLink">🔑 Forgot password? →</button>' : ""}
          <button class="guest-link" data-close-auth>Continue as guest for now →</button>
          <p class="auth-note">🔒 Free forever. Every email is verified with a one-time code —<br>we only keep an encrypted password hash, never your actual password.</p>
        </div>`;

      $$("[data-tab]", ov).forEach((b) => b.addEventListener("click", () => renderAuth(b.dataset.tab)));
      $$("[data-close-auth]", ov).forEach((b) => b.addEventListener("click", close));
      var fg = $("#forgotLink", ov);
      if (fg) fg.addEventListener("click", () => renderForgotStep(($("#aEmail", ov).value || "").trim().toLowerCase()));
      ov.addEventListener("click", (e) => { if (e.target === ov) close(); });

      $("#authForm", ov).addEventListener("submit", (e) => {
        e.preventDefault();
        const email = ($("#aEmail", ov).value || "").trim().toLowerCase();
        const pass = $("#aPass", ov).value || "";
        const errEl = $("#authError", ov);
        const fail = (m) => { errEl.textContent = m; errEl.classList.add("show"); };
        const EMAIL_RX = /^[a-z0-9.!#$%&'*+\/?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/;
        if (!EMAIL_RX.test(email) || email.length > 100) return fail("Please enter a valid real email address (e.g. name@gmail.com).");
        if (!pass) return fail("Please enter your password.");

        /* 🔑 সাইনআপ — OTP ভেরিফিকেশন ছাড়া সম্পন্নই হবে না */
        if (mode === "signup") {
          const name = ($("#aName", ov).value || "").trim();
          if (name.length < 3) return fail("Please write your full name (at least 3 letters).");
          if (/[\d<>{}]/.test(name)) return fail("Name shouldn't contain numbers or symbols.");
          if (!/^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(pass)) return fail("Password must be 6+ characters with a letter and a number.");
          if (window.CloudAuth && CloudAuth.isDisposable(email)) return fail("Temporary email addresses aren't allowed — please use your real email (Gmail is perfect).");
          const begin = () => {
            errEl.classList.remove("show");
            CloudAuth.cmd({ action: "otp", kind: "signup", email: email, name: name }).then((res) => {
              if (!res || !res.ok) return fail((res && res.error) || "Something went wrong — please try again.");
              renderOtpStep({ purpose: "signup", email: email, name: name, pass: pass });
            });
          };
          if (window.CloudAuth && CloudAuth.check) {
            return CloudAuth.check(email).then((res) => {
              if (res && res.banned) return fail("⛔ এই অ্যাকাউন্ট ব্যানড — সহায়তার জন্য যোগাযোগ করুন।");
              begin();
            });
          }
          return begin();
        }

        /* 🔓 লগইন — ডিভাইস হিসাব না মিললে সার্ভার হিসাব মেলাই */
        const localTry = login(email, pass);
        const afterOk = (nm) => {
          const u = currentUser();
          if (window.CloudAuth) CloudAuth.collect({ name: (u && u.name) || nm || email, email, provider: "email", page: location.pathname });
          close(); refreshAvatar(); unlockRefresh(); toast("Welcome back, " + ((((u && u.name) || nm || "").split(" ")[0]) || "friend") + "! 👋");
        };
        const doLogin = () => {
          if (localTry.ok) return afterOk();
          if (!(window.CloudAuth && CloudAuth.cmd && CloudAuth.hashPass)) return fail(localTry.err || "Email or password doesn't match our records.");
          CloudAuth.hashPass(email, pass).then((ph) =>
            CloudAuth.cmd({ action: "login", email: email, ph: ph }).then((res) => {
              if (!res || !res.ok) return fail((res && res.error) || "Email or password doesn't match our records.");
              const list = users();
              list[email] = { name: res.name || email.split("@")[0], email: email, pass: hash(pass), created: Date.now(), via: "email" };
              store.set("users", list); store.set("session", email);
              afterOk(res.name);
            })
          );
        };
        if (window.CloudAuth && CloudAuth.check) {
          return CloudAuth.check(email).then((res) => {
            if (res && res.banned) return fail("⛔ This account is banned — please contact support.");
            doLogin();
          });
        }
        return doLogin();
      });

      if (window.CloudAuth && CloudAuth.socialEnabled()) {
        CloudAuth.googleRender($("#gBtn", ov), socialSuccess);
        var fbBtn = $("#fbBtn", ov);
        if (fbBtn) fbBtn.addEventListener("click", function () {
          var errEl = $("#authError", ov);
          CloudAuth.fbLogin(socialSuccess, function (m) { errEl.textContent = m; errEl.classList.add("show"); });
        });
      }
    }

    /* ---------- 🔢 v2.9 GATEKEEPER: OTP স্টেপ / ফরগেট / নতুন পাসওয়ার্ড ---------- */
    function escH(sx) { return String(sx == null ? "" : sx).replace(/[&<>"]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m])); }

    function otpCard(title, sub, inner) {
      return `
        <div class="auth-card" role="dialog" aria-modal="true">
          <div class="sheet-handle"></div>
          <div style="display:flex;justify-content:space-between;align-items:center">
            <button class="icon-btn" id="otpBack" aria-label="Back">←</button>
            <button class="icon-btn" data-close-auth aria-label="Close">${I.close}</button>
          </div>
          <div class="auth-head">
            <h2>${title}</h2>
            <p>${sub}</p>
          </div>
          ${inner}
        </div>`;
    }

      function renderOtpStep(ctx) {
      const isSignup = ctx.purpose === "signup";
      ov.innerHTML = otpCard(
        isSignup ? "Check your inbox 📬" : "Reset code sent 📬",
        "We sent a 6-digit code to <b>" + escH(ctx.email) + "</b>.<br>Can't find it? Peek into Spam or Junk 👀",
        `<div class="field"><label for="otpCode">6-digit code</label><input id="otpCode" type="text" inputmode="numeric" maxlength="6" placeholder="••••••" autocomplete="one-time-code" style="letter-spacing:.5em;text-align:center;font-size:1.3rem"></div>
         <div class="auth-error" id="otpError"></div>
         <button class="btn auth-submit" id="otpVerifyBtn">${isSignup ? "Verify & create account" : "Verify code"}</button>
         <button class="guest-link" id="otpResend" disabled>Resend (60s)</button>`
      );
      $$("[data-close-auth]", ov).forEach((b) => b.addEventListener("click", close));
      $("#otpBack", ov).addEventListener("click", () => { if (isSignup) renderAuth("signup"); else renderForgotStep(ctx.email); });
      const errEl = $("#otpError", ov);
      const fail = (m) => { errEl.textContent = m; errEl.classList.add("show"); };
      let cd = 60;
      const rsBtn = $("#otpResend", ov);
      const tick = () => {
        rsBtn.disabled = cd > 0;
        rsBtn.textContent = cd > 0 ? "Resend (" + cd + "s)" : "🔁 Resend code";
        if (cd-- > 0) setTimeout(tick, 1000);
      };
      tick();
      rsBtn.addEventListener("click", () => {
        if (rsBtn.disabled) return;
        CloudAuth.cmd({ action: "otp", kind: ctx.purpose, email: ctx.email, name: ctx.name }).then((res) => {
          if (!res || !res.ok) return fail((res && res.error) || "Please try again");
          cd = 60; tick(); toast("New code sent 📨");
        });
      });
      const codeEl = $("#otpCode", ov);
      setTimeout(() => codeEl.focus(), 60);
      codeEl.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); $("#otpVerifyBtn", ov).click(); } });
      $("#otpVerifyBtn", ov).addEventListener("click", (e) => {
        const btn = e.currentTarget;
        const code = (codeEl.value || "").trim();
        if (!/^\d{6}$/.test(code)) return fail("Please enter the full 6-digit code.");
        btn.disabled = true; btn.textContent = "Verifying…";
        CloudAuth.cmd({ action: "otpverify", email: ctx.email, code: code }).then((res) => {
          if (!res || !res.ok) {
            btn.disabled = false;
            btn.textContent = isSignup ? "Verify & create account" : "Verify code";
            return fail((res && res.error) || "Please try again");
          }
          if (isSignup) finishSignup(ctx);
          else { ctx.code = code; renderNewPassStep(ctx); }
        });
      });
    }

    function finishSignup(ctx) {
      const r = signup(ctx.name, ctx.email, ctx.pass);
      if (r.err) {
        const l = login(ctx.email, ctx.pass);
        if (l.err) {
          renderAuth("login");
          setTimeout(() => toast("This device already has your account — logging you in 🙂"), 50);
          return;
        }
      }
      CloudAuth.hashPass(ctx.email, ctx.pass).then((ph) => {
        CloudAuth.collect({ name: ctx.name, email: ctx.email, provider: "email", page: location.pathname, ph: ph });
        close(); refreshAvatar(); unlockRefresh();
        toast("Verified ✓ Welcome, " + ctx.name.split(" ")[0] + "! 🎉");
      });
    }

    function renderForgotStep(preset) {
      ov.innerHTML = otpCard(
        "Forgot password? 🔑",
        "Enter the email of your account — we'll send a verification code to reset it.",
        `<div class="field"><label for="fgEmail">Email</label><input id="fgEmail" type="email" value="${escH(preset || "")}" placeholder="you@example.com" autocomplete="email"></div>
         <div class="auth-error" id="fgError"></div>
         <button class="btn auth-submit" id="fgSend">Send reset code</button>
         <button class="guest-link" id="fgBack">← Back to login</button>`
      );
      $$("[data-close-auth]", ov).forEach((b) => b.addEventListener("click", close));
      $("#fgBack", ov).addEventListener("click", () => renderAuth("login"));
      const errEl = $("#fgError", ov);
      const fail = (m) => { errEl.textContent = m; errEl.classList.add("show"); };
      $("#fgSend", ov).addEventListener("click", (e) => {
        const btn = e.currentTarget;
        const email = ($("#fgEmail", ov).value || "").trim().toLowerCase();
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return fail("Please enter a valid email address.");
        if (window.CloudAuth && CloudAuth.isDisposable(email)) return fail("Temporary email won't work — please use your real email.");
        btn.disabled = true; btn.textContent = "Sending…";
        CloudAuth.cmd({ action: "otp", kind: "reset", email: email }).then((res) => {
          btn.disabled = false; btn.textContent = "Send reset code";
          if (!res || !res.ok) return fail((res && res.error) || "Please try again");
          renderOtpStep({ purpose: "reset", email: email });
        });
      });
    }

      function renderNewPassStep(ctx) {
      ov.innerHTML = otpCard(
        "Create a new password 🛡️",
        "Code verified ✓ — now set your new password.",
        `<div class="field"><label for="np1">New password</label><input id="np1" type="password" placeholder="6+ chars: letter + number" autocomplete="new-password"></div>
         <div class="field"><label for="np2">Type it again</label><input id="np2" type="password" placeholder="Same password again" autocomplete="new-password"></div>
         <div class="auth-error" id="npError"></div>
         <button class="btn auth-submit" id="npSave">Save new password</button>`
      );
      $$("[data-close-auth]", ov).forEach((b) => b.addEventListener("click", close));
      $("#otpBack", ov).addEventListener("click", () => renderAuth("login"));
      const errEl = $("#npError", ov);
      const fail = (m) => { errEl.textContent = m; errEl.classList.add("show"); };
      $("#npSave", ov).addEventListener("click", (e) => {
        const btn = e.currentTarget;
        const p1 = $("#np1", ov).value || "", p2 = $("#np2", ov).value || "";
        if (!/^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(p1)) return fail("Password needs 6+ characters with a letter and a number.");
        if (p1 !== p2) return fail("Those two passwords don't match.");
        btn.disabled = true; btn.textContent = "Saving…";
        CloudAuth.hashPass(ctx.email, p1).then((ph) =>
          CloudAuth.cmd({ action: "reset", email: ctx.email, code: ctx.code, ph: ph }).then((res) => {
            btn.disabled = false; btn.textContent = "Save new password";
            if (!res || !res.ok) return fail((res && res.error) || "Please try again");
            const list = users();
            if (list[ctx.email]) { list[ctx.email].pass = hash(p1); store.set("users", list); }
            renderAuth("login");
            setTimeout(() => toast("Password updated ✓ — log in now! 🎉"), 60);
          })
        );
      });
    }

    function renderProfile() {
      const u = currentUser();
      const memberSince = new Date(u.created).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
      const st = streak();
      const ph = avatarPhoto();
      const cover = store.get("cover:" + u.email, "");
      const lv = levelInfo();
      const R = RING_THEMES[(Math.random() * RING_THEMES.length) | 0] || RING_THEMES[0];
      ov.innerHTML = `
        <div class="auth-card" role="dialog" aria-modal="true" aria-label="Profile">
          <div class="sheet-handle"></div>
          <div style="display:flex;justify-content:flex-end"><button class="icon-btn" data-close-auth aria-label="Close">${I.close}</button></div>
          <div class="profile-hero${cover ? " has-cover" : ""}">
            ${cover ? `<img class="cover-img" src="${cover}" alt=""><span class="cover-veil"></span>` : ""}
            <button class="cover-edit" id="coverTap" aria-label="${cover ? "Change" : "Add"} cover photo">${camIcon()}<span>${cover ? "Edit cover" : "Add cover"}</span></button>
            <span class="pf-ring" style="--ring-grad:${R.grad}; --ring-dur:${R.dur}; --ring-dir:${R.dir}">
              <button type="button" class="profile-avatar big" id="avatarTap" aria-label="Change profile photo">${ph ? `<img class="av-fill" aria-hidden="true" src="${ph}" alt=""><img class="av-main" src="${ph}" alt="">` : esc(u.name.trim()[0].toUpperCase())}</button>
              <span class="av-edit" aria-hidden="true">${camIcon()}</span>
            </span>
            <div class="ph-info">
              <h2>${esc(u.name)}</h2>
              <p>${esc(u.email)} · since ${memberSince}</p>
              <div class="pill-row">
                <span class="streak-pill">🔥 ${st} day${st === 1 ? "" : "s"} streak</span>
                <span class="tier-pill" style="--tc:${lv.tier.c}">${lv.tier.icon} ${lv.tier.name}</span>
              </div>
              <div class="lvl-wrap">
                <div class="lvl-bar"><i style="width:${lv.pct}%"></i></div>
                <span class="lvl-txt">${lv.next ? `${lv.toGo} pts to ${lv.next.icon} ${lv.next.name}` : "🏆 Max level reached"} · ${lv.score} pts</span>
              </div>
            </div>
          </div>
          <div class="p-stats">
            <div class="p-stat"><b>${savedList().length}</b><span>Saved</span></div>
            <div class="p-stat"><b>${likeCount()}</b><span>Likes</span></div>
            <div class="p-stat"><b>${totalCopiesMade()}</b><span>Copies</span></div>
          </div>
          <div class="p-actions">
            <a class="p-action" href="saved.html">${I.bookmark} My saved prompts <span class="right">${I.right}</span></a>
            <button class="p-action" id="photoBtn">${camIcon()} ${ph ? "Change profile photo" : "Add profile photo"} <span class="right">${I.right}</span></button>
            ${ph ? `<button class="p-action" id="photoRemove">🗑️ Remove photo <span class="right">${I.right}</span></button>` : ""}
            <button class="p-action" id="coverRow">🖼️ ${cover ? "Change cover photo" : "Add cover photo"} <span class="right">${I.right}</span></button>
            ${cover ? `<button class="p-action" id="coverRemove">🗑️ Remove cover <span class="right">${I.right}</span></button>` : ""}
            <button class="p-action" id="nameBtn">✏️ Edit display name <span class="right">${I.right}</span></button>
            <input type="file" id="photoInput" accept="image/*" hidden>
            <input type="file" id="coverInput" accept="image/*" hidden>
            <button class="p-action install" id="installAction" style="display:none">${I.download} Install app on this device <span class="right">${I.right}</span></button>
            <button class="p-action danger" id="logoutBtn">${I.logout} Log out</button>
          </div>
          <p class="auth-note">Everything stays free — new prompts drop every day. ✨</p>
        </div>`;
      $$("[data-close-auth]", ov).forEach((b) => b.addEventListener("click", close));
      var fg = $("#forgotLink", ov);
      if (fg) fg.addEventListener("click", () => renderForgotStep(($("#aEmail", ov).value || "").trim().toLowerCase()));
      ov.addEventListener("click", (e) => { if (e.target === ov) close(); });
      $("#logoutBtn", ov).addEventListener("click", () => {
        logout(); close(); refreshAvatar(); toast("Logged out. See you soon!");
      });
      const photoInput = $("#photoInput", ov), coverInput = $("#coverInput", ov);
      const pick = (key, doneMsg) => (e) => {
        const f = e.target.files[0]; if (!f) return;
        if (f.size > 2500000) { toast("Photo too large — pick one under 2.5MB"); return; }
        const rd = new FileReader();
        rd.onload = () => { store.set(key + u.email, rd.result); renderProfile(); refreshAvatar(); toast(doneMsg); };
        rd.readAsDataURL(f);
      };
      $("#photoBtn", ov).addEventListener("click", () => photoInput.click());
      $("#avatarTap", ov).addEventListener("click", () => photoInput.click());
      photoInput.addEventListener("change", pick("avatar:", "Profile photo updated! 📸"));
      $("#coverTap", ov).addEventListener("click", () => coverInput.click());
      $("#coverRow", ov).addEventListener("click", () => coverInput.click());
      coverInput.addEventListener("change", pick("cover:", "Cover photo updated! 🖼️"));
      const pr = $("#photoRemove", ov);
      if (pr) pr.addEventListener("click", () => { store.set("avatar:" + u.email, ""); renderProfile(); refreshAvatar(); toast("Profile photo removed"); });
      const cr = $("#coverRemove", ov);
      if (cr) cr.addEventListener("click", () => { store.set("cover:" + u.email, ""); renderProfile(); toast("Cover photo removed"); });
      $("#nameBtn", ov).addEventListener("click", () => {
        const nn = prompt("Your display name:", u.name);
        if (nn && nn.trim().length >= 2) { const list = users(); list[u.email].name = nn.trim(); store.set("users", list); renderProfile(); refreshAvatar(); toast("Name updated! ✏️"); }
      });
      const ia = $("#installAction", ov);
      if (window.__chitroInstall) {
        ia.style.display = "";
        ia.addEventListener("click", async () => { const f = window.__chitroInstall; window.__chitroInstall = null; f.prompt(); await f.userChoice; close(); });
      }
    }
        document.addEventListener("click", (e) => {
      const b = e.target.closest("[data-open-auth]");
      if (b) {
        e.preventDefault();
        const mode = b.getAttribute("data-open-auth") || "signup";
        currentUser() ? (renderProfile(), ov.classList.add("open"), document.body.style.overflow = "hidden") : (renderAuth(mode === "login" ? "login" : "signup"), ov.classList.add("open"), document.body.style.overflow = "hidden");
      }
    });
  }


  function refreshAvatar() {
    const host = $("#avatarHost");
    if (host) host.innerHTML = avatarHTML();
  }

  /* ---------- shared chrome ---------- */
  function buildChrome(page) {
    const header = document.createElement("header");
    header.className = "site-header";
    header.innerHTML = `
      <div class="wrap">
        <a class="brand" href="index.html" aria-label="${SITE.name} home">
          <span class="brand-mark">${I.spark}</span>
          <span>${SITE.name}<small>${SITE.tagline}</small></span>
        </a>
        <div class="header-actions">
          <button class="header-search-pill" data-open-search aria-label="Search prompts">
            ${I.search}<span>Search prompts…</span><kbd>⌘K</kbd>
          </button>
          <button class="icon-btn" data-open-search aria-label="Search">${I.search}</button>
          <button class="icon-btn theme-btn" id="themeBtn" aria-label="Toggle dark / light mode"></button>
          <span id="avatarHost">${avatarHTML()}</span>
        </div>
      </div>`;
    document.body.prepend(header);
    const __tb = $("#themeBtn", header);
    if (__tb) { __tb.innerHTML = themeIcon(document.documentElement.dataset.theme); __tb.addEventListener("click", toggleTheme); }

    const bar = document.createElement("nav");
    bar.className = "bottombar";
    bar.setAttribute("aria-label", "Primary");
    bar.innerHTML = `
      <a href="index.html" class="${page === "home" ? "active" : ""}">${I.home}<span>Home</span></a>
      <a href="discover.html" class="${page === "discover" || page === "category" ? "active" : ""}">${I.grid}<span>Discover</span></a>
      <a href="ai-hub.html" class="bb-ai" aria-label="AI Studio">${I.spark}<span>AI</span></a>
      <button data-open-search aria-label="Search">${I.search}<span>Search</span></button>
      <a href="saved.html" class="${page === "saved" ? "active" : ""}">${I.bookmark}<span>Saved</span></a>`;
    document.body.appendChild(bar);

    /* search overlay */
    const ov = document.createElement("div");
    ov.className = "overlay";
    ov.id = "searchOverlay";
    ov.innerHTML = `
      <div class="overlay-top">
        <div class="overlay-input">${I.search}<input id="searchInput" type="search" placeholder="Search prompts…" autocomplete="off" enterkeyhint="search"></div>
        <button class="overlay-close" data-close-search aria-label="Close search">${I.close}</button>
      </div>
      <div class="overlay-body" id="searchResults"></div>`;
    document.body.appendChild(ov);

    const input = $("#searchInput", ov);
    const results = $("#searchResults", ov);

    function openSearch() { ov.classList.add("open"); document.body.style.overflow = "hidden"; renderResults(""); setTimeout(() => input.focus(), 60); }
    function closeSearch() { ov.classList.remove("open"); document.body.style.overflow = ""; input.value = ""; }
    function renderResults(q) {
      q = q.trim().toLowerCase();
      let list = PROMPTS;
      if (q) {
        list = PROMPTS.filter((p) =>
          p.title.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.cats.some((c) => catName(c).toLowerCase().includes(q))
        );
      } else {
        list = [...PROMPTS].sort((a, b) => getUses(b) - getUses(a)).slice(0, 6);
      }
      results.innerHTML =
        `<div class="overlay-hint">${q ? list.length + " result" + (list.length === 1 ? "" : "s") : "Trending now"}</div>` +
        (list.length
          ? list.map((p) => `
            <a class="result-row" href="template.html?id=${p.id}">
              <img src="${p.img}" alt="${esc(p.title)}" loading="lazy">
              <div><h4>${esc(p.title)}</h4><p>${fmt(getUses(p))} uses · ${esc(catName(p.cats[0]))}</p></div>
              <span class="go">${I.right}</span>
            </a>`).join("")
          : `<div class="no-result">No prompts found for “${esc(q)}”.<br>Try “couple”, “festival”, “retro”…</div>`);
    }
    input.addEventListener("input", () => renderResults(input.value));
    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-open-search]")) { e.preventDefault(); openSearch(); }
      if (e.target.closest("[data-close-search]")) closeSearch();
    });
    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openSearch(); }
      if (e.key === "Escape" && ov.classList.contains("open")) closeSearch();
    });

    buildAuthChrome();

    /* cookie banner */
    if (!store.get("cookie", false)) {
      const c = document.createElement("div");
      c.className = "cookie";
      c.innerHTML = `<p>We use cookies and analytics to improve your experience. By continuing you agree to our policy.</p><button class="btn">Accept</button>`;
      document.body.appendChild(c);
      requestAnimationFrame(() => c.classList.add("show"));
      $(".btn", c).addEventListener("click", () => { store.set("cookie", true); c.remove(); });
    }

    /* PWA install capture */
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      window.__chitroInstall = e;
      const b = $("#installBanner");
      if (b) b.classList.add("show");
    });
  }

  /* ---------- card renderers ---------- */
  function cardHTML(p, opts = {}) {
    const badge = opts.rank
      ? `<span class="rank">#${opts.rank}</span>`
      : p.membersOnly ? `<span class="badge badge-pro">🔒 PRO</span>`
      : p.isNew ? `<span class="badge">NEW</span>` : "";
    const liked = !!likeMap()[p.id];
    return `
      <a class="card reveal ${opts.rank === 1 ? "rank-1" : ""}" href="template.html?id=${p.id}">
        <div class="card-img">
          ${badge}
          <img class="fill" aria-hidden="true" src="${p.img}" alt="" loading="lazy">
          <img class="main" src="${p.img}" alt="${esc(p.title)} — AI image prompt example" loading="lazy">
          <div class="qk">
            <button class="qk-btn ${liked ? "on" : ""}" data-qk="like" data-id="${p.id}" aria-label="Like ${esc(p.title)}">${I.heart}</button>
            <button class="qk-btn" data-qk="copy" data-id="${p.id}" aria-label="Copy prompt">${I.copy}</button>
          </div>
        </div>
        <div class="card-info">
          <h3>${esc(p.title)}</h3>
          <p>${opts.copyIcon ? I.copy : I.zap}${fmt(getUses(p))} ${opts.copyIcon ? "Copies" : "Uses"}</p>
        </div>
      </a>`;
  }
  function renderGrid(el, list, opts = {}) {
    el.innerHTML = list.map((p, i) => cardHTML(p, { ...opts, rank: opts.ranked ? i + 1 : null })).join("");
    watchReveals(el);
  }
  function sectionHead(emoji, title, list, link) {
    return `
      <div class="section-head reveal">
        <span class="emoji">${emoji}</span>
        <h2>${esc(title)}</h2>
        <span class="count">${list.length}</span>
        <a class="see-all" href="${link}">See All ${I.right}</a>
      </div>`;
  }
  const getCat = (id) => PROMPTS.filter((p) => p.cats.includes(id)).sort((a, b) => getUses(b) - getUses(a));

  /* ---------- clipboard ---------- */
  function copyText(text, done) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => legacyCopy(text, done));
    } else legacyCopy(text, done);
  }
  function legacyCopy(text, done) {
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    ta.remove(); done();
  }
  function bumpCopies(id) {
    const all = extraCopies(); all[id] = (all[id] || 0) + 1; store.set("copies", all);
  }

  /* ---------- recent ---------- */
  function pushRecent(id) {
    let r = store.get("recent", []).filter((x) => x !== id);
    r.unshift(id); store.set("recent", r.slice(0, 8));
  }

  /* ---------- page: home ---------- */
  function pageHome() {
    /* Prompt of the Day — deterministic per date */
    const dayIndex = Math.floor(Date.now() / DAY) % PROMPTS.length;
    const pd = PROMPTS[dayIndex];
    const potdEl = $("#potd");
    if (potdEl) {
      potdEl.innerHTML = `
        <div class="potd pro reveal">
          <a class="potd-img" href="template.html?id=${pd.id}"><img src="${pd.img}" alt="${esc(pd.title)}"></a>
          <div class="potd-body">
            <span class="potd-tag">✨ Prompt of the Day</span>
            <h3>${esc(pd.title)}</h3>
            <p>${esc(pd.tagline)}</p>
            <div class="potd-meta">
              <span class="pchip">${I.copy} ${fmt(getUses(pd))} copies</span>
              <span class="pchip">${I.heart} ${fmt(getLikes(pd))} likes</span>
              <span class="pchip timer" id="potdTimer">🕛 New prompt soon</span>
            </div>
            <div class="potd-actions">
              <a class="btn" href="template.html?id=${pd.id}">View Prompt ${I.right}</a>
              <button class="copy-mini" id="potdCopy">${I.copy}<span>Copy</span></button>
            </div>
          </div>
        </div>`;
      $("#potdCopy").addEventListener("click", () => {
        copyText(pd.prompt, () => { bumpCopies(pd.id); toast("Prompt of the Day copied!"); $("#potdCopy span").textContent = "Copied!"; setTimeout(() => { const b = $("#potdCopy"); if (b) b.querySelector("span").textContent = "Copy"; }, 1500); });
      });
      if (typeof startPotdTimer === "function") startPotdTimer();
    }

    /* Top This Week — center-highlight coverflow carousel (leaderboard) */
    if (typeof buildWeekCarousel === "function") buildWeekCarousel();

    /* Recently viewed */
    const recent = store.get("recent", []).map(byId).filter(Boolean);
    const recSec = $("#recent");
    if (recSec && recent.length) {
      recSec.style.display = "";
      recSec.innerHTML = sectionHead("🕘", "Recently Viewed", recent, "saved.html") + `<div class="masonry"></div>`;
      renderGrid($(".masonry", recSec), recent.slice(0, 4));
    }

    /* Category sections */
    const sections = [
      ["⚡", "Trending", "trending", "#sec-trending", 6],
      ["🔥", "Popular", "popular", "#sec-popular", 6],
      ["🪔", "Festival", "festival", "#sec-festival", 6],
      ["💍", "Wedding & Bridal", "wedding", "#sec-wedding", 4],
      ["💼", "Professional", "professional", "#sec-professional", 4]
    ];
    sections.forEach(([emoji, title, catId, sel, max]) => {
      const host = $(sel);
      if (!host) return;
      const full = getCat(catId);
      host.innerHTML = sectionHead(emoji, title, full, `category.html?c=${catId}`) + `<div class="masonry"></div>`;
      renderGrid($(".masonry", host), full.slice(0, max));
    });

    /* categories grid */
    const catHost = $("#categories");
    catHost.innerHTML = CATEGORIES.map((c) => `
      <a class="cat-card reveal" href="category.html?c=${c.id}">
        <span class="cat-icon">${c.icon}</span>
        <h3>${esc(c.name)}</h3>
        <p>${esc(c.desc)}</p>
      </a>`).join("");
    watchReveals(catHost);

    /* blog */
    const blogHost = $("#blogCards");
    blogHost.innerHTML = ARTICLES.slice(0, 3).map((a, i) => blogCardHTML(a, i)).join("");
    watchReveals(blogHost);

    /* install banner */
    const ib = $("#installBanner");
    if (ib) {
      $("#installGo", ib).addEventListener("click", async () => {
        if (window.__chitroInstall) { window.__chitroInstall.prompt(); await window.__chitroInstall.userChoice; window.__chitroInstall = null; }
        ib.classList.remove("show"); store.set("installDismissed", true);
      });
      $("#installClose", ib).addEventListener("click", () => { ib.classList.remove("show"); store.set("installDismissed", true); });
      if (store.get("installDismissed", false)) ib.classList.remove("show");
    }
  }

  function blogCardHTML(a, i) {
    return `
      <a class="blog-card reveal" href="article.html?s=${a.slug}">
        <div class="blog-art">${["📝", "🛠️", "💡", "🪔"][i % 4]}</div>
        <div class="blog-body">
          <span class="tag">${esc(a.tag)}</span>
          <h3>${esc(a.title)}</h3>
          <p>${esc(a.excerpt)}</p>
          <div class="meta">${esc(a.read)} · ${esc(a.date)}</div>
        </div>
      </a>`;
  }

  /* ---------- page: discover ---------- */
  function pageDiscover() {
    const chips = $("#filterChips");
    const grid = $("#discoverGrid");
    grid.classList.add("masonry");
    const countEl = $("#discoverCount");
    const cats = CATEGORIES.filter((c) => getCat(c.id).length > 0);

    chips.innerHTML =
      `<button class="f-chip active" data-f="all">All</button>` +
      cats.map((c) => `<button class="f-chip" data-f="${c.id}">${c.icon} ${esc(c.name)}</button>`).join("") +
      `<button class="f-chip" data-f="__random" style="border-style:dashed">🎲 Surprise Me</button>`;

    function apply(f) {
      if (f === "__random") {
        const p = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
        location.href = `template.html?id=${p.id}`;
        return;
      }
      $$(".f-chip", chips).forEach((b) => b.classList.toggle("active", b.dataset.f === f));
      const list = (f === "all" ? [...PROMPTS] : getCat(f)).sort((a, b) => getUses(b) - getUses(a));
      countEl.textContent = `Explore ${list.length} free AI image prompts`;
      renderGrid(grid, list);
    }
    chips.addEventListener("click", (e) => { const b = e.target.closest(".f-chip"); if (b) apply(b.dataset.f); });
    apply("all");
  }

  /* ---------- page: category ---------- */
  function pageCategory() {
    let id = param("c") || "trending";
    /* গ্লোবাল লেবেল: পুরনো/শিট অ্যালায়াস → ক্যানোনিকাল আইডি (যেমন happy-birthday → birthday) */
    if (typeof TEZOFY_LABELS !== "undefined") {
      const canon = TEZOFY_LABELS.canonical(id);
      if (canon) id = canon;
    }
    $$(".grid").forEach((g) => g.classList.add("masonry"));
    const cat = CATEGORIES.find((c) => c.id === id);
    const list = getCat(id);
    $("#catTitle").innerHTML = `${cat ? cat.icon + " " : ""}${esc(cat ? cat.name : "Prompts")}`;
    $("#catDesc").textContent = cat ? cat.desc : "";
    document.title = `${cat ? cat.name : "Category"} — ${SITE.name}`;
    if (list.length) { renderGrid($("#catGrid"), list); $("#catEmpty").style.display = "none"; }
    else {
      $("#catGrid").innerHTML = ""; $("#catEmpty").style.display = "";
      /* ইঞ্জিনে স্লট আছে এমন ক্যাটাগরি খালি হলে Infinite Engine-এর সিটিআই */
      const lbl = (typeof TEZOFY_LABELS !== "undefined") ? TEZOFY_LABELS.labelFor(id) : null;
      const emptyHost = $("#catEmpty");
      if (lbl && lbl.engine && emptyHost && !$("#catEngineCta")) {
        const cta = document.createElement("a");
        cta.id = "catEngineCta";
        cta.href = "infinite.html";
        cta.className = "btn";
        cta.style.marginTop = "12px";
        cta.textContent = `♾️ Generate ${lbl.name} prompts instantly`;
        emptyHost.appendChild(cta);
      }
    }
  }

  /* ---------- page: saved ---------- */
  function pageSaved() {
    const list = savedList().map(byId).filter(Boolean);
    if (!list.length) { $("#savedGrid").innerHTML = ""; $("#savedEmpty").style.display = ""; return; }
    $("#savedEmpty").style.display = "none";
    renderGrid($("#savedGrid"), list);
  }

  /* ============================================================
     CUSTOMIZE BUILDER — scrollable option chips per group
     ============================================================ */
  function buildCustomizer(p, mount, onChange) {
    const state = {}; // groupId -> option label (single) | Set of labels (multi)
    const ratioSel = { v: null };

    const groups = (p.custom || []).map((gid) => {
      const def = CUSTOMIZE_GROUPS[gid];
      const opts = (p.customOptions && p.customOptions[gid]) || OPTS[gid] || [];
      return { gid, def, opts };
    }).filter((g) => g.def && g.opts.length);

    let html = `
      <div class="customize-title">
        <h3>🎛️ Customize this image</h3>
        <button class="reset-link" type="button" data-reset>Reset</button>
      </div>
      <p class="customize-sub">Tap options to reshape the image — the prompt rewrites itself live below.</p>`;

    groups.forEach(({ gid, def }) => {
      html += `
        <div class="opt-group" data-group="${gid}">
          <div class="opt-group-head"><span class="g-icon">${def.icon}</span><b>${def.label}</b><span>${def.hint || ""}</span></div>
          <div class="opt-row" data-row="${gid}" data-multi="${def.multi ? "1" : ""}" data-type="${def.type || ""}">
          </div>
        </div>`;
    });
    mount.innerHTML = html;

    groups.forEach(({ gid, def, opts }) => {
      const row = $(`[data-row="${gid}"]`, mount);
      row.innerHTML = opts.map(([label]) => `<button type="button" class="opt-chip" data-val="${esc(label)}">${esc(label)}</button>`).join("");
    });

    function selectedAdds() {
      const adds = [];
      groups.forEach(({ gid, def, opts }) => {
        if (def.type === "ratio" || def.multi) return;
        const lbl = state[gid];
        if (!lbl) return;
        const found = opts.find(([l]) => l === lbl);
        if (found) adds.push(found[1]);
      });
      // multi groups (fx)
      groups.forEach(({ gid, def, opts }) => {
        if (!def.multi) return;
        const set = state[gid];
        if (!set || !set.size) return;
        opts.forEach(([l, add]) => { if (set.has(l)) adds.push(add); });
      });
      return adds;
    }

    function fire() { onChange({ adds: selectedAdds(), ratio: ratioSel.v }); }

    mount.addEventListener("click", (e) => {
      if (e.target.closest("[data-reset]")) {
        Object.keys(state).forEach((k) => delete state[k]);
        ratioSel.v = null;
        $$(".opt-chip.active", mount).forEach((c) => c.classList.remove("active"));
        fire();
        toast("Customization reset");
        return;
      }
      const chip = e.target.closest(".opt-chip");
      if (!chip) return;
      const row = chip.closest(".opt-row");
      const gid = row.dataset.row;
      const def = CUSTOMIZE_GROUPS[gid];
      const val = chip.dataset.val;

      if (def.type === "ratio") {
        const was = chip.classList.contains("active");
        $$(".opt-chip", row).forEach((c) => c.classList.remove("active"));
        if (was) { ratioSel.v = null; }
        else { chip.classList.add("active"); ratioSel.v = optsValue(gid, val); }
      } else if (def.multi) {
        const set = state[gid] || (state[gid] = new Set());
        if (set.has(val)) { set.delete(val); chip.classList.remove("active"); }
        else { set.add(val); chip.classList.add("active"); }
      } else {
        const was = chip.classList.contains("active");
        $$(".opt-chip", row).forEach((c) => c.classList.remove("active"));
        if (was) delete state[gid];
        else { chip.classList.add("active"); state[gid] = val; }
      }
      fire();
    });

    function optsValue(gid, label) {
      const { opts } = groups.find((g) => g.gid === gid);
      const f = opts.find(([l]) => l === label);
      return f ? f[1] : null;
    }
  }

  /* ---------- page: template (detail) ---------- */
  function pageTemplate() {
    const p = byId(param("id")) || PROMPTS[0];
    document.title = `${p.title} — ${SITE.name}`;
    pushRecent(p.id);
    const likedInit = () => !!likeMap()[p.id];

    $("#detailRoot").innerHTML = `
      <div class="detail-top">
        <button class="back-btn" id="backBtn">${I.left}<span>Back</span></button>
        <div class="detail-actions">
          <button class="action-btn ${isSaved(p.id) ? "on" : ""}" id="saveBtn" aria-label="Save prompt">${I.bookmark}<span>${isSaved(p.id) ? "Saved" : "Save"}</span></button>
          <button class="action-btn" id="shareBtn" aria-label="Share prompt">${I.share}<span>Share</span></button>
          <button class="action-btn" id="waBtn" aria-label="Share on WhatsApp" style="color:#4ade80">${I.whatsapp}</button>
        </div>
      </div>
      <div class="detail-layout">
        <div class="detail-img reveal">
          <img class="fill" aria-hidden="true" src="${p.img}" alt="" draggable="false">
          <span class="hero-ring" style="--ogH:${Math.floor(Math.random() * 360)}">
            <img class="main" src="${p.img}" alt="${esc(p.title)} — AI generated example image" draggable="false">
          </span>
          <div class="img-shield" id="imgShield" aria-hidden="true"></div>
          <button class="img-dl-btn" id="dlImgBtn" type="button" aria-label="Download image" title="Download image">
            ${I.download}
          </button>
        </div>
        <div>
          <div class="detail-head reveal">
            <h1>${esc(p.title)}</h1>
            <p class="sub">${esc(p.tagline)}</p>
            <div class="meta-row">
              <span class="meta-chip">${I.copy}<span id="useCount">${fmt(getUses(p))}</span>&nbsp;copies</span>
              <button class="meta-chip ${likedInit() ? "liked" : ""}" id="likeBtn">${I.heart}<span id="likeCount">${fmt(getLikes(p))}</span>&nbsp;likes</button>
              <a class="meta-chip cat-chip" href="category.html?c=${p.cats[0]}">in ${esc(catName(p.cats[0]))}</a>
            </div>
          </div>

          <div class="prompt-card reveal">
            <div class="prompt-inner">
              <div class="prompt-head">
                <h2>Prompt</h2>
                <button class="copy-btn" id="copyBtn">${I.copy}<span>Copy</span></button>
              </div>
              <div class="prompt-text" id="promptText"></div>
              <div class="cust-gate" id="custGate">
                <button type="button" class="cust-now" id="custNow"><span class="cn-bd" aria-hidden="true"></span><span class="cn-in">✨ Customize Now</span></button>
                <p class="cust-sub">Outfit · background · lighting · ratio — free after quick sign-up</p>
              </div>
              <div id="custPanel" hidden>
                <div class="customizer" id="textTokens"></div>
                <div id="customizeHost"></div>
              </div>
              <button class="btn big-copy" id="bigCopy">${I.copy}<span>Copy Prompt</span></button>
              <div class="prompt-count" id="promptCount"></div>
              <div class="paste-into">Then paste into:&nbsp;
                <a href="https://gemini.google.com/app" target="_blank" rel="noopener">Gemini ↗</a> ·
                <a href="https://chatgpt.com/" target="_blank" rel="noopener">ChatGPT ↗</a> ·
                <a href="https://www.meta.ai/" target="_blank" rel="noopener">Meta AI ↗</a>
              </div>
            </div>
          </div>

          <h2 style="margin-top:28px;font-size:.78rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)">In this image</h2>
          <div class="chip-row reveal">${p.tags.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>

          <div class="prose reveal">
            <h2>About this prompt</h2>
            <p>${esc(p.about)}</p>
            <h3>How this prompt works</h3>
            <p>${esc(p.how)}</p>
            <h3>Which tool to use</h3>
            <p>${esc(p.tools)}</p>
            <h3>Step by step</h3>
            <ol>${p.steps.map((s, i) => `<li data-i="${i + 1}">${esc(s)}</li>`).join("")}</ol>
            <h3>Try changing</h3>
            <ul>${p.variations.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
            <h3>Common mistakes</h3>
            <ul>${p.mistakes.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
          </div>
        </div>
      </div>

      <section class="section">
        <div class="section-head reveal"><span class="emoji">✨</span><h2>Related prompts</h2><a class="see-all" href="discover.html">Explore All ${I.right}</a></div>
        <div class="masonry" id="relatedGrid"></div>
      </section>`;

    const related = PROMPTS.filter((x) => x.id !== p.id && x.cats.some((c) => p.cats.includes(c)))
      .sort((a, b) => getUses(b) - getUses(a)).slice(0, 4);
    renderGrid($("#relatedGrid"), related);

    /* ---- prompt composition: tokens + customize groups ---- */
    const tokens = [...new Set((p.prompt.match(/\[[A-Z][A-Z0-9 ]+\]/g) || []))];
    const tokenVals = {};
    let adds = [], ratioOverride = null;
    const promptText = $("#promptText");

    function composeFinal() {
      let t = p.prompt;
      tokens.forEach((tok) => {
        const v = (tokenVals[tok] || "").trim();
        if (v) t = t.split(tok).join(v);
      });
      if (adds.length) t = t + " " + adds.join(" ");
      if (ratioOverride) t = t.replace(/Ratio\s*[\d.]+\s*:\s*[\d.]+/i, "Ratio " + ratioOverride);
      return t;
    }
    function renderPrompt() {
      let html = esc(composeFinal());
      tokens.forEach((tok) => {
        const v = (tokenVals[tok] || "").trim();
        if (!v) html = html.split(esc(tok)).join(`<mark>${esc(tok)}</mark>`);
      });
      promptText.innerHTML = html;
      const n = composeFinal().length;
      $("#promptCount").textContent = `${n} characters · optimized for Gemini, ChatGPT & Midjourney`;
    }

    /* text token inputs */
    const textTokens = $("#textTokens");
    if (tokens.length) {
      textTokens.innerHTML = `<div class="customize-title"><h3>✏️ Fill in your details</h3></div>` + tokens.map((tok, i) => {
        const label = tok.slice(1, -1).toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
        return `<div><label style="font-size:.72rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:6px" for="tok-${i}">${esc(label)}</label>
          <input id="tok-${i}" data-tok="${esc(tok)}" type="text" placeholder="Replace ${esc(tok)} — e.g. your choice"></div>`;
      }).join("");
      textTokens.addEventListener("input", (e) => {
        const inp = e.target.closest("input[data-tok]");
        if (!inp) return;
        tokenVals[inp.dataset.tok] = inp.value;
        renderPrompt();
      });
    }

    /* option groups */
    buildCustomizer(p, $("#customizeHost"), ({ adds: a, ratio: r }) => { adds = a; ratioOverride = r; renderPrompt(); });
    renderPrompt();

    /* ✨ Customize Now gate: members open the panel, guests sign up first */
    const custGate = $("#custGate"), custPanel = $("#custPanel");
    const hasCustomize = tokens.length > 0 || !!$("#customizeHost .opt-group");
    if (!hasCustomize) { custGate.style.display = "none"; }
    else {
      const RR = RING_THEMES[(Math.random() * RING_THEMES.length) | 0] || RING_THEMES[0];
      const custNow = $("#custNow");
      custNow.style.setProperty("--ring-grad", RR.grad);
      custNow.style.setProperty("--ring-dur", RR.dur);
      custNow.style.setProperty("--ring-dir", RR.dir);
      custNow.addEventListener("click", () => {
        if (!currentUser()) {
          toast("Sign up free to unlock customization ✨");
          if (window.__chitroOpenAuth) window.__chitroOpenAuth();
          return;
        }
        custPanel.hidden = false;
        custGate.style.display = "none";
      });
    }

    /* 🔒 members-only gate: guests see a blurred preview + unlock card */
    if (p.membersOnly && !currentUser()) {
      const inner = $(".prompt-inner");
      if (inner) {
        inner.classList.add("locked");
        inner.insertAdjacentHTML("beforeend",
          `<div class="lock-overlay"><div class="lock-card">
             <span class="lock-badge">🔒 Members Only</span>
             <h3>Unlock this premium prompt</h3>
             <p>Create your free ${SITE.name} account to view, customize & copy member-exclusive prompt designs.</p>
             <button class="btn unlock-btn" data-open-auth>Unlock Free — 10 seconds ${I.right}</button>
           </div></div>`);
      }
    }

    $("#backBtn").addEventListener("click", () => {
      if (history.length > 1) history.back();
      else location.href = "index.html";
    });

    function doCopy() {
      copyText(composeFinal(), () => {
        bumpCopies(p.id);
        $("#useCount").textContent = fmt(getUses(p));
        toast("Prompt copied! Paste it into your AI tool");
        const btn = $("#copyBtn"); const big = $("#bigCopy");
        btn.innerHTML = I.check + "<span>Copied!</span>";
        big.innerHTML = I.check + "<span>Copied to Clipboard</span>";
        setTimeout(() => {
          btn.innerHTML = I.copy + "<span>Copy</span>";
          big.innerHTML = I.copy + "<span>Copy Prompt</span>";
        }, 1600);
      });
    }
    $("#copyBtn").addEventListener("click", doCopy);
    $("#bigCopy").addEventListener("click", doCopy);

    $("#likeBtn").addEventListener("click", () => {
      const m = likeMap(); m[p.id] = !m[p.id]; store.set("likes", m);
      $("#likeBtn").classList.toggle("liked", m[p.id]);
      $("#likeCount").textContent = fmt(getLikes(p));
      if (m[p.id]) toast("Added to likes");
    });

    $("#saveBtn").addEventListener("click", () => {
      let list = savedList();
      if (list.includes(p.id)) {
        list = list.filter((x) => x !== p.id); store.set("saved", list);
        $("#saveBtn").classList.remove("on"); $("#saveBtn span").textContent = "Save";
        toast("Removed from saved");
      } else {
        list.push(p.id); store.set("saved", list);
        $("#saveBtn").classList.add("on"); $("#saveBtn span").textContent = "Saved";
        toast("Saved! Find it in the Saved tab");
      }
    });

    $("#shareBtn").addEventListener("click", async () => {
      const shareUrl = await resolveShareUrl(p);
      const data = { title: p.title, url: shareUrl }; // link-only bubble → the OG card does the talking
      if (navigator.share) { try { await navigator.share(data); } catch (e) {} }
      else copyText(shareUrl, () => toast("Link copied to clipboard"));
    });

    $("#waBtn").addEventListener("click", async () => {
      const text = await resolveShareUrl(p); // clean link-only → WhatsApp renders the big preview card under it
      window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank", "noopener");
    });
                
    /* 🛡️ ব্রাউজারের লং-প্রেস ও রাইট-ক্লিক নিষ্ক্রিয়করণ */
    const shield = $("#imgShield");
    if (shield) {
      shield.addEventListener("contextmenu", (e) => {
        e.preventDefault(); // ব্রাউজারের সেভ ইমেজ মেনু সম্পূর্ণ বন্ধ
        toast("Please use the Download button above 📥");
      });
    }
     
     /* 📥 ইমেজ ডাউনলোড হ্যান্ডলার — ব্যাকগ্রাউন্ডহীন, বড় লোগো + অটো-কালার অ্যাডাপ্টিভ ওয়াটারমার্ক */
    const dlBtn = $("#dlImgBtn");
    if (dlBtn) {
      dlBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const filename = (p.title || "tezofy-image")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") + ".jpg";

        toast("Processing high-res image... 🎨");

        // ১. ছবিকে লোকাল Blob-এ আনার ব্রিজ (CORS নিরাপদ)
        async function getBlob(imgUrl) {
          if (!/^https?:\/\//i.test(imgUrl) || imgUrl.includes(location.hostname)) {
            try {
              const r = await fetch(imgUrl);
              if (r.ok) return await r.blob();
            } catch (err) {}
          }
          try {
            const r = await fetch("https://wsrv.nl/?url=" + encodeURIComponent(imgUrl));
            if (r.ok) return await r.blob();
          } catch (err) {}
          try {
            const r = await fetch("https://corsproxy.io/?" + encodeURIComponent(imgUrl));
            if (r.ok) return await r.blob();
          } catch (err) {}
          const r = await fetch(imgUrl, { mode: "cors" });
          if (r.ok) return await r.blob();
          throw new Error("Download blocked");
        }

        // ২. ইমেজ লোডার প্রমিজ
        function loadImage(src) {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
          });
        }

        // ৩. অ্যাডাপ্টিভ ওয়াটারমার্ক (ইমেজের কালার অনুযায়ী অটো টেক্সট কালার)
        async function applyAdaptiveWatermark(mainImg) {
          const canvas = document.createElement("canvas");
          const w = mainImg.naturalWidth || mainImg.width || 800;
          const h = mainImg.naturalHeight || mainImg.height || 1000;
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");

          // মূল ছবি ড্র করা
          ctx.drawImage(mainImg, 0, 0, w, h);

          // বড় ও সুস্পষ্ট সাইজ স্কেলিং
          const scale = Math.max(0.75, Math.min(w, h) / 900);
          const logoSize = Math.round(38 * scale);   // বড় ও স্পষ্ট লোগো ৩৮px
          const fontSize = Math.round(22 * scale);   // বোল্ড ফন্ট সাইজ ২২px
          const gap = Math.round(12 * scale);        // লোগো ও লেখার ফাঁকা
          const margin = Math.round(28 * scale);     // বর্ডার থেকে মার্জিন

          ctx.save();
          ctx.font = `900 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
          const brandText = "TEZOFY";
          const textW = ctx.measureText(brandText).width;

          const totalW = logoSize + gap + textW;
          const totalH = Math.max(logoSize, fontSize);

          // পজিশন: নিচের ডান কোণা
          const x = w - totalW - margin;
          const y = h - totalH - margin;

          // 🧠 স্মার্ট অটো-কালার স্ক্যানার: ওয়াটারমার্কের পেছনের ব্রাইটনেস মাপা
          var textColor = "#ffffff";
          var shadowColor = "rgba(0, 0, 0, 0.85)";

          try {
            const sampleArea = ctx.getImageData(
              Math.max(0, x - 10),
              Math.max(0, y - 10),
              Math.min(w - x + 10, totalW + 20),
              Math.min(h - y + 10, totalH + 20)
            );
            const d = sampleArea.data;
            let r = 0, g = 0, b = 0, count = 0;
            for (let i = 0; i < d.length; i += 16) {
              r += d[i]; g += d[i + 1]; b += d[i + 2]; count++;
            }
            const avgR = r / (count || 1);
            const avgG = g / (count || 1);
            const avgB = b / (count || 1);
            
            // আলোক উজ্জ্বলতার স্ট্যান্ডার্ড সূত্র (Relative Luminance):
            const lum = 0.299 * avgR + 0.587 * avgG + 0.114 * avgB;

            // ব্যাকগ্রাউন্ড যদি সাদা বা হালকা হয় (lum > 130) -> নেভিব্লু টেক্সট
            // ব্যাকগ্রাউন্ড যদি ডার্ক হয় (lum <= 130) -> উজ্জ্বল সাদা টেক্সট
            if (lum > 130) {
              textColor = "#0a192f";                   // গাঢ় নেভিব্লু
              shadowColor = "rgba(255, 255, 255, 0.9)"; // সফট লাইট শ্যাডো
            } else {
              textColor = "#ffffff";                   // খাঁটি উজ্জ্বল সাদা
              shadowColor = "rgba(0, 0, 0, 0.85)";      // সফট ডার্ক শ্যাডো
            }
          } catch (err) {}

          // ৪. আপনার লোগো বসানো (কোনো পেছনের ব্যাকগ্রাউন্ড বক্স নেই)
          try {
            const logo = await loadImage("assets/icons/logo.png");
            ctx.shadowColor = shadowColor;
            ctx.shadowBlur = Math.round(6 * scale);
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 2;
            ctx.drawImage(logo, x, y + (totalH - logoSize) / 2, logoSize, logoSize);
          } catch (e) {}

          // ৫. "TEZOFY" ব্র্যান্ড নাম ড্র করা (স্বয়ংক্রিয় অ্যাডাপ্টিভ কালার)
          ctx.fillStyle = textColor;
          ctx.textBaseline = "middle";
          ctx.letterSpacing = "0.04em";
          ctx.shadowColor = shadowColor;
          ctx.shadowBlur = Math.round(5 * scale);
          ctx.shadowOffsetX = 1;
          ctx.shadowOffsetY = 1;

          ctx.fillText(brandText, x + logoSize + gap, y + totalH / 2);
          ctx.restore();

          return new Promise((resolve) => {
            canvas.toBlob((b) => resolve(b), "image/jpeg", 0.95);
          });
        }

        try {
          const rawBlob = await getBlob(p.img);
          const tempUrl = URL.createObjectURL(rawBlob);
          const mainImg = await loadImage(tempUrl);
          
          // ওয়াটারমার্ক প্রসেসিং
          const watermarkedBlob = await applyAdaptiveWatermark(mainImg);
          URL.revokeObjectURL(tempUrl);

          // ডিভাইসে অটো ডাউনলোড
          const dlUrl = URL.createObjectURL(watermarkedBlob);
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = dlUrl;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(dlUrl), 2000);
          
          toast("Downloaded with TEZOFY watermark! 🖼️✨");
        } catch (err) {
          toast("Download failed — please try again ⚠️");
        }
      });
    }

    watchReveals();
  }

  /* ---------- page: blog / article ---------- */
  function pageBlog() {
    $("#blogList").innerHTML = ARTICLES.map((a, i) => blogCardHTML(a, i)).join("");
    watchReveals($("#blogList"));
  }

  function pageArticle() {
    const a = ARTICLES.find((x) => x.slug === param("s")) || ARTICLES[0];
    document.title = `${a.title} — ${SITE.name} Blog`;
    $("#articleRoot").innerHTML = `
      <div class="article-hero reveal">
        <a class="back-btn" href="blog.html">${I.left}<span>All articles</span></a>
        <h1>${esc(a.title)}</h1>
        <div class="byline"><span>${esc(a.tag)}</span><span>${esc(a.read)}</span><span>${esc(a.date)}</span></div>
      </div>
      <div class="prose reveal" style="margin-top:22px">
        <p style="font-size:1rem;color:#d4d4d8">${esc(a.excerpt)}</p>
        ${a.sections.map((s) => `<h2>${esc(s.h)}</h2><p>${esc(s.p)}</p>`).join("")}
      </div>
      <div class="cta reveal">
        <h2>Ready to create?</h2>
        <p>Browse the library, copy a prompt, and generate your first stunning portrait tonight.</p>
        <div class="btns"><a class="btn btn-block" href="discover.html">Explore Free Prompts ${I.right}</a></div>
      </div>`;
    watchReveals($("#articleRoot"));
  }

  /* ---------- PWA ---------- */
  function registerSW() {
    if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
  }

  /* ---------- official brand logo swap (favicon + footer mark) ---------- */
  function brandLogoSwap() {
    try {
      let l = document.querySelector('link[rel="icon"]');
      if (!l) { l = document.createElement("link"); l.rel = "icon"; document.head.appendChild(l); }
      l.type = "image/png"; l.href = "assets/icons/favicon.png";
      $$(".brand-mark").forEach((el) => {
        const svg = el.querySelector("svg");
        if (svg) svg.outerHTML = '<img src="assets/icons/logo.png" alt="TEZOFY logo">';
        if (el.querySelector("img")) el.classList.add("mark-img");
      });
    } catch (e) {}
  }

  /* ---------- footer social icons (links from data.js → SOCIAL) ---------- */
  function injectSocials() {
    const META = {
      facebook: { label: "Facebook", svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.3l-.5 3.5h-2.8v8.4A12 12 0 0 0 24 12z"/></svg>' },
      instagram: { label: "Instagram", svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="17.4" cy="6.6" r="1.3" fill="currentColor" stroke="none"/></svg>' },
      youtube: { label: "YouTube", svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 8.4c-.3-1-1-1.7-2-2C19.2 6 12 6 12 6s-7.2 0-9 .4c-1 .3-1.7 1-2 2C.6 10 .5 12 .5 12s0 2 .5 3.6c.3 1 1 1.7 2 2 1.8.4 9 .4 9 .4s7.2 0 9-.4c1-.3 1.7-1 2-2 .4-1.6.5-3.6.5-3.6s-.1-2-.5-3.6zM9.7 15.1V8.9l6.2 3.1-6.2 3.1z"/></svg>' },
      x: { label: "X (Twitter)", svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 1.2h3.7l-8.1 9.3L24 22.8h-7.4l-5.8-7.6-6.7 7.6H.4l8.7-9.9L0 1.2h7.6l5.3 7 6-7zm-1.3 17h2L6.6 3.3H4.4L17.6 18.2z"/></svg>' },
      whatsapp: { label: "WhatsApp", svg: I.whatsapp },
      telegram: { label: "Telegram", svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.9 3.6 20.3 20.6c-.3 1.2-1 1.5-2 1L12.9 18l-2.6 2.5c-.3.3-.5.5-1.1.5l.4-5.4L19.7 5.9c.4-.4-.1-.6-.6-.2L6.9 14 1.5 12.3C.3 12 .3 11.1 1.6 10.6L22.5 2.1c1-.3 1.8.3 1.4 1.5z"/></svg>' },
      tiktok: { label: "TikTok", svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>' },
      pinterest: { label: "Pinterest", svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/></svg>' },
      linkedin: { label: "LinkedIn", svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>' }
    };
    const ORDER = ["facebook", "instagram", "youtube", "x", "whatsapp", "telegram", "tiktok", "pinterest", "linkedin"];
    const conf = (typeof SOCIAL !== "undefined" && SOCIAL) || {};
    const host = document.querySelector(".site-footer .footer-grid > div:first-child") || document.querySelector(".site-footer");
    if (!host) return;
    const brand = host.querySelector(".brand");
    if (brand) brand.setAttribute("href", "https://tezofystudio.github.io/tezofy/index.html");
    const tag = host.querySelector(".muted");
    if (tag) tag.textContent = "The easiest way to create stunning AI portraits — discover, customize and copy prompts that actually work.";
    const old = host.querySelector(".footer-social"); if (old) old.remove();
    host.insertAdjacentHTML("beforeend",
      `<div class="footer-social"><span class="fs-label">Follow ${SITE.name}</span><div class="fs-row">` +
      ORDER.map((k) => {
        const url = /^https?:\/\//.test(conf[k] || "") ? conf[k] : "";
        return url
          ? `<a class="fs-btn fs-${k}" href="${esc(url)}" target="_blank" rel="noopener" aria-label="${META[k].label}">${META[k].svg}</a>`
          : `<button type="button" class="fs-btn fs-${k} soon" data-soc-soon="${META[k].label}" aria-label="${META[k].label} (link coming soon)">${META[k].svg}</button>`;
      }).join("") + `</div></div>`);
    $$(".fs-btn.soon", host).forEach((b) => b.addEventListener("click", () => toast(b.dataset.socSoon + " link coming soon ✨")));
  }
  /* ---------- dark / light theme ---------- */
  function applyStoredTheme() {
    try { document.documentElement.dataset.theme = JSON.parse(localStorage.getItem("chitro:theme") || '"dark"'); }
    catch (e) { document.documentElement.dataset.theme = "dark"; }
  }
  function themeIcon(mode) {
    return mode === "light"
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"/></svg>';
  }
  function toggleTheme() {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("chitro:theme", JSON.stringify(next)); } catch (e) {}
    const tb = $("#themeBtn"); if (tb) tb.innerHTML = themeIcon(next);
    toast(next === "light" ? "☀️ Light mode on" : "🌙 Dark mode on");
  }

  /* ---------- quick card actions (hover like / copy) ---------- */
  let __qkBound = false;
  function bindQuickActions() {
    if (__qkBound) return; __qkBound = true;
    document.addEventListener("click", (e) => {
      const b = e.target.closest("[data-qk]");
      if (!b) return;
      e.preventDefault(); e.stopPropagation();
      const p = byId(b.dataset.id); if (!p) return;
      if (b.dataset.qk === "copy") {
        if (p.membersOnly && !currentUser()) { if (window.__chitroOpenAuth) window.__chitroOpenAuth(); return; }
        copyText(p.prompt, () => toast("Prompt copied! Now paste it into Gemini ✨"));
      } else if (b.dataset.qk === "like") {
        const m = likeMap();
        if (m[p.id]) { delete m[p.id]; } else { m[p.id] = true; }
        store.set("likes", m);
        b.classList.toggle("on", !!m[p.id]);
        toast(m[p.id] ? "Added to favorites ❤️" : "Removed from favorites");
      }
    }, true);
  }

  /* ---------- POTD countdown ---------- */
  function startPotdTimer() {
    const el = $("#potdTimer"); if (!el) return;
    const tick = () => {
      const now = Date.now(); const mid = Math.floor(now / DAY) * DAY + DAY; const m = Math.max(0, mid - now);
      el.textContent = `🕛 New prompt in ${Math.floor(m / 36e5)}h ${Math.floor((m % 36e5) / 6e4)}m`;
    };
    tick(); setInterval(tick, 60000);
  }

  /* ---------- Top This Week: coverflow carousel ---------- */
  function buildWeekCarousel() {
    const rail = $("#top3"); if (!rail) return;
    const week = [...PROMPTS].map((p) => ({ p, s: getUses(p) + getLikes(p) * 3 }))
      .sort((a, b) => b.s - a.s).slice(0, 8).map((x) => x.p);
    rail.className = "cflow";
    rail.innerHTML = '<div class="cf-track">' +
      week.map((p, i) => `<div class="cf-item${i === 0 ? " active" : ""}" data-i="${i}">${cardHTML(p, { rank: i + 1, copyIcon: true })}</div>`).join("") +
      "</div>";
    const items = $$(".cf-item", rail), n = items.length;
    let cur = 0, hovering = false, downX = null;
    rail.insertAdjacentHTML("afterend",
      `<div class="cf-nav"><button class="rail-btn" id="cfPrev" aria-label="Back">←</button><div class="cf-dots">${week.map((_, j) => `<button class="cf-dot" data-j="${j}" aria-label="Card ${j + 1}"></button>`).join("")}</div><button class="rail-btn" id="cfNext" aria-label="Next">→</button></div>`);
    const nav = rail.nextElementSibling;
    function render() {
      items.forEach((el, j) => {
        let off = j - cur;
        if (off > n / 2) off -= n;
        if (off < -n / 2) off += n;
        const ao = Math.abs(off);
        el.style.transform = `translateX(calc(-50% + ${off * 72}%)) scale(${ao === 0 ? 1 : ao === 1 ? .8 : .62})`;
        el.style.opacity = ao > 2 ? 0 : ao === 2 ? .45 : ao === 1 ? .8 : 1;
        el.style.zIndex = String(10 - ao);
        el.style.pointerEvents = ao > 2 ? "none" : "";
        el.classList.toggle("active", off === 0);
      });
      $$(".cf-dot", nav).forEach((d, j) => d.classList.toggle("on", j === cur));
    }
    function go(j) { cur = (j + n) % n; render(); }
    $("#cfPrev", nav).addEventListener("click", () => go(cur - 1));
    $("#cfNext", nav).addEventListener("click", () => go(cur + 1));
    $$(".cf-dot", nav).forEach((d) => d.addEventListener("click", () => go(Number(d.dataset.j))));
    items.forEach((el) => el.addEventListener("click", (e) => {
      if (!el.classList.contains("active")) { e.preventDefault(); go(Number(el.dataset.i)); }
    }));
    rail.addEventListener("pointerdown", (e) => { downX = e.clientX; });
    rail.addEventListener("pointerup", (e) => {
      if (downX === null) return;
      const dx = e.clientX - downX;
      if (Math.abs(dx) > 42) { go(cur + (dx < 0 ? 1 : -1)); e.preventDefault(); }
      downX = null;
    });
    rail.addEventListener("pointerenter", () => { hovering = true; });
    rail.addEventListener("pointerleave", () => { hovering = false; downX = null; });
    setInterval(() => { if (!hovering && document.visibilityState === "visible") go(cur + 1); }, 5200);
    go(0);
    watchReveals(rail);
  }


  /* ---------- Remote prompts (Google Sheets CMS — no GitHub needed) ---------- */
  function rpList(v) { return Array.isArray(v) ? v.filter(Boolean) : String(v || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean); }
  function rpNormalize(r) {
    if (!r || !r.title || !r.img || !r.prompt) return null;
    return {
      id: /^rp-/.test(String(r.id)) ? String(r.id) : "rp-" + String(r.id),
      title: String(r.title).slice(0, 140),
      tagline: r.tagline || "Free AI image prompt — copy & customize on TEZOFY.",
      img: String(r.img),
      cats: rpList(r.cats),
      tags: rpList(r.tags),
      prompt: String(r.prompt),
      about: r.about || (String(r.title) + " — a TEZOFY community prompt, free to copy and customize."),
      how: r.how || "Copy this prompt, paste it into your AI tool, replace any bracketed [DETAILS] with your own and generate. Use the customize chips to restyle it instantly.",
      tools: r.tools || "Works beautifully with Gemini, ChatGPT, Meta AI, Copilot and Midjourney.",
      steps: (Array.isArray(r.steps) && r.steps.length) ? r.steps : ["Copy the full prompt below.", "Paste it into your AI image tool (Gemini / ChatGPT / Meta AI).", "Replace bracketed details with your own, then generate & download."],
      variations: (Array.isArray(r.variations) && r.variations.length) ? r.variations : ["Change the outfit, background or lighting words to restyle it.", "Add \u201Ccinematic lighting\u201D or \u201C85mm portrait lens\u201D for a pro finish."],
      mistakes: (Array.isArray(r.mistakes) && r.mistakes.length) ? r.mistakes : ["Leaving [BRACKETED] parts unchanged.", "Asking for text in the image without a clear style."],
      uses: +r.uses || 0,
      likes: +r.likes || 0,
      membersOnly: !!r.membersOnly,
      isNew: !!r.isNew,
      custom: Array.isArray(r.custom) ? r.custom : undefined,
      customOptions: (r.customOptions && typeof r.customOptions === "object") ? r.customOptions : undefined
    };
  }
  function applyRemoteData(data) {
    if (!data) return false;
    var i, added = 0;
    for (i = PROMPTS.length - 1; i >= 0; i--) if (PROMPTS[i]._remote) PROMPTS.splice(i, 1);
    (data.cats || []).forEach(function (c) {
      if (!c || !c.id) return;
      if (!CATEGORIES.some(function (x) { return x.id === c.id; }))
        CATEGORIES.push({ id: String(c.id), name: c.name || String(c.id), icon: c.icon || "\u2728", desc: c.desc || "Community category" });
    });
    (data.prompts || []).forEach(function (r) {
      var p = rpNormalize(r);
      if (!p) return;
      p._remote = true;
      if (PROMPTS.some(function (x) { return x.id === p.id; })) return;
      PROMPTS.push(p); added++;
    });
    normalizeLabels();   /* রিমোট ক্যাট/প্রম্পট এসেছে → লেবেল-রেজিস্ট্রি দিয়ে আবার সামঞ্জস্য */
    return added;
  }
  function initRemotePrompts() {
    try {
      if (typeof AUTH_CONFIG === "undefined" || !AUTH_CONFIG.sheetUrl) return;
      var cached = store.get("remoteData", null);
      if (cached) applyRemoteData(cached);            // instant first paint from cache
      var last = store.get("remoteSyncTs", 0) || 0;
      if (Date.now() - last < 15 * 60000) return;      // re-check every 15 min
      fetch(String(AUTH_CONFIG.sheetUrl) + "?action=prompts&t=" + Date.now())
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (!data || !Array.isArray(data.prompts)) return;
          store.set("remoteSyncTs", Date.now());
          if (JSON.stringify(cached || null) !== JSON.stringify(data)) {
            store.set("remoteData", data);
            applyRemoteData(data);
            if (window.__chitroRerender) window.__chitroRerender();
          }
        })
        .catch(function () {});
    } catch (e) {}
  }

  /* ---------- global label system (assets/js/labels.js) ----------
     TEZOFY_LABELS = সাইটজুড়ে ক্যাটাগরির একমাত্র উৎস। labels.js না থাকলে
     সাইট আগের মতোই চলে (graceful fallback)। */
  function normalizeLabels() {
    if (typeof TEZOFY_LABELS === "undefined" || !Array.isArray(TEZOFY_LABELS.all)) return false;
    /* ১) অ্যালায়াস আইডি → ক্যানোনিকাল (যেমন শিটের happy-birthday → birthday) */
    PROMPTS.forEach((p) => {
      p.cats = p.cats.map((c) => {
        const n = TEZOFY_LABELS.canonical(c);
        return (n && n !== c) ? n : c;
      });
    });
    /* ২) CATEGORIES পুনর্গঠন — রেজিস্ট্রির ক্রম/নাম/ইমোজি; অজানা রিমোট ক্যাট শেষে টিকে থাকে
       (রেজিস্ট্রি-অ্যালায়াস আইডি — যেমন শিটের happy-birthday — ডুপ্লিকেট হিসেবে বাদ যায়) */
    const known = new Set(TEZOFY_LABELS.all.map((l) => l.id));
    TEZOFY_LABELS.all.forEach((l) => (l.aliases || []).forEach((a) => known.add(a)));
    const extras = CATEGORIES.filter((c) => !known.has(c.id));
    CATEGORIES.length = 0;
    TEZOFY_LABELS.all.forEach((l) => CATEGORIES.push({ id: l.id, name: l.name, icon: l.emoji, desc: l.desc || "" }));
    extras.forEach((c) => CATEGORIES.push(c));
    return true;
  }
  function ensureLabels(next) {
    if (typeof TEZOFY_LABELS !== "undefined") return next();
    const s = document.createElement("script");
    s.src = "assets/js/labels.js";
    s.onload = () => next();
    s.onerror = () => next();
    document.head.appendChild(s);
  }
  function injectAiMenu() {
    /* AI টুলস-মেনু (assets/js/ai-menu.js): বটমবারের AI বাটন → পপআপ,
       ডেস্কটপ হেডারে "AI Tools" পিল। ফাইল না থাকলে কিছুই বদলায় না। */
    if (document.querySelector("script[data-ai-menu]")) return;
    const s = document.createElement("script");
    s.src = "assets/js/ai-menu.js";
    s.async = true;
    s.dataset.aiMenu = "1";
    document.head.appendChild(s);
  }

  /* ---------- boot (idempotent) ---------- */
  let booted = false;
  function boot() {
    if (booted) return;
    booted = true;
    recordVisit();
    registerSW();
    const page = document.body.dataset.page || "home";
    applyStoredTheme();
    ensureLabels(() => {
      normalizeLabels();
      buildChrome(page);
      injectAiMenu();
      brandLogoSwap();
      injectSocials();
      bindQuickActions();
      initRemotePrompts();
      const rerenderPage = () => ({ home: pageHome, discover: pageDiscover, category: pageCategory, template: pageTemplate, blog: pageBlog, article: pageArticle, saved: pageSaved }[page] || pageHome)();
      window.__chitroRerender = rerenderPage;
      rerenderPage();
      watchReveals();
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();

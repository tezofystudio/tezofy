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

  /* ---------- icons ---------- */
  const I = {
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></svg>',
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

  function avatarHTML() {
    const u = currentUser();
    return u
      ? `<button class="avatar-btn logged" data-open-auth aria-label="Profile">${esc(u.name.trim()[0].toUpperCase())}</button>`
      : `<button class="avatar-btn" data-open-auth aria-label="Sign in">${I.user}</button>`;
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
            <div class="field"><label for="aPass">Password</label><input id="aPass" type="password" placeholder="${mode === "signup" ? "Minimum 4 characters" : "Your password"}" autocomplete="${mode === "signup" ? "new-password" : "current-password"}"></div>
            <div class="auth-error" id="authError"></div>
            <button class="btn auth-submit" type="submit">${mode === "signup" ? "Create Free Account" : "Log In"}</button>
          </form>
          <button class="guest-link" data-close-auth>Continue as guest for now →</button>
          <p class="auth-note">🔒 Free forever. Your password never leaves this device —<br>we only keep your name & email to send new-prompt updates.</p>
        </div>`;

      $$("[data-tab]", ov).forEach((b) => b.addEventListener("click", () => renderAuth(b.dataset.tab)));
      $$("[data-close-auth]", ov).forEach((b) => b.addEventListener("click", close));
      ov.addEventListener("click", (e) => { if (e.target === ov) close(); });

      $("#authForm", ov).addEventListener("submit", (e) => {
        e.preventDefault();
        const email = ($("#aEmail", ov).value || "").trim().toLowerCase();
        const pass = $("#aPass", ov).value || "";
        const errEl = $("#authError", ov);
        const fail = (m) => { errEl.textContent = m; errEl.classList.add("show"); };
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return fail("Please enter a valid email address.");
        if (pass.length < 4) return fail("Password must be at least 4 characters.");
        if (mode === "signup") {
          const name = ($("#aName", ov).value || "").trim();
          if (name.length < 2) return fail("Please tell us your name.");
          if (window.CloudAuth && CloudAuth.isDisposable(email)) return fail("Temporary email addresses aren't allowed — please use your real email (Gmail is perfect).");
          const r = signup(name, email, pass);
          if (r.err) return fail(r.err);
          if (window.CloudAuth) CloudAuth.collect({ name, email, provider: "email", page: location.pathname });
          close(); refreshAvatar(); unlockRefresh(); toast(`Welcome, ${name.split(" ")[0]}! Account created 🎉`);
        } else {
          const r = login(email, pass);
          if (r.err) return fail(r.err);
          const u = currentUser();
          if (window.CloudAuth) CloudAuth.collect({ name: u.name, email, provider: "email", page: location.pathname });
          close(); refreshAvatar(); unlockRefresh(); toast(`Welcome back, ${u.name.split(" ")[0]}! 👋`);
        }
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

    function renderProfile() {
      const u = currentUser();
      const memberSince = new Date(u.created).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
      const st = streak();
      ov.innerHTML = `
        <div class="auth-card" role="dialog" aria-modal="true" aria-label="Profile">
          <div class="sheet-handle"></div>
          <div style="display:flex;justify-content:flex-end"><button class="icon-btn" data-close-auth aria-label="Close">${I.close}</button></div>
          <div class="profile-hero">
            <span class="pf-ring"><span class="profile-avatar">${esc(u.name.trim()[0].toUpperCase())}</span></span>
            <div>
              <h2>${esc(u.name)}</h2>
              <p>${esc(u.email)} · since ${memberSince}</p>
              <span class="streak-pill">🔥 ${st} day${st === 1 ? "" : "s"} streak</span>
            </div>
          </div>
          <div class="p-stats">
            <div class="p-stat"><b>${savedList().length}</b><span>Saved</span></div>
            <div class="p-stat"><b>${likeCount()}</b><span>Likes</span></div>
            <div class="p-stat"><b>${totalCopiesMade()}</b><span>Copies</span></div>
          </div>
          <div class="p-actions">
            <a class="p-action" href="saved.html">${I.bookmark} My saved prompts <span class="right">${I.right}</span></a>
            <button class="p-action install" id="installAction" style="display:none">${I.download} Install app on this device <span class="right">${I.right}</span></button>
            <button class="p-action danger" id="logoutBtn">${I.logout} Log out</button>
          </div>
          <p class="auth-note">Everything stays free — new prompts drop every day. ✨</p>
        </div>`;
      $$("[data-close-auth]", ov).forEach((b) => b.addEventListener("click", close));
      ov.addEventListener("click", (e) => { if (e.target === ov) close(); });
      $("#logoutBtn", ov).addEventListener("click", () => {
        logout(); close(); refreshAvatar(); toast("Logged out. See you soon!");
      });
      const ia = $("#installAction", ov);
      if (window.__chitroInstall) {
        ia.style.display = "";
        ia.addEventListener("click", async () => { const f = window.__chitroInstall; window.__chitroInstall = null; f.prompt(); await f.userChoice; close(); });
      }
    }

    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-open-auth]")) {
        e.preventDefault();
        currentUser() ? (renderProfile(), ov.classList.add("open"), document.body.style.overflow = "hidden") : open();
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
          <span id="avatarHost">${avatarHTML()}</span>
        </div>
      </div>`;
    document.body.prepend(header);

    const bar = document.createElement("nav");
    bar.className = "bottombar";
    bar.setAttribute("aria-label", "Primary");
    bar.innerHTML = `
      <a href="index.html" class="${page === "home" ? "active" : ""}">${I.home}<span>Home</span></a>
      <a href="discover.html" class="${page === "discover" || page === "category" ? "active" : ""}">${I.grid}<span>Discover</span></a>
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
    return `
      <a class="card reveal ${opts.rank === 1 ? "rank-1" : ""}" href="template.html?id=${p.id}">
        <div class="card-img">${badge}<img src="${p.img}" alt="${esc(p.title)} — AI image prompt example" loading="lazy"></div>
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
        <div class="potd reveal">
          <a class="potd-img" href="template.html?id=${pd.id}"><img src="${pd.img}" alt="${esc(pd.title)}"></a>
          <div class="potd-body">
            <span class="potd-tag">✨ Prompt of the Day</span>
            <h3>${esc(pd.title)}</h3>
            <p>${esc(pd.tagline)}</p>
            <div class="potd-actions">
              <a class="btn" href="template.html?id=${pd.id}">View Prompt ${I.right}</a>
              <button class="copy-mini" id="potdCopy">${I.copy}<span>Copy</span></button>
            </div>
          </div>
        </div>`;
      $("#potdCopy").addEventListener("click", () => {
        copyText(pd.prompt, () => { bumpCopies(pd.id); toast("Prompt of the Day copied!"); $("#potdCopy span").textContent = "Copied!"; setTimeout(() => { const b = $("#potdCopy"); if (b) b.querySelector("span").textContent = "Copy"; }, 1500); });
      });
    }

    /* Top 3 podium */
    const top3 = [...PROMPTS].sort((a, b) => getUses(b) - getUses(a)).slice(0, 3);
    $("#top3").innerHTML = [
      cardHTML(top3[1], { rank: 2, copyIcon: true }),
      cardHTML(top3[0], { rank: 1, copyIcon: true }),
      cardHTML(top3[2], { rank: 3, copyIcon: true })
    ].join("");
    watchReveals($("#top3"));

    /* Recently viewed */
    const recent = store.get("recent", []).map(byId).filter(Boolean);
    const recSec = $("#recent");
    if (recSec && recent.length) {
      recSec.style.display = "";
      recSec.innerHTML = sectionHead("🕘", "Recently Viewed", recent, "saved.html") + `<div class="grid"></div>`;
      renderGrid($(".grid", recSec), recent.slice(0, 4));
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
      host.innerHTML = sectionHead(emoji, title, full, `category.html?c=${catId}`) + `<div class="grid"></div>`;
      renderGrid($(".grid", host), full.slice(0, max));
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
    const id = param("c") || "trending";
    const cat = CATEGORIES.find((c) => c.id === id);
    const list = getCat(id);
    $("#catTitle").innerHTML = `${cat ? cat.icon + " " : ""}${esc(cat ? cat.name : "Prompts")}`;
    $("#catDesc").textContent = cat ? cat.desc : "";
    document.title = `${cat ? cat.name : "Category"} — ${SITE.name}`;
    if (list.length) { renderGrid($("#catGrid"), list); $("#catEmpty").style.display = "none"; }
    else { $("#catGrid").innerHTML = ""; $("#catEmpty").style.display = ""; }
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
        <div class="detail-img reveal"><img src="${p.img}" alt="${esc(p.title)} — AI generated example image"></div>
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
              <div class="customizer" id="textTokens"></div>
              <div id="customizeHost"></div>
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
        <div class="grid" id="relatedGrid"></div>
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
      const data = { title: document.title, text: `${p.title} — free AI image prompt on ${SITE.name}`, url: location.href };
      if (navigator.share) { try { await navigator.share(data); } catch (e) {} }
      else copyText(location.href, () => toast("Link copied to clipboard"));
    });

    $("#waBtn").addEventListener("click", () => {
      const text = `${p.title} — free AI image prompt on ${SITE.name} 🎨 ${location.href}`;
      window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank", "noopener");
    });

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

  /* ---------- boot (idempotent) ---------- */
  let booted = false;
  function boot() {
    if (booted) return;
    booted = true;
    recordVisit();
    registerSW();
    const page = document.body.dataset.page || "home";
    buildChrome(page);
    const rerenderPage = () => ({ home: pageHome, discover: pageDiscover, category: pageCategory, template: pageTemplate, blog: pageBlog, article: pageArticle, saved: pageSaved }[page] || pageHome)();
    window.__chitroRerender = rerenderPage;
    rerenderPage();
    watchReveals();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();

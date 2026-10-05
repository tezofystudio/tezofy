/* ============================================================
   TEZOFY — Creator Profile engine (profile.js) · v1.0
   ------------------------------------------------------------
   Standalone page engine for profile.html. It does NOT require
   app.js and never modifies any other file's storage except the
   site-wide "chitro:*" keys it SHARES (session, users, avatar,
   cover, saved, likes, visits, theme) — same formats app.js uses.

   Public API (for future integrations):
     TezoProfile.coins.get() / .earn(n, why) / .spend(n, why) / .claim()
     TezoProfile.user()  ·  TezoProfile.open()
   ============================================================ */
(function () {
  "use strict";

  /* ---------- tiny helpers ---------- */
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
    });
  };
  var store = {
    get: function (k, f) { try { var v = JSON.parse(localStorage.getItem("chitro:" + k)); return v == null ? f : v; } catch (e) { return f; } },
    set: function (k, v) { try { localStorage.setItem("chitro:" + k, JSON.stringify(v)); } catch (e) {} }
  };
  function toast(msg) {
    var t = document.createElement("div");
    t.className = "tzp-toast";
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add("show"); });
    setTimeout(function () { t.classList.remove("show"); setTimeout(function () { t.remove(); }, 300); }, 2400);
  }
  function todayStr() { return new Date().toISOString().slice(0, 10); }
  function uid() { return "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

  /* ---------- profile data accessors (shared site keys) ---------- */
  function users() { return store.get("users", {}); }
  function session() { return store.get("session", null); }
  function currentUser() { var s = session(); return s ? (users()[s] || null) : null; }
  function avatarOf(email) { return store.get("avatar:" + email, ""); }
  function coverOf(email) { return store.get("cover:" + email, ""); }
  function bioOf(email) { return store.get("bio:" + email, ""); }
  function savedIds() { return store.get("saved", []); }
  function likeCount() { var l = store.get("likes", {}); return Object.keys(l).filter(function (k) { return l[k]; }).length; }
  function copiesMade() {
    var c = store.get("copies", null);
    if (typeof c === "number") return c;
    if (c && typeof c === "object") return Object.keys(c).length;
    return 0;
  }
  function streak() {
    var v = store.get("visits", []);
    if (!v.length) return 0;
    var n = 0, d = new Date(), DAY = 864e5;
    if (v[v.length - 1] !== todayStr()) d = new Date(d.getTime() - DAY);
    for (;;) {
      var s = d.toISOString().slice(0, 10);
      if (v.indexOf(s) >= 0) { n++; d = new Date(d.getTime() - DAY); } else break;
    }
    return n;
  }
  /* creations gallery (profile-owned key) */
  function creations() { return store.get("tz:creations", []); }
  function setCreations(list) { store.set("tz:creations", list.slice(0, 60)); }
  /* AI Generator's pinned images (read-only import) */
  function generatorSaved() {
    try { return JSON.parse(localStorage.getItem("tzai_saved") || "[]") || []; } catch (e) { return []; }
  }

  /* ---------- level system (same tiers & formula as the site) ---------- */
  var LEVEL_TIERS = [
    { name: "Rookie", icon: "🌱", min: 0, c: "#9ca3af" },
    { name: "Explorer", icon: "⚡", min: 15, c: "#5eead4" },
    { name: "Creator", icon: "🎨", min: 45, c: "#fbbf24" },
    { name: "Trendsetter", icon: "🔥", min: 100, c: "#fb7185" },
    { name: "Pro", icon: "💎", min: 200, c: "#7dd3fc" },
    { name: "Legend", icon: "👑", min: 400, c: "#ff2daa" }
  ];
  function levelInfo() {
    var score = savedIds().length * 2 + likeCount() * 2 + copiesMade() * 3 + streak() * 5 + creations().length * 4;
    var tier = LEVEL_TIERS[0], next = null;
    for (var i = 0; i < LEVEL_TIERS.length; i++) {
      if (score >= LEVEL_TIERS[i].min) tier = LEVEL_TIERS[i];
      else { next = LEVEL_TIERS[i]; break; }
    }
    var pct = next ? Math.min(100, Math.round(((score - tier.min) / (next.min - tier.min)) * 100)) : 100;
    return { tier: tier, next: next, score: score, pct: pct, toGo: next ? next.min - score : 0 };
  }

  /* ---------- coins (fair-use economy for profile AI tools) ---------- */
  var DAILY_CLAIM = 120, COST_COVER = 25, COST_AVATAR = 10, CAP_COVER = 10, CAP_AVATAR = 15;
  function coins() {
    var c = store.get("tz:coins", null);
    if (!c || c.day !== todayStr()) {
      c = { bal: c ? c.bal : 60, day: todayStr(), claimed: false, genCover: 0, genAvatar: 0, log: c ? (c.log || []) : [] };
      store.set("tz:coins", c);
    }
    return c;
  }
  function saveCoins(c) { store.set("tz:coins", c); }
  var Coins = {
    get: function () { return coins().bal; },
    claim: function () {
      var c = coins();
      if (c.claimed) return { ok: false, error: "Already claimed today — come back tomorrow!" };
      c.claimed = true; c.bal += DAILY_CLAIM;
      c.log.unshift({ t: "claim", n: DAILY_CLAIM, why: "Daily bonus", ts: Date.now() });
      saveCoins(c); return { ok: true, bal: c.bal };
    },
    earn: function (n, why) {
      var c = coins(); c.bal += Math.max(0, n | 0);
      c.log.unshift({ t: "earn", n: n, why: why || "Bonus", ts: Date.now() });
      saveCoins(c); renderCoinBits();
    },
    spend: function (n, why) {
      var c = coins();
      if (c.bal < n) return { ok: false, error: "Not enough coins — claim your daily bonus!" };
      c.bal -= n;
      c.log.unshift({ t: "spend", n: -n, why: why || "AI tool", ts: Date.now() });
      saveCoins(c); renderCoinBits(); return { ok: true, bal: c.bal };
    },
    canGenerate: function (kind) {
      var c = coins();
      if (kind === "cover") return c.genCover < CAP_COVER;
      if (kind === "avatar") return c.genAvatar < CAP_AVATAR;
      return true;
    },
    markGenerated: function (kind) {
      var c = coins();
      if (kind === "cover") c.genCover++;
      if (kind === "avatar") c.genAvatar++;
      saveCoins(c);
    }
  };
  function renderCoinBits() {
    var el = $("#tzpCoinBal");
    if (el) el.textContent = Coins.get();
    var chip = $("#tzpCoinChip");
    if (chip) chip.textContent = "🪙 " + Coins.get();
  }

  /* ---------- theme toggle (site pattern) ---------- */
  function bindTheme() {
    var b = $("#themeBtn");
    if (!b) return;
    function icon() {
      var t = document.documentElement.getAttribute("data-theme") || "dark";
      b.textContent = t === "dark" ? "☀️" : "🌙";
    }
    icon();
    b.addEventListener("click", function () {
      var next = (document.documentElement.getAttribute("data-theme") === "dark") ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem("chitro:theme", JSON.stringify(next)); } catch (e) {}
      icon();
    });
  }

  /* ---------- image helpers ---------- */
  function fileToDataURL(f) {
    return new Promise(function (res, rej) {
      var r = new FileReader();
      r.onload = function () { res(r.result); };
      r.onerror = rej;
      r.readAsDataURL(f);
    });
  }
  function shrinkDataURL(dataURI, maxW, maxH, quality) {
    return new Promise(function (res) {
      var img = new Image();
      img.onload = function () {
        try {
          var r = Math.min(maxW / img.width, maxH / img.height, 1);
          var cv = document.createElement("canvas");
          cv.width = Math.max(1, Math.round(img.width * r));
          cv.height = Math.max(1, Math.round(img.height * r));
          cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
          res(cv.toDataURL("image/jpeg", quality || 0.82));
        } catch (e) { res(dataURI); }
      };
      img.onerror = function () { res(dataURI); };
      img.src = dataURI;
    });
  }
  function urlToDataURL(url, maxW, maxH) {
    return fetch(url).then(function (r) { return r.blob(); })
      .then(function (b) { return fileToDataURL(b); })
      .then(function (d) { return shrinkDataURL(d, maxW, maxH, 0.82); });
  }
  function pollinations(prompt, w, h) {
    var seed = Math.floor(Math.random() * 999999999);
    return "https://image.pollinations.ai/prompt/" + encodeURIComponent(prompt) +
      "?width=" + w + "&height=" + h + "&seed=" + seed + "&nologo=true&safe=true";
  }

  /* ============================================================
     AUTH GATE (compact login / OTP signup — same flows as the site)
     ============================================================ */
  function renderGate() {
    var root = $("#profileRoot");
    root.innerHTML = '';
    var gate = document.createElement("div");
    gate.className = "tzp-gate";
    gate.innerHTML =
      '<div class="tzp-gate-card">' +
      '  <div class="tzp-gate-emoji">👑</div>' +
      '  <h1>Your Creator Profile</h1>' +
      '  <p class="tzp-muted">Design your profile photo &amp; cover with your own image, save &amp; share your AI creations, earn coins and level up.</p>' +
      '  <div class="tzp-tabs tzp-gate-tabs">' +
      '    <button class="tzp-tab on" data-g="login">Log In</button>' +
      '    <button class="tzp-tab" data-g="signup">Sign Up</button>' +
      '  </div>' +
      '  <div id="tzpGateForm"></div>' +
      '</div>';
    root.appendChild(gate);

    var mode = "login";
    function drawForm() {
      var host = $("#tzpGateForm", gate);
      host.innerHTML =
        (mode === "signup" ? '<label class="tzp-lab">Your name</label><input id="tzpGName" class="tzp-inp" maxlength="40" placeholder="e.g. Rahim Ahmed">' : "") +
        '<label class="tzp-lab">Email</label><input id="tzpGEmail" class="tzp-inp" type="email" placeholder="you@email.com">' +
        '<label class="tzp-lab">Password</label><input id="tzpGPass" class="tzp-inp" type="password" placeholder="••••••••">' +
        (mode === "signup" ? '<label class="tzp-lab">6-digit code (we email it)</label><input id="tzpGCode" class="tzp-inp" inputmode="numeric" maxlength="6" placeholder="123456"><button class="tzp-btn ghost" id="tzpGOtp">📧 Send my code</button>' : "") +
        '<button class="tzp-btn big" id="tzpGo">' + (mode === "login" ? "Log in →" : "✨ Create my profile") + '</button>' +
        '<p class="tzp-err" id="tzpGErr"></p>' +
        '<p class="tzp-muted small">Same account as the rest of TEZOFY — your saved prompts and level carry over.</p>';
      var otpBtn = $("#tzpGOtp", host);
      if (otpBtn) otpBtn.addEventListener("click", sendOtp);
      $("#tzpGo", host).addEventListener("click", submit);
    }
    function err(m) { var e = $("#tzpGErr"); if (e) e.textContent = m; }
    function sendOtp() {
      var email = ($("#tzpGEmail").value || "").trim().toLowerCase();
      var name = ($("#tzpGName").value || "").trim();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return err("Please enter a valid email.");
      if (!name) return err("Please enter your name first.");
      if (window.CloudAuth && CloudAuth.isDisposable && CloudAuth.isDisposable(email)) return err("Disposable emails are not allowed.");
      var b = $("#tzpGOtp"); b.disabled = true; b.textContent = "Sending…";
      CloudAuth.cmd({ action: "otp", kind: "signup", email: email, name: name }).then(function (res) {
        b.disabled = false; b.textContent = "📧 Re-send code";
        if (!res || !res.ok) return err((res && res.error) || "Could not send the code — try again.");
        err(""); toast("Code sent to " + email + " ✓");
      });
    }
    function submit() {
      var email = ($("#tzpGEmail").value || "").trim().toLowerCase();
      var pass = $("#tzpGPass").value || "";
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return err("Please enter a valid email.");
      if (pass.length < 6) return err("Password needs at least 6 characters.");
      var b = $("#tzpGo"); b.disabled = true;
      CloudAuth.hashPass(email, pass).then(function (ph) {
        if (mode === "login") {
          CloudAuth.cmd({ action: "login", email: email, ph: ph }).then(function (res) {
            if (!res || !res.ok) { b.disabled = false; return err((res && res.error) || "Login failed — try again."); }
            var list = users();
            if (!list[email]) list[email] = { name: (res.user && res.user.name) || email.split("@")[0], pass: ph, created: Date.now() };
            else list[email].pass = ph;
            store.set("users", list); store.set("session", email);
            toast("Welcome back! 👋"); renderProfile();
          });
        } else {
          var code = ($("#tzpGCode").value || "").trim();
          if (!/^\d{6}$/.test(code)) { b.disabled = false; return err("Enter the 6-digit code from your email."); }
          CloudAuth.cmd({ action: "otpverify", email: email, code: code }).then(function (res) {
            if (!res || !res.ok) { b.disabled = false; return err((res && res.error) || "Wrong code — try again."); }
            var name = ($("#tzpGName").value || "").trim() || email.split("@")[0];
            var list = users();
            if (!list[email]) list[email] = { name: name, pass: ph, created: Date.now() };
            store.set("users", list); store.set("session", email);
            toast("Profile created — welcome, " + name + "! 🎉");
            Coins.earn(30, "Welcome bonus");
            renderProfile();
          });
        }
      });
    }
    $$(".tzp-tab", gate).forEach(function (t) {
      t.addEventListener("click", function () {
        mode = t.getAttribute("data-g");
        $$(".tzp-tab", gate).forEach(function (x) { x.classList.toggle("on", x === t); });
        drawForm();
      });
    });
    drawForm();
  }

  /* ============================================================
     PROFILE
     ============================================================ */
  var TAB = "overview";
  function renderProfile() {
    var u = currentUser();
    if (!u) { renderGate(); return; }
    var email = session();
    var lv = levelInfo();
    var root = $("#profileRoot");
    var memberSince = u.created ? new Date(u.created).toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : "";
    root.innerHTML =
      '<section class="tzp-hero">' +
      '  <div class="tzp-cover" id="tzpCover">' + (coverOf(email) ? '<img src="' + esc(coverOf(email)) + '" alt="">' : '<div class="tzp-cover-ph">✨</div>') + '</div>' +
      '  <button class="tzp-fab" id="tzpCoverBtn" title="Design cover">🖼️</button>' +
      '  <div class="tzp-head">' +
      '    <div class="tzp-ava-wrap">' +
      '      <div class="tzp-ava" id="tzpAva">' + (avatarOf(email) ? '<img src="' + esc(avatarOf(email)) + '" alt="">' : '<span>' + esc((u.name || "T").trim().charAt(0).toUpperCase()) + "</span>") + "</div>" +
      '      <span class="tzp-ring" style="border-color:' + lv.tier.c + '"></span>' +
      '      <button class="tzp-ava-edit" id="tzpAvaBtn" title="Profile photo studio">📷</button>' +
      "    </div>" +
      '    <div class="tzp-id">' +
      '      <h1>' + esc(u.name || "Creator") + ' <span class="tzp-tier" style="background:' + lv.tier.c + '22;color:' + lv.tier.c + ';border-color:' + lv.tier.c + '55">' + lv.tier.icon + " " + esc(lv.tier.name) + "</span></h1>" +
      '      <p class="tzp-muted">' + esc(email) + (memberSince ? ' · <span>member since ' + memberSince + "</span>" : "") + ' · 🔥 ' + streak() + "-day streak</p>" +
      '      <p class="tzp-bio" id="tzpBio">' + (bioOf(email) ? esc(bioOf(email)) : '<span class="tzp-muted">Add a short bio in Settings →</span>') + "</p>" +
      "    </div>" +
      '    <div class="tzp-head-side">' +
      '      <div class="tzp-coin-chip" id="tzpCoinChip">🪙 ' + Coins.get() + "</div>" +
      '      <button class="tzp-btn" id="tzpShareCard">🔗 Share card</button>' +
      "    </div>" +
      "  </div>" +
      '  <div class="tzp-stats">' +
      '    <div class="tzp-stat"><b>' + creations().length + "</b><span>Creations</span></div>" +
      '    <div class="tzp-stat"><b>' + savedIds().length + "</b><span>Saved</span></div>" +
      '    <div class="tzp-stat"><b>' + likeCount() + "</b><span>Likes</span></div>" +
      '    <div class="tzp-stat"><b>' + copiesMade() + "</b><span>Copies</span></div>" +
      '    <div class="tzp-stat"><b>' + lv.score + "</b><span>Points</span></div>" +
      "  </div>" +
      '  <div class="tzp-lvlbar"><i style="width:' + lv.pct + '%;background:' + lv.tier.c + '"></i></div>' +
      '  <p class="tzp-muted small">' + (lv.next ? lv.toGo + " pts to " + lv.next.icon + " " + lv.next.name : "🏆 Max level — Legend!") + "</p>" +
      "</section>" +

      '<nav class="tzp-tabs">' +
      '  <button class="tzp-tab' + (TAB === "overview" ? " on" : "") + '" data-t="overview">🏠 Overview</button>' +
      '  <button class="tzp-tab' + (TAB === "creations" ? " on" : "") + '" data-t="creations">🖼️ Creations</button>' +
      '  <button class="tzp-tab' + (TAB === "saved" ? " on" : "") + '" data-t="saved">🔖 Saved</button>' +
      '  <button class="tzp-tab' + (TAB === "coins" ? " on" : "") + '" data-t="coins">🪙 Coins</button>' +
      '  <button class="tzp-tab' + (TAB === "settings" ? " on" : "") + '" data-t="settings">⚙️ Settings</button>' +
      "</nav>" +
      '<section id="tzpBody"></section>';

    $("#tzpCoverBtn").addEventListener("click", openCoverStudio);
    $("#tzpAvaBtn").addEventListener("click", openAvatarStudio);
    $("#tzpShareCard").addEventListener("click", shareCard);
    $$(".tzp-tab[data-t]", root).forEach(function (t) {
      t.addEventListener("click", function () { TAB = t.getAttribute("data-t"); renderProfile(); });
    });
    renderTab();
  }

  function renderTab() {
    var host = $("#tzpBody");
    if (!host) return;
    if (TAB === "overview") renderOverview(host);
    else if (TAB === "creations") renderCreations(host);
    else if (TAB === "saved") renderSaved(host);
    else if (TAB === "coins") renderCoinsTab(host);
    else renderSettings(host);
  }

  /* ---------- overview ---------- */
  function renderOverview(host) {
    var lv = levelInfo();
    var rec = store.get("recent", []).slice(0, 8);
    var known = (typeof PROMPTS !== "undefined") ? PROMPTS : [];
    var cards =
      '<div class="tzp-grid3">' +
      '  <a class="tzp-q" href="#" id="tzpQAva"><b>📷 Photo Studio</b><span>Design your profile photo with your own image — face-locked AI prompts</span></a>' +
      '  <a class="tzp-q" href="#" id="tzpQCover"><b>🖼️ Cover Studio</b><span>Generate a designer cover banner in one tap</span></a>' +
      '  <a class="tzp-q" href="#" id="tzpQAdd"><b>➕ Add Creation</b><span>Save an AI image you made — upload or paste a link</span></a>' +
      '  <a class="tzp-q" href="ai-generator.html"><b>✨ AI Generator</b><span>Text → AI image (pinned images appear here too)</span></a>' +
      '  <a class="tzp-q" href="saved.html"><b>🔖 Saved Prompts</b><span>Your full saved library</span></a>' +
      '  <a class="tzp-q" href="#" id="tzpQCoins"><b>🪙 Coin Wallet</b><span>Claim your daily bonus &amp; see earn rules</span></a>' +
      "</div>" +
      '<h3 class="tzp-h3">📊 Your progress</h3>' +
      '<div class="tzp-grid3">' +
      '  <div class="tzp-card"><b style="color:' + lv.tier.c + '">' + lv.tier.icon + " " + esc(lv.tier.name) + '</b><span>' + lv.score + " pts · " + lv.pct + "% to next</span></div>" +
      '  <div class="tzp-card"><b>🔥 ' + streak() + "</b><span>day streak — visit daily to grow it</span></div>" +
      '  <div class="tzp-card"><b>🪙 ' + Coins.get() + "</b><span>coins · daily claim +120</span></div>" +
      "</div>";
    if (rec.length && known.length) {
      cards += '<h3 class="tzp-h3">🕘 Recently viewed</h3><div class="tzp-rec">';
      rec.forEach(function (id) {
        var p = known.filter(function (x) { return x.id === id; })[0];
        if (p) cards += '<a class="tzp-rec-chip" href="template.html?id=' + encodeURIComponent(p.id) + '"><img src="' + esc(p.img) + '" alt=""><span>' + esc(p.title) + "</span></a>";
      });
      cards += "</div>";
    }
    host.innerHTML = cards;
    $("#tzpQAva").addEventListener("click", function (e) { e.preventDefault(); openAvatarStudio(); });
    $("#tzpQCover").addEventListener("click", function (e) { e.preventDefault(); openCoverStudio(); });
    $("#tzpQAdd").addEventListener("click", function (e) { e.preventDefault(); openAddCreation(); });
    $("#tzpQCoins").addEventListener("click", function (e) { e.preventDefault(); TAB = "coins"; renderProfile(); });
  }

  /* ---------- creations ---------- */
  function creationCard(c, imported) {
    return '<figure class="tzp-cre" data-id="' + esc(c.id) + '">' +
      '  <img src="' + esc(c.src) + '" alt="' + esc(c.title) + '" loading="lazy">' +
      '  <figcaption><b>' + esc(c.title) + "</b>" +
      "    <span>" + (c.prompt ? "has prompt · " : "") + (imported ? "from AI Generator" : (c.topic ? "topic: " + esc(c.topic) : "upload")) + "</span>" +
      '    <div class="tzp-cre-acts">' +
      '      <button data-act="view" title="View">👁</button>' +
      '      <button data-act="share" title="Share">🔗</button>' +
      '      <button data-act="dl" title="Download">⬇</button>' +
      (imported ? "" : '<button data-act="del" title="Delete">🗑</button>') +
      "    </div>" +
      "  </figcaption>" +
      "</figure>";
  }
  function renderCreations(host) {
    var mine = creations();
    var imp = generatorSaved().filter(function (x) { return x && x.url; }).map(function (x) {
      return { id: "gen-" + x.url.slice(-24), src: x.url, title: x.prompt ? String(x.prompt).slice(0, 46) + "…" : "AI Generator image", prompt: x.prompt, topic: "", ts: 0 };
    });
    var html =
      '<div class="tzp-row"><h3 class="tzp-h3" style="margin:0">🖼️ My creations <span class="tzp-muted">(' + mine.length + ")</span></h3>" +
      '<button class="tzp-btn" id="tzpAddCre">➕ Add creation</button></div>';
    if (mine.length) {
      html += '<div class="tzp-gallery">' + mine.map(function (c) { return creationCard(c, false); }).join("") + "</div>";
    } else {
      html += '<div class="tzp-empty"><div>🎨</div><p>No creations yet.</p><p class="tzp-muted small">Generate an image in the <a href="ai-generator.html">AI Generator</a> or add one below.</p></div>';
    }
    if (imp.length) {
      html += '<div class="tzp-row"><h3 class="tzp-h3" style="margin:0">📌 Pinned in AI Generator <span class="tzp-muted">(' + imp.length + ")</span></h3></div>" +
        '<div class="tzp-gallery">' + imp.map(function (c) { return creationCard(c, true); }).join("") + "</div>";
    }
    host.innerHTML = html;
    $("#tzpAddCre").addEventListener("click", openAddCreation);
    $$(".tzp-cre", host).forEach(function (fig) {
      var id = fig.getAttribute("data-id");
      var all = creations().concat(generatorSaved().filter(function (x) { return x && x.url; }).map(function (x) {
        return { id: "gen-" + x.url.slice(-24), src: x.url, title: "AI Generator image", prompt: x.prompt, topic: "" };
      }));
      var item = all.filter(function (c) { return c.id === id; })[0];
      if (!item) return;
      $$(".tzp-cre-acts button", fig).forEach(function (b) {
        b.addEventListener("click", function () {
          var act = b.getAttribute("data-act");
          if (act === "view") lightbox(item);
          else if (act === "share") shareCreation(item);
          else if (act === "dl") downloadSrc(item.src, item.title);
          else if (act === "del") {
            setCreations(creations().filter(function (c) { return c.id !== id; }));
            toast("Deleted."); renderProfile();
          }
        });
      });
    });
  }

  function openAddCreation() {
    var email = session();
    overlay(
      '<h3>➕ Add a creation</h3>' +
      '<label class="tzp-lab">Title</label><input id="tzpCrT" class="tzp-inp" maxlength="60" placeholder="e.g. My Diwali avatar">' +
      '<label class="tzp-lab">Image — upload a file</label><input id="tzpCrF" class="tzp-inp" type="file" accept="image/*">' +
      '<label class="tzp-lab">…or paste an image URL</label><input id="tzpCrU" class="tzp-inp" placeholder="https://…">' +
      '<label class="tzp-lab">The prompt you used (optional)</label><textarea id="tzpCrP" class="tzp-inp" rows="3" placeholder="Paste the AI prompt here…"></textarea>' +
      '<label class="tzp-lab">Topic (optional)</label><select id="tzpCrTp" class="tzp-inp"><option value="">— none —</option>' +
      ((typeof TOPICS !== "undefined" ? TOPICS : []).map(function (t) { return '<option value="' + esc(t.id) + '">' + esc(t.icon + " " + t.name) + "</option>"; }).join("")) +
      "</select>" +
      '<button class="tzp-btn big" id="tzpCrSave">💾 Save to my gallery</button><p class="tzp-err" id="tzpCrE"></p>',
      function (ov, close) {
        $("#tzpCrSave", ov).addEventListener("click", function () {
          var title = ($("#tzpCrT").value || "").trim() || "Untitled creation";
          var url = ($("#tzpCrU").value || "").trim();
          var f = ($("#tzpCrF").files || [])[0] || null;
          var prompt = $("#tzpCrP").value || "";
          var topic = $("#tzpCrTp").value || "";
          function save(src) {
            var list = creations();
            list.unshift({ id: uid(), src: src, title: title, prompt: prompt, topic: topic, ts: Date.now(), via: f ? "upload" : "url" });
            setCreations(list);
            Coins.earn(10, "Added a creation");
            close(); toast("Saved to your gallery ✓"); TAB = "creations"; renderProfile();
          }
          if (f) { fileToDataURL(f).then(function (d) { return shrinkDataURL(d, 900, 900, 0.82); }).then(save); }
          else if (/^https?:\/\/.+/.test(url)) { save(url); }
          else { $("#tzpCrE").textContent = "Upload a file or paste an image URL."; }
        });
      }
    );
  }

  /* ---------- saved ---------- */
  function renderSaved(host) {
    var ids = savedIds();
    var known = (typeof PROMPTS !== "undefined") ? PROMPTS : [];
    var items = ids.map(function (id) { return known.filter(function (p) { return p.id === id; })[0]; }).filter(Boolean);
    var unresolved = ids.length - items.length;
    var html = '<div class="tzp-row"><h3 class="tzp-h3" style="margin:0">🔖 Saved prompts <span class="tzp-muted">(' + ids.length + ")</span></h3>" +
      '<a class="tzp-btn" href="saved.html">Open full library →</a></div>';
    if (items.length) {
      html += '<div class="tzp-gallery">';
      items.forEach(function (p) {
        html += '<figure class="tzp-cre"><a href="template.html?id=' + encodeURIComponent(p.id) + '"><img src="' + esc(p.img) + '" alt="' + esc(p.title) + '" loading="lazy"></a>' +
          "<figcaption><b>" + esc(p.title) + "</b><span>saved prompt</span></figcaption></figure>";
      });
      html += "</div>";
    }
    if (unresolved > 0) html += '<p class="tzp-muted small">+' + unresolved + ' live-library prompts — <a href="saved.html">view them all in Saved →</a></p>';
    if (!ids.length) html += '<div class="tzp-empty"><div>🔖</div><p>Nothing saved yet.</p><p class="tzp-muted small">Tap the bookmark on any prompt to save it here.</p></div>';
    host.innerHTML = html;
  }

  /* ---------- coins tab ---------- */
  function renderCoinsTab(host) {
    var c = coins();
    var rules = [
      ["📅 Daily claim", "+" + DAILY_CLAIM, "once per day, free"],
      ["🎨 Add a creation", "+10", "each saved creation"],
      ["👋 Welcome bonus", "+30", "new profiles"],
      ["🖼️ Cover Studio", "−" + COST_COVER, "per generated cover (max " + CAP_COVER + "/day)"],
      ["📷 Photo Studio", "−" + COST_AVATAR, "per styled prompt (max " + CAP_AVATAR + "/day)"]
    ];
    var log = (c.log || []).slice(0, 12).map(function (l) {
      var d = new Date(l.ts).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
      return '<div class="tzp-log"><span>' + esc(l.why) + "</span><b>" + (l.n > 0 ? "+" : "") + l.n + " 🪙</b><i>" + d + "</i></div>";
    }).join("");
    host.innerHTML =
      '<div class="tzp-coin-hero"><div><small>Your balance</small><b id="tzpCoinBal">' + c.bal + "</b><span>coins</span></div>" +
      '<button class="tzp-btn big" id="tzpClaim">' + (c.claimed ? "✅ Claimed today" : "🎁 Claim daily +" + DAILY_CLAIM) + "</button></div>" +
      '<h3 class="tzp-h3">How coins work</h3><div class="tzp-rules">' +
      rules.map(function (r) { return '<div class="tzp-rule"><span>' + r[0] + "</span><b>" + r[1] + "</b><i>" + r[2] + "</i></div>"; }).join("") + "</div>" +
      '<h3 class="tzp-h3">Recent activity</h3>' + (log || '<p class="tzp-muted small">No activity yet.</p>');
    var btn = $("#tzpClaim");
    btn.disabled = c.claimed;
    btn.addEventListener("click", function () {
      var r = Coins.claim();
      if (!r.ok) return toast(r.error);
      toast("+" + DAILY_CLAIM + " coins claimed! 🪙"); renderProfile();
    });
  }

  /* ---------- settings ---------- */
  function renderSettings(host) {
    var u = currentUser(), email = session();
    host.innerHTML =
      '<h3 class="tzp-h3">⚙️ Profile settings</h3>' +
      '<div class="tzp-set">' +
      '  <label class="tzp-lab">Display name</label><input id="tzpSName" class="tzp-inp" maxlength="40" value="' + esc(u.name || "") + '">' +
      '  <label class="tzp-lab">Bio</label><textarea id="tzpSBio" class="tzp-inp" rows="2" maxlength="140" placeholder="Tell visitors what you create…">' + esc(bioOf(email)) + "</textarea>" +
      '  <div class="tzp-row"><button class="tzp-btn" id="tzpSSave">💾 Save</button>' +
      '  <button class="tzp-btn ghost" id="tzpSAvaUpl">📷 Upload profile photo</button>' +
      '  <button class="tzp-btn ghost" id="tzpSCovUpl">🖼️ Upload cover</button></div>' +
      '  <input type="file" id="tzpSFile" accept="image/*" hidden>' +
      "</div>" +
      '<h3 class="tzp-h3">📦 Your data</h3>' +
      '<div class="tzp-row"><button class="tzp-btn ghost" id="tzpExport">⬇ Export my data (JSON)</button>' +
      '<button class="tzp-btn danger" id="tzpLogout">🚪 Log out</button></div>' +
      '<p class="tzp-muted small">Your profile lives on this device (same as the rest of TEZOFY) and never blocks any site feature.</p>';
    $("#tzpSSave").addEventListener("click", function () {
      var list = users();
      var nm = ($("#tzpSName").value || "").trim();
      if (nm && list[email]) { list[email].name = nm; store.set("users", list); }
      store.set("bio:" + email, ($("#tzpSBio").value || "").trim().slice(0, 140));
      toast("Saved ✓"); renderProfile();
    });
    var filePick = null;
    $("#tzpSAvaUpl").addEventListener("click", function () { filePick = "avatar"; $("#tzpSFile").click(); });
    $("#tzpSCovUpl").addEventListener("click", function () { filePick = "cover"; $("#tzpSFile").click(); });
    $("#tzpSFile").addEventListener("change", function () {
      var f = this.files && this.files[0];
      if (!f || !filePick) return;
      fileToDataURL(f).then(function (d) {
        return filePick === "avatar" ? shrinkDataURL(d, 320, 320, 0.85) : shrinkDataURL(d, 1200, 400, 0.82);
      }).then(function (d) {
        store.set((filePick === "avatar" ? "avatar:" : "cover:") + session(), d);
        toast("Updated ✓"); renderProfile();
      });
    });
    $("#tzpExport").addEventListener("click", function () {
      var email2 = session();
      var data = { name: currentUser().name, email: email2, bio: bioOf(email2), saved: savedIds(), creations: creations(), coins: coins(), exported: new Date().toISOString() };
      var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "tezofy-profile.json";
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
    });
    $("#tzpLogout").addEventListener("click", function () {
      store.set("session", null);
      toast("Logged out. See you soon!"); renderGate();
    });
  }

  /* ============================================================
     STUDIOS
     ============================================================ */
  var COVER_PRESETS = [
    { n: "Royal Gold Dynasty", p: "Luxurious royal banner, ornate golden Mughal arches, maroon velvet texture, intricate gold filigree patterns, soft glowing lanterns, cinematic lighting, elegant wide composition, ultra detailed, 8k" },
    { n: "Neon Dhaka Night", p: "Cyberpunk Dhaka skyline at night, glowing neon signs in Bengali style curves, rickshaw light trails, purple and magenta neon reflections on wet streets, cinematic wide banner, ultra detailed, 8k" },
    { n: "Monsoon Romance", p: "Dreamy monsoon banner, soft rain over a tea garden, misty green hills, warm golden bokeh lights, water droplets on leaves, moody cinematic wide shot, ultra detailed, 8k" },
    { n: "Marigold Festival", p: "Vibrant festival banner with marigold garlands, glowing clay diya lamps, warm orange and gold bokeh, festive bokeh lights, rich celebration mood, cinematic wide composition, 8k" },
    { n: "Rose Gold Studio", p: "Elegant studio banner, soft rose-gold gradient silk waves, floating golden particles, gentle spotlight beams, luxury minimal aesthetic, ultra detailed, 8k" },
    { n: "Midnight Galaxy", p: "Deep space banner, purple and blue nebula clouds, sparkling stars, subtle golden constellation lines, dreamy cosmic atmosphere, cinematic wide shot, 8k" },
    { n: "Crimemovie Poster", p: "Dramatic movie-poster banner, dark smoky backdrop with bold crimson spotlight beams, film-noir mood, light rays through haze, cinematic composition, 8k" },
    { n: "Pastel Bloom", p: "Soft pastel banner, blooming cherry blossom branches on cream gradient, delicate petals floating, airy dreamy light, kawaii aesthetic, ultra detailed, 8k" },
    { n: "Emerald Royale", p: "Regal emerald green banner with golden paisley patterns, luxurious fabric folds, subtle jewel sparkles, royal Indian palace aesthetic, cinematic lighting, 8k" },
    { n: "Retro VHS Grid", p: "80s retro synthwave banner, glowing grid horizon, sunset gradient, chrome text vibe, VHS scanlines, neon pink and cyan, nostalgic cinematic, 8k" },
    { n: "Ocean Pearl", p: "Serene ocean banner at golden hour, gentle turquoise waves, pearl-white foam swirls, soft sun sparkle on water, calm cinematic wide shot, 8k" },
    { n: "Café Aesthetic", p: "Cozy café banner, warm fairy lights, steaming cup of chai on wooden table, open notebook, soft bokeh, hygge mood, cinematic depth, 8k" }
  ];
  function openCoverStudio() {
    var email = session();
    overlay(
      '<h3>🖼️ Cover Studio</h3>' +
      '<p class="tzp-muted small">Pick a designer style — AI paints a unique banner for your profile. Costs ' + COST_COVER + " 🪙 · max " + CAP_COVER + "/day.</p>" +
      '<div class="tzp-presets">' + COVER_PRESETS.map(function (c, i) {
        return '<button class="tzp-preset" data-i="' + i + '"><b>' + esc(c.n) + "</b></button>";
      }).join("") + "</div>" +
      '<div class="tzp-stage" id="tzpCovStage"><p class="tzp-muted small">Choose a style to start…</p></div>' +
      '<div class="tzp-row"><button class="tzp-btn big" id="tzpCovSet" disabled>✓ Set as my cover</button>' +
      '<button class="tzp-btn ghost" id="tzpCovUp">📁 Upload my own image</button>' +
      '<input type="file" id="tzpCovFile" accept="image/*" hidden></div>' +
      '<p class="tzp-err" id="tzpCovE"></p>',
      function (ov, close) {
        var got = "";
        function tryGenerate(idx) {
          if (!Coins.canGenerate("cover")) { $("#tzpCovE", ov).textContent = "Daily cover limit reached (" + CAP_COVER + ")."; return; }
          var pay = Coins.spend(COST_COVER, "Cover Studio");
          if (!pay.ok) { $("#tzpCovE", ov).textContent = pay.error; return; }
          Coins.markGenerated("cover");
          $("#tzpCovE", ov).textContent = "";
          $("#tzpCovStage", ov).innerHTML = '<div class="tzp-loading"><div class="tzp-spin"></div><p>AI is painting your cover…<br><small>usually 15–45 seconds</small></p></div>';
          var url = pollinations(COVER_PRESETS[idx].p, 1200, 400);
          var img = new Image();
          var t = setTimeout(function () { img.src = ""; $("#tzpCovStage", ov).innerHTML = '<p class="tzp-err">Timed out — try again.</p>'; }, 90000);
          img.onload = function () {
            clearTimeout(t);
            $("#tzpCovStage", ov).innerHTML = "";
            $("#tzpCovStage", ov).appendChild(img);
            $("#tzpCovSet", ov).disabled = false;
            urlToDataURL(url, 1200, 400).then(function (d) { got = d; }).catch(function () { got = url; });
          };
          img.onerror = function () { clearTimeout(t); $("#tzpCovStage", ov).innerHTML = '<p class="tzp-err">Could not reach the image AI — try again.</p>'; };
          img.style.width = "100%"; img.style.borderRadius = "14px";
          img.src = url;
        }
        $$(".tzp-preset", ov).forEach(function (b) {
          b.addEventListener("click", function () { tryGenerate(+b.getAttribute("data-i")); });
        });
        $("#tzpCovUp", ov).addEventListener("click", function () { $("#tzpCovFile", ov).click(); });
        $("#tzpCovFile", ov).addEventListener("change", function () {
          var f = this.files && this.files[0];
          if (!f) return;
          var r = new FileReader();
          r.onload = function () {
            shrinkDataURL(r.result, 1200, 400, 0.82).then(function (d) {
              got = d;
              $("#tzpCovStage", ov).innerHTML = '<img src="' + d + '" style="width:100%;border-radius:14px">';
              $("#tzpCovSet", ov).disabled = false;
            });
          };
          r.readAsDataURL(f);
        });
        $("#tzpCovSet", ov).addEventListener("click", function () {
          if (!got) return;
          store.set("cover:" + email, got);
          var list = creations();
          list.unshift({ id: uid(), src: got, title: "Profile cover — " + new Date().toLocaleDateString("en-GB"), prompt: "", topic: "", ts: Date.now(), via: "cover-studio" });
          setCreations(list);
          close(); toast("Cover updated ✓"); renderProfile();
        });
      }
    );
  }

  var AVA_PRESETS = [
    { n: "👑 Royal Portrait", p: "Royal palace portrait of the person from the uploaded reference photo, wearing an embroidered velvet sherwani with a jeweled crown, golden throne room, dramatic rim lighting, 85mm portrait lens" },
    { n: "⚡ Neon Edge", p: "Cyberpunk profile picture of the person from the uploaded reference photo, glowing neon rim light in magenta and cyan, dark city bokeh, futuristic jacket, cinematic contrast" },
    { n: "🪔 Festival Glow", p: "Festive profile picture of the person from the uploaded reference photo, warm marigold and diya bokeh, traditional [OUTFIT] for the celebration, golden hour glow" },
    { n: "🎬 Cinematic Poster", p: "Movie-poster style profile shot of the person from the uploaded reference photo, moody spotlight, film grain, dramatic shadows, blockbuster key art composition" },
    { n: "💼 Corporate Pro", p: "LinkedIn-ready professional headshot of the person from the uploaded reference photo, navy suit, clean studio backdrop, soft key light, confident smile" },
    { n: "🌸 Anime Style", p: "Anime-style illustration of the person from the uploaded reference photo, keeping the same hairstyle and features, cel shading, sparkling eyes, pastel background" },
    { n: "🧊 3D Figurine", p: "Cute 3D collectible figurine of the person from the uploaded reference photo on a rounded base, Pixar-style render, studio lighting, pastel backdrop" },
    { n: "📸 Retro Film", p: "Retro 90s film-camera profile picture of the person from the uploaded reference photo, analog grain, faded warm tones, vintage portrait studio backdrop" },
    { n: "🐉 Fantasy Hero", p: "Epic fantasy hero portrait of the person from the uploaded reference photo, ornate armor, glowing runes, misty mountains behind, dramatic god rays" },
    { n: "⚽ Sports Attitude", p: "Sports-magazine cover shot of the person from the uploaded reference photo, [TEAM COLOR] jersey, stadium floodlights, sweat and determination, dynamic angle" }
  ];
  var FACE_LOCK = "same face as the uploaded reference image — identical facial structure, skin tone, age and identity. Do not beautify, slim, lighten or alter the facial features in any way; the person must remain instantly recognizable. Strictly no face distortion, no different person, no extra fingers.";
  function openAvatarStudio() {
    var email = session();
    overlay(
      '<h3>📷 Profile Photo Studio</h3>' +
      '<p class="tzp-muted small">Step 1 — upload your own photo (it stays on your device). Step 2 — pick a style, copy the face-locked prompt and run it in Gemini / ChatGPT with your photo. Costs ' + COST_AVATAR + " 🪙 per prompt.</p>" +
      '<div class="tzp-ava-stage"><div class="tzp-ava-big" id="tzpAvPrev"><span>👤</span></div>' +
      '<div><button class="tzp-btn" id="tzpAvUp">📤 Upload my photo</button><input type="file" id="tzpAvFile" accept="image/*" hidden>' +
      '<p class="tzp-muted small" id="tzpAvNote">JPG/PNG · cropped to a circle</p></div></div>' +
      '<div class="tzp-presets">' + AVA_PRESETS.map(function (a, i) {
        return '<button class="tzp-preset" data-i="' + i + '"><b>' + esc(a.n) + "</b></button>";
      }).join("") + "</div>" +
      '<textarea id="tzpAvOut" class="tzp-inp" rows="5" readonly placeholder="Your face-locked prompt appears here…"></textarea>' +
      '<div class="tzp-row"><button class="tzp-btn big" id="tzpAvCopy">📋 Copy prompt</button>' +
      '<a class="tzp-btn ghost" href="https://gemini.google.com/app" target="_blank" rel="noopener">🚀 Open Gemini</a>' +
      '<button class="tzp-btn ghost" id="tzpAvSet">✓ Set preview as photo</button></div>' +
      '<p class="tzp-err" id="tzpAvE"></p>',
      function (ov, close) {
        var photo = "";
        $("#tzpAvUp", ov).addEventListener("click", function () { $("#tzpAvFile", ov).click(); });
        $("#tzpAvFile", ov).addEventListener("change", function () {
          var f = this.files && this.files[0];
          if (!f) return;
          var r = new FileReader();
          r.onload = function () {
            shrinkDataURL(r.result, 320, 320, 0.85).then(function (d) {
              photo = d;
              $("#tzpAvPrev", ov).innerHTML = '<img src="' + d + '" alt="">';
              $("#tzpAvNote", ov).textContent = "Photo ready ✓ now pick a style";
            });
          };
          r.readAsDataURL(f);
        });
        $$(".tzp-preset", ov).forEach(function (b) {
          b.addEventListener("click", function () {
            if (!Coins.canGenerate("avatar")) { $("#tzpAvE", ov).textContent = "Daily limit reached (" + CAP_AVATAR + ")."; return; }
            var pay = Coins.spend(COST_AVATAR, "Photo Studio");
            if (!pay.ok) { $("#tzpAvE", ov).textContent = pay.error; return; }
            Coins.markGenerated("avatar");
            $("#tzpAvE", ov).textContent = "";
            var pr = AVA_PRESETS[+b.getAttribute("data-i")];
            $("#tzpAvOut", ov).value = "Profile picture of a South Asian creator, " + pr.p + ". " + FACE_LOCK;
          });
        });
        $("#tzpAvCopy", ov).addEventListener("click", function () {
          var v = $("#tzpAvOut", ov).value;
          if (!v) { $("#tzpAvE", ov).textContent = "Pick a style first."; return; }
          copyText(v).then(function () { toast("Prompt copied — now paste it in Gemini with your photo ✓"); });
        });
        $("#tzpAvSet", ov).addEventListener("click", function () {
          if (!photo) { $("#tzpAvE", ov).textContent = "Upload your photo first."; return; }
          store.set("avatar:" + email, photo);
          close(); toast("Profile photo updated ✓"); renderProfile();
        });
      }
    );
  }

  /* ---------- lightbox + share ---------- */
  function lightbox(item) {
    overlay('<div class="tzp-lb"><img src="' + esc(item.src) + '" alt=""><h3>' + esc(item.title) + "</h3>" +
      (item.prompt ? '<p class="tzp-muted small">' + esc(item.prompt) + "</p>" : "") + "</div>", function () {});
  }
  function shareCreation(item) {
    var text = item.title + " — made with TEZOFY AI prompts 🎨";
    if (navigator.share) {
      navigator.share({ title: item.title, text: text, url: location.origin + "/index.html" }).catch(function () {});
    } else {
      copyText(text + "\n" + location.origin).then(function () { toast("Copied — paste anywhere to share ✓"); });
    }
  }
  function downloadSrc(src, name) {
    var a = document.createElement("a");
    a.href = src;
    a.download = (name || "tezofy-creation").replace(/[^\w\-]+/g, "-").slice(0, 40) + ".jpg";
    a.click();
  }
  function copyText(t) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(t);
    return new Promise(function (res) {
      var ta = document.createElement("textarea");
      ta.value = t; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (e) {}
      ta.remove(); res();
    });
  }
  function shareCard() {
    var u = currentUser(), email = session();
    var lv = levelInfo();
    var cv = document.createElement("canvas");
    cv.width = 1200; cv.height = 630;
    var x = null;
    try { x = cv.getContext("2d"); } catch (e) { x = null; }
    if (!x) { toast("This browser cannot render the share card."); return; }
    var g = x.createLinearGradient(0, 0, 1200, 630);
    g.addColorStop(0, "#1a1030"); g.addColorStop(1, "#33122e");
    x.fillStyle = g; x.fillRect(0, 0, 1200, 630);
    x.strokeStyle = "rgba(255,45,170,.5)"; x.lineWidth = 3; x.strokeRect(14, 14, 1172, 602);
    var ava = avatarOf(email);
    function finish() {
      x.fillStyle = "#fff"; x.font = "800 64px Arial,sans-serif";
      x.fillText((u.name || "Creator").slice(0, 22), 320, 210);
      x.fillStyle = lv.tier.c; x.font = "700 34px Arial,sans-serif";
      x.fillText(lv.tier.icon + " " + lv.tier.name + " · " + lv.score + " pts", 320, 262);
      x.fillStyle = "rgba(255,255,255,.85)"; x.font = "400 30px Arial,sans-serif";
      var stats = [creations().length + " creations", savedIds().length + " saved", "🔥 " + streak() + "-day streak", "🪙 " + Coins.get() + " coins"];
      stats.forEach(function (s, i) { x.fillText(s, 320, 330 + i * 46); });
      x.fillStyle = "#ff2daa"; x.font = "800 38px Arial,sans-serif";
      x.fillText("TEZOFY", 320, 560);
      x.fillStyle = "rgba(255,255,255,.6)"; x.font = "400 26px Arial,sans-serif";
      x.fillText("tezofystudio.github.io/tezofy", 320, 598);
      if (typeof cv.toBlob !== "function") {
        try {
          var a0 = document.createElement("a");
          a0.href = cv.toDataURL("image/png"); a0.download = "tezofy-profile-card.png"; a0.click();
          toast("Card downloaded — share it anywhere 🎉");
        } catch (e) { toast("Could not render the card."); }
        return;
      }
      cv.toBlob(function (blob) {
        if (!blob) return toast("Could not render the card.");
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], "card.png", { type: "image/png" })] })) {
          var f = new File([blob], "tezofy-profile.png", { type: "image/png" });
          navigator.share({ files: [f], title: "My TEZOFY profile" }).catch(function () {});
        } else {
          var a = document.createElement("a");
          a.href = URL.createObjectURL(blob); a.download = "tezofy-profile-card.png"; a.click();
          setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
          toast("Card downloaded — share it anywhere 🎉");
        }
      }, "image/png");
    }
    if (ava) {
      var im = new Image();
      im.onload = function () {
        x.save();
        x.beginPath(); x.arc(200, 240, 120, 0, Math.PI * 2); x.closePath(); x.clip();
        x.drawImage(im, 80, 120, 240, 240);
        x.restore();
        x.strokeStyle = lv.tier.c; x.lineWidth = 8;
        x.beginPath(); x.arc(200, 240, 124, 0, Math.PI * 2); x.stroke();
        finish();
      };
      im.onerror = finish;
      im.src = ava;
    } else {
      x.strokeStyle = lv.tier.c; x.lineWidth = 8;
      x.beginPath(); x.arc(200, 240, 120, 0, Math.PI * 2); x.stroke();
      x.fillStyle = "#fff"; x.font = "800 110px Arial,sans-serif"; x.textAlign = "center";
      x.fillText((u.name || "T").charAt(0).toUpperCase(), 200, 282); x.textAlign = "left";
      finish();
    }
  }

  /* ---------- overlay helper ---------- */
  function overlay(html, wire) {
    var ov = document.createElement("div");
    ov.className = "tzp-ov";
    ov.innerHTML = '<div class="tzp-sheet" role="dialog" aria-modal="true"><button class="tzp-x" aria-label="Close">✕</button>' + html + "</div>";
    document.body.appendChild(ov);
    requestAnimationFrame(function () { ov.classList.add("open"); });
    function close() {
      ov.classList.remove("open");
      setTimeout(function () { ov.remove(); }, 220);
    }
    $(".tzp-x", ov).addEventListener("click", close);
    ov.addEventListener("click", function (e) { if (e.target === ov) close(); });
    wire(ov, close);
    return { ov: ov, close: close };
  }

  /* ---------- styles (scoped .tzp-*) ---------- */
  function injectStyles() {
    if (document.getElementById("tzpStyle")) return;
    var st = document.createElement("style");
    st.id = "tzpStyle";
    st.textContent = [
      ".tzp-muted{color:var(--muted-2,#98a2b3)}.tzp-muted small,.tzp small.small{font-size:.76rem}",
      ".tzp-err{color:#fb7185;font-size:.8rem;min-height:1em}",
      ".tzp-toast{position:fixed;left:50%;bottom:86px;transform:translateX(-50%) translateY(16px);background:#1f2430;color:#fff;border:1px solid rgba(255,255,255,.12);padding:11px 18px;border-radius:12px;font:600 .85rem/1.3 inherit;z-index:400;opacity:0;transition:.25s;max-width:88vw;text-align:center}",
      ".tzp-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}",
      ".tzp-gate{max-width:430px;margin:26px auto 0;background:var(--card,#151926);border:1px solid var(--border,#252a3a);border-radius:22px;padding:30px 26px;text-align:center;box-shadow:0 24px 60px rgba(0,0,0,.35)}",
      ".tzp-gate-emoji{font-size:46px}.tzp-gate h1{font-size:1.45rem;margin:8px 0 6px}",
      ".tzp-gate-tabs{justify-content:center;margin:16px 0}",
      ".tzp-lab{display:block;font:700 .72rem/1 inherit;letter-spacing:.06em;text-transform:uppercase;color:var(--muted-2,#98a2b3);margin:13px 0 6px}",
      ".tzp-inp{width:100%;background:var(--bg-soft,#0f1320);border:1px solid var(--border,#252a3a);border-radius:12px;color:inherit;font:inherit;font-size:.92rem;padding:11px 13px;box-sizing:border-box}",
      ".tzp-inp:focus{outline:none;border-color:#ff2daa}",
      ".tzp-btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;background:linear-gradient(135deg,#ff2daa,#a826ff);color:#fff;border:none;border-radius:12px;padding:11px 18px;font:700 .86rem/1 inherit;cursor:pointer;text-decoration:none;transition:.18s}",
      ".tzp-btn:hover{transform:translateY(-1px)}.tzp-btn:disabled{opacity:.45;cursor:not-allowed;transform:none}",
      ".tzp-btn.big{width:100%;margin-top:16px;padding:14px}.tzp-btn.ghost{background:transparent;border:1px solid var(--border,#3a4258);color:inherit}",
      ".tzp-btn.danger{background:transparent;border:1px solid #ef444466;color:#f87171}",
      ".tzp-hero{background:var(--card,#151926);border:1px solid var(--border,#252a3a);border-radius:22px;overflow:hidden;position:relative;box-shadow:0 24px 60px rgba(0,0,0,.3)}",
      ".tzp-cover{height:170px;background:linear-gradient(120deg,#231a3d,#3a1a35);position:relative}",
      ".tzp-cover img{width:100%;height:100%;object-fit:cover;display:block}",
      ".tzp-cover-ph{display:flex;align-items:center;justify-content:center;height:100%;font-size:34px;opacity:.5}",
      ".tzp-fab{position:absolute;top:12px;right:12px;background:rgba(10,12,20,.65);color:#fff;border:1px solid rgba(255,255,255,.2);border-radius:10px;padding:8px 11px;cursor:pointer;font-size:15px;backdrop-filter:blur(6px)}",
      ".tzp-head{display:flex;gap:18px;align-items:flex-end;padding:0 22px;margin-top:-52px;flex-wrap:wrap;position:relative}",
      ".tzp-ava-wrap{position:relative;width:104px;height:104px;flex:0 0 auto}",
      ".tzp-ava{width:104px;height:104px;border-radius:50%;background:#20263a;display:flex;align-items:center;justify-content:center;font-size:40px;font-weight:800;overflow:hidden;border:4px solid var(--card,#151926);position:relative;z-index:1}",
      ".tzp-ava img{width:100%;height:100%;object-fit:cover}",
      ".tzp-ring{position:absolute;inset:-4px;border-radius:50%;border:3px solid #fff;pointer-events:none;z-index:2}",
      ".tzp-ava-edit{position:absolute;bottom:-2px;right:-2px;z-index:3;background:linear-gradient(135deg,#ff2daa,#a826ff);color:#fff;border:2px solid var(--card,#151926);border-radius:50%;width:34px;height:34px;cursor:pointer;font-size:14px}",
      ".tzp-id{flex:1;min-width:220px;padding-bottom:4px}.tzp-id h1{font-size:1.35rem;margin:52px 0 4px;display:flex;gap:10px;align-items:center;flex-wrap:wrap}",
      ".tzp-tier{font:700 .68rem/1 inherit;padding:6px 10px;border-radius:999px;border:1px solid;letter-spacing:.04em}",
      ".tzp-bio{margin-top:7px;font-size:.92rem;max-width:560px}",
      ".tzp-head-side{display:flex;gap:10px;align-items:center;padding-bottom:8px;flex-wrap:wrap}",
      ".tzp-coin-chip{background:linear-gradient(135deg,#f59e0b33,#f59e0b14);border:1px solid #f59e0b55;color:#fbbf24;font:800 .9rem/1 inherit;padding:10px 14px;border-radius:999px}",
      ".tzp-stats{display:flex;gap:10px;padding:16px 22px 6px;flex-wrap:wrap}",
      ".tzp-stat{flex:1;min-width:96px;background:var(--bg-soft,#0f1320);border:1px solid var(--border,#252a3a);border-radius:14px;text-align:center;padding:12px 8px}",
      ".tzp-stat b{display:block;font-size:1.25rem}.tzp-stat span{font-size:.7rem;color:var(--muted-2,#98a2b3);letter-spacing:.05em;text-transform:uppercase}",
      ".tzp-lvlbar{height:8px;border-radius:99px;background:var(--bg-soft,#0f1320);margin:10px 22px 4px;overflow:hidden}",
      ".tzp-lvlbar i{display:block;height:100%;border-radius:99px;transition:width .4s}",
      ".tzp-hero > p{padding:0 22px 16px;margin:2px 0 0}",
      ".tzp-tabs{display:flex;gap:8px;margin:20px 0 14px;overflow-x:auto;padding-bottom:4px}",
      ".tzp-tab{background:var(--bg-soft,#0f1320);border:1px solid var(--border,#252a3a);color:inherit;border-radius:999px;padding:10px 16px;font:700 .82rem/1 inherit;cursor:pointer;white-space:nowrap;transition:.18s}",
      ".tzp-tab.on{background:linear-gradient(135deg,#ff2daa,#a826ff);color:#fff;border-color:transparent}",
      ".tzp-h3{font-size:1.02rem;margin:22px 0 12px}",
      ".tzp-grid3{display:grid;grid-template-columns:repeat(auto-fill,minmax(215px,1fr));gap:12px}",
      ".tzp-q,.tzp-card{display:flex;flex-direction:column;gap:5px;background:var(--card,#151926);border:1px solid var(--border,#252a3a);border-radius:16px;padding:15px;text-decoration:none;color:inherit;transition:.18s}",
      ".tzp-q:hover{border-color:#ff2daa88;transform:translateY(-2px)}.tzp-q span,.tzp-card span{font-size:.78rem;color:var(--muted-2,#98a2b3)}",
      ".tzp-row{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:12px 0}",
      ".tzp-gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(178px,1fr));gap:14px}",
      ".tzp-cre{margin:0;background:var(--card,#151926);border:1px solid var(--border,#252a3a);border-radius:16px;overflow:hidden}",
      ".tzp-cre img{width:100%;aspect-ratio:1;object-fit:cover;display:block}",
      ".tzp-cre figcaption{padding:10px 11px;display:flex;flex-direction:column;gap:3px}",
      ".tzp-cre figcaption b{font-size:.86rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
      ".tzp-cre figcaption span{font-size:.7rem;color:var(--muted-2,#98a2b3)}",
      ".tzp-cre-acts{display:flex;gap:6px;margin-top:7px}",
      ".tzp-cre-acts button{flex:1;background:var(--bg-soft,#0f1320);border:1px solid var(--border,#252a3a);border-radius:9px;color:inherit;padding:7px 0;cursor:pointer;font-size:14px}",
      ".tzp-cre-acts button:hover{border-color:#ff2daa88}",
      ".tzp-empty{text-align:center;padding:36px 10px;background:var(--card,#151926);border:1px dashed var(--border,#3a4258);border-radius:16px}",
      ".tzp-empty div{font-size:36px}.tzp-empty p{margin:6px 0}",
      ".tzp-rec{display:flex;gap:10px;overflow-x:auto;padding-bottom:8px}",
      ".tzp-rec-chip{display:flex;flex-direction:column;gap:6px;min-width:110px;text-decoration:none;color:inherit;font-size:.72rem;text-align:center}",
      ".tzp-rec-chip img{width:110px;height:110px;object-fit:cover;border-radius:14px}",
      ".tzp-coin-hero{display:flex;gap:16px;align-items:center;justify-content:space-between;flex-wrap:wrap;background:linear-gradient(120deg,#f59e0b1f,#f59e0b0d);border:1px solid #f59e0b44;border-radius:18px;padding:20px 22px}",
      ".tzp-coin-hero b{font-size:2.4rem;display:block;color:#fbbf24}.tzp-coin-hero small{font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--muted-2)}",
      ".tzp-coin-hero .tzp-btn.big{width:auto;margin:0;min-width:210px}",
      ".tzp-rules{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px}",
      ".tzp-rule{display:flex;flex-direction:column;gap:2px;background:var(--card,#151926);border:1px solid var(--border,#252a3a);border-radius:14px;padding:12px 14px}",
      ".tzp-rule b{color:#fbbf24}.tzp-rule i{font-style:normal;font-size:.72rem;color:var(--muted-2)}",
      ".tzp-log{display:flex;justify-content:space-between;gap:10px;padding:10px 14px;border-bottom:1px solid var(--border,#252a3a);font-size:.86rem}",
      ".tzp-log i{font-style:normal;color:var(--muted-2);font-size:.74rem}",
      ".tzp-set{background:var(--card,#151926);border:1px solid var(--border,#252a3a);border-radius:18px;padding:6px 18px 18px}",
      ".tzp-ov{position:fixed;inset:0;background:rgba(5,6,10,.66);backdrop-filter:blur(6px);z-index:300;display:flex;align-items:flex-end;justify-content:center;opacity:0;transition:.22s}",
      ".tzp-ov.open{opacity:1}",
      ".tzp-sheet{background:var(--card,#151926);border:1px solid var(--border,#252a3a);border-radius:22px 22px 0 0;width:min(660px,100%);max-height:88vh;overflow-y:auto;padding:22px 20px 30px;position:relative;transform:translateY(24px);transition:.25s}",
      ".tzp-ov.open .tzp-sheet{transform:translateY(0)}",
      ".tzp-x{position:absolute;top:14px;right:14px;background:var(--bg-soft,#0f1320);border:1px solid var(--border,#3a4258);color:inherit;width:34px;height:34px;border-radius:50%;cursor:pointer;font-size:14px}",
      "@media (min-width:860px){.tzp-ov{align-items:center}.tzp-sheet{border-radius:22px}}",
      ".tzp-presets{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;margin:12px 0}",
      ".tzp-preset{background:var(--bg-soft,#0f1320);border:1px solid var(--border,#252a3a);color:inherit;border-radius:12px;padding:11px 10px;cursor:pointer;font-size:.8rem;transition:.15s}",
      ".tzp-preset:hover{border-color:#ff2daa88}",
      ".tzp-stage{min-height:120px;display:flex;align-items:center;justify-content:center;background:var(--bg-soft,#0f1320);border:1px dashed var(--border,#3a4258);border-radius:14px;padding:10px;margin:8px 0}",
      ".tzp-loading{text-align:center;color:var(--muted-2)}",
      ".tzp-spin{width:46px;height:46px;border-radius:50%;border:4px solid #ff2daa33;border-top-color:#ff2daa;animation:tzpspin 1s linear infinite;margin:0 auto 10px}",
      "@keyframes tzpspin{to{transform:rotate(360deg)}}",
      ".tzp-ava-stage{display:flex;gap:16px;align-items:center;margin:12px 0}",
      ".tzp-ava-big{width:96px;height:96px;border-radius:50%;background:var(--bg-soft,#0f1320);border:2px dashed var(--border,#3a4258);display:flex;align-items:center;justify-content:center;font-size:34px;overflow:hidden;flex:0 0 auto}",
      ".tzp-ava-big img{width:100%;height:100%;object-fit:cover}",
      ".tzp-lb img{width:100%;border-radius:14px}",
      ".tzp-boot{color:var(--muted-2)}"
    ].join("");
    document.head.appendChild(st);
  }

  /* ---------- public API + boot ---------- */
  window.TezoProfile = {
    user: currentUser,
    coins: Coins,
    open: function () { renderProfile(); },
    version: "1.0"
  };

  function boot() {
    if (!document.getElementById("profileRoot")) return; /* this engine belongs to profile.html only */
    injectStyles();
    bindTheme();
    coins(); /* day-rollover init */
    renderProfile();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();

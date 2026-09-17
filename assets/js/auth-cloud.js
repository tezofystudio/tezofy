/* ============================================================
   TEZOFY — Cloud Auth Bridge
   Google Sign-In + Facebook Login + temp-mail shield
   + one-way email collection into your private Google Sheet.
   Configure in data.js → AUTH_CONFIG. No build needed.
   ============================================================ */
(function () {
  "use strict";

  var CFG = (typeof AUTH_CONFIG !== "undefined") ? AUTH_CONFIG : {};

  /* -------- 1. TEMP-MAIL SHIELD ------------------------------------------
     Signup থামিয়ে দেয় যদি ইমেইলটা disposable/temp-mail সার্ভিসের হয়। */
  var BLOCKED_DOMAINS = [
    "mailinator.com", "tempmail.com", "temp-mail.org", "temp-mail.io", "temp-mail.de",
    "10minutemail.com", "10minutemail.net", "guerrillamail.com", "guerrillamail.net",
    "yopmail.com", "yopmail.net", "maildrop.cc", "throwawaymail.com", "getnada.com",
    "sharklasers.com", "grr.la", "guerrillamailblock.com", "pokemail.net", "spam4.me",
    "tempinbox.com", "dispostable.com", "trashmail.com", "trashmail.net", "mintemail.com",
    "mohmal.com", "emailondeck.com", "tempail.com", "burnermail.io", "fakermail.com",
    "fakeinbox.com", "mailnesia.com", "mytemp.email", "tempmailo.com", "tempr.email",
    "inboxkitten.com", "anonymbox.com", "wegwerfmail.de", "courrieltemporaire.com",
    "harakirimail.com", "jetable.org", "mailexpire.com", "tempomail.fr", "moakt.com",
    "disposablemail.com", "spamgourmet.com", "mailcatch.com", "tempmailaddress.com"
  ];

  function isDisposable(email) {
    var domain = String(email || "").split("@")[1];
    if (!domain) return false;
    domain = domain.toLowerCase().trim();
    for (var i = 0; i < BLOCKED_DOMAINS.length; i++) {
      if (domain === BLOCKED_DOMAINS[i] || domain.endsWith("." + BLOCKED_DOMAINS[i])) return true;
    }
    return false;
  }

  /* -------- 2. EMAIL COLLECTOR → GOOGLE SHEET ---------------------------- */
  /* Fire-and-forget: সাইট কখনোই এই রিকোয়েস্টের জন্য আটকে থাকে না। */
  function collect(entry) {
    if (!CFG.sheetUrl) return;
    try {
      entry.date = new Date().toISOString();
      entry.site = location.host;
      if (!entry.action) entry.action = "register"; // 👥 Users ট্যাবে নোঙর
      /* 🚦 v2.8 LOCKSTEP: POST + GET দুই লাইনে পাঠাই — যেকোনো এক লাইন খুললেই ডেটা পৌঁছায়! */
      var body = JSON.stringify(entry);
      fetch(CFG.sheetUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: body
      }).catch(function () {});
      var qs = Object.keys(entry).map(function (k) {
        return encodeURIComponent(k) + "=" + encodeURIComponent(String(entry[k]).slice(0, 180));
      }).join("&");
      setTimeout(function () {
        fetch(CFG.sheetUrl + "?" + qs, { mode: "no-cors" }).catch(function () {});
      }, 420);
    } catch (e) {}
  }

  /* ⛔ ব্যান-চেক (উত্তর পড়া যায় — নিয়মিত CORS ফেচ, অ্যাডমিনের মতোই) */
  function check(email) {
    if (!CFG.sheetUrl) return Promise.resolve({ banned: false });
    return fetch(CFG.sheetUrl, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "checkban", email: email })
    }).then(function (r) { return r.json(); }).catch(function () { return { banned: false, offline: true }; });
  }

  /* -------- 3. GOOGLE SIGN-IN --------------------------------------------
     অফিসিয়াল Google বাটন রেন্ডার করে; সফল হলে {name,email,provider:"google"} */
  var gsiLoading = false;
  function googleConfigured() { return !!CFG.googleClientId; }

  function googleRender(container, onUser) {
    if (!container || !googleConfigured()) return false;
    function boot() {
      if (!window.google || !google.accounts) return;
      google.accounts.id.initialize({
        client_id: CFG.googleClientId,
        callback: function (resp) {
          try {
            var payload = JSON.parse(atob(resp.credential.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
            if (payload.email) onUser({ name: payload.name || payload.email.split("@")[0], email: payload.email, provider: "google" });
          } catch (e) {}
        }
      });
      (function draw() {
        var w2 = 0;
        try { w2 = container.clientWidth || 0; } catch (e) {}
        if (!w2) { setTimeout(draw, 80); return; }
        google.accounts.id.renderButton(container, {
          theme: "outline", size: "large", width: Math.min(w2, 400),
          text: "continue_with", shape: "pill", logo_alignment: "center"
        });
      })();
    }
    if (window.google && google.accounts) { boot(); return true; }
    if (gsiLoading) { var t = setInterval(function () { if (window.google && google.accounts) { clearInterval(t); boot(); } }, 150); return true; }
    gsiLoading = true;
    var s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true; s.defer = true;
    s.onload = boot;
    document.head.appendChild(s);
    return true;
  }

  /* -------- 4. FACEBOOK LOGIN -------------------------------------------- */
  var fbLoading = false;
  function fbReady() { return !!CFG.fbAppId; }

  function ensureFbSdk(cb) {
    if (window.FB) { cb(); return; }
    if (fbLoading) { var t = setInterval(function () { if (window.FB) { clearInterval(t); cb(); } }, 150); return; }
    fbLoading = true;
    window.fbAsyncInit = function () {
      FB.init({ appId: CFG.fbAppId, cookie: true, xfbml: false, version: "v19.0" });
      cb();
    };
    var root = document.createElement("div"); root.id = "fb-root"; document.body.appendChild(root);
    var s = document.createElement("script");
    s.src = "https://connect.facebook.net/en_US/sdk.js";
    s.async = true; s.defer = true;
    document.head.appendChild(s);
  }

  function fbLogin(onUser, onErr) {
    ensureFbSdk(function () {
      FB.login(function (resp) {
        if (!resp.authResponse) { if (onErr) onErr("Login was cancelled."); return; }
        FB.api("/me", { fields: "name,email" }, function (me) {
          if (me && me.email) onUser({ name: me.name || me.email.split("@")[0], email: me.email, provider: "facebook" });
          else if (onErr) onErr("Facebook didn't share an email. Please use Google or email sign-up instead.");
        });
      }, { scope: "public_profile,email" });
    });
  }

  window.CloudAuth = {
    isDisposable: isDisposable,
    collect: collect,
    googleConfigured: googleConfigured,
    googleRender: googleRender,
    fbReady: fbReady,
    fbLogin: fbLogin,
    check: check,
    socialEnabled: function () { return googleConfigured() || fbReady(); }
  };
})();

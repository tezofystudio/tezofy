/* ============================================================
   TEZOFY — Cloud Auth Bridge
   Google Sign-In + Facebook Login + temp-mail shield (v2.9 GATEKEEPER: 539 domains + OTP/reset bridge)
   + one-way email collection into your private Google Sheet.
   Configure in data.js → AUTH_CONFIG. No build needed.
   ============================================================ */
(function () {
  "use strict";

  var CFG = (typeof AUTH_CONFIG !== "undefined") ? AUTH_CONFIG : {};

  /* -------- 1. TEMP-MAIL SHIELD ------------------------------------------
     Signup থামিয়ে দেয় যদি ইমেইলটা disposable/temp-mail সার্ভিসের হয়। */
  var BLOCKED_DOMAINS = "10minute.cf|10minutemail.be|10minutemail.cf|10minutemail.co.uk|10minutemail.co.za|10minutemail.com|10minutemail.de|10minutemail.ga|10minutemail.gq|10minutemail.ml|10minutemail.net|10minutemail.nl|10minutemail.org|10minutemail.pl|10minutemail.pro|10minutemail.us|10minutemail2.com|10minutemailbox.com|10minutemails.in|10minutenemail.de|10minutenmail.xyz|10minutesemail.net|10minutesmail.fr|10minutesmail.us|10minutetempemail.com|12minutemail.com|20minute.email|20minutemail.com|20minutemail.it|30minutemail.com|5minutemail.net|60minutemail.com|alltempmail.com|anomail.club|anonymbox.com|anonymmail.net|antispam24.de|armyspy.com|besttempmail.com|binkmail.com|bobmail.info|burnermail.io|chogmail.com|cool.fr.nf|courriel.fr.nf|courrieltemporaire.com|cuvox.de|dayrep.com|deadaddress.com|deadspam.com|despam.it|despammed.com|devnullmail.com|dinomail.cf|dinomail.ga|dinomail.gq|dinomail.ml|dinomail.tk|disposableemailaddresses.emailmiser.com|disposablemail.space|disposablemail.top|disposablemails.com|dispostable.com|dodgit.com|dodgit.org|dontreg.com|duidir.com|dumpmail.de|easytrashmail.com|edris.moakt.cc|einrot.com|email-jetable.fr|emaildrop.io|emailmenow.info|emailmiser.com|emailproxsy.com|emailsensei.com|ephemail.net|explodemail.com|eyepaste.com|fake-wegwerf.email|fakeinbox.cf|fakeinbox.com|fakeinbox.ga|fakeinbox.info|fakeinbox.ml|fakeinbox.tk|fakemail.fr|fakemail.io|fakemail.penguen.tk|fakemail.top|fakemail.win|fakemailgenerator.com|fakemailgenerator.net|fakemails.cf|fakemails.ga|fakemails.gq|fakemails.ml|fakemailz.com|fangoh.com|filzmail.com|fleckens.hu|flyspam.com|fr33mail.info|frapmail.com|garbagemail.org|get-temp-mail.biz|getnada.cf|getnada.com|getnada.ga|getnada.gq|getnada.ml|getnada.tk|gettempmail.com|gishpuppy.com|gmail.yopmail.fr|gmailnator.com|govnomail.xyz|great-host.in|grr.la|guerrillamail.biz|guerrillamail.com|guerrillamail.de|guerrillamail.info|guerrillamail.net|guerrillamail.org|guerrillamailblock.com|gustr.com|haltospam.com|harakirimail.com|hatespam.org|hidemail.de|hidemail.pro|hidemail.us|hochsitze.com|hottempmail.cc|ignoremail.com|ilmiogottino.com|imails.info|inboxkitten.com|incognitomail.com|incognitomail.net|incognitomail.org|instant-mail.de|intempmail.com|itempmail.tk|jetable.com|jetable.fr.nf|jetable.net|jetable.org|jetable.pp.ua|jetableemail.com|jetableemails.com|jobscai.com|jourrapide.com|junk1e.com|kasmail.com|killmail.com|killmail.net|klzlk.com|kurzepost.de|letthemeatspam.com|link2mail.net|litedrop.com|lol.ovpn.to|maboard.com|mail-jetable.com|mail-temporaire.com|mail-temporaire.fr|mail2nowhere.cf|mail2nowhere.ga|mail2nowhere.gq|mail2nowhere.ml|mail2nowhere.tk|mailblocks.com|mailcatch.com|mailcatch.xyz|maildrop.cc|maildrop.cf|maildrop.ga|maildrop.gq|maildrop.ml|maileater.com|mailexpire.com|mailforspam.com|mailfreeonline.com|mailimails.patzleiner.net|mailimate.com|mailin8r.com|mailinator.cf|mailinator.cl|mailinator.com|mailinator.ga|mailinator.gq|mailinator.linkpc.net|mailinator.ml|mailinator.net|mailinator.org|mailinator.site|mailinator.us|mailinator2.com|mailme.gq|mailme.ir|mailme.judis.me|mailme.lv|mailme24.com|mailmetal.com|mailmetrash.com|mailmoth.com|mailnator.com|mailnesia.com|mailnesia.net|mailnull.com|mailproxsy.com|mailshell.com|mailtempmha.tk|mailtothis.com|makemetheking.com|mega.zik.dj|meltmail.com|mintemail.cf|mintemail.com|mintemail.ga|mintemail.gq|mintemail.ml|mintemail.tk|moakt.cc|moakt.co|moakt.com|moakt.ws|mobiletrashmail.com|moburl.com|mohmal.com|mohmal.im|mohmal.in|mohmal.tech|moimails.ru|my10minutemail.com|myfakemail.cf|myfakemail.ga|myfakemail.gq|myfakemail.tk|myspamless.com|mytemp.email|mytempdomain.tk|mytempemail.com|mytrashmail.com|mytrashmail.net|mytrashmailer.com|mytrashmailr.com|ndfakemail.ga|newtempmail.com|nobulk.com|noclickemail.com|nogmailspam.info|nomail.cf|nomail.ga|nomail.kerenon.com|nomail.nodns.xyz|nomail.top|nomail.xl.cx|nomail2me.com|nomailthanks.com|nomailthankyou.com|nospam.ze.tc|nospam4.us|nospamfor.us|notatempmail.info|notmailinator.com|nowhere.org|nowmymail.com|nowmymail.net|ntlhelp.net|oneoffmail.com|onetimeusemail.com|onewaymail.com|otherinbox.com|ovpn.to|pjjkp.com|pokemail.net|politikerclub.de|pookmail.com|privatemailinator.nl|projeyonetimegitimi.xyz|protempmail.com|quickinbox.com|rajetempmail.com|reallymymail.com|recode.me|reconmail.com|regbypass.com|regbypass.comsafe-mail.net|rhyta.com|rmqkr.net|safetempmail.com|safetymail.info|sharklasers.com|shiftmail.com|shitmail.cf|shitmail.de|shitmail.ga|shitmail.gq|shitmail.me|shitmail.ml|shitmail.org|shitmail.tk|shorten.tempm.ml|shortmail.net|sibmail.com|smashmail.de|snakemail.com|sneakemail.com|sofort-mail.de|sogetthis.com|spam4.me|spamavert.com|spambob.com|spambob.net|spambob.org|spambog.com|spambog.de|spambog.net|spambog.ru|spambox.info|spambox.irishspringrealty.com|spambox.me|spambox.us|spambox.win|spambox.xyz|spamcero.com|spamcowboy.com|spamcowboy.net|spamcowboy.org|spamday.com|spamex.com|spamfree24.com|spamfree24.de|spamfree24.eu|spamfree24.info|spamfree24.net|spamfree24.org|spamgourmet.com|spamgourmet.net|spamgourmet.org|spamherelots.com|spamhereplease.com|spamhole.com|spamify.com|spaminator.de|spamkill.info|spaml.com|spaml.de|spammotel.com|spamobox.com|spamoff.de|spamslicer.com|spamspot.com|spamthis.co.uk|spamthis.network|spamthisplease.com|spamtrail.com|spamwc.cf|spamwc.ga|spamwc.gq|spamwc.ml|spamwc.tk|speed.1s.fr|stempmail.com|superrito.com|supertemporarymails.tk|suremail.info|swift10minutemail.com|teleworm.us|temp-mail.com|temp-mail.de|temp-mail.info|temp-mail.life|temp-mail.live|temp-mail.ml|temp-mail.monster|temp-mail.org|temp-mail.pp.ua|temp-mails.co|temp-mails.com|temp.emeraldwebmail.com|tempail.com|tempemail.biz|tempemail.co|tempemail.co.za|tempemail.com|tempemail.daniel-james.me|tempemail.info|tempemail.net|tempemail.pro|tempemailaddress.com|tempemailco.com|tempemails.io|tempinbox.co.uk|tempinbox.com|tempinbox.xyz|tempm.cf|tempm.com|tempm.ga|tempm.gq|tempm.ml|tempmail-1.net|tempmail-2.net|tempmail-3.net|tempmail-4.net|tempmail-5.net|tempmail-store.tech|tempmail.cn|tempmail.co|tempmail.de|tempmail.dev|tempmail.digital|tempmail.io|tempmail.it|tempmail.net|tempmail.ninja|tempmail.plus|tempmail.pp.ua|tempmail.pro|tempmail.red|tempmail.space|tempmail.top|tempmail.us|tempmail.website|tempmail.win|tempmail.ws|tempmail.yjml.net|tempmail2.com|tempmailaddress.com|tempmailapp.com|tempmailco.com|tempmaildemo.com|tempmailer.com|tempmailer.de|tempmailer.net|tempmailid.com|tempmailid.net|tempmailid.org|tempmailin.com|tempmailo.com|tempmails.cf|tempmails.gq|tempmails.org|tempmaily.com|tempomail.fr|tempomail.org|temporaryemail.com|temporaryemail.net|temporaryemail.us|temporaryforwarding.com|temporaryinbox.com|temporarymail.ga|temporarymail.org|temporarymailaddress.com|tempr.email|temprazzsoft.cf|temprazzsoft.ga|temprazzsoft.gq|temprazzsoft.tk|tempremail.cf|tempremail.tk|tempsky.com|temptrashmail.com|thanksnospam.info|theempirecode.com|thetempmail.com|thetempmailo.ml|thisisnotmyrealemail.com|throwawayemailaddress.com|throwawaymail.com|throwawaymail.pp.ua|tmail.ws|tmailinator.com|tmpmail.co|tmpmail.net|tmpmail.org|tradermail.info|trashemail.de|trashmail.app|trashmail.at|trashmail.com|trashmail.de|trashmail.es|trashmail.fr|trashmail.ga|trashmail.gq|trashmail.io|trashmail.live|trashmail.me|trashmail.net|trashmail.org|trashmail.pw|trashmail.se|trashmail.tk|trashmail.top|trashmail.win|trashmail.ws|trashmailer.com|trashmailgenerator.de|trashmails.com|trashymail.com|trashymail.net|ultramailinator.com|unomail9.com|uranomail.es|veanlo.com|veryrealemail.com|webtempmail.online|wegwerf-email-addressen.de|wegwerf-emails.de|wegwerfadresse.de|wegwerfemail.de|wegwerfemail.info|wegwerfmail.de|wegwerfmail.info|wegwerfmail.net|wegwerfmail.org|www.gishpuppy.com|xgnowherei.com|yopmail.cf|yopmail.com|yopmail.dams.city|yopmail.fr|yopmail.gq|yopmail.info|yopmail.ml|yopmail.net|yopmail.org|yopmail.pp.ua|yopmail2.tk|zainmax.net|zippymail.info|zoemail.com|zoemail.net|zoemail.org".split("|");
  var BLOCK_SUBS = "10minut|anonymbox|armyspy|burnermail|cuvox|dayrep|dispostable|duidir|einrot|emailondeck|fakeinbox|fakemail|fakermail|fleckens|getnada|guerrillamail|gustr|harakirimail|inboxkitten|jetable|jobscai|jourrapide|mailcatch|maildrop|mailexpire|mailinator|mailnesia|mintemail|minutemail|moakt|mohmal|pokemail|rhyta|sharklasers|spamgourmet|superrito|teleworm|temp-mail|tempail|tempinbox|tempmail|tempmailo|tempomail|tempr.email|throwaway|trashmail|trashymail|wegwerf|yopmail".split("|");

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

  /* -------- 5. v2.9 GATEKEEPER: JSON কমান্ড ব্রিজ (উত্তর পড়া যায়) -------- */
  function cmd(payload) {
    if (!CFG.sheetUrl) return Promise.resolve({ ok: false, error: "সার্ভার কনফিগ করা নেই", offline: true });
    return fetch(CFG.sheetUrl, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    }).then(function (r) { return r.json(); })
      .catch(function () { return { ok: false, error: "নেটওয়ার্ক সমস্যা — আবার চেষ্টা করুন", offline: true }; });
  }

  /* -------- 6. পাসওয়ার্ড-হ্যাশ (আসল পাসওয়ার্ড কখনো সার্ভারে যায় না) -------- */
  function sha256Hex(str) {
    if (window.crypto && crypto.subtle && window.TextEncoder) {
      return crypto.subtle.digest("SHA-256", new TextEncoder().encode(str)).then(function (buf) {
        return Array.prototype.map.call(new Uint8Array(buf), function (x) { return ("0" + x.toString(16)).slice(-2); }).join("");
      });
    }
    return Promise.resolve("");
  }
  function hashPass(email, pass) {
    return sha256Hex(String(email || "").toLowerCase().trim() + "::" + String(pass || "") + "::tezofy-gk1");
  }

  window.CloudAuth = {
    isDisposable: isDisposable,
    collect: collect,
    googleConfigured: googleConfigured,
    googleRender: googleRender,
    fbReady: fbReady,
    fbLogin: fbLogin,
    check: check,
    cmd: cmd,
    hashPass: hashPass,
    socialEnabled: function () { return googleConfigured() || fbReady(); }
  };
})();

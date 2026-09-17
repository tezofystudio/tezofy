/* ============================================================
   TEZOFY — Privacy-lite visitor beacon (v2.6)
   এক সেশনে একবারই যাবে; বট/ক্রলার-স্কিপ্ড; দেশ/সিটি ipwho.is থেকে।
   ============================================================ */
(function () {
  "use strict";
  try {
    if (typeof AUTH_CONFIG === "undefined" || !AUTH_CONFIG.sheetUrl) return;
    if (navigator.webdriver) return;
    if (window.sessionStorage && sessionStorage.getItem("tzVisit")) return;
    if (window.sessionStorage) sessionStorage.setItem("tzVisit", "1");
  } catch (e) { return; }

  var utm = "";
  try { utm = new URLSearchParams(location.search).get("utm_source") || ""; } catch (e) {}

  /* 📣 কোন সোশ্যাল সাইট থেকে এলো — fbclid/utm/referrer তিন পথেই শিকার */
  function channel() {
    var ref = "";
    try { ref = (document.referrer || "").toLowerCase(); } catch (e) {}
    var q = "";
    try { q = location.search || ""; } catch (e) {}
    var host = ref.replace(/^https?:\/\/(www\.|m\.|l\.)?/, "").split("/")[0] || "";
    var utm = (q.match(/[?&]utm_source=([^&]+)/) || [])[1] || "";
    if (/fbclid=/.test(q)) return "Facebook";
    if (/igshid=|igsh=/.test(q)) return "Instagram";
    if (/ttclid=/.test(q)) return "TikTok";
    var src = (host || utm).toLowerCase();
    if (!src) return "Direct";
    if (/facebook|fb\.me/.test(src)) return "Facebook";
    if (/instagram/.test(src)) return "Instagram";
    if (/whatsapp|wa\.me/.test(src)) return "WhatsApp";
    if (/t\.co|twitter|^x\.com$/.test(src)) return "X (Twitter)";
    if (/youtube|youtu\.be/.test(src)) return "YouTube";
    if (/tiktok/.test(src)) return "TikTok";
    if (/t\.me|telegram/.test(src)) return "Telegram";
    if (/messenger/.test(src)) return "Messenger";
    if (/google\./.test(src)) return "Google Search";
    if (/bing\./.test(src)) return "Bing";
    return src;
  }

  function send(extra) {
    var payload = Object.assign({
      action: "visit",
      ch: channel(),
      path: location.pathname + location.search,
      page: document.title,
      ref: (document.referrer || "direct").replace(/^https?:\/\/(www\.|m\.|l\.)?/, "").split("/")[0] || "direct",
      ua: navigator.userAgent.slice(0, 180),
      utm: utm
    }, extra || {});
    try {
      fetch(AUTH_CONFIG.sheetUrl, {
        method: "POST", mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      }).catch(function () {});
    } catch (e) {}
  }

  if (!window.fetch) { send(); return; }
  var done = false;
  var to = setTimeout(function () { if (!done) { done = true; send(); } }, 2600);
  fetch("https://ipwho.is/", { cache: "no-store" })
    .then(function (r) { return r.json(); })
    .then(function (j) {
      if (done) return; done = true; clearTimeout(to);
      if (j && j.success !== false && j.country) send({ country: j.country, countryCode: j.country_code, city: j.city });
      else send();
    })
    .catch(function () { if (!done) { done = true; clearTimeout(to); send(); } });
})();

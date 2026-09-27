/* ============================================================
   TEZOFY — FILE 05: PROMPT-STATS MODULE (অ্যাডমিন) v2
   ------------------------------------------------------------
   ⚡ বসানোর নিয়ম (admin.html):
     </body>-এর আগে শুধু এক লাইন:
       <script src="assets/js/tezo-admin-stats.js" defer></script>
     (এই ফাইলটি assets/js/ ফোল্ডারে tezo-admin-stats.js নামে সেভ করুন)

   এটি কী করে:
   • আপনার বিদ্যমান "📈 Analytics" ট্যাবের একদম নিচে একটি নতুন
     সেকশন যোগ করে — "🎯 প্রম্পট পারফরম্যান্স" (আলাদা ট্যাব নয়!)
   • আপনার gate-চাবি (localStorage "chitro:adminKey") স্বয়ংক্রিয়ভাবে
     ব্যবহার করে — দ্বিতীয়বার পাসওয়ার্ড লাগবে না
   • আপনার নিজের CSS ক্লাস (adm-card, adm-stats, adm-barline,
     adm-muted, adm-ghost) ব্যবহার করে — ডিজাইন ১০০% ম্যাচ করবে
   • Analytics ট্যাবে ঢুকলেই অটো-রিফ্রেশ হয় (setTab হুক ছাড়াই,
     ক্লিক-লিসনার দিয়ে)
   ============================================================ */

var TezoAdmin = (function () {
  "use strict";

  var ENDPOINT = (typeof AUTH_CONFIG !== "undefined" && AUTH_CONFIG && AUTH_CONFIG.sheetUrl) || "";
  var KEY_LS = "chitro:adminKey";   /* ← আপনার gate-এর একই চাবি */
  var state = { data: null, sort: "score7", dir: -1, q: "" };
  var infoById = {};                 /* টাইটেল/টপিক দেখানোর ক্যাশ */

  function key() { try { return localStorage.getItem(KEY_LS) || ""; } catch (e) { return ""; } }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
    });
  }

  /* প্রম্পটের টাইটেল + টপিক বের করা — action=prompts (পাবলিক) থেকে */
  function loadInfo() {
    if (!ENDPOINT) return;
    fetch(ENDPOINT + "?action=prompts&t=" + Date.now())
      .then(function (r) { return r.json(); })
      .then(function (d) {
        (d && d.prompts || []).forEach(function (p) { infoById[p.id] = p; });
      }).catch(function () {});
  }
  function info(id) {
    var p = infoById[id] || {};
    var out = { title: p.title || id, topic: "", sub: "" };
    if (typeof TezoTopic !== "undefined") {
      var probe = { id: id, cats: p.cats || [], topic: p.topic, sub: p.sub };
      var m = TezoTopic.of(probe);
      if (m) {
        var t = TezoTopic.byId(m.topic), s = TezoTopic.subById(m.topic, m.sub);
        out.topic = t ? t.name : m.topic;
        out.sub = s ? s.name : (m.sub || "");
      }
    }
    return out;
  }

  /* ---------- DOM-এ সেকশন ইনজেকশন ---------- */
  function inject() {
    var panel = document.getElementById("tab-analytics");
    if (!panel) return;
    if (document.getElementById("tezoPromptStats")) return;

    var sec = document.createElement("div");
    sec.id = "tezoPromptStats";
    sec.className = "adm-card";
    sec.style.marginTop = "18px";
    sec.innerHTML =
      '<h3>🎯 প্রম্পট পারফরম্যান্স <span class="adm-muted small">(ভিউ · কপি · লাইক · ট্রেন্ডিং — শূন্য থেকে আসল গোনা)</span></h3>' +
      '<div class="adm-row" style="flex-wrap:wrap;gap:8px;margin:10px 0">' +
        '<button class="adm-ghost sm" id="tezoPstatsRefresh" type="button">↻ Refresh</button>' +
        '<button class="adm-ghost sm" id="tezoPstatsCsv" type="button">⬇ CSV</button>' +
        '<input id="tezoPstatsQ" placeholder="🔍 প্রম্পট / টপিক খুঁজুন…" ' +
          'style="flex:1;min-width:180px;background:var(--card-2);border:1px solid var(--border);color:var(--text);border-radius:10px;padding:8px 11px;font-size:.85rem;font-family:inherit">' +
        '<span class="adm-muted small" id="tezoPstatsUpd"></span>' +
      '</div>' +
      '<div class="adm-stats" id="tezoPstatsBoxes"><p class="adm-muted small">লোড হচ্ছে…</p></div>' +
      '<h3 style="margin-top:14px">🚀 ট্রেন্ডিং র‍্যাংক (৭-দিনের স্কোর = কপি×3 + লাইক×2 + ভিউ×1)</h3>' +
      '<div id="tezoPstatsTop"></div>' +
      '<div style="overflow:auto;max-height:56vh;border:1px solid var(--border);border-radius:12px;margin-top:8px">' +
        '<table id="tezoPstatsTable" style="width:100%;border-collapse:collapse;font-size:.84rem;white-space:nowrap"></table>' +
      '</div>';
    panel.appendChild(sec);

    document.getElementById("tezoPstatsRefresh").addEventListener("click", load);
    document.getElementById("tezoPstatsCsv").addEventListener("click", exportCsv);
    document.getElementById("tezoPstatsQ").addEventListener("input", function () {
      state.q = this.value.toLowerCase(); render();
    });
  }

  /* ---------- ডাটা লোড (?action=padmin) ---------- */
  function load() {
    var boxes = document.getElementById("tezoPstatsBoxes");
    if (!boxes) return;
    if (!ENDPOINT) { boxes.innerHTML = '<p class="adm-muted small">AUTH_CONFIG.sheetUrl পাওয়া যায়নি।</p>'; return; }
    boxes.innerHTML = '<p class="adm-muted small">লোড হচ্ছে…</p>';
    fetch(ENDPOINT + "?action=padmin&key=" + encodeURIComponent(key()) + "&t=" + Date.now())
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!d || !d.ok) {
          boxes.innerHTML = '<p class="adm-muted small">❌ ' + esc((d && d.error) || "failed") +
            ' — Apps Script-এ FILE 04 (tezo-backend) যোগ করে New version Deploy করেছেন তো? (action=padmin)</p>';
          return;
        }
        state.data = d;
        render();
      })
      .catch(function () {
        boxes.innerHTML = '<p class="adm-muted small">❌ সার্ভারে পৌঁছানো যাচ্ছে না — ইন্টারনেট ও Deploy চেক করুন।</p>';
      });
  }

  /* ---------- রেন্ডার (আপনার CSS ক্লাস দিয়েই) ---------- */
  function box(label, n) {
    return '<div class="adm-card" style="box-shadow:none"><b style="font-size:1.35rem;color:var(--primary)">' +
      (n || 0) + '</b><div class="adm-muted small">' + label + '</div></div>';
  }

  function render() {
    var d = state.data;
    if (!d) return;
    var boxes = document.getElementById("tezoPstatsBoxes");
    var rows = d.rows.slice();
    if (state.q) rows = rows.filter(function (r) {
      var i = info(r.id);
      return (i.title + " " + i.topic + " " + i.sub + " " + r.id).toLowerCase().indexOf(state.q) >= 0;
    });
    rows.sort(function (a, b) {
      var x = a[state.sort], y = b[state.sort];
      return (typeof x === "string" ? x.localeCompare(y) : ((x || 0) - (y || 0))) * state.dir;
    });

    boxes.innerHTML =
      box("👁 মোট ভিউ", d.totals.views) +
      box("📋 মোট কপি", d.totals.copies) +
      box("❤️ মোট লাইক", d.totals.likes) +
      box("🔥 ট্রেন্ডিংয়ে এখন", d.rows.filter(function (r) { return r.score7 > 0; }).length) +
      box("🧾 ট্র্যাক হচ্ছে", d.rows.length);

    /* টপ-১০ */
    var top = d.rows.slice(0, 10);
    document.getElementById("tezoPstatsTop").innerHTML = top.map(function (r, i) {
      var inf = info(r.id);
      return '<div class="adm-barline"><span>' + (i + 1) + '. <b>' + esc(inf.title) + '</b>' +
        ' <span class="adm-muted small">' + esc(inf.topic ? inf.topic + " › " + inf.sub : "") + '</span></span>' +
        '<span class="adm-muted small">🔥 ' + r.score7 + ' · 📋 ' + r.copies + ' · ❤️ ' + r.likes + ' · 👁 ' + r.views + '</span></div>';
    }).join("") || '<p class="adm-muted small">এখনো ডাটা জমেনি — ইউজার এলেই শুরু হবে।</p>';

    /* টেবিল */
    var cols = [
      ["title", "প্রম্পট"], ["topic", "টপিক › সাব"], ["views", "👁 ভিউ"],
      ["copies", "📋 কপি"], ["likes", "❤️ লাইক"], ["score7", "🔥 স্কোর"], ["lastActive", "শেষ অ্যাক্টিভ"]
    ];
    var html = "<thead><tr>" + cols.map(function (c) {
      return '<th data-k="' + c[0] + '" style="padding:8px 10px;text-align:left;cursor:pointer;position:sticky;top:0;background:var(--card-2)">' + c[1] + " ⇅</th>";
    }).join("") + "<th style='padding:8px 10px;text-align:left'>স্ট্যাটাস</th></tr></thead><tbody>";
    rows.forEach(function (r) {
      var inf = info(r.id);
      var hot = r.score7 > 0 && top.some(function (t) { return t.id === r.id; });
      html += "<tr style='border-top:1px solid var(--border)'>" +
        "<td style='padding:7px 10px'><b>" + esc(inf.title) + "</b></td>" +
        "<td style='padding:7px 10px' class='adm-muted'>" + esc(inf.topic ? inf.topic + " › " + inf.sub : "—") + "</td>" +
        "<td style='padding:7px 10px'>" + r.views + "</td>" +
        "<td style='padding:7px 10px'>" + r.copies + "</td>" +
        "<td style='padding:7px 10px'>" + r.likes + "</td>" +
        "<td style='padding:7px 10px'><b>" + r.score7 + "</b></td>" +
        "<td style='padding:7px 10px' class='adm-muted'>" + esc(r.lastActive) + "</td>" +
        "<td style='padding:7px 10px'>" + (hot ? "🚀 TRENDING" : (r.views + r.copies + r.likes === 0 ? "<span class='adm-muted small'>জমছে…</span>" : "—")) + "</td></tr>";
    });
    html += "</tbody>";
    var table = document.getElementById("tezoPstatsTable");
    table.innerHTML = html;
    Array.prototype.forEach.call(table.querySelectorAll("th[data-k]"), function (th) {
      th.addEventListener("click", function () {
        var k = th.getAttribute("data-k");
        if (state.sort === k) state.dir *= -1; else { state.sort = k; state.dir = -1; }
        render();
      });
    });
    document.getElementById("tezoPstatsUpd").textContent =
      "আপডেট: " + String(d.generatedAt || "").replace("T", " ").slice(0, 16);
  }

  function exportCsv() {
    var d = state.data;
    if (!d) return;
    var lines = ["id,title,topic,sub,views,copies,likes,score7d,lastActive"];
    d.rows.forEach(function (r) {
      var i = info(r.id);
      lines.push([r.id, '"' + i.title.replace(/"/g, '""') + '"', i.topic, i.sub, r.views, r.copies, r.likes, r.score7, r.lastActive].join(","));
    });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8" }));
    a.download = "tezofy-prompt-stats-" + new Date().toISOString().slice(0, 10) + ".csv";
    a.click();
  }

  /* ---------- অটো-স্টার্ট: ট্যাব খুললেই লোড ---------- */
  document.addEventListener("click", function (e) {
    var b = e.target && e.target.closest ? e.target.closest(".adm-tab") : null;
    if (b && b.dataset.tab === "analytics") { setTimeout(function () { inject(); load(); }, 60); }
  }, true);

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", function () { inject(); });
  else inject();
  loadInfo();

  return { inject: inject, load: load };
})();

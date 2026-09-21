/* 🎡 TEZOFY Daily Magic Spin — standalone popup engine (no dependencies, site-theme aware)
   ─────────────────────────────────────────────────────────────────────────────
   Usage:
     <script src="assets/js/magic-spin.js" defer></script>
     <script>window.addEventListener("DOMContentLoaded", function () {
       window.tzSpin && tzSpin.init({ auto: true });   // auto popup once per day
     });</script>
   Open manually (from any button): tzSpin.open();
   ───────────────────────────────────────────────────────────────────────────── */
(function () {
  "use strict";

  var KEY = "tzspin_last";
  var S = { built: false, run: 0, prompt: "", img: "" };

  /* ---------- day gate: once per day ---------- */
  function today() { var d = new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }
  function seenToday() { try { return localStorage.getItem(KEY) === today(); } catch (e) { return false; } }
  function markToday() { try { localStorage.setItem(KEY, today()); } catch (e) {} }

  /* ---------- prompt source: PROMPTS from data.js (main site), else built-in list ---------- */
  var FALLBACK = [
    "Festive night portrait of a young woman in a white saree with red border before a glowing Durga Puja pandal, marigold garlands, golden bokeh, cinematic, 8k",
    "Neon cyberpunk street food vendor in Dhaka rain, glowing reflections, moody cinematic light, 8k",
    "Royal king on a golden throne, dramatic spotlights, velvet cape, cinematic film still, 8k",
    "Astronaut cat floating in pastel space among glowing jellyfish stars, dreamy 3d render, 8k",
    "1950s vintage cafe on a monsoon evening, soft film grain, nostalgic warm tones, 8k",
    "Dreamlike painterly portrait with floating marigold petals, golden hour glow, 8k",
    "Minimal floating teacup with swirling steam galaxies, elegant dark studio light, 8k",
    "Anime girl with a glowing umbrella on a rainy neon bridge, vibrant reflections, 8k"
  ];
  function pickPrompt() {
    try {
      if (window.PROMPTS && PROMPTS.length) {
        var p = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
        var t = (p.prompt || p.tagline || "").replace(/\[[^\]]+\]/g, function (m) { return m.slice(1, -1).toLowerCase(); });
        if (t.trim().length > 20) return t.trim();
      }
    } catch (e) {}
    return FALLBACK[Math.floor(Math.random() * FALLBACK.length)];
  }

  /* ---------- styles (site-variable aware, with fallbacks) ---------- */
  var CSS = ""
    + ".ms-ov{position:fixed;inset:0;z-index:200;display:none;align-items:center;justify-content:center;padding:18px;"
    + "background:rgba(4,4,8,.72);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}"
    + ".ms-ov.open{display:flex}"
    + ".ms-card{width:min(430px,100%);max-height:92vh;overflow-y:auto;position:relative;border-radius:20px;"
    + "background:var(--card,#171832);border:1px solid var(--border,#26263a);box-shadow:var(--shadow,0 24px 70px rgba(0,0,0,.5));"
    + "animation:msUp .28s ease;color:var(--text,#fff);font-family:var(--font,system-ui,sans-serif)}"
    + "@keyframes msUp{from{transform:translateY(26px);opacity:0}}"
    + ".ms-x{position:absolute;top:10px;right:10px;z-index:3;width:32px;height:32px;border-radius:50%;border:1px solid var(--border,#26263a);"
    + "background:var(--card-2,#1d1e30);color:var(--muted-2,#8a8aa8);font-size:14px;cursor:pointer;font-family:inherit}"
    + ".ms-x:hover{color:var(--pink,#FF2DAA);border-color:var(--pink,#FF2DAA)}"
    + ".ms-head{padding:20px 20px 0;text-align:center}"
    + ".ms-badge{display:inline-flex;align-items:center;gap:7px;padding:6px 14px;border-radius:999px;font-size:.72rem;font-weight:800;"
    + "letter-spacing:.08em;text-transform:uppercase;color:#ffb4dd;background:var(--grad-soft,rgba(255,45,170,.14));border:1px solid rgba(255,45,170,.35)}"
    + ".ms-head h3{margin:12px 0 4px;font-size:1.25rem;font-weight:800}"
    + ".ms-head p{margin:0;font-size:.82rem;color:var(--muted,#a2a3c3)}"
    + ".ms-body{padding:18px 20px 20px;text-align:center}"
    + ".ms-wheel{font-size:64px;line-height:1;margin:8px 0 14px;display:inline-block;animation:msFloat 3s ease-in-out infinite}"
    + "@keyframes msFloat{0%,100%{transform:translateY(0) rotate(-6deg)}50%{transform:translateY(-8px) rotate(6deg)}}"
    + ".ms-reel{min-height:76px;display:flex;align-items:center;justify-content:center;border-radius:14px;margin:6px 0 4px;padding:12px;"
    + "background:var(--card-2,#1d1e30);border:1px solid var(--border,#26263a);font-size:.92rem;font-weight:700;color:var(--text,#fff)}"
    + ".ms-msg{font-size:.78rem;color:var(--muted-2,#8a8aa8);min-height:20px;margin-top:6px}"
    + ".ms-cta{width:100%;margin-top:12px;padding:14px;border:none;border-radius:12px;background:var(--grad,linear-gradient(135deg,#FF2DAA,#FF7A00));"
    + "color:#fff;font-size:.95rem;font-weight:800;cursor:pointer;font-family:inherit;box-shadow:0 8px 26px rgba(255,45,170,.35);transition:.15s}"
    + ".ms-cta:hover:not(:disabled){transform:translateY(-1px)}"
    + ".ms-cta:disabled{opacity:.55;cursor:wait}"
    + ".ms-skip{display:inline-block;margin-top:11px;background:none;border:none;color:var(--muted-2,#8a8aa8);font-size:.8rem;font-weight:650;"
    + "cursor:pointer;font-family:inherit;text-decoration:underline;text-underline-offset:3px}"
    + ".ms-skip:hover{color:var(--text,#fff)}"
    + ".ms-spin{width:52px;height:52px;border-radius:50%;border:4px solid var(--border,#26263a);border-top-color:var(--pink,#FF2DAA);"
    + "animation:msRot 1s linear infinite;margin:26px auto 14px}"
    + "@keyframes msRot{to{transform:rotate(360deg)}}"
    + ".ms-img{width:100%;border-radius:14px;display:block;border:1px solid var(--border,#26263a);aspect-ratio:896/1152;object-fit:cover;background:var(--card-2,#1d1e30)}"
    + ".ms-cap{font-size:.72rem;color:var(--muted-2,#8a8aa8);line-height:1.6;margin-top:9px;text-align:left;display:-webkit-box;"
    + "-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}"
    + ".ms-acts{display:flex;gap:8px;margin-top:12px}"
    + ".ms-act{flex:1;display:inline-flex;align-items:center;justify-content:center;gap:5px;padding:10px 8px;border-radius:10px;font-size:.76rem;"
    + "font-weight:700;cursor:pointer;font-family:inherit;border:1px solid var(--border,#26263a);background:var(--card-2,#1d1e30);color:var(--text,#fff);text-decoration:none;transition:.14s}"
    + ".ms-act:hover{border-color:var(--pink,#FF2DAA);background:var(--grad-soft,rgba(255,45,170,.14))}"
    + ".ms-act.primary{background:var(--grad,linear-gradient(135deg,#FF2DAA,#FF7A00));border-color:transparent;color:#fff}"
    + "@media (prefers-reduced-motion:reduce){.ms-wheel,.ms-spin{animation:none}}";

  var REEL_WORDS = ["🎞️ Cinematic Portrait", "👑 Royal Throne", "🌧️ Neon Rain", "🐉 Fantasy Dream", "🌌 Space Adventure", "🎆 Festival Lights", "🧞 Magic Lamp", "💫 Dreamy Painting", "🌸 Anime Vibe", "🎡 spinning… spinning…"];

  /* ---------- DOM build ---------- */
  function build() {
    if (S.built) return; S.built = true;
    var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    var ov = document.createElement("div");
    ov.className = "ms-ov"; ov.id = "msOv";
    ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true"); ov.setAttribute("aria-label", "Daily Magic Spin");
    ov.innerHTML = ""
      + '<div class="ms-card">'
      + '<button class="ms-x" id="msX" aria-label="Close">✕</button>'
      + '<div class="ms-head"><span class="ms-badge">🎡 Daily Magic Spin</span>'
      + "<h3>Spin today's luck!</h3>"
      + "<p>One tap — a random premium prompt plus an AI-painted image, totally free.</p></div>"
      + '<div class="ms-body" id="msBody"></div>'
      + "</div>";
    document.body.appendChild(ov);
    ov.addEventListener("click", function (e) { if (e.target === ov) close(); });
    document.getElementById("msX").addEventListener("click", close);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }

  function rscan() { try { if (window.TZI18N && TZI18N.scan) TZI18N.scan(document.getElementById("msOv")); } catch (e) {} }

  /* ---------- stages ---------- */
  function stageInvite() {
    var b = document.getElementById("msBody");
    b.innerHTML = ""
      + '<span class="ms-wheel">🎡</span>'
      + '<div class="ms-msg">Once a day — spin and let fate forge your prompt!</div>'
      + '<button class="ms-cta" id="msGo">🎡 Spin Now</button>'
      + '<button class="ms-skip" id="msSkip">Not now →</button>';
    document.getElementById("msGo").addEventListener("click", spin);
    document.getElementById("msSkip").addEventListener("click", close);
    rscan();
  }
  function stageReel() {
    var b = document.getElementById("msBody");
    b.innerHTML = '<div class="ms-reel" id="msReel">🎡 spinning…</div><div class="ms-msg">✨ Picking your luck…</div>';
    var i = 0;
    var iv = setInterval(function () {
      var r = document.getElementById("msReel");
      if (!r) { clearInterval(iv); return; }
      r.textContent = REEL_WORDS[i % REEL_WORDS.length]; i++;
    }, 90);
    return iv;
  }
  function stageLoading() {
    var b = document.getElementById("msBody");
    b.innerHTML = '<div class="ms-spin"></div><div class="ms-msg" style="color:var(--pink,#FF2DAA);font-weight:700">🎨 AI is painting your magic…</div>'
      + '<div class="ms-msg">usually 20–60 seconds — one cup of tea ☕</div>';
  }
  function stageResult() {
    var b = document.getElementById("msBody");
    b.innerHTML = ""
      + '<img class="ms-img" id="msImg" alt="Your magic spin result">'
      + '<div class="ms-cap">🎁 ' + escHtml(S.prompt) + "</div>"
      + '<div class="ms-acts">'
      + '<button class="ms-act primary" id="msDl">⬇ download</button>'
      + '<a class="ms-act" id="msGen" href="#" target="_self">✨ Generate</a>'
      + "</div>"
      + '<div class="ms-acts" style="margin-top:8px">'
      + '<button class="ms-act" id="msAgain">🔁 Spin again</button>'
      + '<button class="ms-act" id="msDone">Loved it! ✕</button>'
      + "</div>";
    var im = document.getElementById("msImg"); im.src = S.img;
    document.getElementById("msGen").href = "ai-generator.html?p=" + encodeURIComponent(S.prompt);
    document.getElementById("msDl").addEventListener("click", download);
    document.getElementById("msAgain").addEventListener("click", spin);
    document.getElementById("msDone").addEventListener("click", close);
    rscan();
  }
  function stageFail() {
    var b = document.getElementById("msBody");
    b.innerHTML = ""
      + '<span class="ms-wheel">😵</span>'
      + '<div class="ms-msg">The engine is a bit busy — spin again in a moment!</div>'
      + '<button class="ms-cta" id="msRetry">🔁 Try again</button>'
      + '<button class="ms-skip" id="msLater">Later →</button>';
    document.getElementById("msRetry").addEventListener("click", spin);
    document.getElementById("msLater").addEventListener("click", close);
    rscan();
  }

  function escHtml(s) {
    return (s || "").replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }

  /* ---------- spin → image ---------- */
  function spin() {
    var myRun = ++S.run;
    var reel = stageReel();
    setTimeout(function () {
      if (myRun !== S.run) return;
      clearInterval(reel);
      S.prompt = pickPrompt();
      var seed = Math.floor(Math.random() * 999999999);
      S.img = "https://image.pollinations.ai/prompt/" + encodeURIComponent(S.prompt)
        + "?width=896&height=1152&seed=" + seed + "&model=flux&nologo=true&safe=true";
      stageLoading(); rscan();
      var img = new Image();
      var killer = setTimeout(function () { img.src = ""; if (myRun === S.run) stageFail(); }, 95000);
      img.onload = function () { clearTimeout(killer); if (myRun === S.run) stageResult(); };
      img.onerror = function () { clearTimeout(killer); if (myRun === S.run) stageFail(); };
      img.src = S.img;
    }, 1300);
  }

  function download() {
    if (!S.img) return;
    fetch(S.img).then(function (r) { return r.blob(); }).then(function (bl) {
      var a = document.createElement("a");
      a.href = URL.createObjectURL(bl);
      a.download = "tezofy-magic-spin.jpg";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
    }).catch(function () { window.open(S.img, "_blank"); });
  }

  /* ---------- open/close ---------- */
  function open() {
    build();
    if (!document.getElementById("msBody").innerHTML) stageInvite();
    var ov = document.getElementById("msOv");
    ov.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function close() {
    var ov = document.getElementById("msOv");
    if (!ov) return;
    ov.classList.remove("open");
    document.body.style.overflow = "";
    S.run++;                       // invalidate any in-flight load
    markToday();                   // skipping also mutes it for today
  }

  /* ---------- public API ---------- */
  window.tzSpin = {
    init: function (opts) {
      build();
      if (opts && opts.auto && !seenToday()) {
        setTimeout(function () { if (!seenToday()) open(); }, 900);
      }
    },
    open: open,
    close: close
  };
})();

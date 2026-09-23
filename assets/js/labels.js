/* ============================================================
   TEZOFY — Global Label System (v1.0)
   সাইটের সব ক্যাটাগরি/লেবেলের একমাত্র সত্যের উৎস (single source of truth)।

   এই একটি ফাইল বদলালেই সব জায়গায় নাম+ইমোজি বদলে যায়:
     • হোম-পেজের ক্যাটাগরি গ্রিড (app.js pageHome)
     • Discover-এর ফিল্টার চিপ (app.js pageDiscover)
     • Category পেজের টাইটেল/বর্ণনা (app.js pageCategory)
     • সার্চ-রেজাল্টের ক্যাটাগরি নাম (app.js catName)
     • ♾️ Infinite Library-র পিল (infinite.html)
     • 🧬 Prompt Maker-এর পিল (maker.html)

   গঠন:
     type "collection" → ডাইনামিক সেকশন (Trending/Popular) — কনটেন্ট ক্যাটাগরি নয়
     type "category"   → আসল কনটেন্ট ক্যাটাগরি
     engine            → infinite-engine.js-এর CATS কী (টুল-পেজে ওই ক্যাটের স্লট আছে)
     aliases           → পুরনো/শিট-আইডি যেগুলো এই লেবেলে মিশে যাবে
                          (যেমন Google Sheet-এর "happy-birthday" → "birthday")
   ============================================================ */
(function (root) {
  "use strict";

  var COLLECTIONS = [
    { id: "trending", type: "collection", name: "Trending",        emoji: "⚡", bn: "ট্রেন্ডিং",
      desc: "The prompts everyone is creating with right now" },
    { id: "popular",  type: "collection", name: "Popular",         emoji: "🔥", bn: "জনপ্রিয়",
      desc: "Most-copied templates loved by the community" }
  ];

  var CATEGORIES = [
    { id: "festival",     type: "category", engine: "festival",     name: "Festival Themes",             emoji: "🪔", bn: "উৎসব",
      desc: "Durga Puja, Eid, Diwali & seasonal celebration prompts", aliases: [] },
    { id: "couple",       type: "category", engine: "couple",       name: "Couple Photos",               emoji: "💑", bn: "কাপল ফটো",
      desc: "Romantic couple portraits for anniversaries and social media", aliases: [] },
    { id: "wedding",      type: "category", engine: "wedding",      name: "Wedding & Bridal",            emoji: "💍", bn: "ওয়েডিং ও ব্রাইডাল",
      desc: "Bridal portraits, wedding moments and celebration frames", aliases: [] },
    { id: "professional", type: "category", engine: "professional", name: "Professional Headshots",      emoji: "💼", bn: "প্রফেশনাল হেডশট",
      desc: "LinkedIn-ready corporate portraits and business headshots", aliases: [] },
    { id: "cinematic",    type: "category", engine: "cinematic",    name: "Cinematic",                   emoji: "🎬", bn: "সিনেম্যাটিক",
      desc: "Movie-poster quality images with dramatic lighting", aliases: [] },
    { id: "retro",        type: "category", engine: "retro",        name: "Retro & Vintage",             emoji: "📸", bn: "রেট্রো ও ভিনটেজ",
      desc: "70s–90s film-inspired portraits with analog grain", aliases: [] },
    { id: "fashion",      type: "category", engine: "fashion",      name: "Fashion & Studio",            emoji: "👗", bn: "ফ্যাশন ও স্টুডিও",
      desc: "Editorial studio portraits and magazine-style looks", aliases: [] },
    { id: "name-art",     type: "category", engine: "name-art",     name: "3D Name Logos",               emoji: "✨", bn: "৩ডি নেম লোগো",
      desc: "Personalized 3D name art with neon, gold and glow styles", aliases: [] },
    { id: "anime",        type: "category", engine: "anime",        name: "Anime & Manga",               emoji: "🌸", bn: "অ্যানিমে ও মাঙ্গা",
      desc: "Japanese anime-style character portraits and illustrations", aliases: [] },
    { id: "nature",       type: "category", engine: "nature",       name: "Nature & Landscapes",         emoji: "🌿", bn: "নেচার ও ল্যান্ডস্কেপ",
      desc: "Breathtaking landscape and nature scene prompts", aliases: [] },

    /* --- ইঞ্জিন v2 — নতুন ক্যাটাগরি --- */
    { id: "birthday",     type: "category", engine: "birthday",     name: "Birthday",                    emoji: "🎂", bn: "জন্মদিন",
      desc: "Scrapbook birthday posters with names, calendars & doodle art", aliases: ["happy-birthday"] },
    { id: "family",       type: "category", engine: "family",       name: "Family",                      emoji: "👨‍👩‍👧", bn: "ফ্যামিলি",
      desc: "Coordinated family portraits and matching-outfit classics", aliases: [] },
    { id: "maternity",    type: "category", engine: "maternity",    name: "Maternity",                   emoji: "🤰", bn: "মাতৃত্ব",
      desc: "Elegant maternity editorials with a soft golden glow", aliases: [] },
    { id: "threed",       type: "category", engine: "threed",       name: "3D Portraits",                emoji: "🧊", bn: "৩ডি পোর্ট্রেট",
      desc: "Hyper-realistic 3D character portraits with custom names", aliases: [] },

    /* --- সাইট/শিটে থাকা ক্যাটাগরি — এখন ইঞ্জিনেও আছে --- */
    { id: "men",          type: "category", engine: "men",          name: "Men Style",                   emoji: "🧔", bn: "পুরুষ স্টাইল",
      desc: "Groom editorials, streetwear & sharp menswear portraits", aliases: ["men-style"] },
    { id: "women",        type: "category", engine: "women",        name: "Women's Fashion",             emoji: "💃", bn: "নারী ফ্যাশন",
      desc: "Couture, saree & editorial fashion portraits", aliases: ["women-s-fashion"] },
    { id: "calendar",     type: "category", engine: "calendar",     name: "Calendar",                    emoji: "🗓️", bn: "ক্যালেন্ডার",
      desc: "Personalized monthly calendar posters with names", aliases: [] },
    { id: "baby",         type: "category", engine: "baby",         name: "Little Baby",                 emoji: "👣", bn: "ছোট শিশু",
      desc: "Soft newborn & baby portraits in pastel themes", aliases: ["little-baby"] },
    { id: "retro80s",     type: "category", engine: "retro80s",     name: "80s Photo",                   emoji: "📼", bn: "৮০-এর দশকের ফটো",
      desc: "Neon, VHS & retro film looks from the cassette era", aliases: ["80s-photo"] },
    { id: "engagement",   type: "category", engine: "engagement",   name: "Engagement & Ring Ceremony",  emoji: "💍", bn: "এনগেজমেন্ট ও রিং সেরেমনি",
      desc: "Ring ceremonies, proposals & pre-wedding moments", aliases: ["engagement-ring-ceremony"] },
    { id: "anniversary",  type: "category", engine: "anniversary",  name: "Anniversary Celebration",     emoji: "💖", bn: "বার্ষিকী উদযাপন",
      desc: "Anniversary posters & celebration portraits", aliases: ["anniversary-celebration"] }
  ];

  var ALL = COLLECTIONS.concat(CATEGORIES);
  var byId = {}, byEngine = {}, aliasMap = {};
  ALL.forEach(function (l) {
    byId[l.id] = l;
    if (l.engine) byEngine[l.engine] = l;
    (l.aliases || []).forEach(function (a) { aliasMap[a] = l.id; });
  });

  var L = {
    version: "1.0",
    collections: COLLECTIONS,
    categories: CATEGORIES,
    all: ALL,

    /* আইডি বা অ্যালায়াস → ক্যানোনিকাল আইডি (না পেলে null) */
    canonical: function (id) {
      if (!id) return null;
      if (byId[id]) return id;
      return aliasMap[id] || null;
    },
    /* আইডি/অ্যালায়াস → লেবেল অবজেক্ট */
    labelFor: function (id) {
      var c = L.canonical(id);
      return c ? byId[c] : null;
    },
    /* ইঞ্জিন-কী → লেবেল অবজেক্ট (ইঞ্জিনের নিজস্ব লেবেল ফলব্যাক) */
    labelForEngine: function (engineKey, engineCat) {
      if (byEngine[engineKey]) return byEngine[engineKey];
      if (engineCat) return { id: engineKey, name: engineCat.label, emoji: engineCat.emoji, engine: engineKey };
      return null;
    },
    /* ক্যাটাগরির বাংলা নাম (i18n-এর জন্য) */
    bnName: function (id) {
      var l = L.labelFor(id);
      return l && l.bn ? l.bn : null;
    }
  };

  if (typeof module === "object" && module.exports) module.exports = L;
  else root.TEZOFY_LABELS = L;
})(typeof window !== "undefined" ? window : globalThis);

/* ============================================================
   TEZOFY — Global Label System (v2.0 — 20 main categories)
   Single source of truth for every category name + emoji on the
   site: home grid, discover chips, category pages, search labels
   and the tool pages (infinite / maker).

   v2.0 — the 20 main categories now mirror the topic system:
     • id      = topic id (assets/js/tezo-topics.js) — stable
     • aliases = every legacy Sheet/site category id that folds
                 into this category, so old links and old Sheet
                 rows keep working without any data migration
     • engine  = infinite-engine.js slot (labelForEngine falls
                 back gracefully for anything unmapped)
   ============================================================ */
(function (root) {
  "use strict";

  var COLLECTIONS = [
    { id: "trending", type: "collection", name: "Trending", emoji: "⚡", bn: "ট্রেন্ডিং",
      desc: "The prompts everyone is creating with right now" },
    { id: "popular",  type: "collection", name: "Popular",  emoji: "🔥", bn: "জনপ্রিয়",
      desc: "Most-copied templates loved by the community" }
  ];

  var CATEGORIES = [
    { id: "festival",       type: "category", engine: "festival",     name: "Festival & Celebrations", emoji: "🪔", bn: "উৎসব ও উদযাপন",
      desc: "Durga Puja, Eid, Diwali & every celebration of the year", aliases: [] },
    { id: "birthday",       type: "category", engine: "birthday",     name: "Birthday",                emoji: "🎂", bn: "জন্মদিন",
      desc: "Birthday posters, name cakes & party portraits for every age", aliases: ["happy-birthday", "calendar"] },
    { id: "love-couple",    type: "category", engine: "couple",       name: "Love & Couple",           emoji: "💑", bn: "ভালোবাসা ও কাপল",
      desc: "Romantic couple portraits for anniversaries and social media", aliases: ["couple", "anniversary", "anniversary-celebration"] },
    { id: "wedding",        type: "category", engine: "wedding",      name: "Wedding & Bridal",        emoji: "💍", bn: "বিয়ে ও বধূ",
      desc: "Bridal portraits, wedding moments and celebration frames", aliases: ["engagement", "engagement-ring-ceremony"] },
    { id: "men-style",      type: "category", engine: "men",          name: "Men Style",               emoji: "🧔", bn: "পুরুষদের স্টাইল",
      desc: "Groom editorials, streetwear & sharp menswear portraits", aliases: ["men"] },
    { id: "women-fashion",  type: "category", engine: "women",        name: "Women's Fashion",         emoji: "👗", bn: "নারীদের ফ্যাশন",
      desc: "Couture, saree & editorial fashion portraits", aliases: ["women", "women-s-fashion", "fashion"] },
    { id: "family-kids",    type: "category", engine: "family",       name: "Family & Kids",           emoji: "👨‍👩‍👧", bn: "পরিবার ও শিশু",
      desc: "Newborns, kids themes, maternity & coordinated family portraits", aliases: ["family", "baby", "little-baby", "maternity"] },
    { id: "friends-group",  type: "category", name: "Friends & Group",   emoji: "🤝", bn: "বন্ধু ও গ্রুপ",
      desc: "Squads, adda & unforgettable group moments", aliases: [] },
    { id: "professional",   type: "category", engine: "professional", name: "Professional",             emoji: "💼", bn: "পেশা ও প্রফেশনাল",
      desc: "LinkedIn-ready corporate portraits and business headshots", aliases: [] },
    { id: "devotional",     type: "category", name: "Devotional & Spiritual", emoji: "🕉️", bn: "ধর্মীয় ও ভক্তিমূলক",
      desc: "Deity art, calligraphy & sacred aesthetic portraits", aliases: [] },
    { id: "name-text-art",  type: "category", engine: "name-art",     name: "Name & Text Art",         emoji: "✨", bn: "নাম ও টেক্সট আর্ট",
      desc: "Personalized 3D name art with neon, gold and glow styles", aliases: ["name-art"] },
    { id: "nature-seasons", type: "category", engine: "nature",       name: "Nature & Seasons",        emoji: "🌿", bn: "প্রকৃতি ও ঋতু",
      desc: "Breathtaking landscape, monsoon and seasonal scene prompts", aliases: ["nature"] },
    { id: "travel-places",  type: "category", name: "Travel & Places",   emoji: "✈️", bn: "ভ্রমণ ও স্থান",
      desc: "From Cox's Bazar to world landmarks — journey-ready scenes", aliases: [] },
    { id: "animals-pets",   type: "category", name: "Animals & Pets",    emoji: "🐾", bn: "প্রাণী ও পোষা",
      desc: "Pets, wildlife & majestic animal portraits", aliases: [] },
    { id: "cinematic",      type: "category", engine: "cinematic",    name: "Cinematic",               emoji: "🎬", bn: "সিনেমাটিক",
      desc: "Movie-poster quality images with dramatic lighting", aliases: [] },
    { id: "retro-vintage",  type: "category", engine: "retro",        name: "Retro & Vintage",         emoji: "📸", bn: "রেট্রো ও ভিনটেজ",
      desc: "70s–90s film-inspired portraits with analog grain", aliases: ["retro", "retro80s", "80s-photo"] },
    { id: "anime-cartoon-3d", type: "category", engine: "anime",      name: "Anime, Cartoon & 3D",     emoji: "🌸", bn: "অ্যানিমে, কার্টুন ও 3D",
      desc: "Anime, chibi, Pixar-style & 3D character portraits", aliases: ["anime", "threed"] },
    { id: "fantasy-scifi",  type: "category", name: "Fantasy & Sci-Fi",  emoji: "🐉", bn: "ফ্যান্টাসি ও সাই-ফাই",
      desc: "Angels, dragons, cyberpunk cities & otherworldly scenes", aliases: [] },
    { id: "sports-attitude", type: "category", name: "Sports & Attitude", emoji: "⚽", bn: "খেলা ও অ্যাটিটিউড",
      desc: "Sports action, gym grit & bold attitude portraits", aliases: [] },
    { id: "lifestyle-aesthetic", type: "category", name: "Lifestyle & Aesthetic", emoji: "☕", bn: "লাইফস্টাইল ও নান্দনিকতা",
      desc: "Café corners, chai moments & everyday beautiful living", aliases: [] }
  ];

  var ALL = COLLECTIONS.concat(CATEGORIES);
  var byId = {}, byEngine = {}, aliasMap = {};
  ALL.forEach(function (l) {
    byId[l.id] = l;
    if (l.engine) byEngine[l.engine] = l;
    (l.aliases || []).forEach(function (a) { aliasMap[a] = l.id; });
  });

  var L = {
    version: "2.0",
    collections: COLLECTIONS,
    categories: CATEGORIES,
    all: ALL,

    /* id or alias → canonical id (null when unknown) */
    canonical: function (id) {
      if (!id) return null;
      if (byId[id]) return id;
      return aliasMap[id] || null;
    },
    /* id or alias → label object */
    labelFor: function (id) {
      var c = L.canonical(id);
      return c ? byId[c] : null;
    },
    /* engine key → label (engine's own label as fallback) */
    labelForEngine: function (engineKey, engineCat) {
      if (byEngine[engineKey]) return byEngine[engineKey];
      if (engineCat) return { id: engineKey, name: engineCat.label, emoji: engineCat.emoji, engine: engineKey };
      return null;
    },
    /* Bengali name of a category (for i18n) */
    bnName: function (id) {
      var l = L.labelFor(id);
      return l && l.bn ? l.bn : null;
    }
  };

  if (typeof module === "object" && module.exports) module.exports = L;
  else root.TEZOFY_LABELS = L;
})(typeof window !== "undefined" ? window : globalThis);

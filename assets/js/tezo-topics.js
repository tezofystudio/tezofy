/* ============================================================
   TEZOFY — FILE 01: TOPICS (নতুন ২০ মূল ক্যাটাগরি + ২২১ সাব)
   ------------------------------------------------------------
   ⚡ এটি একদম নতুন, আলাদা কন্ট্রোল-লেয়ার — আপনার বর্তমান
   CATEGORIES / cats সিস্টেম যেমন আছে তেমনই থাকবে।
   দুটো পাশাপাশি চলবে (পরিপূরক):
     • পুরনো cats  → হোমপেজ সেকশন, পুরনো লিংক (কিছু ভাঙবে না)
     • নতুন TOPICS → নেভিগেশন মেনু, SEO পেজ, অ্যাডমিন অ্যানালিটিক্স,
                      রিলেটেড-প্রম্পট ইঞ্জিন, ভবিষ্যৎ ফিল্টার
   ব্যবহার: প্রতিটি প্রম্পট পাবে ১টি topic + ১টি sub
   (নির্ধারণ করে FILE 02 এর ম্যাপ, অথবা Sheet-এর topic/sub কলাম)।
   ============================================================ */

var TOPICS = [
  {
    id: "festival", name: "Festival & Celebrations", nameBn: "উৎসব ও উদযাপন", icon: "🪔",
    desc: "Durga Puja, Eid, Diwali, Holi & every celebration of the year",
    subs: [
      { id: "durga-puja-sharadiya", name: "Durga Puja & Sharadiya" },
      { id: "eid-ramadan",          name: "Eid & Ramadan" },
      { id: "eid-ul-adha-qurbani",  name: "Eid-ul-Adha & Qurbani" },
      { id: "chand-raat",           name: "Chand Raat & Eid Moon" },
      { id: "diwali-kali-puja",     name: "Diwali & Kali Puja" },
      { id: "holi-dol",             name: "Holi & Dol Purnima" },
      { id: "lakshmi-ganesh",       name: "Lakshmi & Ganesh" },
      { id: "saraswati-puja",       name: "Saraswati Puja" },
      { id: "shiva-devotion",       name: "Shiva Devotion" },
      { id: "janmashtami-krishna",  name: "Janmashtami & Krishna" },
      { id: "navratri-festive-night", name: "Navratri & Festive Night" },
      { id: "buddha-purnima",       name: "Buddha Purnima" },
      { id: "christmas-santa",      name: "Christmas & Santa" },
      { id: "new-year-night",       name: "New Year Night" },
      { id: "pohela-boishakh",      name: "Pohela Boishakh" },
      { id: "basanta-utsav",        name: "Basanta Utsav" },
      { id: "nabanno-poush",        name: "Nabanno & Poush Mela" },
      { id: "festive-portrait",     name: "Festive Portrait" }
    ]
  },
  {
    id: "birthday", name: "Birthday", nameBn: "জন্মদিন", icon: "🎂",
    desc: "Birthday posters, name cakes & party portraits for every age",
    subs: [
      { id: "baby-first-birthday", name: "Baby's 1st Birthday" },
      { id: "kids-theme-party",    name: "Kids Theme Party" },
      { id: "birthday-girl",       name: "Birthday Girl" },
      { id: "birthday-boy",        name: "Birthday Boy" },
      { id: "teen-birthday",       name: "Teen Birthday" },
      { id: "milestone-birthday",  name: "Milestone (18 / 20 / 21 / 50)" },
      { id: "parents-birthday",    name: "Parents Birthday" },
      { id: "grandparents-birthday", name: "Grandparents Birthday" },
      { id: "friends-party",       name: "Friends Party" },
      { id: "couple-birthday",     name: "Couple Birthday" },
      { id: "name-cake",           name: "Name Cake" },
      { id: "birthday-name-art",   name: "Birthday Name Art" }
    ]
  },
  {
    id: "love-couple", name: "Love & Couple", nameBn: "ভালোবাসা ও কাপল", icon: "💑",
    desc: "Romantic couple portraits for anniversaries and social media",
    subs: [
      { id: "golden-hour-romance", name: "Golden Hour Romance" },
      { id: "monsoon-rain-love",   name: "Monsoon Rain Love" },
      { id: "beach-sea-story",     name: "Beach & Sea Story" },
      { id: "garden-romance",      name: "Garden Romance" },
      { id: "city-date-night",     name: "City & Date Night" },
      { id: "coffee-shop-date",    name: "Coffee Shop Date" },
      { id: "bike-ride-love",      name: "Bike Ride Love" },
      { id: "sunset-riverside",    name: "Sunset & Riverside" },
      { id: "vintage-retro-love",  name: "Vintage Retro Love" },
      { id: "long-distance",       name: "Long Distance" },
      { id: "proposal",            name: "Proposal" },
      { id: "anniversary",         name: "Anniversary" },
      { id: "silhouette-love",     name: "Silhouette Love" },
      { id: "cute-cartoon-couple", name: "Cute Cartoon Couple" }
    ]
  },
  {
    id: "wedding", name: "Wedding & Bridal", nameBn: "বিয়ে ও বধূ", icon: "💍",
    desc: "Bridal portraits, wedding moments and celebration frames",
    subs: [
      { id: "bridal-look",           name: "Bridal Look" },
      { id: "groom-look",            name: "Groom Look" },
      { id: "pre-wedding-engagement", name: "Pre-Wedding & Engagement" },
      { id: "holud-haldi",           name: "Holud & Haldi" },
      { id: "mehndi-night",          name: "Mehndi Night" },
      { id: "nikah-ceremony",        name: "Nikah Ceremony" },
      { id: "hindu-wedding",         name: "Hindu Wedding" },
      { id: "christian-wedding",     name: "Christian Wedding" },
      { id: "reception",             name: "Reception" },
      { id: "wedding-story-poster",  name: "Wedding Story Poster" },
      { id: "anniversary-celebration", name: "Wedding Anniversary" },
      { id: "honeymoon",             name: "Honeymoon" },
      { id: "royal-wedding",         name: "Royal Wedding" }
    ]
  },
  {
    id: "men-style", name: "Men Style", nameBn: "পুরুষদের স্টাইল", icon: "🧔",
    desc: "Groom editorials, streetwear & sharp menswear portraits",
    subs: [
      { id: "studio-portrait",     name: "Studio Portrait" },
      { id: "street-casual",       name: "Street & Casual" },
      { id: "formal-suit",         name: "Formal Suit" },
      { id: "panjabi-traditional", name: "Panjabi & Traditional" },
      { id: "sherwani-royal",      name: "Sherwani Royal" },
      { id: "fitness-gym",         name: "Fitness & Gym" },
      { id: "beard-hairstyle",     name: "Beard & Hairstyle" },
      { id: "superbike-rides",     name: "Superbike & Rides" },
      { id: "car-luxury",          name: "Car & Luxury" },
      { id: "hoodie-streetwear",   name: "Hoodie & Streetwear" },
      { id: "retro-classic",       name: "Retro Classic Hero" },
      { id: "king-attitude",       name: "King Attitude" }
    ]
  },
  {
    id: "women-fashion", name: "Women's Fashion", nameBn: "নারীদের ফ্যাশন", icon: "👗",
    desc: "Couture, saree & editorial fashion portraits",
    subs: [
      { id: "saree-elegance",       name: "Saree Elegance" },
      { id: "jamdani-tant",         name: "Jamdani & Tant" },
      { id: "lehenga-ethnic",       name: "Lehenga & Ethnic" },
      { id: "festive-ethnic",       name: "Festive Ethnic" },
      { id: "salwar-kameez",        name: "Salwar Kameez" },
      { id: "hijab-modest",         name: "Hijab & Modest" },
      { id: "gown-western",         name: "Gown & Western" },
      { id: "studio-editorial",     name: "Studio & Editorial" },
      { id: "street-chic",          name: "Street Chic" },
      { id: "traditional-jewellery", name: "Traditional Jewellery" },
      { id: "glam-makeup",          name: "Glam & Makeup" },
      { id: "casual-denim",         name: "Casual & Denim" }
    ]
  },
  {
    id: "family-kids", name: "Family & Kids", nameBn: "পরিবার ও শিশু", icon: "👨‍👩‍👧",
    desc: "Newborns, kids themes, maternity & coordinated family portraits",
    subs: [
      { id: "newborn-baby",     name: "Newborn & Baby" },
      { id: "baby-boy",         name: "Baby Boy" },
      { id: "baby-girl",        name: "Baby Girl" },
      { id: "twins",            name: "Twins" },
      { id: "kids-theme",       name: "Kids Theme" },
      { id: "siblings",         name: "Siblings" },
      { id: "mother-child",     name: "Mother & Child" },
      { id: "father-child",     name: "Father & Child" },
      { id: "grandparents-love", name: "Grandparents Love" },
      { id: "joint-family",     name: "Joint Family" },
      { id: "maternity",        name: "Maternity" }
    ]
  },
  {
    id: "friends-group", name: "Friends & Group", nameBn: "বন্ধু ও গ্রুপ", icon: "🤝",
    desc: "Squads, adda & unforgettable group moments",
    subs: [
      { id: "boys-squad",           name: "Boys Squad" },
      { id: "girls-squad",          name: "Girls Squad" },
      { id: "school-college-friends", name: "School & College Friends" },
      { id: "friends-trip",         name: "Friends Trip" },
      { id: "tea-adda",             name: "Tea & Adda" },
      { id: "concert-group",        name: "Concert Group" },
      { id: "funny-friends",        name: "Funny Friends" },
      { id: "friendship-day",       name: "Friendship Day" }
    ]
  },
  {
    id: "professional", name: "Professional", nameBn: "পেশা ও প্রফেশনাল", icon: "💼",
    desc: "LinkedIn-ready corporate portraits and business headshots",
    subs: [
      { id: "linkedin-headshot",  name: "LinkedIn Headshot" },
      { id: "executive-ceo",      name: "Executive & CEO" },
      { id: "office-story",       name: "Office Story" },
      { id: "doctor",             name: "Doctor" },
      { id: "engineer",           name: "Engineer" },
      { id: "teacher",            name: "Teacher" },
      { id: "army-police",        name: "Army & Police" },
      { id: "entrepreneur",       name: "Entrepreneur" },
      { id: "freelancer-creator", name: "Freelancer & Creator" },
      { id: "chef",               name: "Chef" },
      { id: "farmer",             name: "Farmer" },
      { id: "artist-designer",    name: "Artist & Designer" }
    ]
  },
  {
    id: "devotional", name: "Devotional & Spiritual", nameBn: "ধর্মীয় ও ভক্তিমূলক", icon: "🕉️",
    desc: "Deity art, calligraphy & sacred aesthetic portraits",
    subs: [
      { id: "radha-krishna",       name: "Radha Krishna" },
      { id: "lord-shiva",          name: "Lord Shiva" },
      { id: "maa-durga",           name: "Maa Durga" },
      { id: "maa-kali",            name: "Maa Kali" },
      { id: "lakshmi-ganesha",     name: "Lakshmi & Ganesha" },
      { id: "hanuman",             name: "Hanuman" },
      { id: "ram-sita",            name: "Ram & Sita" },
      { id: "islamic-calligraphy", name: "Islamic Calligraphy" },
      { id: "mosque-architecture", name: "Mosque Architecture" },
      { id: "quran-doa",           name: "Quran & Doa" },
      { id: "jummah-mubarak",      name: "Jummah Mubarak" },
      { id: "jesus-christ",        name: "Jesus Christ" },
      { id: "buddha-dhamma",       name: "Buddha & Dhamma" },
      { id: "om-mandala",          name: "Om & Mandala" }
    ]
  },
  {
    id: "name-text-art", name: "Name & Text Art", nameBn: "নাম ও টেক্সট আর্ট", icon: "✨",
    desc: "Personalized 3D name art with neon, gold and glow styles",
    subs: [
      { id: "3d-golden-letter",   name: "3D Golden Letter" },
      { id: "neon-glow-name",     name: "Neon Glow Name" },
      { id: "name-pendant-locket", name: "Name Pendant & Locket" },
      { id: "name-tattoo",        name: "Name Tattoo" },
      { id: "name-tshirt",        name: "Name on T-Shirt" },
      { id: "bike-name-art",      name: "Bike Name Art" },
      { id: "wings-chair",        name: "Wings Chair" },
      { id: "letter-a-z",         name: "Letter A–Z DP" },
      { id: "couple-name",        name: "Couple Name" },
      { id: "typography-poster",  name: "Typography Poster" },
      { id: "birthday-name-art", name: "Birthday Name Art" },
      { id: "shadow-silhouette",  name: "Shadow & Silhouette" },
      { id: "quote-text-art",     name: "Quote Text Art" }
    ]
  },
  {
    id: "nature-seasons", name: "Nature & Seasons", nameBn: "প্রকৃতি ও ঋতু", icon: "🌿",
    desc: "Breathtaking landscape, monsoon and seasonal scene prompts",
    subs: [
      { id: "monsoon-rain",     name: "Monsoon & Rain" },
      { id: "golden-hour",      name: "Golden Hour" },
      { id: "kashful-autumn",   name: "Kashful & Autumn" },
      { id: "winter-fog",       name: "Winter & Fog" },
      { id: "spring-blossom",   name: "Spring & Blossom" },
      { id: "tea-gardens",      name: "Tea Gardens" },
      { id: "river-boat",       name: "River & Boat" },
      { id: "paddy-fields",     name: "Fields & Meadows" },
      { id: "flowers-garden",   name: "Flowers & Garden" },
      { id: "sky-clouds",       name: "Sky & Clouds" },
      { id: "moonlit-night",    name: "Moonlit Night" },
      { id: "seascape",         name: "Seascape" }
    ]
  },
  {
    id: "travel-places", name: "Travel & Places", nameBn: "ভ্রমণ ও স্থান", icon: "✈️",
    desc: "From Cox's Bazar to world landmarks — journey-ready scenes",
    subs: [
      { id: "cox-bazar",        name: "Cox's Bazar & Saint Martin" },
      { id: "sajek-bandarban",  name: "Sajek & Bandarban Hills" },
      { id: "sundarbans",       name: "Sundarbans" },
      { id: "sylhet-valleys",   name: "Sylhet Valleys" },
      { id: "padma-bridge",     name: "Padma Bridge" },
      { id: "old-dhaka",        name: "Old Dhaka Heritage" },
      { id: "world-landmarks",  name: "World Landmarks" },
      { id: "village-life",     name: "Village Life" },
      { id: "city-life",        name: "City Life" },
      { id: "street-photography", name: "Street Photography" }
    ]
  },
  {
    id: "animals-pets", name: "Animals & Pets", nameBn: "প্রাণী ও পোষা", icon: "🐾",
    desc: "Pets, wildlife & majestic animal portraits",
    subs: [
      { id: "cat",              name: "Cat" },
      { id: "dog",              name: "Dog" },
      { id: "horse",            name: "Horse" },
      { id: "royal-bengal-tiger", name: "Royal Bengal Tiger" },
      { id: "birds",            name: "Birds" },
      { id: "butterfly",        name: "Butterfly & Insects" },
      { id: "pet-with-owner",   name: "Pet with Owner" },
      { id: "wild-animals",     name: "Wild Animals" }
    ]
  },
  {
    id: "cinematic", name: "Cinematic", nameBn: "সিনেমাটিক", icon: "🎬",
    desc: "Movie-poster quality images with dramatic lighting",
    subs: [
      { id: "cinematic-noir",     name: "Cinematic Noir" },
      { id: "neon-night",         name: "Neon Night" },
      { id: "movie-poster",       name: "Movie Poster" },
      { id: "action-scene",       name: "Action Scene" },
      { id: "dramatic-lighting",  name: "Dramatic Lighting" },
      { id: "film-35mm",          name: "Film 35mm" },
      { id: "bollywood-style",    name: "Bollywood Style" },
      { id: "historical-epic",    name: "Historical Epic" }
    ]
  },
  {
    id: "retro-vintage", name: "Retro & Vintage", nameBn: "রেট্রো ও ভিনটেজ", icon: "📸",
    desc: "70s–90s film-inspired portraits with analog grain",
    subs: [
      { id: "vintage-70s",      name: "Vintage 70s" },
      { id: "80s-vhs-neon",     name: "80s VHS & Neon" },
      { id: "90s-film",         name: "90s Film" },
      { id: "retro-selfie",     name: "Retro Selfie" },
      { id: "vintage-couple",   name: "Vintage Couple" },
      { id: "old-heritage-look", name: "Old Heritage Look" },
      { id: "antique-royal",    name: "Antique & Royal" }
    ]
  },
  {
    id: "anime-cartoon-3d", name: "Anime, Cartoon & 3D", nameBn: "অ্যানিমে, কার্টুন ও 3D", icon: "🌸",
    desc: "Anime, chibi, Pixar-style & 3D character portraits",
    subs: [
      { id: "anime-manga",   name: "Anime & Manga" },
      { id: "chibi-cute",    name: "Chibi & Cute" },
      { id: "disney-pixar",  name: "Disney & Pixar Style" },
      { id: "ghibli-style",  name: "Ghibli Style" },
      { id: "3d-character",  name: "3D Character" },
      { id: "cartoon-couple", name: "Cartoon Couple" },
      { id: "clay-art",      name: "Clay Art" },
      { id: "sticker-emoji", name: "Sticker & Emoji" },
      { id: "comic-pop",     name: "Comic & Pop" }
    ]
  },
  {
    id: "fantasy-scifi", name: "Fantasy & Sci-Fi", nameBn: "ফ্যান্টাসি ও সাই-ফাই", icon: "🐉",
    desc: "Angels, dragons, cyberpunk cities & otherworldly scenes",
    subs: [
      { id: "angel-celestial",  name: "Angel & Celestial" },
      { id: "fairy-tale",       name: "Fairy Tale" },
      { id: "dragon-world",     name: "Dragon World" },
      { id: "unicorn-magic",    name: "Unicorn Magic" },
      { id: "mermaid-ocean",    name: "Mermaid & Ocean" },
      { id: "wizard-magic",     name: "Wizard & Magic" },
      { id: "galaxy-space",     name: "Galaxy & Space" },
      { id: "cyberpunk-neon",   name: "Cyberpunk Neon" },
      { id: "robot-ai",         name: "Robot & AI" },
      { id: "superhero",        name: "Superhero" },
      { id: "mythological-epic", name: "Mythological Epic" }
    ]
  },
  {
    id: "sports-attitude", name: "Sports & Attitude", nameBn: "খেলা ও অ্যাটিটিউড", icon: "⚽",
    desc: "Sports action, gym grit & bold attitude portraits",
    subs: [
      { id: "cricket",           name: "Cricket" },
      { id: "football",          name: "Football" },
      { id: "kabaddi",           name: "Kabaddi" },
      { id: "gym-bodybuilding",  name: "Gym & Bodybuilding" },
      { id: "yoga-fitness",      name: "Yoga & Fitness" },
      { id: "boxing-mma",        name: "Boxing & MMA" },
      { id: "cycling-swimming",  name: "Cycling & Swimming" },
      { id: "attitude-boy",      name: "Attitude Boy" },
      { id: "attitude-girl",     name: "Attitude Girl" },
      { id: "luxury-lifestyle",  name: "Luxury Lifestyle" }
    ]
  },
  {
    id: "lifestyle-aesthetic", name: "Lifestyle & Aesthetic", nameBn: "লাইফস্টাইল ও নান্দনিকতা", icon: "☕",
    desc: "Café corners, chai moments & everyday beautiful living",
    subs: [
      { id: "chai-coffee",    name: "Chai & Coffee" },
      { id: "street-food",    name: "Street Food" },
      { id: "biryani-sweets", name: "Biryani & Sweets" },
      { id: "cafe-aesthetic", name: "Café Aesthetic" },
      { id: "night-city",     name: "Night City" },
      { id: "book-study",     name: "Book & Study" },
      { id: "music-dance",    name: "Music & Dance" },
      { id: "home-interior",  name: "Home & Interior" },
      { id: "mood-quotes",    name: "Mood & Quotes" },
      { id: "iftar-ramadan",  name: "Iftar & Ramadan Nights" }
    ]
  }
];

/* ============================================================
   হেল্পার API — app.js / admin যেকোনো জায়গা থেকে ডাকা যাবে
   ============================================================ */
var TezoTopic = (function () {
  function all() { return TOPICS; }
  function byId(id) {
    for (var i = 0; i < TOPICS.length; i++) if (TOPICS[i].id === id) return TOPICS[i];
    return null;
  }
  function subById(topicId, subId) {
    var t = byId(topicId);
    if (!t) return null;
    for (var i = 0; i < t.subs.length; i++) if (t.subs[i].id === subId) return t.subs[i];
    return null;
  }
  /* প্রম্পটের টপিক+সাব বের করা (লেজি — রিমোট লোডের পরেও কাজ করে)
     প্রাধান্য: ① p.topic/p.sub (Sheet-কলাম) ② TOPIC_MIGRATE ③ CAT_TO_TOPIC ④ null */
  function of(p) {
    if (!p) return null;
    if (p.topic && p.sub) return { topic: p.topic, sub: p.sub };
    if (typeof TOPIC_MIGRATE !== "undefined" && TOPIC_MIGRATE[p.id])
      return { topic: TOPIC_MIGRATE[p.id][0], sub: TOPIC_MIGRATE[p.id][1] };
    if (typeof CAT_TO_TOPIC !== "undefined" && p.cats) {
      for (var i = 0; i < p.cats.length; i++)
        if (CAT_TO_TOPIC[p.cats[i]]) return { topic: CAT_TO_TOPIC[p.cats[i]][0], sub: CAT_TO_TOPIC[p.cats[i]][1] };
    }
    return null;
  }
  function nameOf(p) {
    var m = of(p);
    if (!m) return "";
    var t = byId(m.topic), s = subById(m.topic, m.sub);
    return (t ? t.name : m.topic) + (s ? " › " + s.name : "");
  }
  /* একই টপিক/সাবের রিলেটেড প্রম্পট (রিলেটেড-ইঞ্জিনের জন্য) */
  function related(p, list, limit) {
    var m = of(p);
    if (!m || !list) return [];
    var out = list.filter(function (x) {
      if (x.id === p.id) return false;
      var xm = of(x);
      return xm && xm.topic === m.topic && (xm.sub === m.sub || Math.random() < 0.35);
    });
    return out.slice(0, limit || 4);
  }
  return { all: all, byId: byId, subById: subById, of: of, nameOf: nameOf, related: related };
})();

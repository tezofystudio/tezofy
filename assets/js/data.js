/* ============================================================
   TEZOFY — Data layer (prompts, categories, articles, customize)
   Edit this single file to add/rename prompts. No build needed.
   ============================================================ */

var SITE = {
  name: "TEZOFY",
  tagline: "Premium AI Image Prompt Library",
  description: "Discover & copy premium AI image prompts. Create stunning portraits with one tap — free templates for Gemini, ChatGPT, Midjourney and more.",
  stats: [
    { value: "1K+", label: "Prompts" },
    { value: "50K+", label: "Copies" },
    { value: "100%", label: "Free to Use" }
  ]
};

/* ============================================================
   AUTH & EMAIL COLLECTION — fill these 3 to activate
   (step-by-step setup: /AUTH-GUIDE.md)
   1) sheetUrl       → your Google Apps Script web app URL (…/exec)
   2) googleClientId → Google Cloud Console (ends .apps.googleusercontent.com)
   3) fbAppId        → Meta for Developers App ID (numbers only)
   Leave "" empty to keep that login method hidden.
   ============================================================ */
var AUTH_CONFIG = {
  sheetUrl: "https://script.google.com/macros/s/AKfycbwWZQyM-KgQcapysDkiju8Uk6upd3MZROXF5BU-QaA2RHn_XkyMvjJKhAtlmjneGIt_/exec",
  googleClientId: "212033639328-iqbjtddt28gpq2euuq61cilp4pb2fqcj.apps.googleusercontent.com",
  fbAppId: "1474580381159042"
};

var CATEGORIES = [
  { id: "trending",     name: "Trending",              icon: "⚡", desc: "The prompts everyone is creating with right now" },
  { id: "popular",      name: "Popular",               icon: "🔥", desc: "Most-copied templates loved by the community" },
  { id: "festival",     name: "Festival Themes",       icon: "🪔", desc: "Durga Puja, Eid, Diwali & seasonal celebration prompts" },
  { id: "couple",       name: "Couple Photos",         icon: "💑", desc: "Romantic couple portraits for anniversaries and social media" },
  { id: "wedding",      name: "Wedding & Bridal",      icon: "💍", desc: "Bridal portraits, wedding moments and celebration frames" },
  { id: "professional", name: "Professional Headshots", icon: "💼", desc: "LinkedIn-ready corporate portraits and business headshots" },
  { id: "cinematic",    name: "Cinematic",             icon: "🎬", desc: "Movie-poster quality images with dramatic lighting" },
  { id: "retro",        name: "Retro & Vintage",       icon: "📸", desc: "70s–90s film-inspired portraits with analog grain" },
  { id: "fashion",      name: "Fashion & Studio",      icon: "👗", desc: "Editorial studio portraits and magazine-style looks" },
  { id: "name-art",     name: "3D Name Logos",         icon: "✨", desc: "Personalized 3D name art with neon, gold and glow styles" },
  { id: "anime",        name: "Anime & Manga",         icon: "🌸", desc: "Japanese anime-style character portraits and illustrations" },
  { id: "nature",       name: "Nature & Landscapes",   icon: "🌿", desc: "Breathtaking landscape and nature scene prompts" }
];

/* ============================================================
   CUSTOMIZE ENGINE
   Shared option groups — rendered at the bottom of every
   template page. [label, textAppendedToPrompt]
   - type "ratio" options REPLACE the trailing Ratio x:y
   - groups with multi:true allow several selections
   - per-prompt "customOptions.outfit / .bg" override the
     generic list for that prompt
   ============================================================ */
var CUSTOMIZE_GROUPS = {
  outfit:   { icon: "👗", label: "Outfit",             hint: "Change what the subject wears" },
  bg:       { icon: "🌆", label: "Background",         hint: "Change the scene behind the subject" },
  lighting: { icon: "💡", label: "Lighting",           hint: "Change how the image is lit" },
  time:     { icon: "🕐", label: "Time of Day",        hint: "Change when the photo happens" },
  angle:    { icon: "📷", label: "Camera Angle",       hint: "Change framing & perspective" },
  mood:     { icon: "🎭", label: "Mood & Style",       hint: "Change the overall feel" },
  fx:       { icon: "✨", label: "Extra Effects",      hint: "Add atmosphere — pick any", multi: true },
  ratio:    { icon: "📐", label: "Aspect Ratio",       hint: "Change the image shape", type: "ratio" }
};

var OPTS = {
  lighting: [
    ["Golden Hour",  "Lighting: warm golden-hour glow with soft long shadows."],
    ["Soft Studio",  "Lighting: soft diffused studio softbox light with gentle falloff."],
    ["Neon Rim",     "Lighting: colored neon rim light with deep shadow fill."],
    ["Dramatic Beam","Lighting: a single dramatic spotlight beam with darkness all around."],
    ["Window Light", "Lighting: soft natural light from a large side window."],
    ["Harsh Flash",  "Lighting: harsh direct on-camera flash with a sharp shadow behind."]
  ],
  time: [
    ["Early Morning","Time of day: soft early morning with light mist."],
    ["Midday",       "Time of day: bright midday sun."],
    ["Golden Hour",  "Time of day: warm golden hour just before sunset."],
    ["Twilight",     "Time of day: blue twilight just after sunset."],
    ["Night",        "Time of day: full night with glowing artificial lights."]
  ],
  angle: [
    ["Eye Level",  "Framing: eye-level shot."],
    ["Close-Up",   "Framing: tight close-up on the face, from the shoulders up."],
    ["Low Angle",  "Framing: low angle looking up for a heroic feel."],
    ["High Angle", "Framing: slight high angle looking down."],
    ["Full Body",  "Framing: full-body composition with the environment visible."]
  ],
  mood: [
    ["Dreamy",      "Style: dreamy soft-focus pastel mood."],
    ["Cinematic",   "Style: bold cinematic teal-and-orange color grade."],
    ["Vintage Film","Style: faded vintage analog film look with grain."],
    ["Editorial",   "Style: high-fashion editorial magazine look."],
    ["Moody",       "Style: dark moody low-key atmosphere."]
  ],
  fx: [
    ["Film Grain",    "Add visible analog film grain."],
    ["Light Haze",    "Add soft haze floating in the light."],
    ["Bokeh Bubbles", "Add round glowing bokeh circles in the background."],
    ["Rain Drizzle",  "Add light rain drizzle."],
    ["Dust Particles","Add golden dust particles floating in the light."],
    ["Smoke",         "Add gentle drifting smoke in the background."]
  ],
  ratio: [
    ["Portrait 4:5", "4:5"],
    ["Square 1:1",   "1:1"],
    ["Story 9:16",   "9:16"],
    ["Wide 16:9",    "16:9"]
  ]
};

/* category ids must exist in CATEGORIES above */
var PROMPTS = [
   
{
  id: "golden-hour-love-story",
  title: "Golden Hour Love Story",
  img: "assets/img/golden-hour-love-story.jpg",
  cats: ["trending", "couple", "cinematic"],
  uses: 12800,
  likes: 1540,
  isNew: true,
  tagline: "Amber sunset light bathes a dreamy double-exposure love story in floating autumn leaves.",
  prompt: "Cinematic vertical double-exposure portrait of a romantic couple, same face as the uploaded reference image: a giant dreamy close-up dissolves into a honey-amber sunset sky while the full-body pair embraces on a golden field with drifting maple leaves. He wears a tailored [OUTFIT COLOR] suit, she a flowing rust-red gown with soft satin sheen. Warm volumetric backlight rims their hair, 85mm prime lens, f/1.4 shallow depth of field, subtle film grain, moody ambient haze. A hand-lettered white brush-script headline [CUSTOM TEXT] with dry-brush texture and lifted glow arcs across the lower third. Keep the facial features exactly the same as the reference image. Ratio 4:5.",
  tags: ["couple poster", "double exposure", "sunset romance", "brush script", "amber grading", "volumetric light", "autumn leaves", "cinematic portrait"],
  about: "This layered template stacks a giant emotional close-up over a sharp full-body embrace, giving mobile viewers two love moments in one scroll-stopping frame. The honey-amber grade, drifting leaves and brush-script headline read instantly as a cinematic love story, perfect for engagements, anniversaries and song-style title cards.",
  how: "The prompt locks facial identity in the first clause so the diffusion model anchors both exposure layers to one face geometry before composing the sky dissolve. Bracketed tokens sit in low-conflict positions, so swapping [OUTFIT COLOR] or [CUSTOM TEXT] restyles wardrobe and headline without breaking the face lock, depth map or golden-hour grade.",
  tools: "Generate with Google Gemini or ChatGPT image mode using the couple photo as reference upload; in Midjourney, pair the same prompt with --cref and a high --cw value to hold both faces steady.",
  steps: [
    "Upload a sharp, evenly lit reference photo of the couple.",
    "Paste the prompt and replace [OUTFIT COLOR] and [CUSTOM TEXT].",
    "Generate at 4:5 ratio and confirm both layers share one sky.",
    "Rescue tip: If faces drift between layers, add: 'identical facial identity in both portrait layers.'"
  ],
  variations: [
    "Swap the amber field for a misty teal forest with desaturated cool grading.",
    "Replace maple leaves with rose petals and shift the palette to deep crimson.",
    "Change the headline to a bold condensed sans title with a small script subtitle.",
    "Render the entire poster as a soft watercolor painting with splash and splatter edges."
  ],
  mistakes: [
    "Don't let the ghost overlay overpower the couple; fix with 'overlay portrait at 40 percent opacity, edges fully dissolved into sky.'",
    "Avoid flat midday light that kills the romance; fix with 'golden-hour volumetric backlight and rim light on hair and shoulders.'",
    "Don't ship warped lettering; fix by regenerating with 'clean readable brush-script typography with correct spelling.'"
  ],
  custom: ["outfit", "bg", "lighting", "mood", "fx", "ratio"],
  customOptions: {
    outfit: [
      ["Rust Red Gown", "Outfit: flowing rust-red evening gown with soft satin sheen."],
      ["Classic Charcoal Suit", "Outfit: tailored charcoal black suit with crisp white shirt."],
      ["Mint Bridal Set", "Outfit: pastel mint sherwani and matching embroidered lehenga with pearl details."],
      ["Teal Gold Lehenga", "Outfit: teal and gold bridal lehenga with zari embroidery and sheer dupatta."]
    ],
    bg: [
      ["Amber Field", "Background: open golden grass field under a honey-amber sunset sky with drifting maple leaves."],
      ["Misty Forest", "Background: fog-drenched forest path in desaturated teal with soft morning mist."],
      ["Rose Watercolor", "Background: dreamy pink watercolor wash with paint splashes and soft paper texture."],
      ["City Dusk Bokeh", "Background: blurred city skyline at dusk with warm bokeh lights and gentle haze."]
    ]
  }
},
   
{
  id: "misty-forest-vow",
  title: "Misty Forest Vow",
  img: "assets/img/misty-forest-vow.jpg",
  cats: ["trending", "couple", "wedding"],
  uses: 9400,
  likes: 1080,
  isNew: true,
  tagline: "Desaturated mist wraps a ghosted embrace above a couple walking hand in hand.",
  prompt: "Cinematic vertical double-exposure portrait of a romantic couple, same face as the uploaded reference image: she wears an olive-green kurta with ornate pendant, he a sage shirt and denim, as a giant desaturated close-up of foreheads touching melts into cool teal forest fog above their hand-in-hand walk. Soft overcast diffusion, 85mm prime lens, f/1.4 shallow depth of field, subtle film grain, moody ambient mist. Giant white brush-script headline [CUSTOM TEXT] with dry-brush texture floats mid-frame while script [YOUR NAMES] anchors the base. Keep the facial features exactly the same as the reference image. Ratio 4:5.",
  tags: ["save the date", "double exposure", "misty forest", "brush script", "teal monochrome", "overcast light", "couple walk", "cinematic wedding"],
  about: "A ghosted forehead-touch close-up towering over a shy hand-in-hand walk gives mobile viewers intimacy at two scales in one frame. The desaturated teal mist and oversized brush script read as quiet cinematic devotion, ideal for save-the-date countdowns and engagement announcements.",
  how: "Identity is locked in the opening clause so both the monochrome overlay and the color walk layer inherit one face geometry. [CUSTOM TEXT] and [YOUR NAMES] sit inside the typography clause, so swapping them re-renders lettering without disturbing the fog depth map or the cool grade.",
  tools: "Use Google Gemini or ChatGPT image mode with the couple's photo attached as reference; in Midjourney add --cref with a high --cw value to keep both faces identical across the two layers.",
  steps: [
    "Upload a clear reference photo of the couple.",
    "Paste the prompt and replace [CUSTOM TEXT] and [YOUR NAMES].",
    "Generate at 4:5 ratio and check the overlay stays monochrome above the color walk.",
    "Rescue tip: If the mist swallows the couple, add: 'full-body couple at 100 percent opacity, crisp against the fog.'"
  ],
  variations: [
    "Shift the fog to warm amber dawn light for a golden-hour countdown.",
    "Swap the forest for a rain-soaked old-town street with muted umbrella silhouettes.",
    "Add a small serif countdown line above the names for wedding teasers.",
    "Render the giant overlay as a charcoal sketch floating over the color photograph."
  ],
  mistakes: [
    "Don't let the overlay close-up render in full color; fix with 'upper portrait desaturated to soft monochrome at 45 percent opacity.'",
    "Avoid harsh flash on the walking couple; fix with 'soft overcast diffusion and a gentle rim light from the mist.'",
    "Don't accept melted script lettering; fix by regenerating with 'clean readable brush-script typography, correct spelling.'"
  ],
  custom: ["outfit", "bg", "lighting", "mood", "fx", "ratio"],
  customOptions: {
    outfit: [
      ["Olive Kurta Set", "Outfit: olive-green cotton kurta with checkered dupatta and ornate silver pendant."],
      ["Sage Shirt Denim", "Outfit: sage green button-up shirt with relaxed blue denim jeans."],
      ["Ivory Sherwani Pair", "Outfit: ivory embroidered sherwani with a matching pastel bridal lehenga."],
      ["Earth Tone Saree", "Outfit: earth-tone handloom saree with minimal gold jewelry."]
    ],
    bg: [
      ["Foggy Birch Forest", "Background: fog-drenched birch forest path in desaturated teal with bare trunks fading into mist."],
      ["Misty Tea Garden", "Background: misty tea garden rows at dawn with soft green haze over quiet slopes."],
      ["Rainy Brick Lane", "Background: rain-slicked old brick lane with soft grey fog and muted umbrellas."],
      ["Winter River Bank", "Background: quiet winter river bank wrapped in pale morning fog and cool blue light."]
    ]
  }
},
  {
    id: "durga-puja-grace",
    title: "Durga Puja Grace",
    img: "assets/img/durga-puja.jpg",
    cats: ["trending", "festival"],
    uses: 18400, likes: 2310, isNew: true,
    tagline: "A festive night portrait wrapped in pandal lights, marigold garlands and the quiet joy of Puja.",
    prompt: "Festive night portrait of a young woman, same face as the uploaded reference image, wearing a traditional [SAREE COLOR] saree with a red border during Durga Puja celebrations. She holds a decorated brass puja thali filled with flowers and sweets, standing in front of a grand illuminated pandal covered in marigold garlands and warm golden lights. Joyful, serene expression, soft cinematic key light on her face, shallow depth of field, rich festive colors. Keep the facial features exactly the same as the reference image. Ratio 4:5.",
    tags: ["portrait", "Bengali woman", "Durga Puja", "pandal lights", "white saree", "festive night", "cultural celebration", "golden bokeh"],
    about: "Durga Puja portraits live or die on atmosphere — the glow of pandal lights, the texture of a traditional saree, and an authentic, unhurried expression. This prompt balances all three, wrapping the subject in warm golden light while keeping her face crisp and true to the reference photo.",
    how: "The prompt anchors identity with a reference-image instruction, then layers scene, wardrobe and lighting in the order modern generators follow most reliably. Marigold garlands and golden bulbs act as built-in bokeh, so the background feels rich without ever stealing focus from the face.",
    tools: "Works best with generators that accept a photo reference, such as Google Gemini or ChatGPT's image mode. Midjourney users should attach the reference URL and add the --cref parameter.",
    steps: [
      "Upload a clear, front-facing reference photo so the generator can lock onto facial features.",
      "Paste the full prompt and keep the reference-image instruction at the very start.",
      "Generate in a 4:5 vertical ratio for the most flattering portrait framing.",
      "If the pandal overpowers the subject, add: keep the background softly blurred."
    ],
    variations: [
      "Swap [SAREE COLOR] for ivory, powder blue or classic white to match your own Puja outfit.",
      "Add dhunuchi smoke drifting through the frame for extra drama.",
      "Ask for a light drizzle effect for a cinematic monsoon-Puja mood.",
      "Try a close-up variant: frame from the shoulders up, thali held near the chest."
    ],
    mistakes: [
      "Don't remove the reference-image line — without it the face becomes a stranger's.",
      "Avoid daylight wording; the magic of this scene is night-time festive contrast.",
      "Too many extra props (dhak, conch, sindoor) clutter the frame — pick one at most."
    ],
    custom: ["outfit", "bg", "time", "angle", "fx", "ratio"],
    customOptions: {
      outfit: [
        ["White + Red Border", "Outfit: traditional white saree with a red border, gold bangles and a small bindi."],
        ["Red Banarasi", "Outfit: rich red banarasi saree with golden zari work."],
        ["Ivory + Gold", "Outfit: ivory silk saree with a golden border and matching jewelry."],
        ["Blue Jamdani", "Outfit: deep blue dhakai jamdani saree with silver jewelry."]
      ],
      bg: [
        ["Pandal Lights", "Background: grand illuminated pandal with marigold garlands and warm bulbs."],
        ["Temple Steps", "Background: old temple steps decorated with diyas and flowers."],
        ["Festive Street", "Background: lively festive street with hanging lights, softly blurred."],
        ["Minimal Studio", "Background: clean warm studio backdrop with a single soft spotlight."]
      ]
    }
  },
  {
    id: "eid-crescent-night",
    title: "Eid Crescent Night",
    img: "assets/img/eid-crescent.jpg",
    cats: ["trending", "festival"],
    uses: 15200, likes: 1890, isNew: true,
    tagline: "Twilight rooftop, a slender crescent moon, and bokeh minarets — Eid elegance in one frame.",
    prompt: "Elegant Eid evening portrait of a young man, same face as the uploaded reference image, wearing an embroidered [KURTA COLOR] panjabi, standing on a rooftop at twilight. Behind him, a glowing crescent moon and softly lit mosque minarets melt into creamy bokeh. Gentle confident smile, warm-and-teal cinematic color grade, 85mm lens look, festive yet calm mood. Face must remain identical to the reference image. Ratio 4:5.",
    tags: ["portrait", "South Asian man", "Eid", "panjabi", "crescent moon", "rooftop", "twilight bokeh", "teal and warm"],
    about: "Eid portraits work because they mix celebration with calm. The crescent moon and minaret bokeh instantly signal the occasion, while the warm-teal grade keeps the frame premium rather than busy.",
    how: "Twilight does the heavy lifting: the deep blue sky separates the subject from the background, and out-of-focus minaret lights create depth without distracting detail. The 85mm instruction pushes generators toward flattering, compression-style portraits.",
    tools: "Gemini and ChatGPT image mode handle the reference photo well. For Midjourney, upload the photo to get a URL and use --cref with a moderate stylize value.",
    steps: [
      "Upload a sharp reference photo with a relaxed expression.",
      "Keep the 4:5 ratio so the moon and minarets stay in frame.",
      "Generate with the twilight wording as-is — don't brighten the scene.",
      "If the moon renders oversized, add: small realistic crescent moon."
    ],
    variations: [
      "Change [KURTA COLOR] to ivory, jet black or deep emerald.",
      "Add hanging fairy lights along the rooftop ledge.",
      "Try an Eid-morning version with soft golden sun instead of twilight.",
      "Add a traditional prayer cap for a classic look."
    ],
    mistakes: [
      "A giant cartoon moon ruins realism — always specify a small realistic crescent.",
      "Don't stack props from multiple festivals; Eid styling is minimal by design.",
      "Bright noon light kills the bokeh — keep the scene at twilight."
    ],
    custom: ["outfit", "bg", "time", "angle", "fx", "ratio"],
    customOptions: {
      outfit: [
        ["Ivory Panjabi", "Outfit: ivory panjabi with delicate chest embroidery."],
        ["Black Panjabi", "Outfit: jet black panjabi with subtle silver buttons."],
        ["Emerald Panjabi", "Outfit: deep emerald panjabi with white pajama."],
        ["Panjabi + Tupi", "Outfit: white panjabi with a traditional embroidered prayer cap."]
      ],
      bg: [
        ["Rooftop + Minarets", "Background: rooftop view with softly lit mosque minarets in bokeh."],
        ["Mosque Courtyard", "Background: grand mosque courtyard with warm lanterns."],
        ["Village Skyline", "Background: quiet village skyline with palm trees at dusk."],
        ["City Rooftop", "Background: city rooftop with distant neon-lit buildings, softly blurred."]
      ]
    }
  },
  {
    id: "ganpati-blessing",
    title: "Ganpati Blessing",
    img: "assets/img/ganesha-portrait.jpg",
    cats: ["trending", "festival"],
    uses: 11600, likes: 1430, isNew: true,
    tagline: "Dark studio, red halo glow, and a colourful Ganesha idol — a devotional portrait that pops.",
    prompt: "Studio-style devotional portrait of a young man, same face as the uploaded reference image, wearing a crisp [SHIRT COLOR] shirt and holding a small, colourful Lord Ganesha idol in both hands at chest level. Dramatic dark background with a soft red glow behind the subject, natural joyful smile, small red tilak on the forehead, sharp focus on face and idol. Face and expression must match the reference image. Ratio 4:5.",
    tags: ["portrait", "Indian man", "Ganesh Chaturthi", "Ganesha idol", "studio lighting", "red glow", "devotional", "dark background"],
    about: "The dark backdrop with a red halo is a classic festive studio trick: it makes the colourful idol pop and wraps the subject in warmth without a single distracting element.",
    how: "By locking the background to near-black, the generator is forced to spend its entire detail budget on the face and the idol. The tilak and the glow add cultural authenticity in just a handful of words.",
    tools: "Use a generator with image-reference support such as Gemini or ChatGPT. For Midjourney, pair --cref with the hosted photo URL.",
    steps: [
      "Upload a smiling, well-lit reference photo.",
      "Generate at 4:5 and keep 'sharp focus on face and idol'.",
      "If the idol renders too large, add: idol smaller than the head.",
      "Raise glow intensity with: stronger soft red rim light."
    ],
    variations: [
      "Change [SHIRT COLOR] to cream or saffron for a traditional twist.",
      "Add soft incense haze for a temple-like atmosphere.",
      "Swap the red glow for a warm golden backlight.",
      "Place a marigold garland around the idol's base."
    ],
    mistakes: [
      "Bright backgrounds wash out the red glow and flatten the mood.",
      "Oversized idols look like toys — always keep the idol small.",
      "Skipping the tilak loses the devotional signal that makes the image feel real."
    ],
    custom: ["outfit", "bg", "lighting", "angle", "fx", "ratio"],
    customOptions: {
      outfit: [
        ["Crisp White Shirt", "Outfit: crisp white formal shirt, sleeves slightly rolled."],
        ["Saffron Kurta", "Outfit: saffron kurta with a small rudraksha bracelet."],
        ["Cream Kurta", "Outfit: cream silk kurta with golden buttons."],
        ["Black Shirt", "Outfit: matte black shirt for maximum contrast with the idol."]
      ],
      bg: [
        ["Dark + Red Glow", "Background: deep black studio with a soft red halo glow."],
        ["Golden Temple", "Background: softly blurred golden temple interior."],
        ["Smoke Haze", "Background: dark scene filled with gentle incense smoke catching light."],
        ["Marigold Wall", "Background: wall of orange marigold flowers, softly blurred."]
      ]
    }
  },
  {
    id: "diwali-diya-glow",
    title: "Diwali Diya Glow",
    img: "assets/img/diwali-diya.jpg",
    cats: ["trending", "festival"],
    uses: 12800, likes: 1640, isNew: true,
    tagline: "One diya, one face, a thousand bokeh lights — the warmest festive portrait you'll generate.",
    prompt: "Festive portrait of a young woman, same face as the uploaded reference image, wearing an embroidered [OUTFIT COLOR] lehenga, holding a lit clay diya between her palms at chest level. Her face is softly illuminated only by the warm flame, with strings of fairy lights melting into bokeh behind her. Gentle smile, serene expression, cinematic Diwali night atmosphere, high dynamic range. Keep facial features identical to the reference image. Ratio 4:5.",
    tags: ["portrait", "Indian woman", "Diwali", "diya lamp", "flame light", "lehenga", "fairy light bokeh", "night portrait"],
    about: "A single flame is the most flattering light source ever invented. This prompt uses the diya as the key light, sculpting the face warmly while the dark background fills with festive bokeh.",
    how: "Specifying 'illuminated only by the warm flame' prevents the flat, over-lit look AI often defaults to. Fairy-light bokeh supplies context at zero risk of clutter — the generator can't get it wrong.",
    tools: "Any generator that accepts photo references works. Gemini tends to render flame-lit skin tones especially well; Midjourney needs --cref plus a reference URL.",
    steps: [
      "Upload a well-lit reference photo.",
      "Keep the phrase 'illuminated only by the warm flame' intact.",
      "Generate at 4:5 in one shot — no extra lighting words needed.",
      "If the face is too dark, add: subtle ambient fill light."
    ],
    variations: [
      "Change [OUTFIT COLOR] to royal blue, emerald or maroon.",
      "Add a row of diyas on a foreground railing.",
      "Include a subtle rangoli pattern at the bottom of the frame.",
      "Make it a couple prompt: two faces lit by one shared flame."
    ],
    mistakes: [
      "Fireworks dominating the background steal attention from the face.",
      "Don't ask for daylight — the entire effect depends on darkness.",
      "Heavy jewelry instructions confuse the lighting; keep accessories simple."
    ],
    custom: ["outfit", "bg", "angle", "fx", "ratio"],
    customOptions: {
      outfit: [
        ["Red Lehenga", "Outfit: deep red embroidered lehenga with gold accents."],
        ["Royal Blue", "Outfit: royal blue lehenga with silver threadwork."],
        ["Emerald", "Outfit: emerald green lehenga with kundan jewelry."],
        ["Maroon Silk", "Outfit: maroon silk saree with a golden border."]
      ],
      bg: [
        ["Fairy Light Bokeh", "Background: strings of warm fairy lights melting into bokeh."],
        ["Courtyard Diyas", "Background: old courtyard lined with dozens of glowing diyas."],
        ["Rangoli", "Background: colorful rangoli pattern softly glowing at the bottom of the frame."],
        ["Temple Door", "Background: carved wooden temple door with a single lantern."]
      ]
    }
  },
  {
    id: "monsoon-chai",
    title: "Monsoon Chai Story",
    img: "assets/img/chai-rain.jpg",
    cats: ["trending", "cinematic", "popular"],
    uses: 9800, likes: 1180, isNew: true,
    tagline: "Warm stall light, cool rain, and a steaming glass of cutting chai — pure street cinema.",
    prompt: "Cinematic street portrait of a young man, same face as the uploaded reference image, wearing a denim jacket and holding a small glass of cutting chai at a roadside tea stall in [CITY] during monsoon rain. Warm light from the stall cuts through cool blue rain tones, wet asphalt mirrors the city lights, steam rises from the glass. Relaxed, content expression, moody film-photography grain. Keep the face identical to the reference. Ratio 4:5.",
    tags: ["portrait", "man", "chai", "monsoon", "street", "tea stall", "rain", "cinematic", "denim"],
    about: "Warm stall versus cold rain is a colour story every image model understands. The prompt gives the generator a clear two-tone grade and one honest prop — a steaming glass of chai.",
    how: "Opposing colour temperatures (warm tungsten vs cool rain blue) create depth automatically. Steam and wet asphalt add motion and reflection, which read as 'cinematic' without longer instructions.",
    tools: "Gemini, ChatGPT image mode, or Midjourney with --cref. This one also works without any reference photo when likeness doesn't matter.",
    steps: [
      "Upload a reference photo, or skip it for a generic face.",
      "Replace [CITY] with your city — or delete the token entirely.",
      "Keep the warm-vs-cool wording untouched.",
      "If rain hides the subject, change it to: light drizzle."
    ],
    variations: [
      "Swap the glass for a clay kulhad of milk tea.",
      "Move the scene under an old station-platform roof.",
      "Add a friend's silhouette in the background for story.",
      "Go black-and-white except for the warm stall light."
    ],
    mistakes: [
      "A heavy downpour hides the subject — ask for drizzle, not storm.",
      "Too many background people make faces render badly.",
      "Don't drop the 'wet asphalt' line; the reflections carry the mood."
    ],
    custom: ["outfit", "bg", "time", "angle", "fx", "ratio"],
    customOptions: {
      outfit: [
        ["Denim Jacket", "Outfit: blue denim jacket over a plain tee."],
        ["Kurta + Shawl", "Outfit: cotton kurta with a warm shawl over one shoulder."],
        ["Raincoat", "Outfit: transparent raincoat over casual clothes, hood down."],
        ["Leather Jacket", "Outfit: black leather jacket, slightly wet from the rain."]
      ],
      bg: [
        ["Tea Stall", "Background: roadside tea stall with hanging bulbs and steam."],
        ["Station Platform", "Background: old railway platform roof with hanging lamps."],
        ["Night Market", "Background: night market stalls with colorful signboards, blurred."],
        ["Rickshaw Stand", "Background: row of rickshaws with canvas tops glistening in rain."]
      ]
    }
  },
  {
    id: "retro-film-selfie",
    title: "Retro Film Selfie",
    img: "assets/img/retro-selfie.jpg",
    cats: ["trending", "retro", "popular"],
    uses: 8600, likes: 990, isNew: true,
    tagline: "Harsh flash, film grain, zero filters — the 90s point-and-shoot look that's everywhere again.",
    prompt: "1990s analog film portrait of a confident young woman, same face as the uploaded reference image, lit by harsh direct on-camera flash against a plain [BACKGROUND COLOR] wall. Warm vintage color cast, visible film grain, subtle light leaks, casual retro outfit, self-assured expression looking straight into the lens. Authentic 90s point-and-shoot aesthetic. Keep facial features identical to the reference image. Ratio 4:5.",
    tags: ["portrait", "woman", "90s aesthetic", "film grain", "direct flash", "retro", "vintage", "analog"],
    about: "Direct-flash film photos are trending precisely because they reject the over-smooth AI look. Grain, light leaks and a hard shadow sell the 90s instantly.",
    how: "Naming the camera behavior — harsh direct on-camera flash — works better than naming camera models, because generators know the look. A plain wall keeps all attention on styling and expression.",
    tools: "Works in every major generator, even without a reference photo — but for a true selfie feel, use Gemini or ChatGPT with your photo.",
    steps: [
      "Upload your reference photo.",
      "Pick a [BACKGROUND COLOR] — pale walls sell the era.",
      "Generate at 4:5 and inspect skin texture.",
      "If it looks too clean, add: more film grain, slight blur."
    ],
    variations: [
      "Try sage green, dusty pink or mustard for the wall.",
      "Add an orange date-stamp in the corner for camcorder vibes.",
      "Make it a bathroom-mirror flash selfie.",
      "Swap the outfit for a leather jacket and hoop earrings."
    ],
    mistakes: [
      "Asking for soft studio light defeats the retro flash style.",
      "Avoid modern backgrounds like LED panels or neon strips.",
      "Over-smoothing skin breaks the analog feel — keep real texture."
    ],
    custom: ["outfit", "bg", "angle", "fx", "ratio"],
    customOptions: {
      outfit: [
        ["Denim + Hoops", "Outfit: denim jacket, small hoop earrings, hair in a loose bun."],
        ["Leather Jacket", "Outfit: vintage leather jacket over a band tee."],
        ["Polka Dress", "Outfit: polka-dot dress with a thin belt."],
        ["Oversized Blazer", "Outfit: oversized 90s blazer over a tucked white tee."]
      ],
      bg: [
        ["Pale Wall", "Background: plain pale wall catching the hard flash shadow."],
        ["Curtains", "Background: heavy velvet curtains in a dim room."],
        ["Bathroom Mirror", "Background: bathroom mirror flash selfie with tiles visible."],
        ["Stairwell", "Background: old concrete stairwell with a metal railing."]
      ]
    }
  },
  {
    id: "golden-hour-couple",
    title: "Golden Hour River Couple",
    img: "assets/img/golden-couple.jpg",
    cats: ["trending", "couple"],
    uses: 7400, likes: 910, isNew: true,
    tagline: "Rim-lit faces, river haze and drifting boats — romance without a single cheesy prop.",
    prompt: "Romantic golden-hour portrait of a young couple standing close together on the bank of a wide river in [LOCATION], faces softly rim-lit by the setting sun, gentle haze, small wooden boats drifting in the distance. Warm amber tones, natural candid smiles, shallow depth of field, cinematic romantic-film poster feel. Faces should look natural and affectionate. Ratio 4:5.",
    tags: ["couple", "golden hour", "river", "sunset", "rim light", "romantic", "boats", "warm tones"],
    about: "Golden hour does half the photographer's job — and the same holds for AI. Rim light plus haze equals instant romance without a single cheesy prop.",
    how: "Backlighting puts glowing edges on hair and shoulders, separating the couple from a busy background. Boats and haze build depth, so the frame feels like a film still rather than a wallpaper.",
    tools: "Reliable in Midjourney and Gemini. For faces resembling real people, upload both photos to a reference-capable tool and briefly describe each person.",
    steps: [
      "Replace [LOCATION] with your riverbank or city.",
      "Generate at 4:5 and keep 'candid smiles' in the prompt.",
      "If faces render too dark, add: soft reflector fill on faces.",
      "For two specific people, upload both reference photos first."
    ],
    variations: [
      "Move the couple onto one of the boats.",
      "Add gentle river mist around their feet.",
      "Try blue hour — just after sunset — for a cooler mood.",
      "Frame it tighter as a forehead-touch close-up."
    ],
    mistakes: [
      "Posed, camera-aware smiles kill the candid magic.",
      "A noon sun makes the scene flat — keep 'golden hour'.",
      "Too many boats clutter the horizon; two or three is plenty."
    ],
    custom: ["outfit", "bg", "time", "angle", "fx", "ratio"],
    customOptions: {
      outfit: [
        ["Casual + Saree", "Outfit: the man in a casual shirt, the woman in a flowing saree."],
        ["Matching White", "Outfit: both in relaxed white linen outfits."],
        ["Panjabi + Kurti", "Outfit: the man in a panjabi, the woman in a colorful kurti."],
        ["Denim Duo", "Outfit: both in matching denim jackets."]
      ],
      bg: [
        ["River Boats", "Background: wide river with small wooden boats and golden haze."],
        ["Sea Beach", "Background: open beach with small waves catching the sunset."],
        ["Rooftop Skyline", "Background: rooftop with a warm city skyline at dusk."],
        ["Tea Garden", "Background: misty green tea garden hills behind them."]
      ]
    }
  },
  {
    id: "birthday-confetti",
    title: "Birthday Confetti Bash",
    img: "assets/img/birthday-bash.jpg",
    cats: ["popular"],
    uses: 5200, likes: 760,
    tagline: "Frozen confetti, candle glow and real laughter — a birthday portrait made for the feed.",
    prompt: "Joyful birthday portrait of a young woman, same face as the uploaded reference image, wearing an elegant [DRESS COLOR] party dress and holding a small cake with lit candles. Pastel balloons and warm string lights fill the background, golden confetti frozen mid-air around her. Genuine laughter, celebration energy, soft studio-party lighting, crisp details. Keep the face identical to the reference image. Ratio 4:5.",
    tags: ["portrait", "woman", "birthday", "cake", "candles", "balloons", "confetti", "party"],
    about: "Frozen confetti is the trick here — it gives the frame motion and joy while reading as intentional styling rather than noise.",
    how: "The prompt fixes three clean depth layers: subject and cake in front, balloons mid-frame, lights in bokeh behind. Generators reward that structure with a tidy, festive composition every time.",
    tools: "Gemini or ChatGPT for likeness. Without a reference it still works nicely in Midjourney and Bing Image Creator.",
    steps: [
      "Upload a reference photo with a happy expression.",
      "Set your [DRESS COLOR].",
      "Generate at 4:5 and check candle exposure.",
      "If highlights blow out, add: dim candle glow, balanced exposure."
    ],
    variations: [
      "Make it a one-tier pastel cake with age-number candles.",
      "Swap balloons for floating golden stars.",
      "Add friends blurred in the background.",
      "Try a monochrome outfit so only the confetti carries colour."
    ],
    mistakes: [
      "Too much confetti covers the face — say 'around her', not 'everywhere'.",
      "Bright flash flattens the candlelight mood.",
      "Text banners like 'Happy Birthday' often render with typos — skip them."
    ],
    custom: ["outfit", "bg", "angle", "fx", "ratio"],
    customOptions: {
      outfit: [
        ["Pastel Gown", "Outfit: pastel party gown with a soft tulle skirt."],
        ["Sequin Dress", "Outfit: sparkling sequin mini dress."],
        ["Saree Glam", "Outfit: shimmering saree with a modern sleeveless blouse."],
        ["Black + Gold", "Outfit: black dress with golden accessories."]
      ],
      bg: [
        ["Balloons + Lights", "Background: pastel balloon arch with warm string lights."],
        ["Dinner Table", "Background: long candle-lit dinner table with friends blurred behind."],
        ["Rooftop Party", "Background: rooftop party at dusk with city lights."],
        ["Golden Studio", "Background: golden studio backdrop with floating confetti."]
      ]
    }
  },
  {
    id: "vintage-70s-couple",
    title: "Vintage 70s Couple",
    img: "assets/img/vintage-couple.jpg",
    cats: ["popular", "couple", "retro"],
    uses: 6400, likes: 820,
    tagline: "Faded film colours, a retro scooter and carefree laughter straight out of a 1976 photo album.",
    prompt: "1970s film photograph of a stylish young couple leaning on a vintage scooter on a quiet street, the man in a bold printed shirt, the woman in a polka-dot dress with oversized sunglasses. Faded analog colors, warm yellow-green cast, soft film grain, carefree laughter, nostalgic summer afternoon. Authentic retro photo-album aesthetic. Ratio 4:5.",
    tags: ["couple", "70s", "vintage", "scooter", "film photo", "analog", "nostalgic", "street"],
    about: "The 70s look is about imperfection: faded greens, yellowed highlights and clothes with personality. This prompt hands the generator that exact recipe.",
    how: "Era-specific wardrobe cues — polka dots, printed shirt, oversized sunglasses — anchor the decade, while fade-and-grain instructions stop the AI making it look like a modern themed shoot.",
    tools: "Midjourney excels at film stock looks; add --style raw for a truer photo feel. Gemini works too — upload both people's photos to keep likeness.",
    steps: [
      "Generate at 4:5 and keep 'faded analog colors'.",
      "For a local street vibe, add: rickshaw and old buildings in background.",
      "If it looks too sharp, add: slight 70s lens softness.",
      "Want your own faces? Upload both reference photos first."
    ],
    variations: [
      "Swap the scooter for a yellow ambassador taxi.",
      "Try an indoor version with a patterned sofa and wood-panel wall.",
      "Give it a white printed border like an old lab print.",
      "Add a handwritten date in the corner: 1976."
    ],
    mistakes: [
      "Clean saturated colours make it look like a costume party, not an old photo.",
      "Modern cars in the background break the decade instantly.",
      "Stiff formality fights the carefree 70s energy."
    ],
    custom: ["outfit", "bg", "angle", "fx", "ratio"],
    customOptions: {
      outfit: [
        ["Print + Polka", "Outfit: the man in a bold printed shirt, the woman in a polka-dot dress."],
        ["Flared Denim", "Outfit: both in flared jeans and tucked plain tees."],
        ["Vintage Saree", "Outfit: the woman in a simple cotton saree, the man in a plain kurta."],
        ["Disco Night", "Outfit: shiny disco shirts and flared trousers."]
      ],
      bg: [
        ["Scooter Street", "Background: quiet street with a vintage scooter and old buildings."],
        ["Yellow Taxi", "Background: leaning on a classic yellow taxi."],
        ["Old Tea House", "Background: wooden tea house with painted windows."],
        ["Riverside Ghat", "Background: old riverside steps with moored boats."]
      ]
    }
  },
  {
    id: "purple-noir",
    title: "Purple Noir Muse",
    img: "assets/img/purple-noir.jpg",
    cats: ["popular", "cinematic"],
    uses: 4900, likes: 640,
    tagline: "One light, one colour, infinite drama — editorial noir at its most minimal.",
    prompt: "High-fashion noir portrait of a young woman, same face as the uploaded reference image, lit by a single [LIGHT COLOR] light against a pure black background. Dramatic soft shadows carve out her features, mysterious calm expression, minimal styling, editorial magazine mood, ultra-detailed skin texture. Face must remain identical to the reference. Ratio 4:5.",
    tags: ["portrait", "woman", "noir", "colored light", "dramatic shadows", "fashion", "black background", "editorial"],
    about: "Restraint is what makes noir portraits look expensive, and this prompt protects that restraint: one gel light, one black void, all attention on the face.",
    how: "A pure black background removes all environmental guesswork, so the generator spends everything on light falloff and facial detail. Naming a single gel colour keeps the grade consistent across results.",
    tools: "Best with reference upload in Gemini or ChatGPT. In Midjourney, combine --cref with --style raw for editorial realism.",
    steps: [
      "Upload a neutral-expression reference photo.",
      "Pick your [LIGHT COLOR] — violet is the classic.",
      "Generate at 4:5.",
      "If shadows crush to black, add: subtle fill from the opposite side."
    ],
    variations: [
      "Change [LIGHT COLOR] to deep red, cyan or amber.",
      "Add a thin smoke haze catching the light.",
      "Try split lighting: violet one side, teal the other.",
      "Add wet-look hair for extra editorial bite."
    ],
    mistakes: [
      "Background props ruin the noir minimalism.",
      "Two bright lights remove the mystery — keep shadows heavy.",
      "Beauty filters plus noir light look plasticky; keep real skin texture."
    ],
    custom: ["lighting", "angle", "mood", "fx", "ratio"]
  },
  /* ---------- NEW: Wedding ---------- */
  {
    id: "bridal-royal",
    title: "Royal Bridal Glow",
    img: "assets/img/bridal-glow.jpg",
    cats: ["wedding", "trending"],
    uses: 9500, likes: 1340, isNew: true,
    tagline: "Palace lights, gold jewelry and a smile that steals the frame — the bridal portrait of the season.",
    prompt: "Radiant wedding portrait of a South Asian bride, same face as the uploaded reference image, wearing a richly embroidered [LEHENGA COLOR] lehenga with gold jewelry and a floral garland. Soft warm palace lights melt into bokeh behind her, gentle graceful smile, luxurious editorial wedding photography, intricate detail on fabric and jewelry. Keep facial features identical to the reference image. Ratio 4:5.",
    tags: ["bride", "wedding", "lehenga", "gold jewelry", "palace lights", "bokeh", "editorial", "celebration"],
    about: "A bridal portrait should feel like a memory and a movie poster at once. Warm palace bokeh gives grandeur, while soft frontal light keeps the bride glowing instead of glittering.",
    how: "The prompt locks two hero elements — embroidered fabric and gold jewelry — then softens everything else into bokeh. That contrast is what makes AI wedding shots look expensive instead of busy.",
    tools: "Gemini or ChatGPT with a reference photo for likeness. Midjourney with --cref works well too; keep stylize moderate so jewelry stays realistic.",
    steps: [
      "Upload a clear reference photo of the bride.",
      "Set [LEHENGA COLOR] — classic red, blush pink or gold.",
      "Generate at 4:5 and check jewelry detail.",
      "If the face flattens, add: gentle key light on the face."
    ],
    variations: [
      "Add a translucent dupatta veil catching backlight.",
      "Include the groom softly blurred in the background.",
      "Set the scene beside a heritage staircase.",
      "Add henna detailing visible on her hands."
    ],
    mistakes: [
      "Too many light sources flatten the face — keep it warm and directional.",
      "Oversaturated reds destroy fabric detail; say 'rich', not 'bright'.",
      "Multiple heavy necklaces prompt-renders often mess up; keep jewelry 'gold and delicate'."
    ],
    custom: ["outfit", "bg", "lighting", "angle", "fx", "ratio"],
    customOptions: {
      outfit: [
        ["Classic Red", "Outfit: classic red lehenga with heavy gold zardozi embroidery."],
        ["Blush Pink", "Outfit: blush pink lehenga with pearl and gold accents."],
        ["Royal Gold", "Outfit: metallic gold lehenga with red dupatta."],
        ["Maroon Velvet", "Outfit: deep maroon velvet lehenga with kundan jewelry."]
      ],
      bg: [
        ["Palace Lights", "Background: warm palace hall with chandeliers in bokeh."],
        ["Heritage Stairs", "Background: grand heritage staircase with candles."],
        ["Garden Mandap", "Background: flower-covered wedding mandap glowing at dusk."],
        ["Golden Curtains", "Background: rich golden silk curtains with side light."]
      ]
    }
  },
  /* ---------- NEW: Professional ---------- */
  {
    id: "executive-navy",
    title: "Executive Navy Headshot",
    img: "assets/img/executive-portrait.jpg",
    cats: ["professional", "popular"],
    uses: 5600, likes: 720,
    tagline: "The LinkedIn headshot that looks like a Fortune 500 annual report.",
    prompt: "Corporate headshot of a confident businessman, same face as the uploaded reference image, wearing a tailored [SUIT COLOR] suit with a matching tie. Clean dark grey studio backdrop, soft professional key light from the left, shoulders angled slightly, direct confident gaze, premium executive portrait photography. Keep facial features identical to the reference image. Ratio 4:5.",
    tags: ["headshot", "man", "suit", "corporate", "studio", "linkedin", "professional", "grey backdrop"],
    about: "A great corporate headshot is 90% light discipline: one soft key, a clean backdrop, and shoulders at an angle. This prompt encodes exactly that, so the result reads 'executive', not 'ID card'.",
    how: "Direct gaze plus angled shoulders is the timeless executive formula. Naming the key-light direction gives the generator a photographic instruction it can actually follow, instead of hoping for 'professional quality'.",
    tools: "Gemini or ChatGPT with your photo for likeness. This template also works without reference if you just want the style.",
    steps: [
      "Upload a straight-on, well-lit selfie as reference.",
      "Pick your [SUIT COLOR].",
      "Generate at 4:5 and check eye sharpness.",
      "For a friendlier feel, add: subtle confident smile."
    ],
    variations: [
      "Switch the backdrop to a bright office with window blur.",
      "Lose the tie for a startup-founder look.",
      "Add a thin silver watch as a detail anchor.",
      "Try a 9:16 crop for LinkedIn story or CV header."
    ],
    mistakes: [
      "Busy office backgrounds age a headshot fast — keep it clean or blurred.",
      "Harsh top lighting creates tired eye-bags; stay with side key light.",
      "Wide-angle distortion screams amateur — keep '85mm' style framing via the angle options."
    ],
    custom: ["outfit", "bg", "lighting", "angle", "fx", "ratio"],
    customOptions: {
      outfit: [
        ["Navy Suit", "Outfit: tailored navy suit with a matching tie."],
        ["Charcoal Suit", "Outfit: charcoal grey suit with a crisp white shirt."],
        ["Black + No Tie", "Outfit: black suit, open-collar white shirt, no tie."],
        ["Brown Tweed", "Outfit: brown tweed blazer over a light turtleneck."]
      ],
      bg: [
        ["Grey Studio", "Background: clean dark grey studio backdrop."],
        ["Glass Office", "Background: modern glass office with soft city bokeh."],
        ["Library", "Background: elegant bookshelf wall, softly blurred."],
        ["Window City", "Background: high-rise window view of the city at dusk, blurred."]
      ]
    }
  },
  {
    id: "ceo-presence",
    title: "CEO Presence",
    img: "assets/img/businesswoman-ceo.jpg",
    cats: ["professional"],
    uses: 4300, likes: 560, isNew: true,
    tagline: "Glass office, city bokeh, unshakeable confidence — the boardroom portrait done right.",
    prompt: "Professional portrait of a confident businesswoman, same face as the uploaded reference image, wearing an elegant [BLAZER COLOR] blazer with arms gently crossed, standing in a bright modern glass office. Soft city bokeh behind her, natural window light, subtle assured smile, executive presence, editorial corporate photography. Keep facial features identical to the reference image. Ratio 4:5.",
    tags: ["businesswoman", "blazer", "office", "corporate", "window light", "executive", "confident", "city bokeh"],
    about: "Natural window light plus a real office beats any fake backdrop. The prompt pairs environmental context with clean bokeh so the image says 'leader' without a single cliché.",
    how: "Arms gently crossed reads confident in photography research and generators render it reliably. 'Natural window light' is the key phrase — it produces believable skin tones that studio words often miss.",
    tools: "Gemini or ChatGPT with a reference photo. Works nicely in Midjourney with --cref and --style raw for realism.",
    steps: [
      "Upload a bright, sharp reference photo.",
      "Choose your [BLAZER COLOR].",
      "Generate at 4:5.",
      "If the office steals focus, add: stronger background blur."
    ],
    variations: [
      "Seat her at a conference table instead.",
      "Add a laptop sleeve in hand for a candid work feel.",
      "Use golden evening light through the windows.",
      "Make it a walking mid-stride office candid."
    ],
    mistakes: [
      "Stiff passport-style posing undermines the 'presence' — keep the cross-arms-or-candid options.",
      "Overcast flat light drains energy from corporate shots.",
      "Logos and badges render as gibberish — avoid mentioning them."
    ],
    custom: ["outfit", "bg", "lighting", "angle", "fx", "ratio"],
    customOptions: {
      outfit: [
        ["Ivory Blazer", "Outfit: ivory blazer over a silk top."],
        ["Charcoal Blazer", "Outfit: charcoal blazer with a minimalist watch."],
        ["Deep Green", "Outfit: deep green blazer with gold earrings."],
        ["Navy Suit", "Outfit: navy pantsuit with a white shell top."]
      ],
      bg: [
        ["Glass Office", "Background: bright modern glass office with city bokeh."],
        ["Meeting Room", "Background: long conference table with chairs, softly blurred."],
        ["Rooftop Lounge", "Background: corporate rooftop lounge at golden hour."],
        ["Minimal Wall", "Background: warm minimal office wall with one art frame."]
      ]
    }
  },
  /* ---------- NEW: 3D Name Art ---------- */
  {
    id: "golden-letter-art",
    title: "3D Golden Letter Art",
    img: "assets/img/neon-name-art.jpg",
    cats: ["name-art", "trending"],
    uses: 3800, likes: 940, isNew: true,
    tagline: "Your initial as a glowing golden emblem — perfect for profile pictures and status art.",
    prompt: "Luxurious 3D render of a glossy metallic [METAL COLOR] letter '[LETTER]' floating in the center of the frame, surrounded by glowing [NEON COLOR] neon light wings and sparkling particles, deep black background, highly reflective surfaces, cinematic rim glow, premium emblem style, ultra detailed. Ratio 4:5.",
    tags: ["3D", "letter art", "gold", "neon", "logo", "name art", "emblem", "glow"],
    about: "Name-art renders go viral because they're personal AND wallpaper-worthy. The trick is keeping one hero letter, one metal, and one glow colour — restraint makes it premium.",
    how: "Floating center composition plus reflective materials forces the generator into a clean product-render mindset. Wings and particles add motion without introducing hard-to-render detail like hands or faces.",
    tools: "Any generator works — no face reference needed. Midjourney and Microsoft Designer both handle 3D type well; add --style raw for cleaner materials.",
    steps: [
      "Replace [LETTER] with your initial.",
      "Set [METAL COLOR] (gold, rose gold, silver) and [NEON COLOR].",
      "Generate at 4:5 or switch to 9:16 for story art.",
      "If the letter deforms, add: bold sans-serif letterform, perfectly symmetrical."
    ],
    variations: [
      "Swap wings for swirling smoke trails.",
      "Rest the letter on a dark marble podium.",
      "Make the particles rose petals or embers.",
      "Try a liquid-metal dripping style."
    ],
    mistakes: [
      "Full names render broken letters — stick to one or two initials.",
      "Multiple glow colours turn it into a fairground sign; one is luxury.",
      "Busy backgrounds kill the emblem feel — keep near-black."
    ],
    custom: ["bg", "mood", "fx", "ratio"],
    customOptions: {
      bg: [
        ["Pure Black", "Background: pure matte black, nothing else."],
        ["Smoke", "Background: dark background with slow drifting smoke."],
        ["Starfield", "Background: deep space starfield with tiny glowing stars."],
        ["Gold Dust", "Background: black with golden dust clouds swirling low."]
      ],
      mood: [
        ["Royal", "Style: royal luxurious emblem, clean and symmetrical."],
        ["Cyber", "Style: futuristic cyberpunk emblem with sharp neon edges."],
        ["Festive", "Style: festive celebration emblem with warm golden sparkle."],
        ["Dark Luxury", "Style: dark luxury perfume-ad aesthetic."]
      ]
    }
  },
  /* ---------- NEW: Anime ---------- */
  {
    id: "anime-blossom",
    title: "Anime Blossom Dreamer",
    img: "assets/img/anime-dreamer.jpg",
    cats: ["anime", "popular"],
    uses: 6700, likes: 1120, isNew: true,
    tagline: "Cherry blossoms, pastel skies and key-visual emotion — your anime alter ego awaits.",
    prompt: "Beautiful anime-style illustration of a teenage girl with short dark hair, standing under falling [FLOWER] petals, soft pastel sky with warm sunlight rays filtering through, gentle emotional expression, detailed anime key-visual art, delicate line work, vibrant yet soft color palette. Ratio 4:5.",
    tags: ["anime", "illustration", "cherry blossom", "pastel", "key visual", "girl", "emotional", "soft light"],
    about: "Anime prompts succeed on palette and emotion, not anatomy lectures. Naming the mood ('gentle', 'emotional') plus a flagship visual like falling petals gives the model a complete scene.",
    how: "'Key-visual art' is a magic phrase: it pushes models toward polished promotional-quality anime rather than sketchy fan art. Petal motion adds depth without complex background instructions.",
    tools: "Works everywhere without reference. Midjourney's --niji mode is superb for anime; Gemini and Designer handle it well too.",
    steps: [
      "Swap [FLOWER] for cherry blossom, marigold or snow.",
      "Generate at 4:5 — or 9:16 for phone wallpapers.",
      "For your own face in anime style, upload a photo and add: same person, anime version.",
      "If the style is too western, add: japanese anime style, cel shading."
    ],
    variations: [
      "Change the season to autumn maple leaves.",
      "Set it at night with festival lanterns.",
      "Give her a school bag on a train platform.",
      "Make it a two-character friendship scene."
    ],
    mistakes: [
      "Mixing 'anime' and 'photorealistic' creates uncanny results — pick one.",
      "Over-detailed outfit instructions break the cel look.",
      "Skipping the emotion word leaves faces empty; always name one."
    ],
    custom: ["bg", "mood", "time", "fx", "ratio"],
    customOptions: {
      bg: [
        ["Cherry Canopy", "Background: full cherry blossom canopy with blue sky gaps."],
        ["Train Platform", "Background: quiet rural train platform with warm lamps."],
        ["Rooftop Sky", "Background: school rooftop with endless sunset sky."],
        ["Lantern Night", "Background: night festival street with glowing paper lanterns."]
      ],
      mood: [
        ["Soft & Dreamy", "Style: soft dreamy pastel anime key visual."],
        ["Retro Anime", "Style: 90s retro anime look with film grain and warm tones."],
        ["Makoto-style Sky", "Style: dramatic cloud-filled painted sky, rich blues."],
        ["Cozy Ghibli-like", "Style: cozy hand-painted warmth, lush detail."]
      ]
    }
  },
  /* ---------- NEW: Nature ---------- */
  {
    id: "tea-garden-sunrise",
    title: "Tea Garden Sunrise",
    img: "assets/img/tea-garden.jpg",
    cats: ["nature", "popular"],
    uses: 2900, likes: 410,
    tagline: "Mist rolling over emerald hills at first light — Sylhet in a single frame.",
    prompt: "Breathtaking landscape photograph of misty emerald tea gardens on rolling hills in [LOCATION] at sunrise, a tea picker with a woven basket walking a narrow path between the rows, golden fog and light rays, lush vivid greens, layered hills fading into the distance, award-winning travel photography. Ratio 4:5.",
    tags: ["landscape", "tea garden", "sunrise", "mist", "hills", "green", "travel", "golden fog"],
    about: "Great landscape prompts are about layers: foreground path, midground picker, distant hills. Handing the model those layers explicitly is what separates postcard shots from wallpaper-grade art.",
    how: "Naming light ('golden fog and light rays') plus colour ('lush vivid greens') plus a human anchor (the picker) gives scale and warmth. Without the figure, AI landscapes often feel sterile.",
    tools: "No face reference needed — works in every generator including Microsoft Designer and Midjourney.",
    steps: [
      "Set [LOCATION] — Sylhet, Darjeeling, Sreemangal…",
      "Generate at 4:5, or switch to 16:9 for desktop wallpaper.",
      "If mist vanishes, add: thick valley fog between the hills.",
      "For a drone feel, add: aerial drone view."
    ],
    variations: [
      "Swap sunrise for blue-hour early light.",
      "Add a small wooden cottage in the valley.",
      "Make the picker a silhouette rimmed with sun.",
      "Rain-washed version: wet leaves glistening, grey-gold sky."
    ],
    mistakes: [
      "Crowding the scene with people kills the calm — one figure is enough.",
      "Oversaturated 'HDR look' turns greens toxic; say 'vivid', not 'neon'.",
      "Forgetting a foreground element flattens the depth — the path matters."
    ],
    custom: ["bg", "time", "mood", "fx", "ratio"],
    customOptions: {
      bg: [
        ["Rolling Hills", "Background: layered tea-garden hills fading into golden mist."],
        ["Valley Cottage", "Background: valley with a tiny wooden cottage and smoke from its chimney."],
        ["River Bend", "Background: silver river bending through the plantation."],
        ["Pine Ridge", "Background: pine forest ridge behind the tea rows."]
      ],
      time: [
        ["Sunrise", "Time of day: golden sunrise with low sun rays."],
        ["Blue Hour", "Time of day: cool blue hour just before dawn."],
        ["After Rain", "Time of day: just after monsoon rain, wet glistening leaves."],
        ["Late Afternoon", "Time of day: warm late-afternoon side light."]
      ]
    }
  },
  /* ---------- NEW: Cinematic additions ---------- */
  {
    id: "noir-cufflink",
    title: "Noir Cufflink",
    img: "assets/img/cinematic-suit.jpg",
    cats: ["professional", "cinematic"],
    uses: 6100, likes: 780,
    tagline: "Venetian-blind light, a black suit, and the quiet confidence of a film still.",
    prompt: "Low-key cinematic portrait of a stylish man, same face as the uploaded reference image, wearing a [SUIT COLOR] suit and adjusting his cufflink, a single dramatic light beam through venetian blinds falling across his face, film noir mood, deep shadows, ultra sharp detail, magazine quality. Keep the face identical to the reference. Ratio 4:5.",
    tags: ["man", "suit", "noir", "venetian blinds", "cinematic", "low key", "dramatic", "editorial"],
    about: "Film-noir portraits live on a single beam of light and everything else in shadow. The cufflink gesture gives the hands a job, which keeps the pose natural instead of stiff.",
    how: "'Single dramatic light beam through venetian blinds' is an instruction AI renders beautifully because it's physical and specific. The deep-shadow clause stops the model from filling everything with flat light.",
    tools: "Gemini or ChatGPT with a reference photo; Midjourney with --cref and --style raw is excellent for noir.",
    steps: [
      "Upload a reference photo.",
      "Pick your [SUIT COLOR] — black is the classic.",
      "Generate at 4:5.",
      "If the beam is missing, add: hard slatted light stripes across the face."
    ],
    variations: [
      "Seat him in a leather chair, legs crossed.",
      "Add thin smoke curling through the light beam.",
      "Make it black-and-white with one warm accent.",
      "Shift the beam to light only the eyes."
    ],
    mistakes: [
      "Any fill-light wording kills noir — shadows must stay deep.",
      "Busy suits fight with the slatted light; keep fabric plain.",
      "Smiling breaks the genre — keep expressions calm and unreadable."
    ],
    custom: ["outfit", "bg", "angle", "mood", "fx", "ratio"]
  },
  {
    id: "neon-alley",
    title: "Neon Alley",
    img: "assets/img/neon-alley.jpg",
    cats: ["cinematic", "trending"],
    uses: 8200, likes: 1030, isNew: true,
    tagline: "Rain, neon reflections and midnight city energy — a cyberpunk frame straight from 2099.",
    prompt: "Cyberpunk night portrait of a young man, same face as the uploaded reference image, wearing round glasses that reflect pink and blue neon signs, standing in a rainy alley in [CITY], wet asphalt mirroring the lights, light drizzle, high-contrast anamorphic cinematic look, moody futuristic atmosphere. Keep facial features identical to the reference. Ratio 4:5.",
    tags: ["cyberpunk", "neon", "night", "rain", "glasses reflection", "alley", "cinematic", "anamorphic"],
    about: "Neon portraits are all about reflections: glasses, wet asphalt, rain in the air. Give the model surfaces to bounce pink-and-blue light off, and the cyberpunk mood builds itself.",
    how: "The round-glasses reflection is the hero detail — it tells the generator exactly where the neon should live. 'Anamorphic' adds widescreen-style bokeh that reads instantly cinematic.",
    tools: "Gemini or ChatGPT with a reference photo. Midjourney: --cref plus --style raw keeps the rain photoreal.",
    steps: [
      "Upload a reference photo.",
      "Set [CITY] — Tokyo, Dhaka, anywhere.",
      "Generate at 4:5; switch to 9:16 for a poster wall.",
      "If colors wash out, add: strong pink and cyan neon contrast."
    ],
    variations: [
      "Give him a transparent umbrella catching neon.",
      "Add steam rising from a street stall behind.",
      "Make the alley a busy neon market street.",
      "Turn the palette fully teal-and-orange."
    ],
    mistakes: [
      "Bright ambient light kills neon contrast — night must stay dark.",
      "Too many signs turn reflections into mush; two colours maximum.",
      "Wide smiles break the cyberpunk mood — keep it cool and calm."
    ],
    custom: ["outfit", "bg", "mood", "fx", "ratio"],
    customOptions: {
      outfit: [
        ["Tech Jacket", "Outfit: matte black tech jacket with subtle reflective piping."],
        ["Hoodie", "Outfit: dark hoodie under an open rain jacket."],
        ["Long Coat", "Outfit: long charcoal coat with the collar up."],
        ["Streetwear", "Outfit: layered streetwear with a crossbody bag."]
      ],
      bg: [
        ["Neon Alley", "Background: narrow rainy alley lined with pink and blue neon signs."],
        ["Night Market", "Background: bustling neon-lit night market street."],
        ["Metro Entrance", "Background: glowing metro station entrance with rain."],
        ["Rooftop Edge", "Background: rooftop with a wall of neon city skyscrapers behind."]
      ]
    }
  },
  {
    id: "emerald-saree",
    title: "Emerald Saree Elegance",
    img: "assets/img/saree-elegance.jpg",
    cats: ["fashion", "popular"],
    uses: 7100, likes: 980, isNew: true,
    tagline: "Silk, gold and perfect window light — a magazine-cover studio portrait.",
    prompt: "Elegant studio portrait of a South Asian woman, same face as the uploaded reference image, wearing a deep [SAREE COLOR] silk saree with delicate gold jewelry, soft diffused window light from the side, minimalist warm grey backdrop, graceful refined pose, premium fashion-magazine photography, rich fabric detail. Keep facial features identical to the reference image. Ratio 4:5.",
    tags: ["woman", "saree", "silk", "studio", "fashion", "editorial", "gold jewelry", "window light"],
    about: "Studio saree portraits succeed on fabric and light. Naming silk plus soft side light gives the model texture and shadow falloff, which is what reads as 'premium fashion' to the eye.",
    how: "A minimal grey backdrop removes set-design risk entirely, so the generator concentrates on drape physics, sheen and jewelry. One direction of light sculpts the face like a real studio.",
    tools: "Gemini or ChatGPT with a reference photo; Midjourney with --cref and --style raw for editorial realism.",
    steps: [
      "Upload a reference photo.",
      "Set your [SAREE COLOR].",
      "Generate at 4:5 and check fabric sheen.",
      "If jewelry flattens, add: sharp detail on jewelry texture."
    ],
    variations: [
      "Swap the backdrop for deep maroon velvet.",
      "Add a low bun with fresh jasmine flowers.",
      "Try a standing-to-seated pose change on a wooden stool.",
      "Make it black-and-white with the saree in deep shadow tones."
    ],
    mistakes: [
      "Flat frontal light kills silk sheen — keep it from the side.",
      "Patterned backgrounds fight the saree's weave — stay minimal.",
      "Too many ornaments: one necklace OR statement earrings, not both."
    ],
    custom: ["outfit", "bg", "lighting", "angle", "fx", "ratio"],
    customOptions: {
      outfit: [
        ["Emerald Silk", "Outfit: deep emerald silk saree with delicate gold jewelry."],
        ["Wine Banarasi", "Outfit: wine banarasi saree with antique gold accents."],
        ["Midnight Blue", "Outfit: midnight blue silk saree with silver jewelry."],
        ["Ivory + Pearl", "Outfit: ivory chiffon saree with pearl jewelry."]
      ],
      bg: [
        ["Warm Grey", "Background: warm minimalist grey studio backdrop."],
        ["Maroon Velvet", "Background: deep maroon velvet drapes."],
        ["Heritage Arch", "Background: old heritage archway softly blurred."],
        ["Golden Panel", "Background: matte golden panel reflecting soft light."]
      ]
    }
  },
  {
    id: "monsoon-window",
    title: "Monsoon Window",
    img: "assets/img/monsoon-window.jpg",
    cats: ["cinematic", "popular"],
    uses: 3400, likes: 520, isNew: true,
    tagline: "Rain on glass, blue hour outside, warmth on her face — melancholy as art.",
    prompt: "Cinematic portrait of a young woman, same face as the uploaded reference image, looking through a rain-covered glass window at dusk, droplets in sharp focus, moody blue exterior light mixed with warm interior glow on her face, melancholic thoughtful expression, film photography aesthetic, shallow depth of field. Keep the face identical to the reference. Ratio 4:5.",
    tags: ["woman", "window", "rain", "dusk", "blue hour", "melancholic", "cinematic", "film look"],
    about: "The rain-on-glass shot works because it gives focus a job: droplets sharp, world soft, one warmly lit face between them. It's the cheapest masterpiece prompt in the library.",
    how: "Two colour temperatures (cold exterior blue, warm interior glow) create instant emotional conflict. Specifying 'droplets in sharp focus' stops the model from blurring the very thing that makes the shot.",
    tools: "Gemini or ChatGPT with a reference photo. In Midjourney, add --cref and keep stylize low for realism.",
    steps: [
      "Upload a calmer, neutral reference photo.",
      "Generate at 4:5.",
      "If droplets vanish, add: dense rain droplets on the glass in focus.",
      "For a happier twist, change 'melancholic' to 'quietly smiling'."
    ],
    variations: [
      "Add city lights as out-of-focus dots beyond the glass.",
      "Make it early morning with chai steam near her hand.",
      "Try her writing on the fogged part of the glass.",
      "Flip the mood: monsoon joy, laughing at the rain."
    ],
    mistakes: [
      "Daylight ruins the colour contrast — keep it dusk.",
      "Heavy smiling fights the melancholy framing; subtle is stronger.",
      "Wide shots lose the intimacy — stay close on the face."
    ],
    custom: ["bg", "time", "mood", "fx", "ratio"],
    customOptions: {
      bg: [
        ["Dusk Street", "Background: blurred blue dusk street beyond the wet glass."],
        ["City Lights", "Background: out-of-focus city light dots through the rain."],
        ["Room Glow", "Background: warm dim room visible behind her shoulder."],
        ["Station Window", "Background: old train window frame with platform lights beyond."]
      ]
    }
  }
];

var ARTICLES = [
  {
    slug: "write-perfect-ai-image-prompts",
    tag: "Tutorial",
    title: "How to Write Perfect AI Image Prompts: The Complete 2026 Guide",
    excerpt: "Master prompt structure, lighting keywords, camera language and the reference-photo workflow that professionals use for stunning portraits.",
    read: "6 min read",
    date: "September 2026",
    sections: [
      { h: "Start with subject and identity", p: "Every strong portrait prompt opens by naming the subject and — if you want your own face — anchoring it to a reference photo. Phrases like 'same face as the uploaded image' tell the generator that likeness matters more than imagination. Do this first, before describing anything else, because most models weight early tokens more heavily." },
      { h: "Describe light before style", p: "Beginners pile on style words. Professionals describe light. 'Soft window light from the left' or 'single warm key light against black' gives the model a physical scene to build, and style emerges naturally from it. One precise lighting sentence beats five vague adjectives like 'beautiful, stunning, epic'." },
      { h: "Camera language beats camera brands", p: "You don't need to name an expensive lens. Saying '85mm portrait look' or 'shallow depth of field' communicates compression and background blur that any modern generator understands. Behaviour ('harsh direct flash') is more reliable than gear ('shot on a Contax T2')." },
      { h: "Lock your aspect ratio", p: "Always end with the ratio. Portraits for Instagram and Facebook feed posts shine at 4:5; stories and reels want 9:16; YouTube thumbnails need 16:9. Without a ratio instruction the model guesses — and often guesses square." },
      { h: "Mistakes that quietly ruin prompts", p: "The three killers: contradictory lighting ('bright noon sun, moody shadows'), stacked styles ('watercolor, photorealistic, 3D render'), and missing identity anchors when likeness matters. Keep one mood, one style, one clear subject — then iterate one variable at a time." }
    ]
  },
  {
    slug: "best-free-ai-image-tools",
    tag: "Tools",
    title: "8 Free AI Image Generators Worth Your Time in 2026",
    excerpt: "Where should you actually run these prompt templates? A practical tour of free tools — and what each one is genuinely good at.",
    read: "5 min read",
    date: "September 2026",
    sections: [
      { h: "Google Gemini", p: "The current crowd favourite for self-portraits. Upload your photo, paste a TEZOFY prompt, and it holds your likeness impressively well. Free tier limits apply, but for one-off festive portraits it's hard to beat." },
      { h: "ChatGPT image mode", p: "Excellent at following long, structured prompts — wardrobe changes, lighting notes and ratio instructions all land reliably. Also accepts reference photos. The free tier has daily caps, so use your best prompt first." },
      { h: "Microsoft Designer (Bing Image Creator)", p: "The veteran free option. No photo-reference upload, so faces won't look like you — but for scenery, name art and concept images it remains fast and generous." },
      { h: "Meta AI", p: "Built into WhatsApp and Instagram, which makes it the most convenient generator on this list. Quality is solid for casual portraits, and the in-chat 'imagine' flow is perfect for quick festival greetings." },
      { h: "Leonardo, Playground and other credit-based tools", p: "Several platforms offer daily free credits with fine-grained controls — great once you're comfortable and want negative prompts and style presets. Start with the big four above, then graduate here." },
      { h: "How to choose in 10 seconds", p: "Need your own face? Gemini or ChatGPT. Need speed inside a chat app? Meta AI. Need text-free scenery or logos? Microsoft Designer. Everything on TEZOFY's detail pages notes which tool fits that specific template." }
    ]
  },
  {
    slug: "couple-photo-prompt-tips",
    tag: "Prompts",
    title: "AI Couple Photos: 7 Tips for Natural, Romantic Portraits",
    excerpt: "Stop getting plastic skin and stiff poses — these small prompt tweaks make AI couple photos look like real memories.",
    read: "4 min read",
    date: "August 2026",
    sections: [
      { h: "1. Candid beats posed", p: "Words like 'candid', 'mid-laugh' and 'looking at each other, not the camera' produce intimacy. The moment both subjects 'smile at the camera', you're back to passport-photo energy." },
      { h: "2. Give them something to do", p: "Walking, pouring tea, adjusting a scarf — a shared action gives hands purpose and kills the mannequin look that ruins most AI couple shots." },
      { h: "3. One light source, please", p: "A single sunset, one window, one string of lights. Multiple competing light sources flatten faces and confuse shadows; one source keeps the mood coherent." },
      { h: "4. Describe each person briefly", p: "'The man in a navy panjabi, the woman in a red saree' — short, distinct wardrobe notes stop the model blending the two faces into one averaged stranger." },
      { h: "5. Golden hour is your safety net", p: "When in doubt, golden hour. Warm rim light forgives imperfect skin rendering and instantly reads as romantic." },
      { h: "6. Keep the horizon clean", p: "Busy backgrounds introduce extra faces, and extra faces render badly. 'Empty beach', 'quiet riverbank', 'blurred old town street' — pick low-traffic scenes." },
      { h: "7. Iterate one variable at a time", p: "Change the pose OR the light OR the location — never all three at once. That way you learn what your favourite generator actually responds to, and your prompts get sharper every round." }
    ]
  },
  {
    slug: "durga-puja-ai-photo-guide",
    tag: "Seasonal",
    title: "Durga Puja AI Photos: The Complete Festive Guide",
    excerpt: "Pandal lights, saree textures and authentic Puja moments — how to generate festive portraits that feel real, this season.",
    read: "5 min read",
    date: "September 2026",
    sections: [
      { h: "Why festive prompts need extra care", p: "Festivals are chaos: crowds, colours, mixed lighting. Without guidance, AI turns that chaos into mush. The secret is naming exactly two hero elements — say the saree and the pandal lights — and letting everything else blur away." },
      { h: "Wardrobe words that work", p: "'White saree with red border' is a cultural anchor every major generator understands instantly. Add one jewelry maximum — 'gold bangles' or 'small bindi' — because stacking ornaments is where faces start to melt." },
      { h: "Light like a pandal", p: "Pandal light is warm, high and everywhere. 'Warm golden bulbs' and 'soft key light on the face' together recreate it. Skip 'colorful LED' wording unless you genuinely want club lighting on a saree portrait." },
      { h: "Moments worth prompting", p: "Beyond the classic thali pose: sindoor khela's red haze, dhunuchi dance with drifting smoke, pushpanjali cupped hands, and chop-pull candids at the food stalls. Each tells a bigger story than a plain portrait." },
      { h: "Final checklist", p: "Reference photo uploaded, ratio set to 4:5, one hero prop, one lighting phrase, one emotion word. Generate three variations, keep the best — that's the whole workflow." }
    ]
  }
];

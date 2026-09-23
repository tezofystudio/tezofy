/* ============================================================
   TEZOFY Infinite Prompt Engine  (v2.1 — global labels)
   Combinatorial generator — 21 categories, ~23M unique prompts.
   Works in browser (window.TezofyEngine) and Node (module.exports).
   ============================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) { module.exports = factory(); }
  else { root.TezofyEngine = factory(); }
}(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var RATIO = ["4:5", "1:1", "9:16", "16:9"];
  var RATIO_LABEL = { "4:5": "Portrait 4:5", "1:1": "Square 1:1",
                      "9:16": "Story 9:16", "16:9": "Wide 16:9" };

  var CATS = {
    festival: {
      label: "Festival", emoji: "🪔",
      placeholders: [["CITY", "Dhaka"]],
      template: "{subject}, {setting}, {style}, {light}, {camera}, {extra}. Ratio {ratio}.",
      slots: [
        ["subject", [
          "a joyful woman in a red-and-white laal paar saree",
          "an energetic dhaak drummer with the drum slung over his shoulder",
          "an elderly idol artisan with hands dusted in white clay",
          "laughing children in handmade Halloween costumes",
          "a family lighting rows of diyas together",
          "a woman applying sindoor to her friend's hair parting",
          "a samba drummer strapped with a bright drum",
          "a Venetian mask maker holding a gilded carnival mask"]],
        ["setting", [
          "at a Durga Puja mandap in [CITY]",
          "on a pumpkin-lit wooden porch at dusk",
          "at a Rio carnival street parade",
          "in a centuries-old Venice atelier at dawn",
          "in a Diwali courtyard glowing at night",
          "at a Christmas morning gathering by the tree",
          "at a riverside lantern festival in [CITY]",
          "at a color-filled Holi morning",
          "in a crowded old-town festival alley"]],
        ["style", [
          "award-winning documentary photography",
          "cinematic editorial style",
          "warm candid family photography",
          "National Geographic documentary style",
          "vivid festival reportage",
          "fine-art color photography"]],
        ["light", [
          "warm bokeh of festival lamps behind",
          "golden-hour rim light",
          "candlelit chiaroscuro",
          "firework glow against the night sky",
          "soft morning haze light",
          "neon and lantern mixed glow"]],
        ["camera", [
          "medium close-up, 85mm f/1.8",
          "low-angle hero shot",
          "candid mid-motion frame",
          "wide environmental shot",
          "intimate over-the-shoulder frame"]],
        ["extra", [
          "film grain",
          "light haze",
          "confetti floating in the air",
          "incense smoke drift",
          "falling autumn leaves",
          "shallow depth of field"]]
      ]
    },

    wedding: {
      label: "Wedding & Bridal", emoji: "💍",
      placeholders: [["CITY", "Dhaka"]],
      template: "{subject}, {setting}, {style}, {light}, {camera}, {extra}. Ratio {ratio}.",
      slots: [
        ["subject", [
          "a radiant bride in a red-and-gold bridal saree",
          "a bride in a soft lace gown with a flowing veil",
          "a groom adjusting his sherwani buttons",
          "a groom in a classic black tuxedo",
          "folded hands showing intricate dark mehndi",
          "a bride's hands with platinum rings over silk",
          "a flower girl scattering petals",
          "a couple exchanging garlands"]],
        ["setting", [
          "at a candlelit holud ceremony in [CITY]",
          "at a Tuscan vineyard ceremony",
          "in a marigold-decorated courtyard",
          "at a chapel with stained-glass light",
          "under a rose-covered wedding arch",
          "at a seaside evening reception",
          "in a heritage palace hall",
          "at a cozy winter cabin wedding"]],
        ["style", [
          "fine-art wedding photography",
          "editorial bridal magazine style",
          "warm candid wedding reportage",
          "luxurious cinematic style",
          "vintage film wedding aesthetic"]],
        ["light", [
          "honeyed golden-hour light",
          "soft window light with warm haze",
          "candlelit glow with fairy-light bokeh",
          "stained-glass color beams",
          "overcast soft diffuse light"]],
        ["camera", [
          "intimate medium close-up, 100mm f/2.0",
          "macro detail shot",
          "wide ceremony shot",
          "candid mid-laugh frame",
          "elegant full-length portrait"]],
        ["extra", [
          "shallow depth of field",
          "dreamy warm haze",
          "petal bokeh",
          "film grain",
          "ultra-detailed fabric texture"]]
      ]
    },

    couple: {
      label: "Couple", emoji: "💑",
      placeholders: [["CITY", "Dhaka"]],
      template: "{subject}, {setting}, {style}, {light}, {camera}, {extra}, natural unposed energy. Ratio {ratio}.",
      slots: [
        ["subject", [
          "a young couple walking hand in hand",
          "a couple sharing one transparent umbrella",
          "a couple laughing over two coffee cups",
          "a couple dancing slowly in the kitchen",
          "a couple on a vintage scooter",
          "a couple holding sparklers at night",
          "a couple sitting on a rooftop edge",
          "a couple hugging at an airport arrival"]],
        ["setting", [
          "along the wet shoreline of Cox's Bazar at sunset",
          "on the white-washed cliffs of Santorini",
          "in a rain-washed old-town alley in [CITY]",
          "under cherry blossoms in a quiet park",
          "at a snowy Christmas market",
          "on a golden-hour rooftop in [CITY]",
          "in a lavender field at dusk",
          "by a misty lake at sunrise"]],
        ["style", [
          "cinematic couple photography",
          "candid love-story reportage",
          "vintage film romance",
          "editorial pre-wedding style",
          "dreamy soft aesthetic"]],
        ["light", [
          "orange-pink sunset glow",
          "blue-hour city lights",
          "string-light bokeh",
          "soft overcast light",
          "golden-hour rim light"]],
        ["camera", [
          "wide romantic shot",
          "mid-shot with long shadows",
          "candid close frame",
          "silhouette frame",
          "over-the-shoulder pair shot"]],
        ["extra", [
          "footprints trailing behind",
          "mirror-sand reflections",
          "light haze",
          "film grain",
          "gentle lens flare"]]
      ]
    },

    professional: {
      label: "Professional", emoji: "💼",
      placeholders: [["COMPANY", "your company"]],
      template: "{subject}, {setting}, {style}, {light}, {camera}, {extra}, approachable yet authoritative. Ratio {ratio}.",
      slots: [
        ["subject", [
          "a confident startup founder in a smart casual blazer",
          "a female executive in a tailored navy suit",
          "a doctor in a crisp white coat",
          "a young graduate in gown and mortarboard",
          "a creative director in a roll-neck knit",
          "a lawyer holding a leather folio",
          "a chef in a pristine chef coat",
          "an engineer with a rolled blueprint"]],
        ["setting", [
          "in a sunlit brick loft studio",
          "in a glass-walled office at blue hour",
          "at the [COMPANY] headquarters lobby",
          "against a clean studio grey backdrop",
          "in a modern library with warm shelves",
          "on a minimal concrete stairwell",
          "in a bright co-working space",
          "before a soft-focus city skyline"]],
        ["style", [
          "LinkedIn-ready corporate photography",
          "crisp editorial headshot",
          "business magazine cover style",
          "approachable startup aesthetic",
          "classic executive portraiture"]],
        ["light", [
          "optimistic mid-morning window light",
          "soft studio key with gentle rim",
          "blue-hour office glow",
          "warm practical lamps",
          "clean high-key light"]],
        ["camera", [
          "head-and-shoulders headshot",
          "three-quarter executive frame",
          "environmental portrait",
          "confident mid-shot",
          "slight low-angle authority shot"]],
        ["extra", [
          "shallow depth of field",
          "natural skin texture",
          "subtle film grain",
          "soft background bokeh",
          "crisp fabric detail"]]
      ]
    },

    cinematic: {
      label: "Cinematic", emoji: "🎬",
      placeholders: [["CITY", "Dhaka"]],
      template: "{subject}, {setting}, {style}, {light}, {camera}, {extra}. Ratio {ratio}.",
      slots: [
        ["subject", [
          "a lone detective in a long coat",
          "a street musician with a battered guitar",
          "a racer leaning on a vintage motorcycle",
          "a chef in a smoky night kitchen",
          "a boxer wrapping hands under a single bulb",
          "a traveler with a worn leather journal",
          "a hacker in a neon-lit room",
          "a pilot walking from a jet at dusk"]],
        ["setting", [
          "in a rain-soaked neon alley",
          "on a rooftop above old [CITY] at dusk",
          "in a dusty desert highway diner",
          "inside a moving night train",
          "in a foggy harbor at blue hour",
          "in a grand hotel corridor",
          "on a snow-covered mountain pass",
          "in a retro arcade glowing at night"]],
        ["style", [
          "movie-poster cinematography",
          "gritty noir style",
          "Wes Anderson symmetry",
          "epic trailer key art",
          "documentary cinema verite"]],
        ["light", [
          "neon-noir glow",
          "volumetric god rays",
          "single-bulb chiaroscuro",
          "blue-hour haze",
          "warm practicals-only light"]],
        ["camera", [
          "anamorphic wide frame",
          "dutch angle tension shot",
          "slow-push mid shot",
          "silhouette wide frame",
          "tight character close-up"]],
        ["extra", [
          "film grain",
          "rain streaks catching light",
          "smoke drift",
          "light haze",
          "subtle lens flare"]]
      ]
    },

    retro: {
      label: "Retro & Vintage", emoji: "📸",
      placeholders: [["CITY", "Dhaka"]],
      template: "{subject}, {setting}, {style}, {light}, {camera}, {extra}, nostalgic album aesthetic. Ratio {ratio}.",
      slots: [
        ["subject", [
          "a couple in a chrome diner booth",
          "a family posing beside a vintage car",
          "a bride with a 90s perm and red saree",
          "friends laughing at a roller rink",
          "a student with a cassette player",
          "a wedding group under a decorated pandal",
          "a picnic family in 70s outfits",
          "a young man with aviators and a film camera"]],
        ["setting", [
          "at a midnight diner in [CITY]",
          "beside a flower-decorated vintage car",
          "in a 90s wedding album courtyard",
          "at a summer boardwalk",
          "in a wood-paneled living room",
          "at a drive-in movie night",
          "around a 70s kitchen table",
          "at a vintage studio with painted backdrop"]],
        ["style", [
          "35mm point-and-shoot look",
          "80s album flash photo",
          "70s faded kodachrome",
          "early-2000s digital camera look",
          "sepia memory print"]],
        ["light", [
          "direct on-camera flash",
          "warm faded indoor light",
          "sunny overexposed noon",
          "tungsten evening glow",
          "window daylight with lace curtain shadows"]],
        ["camera", [
          "centered snapshot frame",
          "slightly tilted candid",
          "group row composition",
          "close flash portrait",
          "wide room snapshot"]],
        ["extra", [
          "soft vignette",
          "light leaks",
          "dust and scratches",
          "mild color cast",
          "orange date stamp corner"]]
      ]
    },

    fashion: {
      label: "Fashion & Studio", emoji: "👗",
      placeholders: [["CITY", "Dhaka"]],
      template: "{subject}, {setting}, {style}, {light}, {camera}, {extra}. Ratio {ratio}.",
      slots: [
        ["subject", [
          "a model in a handwoven jamdani saree",
          "a model in a structured haute-couture gown",
          "a model in an oversized trench and boots",
          "a model in silk streetwear layers",
          "a model in a vintage tuxedo",
          "a model in minimalist linen co-ords",
          "a model in a feathered editorial cape",
          "a model in a monochrome avant-garde look"]],
        ["setting", [
          "against a textured terracotta wall",
          "on a Haussmann facade Paris street",
          "in a brutalist concrete gallery",
          "on a minimal studio seamless",
          "in an old colonial arcade in [CITY]",
          "on a desert dune at golden hour",
          "in a mirrored hallway",
          "on a foggy cobblestone lane"]],
        ["style", [
          "Vogue editorial aesthetic",
          "heritage fashion story",
          "minimal modern campaign",
          "old-money aesthetic",
          "avant-garde magazine cover"]],
        ["light", [
          "soft overcast key light",
          "hard noon shadow play",
          "studio strobe with rim",
          "golden-hour raking light",
          "moody single-source light"]],
        ["camera", [
          "full-length editorial frame",
          "tight crop on fabric detail",
          "low-angle power pose",
          "walking paparazzi frame",
          "symmetrical center frame"]],
        ["extra", [
          "ultra-detailed weave texture",
          "sculptural fabric folds",
          "subtle film grain",
          "wind-blown movement",
          "crisp jewelry sparkle"]]
      ]
    },

    anime: {
      label: "Anime & Manga", emoji: "🌸",
      placeholders: [["CITY", "Dhaka"]],
      template: "{subject}, {setting}, {style}, {light}, {camera}, {extra}, ultra-detailed background art. Ratio {ratio}.",
      slots: [
        ["subject", [
          "a student with a transparent umbrella",
          "a shrine maiden carrying a paper lantern",
          "a mecha pilot in a worn suit",
          "a cat-eared barista",
          "a ronin girl under falling petals",
          "a sky courier with brass goggles",
          "a ghost friend made of starlight",
          "a train-window daydreamer"]],
        ["setting", [
          "at a Tokyo crossing during night rain",
          "on an old [CITY] rooftop in monsoon",
          "in a floating sky market",
          "at a sunset train platform",
          "in a neon ramen alley",
          "above a sea of clouds at dawn",
          "in a firefly forest at blue hour",
          "in a cozy retro coffee shop"]],
        ["style", [
          "Makoto Shinkai-inspired key visual",
          "Ghibli cozy illustration",
          "crisp cel-shaded anime",
          "retro 90s OVA aesthetic",
          "watercolor anime background art"]],
        ["light", [
          "neon bokeh glow",
          "golden-hour backlight",
          "rainy blue-hour light",
          "warm practical lamps",
          "painted sunset sky"]],
        ["camera", [
          "wide establishing key visual",
          "intimate close-up",
          "dynamic low angle",
          "quiet symmetrical frame",
          "over-the-shoulder vista"]],
        ["extra", [
          "rain streaks",
          "petal drift",
          "bokeh bubbles",
          "light haze",
          "sparkling dust"]]
      ]
    },

    nature: {
      label: "Nature & Landscapes", emoji: "🌿",
      placeholders: [["CITY", "Sylhet"]],
      template: "{subject}, {setting}, {style}, {light}, {camera}, {extra}, tranquil award-winning travel photography. Ratio {ratio}.",
      slots: [
        ["subject", [
          "a wooden boat with one boatman",
          "a red kayak with a lone paddler",
          "a tea picker with a woven basket",
          "a hiker on a ridge with trekking poles",
          "a deer at the forest edge",
          "a lighthouse keeper on the cliff",
          "a cyclist on an empty coastal road",
          "a shepherd with a flock in mist"]],
        ["setting", [
          "in Ratargul swamp forest near [CITY]",
          "on a Norwegian fjord mirror water",
          "across emerald tea gardens of [CITY]",
          "above a sea-of-clouds summit",
          "in an autumn birch valley",
          "along a black-sand beach at sunrise",
          "on a lavender plateau at blue hour",
          "beside a frozen waterfall"]],
        ["style", [
          "award-winning travel photography",
          "National Geographic landscape",
          "serene minimal landscape",
          "epic matte-painting vista",
          "analog film landscape"]],
        ["light", [
          "misty morning light shafts",
          "golden-hour rays",
          "blue-hour calm",
          "storm-light drama",
          "midnight sun glow"]],
        ["camera", [
          "layered wide vista",
          "aerial drone top-down",
          "intimate foreground path frame",
          "panoramic composition",
          "telephoto compression shot"]],
        ["extra", [
          "mirror reflections",
          "light haze",
          "drifting mist",
          "film grain",
          "a distant starling murmuration"]]
      ]
    },

    "name-art": {
      label: "3D Name Logos", emoji: "✨",
      placeholders: [["NAME", "TEZOFY"]],
      template: "Luxurious 3D name art of the name '[NAME]' in {material}, {pedestal}, {look}, {light}, {extra}, ultra-sharp clean 3D render. Ratio {ratio}.",
      slots: [
        ["material", [
          "polished gold lettering",
          "liquid chrome with neon cyan edge",
          "rose gold with pearl inlay",
          "emerald jewel lettering",
          "matte black with gold trim",
          "holographic iridescent metal",
          "cracked marble with gold veins",
          "neon magenta glass glow"]],
        ["pedestal", [
          "standing on a black marble pedestal",
          "floating above wet asphalt reflections",
          "on royal red velvet with gold dust",
          "above a mosque silhouette at dusk",
          "in a smoke-and-sparks arena",
          "on a carbon-fiber stage",
          "above a cloud bed at sunrise",
          "in a dark luxury void"]],
        ["look", [
          "royal premium look",
          "cyberpunk premium look",
          "minimal luxury look",
          "festive glow look",
          "gaming esports look",
          "elegant heritage look"]],
        ["light", [
          "soft studio spotlights",
          "neon edge glow",
          "golden sparkle particles",
          "volumetric light rays",
          "candle-warm rim light"]],
        ["extra", [
          "floating gold dust",
          "subtle rain mist",
          "light streaks",
          "bokeh bubbles",
          "gentle smoke",
          "mirror reflections"]]
      ]
    },

    birthday: {
      label: "Birthday", emoji: "🎂",
      placeholders: [["NAME", "Riya"], ["MONTH", "September"]],
      template: "{subject}, {setting}, {style}, {light}, {camera}, {extra}. Presented as a scrapbook birthday poster: five casual photo frames with thin black borders scattered on cream paper, handwritten calligraphy reading 'Happy Birthday [NAME]', a [MONTH] calendar block with the date circled in red, butterfly and floral doodles, small handwritten notes. Ratio {ratio}.",
      slots: [
        ["subject", [
          "a young woman in a festive ethnic outfit",
          "a smiling teenager with a birthday crown",
          "a man in a smart casual shirt",
          "a little girl with a ribbon headband",
          "a young man in a denim jacket",
          "a woman in a pastel saree"]],
        ["setting", [
          "surrounded by a golden balloon arch and fairy lights",
          "at a rooftop candlelit dinner table",
          "holding a chocolate cake with lit candles",
          "in a flower-decorated garden corner",
          "against a pastel studio backdrop with confetti",
          "in a cozy room with warm string lights"]],
        ["style", [
          "scrapbook birthday poster style",
          "elegant editorial birthday portrait",
          "soft cinematic celebration style",
          "premium photo collage style"]],
        ["light", [
          "warm fairy-light glow",
          "soft golden window light",
          "candlelit warm tones",
          "bright pastel studio light"]],
        ["camera", [
          "full-body collage frames",
          "medium close-up",
          "candid laughing frame",
          "three-quarter portrait"]],
        ["extra", [
          "confetti drift",
          "balloon bokeh",
          "butterfly doodles",
          "sparkler glow",
          "rose petal scatter",
          "handwritten notes"]]
      ]
    },

    family: {
      label: "Family", emoji: "👨👩‍👧",
      placeholders: [],
      template: "{subject}, {setting}, {style}, {light}, {camera}, {extra}. Ratio {ratio}.",
      slots: [
        ["subject", [
          "a mother and son in matching brown tops and denim",
          "a family of four in coordinated pastel outfits",
          "a father-daughter duo in matching white kurtas",
          "three siblings in matching festive wear",
          "a joint family of six in elegant ethnic wear",
          "a young couple with their toddler"]],
        ["setting", [
          "against a soft lavender seamless studio backdrop",
          "on a cream sofa in a sunlit living room",
          "in a blooming garden at golden hour",
          "against a warm terracotta studio backdrop",
          "on heritage palace steps",
          "in a minimal white studio"]],
        ["style", [
          "clean studio family portraiture",
          "warm candid family photography",
          "premium editorial family portrait",
          "festive family album style"]],
        ["light", [
          "bright soft high-key studio light",
          "golden-hour window light",
          "warm practical home light",
          "soft overcast outdoor light"]],
        ["camera", [
          "back-to-back playful pose",
          "seated row composition",
          "walking hand-in-hand frame",
          "group hug close frame"]],
        ["extra", [
          "coordinated wardrobe colors",
          "natural genuine smiles",
          "soft pastel grade",
          "subtle film grain",
          "clean uncluttered backdrop"]]
      ]
    },

    maternity: {
      label: "Maternity", emoji: "🤰",
      placeholders: [],
      template: "{subject}, {setting}, {style}, {light}, {camera}, {extra}. Ratio {ratio}.",
      slots: [
        ["subject", [
          "an expecting mother in a flowing red gown",
          "a couple cradling the baby bump together",
          "an expecting mother in a golden saree",
          "an expecting mother in an elegant emerald gown",
          "a solo expecting mother in ivory silk",
          "an expecting mother with a floral crown"]],
        ["setting", [
          "against a deep red seamless studio backdrop",
          "in a sunlit nursery with soft curtains",
          "in a blooming garden at golden hour",
          "against a charcoal studio backdrop with rim light",
          "in a heritage courtyard at dusk",
          "on a bed of white roses"]],
        ["style", [
          "premium maternity editorial",
          "soft fine-art maternity portrait",
          "intimate cinematic maternity style",
          "classic studio maternity album"]],
        ["light", [
          "dramatic soft studio light",
          "golden-hour glow",
          "gentle window light with sheer diffusion",
          "rim light on silhouette"]],
        ["camera", [
          "intimate three-quarter frame",
          "profile silhouette of the bump",
          "seated couple composition",
          "close frame on hands over bump"]],
        ["extra", [
          "coordinated contrast wardrobe",
          "silk fabric drape",
          "warm tender mood",
          "subtle film grain",
          "minimal props"]]
      ]
    },

    threed: {
      label: "3D Portraits", emoji: "🧊",
      placeholders: [["NAME", "Ayaan"]],
      template: "Hyper-realistic 3D character portrait of [NAME]: {subject}, {setting}, {style}, {light}, {camera}, {extra}, natural skin subsurface scattering, ultra-detailed 3D render. Ratio {ratio}.",
      slots: [
        ["subject", [
          "a stylish young man with textured hair",
          "a young woman in a hijab with floral accents",
          "a boy in a superhero hoodie",
          "a girl in a pastel hoodie with headphones",
          "a man in a sharp black suit",
          "a woman in a red saree with gold jewelry"]],
        ["setting", [
          "standing in a neon-lit city street",
          "in a cozy café with warm lamps",
          "on a fantasy cloud staircase",
          "in a luxury studio with gold particles",
          "in a cherry-blossom courtyard",
          "against a gradient studio backdrop"]],
        ["style", [
          "hyper-realistic 3D character portrait",
          "Pixar-grade 3D render",
          "Unreal Engine 5 character render",
          "claymation cute 3D style",
          "glossy collectible figure style"]],
        ["light", [
          "soft cinematic three-point light",
          "neon rim glow",
          "golden sparkle particles",
          "studio softbox light"]],
        ["camera", [
          "confident full-body stance",
          "dynamic three-quarter pose",
          "close-up bust shot",
          "walking-toward-camera pose"]],
        ["extra", [
          "detailed fabric weave",
          "subtle depth of field",
          "crisp eye highlights",
          "premium color grade",
          "soft background bokeh"]]
      ]
    },

    men: {
      label: "Men Style", emoji: "\ud83e\uddd4",
      placeholders: [],
      template: "{subject}, {setting}, {style}, {light}, {camera}, {extra}. Ratio {ratio}.",
      slots: [
        ["subject", [
          "a bearded man in a tailored charcoal suit",
          "a young man in a black bandhgala jacket",
          "a man in a leather biker jacket with aviators",
          "a gym-fit man in a henley shirt",
          "a silver-haired gentleman in a linen shirt",
          "a student in a varsity jacket with headphones"]],
        ["setting", [
          "against a dark moody studio backdrop",
          "on a neon-lit night street",
          "in a vintage barbershop with leather chairs",
          "beside a matte-black superbike",
          "on a rooftop at dusk with city bokeh",
          "in front of a raw concrete wall"]],
        ["style", [
          "groom editorial style",
          "gq magazine cover look",
          "rugged outdoor lifestyle look",
          "streetwear hype look",
          "old-money luxury aesthetic",
          "cinematic noir look"]],
        ["light", [
          "dramatic Rembrandt lighting",
          "moody rim light with smoke",
          "golden-hour backlight",
          "neon cyan and magenta wash",
          "clean beauty-dish studio light",
          "hard flash with deep shadows"]],
        ["camera", [
          "85mm f/1.4 portrait",
          "50mm f/1.8 environmental portrait",
          "low-angle hero shot",
          "medium close-up with jawline emphasis",
          "three-quarter editorial frame"]],
        ["extra", [
          "subtle smoke haze",
          "watch and ring details",
          "leather texture details",
          "reflection in sunglasses",
          "water droplets on skin",
          "fine film grain finish"]]
      ]
    },

    women: {
      label: "Women's Fashion", emoji: "\ud83d\udc83",
      placeholders: [],
      template: "{subject}, {setting}, {style}, {light}, {camera}, {extra}. Ratio {ratio}.",
      slots: [
        ["subject", [
          "a woman in a flowing chiffon saree with statement jhumkas",
          "a woman in a tailored pantsuit with slicked-back hair",
          "a woman in a pastel anarkali with delicate embroidery",
          "a woman in a satin slip dress with layered gold jewelry",
          "a woman in an embroidered sharara set",
          "a woman with soft waves in a blazer dress"]],
        ["setting", [
          "in a sunlit courtyard with arches",
          "against a floor-to-ceiling window with sheer curtains",
          "on a marble staircase with brass rails",
          "in a field of white flowers",
          "in a heritage haveli corridor",
          "on a minimalist beige studio set"]],
        ["style", [
          "vogue editorial style",
          "soft romantic portrait style",
          "high-fashion couture look",
          "minimal scandinavian aesthetic",
          "indian couture look",
          "clean beauty campaign look"]],
        ["light", [
          "soft window light with silk diffusion",
          "golden-hour glow",
          "butterfly beauty lighting",
          "dramatic single spotlight",
          "pastel gel wash",
          "backlit halo glow"]],
        ["camera", [
          "85mm f/1.8 portrait",
          "full-length 35mm fashion frame",
          "beauty close-up with catchlights",
          "over-the-shoulder editorial angle",
          "symmetrical center composition"]],
        ["extra", [
          "fabric in motion",
          "jewelry sparkle details",
          "soft glowing skin retouch",
          "petals drifting in the air",
          "reflection in a vintage mirror",
          "delicate shadow patterns"]]
      ]
    },

    calendar: {
      label: "Calendar", emoji: "\ud83d\uddd3\ufe0f",
      placeholders: [["NAME", "Ayesha"], ["MONTH", "January"]],
      template: "{subject}, {setting}, {style}, {light}, {camera}, {extra}. Presented as an elegant monthly calendar poster: a large portrait above a clean [MONTH] calendar grid with soft serif numbers, the name [NAME] in refined calligraphy, subtle botanical line-art accents and a matching color palette. Ratio {ratio}.",
      slots: [
        ["subject", [
          "a poised woman in an ivory co-ord set",
          "a cheerful man in a pastel kurta",
          "a smiling young woman holding fresh tulips",
          "a gentleman in a beige blazer with a pocket square",
          "a woman in a floral wrap dress",
          "a little girl in a frock with a satin bow"]],
        ["setting", [
          "against a soft solid studio backdrop",
          "by a sunlit window with linen curtains",
          "in a minimal arch-frame set",
          "on a pastel-toned set with geometric props",
          "amid floating paper flowers",
          "against a textured handmade paper backdrop"]],
        ["style", [
          "minimal elegant calendar design",
          "botanical watercolor theme",
          "luxury gold-foil theme",
          "soft pastel dream theme",
          "modern typographic theme",
          "vintage art-deco theme"]],
        ["light", [
          "soft even studio light",
          "gentle morning glow",
          "warm candlelit tone",
          "bright airy high-key light",
          "delicate window sidelight",
          "matte softbox light"]],
        ["camera", [
          "chest-up portrait framing",
          "three-quarter elegant pose",
          "symmetrical hero frame",
          "soft close-up with negative space above",
          "clean catalog crop"]],
        ["extra", [
          "pressed-flower accents",
          "gold-foil border details",
          "dotted grid lines",
          "tiny star doodles",
          "ribbon bookmark motif",
          "corner flourish ornaments"]]
      ]
    },

    baby: {
      label: "Little Baby", emoji: "\ud83d\udc63",
      placeholders: [["NAME", "Aarav"]],
      template: "{subject}, {setting}, {style}, {light}, {camera}, {extra}. A heartwarming portrait of little [NAME] — soft knitted props, gentle pastel palette and tiny keepsake details. Ratio {ratio}.",
      slots: [
        ["subject", [
          "a sleepy newborn curled in a knitted blanket",
          "a giggling baby in a tiny onesie",
          "a baby in a crochet bear-eared bonnet",
          "a curious baby reaching for a soft toy",
          "twin babies in matching pastel rompers",
          "a baby lying on a fluffy cloud pillow"]],
        ["setting", [
          "in a woven basket on soft fleece",
          "on a pastel knit blanket with tiny garlands",
          "in a mini teepee tent",
          "on a cloud-soft fur rug",
          "in a vintage wooden cradle",
          "amid paper moon and star props"]],
        ["style", [
          "dreamy newborn photography style",
          "soft pastel fine-art style",
          "cute storybook illustration look",
          "cozy knitted-theme styling",
          "angelic high-key style",
          "whimsical fairytale theme"]],
        ["light", [
          "soft diffused window light",
          "warm golden glow",
          "gentle backlight halo",
          "creamy softbox light",
          "candle-warm ambient tone",
          "pale morning haze"]],
        ["camera", [
          "macro close-up of tiny fingers",
          "top-down flat-lay portrait",
          "85mm f/2 soft-focus portrait",
          "eye-level capture of a smile",
          "curled-up newborn detail shot"]],
        ["extra", [
          "tiny knitted booties in frame",
          "delicate headband with a bow",
          "soft feather bokeh",
          "mild sepia warmth",
          "parent hands gently cradling",
          "pearl-white prop accents"]]
      ]
    },

    retro80s: {
      label: "80s Photo", emoji: "\ud83d\udcfc",
      placeholders: [["CITY", "Mumbai"]],
      template: "{subject}, {setting}, {style}, {light}, {camera}, {extra}. Ratio {ratio}.",
      slots: [
        ["subject", [
          "a guy in a denim jacket with a boombox on his shoulder",
          "a girl in neon leg-warmers with a side ponytail",
          "a couple in coordinated pastel windbreakers",
          "a kid with a cassette collection and arcade tokens",
          "a man in a white blazer with pushed-up sleeves",
          "a woman with big hair and gold hoop earrings"]],
        ["setting", [
          "at a neon-lit roller disco in [CITY]",
          "beside a boxy retro sports car at sunset",
          "in a retro arcade with glowing cabinets",
          "on a boardwalk with a striped lighthouse",
          "in a video-rental store aisle",
          "against a laser-grid backdrop"]],
        ["style", [
          "80s film photo look",
          "vhs home-video still",
          "synthwave neon poster style",
          "retro studio portrait with airbrush finish",
          "chrome-and-sunset cassette-era style",
          "polaroid instant film look"]],
        ["light", [
          "magenta and cyan neon wash",
          "golden sunset flare",
          "flash-lit party snapshot look",
          "laser-grid backlight",
          "soft tungsten glow",
          "hazy sun-kissed backlight"]],
        ["camera", [
          "35mm film grain frame",
          "slightly tilted snapshot angle",
          "telephoto candid frame",
          "wide retro poster shot",
          "polaroid square crop"]],
        ["extra", [
          "cassette tape and film-roll props",
          "scanlines and chroma noise",
          "retro logo t-shirt details",
          "smoke machine haze",
          "checkerboard floor reflections",
          "sticker-covered locker in the backdrop"]]
      ]
    },

    engagement: {
      label: "Engagement & Ring Ceremony", emoji: "\ud83d\udc8d",
      placeholders: [["NAME", "Rahul"], ["CITY", "Kolkata"]],
      template: "{subject}, {setting}, {style}, {light}, {camera}, {extra}. Ratio {ratio}.",
      slots: [
        ["subject", [
          "a bride-to-be in a pastel lehenga showing her ring",
          "a couple exchanging rings under a floral arch",
          "a groom-to-be in an ivory sherwani",
          "the couple's hands with mehendi and new rings",
          "a nervous groom mid-proposal on one knee",
          "a couple in matching midnight-blue outfits"]],
        ["setting", [
          "at a candlelit rooftop proposal in [CITY]",
          "under a marigold and rose ring-ceremony mandap",
          "beside a fairy-light garden aisle",
          "in an elegant banquet hall with chandeliers",
          "on a beach at golden hour",
          "in a pastel balloon-and-petal setup"]],
        ["style", [
          "luxury engagement editorial style",
          "dreamy ring-ceremony documentary style",
          "cinematic proposal storytelling",
          "fine-art couple portraiture",
          "glamorous pre-wedding shoot look",
          "soft romantic candid style"]],
        ["light", [
          "golden-hour backlight",
          "warm candlelight glow",
          "fairy-light bokeh",
          "chandelier sparkle light",
          "soft pastel dusk tones",
          "romantic string-light canopy"]],
        ["camera", [
          "85mm f/1.8 couple portrait",
          "macro close-up of the ring",
          "wide storytelling frame of the ceremony",
          "over-the-shoulder intimate angle",
          "silhouette frame of the proposal"]],
        ["extra", [
          "confetti and petal shower",
          "sparkler exit glow",
          "champagne-glass details",
          "floral jaimala props",
          "soft veil drift",
          "a glowing [NAME] monogram in the background"]]
      ]
    },

    anniversary: {
      label: "Anniversary Celebration", emoji: "\ud83d\udc96",
      placeholders: [["NAME", "Aditi"], ["MONTH", "December"]],
      template: "{subject}, {setting}, {style}, {light}, {camera}, {extra}. Ratio {ratio}.",
      slots: [
        ["subject", [
          "a couple renewing vows in coordinated outfits",
          "a couple slow-dancing under fairy lights",
          "a couple cutting a tiered celebration cake",
          "a couple laughing over old photo albums",
          "a couple in matching pastel ethnic wear",
          "a silver-haired couple holding hands"]],
        ["setting", [
          "in a flower-adorned anniversary venue",
          "on a candlelit terrace at dusk",
          "beneath a heart-shaped floral arch",
          "in a cozy living room with balloons and fairy lights",
          "at a beachside sunset dinner",
          "in a garden of hanging wisteria"]],
        ["style", [
          "elegant anniversary editorial style",
          "romantic celebration poster style",
          "candid documentary storytelling",
          "luxury golden-jubilee look",
          "soft pastel dream style",
          "cinematic love-story frame"]],
        ["light", [
          "warm golden-hour glow",
          "candle and fairy-light bokeh",
          "soft pastel dusk tones",
          "spotlight-on-couple drama",
          "moonlit blue-hour ambience",
          "champagne-gold studio glow"]],
        ["camera", [
          "85mm f/1.8 romantic portrait",
          "wide celebratory frame",
          "hands-and-rings close-up",
          "over-the-shoulder dance angle",
          "symmetrical couple composition"]],
        ["extra", [
          "Happy Anniversary calligraphy for [NAME] in the scene",
          "confetti burst with balloon glow",
          "rose petals scattered on the table",
          "sparkling cake topper details",
          "polaroid memories strung on lights",
          "champagne toast splash"]]
      ]
    }
  };

  /* mood multiplier slot — keeps prompts natural AND pushes the
     combination space past 12 million (effectively unlimited). */
  var MOODS = ["serene", "joyful", "dramatic", "nostalgic",
               "romantic", "mysterious", "triumphant", "dreamy"];
  ["festival", "wedding", "couple", "professional", "cinematic",
   "retro", "fashion", "anime", "nature",
   "birthday", "family", "maternity", "threed",
   "men", "women", "calendar", "baby", "retro80s", "engagement", "anniversary"].forEach(function (k) {
    CATS[k].slots.splice(2, 0, ["mood", MOODS]);
    CATS[k].template = CATS[k].template.replace("{style}", "{mood} mood, {style}");
  });
  CATS["name-art"].slots.splice(2, 0, ["vibe",
    ["serene luxury", "bold hype", "festive sparkle",
     "dark noir", "royal heritage", "cyber future"]]);
  CATS["name-art"].template = CATS["name-art"].template.replace("{look}", "{look}, {vibe} vibe");

  /* ============ PROMPT MAKER (remix studio) layer ============ */
  var STANDARD_KEYS = ["festival", "wedding", "couple", "professional",
                       "cinematic", "retro", "fashion", "anime", "nature",
                       "birthday", "family", "maternity", "threed",
                       "men", "women", "calendar", "baby", "retro80s", "engagement", "anniversary"];
  var STANDARD_TEMPLATE = "{subject}, {setting}, {mood} mood, {style}, {light}, {camera}, {extra}. Ratio {ratio}.";
  var WOW = ["a stray cat joining the frame", "fireworks blooming in the sky",
             "floating sky lanterns", "a rainbow breaking through clouds",
             "butterflies swirling around the subject", "snow falling in golden light",
             "a mirror reflection on wet ground", "dust motes dancing in light shafts"];
  var REF_CLAUSE = "Use the uploaded photo as the exact face reference - keep the same person's identity, facial features and hairstyle unchanged; apply only the outfit, setting, lighting and mood described here. ";
  /* Vivara-grade premium DNA, encoded as a reusable finish layer */
  var PREMIUM_CLAUSE = "Premium editorial finish: medium-format camera look, soft golden directional light, jewel-tone palette with gold accents, painterly bokeh background, natural refined skin texture, refined filmic color grade. ";
  var COLLAGE_LAYOUT = " Presented as a multi-frame collage: one large center portrait surrounded by six rounded detail crops (eyes close-up, jewelry close-up, braided hairstyle back view, henna hands, fabric texture, soft profile), thin cream borders, unified warm candlelit grade.";
  var POSTER_LAYOUT = " Presented as a luxury magazine poster composite: the color portrait in the foreground, a giant ghosted black-and-white close-up of the same face behind, elegant thin handwritten typography reading \"[QUOTE]\" in the upper corner, clean minimal high-key background.";

  function pool(slot, cat) {
    if (cat && CATS[cat]) {
      for (var i = 0; i < CATS[cat].slots.length; i++)
        if (CATS[cat].slots[i][0] === slot) return CATS[cat].slots[i][1];
    }
    var out = [], seen = {};
    STANDARD_KEYS.forEach(function (k) {
      CATS[k].slots.forEach(function (s) {
        if (s[0] === slot) s[1].forEach(function (o) {
          if (!seen[o]) { seen[o] = 1; out.push(o); }
        });
      });
    });
    if (slot === "extra") out = out.concat(WOW);
    return out;
  }
  function pick(arr, rng) { return arr[Math.floor(rng() * arr.length)]; }
  function base(cat, rng) { return { cat: cat, choices: randomChoices(cat, rng) }; }
  function compose(choices, phValues, opts) {
    var out = STANDARD_TEMPLATE.replace(/\{(\w+)\}/g, function (m, k) {
      return choices[k] !== undefined ? choices[k] : "[" + k + "]";
    });
    out = subGlobal(out, phValues);
    out = applyOpts(out, null, phValues, opts);
    return out;
  }
  function withBase(b) {
    var ch = {}, s = {};
    for (var k in b.choices) { ch[k] = b.choices[k]; s[k] = b.sources ? b.sources[k] : b.cat; }
    return { choices: ch, sources: s };
  }
  function draw(slot, fromCat, rng) {
    var cat = (fromCat && fromCat !== "any") ? fromCat : pick(STANDARD_KEYS, rng);
    return { v: pick(pool(slot, cat), rng), c: cat };
  }
  function newArt(b, fromCat, rng) {
    var r = withBase(b);
    ["style", "light", "camera"].forEach(function (sl) {
      var d = draw(sl, fromCat, rng); r.choices[sl] = d.v; r.sources[sl] = d.c;
    });
    return r;
  }
  function newWorld(b, fromCat, rng) {
    var r = withBase(b);
    var d = draw("setting", fromCat, rng);
    r.choices.setting = d.v; r.sources.setting = d.c;
    return r;
  }
  function mutate(b, n, rng) {
    var r = withBase(b);
    /* v2.1: স্লট বিয়োজন-সহ নমুনা — একই স্লট দুইবার নির্বাচিত হলে A→B→A হয়ে
       মিউটেশন নীরব নো-ওপ হয়ে যেত (টেস্ট-ফ্লেক + UX বাগ)। এখন প্রতিটি মিউটেশন
       নিশ্চিতভাবে আলাদা স্লট বদলায়। */
    var slots = ["subject", "setting", "mood", "style", "light", "camera", "extra"];
    for (var i = 0; i < n && slots.length; i++) {
      var sl = slots.splice(Math.floor(rng() * slots.length), 1)[0];
      var d, guard = 0;
      do { d = draw(sl, "any", rng); guard++; } while (d.v === r.choices[sl] && guard < 10);
      r.choices[sl] = d.v; r.sources[sl] = d.c;
    }
    return r;
  }
  function mashup(a, b2, rng) {
    var r = withBase(a);
    ["setting", "style", "light", "camera"].forEach(function (sl) {
      r.choices[sl] = b2.choices[sl]; r.sources[sl] = b2.cat;
    });
    r.choices.mood = pick(MOODS, rng); r.sources.mood = "mix";
    return r;
  }
  function addWow(b, rng) {
    var r = withBase(b);
    r.choices.extra = pick(WOW, rng); r.sources.extra = "wow";
    return r;
  }
  function fullMix(rng) {
    var r = { choices: {}, sources: {} };
    ["subject", "setting", "mood", "style", "light", "camera", "extra"].forEach(function (sl) {
      var d = draw(sl, "any", rng); r.choices[sl] = d.v; r.sources[sl] = d.c;
    });
    r.choices.ratio = pick(RATIO, rng); r.sources.ratio = "mix";
    return r;
  }

  function combos(key) {
    var c = CATS[key], n = RATIO.length, i;
    for (i = 0; i < c.slots.length; i++) n *= c.slots[i][1].length;
    return n;
  }
  function totalCombos() {
    var t = 0, k;
    for (k in CATS) t += combos(k);
    return t;
  }
  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function randomChoices(key, rng) {
    var c = CATS[key], ch = {}, i;
    ch.ratio = RATIO[Math.floor(rng() * RATIO.length)];
    for (i = 0; i < c.slots.length; i++) {
      var opts = c.slots[i][1];
      ch[c.slots[i][0]] = opts[Math.floor(rng() * opts.length)];
    }
    return ch;
  }
  function build(key, choices, phValues, opts) {
    var c = CATS[key];
    var out = c.template.replace(/\{(\w+)\}/g, function (m, k) {
      return choices[k] !== undefined ? choices[k] : "[" + k.toUpperCase() + "]";
    });
    var i;
    for (i = 0; i < c.placeholders.length; i++) {
      var name = c.placeholders[i][0];
      var val = phValues && phValues[name] ? phValues[name] : "[" + name + "]";
      out = out.split("[" + name + "]").join(val);
    }
    out = subGlobal(out, phValues);
    out = applyOpts(out, key, phValues, opts);
    return out;
  }
  function subGlobal(out, phValues) {
    ["CITY", "COMPANY", "QUOTE", "NAME", "MONTH"].forEach(function (n) {
      var val = phValues && phValues[n] ? phValues[n] : "[" + n + "]";
      out = out.split("[" + n + "]").join(val);
    });
    return out;
  }
  function applyOpts(out, key, phValues, opts) {
    if (!opts || key === "name-art") return out;
    if (opts.premium) out = PREMIUM_CLAUSE + out;
    if (opts.reference) out = REF_CLAUSE + out;
    if (opts.format === "collage") out += COLLAGE_LAYOUT;
    if (opts.format === "poster") {
      var q = phValues && phValues.QUOTE ? phValues.QUOTE : "[QUOTE]";
      out += POSTER_LAYOUT.split("[QUOTE]").join(q);
    }
    return out;
  }
  function generate(key, opts) {
    opts = opts || {};
    var rng = opts.seed !== undefined ? mulberry32(opts.seed) : Math.random;
    var ch = opts.choices || randomChoices(key, typeof rng === "function" ? rng : Math.random);
    return { prompt: build(key, ch, opts.placeholders), choices: ch };
  }

  return { CATS: CATS, RATIO: RATIO, RATIO_LABEL: RATIO_LABEL, combos: combos, totalCombos: totalCombos,
           randomChoices: randomChoices, build: build, generate: generate,
           mulberry32: mulberry32,
           STANDARD_KEYS: STANDARD_KEYS, WOW: WOW, pool: pool, pick: pick,
           base: base, compose: compose, newArt: newArt, newWorld: newWorld,
           mutate: mutate, mashup: mashup, addWow: addWow, fullMix: fullMix,
           MOODS: MOODS, REF_CLAUSE: REF_CLAUSE, PREMIUM_CLAUSE: PREMIUM_CLAUSE,
           COLLAGE_LAYOUT: COLLAGE_LAYOUT, POSTER_LAYOUT: POSTER_LAYOUT };
}));

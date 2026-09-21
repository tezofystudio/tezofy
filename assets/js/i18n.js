/* ==========================================================================
   TEZOFY 🌐 i18n — ভাষা-ইঞ্জিন (drop-in, এক ফাইলে পুরো সিস্টেম)
   ──────────────────────────────────────────────────────────────────────────
   ✅ ইন্সটল: যেকোনো পেজে app.js-এর script ট্যাগের পরে মাত্র ১ লাইন:
        <script src="assets/js/i18n.js" defer></script>
   ✅ ডিফল্ট ভাষা = English (সাইটের মূল লেখা) — ইন্সটল করলে চেহারা একই থাকে,
        শুধু ডান-নিচে 🌐 বাটনটা চলে আসে
   ✅ 🌐 বাটনে বাংলা / हिन्दी বাছলে পুরো সাইট-খোলস অনুবাদ হয় + পছন্দ মনে রাখে
   ✅ ডায়নামিক লেখা (OTP-মডাল, টোস্ট, প্রোফাইল) অজানাই অনুবাদ পায়
   ✅ নতুন স্ট্রিং মিস হলে ব্রাউজার-কনসোলে তালিকা পাওয়া যায় (?i18n=debug) —
        সেই তালিকা পাঠালেই পরের ডিকশনারি-ড্রপ
   ========================================================================== */
(function () {
  "use strict";
  var LS_LANG = "tz_lang";
  var SUPPORTED = ["en", "bn", "hi"];
  var cur = localStorage.getItem(LS_LANG);
  if (SUPPORTED.indexOf(cur) === -1) cur = "en";
  document.documentElement.lang = cur;
  var DEBUG = /[?&]i18n=debug/.test(location.search) || localStorage.getItem("tz_i18n_debug") === "1";

  /* ---------- 📖 ডিকশনারি: [বাংলা, हिन्दी] — কী = সাইটের ইংরেজি মূল লেখা ---------- */
  var DICT = {
    /* ── AI pages (v4): hub / generator / idea-maker / enhance / spin ── */
    "Ideas": ["আইডিয়া", "आइडिया"],
    "Create": ["ক্রিয়েট", "क्रिएट"],
    "Enhance": ["এনহ্যান্স", "एन्हांस"],
    "AI Hub": ["AI হাব", "AI हब"],
    "🎡 AI Hub": ["🎡 AI হাব", "🎡 AI हब"],
    "🎡 Spin": ["🎡 স্পিন", "🎡 स्पिन"],
    "💡 Idea Forge": ["💡 আইডিয়া ফোর্জ", "💡 आइडिया फ़ोर्ज"],
    "✨ Create": ["✨ ক্রিয়েট", "✨ क्रिएट"],
    "🪄 Enhance": ["🪄 এনহ্যান্স", "🪄 एन्हांस"],
    "✨ 1K+ Prompts": ["✨ 1K+ প্রম্পট", "✨ 1K+ प्रॉम्प्ट"],
    "Live": ["লাইভ", "लाइव"],
    "Phase 2": ["ফেজ ২", "चरण 2"],
    "Phase 3": ["ফেজ ৩", "चरण 3"],
    "Explore": ["এক্সপ্লোর", "एक्सप्लोर"],
    "Resources": ["রিসোর্স", "संसाधन"],
    "🏠 HOME": ["🏠 হোম", "🏠 होम"],
    /* — hub — */
    "✦ TEZOFY AI Universe": ["✦ TEZOFY AI ইউনিভার্স", "✦ TEZOFY AI यूनिवर्स"],
    "One tap into the ": ["এক ট্যাপেই চলে যান ", "एक टैप में जाएँ "],
    "AI universe": ["AI-জগতে", "AI दुनिया में"],
    "Spin your daily magic, forge raw ideas into ultra prompts, and paint them into images — all free, unlimited, no sign-up.": ["প্রতিদিন ম্যাজিক ঘুরান, খাপ্পা আইডিয়া আলট্রা প্রম্পটে ফোর্জ করুন, ছবিতে রং তুলুন — সব ফ্রি, অনলিমিটেড, সাইন-আপ ছাড়া।", "रोज़ का जादू घुमाएँ, कच्चे आइडिया अल्ट्रा प्रॉम्प्ट में ढालें, तस्वीरें बनाएँ — सब मुफ़्त, असीमित, बिना साइन-अप।"],
    "✨ Spin, write, create — every day, in your AI playground.": ["✨ প্রতিদিন ঘুরুন, লিখুন, বানান — আপনার AI-খেলার ঘর।", "✨ घुमाइए, लिखिए, बनाइए — रोज़, आपके AI-खेल के मैदान में।"],
    "🎡 Featured today": ["🎡 আজকের বিশেষ", "🎡 आज का फ़ीचर"],
    "Daily ": ["ডেইলি ", "डेली "],
    "Magic Spin": ["ম্যাজিক স্পিন", "मैजिक स्पिन"],
    "One tap, one random premium prompt, one freshly AI-painted image. Your daily spark of luck — spin it, love it, download it, or take it to the studio for a remix.": ["এক ট্যাপ, একটা এলোমেলো প্রিমিয়াম প্রম্পট, একটা সদ্য AI-আঁকা ছবি। দৈনিক ভাগ্যের ঝিলিক — ঘুরান, ভালোবাসুন, ডাউনলোড করুন, নয়তো স্টুডিওতে নিয়ে রিমিক্স করুন।", "एक टैप, एक रैंडम प्रीमियम प्रॉम्प्ट, एक ताज़ा AI-पेंट इमेज। आपकी दैनिक किस्मत की चिंगारी — घुमाइए, पसंद कीजिए, डाउनलोड कीजिए या स्टूडियो में रीमिक्स कीजिए।"],
    "The main app also auto-shows this spin once a day — skipping is one tap.": ["মূল অ্যাপ খুললেই এই স্পিন দিনে ১বার অটো-দেখাবে — স্কিপ এক ট্যাপে।", "मुख्य ऐप खुलने पर यह स्पिन दिन में एक बार अपने-आप दिखता है — स्किप एक टैप में।"],
    "🎡 Spin Now": ["🎡 স্পিন করুন", "🎡 स्पिन करें"],
    "Live now — ": ["এখনই লাইভ — ", "अभी लाइव — "],
    "your AI toolkit": ["আপনার AI টুলকিট", "आपका AI टूलकिट"],
    "Live from today — no login, no cost:": ["আজ থেকেই চালু — কোনো লগইন নয়, কোনো খরচ নয়:", "आज से लाइव — न लॉगिन, न ख़र्च:"],
    "Next on the wheel — ": ["চক্রে পরের পালা — ", "चक्र में अगला — "],
    "roadmap": ["রোডম্যাপ", "रोडमैप"],
    "Rolling out to this hub, phase by phase:": ["যেগুলো ধাপে ধাপে যুক্ত হবে এই হাবে:", "इस हब में चरणबद्ध होते हुए:"],
    "Open generator →": ["জেনারেটর খুলুন →", "जेनरेटर खोलें →"],
    "Forge a prompt →": ["প্রম্পট ফোর্জ করুন →", "प्रॉम्प्ट फ़ोर्ज करें →"],
    "Browse prompts →": ["প্রম্পট দেখুন →", "प्रॉम्प्ट ब्राउज़ करें →"],
    "Enhance a photo →": ["ছবি এনহ্যান্স করুন →", "फ़ोटो एन्हांस करें →"],
    "Ask TEZOFY": ["জিজ্ঞেস করুন TEZOFY", "TEZOFY से पूछिए"],
    "Photo → Prompt": ["ছবি → প্রম্পট", "फ़ोटो → प्रॉम्प्ट"],
    "“For You” rail": ["“আপনার জন্য” রেল", "“आपके लिए” रेल"],
    "Daily AI Challenge": ["ডেইলি AI-চ্যালেঞ্জ", "डेली AI-चैलेंज"],
    "Type “romantic couple photo for Eid” — AI picks the top 3 prompts from the library, with reasons.": ["“ঈদে রোমান্টিক কাপল ফটো চাই” লিখুন — AI লাইব্রেরি থেকে সেরা ৩টা প্রম্পট কারণসহ বেছে দেবে।", "“ईद के लिए रोमांटिक कपल फ़ोटो चाहिए” लिखिए — AI लाइब्रेरी से कारण सहित शीर्ष 3 प्रॉम्प्ट चुन देगा।"],
    "Upload any photo; a vision model writes you its reusable prompt.": ["পছন্দের ছবি আপলোড করুন, ভিশন-মডেল তার রিইউজেবল প্রম্পট বানিয়ে দেবে।", "कोई भी फ़ोटो अपलोड करें; विज़न मॉडल उसका दोहरा-उपयोगी प्रॉम्प्ट लिख देगा।"],
    "Daily personal picks learned from your copy / like / save history.": ["কপি/লাইক/সেভের ইতিহাস থেকে শেখা প্রতিদিনের পার্সোনাল রিকমেন্ডেশন।", "आपकी कॉपी/लाइक/सेव हिस्ट्री से सीखे रोज़ाना निजी सुझाव।"],
    "Is everything here really free?": ["এখানের সবকিছু কি সত্যিই ফ্রি?", "क्या यहाँ सब कुछ सच में मुफ़्त है?"],
    "How does Daily Magic Spin pick my prompt?": ["ডেইলি ম্যাজিক স্পিন আমার প্রম্পট বাছে কীভাবে?", "डेली मैजिक स्पिन मेरा प्रॉम्प्ट कैसे चुनता है?"],
    "Where does my data go?": ["আমার ডেটা যায় কোথায়?", "मेरा डेटा कहाँ जाता है?"],
    /* — generator — */
    "✦ AI Image Studio": ["✦ AI ইমেজ স্টুডিও", "✦ AI इमेज स्टूडियो"],
    "Type. Style. ": ["লিখুন। স্টাইল। ", "लिखिए। स्टाइल। "],
    "Generate.": ["জেনারেট।", "जेनरेट।"],
    "✨ Totally free — no login, no limits!": ["✨ একদম ফ্রি — কোনো লগইন লাগবে না, অনলিমিটেড!", "✨ बिल्कुल मुफ़्त — न लॉगिन, न लिमिट!"],
    "🧠 Your Prompt": ["🧠 আপনার প্রম্পট", "🧠 आपका प्रॉम्प्ट"],
    "🎲 Surprise me": ["🎲 সারপ্রাইজ দিন", "🎲 सरप्राइज़ दीजिए"],
    "📚 From Library": ["📚 লাইব্রেরি থেকে", "📚 लाइब्रेरी से"],
    "📐 Aspect Ratio": ["📐 অ্যাসপেক্ট রেশিও", "📐 आस्पेक्ट रेशियो"],
    "⚙️ Engine & Seed": ["⚙️ ইঞ্জিন ও সিড", "⚙️ इंजन और सीड"],
    "✨ Detail boost": ["✨ ডিটেইল বুস্ট", "✨ डिटेल बूस्ट"],
    "(adds quality keywords)": ["(কোয়ালিটি কিওয়ার্ড যোগ করে)", "(क्वालिटी कीवर्ड जोड़ता है)"],
    "🎨 Generate Image": ["🎨 ইমেজ বানান", "🎨 इमेज बनाएँ"],
    "🎨 Painting…": ["🎨 আঁকা হচ্ছে…", "🎨 बन रही है…"],
    "Your masterpiece will appear here": ["আপনার মাস্টারপিস এখানে আসবে", "आपकी बेहतरीन तस्वीर यहाँ दिखेगी"],
    "Write a prompt on the left — or press 🎲 Surprise me — then hit Generate.": ["বামে প্রম্পট লিখুন — নয়তো 🎲 Surprise me চাপুন — তারপর Generate চাপুন।", "बाएँ प्रॉम्प्ट लिखिए — या 🎲 Surprise me दबाइए — फिर Generate दबाइए।"],
    "⬇ Download": ["⬇ ডাউনলোড", "⬇ डाउनलोड"],
    "🔄 Regenerate": ["🔄 আবার বানান", "🔄 फिर बनाएँ"],
    "📋 Copy Prompt": ["📋 প্রম্পট কপি", "📋 प्रॉम्प्ट कॉपी"],
    "🔗 Copy Image Link": ["🔗 ইমেজ লিংক কপি", "🔗 इमेज लिंक कॉपी"],
    "↗ Open Full": ["↗ পুরোটা খুলুন", "↗ पूरा खोलें"],
    "Engine is busy right now": ["ইঞ্জিনটা এখন ব্যস্ত", "इंजन अभी व्यस्त है"],
    "Hit Generate again — peak-hours can need a retry or two. (Turbo engine is faster!)": ["আবার Generate চাপুন — ব্যস্ত সময়ে এক-দুইবার রিট্রাই লাগতে পারে। (Turbo ইঞ্জিন ফাস্ট!)", "फिर Generate दबाइए — पीक-टाइम में एक-दो रीट्राय लग सकते हैं। (Turbo इंजन तेज़ है!)"],
    "🕘 Recent Creations": ["🕘 সাম্প্রতিক সৃষ্টি", "🕘 हाल की रचनाएँ"],
    "— click to reload, tap ❤️ to pin": ["— রিলোডে ক্লিক, পিনে ❤️ ট্যাপ", "— रीलोड हेतु क्लिक, पिन हेतु ❤️ टैप"],
    "📚 Prompt Library": ["📚 প্রম্পট লাইব্রেরি", "📚 प्रॉम्प्ट लाइब्रेरी"],
    "Pick any TEZOFY prompt as your starting point — then generate right here.": ["যেকোনো TEZOFY প্রম্পট দিয়ে শুরু করুন — তারপর এখানেই জেনারেট করুন।", "किसी भी TEZOFY प्रॉम्प्ट से शुरू करें — फिर यहीं जेनरेट करें।"],
    "✕ Close": ["✕ বন্ধ", "✕ बंद"],
    "Nothing found — try another keyword 🔍": ["কিছু পাওয়া যায়নি — অন্য শব্দ লিখে দেখুন 🔍", "कुछ नहीं मिला — दूसरा शब्द आज़माएँ 🔍"],
    "✨ Ready! Hit download ⬇": ["✨ রেডি! ডাউনলোড করে নিন ⬇", "✨ तैयार! डाउनलोड दबाइए ⬇"],
    "🕘 Loaded — hit Generate!": ["🕘 লোড হয়েছে — Generate চাপুন!", "🕘 लोड हो गया — Generate दबाइए!"],
    "❤️ Pinned!": ["❤️ পিন হলো!", "❤️ पिन हो गया!"],
    "🗑 Pin removed": ["🗑 পিন সরালো", "🗑 पिन हटा"],
    "📋 Prompt copied!": ["📋 প্রম্পট কপি হয়েছে!", "📋 प्रॉम्प्ट कॉपी हुआ!"],
    "🔗 Image link copied!": ["🔗 ইমেজ লিংক কপি হয়েছে!", "🔗 इमेज लिंक कॉपी हुआ!"],
    "⬇ Download starting…": ["⬇ ডাউনলোড শুরু হচ্ছে…", "⬇ डाउनलोड शुरू…"],
    "🎲 New seed!": ["🎲 নতুন সিড!", "🎲 नया सीड!"],
    "⚠️ Write something first — or hit 🎲 Surprise me!": ["⚠️ আগে কিছু লিখুন — নয়তো 🎲 Surprise me চাপুন!", "⚠️ पहले कुछ लिखिए — या 🎲 Surprise me दबाइए!"],
    "⚠️ Busy hour — please retry!": ["⚠️ ব্যস্ত সময় — আবার চেষ্টা করুন!", "⚠️ व्यस्त समय — फिर कोशिश करें!"],
    "⚠️ Copy failed — please copy manually": ["⚠️ কপি হয়নি — ম্যানুয়ালি করুন", "⚠️ कॉपी नहीं हुआ — हाथ से कॉपी करें"],
    "One studio, ": ["একটাই স্টুডিও, ", "एक ही स्टूडियो, "],
    "the whole TEZOFY universe": ["পুরো TEZOFY জগৎ", "पूरी TEZOFY दुनिया"],
    "Everything you see here is powered by the same features that make TEZOFY special — explore them all:": ["এখানে যা দেখছেন সব চলে TEZOFY-র বিশেষ ফিচারেই — সব ঘুরে দেখুন:", "यहाँ जो कुछ है वह उन्हीं ख़ास फ़ीचर से चलता है — सब देखिए:"],
    /* — idea-maker — */
    "✦ Ultra Prompt Forge": ["✦ আলট্রা প্রম্পট ফোর্জ", "✦ अल्ट्रा प्रॉम्प्ट फ़ोर्ज"],
    "Write. Forge. ": ["লিখুন। ফোর্জ। ", "लिखिए। फ़ोर्ज। "],
    "Shine.": ["ঝলকান।", "चमकिए।"],
    "Drop a raw idea — in any language — and get back a senior-grade, ultra-detailed English prompt with Identity-Lock, smart typography & 8K boosting built in. Free, unlimited, no sign-up.": ["খাপ্পা আইডিয়া দিন — যেকোনো ভাষায় — ফেরত পান সিনিয়র-গ্রেড আলট্রা-ডিটেইলড English প্রম্পট, Identity-Lock·স্মার্ট টাইপোগ্রাফি·8K বুস্টসহ। ফ্রি, অনলিমিটেড, সাইন-আপ ছাড়া।", "कच्चा आइडिया दीजिए — किसी भी भाषा में — पाइए सीनियर-ग्रेड अल्ट्रा English प्रॉम्प्ट, Identity-Lock·स्मार्ट टाइपोग्राफ़ी·8K बूस्ट सहित। मुफ़्त, असीमित, बिना साइन-अप।"],
    "✍️ Your Idea": ["✍️ আপনার আইডিয়া", "✍️ आपका आइडिया"],
    "🛡️ Smart Boosts": ["🛡️ স্মার্ট বুস্ট", "🛡️ स्मार्ट बूस्ट"],
    "• auto-detected from your idea": ["• আপনার আইডিয়া থেকে অটো-ডিটেক্ট", "• आपके आइडिया से ऑटो-डिटेक्ट"],
    "🗿 Identity Lock": ["🗿 আইডেন্টিটি লক", "🗿 आइडेंटिटी लॉक"],
    "🔤 Text-on-Image": ["🔤 টেক্সট-অন-ইমেজ", "🔤 टेक्स्ट-ऑन-इमेज"],
    "🎨 Style Mood": ["🎨 স্টাইল মুড", "🎨 स्टाइल मूड"],
    "🧹 Clear": ["🧹 মুছুন", "🧹 साफ़ करें"],
    "✨ Forge Ultra Prompt": ["✨ আলট্রা প্রম্পট ফোর্জ", "✨ अल्ट्रा प्रॉम्प्ट फ़ोर्ज"],
    "✨ Forging…": ["✨ ফোর্জ হচ্ছে…", "✨ फ़ोर्ज हो रहा…"],
    "🧪 Ultra Prompt — Output": ["🧪 আলট্রা প্রম্পট — আউটপুট", "🧪 अल्ट्रा प्रॉम्प्ट — आउटपुट"],
    "Your forged ultra prompt will appear here": ["আপনার ফোর্জ করা আলট্রা প্রম্পট এখানে আসবে", "आपका फ़ोर्ज किया अल्ट्रा प्रॉम्प्ट यहाँ आएगा"],
    "Write your idea on the left — or press 🎲 Surprise me — then hit ✨ Forge Ultra Prompt.": ["বামে আইডিয়া লিখুন — নয়তো 🎲 Surprise me চাপুন — তারপর ✨ Forge Ultra Prompt চাপুন।", "बाएँ आइडिया लिखिए — या 🎲 Surprise me दबाइए — फिर ✨ Forge Ultra Prompt दबाइए।"],
    "🧩 Token slots — type a value and the prompt updates live": ["🧩 টোকেন স্লট — ভ্যালু লিখলেই প্রম্পট লাইভে আপডেট হবে", "🧩 टोकन स्लॉट — वैल्यू लिखते ही प्रॉम्प्ट लाइव अपडेट होगा"],
    "🔁 Reforge": ["🔁 আবার ফোর্জ", "🔁 दोबारा फ़ोर्ज"],
    "✨ Prompt ready! Copy it or hit Generate ⬇": ["✨ প্রম্পট রেডি! কপি করুন বা Generate চাপুন ⬇", "✨ प्रॉम्प्ट तैयार! कॉपी करें या Generate दबाएँ ⬇"],
    "🎲 Random idea loaded — hit Forge!": ["🎲 র‍্যান্ডম আইডিয়া এসেছে — Forge চাপুন!", "🎲 रैंडम आइडिया आ गया — Forge दबाइए!"],
    "🧹 Cleared!": ["🧹 পরিষ্কার!", "🧹 साफ़!"],
    "🗿 Identity Lock ON": ["🗿 আইডেন্টিটি লক চালু", "🗿 आइडेंटिटी लॉक चालू"],
    "🗿 Identity Lock OFF": ["🗿 আইডেন্টিটি লক বন্ধ", "🗿 आइडेंटिटी लॉक बंद"],
    "🔤 Text boost ON": ["🔤 টেক্সট-বুস্ট চালু", "🔤 टेक्स्ट-बूस्ट चालू"],
    "🔤 Text boost OFF": ["🔤 টেক্সট-বুস্ট বন্ধ", "🔤 टेक्स्ट-बूस्ट बंद"],
    "🕘 Restored from history!": ["🕘 হিস্ট্রি থেকে ফিরে এলো!", "🕘 हिस्ट्री से वापस!"],
    "📋 Prompt copied — 🗿🔤 boosts included!": ["📋 প্রম্পট কপি হয়েছে — 🗿🔤 বুস্টসহ!", "📋 प्रॉम्प्ट कॉपी हुआ — 🗿🔤 बूस्ट सहित!"],
    "⚠️ Write an idea first — or hit 🎲 Surprise me!": ["⚠️ আগে একটা আইডিয়া লিখুন — নয়তো 🎲 Surprise me চাপুন!", "⚠️ पहले कोई आइडिया लिखिए — या 🎲 Surprise me दबाइए!"],
    "🕘 Recent Forges": ["🕘 সাম্প্রতিক ফোর্জ", "🕘 हाल के फ़ोर्ज"],
    "— click to reload": ["— রিলোডে ক্লিক করুন", "— रीलोड हेतु क्लिक करें"],
    "A tiny forge with ": ["একটা ছোট ফোর্জ, অথচ ", "एक छोटा फ़ोर्ज, पर "],
    "senior prompt-engineering": ["সিনিয়র প্রম্পট-ইঞ্জিনিয়ারিং", "सीनियर प्रॉम्प्ट-इंजीनियरिंग"],
    " inside": [" ভর্তি", " भरा"],
    "Every forge applies the same professional vocabulary TEZOFY uses across its 1,000+ premium prompts:": ["প্রতিটা ফোর্জে বসে TEZOFY-র ১,০০০+ প্রিমিয়াম প্রম্পটের সেই প্রফেশনাল ভোকাবুলারি:", "हर फ़ोर्ज में वही पेशेवर शब्दावली जो TEZOFY के 1,000+ प्रीमियम प्रॉम्प्ट में है:"],
    "1,000+ Premium Prompts": ["১,০০০+ প্রিমিয়াম প্রম্পট", "1,000+ प्रीमियम प्रॉम्प्ट"],
    "Need instant inspiration? Borrow any hand-crafted prompt from the library and re-forge it here.": ["এখনই অনুপ্রেরণা দরকার? লাইব্রেরির হাতে-বানানো প্রম্পট ধার করে এখানে আবার ফোর্জ করুন।", "तुरंत प्रेरणा चाहिए? लाइब्रेरी का कोई हस्तनिर्मित प्रॉम्प्ट लें और यहीं फिर फ़ोर्ज करें।"],
    "How it works →": ["কীভাবে কাজ করে →", "कैसे काम करता है →"],
    "Try a template →": ["টেমপ্লেট চেষ্টা করুন →", "टेम्पलेट आज़माएँ →"],
    "Read guides →": ["গাইড পড়ুন →", "गाइड पढ़ें →"],
    "Privacy promise →": ["প্রাইভেসি প্রতিশ্রুতি →", "प्राइवेसी वादा →"],
    "Which languages can I write my idea in?": ["কোন কোন ভাষায় আইডিয়া লেখা যায়?", "किन भाषाओं में आइडिया लिख सकते हैं?"],
    "What are the 🧩 token slots?": ["🧩 টোকেন স্লট কী?", "🧩 टोकन स्लॉट क्या हैं?"],
    "Is it really free? Why does it take 20–60s?": ["সত্যিই ফ্রি? ২০–৬০ সেকেন্ড লাগে কেন?", "सच में मुफ़्त? 20–60s क्यों लगते हैं?"],
    "How does 🗿 Identity Lock work?": ["🗿 Identity Lock কাজ করে কীভাবে?", "🗿 Identity Lock कैसे काम करता है?"],
    /* — enhance — */
    "✦ On-device HD Engine": ["✦ অন-ডিভাইস HD ইঞ্জিন", "✦ ऑन-डिवाइस HD इंजन"],
    "Upload. ": ["আপলোড। ", "अपलोड। "],
    "Wow.": ["অবাক।", "वाह।"],
    "Drop a photo, get sparkling HD in one tap — it never leaves your device.": ["ছবি দিন, এক ট্যাপে ঝকঝকে HD — আপনার ছবি আপনার ফোনেই থাকে।", "फ़ोटो डालिए, एक टैप में चमकती HD — आपकी फ़ोटो आपके फ़ोन में ही रहती है।"],
    "🪄 Enhance Controls": ["🪄 এনহ্যান্স কন্ট্রোল", "🪄 एन्हांस कंट्रोल"],
    "Click to upload": ["আপলোডে ক্লিক করুন", "अपलोड के लिए क्लिक करें"],
    " or drag a photo here": [" অথবা ছবি টেনে ছাড়ুন", " या फ़ोटो यहाँ ड्रैग करें"],
    "JPG / PNG / WebP — up to ~15MB": ["JPG / PNG / WebP — সর্বোচ্চ ~১৫MB", "JPG / PNG / WebP — ~15MB तक"],
    "⚡ Presets (one tap)": ["⚡ প্রিসেট (এক ট্যাপ)", "⚡ प्रीसेट (एक टैप)"],
    "↺ Flat reset": ["↺ ফ্ল্যাট রিসেট", "↺ फ़्लैट रीसेट"],
    "🎚️ Fine-tune (your mix)": ["🎚️ ফাইন-টিউন (নিজের মতো)", "🎚️ फ़ाइन-ट्यून (अपना मिक्स)"],
    "🪄 Enhance Now": ["🪄 এনহ্যান্স নাও", "🪄 एन्हांस नाउ"],
    "↺ Reset": ["↺ রিসেট", "↺ रीसेट"],
    "📂 New photo": ["📂 নতুন ছবি", "📂 नई फ़ोटो"],
    "🖼️ Enhanced Output": ["🖼️ এনহ্যান্সড আউটপুট", "🖼️ एन्हांस्ड आउटपुट"],
    "Your enhanced photo will appear here": ["আপনার এনহ্যান্সড ছবি এখানে আসবে", "आपकी एन्हांस्ड फ़ोटो यहाँ आएगी"],
    "Upload a photo on the left → pick a preset → hit 🪄 Enhance Now.": ["বামে ছবি আপলোড করুন → প্রিসেট বাছুন → 🪄 Enhance Now চাপুন।", "बाएँ फ़ोटो अपलोड करें → प्रीसेट चुनें → 🪄 Enhance Now दबाएँ।"],
    "⬇ Download HD": ["⬇ HD ডাউনলোড", "⬇ HD डाउनलोड"],
    "👁 Original": ["👁 মূল ছবি", "👁 असली फ़ोटो"],
    "📂 Photo loaded — try a preset!": ["📂 ছবি এসেছে — প্রিসেট চেষ্টা করুন!", "📂 फ़ोटा आ गई — प्रीसेट आज़माएँ!"],
    "🪄 Enhance applied!": ["🪄 এনহ্যান্স অ্যাপ্লাইড!", "🪄 एन्हांस लागू!"],
    "↺ Back to flat": ["↺ ফ্ল্যাটে ফেরত", "↺ फ़्लैट पर वापस"],
    "⬇ Download started — sparkling HD! ✨": ["⬇ ডাউনলোড শুরু — ঝকঝকে HD! ✨", "⬇ डाउनलोड शुरू — चमकती HD! ✨"],
    "⚠️ Please choose an image file (JPG/PNG/WebP)": ["⚠️ ছবির ফাইল দিন (JPG/PNG/WebP)", "⚠️ इमेज फ़ाइल चुनें (JPG/PNG/WebP)"],
    "⚠️ Please stay under 15MB": ["⚠️ ১৫MB-এর নিচে রাখুন", "⚠️ 15MB से नीचे रखें"],
    "⚠️ Could not read that image": ["⚠️ ছবিটা পড়া যায়নি", "⚠️ इमेज पढ़ी नहीं गई"],
    "Is my photo uploaded anywhere?": ["আমার ছবি কি কোথও আপলোড হয়?", "क्या मेरी फ़ोटो कहीं अपलोड होती है?"],
    "Is this AI upscaling?": ["এটা কি AI-আপস্কেল?", "क्या यह AI अपस्केलिंग है?"],
    "Which preset, when?": ["কোন প্রিসেট কখন?", "कौन-सा प्रीसेट, कब?"],
    "✨ HD Enhance": ["✨ HD এনহ্যান্স", "✨ HD एन्हांस"],
    "👤 Portrait Glow": ["👤 পোর্ট্রেট গ্লো", "👤 पोर्ट्रेट ग्लो"],
    "🌈 Vivid Pop": ["🌈 ভিভিড পপ", "🌈 विविड पॉप"],
    "🎞️ Old-Photo Fix": ["🎞️ পুরনো-ছবি ফিক্স", "🎞️ पुरानी-फ़ोटो फ़िक्स"],
    "🫧 Soft Dream": ["🫧 সফট ড্রিম", "🫧 सॉफ़्ट ड्रीम"],
    /* — magic spin modal — */
    "🎡 Daily Magic Spin": ["🎡 ডেইলি ম্যাজিক স্পিন", "🎡 डेली मैजिक स्पिन"],
    "Spin today's luck!": ["আজকের ভাগ্য ঘুরিয়ে দেখুন!", "आज की किस्मत घुमाइए!"],
    "One tap — a random premium prompt plus an AI-painted image, totally free.": ["এক ট্যাপে — এলোমেলো প্রিমিয়াম প্রম্পট আর AI-আঁকা ছবি, একদম ফ্রি।", "एक टैप — रैंडम प्रीमियम प्रॉम्प्ट और AI-पेंट इमेज, बिल्कुल मुफ़्त।"],
    "Once a day — spin and let fate forge your prompt!": ["প্রতিদিন একবার — স্পিন করুন, ভাগ্য প্রম্পট ফোর্জ করে দিক!", "दिन में एक बार — स्पिन कीजिए, किस्मत आपका प्रॉम्प्ट गढ़े!"],
    "Not now →": ["এখন নয় →", "अभी नहीं →"],
    "🎡 spinning…": ["🎡 ঘুরছে…", "🎡 घूम रहा…"],
    "✨ Picking your luck…": ["✨ ভাগ্য বেছে নিচ্ছে…", "✨ किस्मत चुन रहे…"],
    "🎨 AI is painting your magic…": ["🎨 AI আপনার জাদু আঁকছে…", "🎨 AI आपका जादू बना रहा…"],
    "usually 20–60 seconds — one cup of tea ☕": ["সাধারণত ২০–৬০ সেকেন্ড — এক কাপ চা ☕", "आमतौर पर 20–60 सेकंड — एक कप चाय ☕"],
    "🔁 Spin again": ["🔁 আবার স্পিন", "🔁 फिर स्पिन"],
    "Loved it! ✕": ["ভালো লেগেছে! ✕", "पसंद आया! ✕"],
    "The engine is a bit busy — spin again in a moment!": ["ইঞ্জিনটা একটু ব্যস্ত — একটু পরে আবার স্পিন করুন!", "इंजन थोड़ा व्यस्त है — थोड़ी देर में फिर स्पिन करें!"],
    "🔁 Try again": ["🔁 আবার চেষ্টা", "🔁 फिर कोशिश"],
    "Later →": ["পরে →", "बाद में →"],
    /* — shared footer — */
    "All Prompts": ["সব প্রম্পট", "सभी प्रॉम्प्ट"],
    "Trending": ["ট্রেন্ডিং", "ट्रेंडिंग"],
    "Blog": ["ব্লগ", "ब्लॉग"],
    "Saved Prompts": ["সেভ করা প্রম্পট", "सेव किए प्रॉम्प्ट"],
    "Privacy": ["প্রাইভেসি", "प्राइवेसी"],
    "AI Generator": ["AI জেনারেটর", "AI जेनरेटर"],
    "💡 Idea Maker": ["💡 আইডিয়া মেকার", "💡 आइडिया मेकर"],
    "✨ AI Studio": ["✨ AI স্টুডিও", "✨ AI स्टूडियो"],
    "Discover, customize & generate — the easiest way to create stunning AI portraits.": ["ডিসকভার, কাস্টমাইজ ও জেনারেট — অসাধারণ AI পোর্ট্রেটের সহজতম পথ।", "डिस्कवर, कस्टमाइज़ व जेनरेट — शानदार AI पोर्ट्रेट का सबसे आसान तरीका।"],
    "Premium AI Prompt Library": ["প্রিমিয়াম AI প্রম্পট লাইব্রেরি", "प्रीमियम AI प्रॉम्प्ट लाइब्रेरी"],
    "Sign in": ["সাইন ইন", "साइन इन"],
    "Prompts": ["প্রম্পট", "प्रॉम्प्ट"],
    "Saved": ["সেভড", "सेव्ड"],
    "Guides": ["গাইড", "गाइड"],
    "Home": ["হোম", "होम"],
    "Discover": ["ডিসকভার", "डिस्कवर"],
    "Search": ["সার্চ", "खोज"],
    /* ===== হিরো/স্ট্যাটিক (index.html) ===== */
    "Search prompts…": ["প্রম্পট খুঁজুন…", "प्रॉम्प्ट खोजें…"],
    "Search prompts": ["প্রম্পট খুঁজুন", "प्रॉम्प्ट खोजें"],
    "1,000+ free prompt templates · new prompt every day": ["১,০০০+ ফ্রি প্রম্পট টেমপ্লেট · প্রতিদিন নতুন প্রম্পট", "1,000+ फ़्री प्रॉम्प्ट टेम्पलेट · हर दिन नया प्रॉम्प्ट"],
    "One-tap access from your home screen — works offline too.": ["হোম স্ক্রিন থেকে এক ট্যাপেই — অফলাইনেও চলে।", "होम स्क्रीन से एक टैप में — ऑफ़लाइन भी चलता है।"],
    "✨ Crafting your premium prompt universe…": ["✨ আপনার প্রিমিয়াম প্রম্পট-জগৎ সাজাচ্ছি…", "✨ आपका प्रीमियम प्रॉम्प्ट संसार सज रहा है…"],
    "© 2026 TEZOFY. Made with ❤️ for creators.": ["© 2026 TEZOFY। ক্রিয়েটরদের জন্য ❤️ দিয়ে তৈরি।", "© 2026 TEZOFY। क्रिएटर्स के लिए ❤️ से निर्मित।"],
    "💬 Send Feedback": ["💬 মতামত পাঠান", "💬 प्रतिक्रिया भेजें"],

    /* ===== ফুটার/ন্যাভ ===== */
    "Explore": ["এক্সপ্লোর", "एक्सप्लोर"],
    "Resources": ["রিসোর্স", "संसाधन"],
    "Explore Free Templates": ["ফ্রি টেমপ্লেট এক্সপ্লোর করুন", "फ़्री टेम्पलेट एक्सप्लोर करें"],
    "All Prompts": ["সব প্রম্পট", "सभी प्रॉम्प्ट"],
    "Blog": ["ব্লগ", "ब्लॉग"],
    "Saved Prompts": ["সেভ করা প্রম্পট", "सेव किए प्रॉम्प्ट"],
    "Browse Templates": ["টেমপ্লেট দেখুন", "टेम्पलेट ब्राउज़ करें"],
    "Trending": ["ট্রেন্ডিং", "ट्रेंडिंग"],
    "Wedding": ["বিয়ে", "शादी"],
    "Professional": ["প্রফেশনাল", "प्रोफ़ेशनल"],
    "How TEZOFY Works": ["TEZOFY কীভাবে কাজ করে", "TEZOFY कैसे काम करता है"],
    "Customize & Copy": ["কাস্টমাইজ ও কপি", "कस्टमाइज़ और कॉपी"],
    "Generate & Download": ["তৈরি করুন, ডাউনলোড করুন", "जनरेट करें, डाउनलोड करें"],
    "Learn Prompt Engineering": ["প্রম্পট ইঞ্জিনিয়ারিং শিখুন", "प्रॉम्प्ट इंजीनियरिंग सीखें"],
    "Popular Prompt Categories": ["জনপ্রিয় প্রম্পট ক্যাটাগরি", "लोकप्रिय प्रॉम्प्ट श्रेणियाँ"],
    "Frequently Asked Questions": ["সচরাচর জিজ্ঞাসা", "अक्सर पूछे जाने वाले प्रश्न"],
    "Latest from the Blog": ["ব্লগ থেকে সর্বশেষ", "ब्लॉग से ताज़ा"],
    "Top This Week": ["এই সপ্তাহের সেরা", "इस हफ़्ते के सर्वश्रेष्ठ"],
    "Start Creating Stunning AI Images Today": ["আজই দারুণ AI ছবি বানানো শুরু করুন", "आज ही शानदार AI तस्वीरें बनाना शुरू करें"],
    "Home": ["হোম", "होम"],
    "Search": ["খুঁজুন", "खोजें"],
    "Install App": ["অ্যাপ ইনস্টল", "ऐप इंस्टॉल करें"],

    /* ===== কার্ড/অ্যাকশন ===== */
    "Copy prompt": ["প্রম্পট কপি করুন", "प्रॉम्प्ट कॉपी करें"],
    "Copy": ["কপি", "कॉपी"],
    "Copied!": ["কপি হয়েছে!", "कॉपी हो गया!"],
    "Copy the full prompt below.": ["নিচের পুরো প্রম্পটটা কপি করুন।", "नीचे पूरा प्रॉम्प्ट कॉपी करें।"],
    "Save prompt": ["প্রম্পট সেভ করুন", "प्रॉम्प्ट सेव करें"],
    "Save": ["সেভ", "सेव"],
    "Saved": ["সেভ করা", "सेव किया"],
    "Share prompt": ["প্রম্পট শেয়ার করুন", "प्रॉम्प्ट शेयर करें"],
    "Share on WhatsApp": ["হোয়াটসঅ্যাপে শেয়ার করুন", "WhatsApp पर शेयर करें"],
    "Added to favorites ❤️": ["ফেভারিটে যোগ হলো ❤️", "पसंदीदा में जुड़ा ❤️"],
    "Added to likes": ["লাইক হয়েছে", "लाइक हो गया"],
    "Removed from favorites": ["ফেভারিট থেকে সরানো হলো", "पसंदीदा से हटाया गया"],
    "Removed from saved": ["সেভ থেকে সরানো হলো", "सेव से हटाया गया"],
    "Saved! Find it in the Saved tab": ["সেভ হয়েছে! Saved ট্যাবে পাবেন", "सेव हो गया! Saved टैब में मिलेगा"],
    "Link copied to clipboard": ["লিংক কপি হয়েছে", "लिंक कॉपी हो गया"],
    "Prompt copied! Now paste it into Gemini ✨": ["প্রম্পট কপি হয়েছে! এবার Gemini-তে পেস্ট করুন ✨", "प्रॉम्प्ट कॉपी हो गया! अब Gemini में पेस्ट करें ✨"],
    "Prompt copied! Paste it into your AI tool": ["প্রম্পট কপি হয়েছে! আপনার AI টুলে পেস্ট করুন", "प्रॉम्प्ट कॉपी हो गया! अपने AI टूल में पेस्ट करें"],
    "Prompt of the Day copied!": ["আজকের প্রম্পট কপি হয়েছে!", "आज का प्रॉम्प्ट कॉपी हो गया!"],
    "Trending now": ["এখন ট্রেন্ডিং", "अभी ट्रेंडिंग"],
    "Recently Viewed": ["সম্প্রতি দেখা", "हाल ही में देखे गए"],
    "Copies": ["কপি", "कॉपियाँ"],
    "Uses": ["ব্যবহার", "उपयोग"],
    "Ratio ": ["রেশিও ", "अनुपात "],
    "Category": ["ক্যাটাগরি", "श्रेणी"],
    "Popular": ["জনপ্রিয়", "लोकप्रिय"],
    "Community category": ["কমিউনিটি ক্যাটাগরি", "कम्युनिटी श्रेणी"],
    "Prompts": ["প্রম্পট", "प्रॉम्प्ट"],
    "Festival": ["উৎসব", "त्योहार"],
    "Wedding & Bridal": ["বিয়ে ও কনে", "शादी-विवाह"],

    /* ===== লেভেল-নাম ===== */
    "Rookie": ["রুকি", "रूकी"],
    "Explorer": ["এক্সপ্লোরার", "एक्सप्लोरर"],
    "Creator": ["ক্রিয়েটর", "क्रिएटर"],
    "Trendsetter": ["ট্রেন্ডসেটার", "ट्रेंडसेटर"],
    "Legend": ["লেজেন্ড", "लेजेंड"],

    /* ===== ডিটেইল-পেজ (template.html) স্ট্যাটিক শিরোনাম/বাটন ===== */
    "About this prompt": ["এই প্রম্পট সম্পর্কে", "इस प्रॉम्प्ट के बारे में"],
    "How this prompt works": ["এই প্রম্পট কীভাবে কাজ করে", "यह प्रॉम्प्ट कैसे काम करता है"],
    "Which tool to use": ["কোন টুল ব্যবহার করবেন", "कौन सा टूल इस्तेमाल करें"],
    "Step by step": ["ধাপে ধাপে", "स्टेप बाय स्टेप"],
    "Try changing": ["এগুলো বদলে দেখুন", "इन्हें बदलकर देखें"],
    "Common mistakes": ["সাধারণ ভুলগুলো", "आम गलतियाँ"],
    "In this image": ["এই ছবিতে", "इस तस्वीर में"],
    "Related prompts": ["সংশ্লিষ্ট প্রম্পট", "मिलते-जुलते प्रॉम्प्ट"],
    "Copy Prompt": ["প্রম্পট কপি করুন", "प्रॉम्प्ट कॉपी करें"],
    "Then paste into:": ["তারপর এখানে পেস্ট করুন:", "फिर यहाँ पेस्ट करें:"],
    "Explore All": ["সব এক্সপ্লোর করুন", "सब एक्सप्लोर करें"],
    "Discover": ["ডিসকভার", "डिस्कवर"],
    "copies": ["কপি", "कॉपियाँ"],
    "likes": ["লাইক", "लाइक"],
    "Share": ["শেয়ার করুন", "शेयर करें"],
    "Prompt": ["প্রম্পট", "प्रॉम्प्ट"],
    "Toggle dark / light mode": ["ডার্ক / লাইট মোড বদলান", "डार्क / लाइट मोड बदलें"],
    "AI Image Prompt Library": ["AI ইমেজ প্রম্পট লাইব্রেরি", "AI इमेज प्रॉम्प्ट लाइब्रेरी"],
    "Create Stunning AI Portraits": ["দারুণ AI পোর্ট্রেট বানান", "शानदार AI पोर्ट्रेट बनाएं"],
    "Discover & copy premium AI image prompts. Create beautiful portraits with one tap — no prompt-engineering skills needed.": ["প্রিমিয়াম AI ইমেজ প্রম্পট খুঁজুন ও কপি করুন — এক ট্যাপে সুন্দর পোর্ট্রেট, প্রম্পট-ইঞ্জিনিয়ারিং জানার দরকার নেই।", "प्रीमियम AI इमेज प्रॉम्प्ट खोजें और कॉपी करें — एक टैप में सुंदर पोर्ट्रेट, बिना प्रॉम्प्ट इंजीनियरिंग के।"],

    /* ===== ⚙️ সেটিংস-মেনু ===== */
    "Night mode": ["নাইট মোড", "नाइट मोड"],
    "Day mode": ["ডে মোড", "डे मोड"],
    "tap to switch ↔": ["বদলাতে ট্যাপ ↔", "बदलने को टैप ↔"],
    "☑ Reduce animations ✨": ["☑ অ্যানিমেশন কমান ✨", "☑ एनीमेशन कम करें ✨"],
    "☐ Reduce animations ✨": ["☐ অ্যানিমেশন কমান ✨", "☐ एनीमेशन कम करें ✨"],
    "More settings soon 🚀": ["আরও সেটিংস আসছে 🚀", "और सेटिंग्स जल्दी ही 🚀"],
    /* ===== অথ-মডাল (সিদ্ধ/লগইন) ===== */
    "Sign Up": ["সাইন আপ", "साइन अप"],
    "Log In": ["লগইন", "लॉग इन"],
    "Sign in": ["সাইন ইন", "साइन इन"],
    "Create Free Account": ["ফ্রি অ্যাকাউন্ট খুলুন", "मुफ़्त अकाउंट बनाएं"],
    "Your Name": ["আপনার নাম", "आपका नाम"],
    "Email": ["ইমেইল", "ईमेल"],
    "Password": ["পাসওয়ার্ড", "पासवर्ड"],
    "Your password": ["আপনার পাসওয়ার্ড", "आपका पासवर्ड"],
    "Same password again": ["একই পাসওয়ার্ড আবার", "वही पासवर्ड फिर से"],
    "Please enter your password.": ["আপনার পাসওয়ার্ড দিন।", "अपना पासवर्ड दर्ज करें।"],
    "Name shouldn't contain numbers or symbols.": ["নামে সংখ্যা বা চিহ্ন থাকা যাবে না।", "नाम में नंबर या चिह्न नहीं होने चाहिए।"],
    "Password must be 6+ characters with a letter and a number.": ["পাসওয়ার্ড ৬+ অক্ষরের হতে হবে — একটা হরফ + একটা সংখ্যা।", "पासवर्ड 6+ अक्षरों का हो — एक अक्षर और एक अंक।"],
    "Please write your full name (at least 3 letters).": ["আপনার পুরো নাম লিখুন (কমপক্ষে ৩ অক্ষর)।", "अपना पूरा नाम लिखें (कम से कम 3 अक्षर)।"],
    "Temporary email addresses aren't allowed — please use your real email (Gmail is perfect).": ["টেম্প-মেইল চলবে না — আসল ইমেইল ব্যবহার করুন (Gmail পারফেক্ট)।", "अस्थायी ईमेल नहीं चलेगा — अपना असली ईमेल डालें (Gmail बेहतर है)।"],
    "Forgot password?": ["পাসওয়ার্ড ভুলে গেছেন?", "पासवर्ड भूल गए?"],

    /* ===== OTP/রিসেট স্টেপ (ইংরেজি ডেল্টার স্ট্রিং) ===== */
    "Check your inbox 📬": ["ইনবক্স দেখুন 📬", "इनबॉक्स देखें 📬"],
    "Reset code sent 📬": ["রিসেট কোড পাঠানো হলো 📬", "रीसेट कोड भेजा गया 📬"],
    "We sent a 6-digit code to": ["আমরা ৬-ডিজিট কোড পাঠিয়েছি", "हमने 6-अंकीय कोड भेजा है"],
    "Can't find it? Peek into Spam or Junk 👀": ["খুঁজে না পেলে Spam/Junk-এ উঁকি দিন 👀", "नहीं मिला? Spam या Junk में झाँकें 👀"],
    "6-digit code": ["৬-ডিজিট কোড", "6-अंकीय कोड"],
    "Verify & create account": ["ভেরিফাই করে অ্যাকাউন্ট খুলুন", "वेरीफ़ाई कर अकाउंट बनाएं"],
    "Verify code": ["কোড ভেরিফাই করুন", "कोड वेरीफ़ाई करें"],
    "Please enter the full 6-digit code.": ["৬-ডিজিটের পুরো কোডটা লিখুন।", "पूरा 6-अंकीय कोड दर्ज करें।"],
    "🔁 Resend code": ["🔁 আবার কোড পাঠান", "🔁 कोड फिर भेजें"],
    "Resend (60s)": ["আবার পাঠান (60s)", "फिर भेजें (60s)"],
    "Verifying…": ["যাচাই হচ্ছে…", "जाँच हो रही है…"],
    "Sending…": ["পাঠানো হচ্ছে…", "भेजा जा रहा है…"],
    "Saving…": ["সেভ হচ্ছে…", "सेव हो रहा है…"],
    "Please try again": ["আবার চেষ্টা করুন", "फिर कोशिश करें"],
    "New code sent 📨": ["নতুন কোড পাঠানো হলো 📨", "नया कोड भेजा गया 📨"],
    "Forgot password? 🔑": ["পাসওয়ার্ড ভুলে গেছেন? 🔑", "पासवर्ड भूल गए? 🔑"],
    "Enter the email of your account — we'll send a verification code to reset it.": ["আপনার অ্যাকাউন্টের ইমেইল দিন — রিসেট-ভেরিফিকেশন কোড পাঠিয়ে দেব।", "अपने अकाउंट का ईमेल दर्ज करें — रीसेट वेरीफ़िकेशन कोड भेजेंगे।"],
    "Please enter a valid email address.": ["সঠিক ইমেইল ঠিকানা লিখুন।", "सही ईमेल पता दर्ज करें।"],
    "Temporary email won't work — please use your real email.": ["টেম্প-মেইল কাজ করবে না — আসল ইমেইল ব্যবহার করুন।", "अस्थायी ईमेल काम नहीं करेगा — असली ईमेल इस्तेमाल करें।"],
    "Send reset code": ["রিসেট কোড পাঠান", "रीसेट कोड भेजें"],
    "← Back to login": ["← লগইনে ফিরুন", "← लॉगिन पर वापस"],
    "Create a new password 🛡️": ["নতুন পাসওয়ার্ড বানান 🛡️", "नया पासवर्ड बनाएं 🛡️"],
    "Code verified ✓ — now set your new password.": ["কোড মিলে গেছে ✓ — এবার নতুন পাসওয়ার্ড বসান।", "कोड सही ✓ — अब नया पासवर्ड सेट करें।"],
    "New password": ["নতুন পাসওয়ার্ড", "नया पासवर्ड"],
    "Type it again": ["আবার লিখুন", "फिर से लिखें"],
    "Save new password": ["নতুন পাসওয়ার্ড সেভ করুন", "नया पासवर्ड सेव करें"],
    "Password needs 6+ characters with a letter and a number.": ["পাসওয়ার্ডে চাই ৬+ অক্ষর — একটা হরফ ও একটা সংখ্যা।", "पासवर्ड में 6+ अक्षर चाहिए — एक अक्षर और एक अंक।"],
    "Those two passwords don't match.": ["দুটো পাসওয়ার্ড মিলেনি।", "दोनों पासवर्ड मेल नहीं खा रहे।"],
    "Password updated ✓ — log in now! 🎉": ["পাসওয়ার্ড বদলে গেছে ✓ — এবার লগইন করুন! 🎉", "पासवर्ड बदल गया ✓ — अब लॉग इन करें! 🎉"],
    "This device already has your account — logging you in 🙂": ["এই ডিভাইসে আপনার অ্যাকাউন্ট আছেই — লগইন করে দিচ্ছি 🙂", "इस डिवाइस पर आपका अकाउंट मौजूद है — लॉग इन कर रहे हैं 🙂"],
    "⛔ This account is banned — please contact support.": ["⛔ এই অ্যাকাউন্ট ব্যানড — সাপোর্টের সাথে যোগাযোগ করুন।", "⛔ यह अकाउंट बैन है — सपोर्ट से संपर्क करें।"],
    "⛔ This account is banned — please contact support": ["⛔ এই অ্যাকাউন্ট ব্যানড — সাপোর্টের সাথে যোগাযোগ করুন।", "⛔ यह अकाउंट बैन है — सपोर्ट से संपर्क करें।"],
    "Network issue — please try again": ["নেটওয়ার্ক সমস্যা — আবার চেষ্টা করুন", "नेटवर्क समस्या — फिर कोशिश करें"],

    /* ===== সার্ভার-এরর (Code.gs-থেকে আসা জবাবগুলো) ===== */
    "invalid email": ["ইমেইলটা সঠিক না — আবার দেখুন।", "ईमेल सही नहीं — फिर देखें।"],
    "⛔ temporary email blocked — please provide a real email": ["⛔ টেম্প-মেইল ব্লকড — আসল ইমেইল দিন", "⛔ अस्थायी ईमेल ब्लॉक्ड — असली ईमेल दें"],
    "account banned ⛔ — contact admin": ["অ্যাকাউন্ট ব্যানড ⛔ — অ্যাডমিনের সাথে যোগাযোগ করুন", "अकाउंट बैन ⛔ — एडमिन से संपर्क करें"],
    "Temporary emails are not allowed here! Please use your real email (e.g., Gmail)": ["টেম্প-মেইল এখানে চলে না! আসল ইমেইল ব্যবহার করুন (যেমন Gmail)", "अस्थायी ईमेल यहाँ नहीं चलेगा! असली ईमेल इस्तेमाल करें (जैसे Gmail)"],
    "Please enter a valid email address - e.g., name@gmail.com": ["সঠিক ইমেইল লিখুন — যেমন name@gmail.com", "सही ईमेल दर्ज करें — जैसे name@gmail.com"],
    "This account is banned – please contact the administrator": ["এই অ্যাকাউন্ট ব্যানড — অ্যাডমিনিস্ট্রেটরের সাথে যোগাযোগ করুন", "यह अकाउंट बैन है — एडमिनिस्ट्रेटर से संपर्क करें"],
    "An account already exists with this email - please login, or click 'Forgot Password'": ["এই ইমেইলে অ্যাকাউন্ট আছেই — লগইন করুন, অথবা 'Forgot Password' চাপুন", "इस ईमेल पर अकाउंट मौजूद है — लॉगिन करें, या 'Forgot Password' दबाएं"],
    "No account found with this email - please sign up first": ["এই ইমেইলে কোনো অ্যাকাউন্ট নেই — আগে সাইন আপ করুন", "इस ईमेल पर कोई अकाउंट नहीं — पहले साइन अप करें"],
    "Incorrect password — please try again or reset it": ["পাসওয়ার্ড ভুল — আবার চেষ্টা করুন অথবা রিসেট করুন", "गलत पासवर्ड — फिर कोशिश करें या रीसेट करें"],
    "No server-password set for this account — use 'Forgot Password' to set one": ["এই অ্যাকাউন্টে সার্ভার-পাসওয়ার্ড সেট নেই — 'Forgot Password' দিয়ে বসান", "इस अकाउंट पर सर्वर-पासवर्ड सेट नहीं — 'Forgot Password' से बनाएं"],
    "Too many attempts – please try again after 10 minutes": ["বহু চেষ্টা হয়ে গেছে — ১০ মিনিট পর আবার করুন", "बहुत कोशिशें हो गईं — 10 मिनट बाद फिर करें"],
    "Emails cannot be delivered to this domain - please provide a valid email address": ["এই ডোমেইনে মেইল পৌঁছায় না — সঠিক ইমেইল দিন", "इस डोमेन पर ईमेल नहीं पहुँचता — सही ईमेल दें"],
    "Failed to send email - please check if the email address is correct": ["মেইল পাঠানো যায়নি — ইমেইলটা ঠিক আছে কি না দেখুন", "ईमेल नहीं भेजा जा सका — ईमेल सही है या नहीं देखें"],
    "Code has expired or was never sent — please request a new code": ["কোডের মেয়াদ শেষ অথবা কোডই যায়নি — নতুন কোড চান", "कोड की अवधी ख़त्म या कोड नहीं गया — नया कोड माँगें"],
    "Invalid code — please check your email and try again": ["কোড ভুল — ইমেইল দেখে আবার লিখুন", "कोड गलत — ईमेल देखकर फिर डालें"],
    "Too many incorrect attempts — please request a new code": ["বহুবার ভুল হয়েছে — নতুন কোড চান", "बहुत गलत प्रयास — नया कोड माँगें"],
    "Could not read code — please resend": ["কোড পড়া যাচ্ছে না — আবার পাঠান", "कोड नहीं पढ़ा जा सका — फिर भेजें"],
    "Please verify the code sent to your email first": ["আগে ইমেইলে পাঠানো কোড ভেরিফাই করুন", "पहले ईमेल पर भेजा कोड वेरीफ़ाई करें"],
    "Account not found": ["অ্যাকাউন্ট পাওয়া যায়নি", "अकाउंट नहीं मिला"],
    "Invalid password-hash": ["পাসওয়ার্ড-হ্যাশ সঠিক না", "पासवर्ड-हैश सही नहीं"],
    "Something went wrong — please try again.": ["কিছু একটা গোলমাল হয়েছে — আবার চেষ্টা করুন।", "कुछ गड़बड़ हुई — फिर कोशिश करें।"],
    "Sign up free to unlock customization ✨": ["কাস্টমাইজেশন আনলক করতে ফ্রি সাইন আপ করুন ✨", "कस्टमाइज़ेशन अनलॉक के लिए मुफ़्त साइन अप करें ✨"],

    /* ===== প্রোফাইল/সেটিংস ===== */
    "Profile": ["প্রোফাইল", "प्रोफ़ाइल"],
    "Account": ["অ্যাকাউন্ট", "खाता"],
    "Add cover": ["কভার যোগ করুন", "कवर जोड़ें"],
    "Edit cover": ["কভার বদলান", "कवर बदलें"],
    "Change": ["বদলান", "बदलें"],
    "Add profile photo": ["প্রোফাইল ছবি যোগ করুন", "प्रोफ़ाइल फोटो जोड़ें"],
    "Change profile photo": ["প্রোফাইল ছবি বদলান", "प्रोफ़ाइल फोटो बदलें"],
    "Change cover photo": ["কভার ছবি বদলান", "कवर फोटो बदलें"],
    "Add cover photo": ["কভার ছবি যোগ করুন", "कवर फोटो जोड़ें"],
    "Name updated! ✏️": ["নাম বদলে গেছে! ✏️", "नाम अपडेट हुआ! ✏️"],
    "Profile photo updated! 📸": ["প্রোফাইল ছবি বদলে গেছে! 📸", "प्रोफ़ाइल फोटो अपडेट हुआ! 📸"],
    "Profile photo removed": ["প্রোফাইল ছবি সরানো হলো", "प्रोफ़ाइल फोटो हटाया गया"],
    "Cover photo updated! 🖼️": ["কভার ছবি বদলে গেছে! 🖼️", "कवर फोटो अपडेट हुआ! 🖼️"],
    "Cover photo removed": ["কভার ছবি সরানো হলো", "कवर फोटो हटाया गया"],
    "Photo too large — pick one under 2.5MB": ["ছবিটা অনেক বড় — ২.৫MB-এর ছোটটা বাছুন", "फोटो बहुत बड़ी — 2.5MB से छोटी चुनें"],
    "Logged out. See you soon!": ["লগ আউট হয়েছে। শীঘ্রই দেখা হবে!", "लॉग आउट हुआ। जल्द मिलते हैं!"],
    "Customization reset": ["কাস্টমাইজেশন রিসেট হলো", "कस्टमाइज़ेशन रीसेट हुआ"],
    "☀️ Light mode on": ["☀️ লাইট মোড চালু", "☀️ लाइट मोड ऑन"],
    "🌙 Dark mode on": ["🌙 ডার্ক মোড চালু", "🌙 डार्क मोड ऑन"],
    "🏆 Max level reached": ["🏆 সর্বোচ্চ লেভেলে পৌঁছে গেছেন!", "🏆 अधिकतम लेवल पर पहुँच गए!"],
    "Back": ["পেছনে", "वापस"],
    "Close": ["বন্ধ", "बंद"],
    "Close search": ["সার্চ বন্ধ করুন", "खोज बंद करें"],
    "Next": ["পরেরটি", "अगला"]
  };

  /* ---------- 🔁 ডায়নামিক প্যাটার্ন (সংখ্যা/নাম মাঝে থাকে) ---------- */
  var RULES = [
    [/^Resend \((\d+)s\)$/, function (m) { return cur === "bn" ? "আবার পাঠান (" + m[1] + "s)" : "फिर भेजें (" + m[1] + "s)"; }],
    [/^Welcome back, (.+)! 👋$/, function (m) { return cur === "bn" ? "ফিরে এসেছেন, " + m[1] + "! 👋" : "फिर से स्वागत है, " + m[1] + "! 👋"; }],
    [/^Welcome, (.+)! 🎉$/, function (m) { return cur === "bn" ? "স্বাগতম, " + m[1] + "! 🎉" : "स्वागत है, " + m[1] + "! 🎉"; }],
    [/^Verified ✓ Welcome, (.+)! 🎉$/, function (m) { return cur === "bn" ? "ভেরিফাইড ✓ স্বাগতম, " + m[1] + "! 🎉" : "वेरीफ़ाइड ✓ स्वागत है, " + m[1] + "! 🎉"; }],
    [/^Like (.+)$/, function (m) { return cur === "bn" ? "লাইক করুন: " + m[1] : m[1] + " को लाइक करें"; }],
    [/^Card (\d+)$/, function (m) { return cur === "bn" ? "কার্ড " + m[1] : "कार्ड " + m[1]; }]
  ];

  var MISS = {};
  function lookup(text) {
    var flat = text.replace(/\s+/g, " ").trim();
    if (!flat || !/[a-z0-9\u00C0-\u024F]/i.test(flat)) return null;      // লেটার/সংখ্যা ছাড়া ছাড়
    if (DICT[flat] && DICT[flat][cur === "bn" ? 0 : 1]) return DICT[flat][cur === "bn" ? 0 : 1];
    for (var i = 0; i < RULES.length; i++) {
      var m = flat.match(RULES[i][0]);
      if (m && cur !== "en") return RULES[i][1](m);
    }
    MISS[flat] = 1;
    return null;
  }

  function translateNode(n) {
    if (n._tzMark === n.textContent) return;                            // আমাদের নিজেদের লেখা — লুপ বন্ধ
    n._tzMark = n.textContent;                                          // এটাই এখন সোর্স হিসেবে মণ্ড
    if (cur === "en") return;
    var raw = n.textContent, ws = raw.match(/^(\s*)([\s\S]*?)(\s*)$/);
    var out = lookup(raw);
    if (out != null) {
      n._tzMark = ws[1] + out + ws[3];
      n.textContent = n._tzMark;
    }
  }

  var SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1, CODE: 1, PRE: 1 };
  function scan(root) {
    if (!root || root.nodeType !== 1 && root.nodeType !== 9) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (nd) {
        var p = nd.parentNode;
        if (!p || SKIP[p.nodeName]) return NodeFilter.FILTER_REJECT;
        if (p.closest && p.closest(".notranslate,[data-i18n-skip]")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n, list = [];
    while ((n = w.nextNode())) list.push(n);                            // প্রথমে সংগ্রহ, পরে লেখা — ট্রি-ওয়াকার নিরাপদ
    list.forEach(translateNode);
    /* অ্যাট্রিবিউটও অনুবাদ: placeholder / aria-label / title */
    if (cur !== "en") {
      var attrs = ["placeholder", "aria-label", "title"];
      root.querySelectorAll && root.querySelectorAll("[placeholder],[aria-label],[title]").forEach(function (el) {
        attrs.forEach(function (a) {
          var v = el.getAttribute(a);
          if (!v) return;
          var key = a + "::" + v;
          if (el._tzA && el._tzA[a] === key) { /* ইতিমধ্যে আমাদেরটা */ return; }
          var out = lookup(v);
          el._tzA = el._tzA || {};
          if (out != null) { el._tzA[a] = a + "::" + out; el.setAttribute(a, out); }
          else el._tzA[a] = key;
        });
      });
    }
  }

  /* ---------- 👁 ডায়নামিকভাবে যোগ হওয়া লেখা (মডাল/টোস্ট) ধরা ---------- */
  var pending = null;
  var mo = new MutationObserver(function (muts) {
    clearTimeout(pending);
    pending = setTimeout(function () {
      var roots = {};
      muts.forEach(function (mu) {
        if (mu.type === "characterData" && mu.target && mu.target.parentNode) scan(mu.target.parentNode);
        mu.addedNodes && mu.addedNodes.forEach(function (ad) { if (ad.nodeType === 1) scan(ad); });
      });
      if (DEBUG && cur !== "en") showMissing();
    }, 30);
  });

  function start() {
    scan(document.body);
    mo.observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  if (document.readyState === "loading") addEventListener("DOMContentLoaded", start);
  else start();

  /* ---------- 🐞 ডিবাগ: যেগুলো এখনো ডিকশনারিতে নেই ---------- */
  function showMissing() {
    var ks = Object.keys(MISS);
    if (!ks.length) return;
    console.warn("TZ-i18n: " + ks.length + " টা স্ট্রিং এখনো ডিকশনারিতে নেই:\n" +
      ks.map(function (k) { return '  "' + k + '": ["", ""],'; }).join("\n"));
    MISS = {};
  }
  window.TZI18N = {
    lang: function () { return cur; },
    scan: function (root) { scan(root || document.body); },
    missing: function () {
      var ks = Object.keys(MISS);
      console.log(ks.length ? ks.map(function (k) { return '"' + k + '": ["", ""],'; }).join("\n") : "✅ সব অনুবাদ ডিকশনারিতে আছে!");
      return ks;
    }
  };

  /* ---------- ⚙️ সেটিংস-হাব — এক আইকনে থিম + ভাষা + ভবিষ্যত-সেটিংস (প্রোফাইলের পাশে) ---------- */
  var st = document.createElement("style");
  st.textContent =
    "#tzSetFab{position:fixed;right:14px;bottom:calc(96px + env(safe-area-inset-bottom,0px));z-index:9000;" +
    "width:46px;height:46px;border-radius:50%;border:1px solid rgba(255,255,255,.35);cursor:pointer;" +
    "background:linear-gradient(135deg,#ff5fa2,#ff8a3d);color:#fff;display:flex;align-items:center;justify-content:center;" +
    "box-shadow:0 6px 22px rgba(255,95,162,.45);transition:transform .15s ease}" +
    "#tzSetFab:hover{transform:scale(1.08)}" +
    "#tzSetFab svg{width:20px;height:20px}" +
    ".tz-set-btn svg{width:16px;height:16px;transition:transform .25s ease}" +
    ".tz-set-btn.open svg{transform:rotate(45deg)}" +
    "#tzSetMenu{position:fixed;z-index:9001;display:none;min-width:236px;" +
    "background:var(--card,#17172a);border:1px solid var(--border,rgba(255,255,255,.14));border-radius:16px;padding:8px;" +
    "box-shadow:0 14px 40px rgba(0,0,0,.45);color:var(--text,#eee);font-family:inherit}" +
    "#tzSetMenu.open{display:block}" +
    "#tzSetMenu .tz-row{display:flex;align-items:center;gap:10px;width:100%;background:none;border:0;color:inherit;" +
    "padding:11px 12px;border-radius:11px;cursor:pointer;font-size:.9rem;text-align:left;line-height:1.25;font-family:inherit}" +
    "#tzSetMenu .tz-row:hover{background:rgba(255,95,162,.08)}" +
    "#tzSetMenu .tz-row.on span:first-child{font-weight:700;color:#ff7ec2}" +
    "#tzSetMenu .tz-val{margin-left:auto;font-size:.8rem;font-weight:800;color:#ff7ec2;white-space:nowrap}" +
    "#tzSetMenu .tz-h{font-size:.68rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--muted,#888);padding:10px 12px 4px}" +
    "#tzSetMenu .tz-sep{height:1px;background:var(--border,rgba(255,255,255,.1));margin:6px 8px}" +
    "#tzSetMenu .tz-note{font-size:.68rem;color:var(--muted,#888);padding:6px 12px 8px;text-align:center}" +
    "html.tz-calm *{animation:none !important;transition:none !important}" +
    "@media(min-width:760px){#tzSetFab{bottom:20px}}";
  document.head.appendChild(st);

  var GEAR_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>';
  var NAMES = { en: "English", bn: "বাংলা", hi: "हिन्दी" };

  var fab = document.createElement("button");
  fab.id = "tzSetFab"; fab.type = "button"; fab.title = "Settings / সেটিংস";
  fab.setAttribute("aria-label", "Open settings");
  fab.innerHTML = GEAR_SVG;                                             // ⚙️ গিয়ার — ☀/🔍-এর মতোই স্ট্রোক-আইকন
  var menu = document.createElement("div");
  menu.id = "tzSetMenu"; menu.setAttribute("role", "menu");

  function themeIsDark() { return (document.documentElement.dataset.theme || "dark") !== "light"; }
  function applyCalm() { document.documentElement.classList.toggle("tz-calm", localStorage.getItem("tz_calm") === "1"); }
  applyCalm();

  /* মেনু প্রতিবার ওপেনের আগে সতেজ রেন্ডার — থিম/ভাষা/টগল সিংকে */
  function buildMenu() {
    menu.innerHTML = "";
    var h1 = document.createElement("div"); h1.className = "tz-h"; h1.textContent = "Appearance / চেহারা";
    menu.appendChild(h1);

    /* 🌗 থিম রো — আপনার app.js-এর #themeBtn-ই চাপ দেই: কোনো লজিক-ডুপ্লিকেশন নেই */
    var tRow = document.createElement("button"); tRow.type = "button"; tRow.className = "tz-row";
    tRow.innerHTML = '<span>' + (themeIsDark() ? "🌙 Night mode" : "☀️ Day mode") + '</span><span class="tz-val">tap to switch ↔</span>';
    tRow.addEventListener("click", function () {
      var tb = document.getElementById("themeBtn");
      if (tb) tb.click();
      else document.documentElement.dataset.theme = themeIsDark() ? "light" : "dark";
      setTimeout(buildMenu, 80);
      setTimeout(function () { try { scan(document.body); } catch (e) {} }, 140);   // থিম-টোস্টও অনুবাদে ধরা হোক
    });
    menu.appendChild(tRow);

    var s1 = document.createElement("div"); s1.className = "tz-sep"; menu.appendChild(s1);
    var h2 = document.createElement("div"); h2.className = "tz-h"; h2.textContent = "Language / ভাষা";
    menu.appendChild(h2);
    SUPPORTED.forEach(function (l) {
      var b = document.createElement("button"); b.type = "button";
      b.className = "tz-row" + (l === cur ? " on" : "");
      b.innerHTML = '<span>' + NAMES[l] + '</span>' + (l === cur ? '<span class="tz-val">✓</span>' : "");
      b.addEventListener("click", function () {
        localStorage.setItem(LS_LANG, l);
        location.reload();
      });
      menu.appendChild(b);
    });

    var s2 = document.createElement("div"); s2.className = "tz-sep"; menu.appendChild(s2);
    var h3 = document.createElement("div"); h3.className = "tz-h"; h3.textContent = "My site / ইউজার-সেটিং";
    menu.appendChild(h3);

    /* 🧘 নমুনা ইউজার-সেটিং — এখানেই ভবিষ্যতের সেটিং যোগ করবেন (এক লাইনেই রো!) */
    var calm = localStorage.getItem("tz_calm") === "1";
    var cRow = document.createElement("button"); cRow.type = "button"; cRow.className = "tz-row";
    cRow.innerHTML = "<span>" + (calm ? "☑ " : "☐ ") + "Reduce animations ✨</span>";
    cRow.addEventListener("click", function () {
      localStorage.setItem("tz_calm", calm ? "0" : "1");
      applyCalm();
      buildMenu();
    });
    menu.appendChild(cRow);

    var nt = document.createElement("div"); nt.className = "tz-note"; nt.textContent = "More settings soon 🚀";
    menu.appendChild(nt);
  }

  function placeMenu() {
    var r = fab.getBoundingClientRect();
    menu.style.top = (r.bottom + 8) + "px";
    menu.style.right = Math.max(10, window.innerWidth - r.right) + "px";
    menu.style.bottom = "auto";
  }
  fab.addEventListener("click", function (e) {
    e.stopPropagation();
    if (!menu.classList.contains("open")) { buildMenu(); placeMenu(); }
    var on = menu.classList.toggle("open");
    fab.classList.toggle("open", on);
  });
  document.addEventListener("click", function (e) {
    if (!menu.contains(e.target) && e.target !== fab) { menu.classList.remove("open"); fab.classList.remove("open"); }
  });

  /* app.js হেডারটা জেনোরেট করে — ধৈর্য ধরে ট্রাই; মিললেই প্রোফাইলের পাশে, ☀ আটকে ⚙ সেটিংসে */
  function tryMount(tries) {
    var host = document.querySelector(".header-actions");
    if (host) {
      fab.removeAttribute("id");                                         // ফ্লোটিং-সিএসএস বিদায় ✅
      fab.className = "icon-btn tz-set-btn";
      var anchor = host.querySelector("#avatarHost") || host.querySelector("#themeBtn") || null;
      host.insertBefore(fab, anchor);                                    // …☀ ⚙️ 👤
      var tb = host.querySelector("#themeBtn");
      if (tb) tb.style.display = "none";                                 // স্ট্যান্ডেলোন ☀ লুকান — ক্লিক-লজিক বসে আছে মেনুতে
      document.body.appendChild(menu);
      return;
    }
    if (tries < 30) return setTimeout(function () { tryMount(tries + 1); }, 300);
    document.body.appendChild(fab);                                      // ফলব্যাক: ফ্লোটিং ⚙️
    document.body.appendChild(menu);
  }
  tryMount(0);

  /* हिन्दी বাছলে Devanagari ফন্ট লোড (না থাকলেও সিস্টেম-ফন্টে চলে) */
  if (cur === "hi") {
    var lk = document.createElement("link");
    lk.rel = "stylesheet";
    lk.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700;800&display=swap";
    document.head.appendChild(lk);
    var fst = document.createElement("style");
    fst.textContent = "html[lang=hi] body{font-family:'Noto Sans Devanagari',system-ui,sans-serif}";
    document.head.appendChild(fst);
  }
})();

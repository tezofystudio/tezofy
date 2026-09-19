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
    /* ===== হিরো/স্ট্যাটিক (index.html) ===== */
    "Search prompts…": ["প্রম্পট খুঁজুন…", "प्रॉम्प्ट खोजें…"],
    "Search prompts": ["প্রম্পট খুঁজুন", "प्रॉम्प्ट खोजें"],
    "1,000+ free prompt templates · new prompt every day": ["১,০০০+ ফ্রি প্রম্পট টেমপ্লেট · প্রতিদিন নতুন প্রম্পট", "1,000+ फ़्री प्रॉम्प्ट टेम्पलेट · हर दिन नया प्रॉम्प्ट"],
    "One-tap access from your home screen — works offline too.": ["হোম স্ক্রিন থেকে এক ট্যাপেই — অফলাইনেও চলে।", "होम स्क्रीन से एक टैप में — ऑफ़लाइन भी चलता है।"],
    "✨ Crafting your premium prompt universe…": ["✨ আপনার প্রিমিয়াম প্রম্পট-জগৎ সাজাচ্ছি…", "✨ आपका प्रीमियम प्रॉम्प्ट संसार सज रहा है…"],
    "© 2026 TEZOFY. Made with ❤️ for creators.": ["© 2026 TEZOFY। ক্রিয়েটরদের জন্য ❤️ দিয়ে তৈরি।", "© 2026 TEZOFY। क्रिएटर्स के लिए ❤️ से निर्मित।"],
    "💬 Send Feedback": ["💬 মতামত পাঠান", "💬 प्रतिक्रिया भेजें"],

    /* ===== ফুটার/ন্যাভ ===== */
    "Explore": ["আর্কষণ", "एक्सप्लोर"],
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
    missing: function () {
      var ks = Object.keys(MISS);
      console.log(ks.length ? ks.map(function (k) { return '"' + k + '": ["", ""],'; }).join("\n") : "✅ সব অনুবাদ ডিকশনারিতে আছে!");
      return ks;
    }
  };

  /* ---------- 🌐 ভাষা-বাছাই বাটন (ফ্লোটিং) ---------- */
  var st = document.createElement("style");
  st.textContent =
    "#tzLangFab{position:fixed;right:14px;bottom:calc(96px + env(safe-area-inset-bottom,0px));z-index:9000;" +
    "width:46px;height:46px;border-radius:50%;border:1px solid rgba(255,255,255,.35);cursor:pointer;" +
    "background:linear-gradient(135deg,#ff5fa2,#ff8a3d);color:#fff;font-size:20px;display:flex;align-items:center;justify-content:center;" +
    "box-shadow:0 6px 22px rgba(255,95,162,.45);transition:transform .15s ease}" +
    "#tzLangFab:hover{transform:scale(1.08)}" +
    "#tzLangMenu{position:fixed;right:14px;bottom:calc(150px + env(safe-area-inset-bottom,0px));z-index:9001;display:none;" +
    "background:#17172a;border:1px solid rgba(255,255,255,.14);border-radius:14px;padding:6px;box-shadow:0 10px 30px rgba(0,0,0,.5)}" +
    "#tzLangMenu.open{display:block}" +
    "#tzLangMenu button{display:flex;gap:9px;align-items:center;width:100%;background:none;border:0;color:#eee;" +
    "padding:10px 14px;border-radius:9px;cursor:pointer;font-size:14px;font-family:inherit;text-align:left;white-space:nowrap}" +
    "#tzLangMenu button:hover{background:rgba(255,255,255,.08)}" +
    "#tzLangMenu button.on{color:#ff7ec2;font-weight:700}" +
    "@media(min-width:760px){#tzLangFab{bottom:20px}#tzLangMenu{bottom:74px}}";
  document.head.appendChild(st);

  var NAMES = { en: "English", bn: "বাংলা", hi: "हिन्दी" };
  var fab = document.createElement("button");
  fab.id = "tzLangFab"; fab.type = "button"; fab.title = "Language / ভাষা";
  fab.setAttribute("aria-label", "Change language");
  fab.textContent = "🌐";
  var menu = document.createElement("div");
  menu.id = "tzLangMenu"; menu.setAttribute("role", "menu");
  SUPPORTED.forEach(function (l) {
    var b = document.createElement("button");
    b.type = "button"; b.textContent = NAMES[l] + (l === cur ? " ✓" : "");
    if (l === cur) b.className = "on";
    b.addEventListener("click", function () {
      localStorage.setItem(LS_LANG, l);
      location.reload();                                               // নতুন ভাষায় পেজ ফেরত — মিনিমাল-লো, মেপেস নিখুঁত
    });
    menu.appendChild(b);
  });
  fab.addEventListener("click", function () { menu.classList.toggle("open"); });
  document.addEventListener("click", function (e) {
    if (!menu.contains(e.target) && e.target !== fab) menu.classList.remove("open");
  });
  document.body.appendChild(fab);
  document.body.appendChild(menu);

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

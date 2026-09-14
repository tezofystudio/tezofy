# TEZOFY — Premium AI Image Prompt Library

Vivara-ধাঁচের (tryvivara.in) সম্পূর্ণ মোবাইল-ফার্স্ট, স্ট্যাটিক + PWA ওয়েবসাইট।
কোনো বিল্ড স্টেপ নেই, কোনো ডিপেন্ডেন্সি নেই — **যেকোনো ফ্রি হোস্টিংয়ে আপলোড করলেই লাইভ।**

---

## 🎁 এই ভার্সনে যা যা আছে

| ফিচার | বিবরণ |
|---|---|
| 🏆 Top 3 podium | সাপ্তাহিক সেরা প্রম্পট (#2, #1, #3) |
| ✨ Prompt of the Day | প্রতিদিন অটোমেটিক নতুন প্রম্পট হাইলাইট হয় |
| 🕘 Recently Viewed | ব্যবহারকারী যেগুলো দেখেছে তার রেকর্ড |
| ⚡🔥🪔💍💼 সেকশন | Trending, Popular, Festival, Wedding, Professional |
| 🗂️ ১২ ক্যাটাগরি | Trending → Nature পর্যন্ত |
| 🎛️ **Customize প্যানেল** | 👗 Outfit, 🌆 Background, 💡 Lighting, 🕐 Time, 📷 Angle, 🎭 Mood, ✨ Effects, 📐 Ratio — স্ক্রলেবল চিপে ট্যাপ করলেই প্রম্পট লাইভ বদলে যায় |
| ✏️ Placeholder ইনপুট | `[CITY]`, `[COLOR]` নিজের মতো পূরণ করে কপি |
| 🔐 Sign Up / Login | ডিভাইস-লোকাল অ্যাকাউন্ট + প্রোফাইল (Saved/Likes/Copies স্ট্যাট) |
| 🔥 Daily Streak | প্রতিদিন সাইটে এলে স্ট্রিক বাড়ে — প্রোফাইল শিটে দেখা যায় |
| 🔍 লাইভ সার্চ | ⌘K / Ctrl+K শর্টকাটসহ |
| 🔖 সেভ, ❤️ লাইক, 🔗 শেয়ার | সব localStorage-এ |
| 🎲 Surprise Me | Discover পেজে র‍্যান্ডম প্রম্পট |
| 📱 PWA | হোম স্ক্রিনে ইনস্টল হয়, অফলাইনে চলে (সার্ভিস ওয়ার্কার) |
| 🍪 Cookie banner, FAQ, ব্লগ (৪টি আর্টিকেল) | সর্বসমেত |

---

## 📁 ফাইল স্ট্রাকচার

```
chitro/
├── index.html / discover.html / category.html / template.html
├── blog.html / article.html / saved.html
├── manifest.webmanifest   → PWA ম্যানিফেস্ট
├── sw.js                  → সার্ভিস ওয়ার্কার (অফলাইন ক্যাশ)
├── robots.txt             → ⚠️ ডোমেইন বসান (YOUR-DOMAIN.com বদলান)
├── sitemap.xml            → ⚠️ ডোমেইন বসান
├── netlify.toml           → Netlify অটো-কনফিগ
├── vercel.json            → Vercel অটো-কনফিগ
└── assets/
    ├── css/style.css      → ডিজাইন সিস্টেম
    ├── js/data.js         → ★ সব কনটেন্ট (প্রম্পট/ক্যাটাগরি/ব্লগ/customize অপশন)
    ├── js/app.js          → সব ইন্টার‍্যাকশন + auth
    ├── img/               → ২০টি AI-জেনারেটেড ছবি
    └── icons/             → PWA অ্যাপ আইকন
```

---

## 🚀 ফ্রিতে লাইভ করুন (যেকোনো একটি)

### অপশন ১: Netlify (সবচেয়ে সহজ — ড্র্যাগ অ্যান্ড ড্রপ)
1. [netlify.com](https://netlify.com)-এ ফ্রি অ্যাকাউন্ট খুলুন
2. **Add new site → Deploy manually**-তে গিয়ে `chitro` ফোল্ডারটি ড্র্যাগ করে ছাড়ুন
3. ৩০ সেকেন্ডে লাইভ! পাবেন `random-name.netlify.app` লিংক
4. Site settings → Change site name → `chitro.netlify.app` (ফ্রি সাবডোমেইন)

### অপশন ২: Vercel
1. [vercel.com](https://vercel.com)-এ GitHub/Google দিয়ে সাইন ইন
2. ফোল্ডারটি GitHub রেপোতে পুশ করুন → **Import Project** → Deploy
3. পাবেন `chitro.vercel.app` লিংক

### অপশন ৩: GitHub Pages (১০০% ফ্রি, স্থায়ী)

**পদ্ধতি A — ব্রাউজারেই (git লাগে না, ২ মিনিট):**
1. [github.com/new](https://github.com/new)-এ গিয়ে রেপো বানান — নাম: `chitro`, Public ক্লিক করে **Create repository**
2. রেপোর পেজে **"uploading an existing file"** লিংকে ক্লিক করুন
3. `chitro` ফোল্ডারের **ভেতরের সব ফাইল/ফোল্ডার** ড্র্যাগ করে ছাড়ুন (ZIP আনজিপ করে)
4. **Commit changes** চাপুন
5. **Settings → Pages → Source: Deploy from a branch → Branch: main → /(root) → Save**
6. ১-২ মিনিটে লাইভ: `https://YOUR-USERNAME.github.io/chitro/` 🎉

**পদ্ধতি B — git কম্যান্ড দিয়ে:**
```bash
cd chitro
git remote add origin https://github.com/YOUR-USERNAME/chitro.git
git push -u origin main
```
তারপর GitHub রেপো → **Settings → Pages → Branch: main → Save**
লিংক: `https://YOUR-USERNAME.github.io/chitro/`

### অপশন ৪: Cloudflare Pages
1. [pages.cloudflare.com](https://pages.cloudflare.com) → Create project → Direct upload
2. `chitro` ফোল্ডার আপলোড → `chitro.pages.dev` লিংক পাবেন

### ➡️ লাইভের পর করণীয়
- `robots.txt` ও `sitemap.xml`-এ `YOUR-DOMAIN.com` বদলে নিজের ডোমেইন/লিংক লিখুন
- ডোমেইন কিনলে হোস্টিংয়ের **Custom Domain** অপশন থেকে ফ্রিতেই কানেক্ট হয় (SSL-ও ফ্রি)
- Google Search Console-এ সাইট যোগ করে sitemap জমা দিন → Google-এ ইনডেক্স দ্রুত হবে

---

## ➕ নতুন প্রম্পট যোগ করবেন যেভাবে

`assets/js/data.js`-এ `PROMPTS` অ্যারেতে একটি অবজেক্ট কপি করে:
1. ছবিটি `assets/img/`-এ রাখুন (ভার্টিকাল 4:5 সেরা)
2. `id`, `title`, `img`, `cats`, `uses`, `likes`, `prompt`, `tags` বদলান
3. `custom` অ্যারেতে কোন কোন customize গ্রুপ দেখাবে লিখুন — `["outfit","bg","lighting","angle","fx","ratio"]`
4. চাইলে `customOptions`-এ ওই ছবির নিজস্ব Outfit/Background অপশন দিন

— ব্যাস! হোম, Discover, সার্চ, ক্যাটাগরি — সব জায়গায় অটো দেখা যাবে।

## 🔐 অ্যাকাউন্ট সিস্টেম সম্পর্কে নোট

বর্তমান Sign Up/Login **ডিভাইসে লোকালি** চলে (ফ্রি স্ট্যাটিক হোস্টিংয়ে ব্যাকএন্ড লাগে না)।
পরে মাল্টি-ডিভাইস ক্লাউড অ্যাকাউন্ট চাইলে [Supabase](https://supabase.com) বা Firebase Auth (দুটোই ফ্রি টিয়ার) বসানো যাবে — `app.js`-এর `signup/login/logout` ফাংশনগুলোই শুধু বদলাতে হবে, UI একই থাকবে।

লোকালে চালাতে: `python3 -m http.server 8080` → http://localhost:8080

# OYNAVA Lansman Kiti (Otorite & Backlink)

Kopyala-yapıştır hazır metinler. Sıra önerisi: Sosyal profiller → Bing → Product Hunt →
dev.to yazısı → forumlar/dizinler. (Hiçbiri deploy gerektirmez.)

---

## 1) Sosyal Medya Bio'ları

**TikTok / Instagram / YouTube (TR):**
> 🎮 Binlerce ücretsiz oyun — indirme yok, tıkla ve oyna!
> 🔥 Her gün yeni oyun klipleri
> 👇 Hepsini oyna: oynava.com

**X/Twitter (TR):**
> Binlerce ücretsiz HTML5 oyun tek yerde. İndirme yok, kurulum yok — tarayıcıda oyna. 🎮 oynava.com

**English (yedek):**
> 🎮 Thousands of free browser games — no download, just play. oynava.com

Kullanıcı adı önerisi (hepsi aynı olsun): **@oynava** (doluysa @oynavacom)

---

## 2) Product Hunt Lansmanı (EN)

**Name:** OYNAVA
**Tagline:** 6000+ free browser games — no download, just click and play
**Description:**
> OYNAVA is a free game portal with 6000+ HTML5 games: racing, FPS, .io multiplayer,
> puzzle, sports and more. Everything runs directly in your browser — no downloads,
> no signup required. Works great on mobile too (installable as a PWA / Android app).

**First comment (maker yorumu):**
> Hey PH! 👋 I built OYNAVA because I wanted a fast, clean way to play browser games
> without downloads, popups or forced signups. It aggregates 6000+ HTML5 games
> (racing, FPS, .io, puzzle…), runs as a PWA, has favorites, daily rewards and
> achievements — all free. Tech: Next.js 14 + Tailwind, hosted on Netlify, Redis for
> likes/plays. Would love your feedback — especially on discovery/search. 🎮

**Topics:** Games, Web App, Free

---

## 3) dev.to / Medium Teknik Yazısı (EN — backlink çeker)

**Başlık:** How I Built a 6,000-Game Web Portal with Next.js 14 (and Kept Hosting ~Free)

**Hazır taslak:**

```markdown
# How I Built a 6,000-Game Web Portal with Next.js 14 (and Kept Hosting ~Free)

I recently launched [OYNAVA](https://www.oynava.com), a free HTML5 game portal with
6,000+ games. Here's the architecture, the cost traps I hit, and how I fixed them.

## The stack
- **Next.js 14 (App Router)** + TypeScript + Tailwind
- Game feeds: GameMonetize, GamePix, GameDistribution (merged + normalized)
- **Redis** for shared likes/plays counters
- Hosting: Netlify (moved from Vercel — more on that below)

## Lesson 1: dynamic SSR will eat your free tier
My i18n used `headers()` to read the locale → every page became dynamic (ƒ) →
every request hit origin. Vercel's "Fast Origin Transfer" quota (10 GB) filled in days.
**Fix:** made all content pages static/ISR (`revalidate: 3600` + `generateStaticParams`),
moved locale to URL prefixes + client-side chrome translation. Origin traffic → ~0.

## Lesson 2: N+1 API calls from the client
Every game card fetched its like-count individually → ~180 requests per homepage view.
**Fix:** an 80 ms client-side batcher that collapses them into one `/api/likes/batch`
call — then I removed live counts from cards entirely (they only matter on detail pages).

## Lesson 3: node-redis vs serverless
Persistent TCP connections are fragile in serverless. Also: my free Redis (30 MB)
silently filled up (noeviction → writes rejected, reads looked "fine"). Adding TTLs to
cache keys + an admin cleanup endpoint fixed it.

## Programmatic SEO
- 44 curated collection pages (`/en-iyi-araba-oyunlari` …)
- ~400 tag landing pages generated from game metadata (with a min-games threshold
  and noindex for thin pages)
- FAQPage/VideoGame/ItemList JSON-LD everywhere
- One sitemap with ~7,000 URLs

## PWA → Google Play
The site is a PWA (manifest + service worker), packaged as a TWA with PWABuilder and
shipped to Google Play. One codebase, updates deploy instantly without app-store releases.

Happy to answer questions — and if you want to try it: **[oynava.com](https://www.oynava.com)** 🎮
```

**Etiketler:** #nextjs #webdev #seo #sidehustle

---

## 4) TikTok / Shorts / Reels — 2 Haftalık İçerik Takvimi

Format: 15–30 sn ekran kaydı + trend ses + üstte 3-5 kelimelik hook + `oynava.com` filigran.
Çekim: telefonda siteyi aç → ekran kaydı → CapCut'ta kırp.

| Gün | Oyun/Tema | Hook (üst yazı) |
|---|---|---|
| 1 | Drift oyunu (yarış) | "İndirmeden drift atıyorum 😳" |
| 2 | .io oyunu (büyüme anı) | "1. sıraya kadar kestim 🔪" |
| 3 | Satisfying merge/bulmaca | "Bu sesi dinle 😌" |
| 4 | FPS (kill anları) | "Tarayıcıda FPS?? Evet." |
| 5 | Günün Oyunu tanıtımı | "Bugünün oyunu bu 🌟" |
| 6 | 2 kişilik oyun (arkadaşla) | "Arkadaşınla tek klavyede 😂" |
| 7 | Haftalık derleme (3 oyun hızlı) | "Bu hafta oynadıklarım" |
| 8 | Korku oyunu (jumpscare tepkisi) | "23:00'te oynamayın 💀" |
| 9 | Zombi oyunu (son an kurtuluş) | "Son mermiyle 😅" |
| 10 | Kız oyunları (makyaj/giydirme) | "Bu kombin 10/10 ✨" |
| 11 | Park etme (fail + başarı) | "3. denemede park ettim" |
| 12 | 3D/premium oyun (grafik şov) | "Bu TARAYICIDA çalışıyor 🤯" |
| 13 | Rastgele oyun butonu (/rastgele) | "Rastgele bas, ne çıkarsa oyna 🎲" |
| 14 | En çok oynananlar top 3 | "Herkes bunları oynuyor 🔥" |

Kurallar: her video aynı saatte (20:00-22:00 arası), açıklamada `oynava.com` + 3-4 hashtag
(#oyun #ücretsizoyun #browsergame + oyuna özel), yorumlara cevap ver.

---

## 5) Forum / Topluluk Metinleri (doğal, spam değil)

**Ekşi Sözlük ("oynava" başlığı, tanım girisi):**
> tarayıcı üzerinden indirmeden oyun oynatan yerli oyun portalı. crazygames'in
> türkçe muadili denebilir; araba, fps, io, bulmaca gibi kategorilerde birkaç bin
> oyun barındırıyor. üyelik zorunlu değil, mobilde de çalışıyor. (bkz: html5)

**Technopat / DonanımHaber tarzı forum tanıtımı (TR):**
> Selam, bir süredir üzerinde çalıştığım projeyi paylaşmak istedim: **oynava.com** —
> tarayıcıda çalışan ~6000 ücretsiz HTML5 oyunu tek çatıda toplayan Türkçe bir portal.
> İndirme/kurulum yok, üyelik zorunlu değil; favoriler, günlük ödül, başarımlar gibi
> özellikler var. Mobilde PWA olarak da kurulabiliyor. Geri bildirimlerinizi çok isterim —
> özellikle hangi kategorileri genişletelim?

**Reddit r/webgames (EN):**
> I made a free browser-game portal with 6000+ HTML5 games (racing, FPS, .io, puzzle).
> No downloads, no forced signup, works on mobile. Would love feedback: https://www.oynava.com

**Discord/Telegram oyun grupları (TR, kısa):**
> Tarayıcıda indirmeden oyun oynayabileceğiniz bir site yaptım: oynava.com —
> 6000+ ücretsiz oyun var, telefonda da çalışıyor. Denerseniz yorumlarınızı beklerim 🎮

---

## 6) Dizin Başvuru Açıklamaları

**Kısa (TR, ~150 karakter):**
> OYNAVA — binlerce ücretsiz HTML5 oyun. İndirme yok, kurulum yok; tarayıcıda anında oyna. Yarış, FPS, .io, bulmaca ve daha fazlası.

**Kısa (EN):**
> OYNAVA — thousands of free HTML5 games. No download, no install; play instantly in your browser. Racing, FPS, .io, puzzle and more.

**Uzun (EN, ~400 karakter):**
> OYNAVA is a free online game portal featuring 6000+ HTML5 games across racing, shooting (FPS), .io multiplayer, puzzle, sports, girls and kids categories. Games run directly in the browser on desktop, tablet and mobile — no downloads or signups required. Includes favorites, daily rewards, achievements and a PWA/Android app. Turkish-first with multi-language support.

**Başvurulacak yerler (checklist):**
- [ ] Product Hunt (lansman)
- [ ] AlternativeTo (alternative to: CrazyGames, Poki)
- [ ] SaaSHub
- [ ] PWA dizinleri ("pwa directory" ara: appsco.pe benzerleri)
- [ ] Bing Webmaster Tools (bing.com/webmasters — GSC'den içe aktar, 2 dk)
- [ ] Yandex Webmaster (TR trafiği için değerli)
- [ ] startupfa.me / betalist tarzı vitrin siteleri

---

## 7) Haftalık Rutin (15 dk)
1. GSC → Performans: "oynava" marka araması artıyor mu?
2. GSC → Sayfalar: indekslenen sayfa sayısı artıyor mu?
3. Ahrefs Webmaster Tools (ücretsiz): yeni backlink var mı?
4. Sosyal: bu hafta 5-7 video çıktı mı?

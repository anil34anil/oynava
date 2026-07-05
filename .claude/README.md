# OYNAVA — HTML5 Oyun Portalı
> *Bir tık, bin oyun*
🎮 Canlı: https://www.oynava.com

kraloyun.com tarzı, binlerce ücretsiz tarayıcı oyununu listeleyen, reklamla
gelir getiren bir oyun portalı. **Next.js 14 + Tailwind + GameMonetize feed.**

## ⚠️ Önemli: Gerçekçi kapsam

- ✅ Bu site **HTML5/WebGL oyunlarını** (tarayıcıda çalışan oyunlar) listeler ve oynatır.
  Bunların arasında gerçekten iyi görünen 3D/WebGL oyunlar (yarış, FPS, .io) vardır.
Para kazanma modeli  HTML5 oyun + reklam üzerinedir.

## Nasıl para kazandırır?

1. **GameMonetize oyun içi reklamları** — oyunlar arası gösterilen reklamlardan gelir payı.
2. **Google AdSense** — site içi banner/sidebar reklamları.
Trafiğin (SEO) ne kadar yüksekse gelir o kadar artar — bu yüzden Next.js (SEO güçlü) seçildi.

## Kurulum

```bash
npm install
cp .env.local.example .env.local   # Windows: copy .env.local.example .env.local
npm run dev                         # http://localhost:3000
```

`.env.local` boşken bile çalışır (public feed + placeholder reklamlar). Gerçek
gelir için aşağıyı doldur.

## Oyun kaynakları (iki ağ birden)

Site iki HTML5 ağını **birleştirir** (`src/lib/games.ts` → `getGames`):

1. **GameMonetize** — `feed.php` JSON feed'i (tek istek).
2. **GameDistribution** — `catalog.api.gamedistribution.com` RSS/JSON API'si (sayfalı).

Canlı çekilen veriler her zaman **gömülü seed kataloglarıyla** birleştirilir, böylece
feed kopsa bile site ~3300 oyunla dolu kalır:
- `src/data/games.seed.json` (GameMonetize, ~1500)
- `src/data/games.gd.seed.json` (GameDistribution, ~1800)

### Geliri kendine bağlamak (önemli)
Gömülü seed "public" feed'den çekilmiştir; **reklam geliri için kendi yayıncı
hesaplarını bağla:**
1. https://gamemonetize.com → Publisher → kendi feed URL'in → `.env.local`'de
   `GAMEMONETIZE_FEED_URL=...`.
2. https://gamedistribution.com → Publisher → SDK/feed'i kendi `gd_sdk_referrer`
   ile kullan (oyun içi reklam geliri sana aksın).

### Seed kataloğunu tazelemek
İstediğinde daha fazla oyun gömmek için feed'leri yeniden indirip seed dosyalarını
güncelleyebilirsin (proje kökünde Node ile `fetch` → `src/data/*.seed.json`).

## AdSense bağlama

1. https://adsense.google.com → siteyi ekle, onay sürecini tamamla (domain gerekir).
2. `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-...` değerini `.env.local`'e gir.
3. Reklam birimleri oluştur, slot ID'lerini `NEXT_PUBLIC_AD_SLOT_*` alanlarına yaz.

## Gerçek domaine yayınlama

| Yol | Nasıl |
|-----|-------|
| **Vercel** (en kolay) | GitHub'a push → vercel.com'da import → domaini bağla. Otomatik SSL + CDN. |
| **Oracle VPS** (eldeki sunucu) | `npm run build && npm start` (port 3000), önüne nginx reverse-proxy + certbot SSL. |

`NEXT_PUBLIC_SITE_URL` değerini gerçek domaininle güncelle (sitemap/robots için).

## Yapı

```
src/
  app/
    page.tsx                      Ana sayfa (öne çıkan + kategori şeritleri)
    kategori/[slug]/page.tsx      Kategori listesi
    oyun/[id]/[slug]/page.tsx     Oyun oynatma sayfası (iframe + tam ekran)
    ara/page.tsx                  Arama sonuçları
    sitemap.ts / robots.ts        SEO
  components/                     Header, Footer, GameCard, GamePlayer, AdSlot...
  lib/games.ts                    GameMonetize feed + kategori eşleme + cache
```

## Mevcut özellikler

- **~6000 gerçek oyun** gömülü (`src/data/games.seed.json`) — feed kopunca bile site dolu.
- **Sonsuz kaydırma** — `/oyunlar` (IntersectionObserver, ağ isteği yok).
- **Favoriler + son oynananlar** — `/favorilerim` (localStorage, giriş gerekmez).
- **Profil + kozmetik mağaza** — `/profil`, `/magaza` (avatar/rozet/tema, sanal jeton).
  HTML5 Canvas aksiyon-survival oyunu. Skordan sanal jeton kazandırır.

## Giriş & ödeme — gerçek hesap sistemi nasıl eklenir?

Şu an profil/favori/jeton **cihazda (localStorage)** saklanır; gerçek giriş ve
gerçek-para satışı için backend gerekir. Yol haritası:

1. **Kimlik (login):** [NextAuth.js](https://authjs.dev) + bir veritabanı (Postgres/Supabase).
   Google/Discord/e-posta ile giriş. `localStorage` verisini ilk girişte hesaba taşı.



## Sırada ne var (öneriler)
- NextAuth + DB ile gerçek hesap.
- Stripe ile jeton paketi satışı.
- Daha fazla Originals oyunu (yarış / bulmaca).
- PWA (telefona ekle) — mobil reklam geliri yüksektir.
- İkinci feed kaynağı (GameDistribution) ile katalog genişletme.

## AI Development

Bu proje Claude Code ile geliştirilmektedir.

Claude çalışma kuralları:

CLAUDE.md

Proje durumu:

PROJECT_STATE.md

Yapılacaklar:

TODO.md

Değişiklik geçmişi:

CHANGELOG.md
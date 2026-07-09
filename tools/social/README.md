# OYNAVA Social Media Factory

Yeni eklenen (ve mevcut) her oyun için YouTube Shorts / TikTok / Instagram Reels'e
uygun dikey video + thumbnail + altyazı otomatik üretir.

## Çalıştırma

```
node tools/social/cli.mts                       # işlenmemiş tüm oyunları işler
node tools/social/cli.mts --limit 20             # sadece ilk 20 (deneme)
node tools/social/cli.mts --only ov-blokkraft     # tek oyun
node tools/social/cli.mts --force                 # ledger'ı yoksay, yeniden üret
node tools/social/cli.mts --concurrency 4          # config.json'daki değeri geçersiz kıl
```

`package.json` `.claude/DO_NOT_TOUCH.md` listesinde olduğu için `npm run social`
script'i eklenmedi — kullanıcı onayı bekliyor. Onaylanınca `package.json`'a
`"social": "node tools/social/cli.mts"` eklenmesi yeterli.

## Mimari (özet)

- **catalogSource.mts** — kataloğun gerçek kaynağı: commit'lenmiş seed JSON'lar
  (canlı feed'ler değil — bkz. dosya içi yorum).
- **providers/** — her sağlayıcı (Playgama/GameMonetize/GameDistribution/GamePix/
  Originals) aynı `MediaProvider` arayüzünü uygular. Yeni sağlayıcı = yeni dosya
  + `registry.mts`'e 1 satır.
- **media/selector.mts** — kademeli seçim (Preview>Trailer>Gameplay>Animated
  Thumbnail>GIF>Thumbnail) + duplicate-aware (aynı oyun birden çok sağlayıcıda
  varsa tek video üretilir).
- **media/cache.mts** — içerik-adresli medya önbelleği (aynı URL tekrar inmez).
- **video/** — ffmpeg tabanlı üretim hattı: şablon (kenburns/clip) + marka
  bindirme (branding.mts) + thumbnail seçimi (ffmpeg'in yerleşik `thumbnail`
  filtresi).
- **captions/** — kural tabanlı başlık/açıklama/hashtag üretimi + ücretsiz
  makine çevirisi (dosya önbellekli, Redis'e bağımlı değil).
- **ledger.mts + queue.mts** — kaldığı yerden devam + eşzamanlı işleme.
- **report.mts** — her çalıştırma sonunda JSON+Markdown rapor (medya
  bulunamayanlar ayrı bölümde listelenir).

## Önemli teknik notlar

- Araç Node 24'ün YERLEŞİK TypeScript desteğiyle (`.mts`, tip derleme adımı
  yok) çalışır — ts-node/tsx gibi yeni bir bağımlılık eklenmedi.
- ffmpeg her zaman proje köküne göre **göreli** yollarla (fontfile vb.)
  çağrılır (`cwd: projectRoot`) — Windows'ta mutlak yoldaki sürücü harfi
  (`C:\...`), drawtext'in filtre ayrıştırmasını bozup Türkçe karakterlerin
  (Ş/İ) render edilememesine yol açıyordu; bkz. `video/ffmpeg.mts` yorumu.
- Video sesi her zaman kapatılır (`-an`) — üçüncü taraf oyun sesi telif/
  tutarlılık riski taşır.
- `tools/social/output/` ve `tools/social/.cache/` gitignore'dadır (ağır
  binary, tekrar üretilebilir). `state/ledger.json` KASITLI commit'lenir.

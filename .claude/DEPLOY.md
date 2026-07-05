# OYNAVA — Yayına Alma Rehberi (Vercel + Hostinger domain)

Domain: **oynava.com** (Hostinger'da kayıtlı). Hosting: **Vercel** (ücretsiz).
Domain Hostinger'da kalır; sadece DNS'i Vercel'e yönlendiririz.

---

## 1) GitHub'a yükle (kod buluta gitsin)

1. https://github.com → ücretsiz hesap aç (varsa atla).
2. Yeni **boş** repo oluştur: `+ → New repository` → ad: `oynava` → **Private** seç →
   "Add README" vb. işaretleme (boş kalsın) → Create.
3. GitHub sana komutları gösterir. Bu projede (proje klasöründe terminal aç) şunları çalıştır:

```bash
git remote add origin https://github.com/KULLANICI_ADIN/oynava.git
git branch -M main
git push -u origin main
```

> İlk push'ta GitHub kullanıcı adı + şifre/token ister. Şifre yerine
> "Personal Access Token" gerekebilir (GitHub → Settings → Developer settings → Tokens).

---

## 2) Vercel'e bağla

1. https://vercel.com → **"Continue with GitHub"** ile ücretsiz giriş yap.
2. **Add New → Project** → `oynava` repo'sunu **Import** et.
3. Vercel Next.js'i otomatik tanır. **Environment Variables** bölümüne şunları ekle:

| Key | Value |
|-----|-------|
| `GAMEMONETIZE_FEED_URL` | `https://gamemonetize.com/feed.php?format=0&page=1` |
| `NEXT_PUBLIC_SITE_URL` | `https://oynava.com` |

(AdSense onayı gelince ileride `NEXT_PUBLIC_ADSENSE_CLIENT` ve slot'lar da eklenir.)

4. **Deploy**'a bas. Birkaç dakikada `https://oynava.vercel.app` adresinde canlı olur.

---

## 3) Domaini bağla (oynava.com)

### Vercel tarafı
- Proje → **Settings → Domains** → `oynava.com` ekle. Vercel sana DNS değerleri verir.

### Hostinger tarafı (DNS kayıtları)
Hostinger → **Domains → oynava.com → DNS / Nameservers → DNS Records**:

| Tür | Ad (Name) | Değer (Value) |
|-----|-----------|---------------|
| `A` | `@` | `76.76.21.21` (Vercel verir; ekrandakini kullan) |
| `CNAME` | `www` | `cname.vercel-dns.com` |

> Alternatif (en kolay): Vercel "Nameservers" yöntemini öneriyorsa, Hostinger'da
> domainin **nameserver**'larını Vercel'in verdiği ns1/ns2 ile değiştir. Tek seçeneği uygula.

DNS yayılması genelde birkaç dakika – birkaç saat sürer. Vercel SSL sertifikasını
**otomatik** kurar (https hazır gelir).

---

## 4) Yayın sonrası (gelir için)

1. **GameMonetize → Publisher → Add Website** → `oynava.com` ekle → onay bekle.
2. **GameDistribution → Publisher** → siteyi ekle.
3. **Google AdSense** (https://adsense.google.com) → `oynava.com` ekle → onay sürecini
   tamamla → `ca-pub-...` kimliğini ve slot'ları Vercel env'ine ekle, yeniden deploy.
4. **Payment settings** (GameMonetize): PayPal / USDT (ERC20) gir.

---

## Sonraki güncellemeler nasıl yayınlanır?
Kodda değişiklik → `git add -A && git commit -m "..." && git push` →
Vercel **otomatik** yeni sürümü yayına alır. Ekstra işlem yok.

---

## Alternatif: Oracle VPS'e kurulum (özet)
Vercel yerine kendi sunucunu (146.235.237.128) kullanmak istersen:
`npm run build && npm start` (port 3000) → önüne **nginx** reverse-proxy →
**certbot** ile SSL → Hostinger DNS `A` kaydını VPS IP'sine yönlendir →
süreklilik için **pm2** (`pm2 start npm --name oynava -- start`). İstersen bu kurulumu
SSH üzerinden birlikte yaparız.

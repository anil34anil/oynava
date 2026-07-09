/**
 * Marka bindirmesi (logo + oyun adı/kategori etiketi + son 3sn "Şimdi Oyna" kartı)
 * — tüm şablonlar (kenburns/clip) aynı fonksiyonu çağırır, böylece marka
 * görünümü şablondan bağımsız olarak tek yerden tutarlı kalır.
 *
 * ffmpeg drawtext kaçışı: metni tek tek karakterlerde `\` ile kaçırıyoruz
 * (tırnak içine almak yerine) — programatik üretimde ffmpeg'in resmi
 * dokümantasyonundaki "precede special char with backslash" yöntemi, tırnak
 * içi kaçıştan (iç içe tek tırnak sorunları) daha az kırılgan.
 */
import type { SocialConfig } from "../types.mts";

export function escDrawtext(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/:/g, "\\:")
    .replace(/%/g, "\\%")
    .replace(/,/g, "\\,")
    .replace(/'/g, "’")
    .replace(/\[/g, "(")
    .replace(/\]/g, ")");
}

/**
 * Windows'ta `fontfile='C:\Users\...\Sora.ttf'` gibi bir yol, ffmpeg'in filtre
 * ayrıştırıcısını bozar (ters eğik çizgi = kaçış karakteri, birden fazla tek
 * tırnaklı değer bir arada olunca sürücü harfi ':'siyle birleşip karışıyor —
 * pratikte Türkçe karakterlerin (Ş/İ) render edilememesi olarak ortaya çıktı).
 * Resmi çözüm: ters eğik çizgileri '/' yap, sürücü harfindeki ':' işaretini kaçır.
 */
export function ffmpegFontPath(p: string): string {
  return p.replace(/\\/g, "/").replace(/:/g, "\\:");
}

/**
 * Oyun adı çok değişken uzunlukta gelir ("Sprunki" vs "Sprunki World Online RP —
 * Play with Friends!"). ffmpeg'de metni önceden ölçüp gerçek genişliğini
 * öğrenmenin (iki geçişli render olmadan) yolu yok — bu yüzden karakter
 * sayısına göre YAKLAŞIK genişlik hesaplayıp fontsize'ı buna göre küçültüyoruz.
 * 52 karakterden uzun başlıklar "…" ile kısaltılır (en küçük punto boyutunda
 * bile taşmasın diye) — okunabilirlik netlikten önce gelir.
 */
const TITLE_MAX_CHARS = 52;
const TITLE_MAX_SIZE = 54;
const TITLE_MIN_SIZE = 30;
const CHAR_WIDTH_RATIO = 0.62; // Sora kalın büyük harf için ampirik genişlik/punto oranı

function fitTitle(rawTitle: string, maxWidthPx: number): { text: string; fontSize: number } {
  let text = rawTitle.toUpperCase();
  if (text.length > TITLE_MAX_CHARS) text = text.slice(0, TITLE_MAX_CHARS - 1).trimEnd() + "…";
  const idealSize = Math.floor(maxWidthPx / (text.length * CHAR_WIDTH_RATIO));
  const fontSize = Math.max(TITLE_MIN_SIZE, Math.min(TITLE_MAX_SIZE, idealSize));
  return { text, fontSize };
}

export type BrandingInput = {
  config: SocialConfig;
  gameTitle: string;
  categoryLabel: string;
  durationSec: number;
};

/**
 * `[base]` (1080x1920 marka öncesi video) + `[1:v]` (logo PNG input) alır,
 * `[branded]` çıktısını üretir. Pipeline bu filtre parçasını kendi
 * filter_complex'ine ekler.
 */
export function buildBrandingFilter({ config, gameTitle, categoryLabel, durationSec }: BrandingInput): string {
  const { brand, video } = config;
  const endStart = Math.max(0, durationSec - video.endCardSec);
  const titleMargin = 96; // sol+sağ toplam boşluk
  const { text: titleText, fontSize: titleSize } = fitTitle(gameTitle, video.width - titleMargin);
  const title = escDrawtext(titleText);
  const category = escDrawtext(categoryLabel);
  const endText = escDrawtext(video.endCardText);

  const parts: string[] = [];
  const displayFont = ffmpegFontPath(brand.fonts.display);
  const bodyFont = ffmpegFontPath(brand.fonts.body);

  // 1) Logo: sol üstte, sabit genişlik, tüm süre boyunca.
  parts.push(
    `[1:v]scale=${brand.logoScaleW}:-1[logo]`,
    `[base][logo]overlay=x=44:y=64:format=auto[withlogo]`,
  );

  // 2) Alt bilgi şeridi: oyun adı (uzunluğa göre otomatik küçültülür) + kategori.
  const pillY = video.height - 260;
  parts.push(
    `[withlogo]drawbox=x=0:y=${pillY}:w=${video.width}:h=140:color=${brand.colors.bg}@0.72:t=fill[pill]`,
    `[pill]drawtext=fontfile=${displayFont}:text='${title}':fontcolor=${brand.colors.ink}:fontsize=${titleSize}:borderw=2:bordercolor=${brand.colors.accent}:x=(w-text_w)/2:y=${pillY + 70 - Math.round(titleSize / 2)}[titled]`,
    `[titled]drawtext=fontfile=${bodyFont}:text='${category}':fontcolor=${brand.colors.accent2}:fontsize=32:x=(w-text_w)/2:y=${pillY + 92}[cat]`,
  );

  // 3) Son N saniye: EKRANI TAMAMEN KARARTAN, belirgin "buton" tasarımlı kapanış kartı.
  //    (ffmpeg resmi örneği tırnak içi virgülü kaçırmadan kullanır: enable='between(t,a,b)')
  const enable = `between(t,${endStart},${durationSec})`;
  const btnW = Math.round(video.width * 0.74);
  const btnH = 190;
  const btnY = video.height / 2 - 130;
  const domainY = btnY + btnH + 46;
  parts.push(
    // Tüm ekranı karart (sadece orta şerit değil) — neredeyse tam siyah, temiz bir kapanış kartı.
    `[cat]drawbox=x=0:y=0:w=${video.width}:h=${video.height}:color=${brand.colors.bg}@0.97:t=fill:enable='${enable}'[dark]`,
    // Dolu, parlak vurgu renginde "buton": koyu metin üzerinde yüksek kontrast.
    `[dark]drawbox=x=(w-${btnW})/2:y=${btnY}:w=${btnW}:h=${btnH}:color=${brand.colors.accent}:t=fill:enable='${enable}'[btn]`,
    `[btn]drawbox=x=(w-${btnW})/2:y=${btnY}:w=${btnW}:h=${btnH}:color=${brand.colors.ink}@0.9:t=6:enable='${enable}'[btnedge]`,
    `[btnedge]drawtext=fontfile=${displayFont}:text='${endText}':fontcolor=${brand.colors.bg}:fontsize=72:x=(w-text_w)/2:y=${btnY + btnH / 2 - 36}:enable='${enable}'[cta]`,
    `[cta]drawtext=fontfile=${bodyFont}:text='${escDrawtext(brand.url)}':fontcolor=${brand.colors.ink}:fontsize=46:x=(w-text_w)/2:y=${domainY}:enable='${enable}'[branded]`,
  );

  return parts.join(";");
}

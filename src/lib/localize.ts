import "server-only";
import { DEFAULT_LOCALE, type Locale } from "./i18n";
import { translateText } from "./translate";
import type { Game } from "./catalog";
import { trDescription, trInstructions } from "./tr";

/**
 * Sunucu render'ı için dil = TR (varsayılan).
 *
 * ⚠️ MALİYET KARARI (2026-06-26): Önceden `headers()` ile x-locale okuyorduk; bu,
 * içerik sayfalarını DİNAMİK yapıp her istekte origin→edge transferine yol açtı ve
 * Vercel "Fast Origin Transfer" limitini doldurdu. Artık sayfalar TR statik/ISR
 * render edilir (edge cache → origin transfer ~0). Diğer diller için ARAYÜZ çevirisi
 * istemcide (Sidebar/Header/AutoTrScope) yapılır; hreflang korunur. Sayfa GÖVDE
 * içeriği (oyun açıklaması vb.) tüm dillerde TR sunulur (SEO'da TR ana pazar önceliği).
 */
export function getLocale(): Locale {
  return DEFAULT_LOCALE;
}

/** Oyun açıklaması — tr: Türkçe şablon; en: İngilizce kaynak; diğer: İngilizce'den çeviri. */
export async function gameDescription(game: Game, locale: Locale): Promise<string> {
  if (locale === "tr") return trDescription(game);
  const base =
    (game.description || "").trim() ||
    `${game.title} is a fun, free online game you can play directly in your browser — no download, no install.`;
  if (locale === "en") return base;
  return translateText(base, locale, "en");
}

/**
 * Oyun talimatları — tr: sağlayıcıdan gelen serbest metni GERÇEK çeviriyle Türkçeye
 * çevirir (kalıp-eşleştirme değil; aksi halde "Move with Arrow Keys" gibi cümleler
 * yarı çevrilip yarı İngilizce kalabiliyordu). Çeviri hizmeti başarısız olursa
 * (nadir) kalıp-tabanlı trInstructions'a düşer. en: İngilizce kaynak; diğer: çeviri.
 */
export async function gameInstructions(game: Game, locale: Locale): Promise<string> {
  const raw = (game.instructions || "").trim();
  if (locale === "tr") {
    if (!raw) return trInstructions(raw);
    const translated = await translateText(raw, "tr", "en");
    return translated.trim() && translated !== raw ? translated : trInstructions(raw);
  }
  const base = raw || "Use your mouse or keyboard to play. Controls are shown in-game.";
  if (locale === "en") return base;
  return translateText(base, locale, "en");
}

/** Sayfa tanıtım metni gibi serbest cümleleri locale'e çevirir (tr/en olduğu gibi). */
export async function localizeText(textEn: string, locale: Locale): Promise<string> {
  if (locale === "tr" || locale === "en") return textEn;
  return translateText(textEn, locale, "en");
}

/** Oyun için SSS (FAQ) üretir — rich snippet + içerik derinliği. Locale'e çevrilir. */
export async function gameFaq(game: Game, locale: Locale): Promise<{ q: string; a: string }[]> {
  const title = game.title;
  const howTo = await gameInstructions(game, "tr");
  const tr: { q: string; a: string }[] = [
    { q: `${title} nasıl oynanır?`, a: howTo },
    { q: `${title} ücretsiz mi?`, a: `Evet, ${title} tamamen ücretsizdir. Üyelik veya ödeme gerekmez; sayfayı aç ve hemen oyna.` },
    { q: `${title} için indirme gerekiyor mu?`, a: `Hayır. ${title} bir HTML5 oyunudur ve doğrudan tarayıcında çalışır — indirme veya kurulum yoktur.` },
    { q: `${title} telefonda oynanır mı?`, a: `Evet, ${title} mobil tarayıcılarda (telefon ve tablet) da oynanabilir.` },
  ];
  if (locale === "tr") return tr;
  return Promise.all(
    tr.map(async (item) => ({
      q: await translateText(item.q, locale, "tr"),
      a: await translateText(item.a, locale, "tr"),
    })),
  );
}

/**
 * Çoklu dil (i18n) yapılandırması. Varsayılan Türkçe; diğer diller ülkeye göre
 * otomatik seçilir veya kullanıcı dil seçiciyle değiştirir.
 *
 * Arayüz metinleri statik sözlükten (UI) gelir; oyun başlık/açıklamaları gibi
 * dinamik içerik `translate.ts` ile (ücretsiz + Redis önbellekli) çevrilir.
 */

export const DEFAULT_LOCALE = "tr" as const;

// Sitenin gösterildiği ülkelere göre diller (Search Console listesinden).
export const LOCALES = [
  { code: "tr", name: "Türkçe", flag: "🇹🇷", dir: "ltr" },
  { code: "en", name: "English", flag: "🇬🇧", dir: "ltr" },
  { code: "nl", name: "Nederlands", flag: "🇳🇱", dir: "ltr" },
  { code: "es", name: "Español", flag: "🇪🇸", dir: "ltr" },
  { code: "ko", name: "한국어", flag: "🇰🇷", dir: "ltr" },
  { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩", dir: "ltr" },
  { code: "az", name: "Azərbaycan", flag: "🇦🇿", dir: "ltr" },
  { code: "ar", name: "العربية", flag: "🇪🇬", dir: "rtl" },
] as const;

export type Locale = (typeof LOCALES)[number]["code"];

export const LOCALE_CODES = LOCALES.map((l) => l.code) as Locale[];

export function isLocale(x: string | undefined | null): x is Locale {
  return !!x && (LOCALE_CODES as string[]).includes(x);
}

export function localeMeta(code: string) {
  return LOCALES.find((l) => l.code === code) ?? LOCALES[0];
}

export function localeDir(code: string): "ltr" | "rtl" {
  return localeMeta(code).dir as "ltr" | "rtl";
}

// Ülke (ISO-2) → dil eşlemesi (otomatik yönlendirme için).
export const COUNTRY_LOCALE: Record<string, Locale> = {
  TR: "tr", NL: "nl", ES: "es", CO: "es", KR: "ko", ID: "id",
  AZ: "az", EG: "ar", GB: "en", IN: "en", PH: "en", US: "en",
};

/** Arayüz (statik) metinleri. Eksik anahtar/dil İngilizce'ye, o da yoksa anahtara düşer. */
export const UI: Record<string, Record<string, string>> = {
  en: {
    "nav.online": "Online Games",
    "nav.fps": "FPS / Shooter",
    "nav.premium": "Premium Games",
    "nav.all": "All Games",
    "nav.blog": "Blog",
    "nav.favorites": "Favorites",
    "nav.categories": "Categories",
    "home.popular": "Popular Games",
    "common.playNow": "Play",
    "common.seeAll": "See all",
    "common.search": "Search games... (e.g. racing, football, zombie)",
    "common.login": "Sign in",
    "action.like": "Like",
    "action.dislike": "Dislike",
    "action.favorite": "Favorite",
    "action.share": "Share",
    "action.fullscreen": "Fullscreen",
  },
  tr: {
    "nav.online": "Online Oyunlar",
    "nav.fps": "FPS / Nişancı",
    "nav.premium": "Premium Oyunlar",
    "nav.all": "Tüm Oyunlar",
    "nav.blog": "Blog",
    "nav.favorites": "Favorilerim",
    "nav.categories": "Kategoriler",
    "home.popular": "Popüler Oyunlar",
    "common.playNow": "Oyna",
    "common.seeAll": "Tümünü gör",
    "common.search": "Oyun ara... (örn. yarış, futbol, zombi)",
    "common.login": "Giriş yap",
    "action.like": "Beğen",
    "action.dislike": "Beğenme",
    "action.favorite": "Favori",
    "action.share": "Paylaş",
    "action.fullscreen": "Tam Ekran",
  },
};

/** Statik arayüz metni getir. */
export function t(locale: string, key: string): string {
  return UI[locale]?.[key] ?? UI.en[key] ?? UI.tr[key] ?? key;
}

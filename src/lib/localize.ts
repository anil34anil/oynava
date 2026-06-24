import "server-only";
import { headers } from "next/headers";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./i18n";
import { translateText } from "./translate";
import type { Game } from "./catalog";
import { trDescription, trInstructions } from "./tr";

/** Geçerli dili istek başlığından (middleware'in eklediği x-locale) okur. */
export function getLocale(): Locale {
  const h = headers().get("x-locale");
  return isLocale(h) ? h : DEFAULT_LOCALE;
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

/** Oyun talimatları — tr: Türkçe; en: İngilizce kaynak; diğer: çeviri. */
export async function gameInstructions(game: Game, locale: Locale): Promise<string> {
  if (locale === "tr") return trInstructions(game.instructions);
  const base = (game.instructions || "").trim() || "Use your mouse or keyboard to play. Controls are shown in-game.";
  if (locale === "en") return base;
  return translateText(base, locale, "en");
}

/** Sayfa tanıtım metni gibi serbest cümleleri locale'e çevirir (tr/en olduğu gibi). */
export async function localizeText(textEn: string, locale: Locale): Promise<string> {
  if (locale === "tr" || locale === "en") return textEn;
  return translateText(textEn, locale, "en");
}

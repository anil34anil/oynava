import type { Metadata } from "next";
import { SITE } from "./site";
import { LOCALE_CODES, DEFAULT_LOCALE, localePath } from "./i18n";

/**
 * Çok dilli SEO: bir yol için canonical + hreflang alternatifleri üretir.
 * `/en /es /ar` vb. yayında olduğu için Google'a dil eşlemesini bildirmek ŞART
 * (yoksa yinelenen içerik). `x-default` Türkçe köke işaret eder.
 */
export function seoAlternates(path: string): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const code of LOCALE_CODES) {
    languages[code] = `${SITE.url}${localePath(path, code)}`;
  }
  languages["x-default"] = `${SITE.url}${path}`;
  return {
    canonical: `${SITE.url}${path}`,
    languages,
  };
}

/** Sitemap girişleri için dil alternatifleri (hreflang). */
export function sitemapLanguages(path: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const code of LOCALE_CODES) {
    if (code === DEFAULT_LOCALE) continue;
    out[code] = `${SITE.url}${localePath(path, code)}`;
  }
  return out;
}

import type { Metadata } from "next";
import { SITE } from "./site";

/**
 * SEO alternates — SADECE canonical (TR).
 *
 * ⚠️ hreflang KALDIRILDI (2026-07-03): i18n Aşama-2 (server içerik çevirisi) maliyet için geri
 * alındığından TÜM diller aynı TR içeriği sunuyor. Google'a "8 dil versiyonu var" demek (hreflang)
 * yanıltıcıydı + her sayfa için 8× yinelenen URL keşfettirip crawl bütçesini kopyalara harcatıyordu
 * (GSC: 213 "alternatif canonical" + 69 "yinelenen"). Artık yalnız kanonik TR URL bildirilir;
 * /en /es önekleri kullanıcı için çalışır ama Google'a ayrı indekslenecek sayfa olarak sunulmaz.
 */
export function seoAlternates(path: string): Metadata["alternates"] {
  return { canonical: `${SITE.url}${path}` };
}

/** Sitemap hreflang alternatifleri — artık boş (tüm diller aynı TR içeriği, hreflang kaldırıldı). */
export function sitemapLanguages(_path: string): Record<string, string> {
  return {};
}

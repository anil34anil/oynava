/**
 * Platforma göre hashtag listesi üretir: marka > kategori > jenerik sırasıyla
 * doldurur, tekrarları eler, konfigürasyondaki üst sınıra kadar keser.
 */
import type { SocialConfig } from "../types.mts";

export function buildHashtags(config: SocialConfig, categorySlug: string, max: number): string[] {
  const pool = [
    ...config.captions.brandHashtags,
    ...(config.captions.categoryHashtags[categorySlug] ?? []),
    ...config.captions.genericHashtags,
  ];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const tag of pool) {
    const key = tag.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(tag);
    if (out.length >= max) break;
  }
  return out;
}

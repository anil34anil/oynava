/**
 * Platform başına başlık/açıklama/hashtag üretir. Kural tabanlı (dış bir yapay
 * zeka/metin API'sine bağımlı değil) — deterministik, ücretsiz, denetlenebilir
 * ve site zaten Türkçe odaklı olduğu için Türkçe metin üretir.
 */
import { CATEGORIES } from "../../../src/lib/catalog.ts";
import { buildHashtags } from "./hashtags.mts";
import { translateCached } from "./translate.mts";
import type { CaptionSet, SocialConfig } from "../types.mts";
import type { CatalogGame } from "../catalogSource.mts";

const ENTITIES: Record<string, string> = {
  "&mdash;": "—", "&ndash;": "–", "&rsquo;": "’", "&lsquo;": "‘",
  "&rdquo;": "”", "&ldquo;": "“", "&amp;": "&", "&bull;": "•",
  "&hellip;": "…", "&nbsp;": " ", "&quot;": '"', "&#39;": "’",
};

function cleanText(s: string): string {
  let out = s || "";
  for (const [ent, ch] of Object.entries(ENTITIES)) out = out.split(ent).join(ch);
  return out.replace(/\s+/g, " ").trim();
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + "…";
}

function firstSentences(text: string, count: number): string {
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  return sentences.slice(0, count).join(" ");
}

function tagLine(tags: string[]): string {
  return tags.join(" ");
}

export async function generateCaptions(game: CatalogGame, config: SocialConfig): Promise<CaptionSet> {
  const categoryTr = CATEGORIES.find((c) => c.slug === game.categorySlug)?.tr ?? game.category;
  // Oyun açıklamaları sağlayıcıdan İngilizce gelir; site Türkçe odaklı olduğu
  // için altyazılar da Türkçeye çevrilir (translate.mts — src/lib/translate.ts
  // ile aynı ücretsiz uç nokta, ayrı dosya önbelleğiyle). Çeviri başarısız
  // olursa orijinal İngilizce metne düşer (site asla çökmez).
  const rawDesc = cleanText(game.description);
  const desc = await translateCached(rawDesc, "tr", "en", config.cacheDir);
  const link = `${config.brand.url}/oyun/${game.id}`;

  const ytTags = buildHashtags(config, game.categorySlug, config.captions.maxHashtagsYoutube);
  const ttTags = buildHashtags(config, game.categorySlug, config.captions.maxHashtagsTiktok);
  const igTags = buildHashtags(config, game.categorySlug, config.captions.maxHashtagsInstagram);

  const youtubeTitle = truncate(
    `${game.title} — Ücretsiz ${categoryTr} Oyunu 🎮 | ${config.brand.name}`,
    config.captions.youtubeTitleMax,
  );
  const youtubeDescBody =
    firstSentences(desc, 3) || `${game.title}, tarayıcında ücretsiz oynayabileceğin bir ${categoryTr.toLowerCase()} oyunu.`;
  const youtubeDescription = truncate(
    `${youtubeDescBody}\n\n▶ Hemen ücretsiz oyna: ${link}\n\n${tagLine(ytTags)}`,
    config.captions.youtubeDescMax,
  );

  const tiktokDescription = truncate(`${game.title} 🔥 ${tagLine(ttTags)}`, config.captions.tiktokDescMax);

  const igBody = firstSentences(desc, 2) || `${game.title} şimdi ${config.brand.name}'da ücretsiz!`;
  const instagramDescription = truncate(
    `${igBody}\n\n🔗 Bio'daki linkten ücretsiz oyna\n\n${tagLine(igTags)}`,
    config.captions.instagramDescMax,
  );

  return {
    youtube: { title: youtubeTitle, description: youtubeDescription, hashtags: ytTags },
    tiktok: { description: tiktokDescription, hashtags: ttTags },
    instagram: { description: instagramDescription, hashtags: igTags },
  };
}

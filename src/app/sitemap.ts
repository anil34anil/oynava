import type { MetadataRoute } from "next";
import { getGames, CATEGORIES, slugifyTitle } from "@/lib/games";
import { POSTS } from "@/lib/blog";
import { COLLECTIONS } from "@/lib/collections";
import { topTags, MIN_TAG_GAMES } from "@/lib/tags";
import { sitemapLanguages } from "@/lib/seo";
import { SITE } from "@/lib/site";

const BASE = SITE.url;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const games = await getGames();

  // Oyunlar (kanonik TR; hreflang sayfa <head>'inde de bildiriliyor)
  const gameUrls = games.map((g) => ({
    url: `${BASE}/oyun/${g.id}/${slugifyTitle(g.title)}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Kategoriler — dil alternatifleriyle (hreflang)
  const catUrls = CATEGORIES.map((c) => ({
    url: `${BASE}/kategori/${c.slug}`,
    changeFrequency: "daily" as const,
    priority: 0.8,
    alternates: { languages: sitemapLanguages(`/kategori/${c.slug}`) },
  }));

  // Programmatic SEO koleksiyonları — yüksek öncelik + hreflang
  const collectionUrls = COLLECTIONS.map((c) => ({
    url: `${BASE}/${c.slug}`,
    changeFrequency: "daily" as const,
    priority: 0.9,
    alternates: { languages: sitemapLanguages(`/${c.slug}`) },
  }));

  const blogUrls = POSTS.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Etiket landing sayfaları (programatik long-tail SEO) — yalnız SEO-değerli olanlar
  const tagUrls = topTags(games, MIN_TAG_GAMES, 400).map((tg) => ({
    url: `${BASE}/etiket/${tg.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const staticPaths = ["/oyunlar", "/online", "/fps", "/premium", "/etiketler", "/blog", "/sss", "/kunye", "/isbirlikleri", "/yas-degerlendirmesi", "/veri-koruma", "/hesap-sil", "/erisilebilirlik"];
  const staticUrls = staticPaths.map((p) => ({
    url: `${BASE}${p}`,
    changeFrequency: "monthly" as const,
    priority: 0.5,
    alternates: { languages: sitemapLanguages(p) },
  }));

  return [
    { url: BASE, changeFrequency: "daily", priority: 1, alternates: { languages: sitemapLanguages("/") } },
    ...collectionUrls,
    ...catUrls,
    ...tagUrls,
    ...staticUrls,
    ...blogUrls,
    ...gameUrls,
  ];
}

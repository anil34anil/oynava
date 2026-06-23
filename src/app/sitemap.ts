import type { MetadataRoute } from "next";
import { getGames, categorySlug, CATEGORIES, slugifyTitle } from "@/lib/games";
import { POSTS } from "@/lib/blog";
import { SITE } from "@/lib/site";

const BASE = SITE.url;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const games = await getGames();

  const gameUrls = games.map((g) => ({
    url: `${BASE}/oyun/${g.id}/${slugifyTitle(g.title)}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const catUrls = CATEGORIES.map((c) => ({
    url: `${BASE}/kategori/${c.slug}`,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const blogUrls = POSTS.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const staticUrls = ["/oyunlar", "/online", "/fps", "/premium", "/blog", "/sss", "/kunye", "/isbirlikleri", "/yas-degerlendirmesi", "/veri-koruma", "/erisilebilirlik"].map(
    (p) => ({ url: `${BASE}${p}`, changeFrequency: "monthly" as const, priority: 0.5 }),
  );

  return [
    { url: BASE, changeFrequency: "daily", priority: 1 },
    ...staticUrls,
    ...catUrls,
    ...blogUrls,
    ...gameUrls,
  ];
}

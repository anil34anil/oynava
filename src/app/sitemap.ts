import type { MetadataRoute } from "next";
import { getGames, categorySlug, CATEGORIES, slugifyTitle } from "@/lib/games";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

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

  return [
    { url: BASE, changeFrequency: "daily", priority: 1 },
    ...catUrls,
    ...gameUrls,
  ];
}

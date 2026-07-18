import type { MetadataRoute } from "next";
import { getGames, CATEGORIES, slugifyTitle } from "@/lib/games";
import { POSTS } from "@/lib/blog";
import { COLLECTIONS } from "@/lib/collections";
import { topTags, MIN_TAG_GAMES } from "@/lib/tags";
import { sitemapLanguages } from "@/lib/seo";
import { SITE } from "@/lib/site";

const BASE = SITE.url;

// Kategori/koleksiyon sayfalarının içeriği (özgün metin + "İlgili Rehberler" iç
// linkleri) bu tarihte güncellendi. SABİT bir tarih — her build'de "şimdi"ye
// çekilmez; Google build zamanına göre her zaman değişen lastmod'u güvenilmez
// sayıp yok sayar, bu yüzden yalnız gerçek içerik değiştiğinde elle güncellenir.
const CONTENT_UPDATED = new Date("2026-07-12");

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
    lastModified: CONTENT_UPDATED,
    changeFrequency: "daily" as const,
    priority: 0.8,
    alternates: { languages: sitemapLanguages(`/kategori/${c.slug}`) },
  }));

  // Programmatic SEO koleksiyonları — yüksek öncelik + hreflang
  const collectionUrls = COLLECTIONS.map((c) => ({
    url: `${BASE}/${c.slug}`,
    lastModified: CONTENT_UPDATED,
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

  const staticPaths = ["/oyunlar", "/online", "/fps", "/premium", "/koleksiyonlar", "/etiketler", "/blog", "/sss", "/kunye", "/isbirlikleri", "/yas-degerlendirmesi", "/veri-koruma", "/hesap-sil", "/erisilebilirlik"];
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

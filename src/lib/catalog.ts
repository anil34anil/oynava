/**
 * Saf (veri içermeyen) katalog yardımcıları.
 * Hem server hem client tarafında güvenle import edilir — ağır seed JSON
 * burada DEĞİLDİR, böylece client paketi hafif kalır.
 */

export type Game = {
  id: string;
  title: string;
  description: string;
  instructions: string;
  url: string;
  category: string;
  tags: string;
  thumb: string;
  width: string;
  height: string;
};

// İngilizce kategori -> Türkçe + slug eşlemesi
export const CATEGORIES: { slug: string; tr: string; match: string[] }[] = [
  { slug: "aksiyon", tr: "Aksiyon", match: ["action", "shooter", "shooting"] },
  { slug: "macera", tr: "Macera", match: ["adventure"] },
  { slug: "yaris", tr: "Yarış", match: ["racing", "driving", "car"] },
  { slug: "spor", tr: "Spor", match: ["sports", "soccer", "football", "basketball"] },
  { slug: "dovus", tr: "Dövüş", match: ["fighting", "boxing"] },
  { slug: "bulmaca", tr: "Bulmaca", match: ["puzzle", "match 3", "match3", "match-3", "merge", "bubble", "mahjong"] },
  { slug: "zeka", tr: "Zekâ & Strateji", match: ["strategy", "board", "logic"] },
  { slug: "io", tr: ".io Oyunları", match: [".io", "io games", "multiplayer"] },
  { slug: "kiz", tr: "Kız Oyunları", match: ["girls", "dress up", "makeup", "cooking"] },
  { slug: "cocuk", tr: "Çocuk", match: ["kids", "educational", "baby"] },
  { slug: "arcade", tr: "Arcade", match: ["arcade", "casual", "hypercasual", "clicker"] },
  { slug: "3d", tr: "3D Oyunlar", match: ["3d"] },
];

export function categorySlug(game: Game): string {
  const hay = `${game.category} ${game.tags}`.toLowerCase();
  for (const c of CATEGORIES) {
    if (c.match.some((m) => hay.includes(m))) return c.slug;
  }
  return "arcade";
}

export function categoryBySlug(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[ığüşöç]/g, (m) => ({ ı: "i", ğ: "g", ü: "u", ş: "s", ö: "o", ç: "c" }[m] ?? m))
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

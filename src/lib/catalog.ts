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
  /** Sağlayıcının resmi gameplay önizleme klibi (varsa) — reklamsız, hover'da oynatılır. */
  previewVideo?: string;
  /** Yakın zamanda kataloğa eklendi (statik, kaynak veriden gelir). */
  isNew?: boolean;
  /** Gerçek oynanma sayısına göre en popüler oyunlardan biri (sunucuda hesaplanır). */
  hot?: boolean;
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

// GERÇEK online (çok oyunculu) tespiti. Gevşek tek-kelime "online/multiplayer"
// ETİKETLERİNE güvenmiyoruz (sağlayıcılar tek kişilik oyunlara da koyuyor); bunun
// yerine başlık + KATEGORİ + AÇIKLAMA metnini güçlü ifadelerle analiz ediyoruz.
const ONLINE_TITLE_RE = /\.io\b|\bmmo\b|battle\s?royale/i;
const ONLINE_CAT_RE = /^\s*\.?io( games)?\s*$/i;
// Açıklama/talimattaki güçlü online ifadeleri:
const ONLINE_TEXT_RE =
  /\bmmo\b|massively multiplayer|battle\s?royale|online multiplayer|real-?time multiplayer|multiplayer\s+(fps|shooter|shooting|game)|(pvp|player\s?vs\s?player)\s+(multiplayer|online|battle|game)|(multiplayer|online)\s+pvp|other players online|players online|online\s+(pvp|battle|arena|shooter|fps)|\bmatchmaking\b|ranked\s+(match|mode)/i;
// Yerel (aynı cihaz) çok oyunculuyu online sayma:
const LOCAL_ONLY_RE = /same (device|computer|keyboard|screen|pc)|on one device|local multiplayer|hot-?seat/i;

/** Oyun GERÇEKTEN online/çok oyunculu mu? (başlık + kategori + açıklama analizi) */
export function isOnline(game: Game): boolean {
  if (ONLINE_TITLE_RE.test(game.title) || ONLINE_CAT_RE.test(game.category || "")) return true;
  const text = `${game.description || ""} ${game.instructions || ""} ${game.title}`;
  if (!ONLINE_TEXT_RE.test(text)) return false;
  // "aynı cihazda" gibi yerel ifade varsa ve online ipucu yoksa, online sayma
  if (LOCAL_ONLY_RE.test(text) && !/online|\.io|battle\s?royale/i.test(text)) return false;
  return true;
}

// FPS / Nişancı alt-bölümü — Blast Buddies tarzı blocky/3D online nişancılar dahil.
// Başlık + kategori + etiket + açıklamayı nişancı ifadeleriyle tarar.
const FPS_RE =
  /\bfps\b|first[-\s]?person|third[-\s]?person shooter|shooter|shooting|sniper|battle\s?royale|pixel\s?gun|blocky\s?combat|counter[-\s]?(strike|craft)|gun\s?(game|fight)|deathmatch|\bwarfare\b/i;
const FPS_TEXT_RE =
  /first[-\s]?person shooter|\bfps\b|battle\s?royale|aim (and|&) shoot|shooter game|shoot(ing)? (enemies|opponents|players)/i;

/** Oyun bir nişancı/FPS oyunu mu? (başlık + kategori + etiket + açıklama analizi) */
export function isFpsShooter(game: Game): boolean {
  if (FPS_RE.test(`${game.title} ${game.category} ${game.tags}`)) return true;
  return FPS_TEXT_RE.test(`${game.description || ""} ${game.instructions || ""}`);
}

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[ığüşöç]/g, (m) => ({ ı: "i", ğ: "g", ü: "u", ş: "s", ö: "o", ç: "c" }[m] ?? m))
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

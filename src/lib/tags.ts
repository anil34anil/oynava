/**
 * Etiket (tag) indeksi — programatik long-tail SEO.
 * Her anlamlı etiket için /etiket/[slug] landing sayfası üretilir.
 * Veri içermez; getGames() çıktısı üstünde çalışır (modül seviyesinde memo'lanır).
 */
import { Game, slugifyTitle } from "@/lib/catalog";

export type TagInfo = { slug: string; label: string; count: number };

// İnce/çöp/çok genel etiketleri ele (kategori zaten kapsıyor ya da SEO değeri yok).
const STOP_TAGS = new Set([
  "html5", "html", "html5 games", "game", "games", "free", "free games", "online",
  "online games", "mobile", "mobile games", "webgl", "unity", "2d", "3d", "fun",
  "y8", "kizi", "gamemonetize", "game distribution", "gamedistribution", "new",
  "new games", "best", "popular", "play", "io", "browser", "web", "casual game",
]);

// SEO-değerli etiket eşiği: en az bu kadar oyunu olan etiketler indekslenir/sitemap'e girer.
export const MIN_TAG_GAMES = 6;

function tagSlug(tag: string): string {
  return slugifyTitle(tag.trim());
}

function titleCase(s: string): string {
  return s
    .trim()
    .split(/\s+/)
    .map((w) => (w ? w[0].toLocaleUpperCase("tr") + w.slice(1) : w))
    .join(" ");
}

export function gameTags(game: Game): string[] {
  return game.tags.split(",").map((t) => t.trim()).filter(Boolean);
}

// ── Modül seviyesi memo (getGames sabit referans döndürdüğü için tekrar kurmaz) ──
type Idx = Map<string, { label: string; games: Game[] }>;
let _cache: { games: Game[]; idx: Idx } | null = null;

function buildIndex(games: Game[]): Idx {
  const map: Idx = new Map();
  for (const g of games) {
    const seen = new Set<string>();
    for (const raw of gameTags(g)) {
      const low = raw.toLowerCase();
      if (STOP_TAGS.has(low)) continue;
      const slug = tagSlug(raw);
      if (!slug || slug.length < 3 || seen.has(slug)) continue;
      seen.add(slug);
      const entry = map.get(slug);
      if (entry) entry.games.push(g);
      else map.set(slug, { label: raw, games: [g] });
    }
  }
  return map;
}

function index(games: Game[]): Idx {
  if (_cache && _cache.games === games) return _cache.idx;
  const idx = buildIndex(games);
  _cache = { games, idx };
  return idx;
}

/** SEO-değerli etiketler (>= MIN_TAG_GAMES), oyun sayısına göre azalan. */
export function topTags(games: Game[], min = MIN_TAG_GAMES, limit = 400): TagInfo[] {
  const idx = index(games);
  const out: TagInfo[] = [];
  for (const [slug, v] of idx) {
    if (v.games.length >= min) out.push({ slug, label: titleCase(v.label), count: v.games.length });
  }
  return out.sort((a, b) => b.count - a.count).slice(0, limit);
}

/** Bir etikete ait oyunlar + etiket adı. Yoksa null. */
export function tagBySlug(games: Game[], slug: string): { label: string; games: Game[] } | null {
  const v = index(games).get(slug);
  if (!v) return null;
  return { label: titleCase(v.label), games: v.games };
}

/** Bir oyunun etiketlerini /etiket/[slug] bağlantısı için (slug+label) döndürür. */
export function gameTagLinks(game: Game, limit = 12): { slug: string; label: string }[] {
  const out: { slug: string; label: string }[] = [];
  const seen = new Set<string>();
  for (const raw of gameTags(game)) {
    if (STOP_TAGS.has(raw.toLowerCase())) continue;
    const slug = tagSlug(raw);
    if (!slug || slug.length < 3 || seen.has(slug)) continue;
    seen.add(slug);
    out.push({ slug, label: titleCase(raw) });
    if (out.length >= limit) break;
  }
  return out;
}

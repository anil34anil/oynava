/**
 * GameMonetize feed entegrasyonu + veri erişimi (SADECE server tarafı).
 * Ağır seed JSON burada import edilir; bu modülü client component'lerde KULLANMA.
 * Tip/slug/kategori gibi saf yardımcılar için "@/lib/catalog" kullan.
 *
 * Feed JSON formatı (her oyun): { id, title, description, instructions, url,
 *   category, tags, thumb, width, height }. Doküman: https://gamemonetize.com/
 */

import seed from "@/data/games.seed.json";
import gdSeed from "@/data/games.gd.seed.json";
import gpSeed from "@/data/games.gp.seed.json";
import { Game, categorySlug } from "./catalog";
import { searchTerms, normalizeTr } from "./tr";

export type { Game } from "./catalog";
export {
  CATEGORIES,
  categorySlug,
  categoryBySlug,
  slugifyTitle,
} from "./catalog";

const FEED_URL =
  process.env.GAMEMONETIZE_FEED_URL ??
  "https://gamemonetize.com/feed.php?format=0&num=1500";

// GameDistribution canlı feed (sayfalı). Tek sayfa = 100 oyun.
const GD_FEED = "https://catalog.api.gamedistribution.com/api/v1.0/rss/All/?format=json&amount=100";

// GamePix canlı feed (sayfalı, kaliteli/3D oyunlar). sid = Oynava yayıncı kimliği (gelir buna yazılır).
const GAMEPIX_SID = process.env.GAMEPIX_SID ?? "92818";
const GP_FEED = `https://feeds.gamepix.com/v2/json?sid=${GAMEPIX_SID}&pagination=48`;

// Üç kaynaktan gömülü gerçek katalog (feed kopsa bile site dolu kalır)
const GD_SEED = (gdSeed as Game[]).filter((g) => g.id && g.url);
const GP_SEED = applySid((gpSeed as Game[]).filter((g) => g.id && g.url));
const SEED = mergeUnique([
  ...(seed as Game[]).filter((g) => g.id && g.url),
  ...GD_SEED,
  ...GP_SEED,
]);

/** GamePix embed url'lerindeki sid'i kendi yayıncı sid'inle değiştirir (gelir için). */
function applySid(list: Game[]): Game[] {
  if (!GAMEPIX_SID) return list;
  return list.map((g) =>
    g.id.startsWith("gp-") ? { ...g, url: g.url.replace(/([?&]sid=)[^&]*/, `$1${GAMEPIX_SID}`) } : g,
  );
}

/** id'ye göre tekilleştirerek birleştirir (ilk gelen kazanır). */
function mergeUnique(lists: Game[]): Game[] {
  const map = new Map<string, Game>();
  for (const g of lists) if (!map.has(g.id)) map.set(g.id, g);
  return [...map.values()];
}

/** GameDistribution: birkaç sayfayı canlı çek, normalize et. Hata olursa boş döner. */
async function fetchGameDistribution(pages = 3): Promise<Game[]> {
  const out: Game[] = [];
  for (let p = 1; p <= pages; p++) {
    try {
      const r = await fetch(`${GD_FEED}&page=${p}`, {
        headers: { "User-Agent": "OyunPortali/1.0" },
        next: { revalidate: 3600 },
      });
      if (!r.ok) break;
      const arr = (await r.json()) as any[];
      if (!Array.isArray(arr) || arr.length === 0) break;
      for (const g of arr) {
        if (!g?.Md5 || !g?.Url) continue;
        out.push({
          id: "gd-" + g.Md5,
          title: (g.Title || "").trim(),
          description: g.Description || "",
          instructions: g.Instructions || "",
          url: g.Url,
          category: Array.isArray(g.Category) ? g.Category[0] || "Arcade" : g.Category || "Arcade",
          tags: Array.isArray(g.Tag) ? g.Tag.join(", ") : g.Tag || "",
          thumb: Array.isArray(g.Asset) ? g.Asset.find((a: string) => /512x384/.test(a)) || g.Asset[0] : g.Asset,
          width: String(g.Width || 800),
          height: String(g.Height || 600),
        });
      }
    } catch {
      break;
    }
  }
  return out;
}

/** GamePix: birkaç sayfayı canlı çek, normalize et (kaliteli/3D oyunlar). */
async function fetchGamePix(pages = 4): Promise<Game[]> {
  const out: Game[] = [];
  for (let p = 1; p <= pages; p++) {
    try {
      const r = await fetch(`${GP_FEED}&page=${p}`, {
        headers: { "User-Agent": "OyunPortali/1.0" },
        next: { revalidate: 3600 },
      });
      if (!r.ok) break;
      const d = (await r.json()) as any;
      const items: any[] = d?.items ?? [];
      if (items.length === 0) break;
      for (const g of items) {
        if (!g?.id || !g?.url) continue;
        out.push({
          id: "gp-" + g.id,
          title: (g.title || "").trim(),
          description: g.description || "",
          instructions: "",
          url: g.url,
          category: g.category || "Arcade",
          tags: `${g.category || ""}, premium`,
          thumb: g.banner_image || g.image,
          width: String(g.width || 800),
          height: String(g.height || 600),
        });
      }
    } catch {
      break;
    }
  }
  return applySid(out);
}

let _cache: { at: number; games: Game[] } | null = null;
const MEM_TTL = 1000 * 60 * 10; // 10 dk bellek-içi cache

/** Feed'i çeker; rate-limit (429) durumunda 1 kez bekleyip tekrar dener. */
async function fetchFeed(): Promise<Game[]> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetch(FEED_URL, {
      headers: { "User-Agent": "OyunPortali/1.0" },
      next: { revalidate: 3600 }, // Next.js ISR: saatte bir tazele
    });
    if (res.ok) {
      const data = (await res.json()) as Game[];
      const games = Array.isArray(data) ? data.filter((g) => g.id && g.url) : [];
      if (games.length > 0) return games;
    }
    if (res.status === 429 && attempt === 0) {
      await new Promise((r) => setTimeout(r, 1500)); // kısa backoff
      continue;
    }
    throw new Error(`Feed ${res.status}`);
  }
  throw new Error("Feed tekrar denemede de başarısız");
}

/**
 * Üç kaynağı (GameMonetize + GameDistribution + GamePix) paralel çeker, birleştirir.
 * Kaynaklar koparsa gömülü birleşik kataloğa (SEED) düşer → site asla boş kalmaz.
 */
export async function getGames(): Promise<Game[]> {
  if (_cache && Date.now() - _cache.at < MEM_TTL) return _cache.games;

  const [gm, gd, gp] = await Promise.allSettled([
    fetchFeed(),
    fetchGameDistribution(),
    fetchGamePix(),
  ]);

  const gmGames = gm.status === "fulfilled" ? gm.value : [];
  const gdGames = gd.status === "fulfilled" ? gd.value : [];
  const gpGames = gp.status === "fulfilled" ? gp.value : [];

  // Canlı veriyi HER ZAMAN gömülü seed ile birleştir: taze kayıtlar öne gelir,
  // seed boşlukları doldurur → katalog asla seed sayısının altına düşmez.
  const games = mergeUnique([...gmGames, ...gdGames, ...gpGames, ...SEED]);

  _cache = { at: Date.now(), games };
  return games;
}

export async function getGameById(id: string): Promise<Game | null> {
  const games = await getGames();
  return games.find((g) => g.id === id) ?? null;
}

export async function getByCategory(slug: string): Promise<Game[]> {
  const games = await getGames();
  return games.filter((g) => categorySlug(g) === slug);
}

export async function searchGames(q: string): Promise<Game[]> {
  // Türkçe terimi İngilizce karşılıklarıyla genişlet + Türkçe karakter normalizasyonu.
  const terms = searchTerms(q);
  if (terms.length === 0) return [];
  const games = await getGames();
  return games.filter((g) => {
    const hay = normalizeTr(`${g.title} ${g.tags} ${g.category}`);
    return terms.some((t) => hay.includes(t));
  });
}

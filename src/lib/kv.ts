/**
 * Paylaşılan (tüm ziyaretçiler ortak) beğeni/beğenmeme sayacı — Redis (node-redis).
 *
 * Vercel'de Storage → Redis entegrasyonu eklenince `REDIS_URL` env değişkeni gelir
 * (entegrasyonun "Connect to Project" ile PROJEYE bağlanması gerekir, yoksa boş kalır).
 * Lokal için: `vercel env pull .env.local`.
 *
 * REDIS_URL yoksa sessizce devre dışı kalır — sayılar 0/false döner, site çökmez.
 */
import { createClient, type RedisClientType } from "redis";

const REDIS_URL = process.env.REDIS_URL;
export const kvEnabled = Boolean(REDIS_URL);

// Serverless'te sıcak başlatmalar arasında bağlantıyı yeniden kullan.
let clientPromise: Promise<RedisClientType> | null = null;

async function getClient(): Promise<RedisClientType | null> {
  if (!REDIS_URL) return null;
  if (!clientPromise) {
    const c: RedisClientType = createClient({ url: REDIS_URL });
    c.on("error", () => {
      /* bağlantı hatası uygulamayı çökertmesin */
    });
    clientPromise = c.connect().then(() => c);
  }
  try {
    return await clientPromise;
  } catch {
    clientPromise = null;
    return null;
  }
}

// Genel amaçlı cache (çeviri önbelleği vb.)
export async function kvGet(key: string): Promise<string | null> {
  const kv = await getClient();
  if (!kv) return null;
  try {
    return (await kv.get(key)) as string | null;
  } catch {
    return null;
  }
}
export async function kvSet(key: string, value: string): Promise<void> {
  const kv = await getClient();
  if (!kv) return;
  try {
    await kv.set(key, value);
  } catch {
    /* yoksay */
  }
}

const LIKED_GAMES_SET = "oh:liked_games"; // en az bir beğenisi olan oyun id'leri

const likedKey = (id: string) => `oh:liked_by:${id}`;
const dislikedKey = (id: string) => `oh:disliked_by:${id}`;

export type Reactions = { count: number; dislikes: number; liked: boolean; disliked: boolean };
const EMPTY: Reactions = { count: 0, dislikes: 0, liked: false, disliked: false };

/** Bir oyunun beğeni/beğenmeme durumu (count = beğeni sayısı). */
export async function getReactions(gameId: string, uid: string | undefined): Promise<Reactions> {
  const kv = await getClient();
  if (!kv) return EMPTY;
  try {
    const [count, dislikes, liked, disliked] = await Promise.all([
      kv.sCard(likedKey(gameId)),
      kv.sCard(dislikedKey(gameId)),
      uid ? kv.sIsMember(likedKey(gameId), uid) : Promise.resolve(false),
      uid ? kv.sIsMember(dislikedKey(gameId), uid) : Promise.resolve(false),
    ]);
    return { count: count ?? 0, dislikes: dislikes ?? 0, liked: Boolean(liked), disliked: Boolean(disliked) };
  } catch {
    return EMPTY;
  }
}

/** Beğeni/beğenmemeyi aç-kapat; ikisi karşılıklı dışlayıcıdır. */
export async function toggleReaction(gameId: string, uid: string, type: "like" | "dislike"): Promise<Reactions> {
  const kv = await getClient();
  if (!kv) return EMPTY;
  try {
    const onKey = type === "like" ? likedKey(gameId) : dislikedKey(gameId);
    const offKey = type === "like" ? dislikedKey(gameId) : likedKey(gameId);
    const already = await kv.sIsMember(onKey, uid);
    if (already) {
      await kv.sRem(onKey, uid);
    } else {
      await kv.sAdd(onKey, uid);
      await kv.sRem(offKey, uid);
      await kv.sAdd(LIKED_GAMES_SET, gameId);
    }
    return getReactions(gameId, uid);
  } catch {
    return EMPTY;
  }
}

/** Admin paneli için: beğeni VEYA beğenmeme almış tüm oyunlar, beğeniye göre azalan. */
export async function getAllVotes(): Promise<{ gameId: string; likes: number; dislikes: number }[]> {
  const kv = await getClient();
  if (!kv) return [];
  try {
    const gameIds = await kv.sMembers(LIKED_GAMES_SET);
    if (!gameIds.length) return [];
    const [likes, dislikes] = await Promise.all([
      Promise.all(gameIds.map((id) => kv.sCard(likedKey(id)))),
      Promise.all(gameIds.map((id) => kv.sCard(dislikedKey(id)))),
    ]);
    return gameIds
      .map((gameId, i) => ({ gameId, likes: likes[i] ?? 0, dislikes: dislikes[i] ?? 0 }))
      .filter((v) => v.likes > 0 || v.dislikes > 0)
      .sort((a, b) => b.likes - a.likes || b.dislikes - a.dislikes);
  } catch {
    return [];
  }
}

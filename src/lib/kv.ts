/**
 * Paylaşılan beğeni/beğenmeme/oynanma sayacı + admin günlüğü — Redis (node-redis).
 *
 * `REDIS_URL` (Vercel/Netlify env) ile bağlanır. Yoksa sessizce devre dışı kalır.
 * ⚠️ Çeviri önbelleği TTL'lidir (30 gün) → 30MB free Redis'i doldurmasın diye.
 */
import { createClient, type RedisClientType } from "redis";

const REDIS_URL = process.env.REDIS_URL;
export const kvEnabled = Boolean(REDIS_URL);

let clientPromise: Promise<RedisClientType> | null = null;

async function getClient(): Promise<RedisClientType | null> {
  if (!REDIS_URL) return null;
  if (!clientPromise) {
    const c: RedisClientType = createClient({ url: REDIS_URL });
    c.on("error", () => {});
    clientPromise = c.connect().then(() => c);
  }
  try {
    return await clientPromise;
  } catch {
    clientPromise = null;
    return null;
  }
}

// ── Oynanma sayacı ─────────────────────────────────────────────────────────
const PLAYS_Z = "oh:plays";

export async function incrPlay(gameId: string): Promise<void> {
  const kv = await getClient();
  if (!kv) return;
  try {
    await kv.zIncrBy(PLAYS_Z, 1, gameId);
  } catch {
    /* yoksay */
  }
}

export async function getPlayCount(gameId: string): Promise<number> {
  const kv = await getClient();
  if (!kv) return 0;
  try {
    const s = await kv.zScore(PLAYS_Z, gameId);
    return s ? Math.round(Number(s)) : 0;
  } catch {
    return 0;
  }
}

export async function getTopPlayedIds(limit = 60): Promise<string[]> {
  const kv = await getClient();
  if (!kv) return [];
  try {
    return (await kv.zRange(PLAYS_Z, 0, limit - 1, { REV: true })) as string[];
  } catch {
    return [];
  }
}

/** Admin: en çok oynanan oyunlar — id + oynanma sayısı (skorlu). */
export async function getTopPlayed(limit = 100): Promise<{ gameId: string; plays: number }[]> {
  const kv = await getClient();
  if (!kv) return [];
  try {
    const rows = await kv.zRangeWithScores(PLAYS_Z, 0, limit - 1, { REV: true });
    return rows.map((r) => ({ gameId: String(r.value), plays: Math.round(Number(r.score)) }));
  } catch {
    return [];
  }
}

// ── Genel cache (çeviri önbelleği) — TTL'li ────────────────────────────────
const CACHE_TTL = 60 * 60 * 24 * 30; // 30 gün → free Redis dolmasın

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
    await kv.set(key, value, { EX: CACHE_TTL });
  } catch {
    /* yoksay */
  }
}

/** Çeviri önbelleği anahtarlarını (oh:tr:*) siler — dolu Redis'te yer açmak için.
 *  DEL belleği boşaltır (noeviction'da bile çalışır). Beğeni/oynanma verisine dokunmaz. */
export async function flushTranslationCache(): Promise<number> {
  const kv = await getClient();
  if (!kv) return 0;
  let cursor = "0";
  let total = 0;
  try {
    do {
      const res = await kv.scan(cursor, { MATCH: "oh:tr:*", COUNT: 500 });
      cursor = String(res.cursor);
      if (res.keys.length) {
        await kv.del(res.keys);
        total += res.keys.length;
      }
    } while (cursor !== "0");
  } catch {
    /* yoksay */
  }
  return total;
}

// ── Beğeni / beğenmeme ─────────────────────────────────────────────────────
const LIKED_GAMES_SET = "oh:liked_games";
const likedKey = (id: string) => `oh:liked_by:${id}`;
const dislikedKey = (id: string) => `oh:disliked_by:${id}`;

export type Reactions = { count: number; dislikes: number; liked: boolean; disliked: boolean };
const EMPTY: Reactions = { count: 0, dislikes: 0, liked: false, disliked: false };

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

// ── Oy günlüğü (admin: IP + ülke) ─────────────────────────────────────────
const VOTES_LOG = "oh:votes_log";
export type VoteEvent = { gameId: string; type: "like" | "dislike"; active: boolean; ip: string; country: string; ts: number };

export async function logVote(e: Omit<VoteEvent, "ts">): Promise<void> {
  const kv = await getClient();
  if (!kv) return;
  try {
    await kv.lPush(VOTES_LOG, JSON.stringify({ ...e, ts: Date.now() }));
    await kv.lTrim(VOTES_LOG, 0, 1999);
  } catch {
    /* yoksay */
  }
}

export async function getVotesLog(limit = 300): Promise<VoteEvent[]> {
  const kv = await getClient();
  if (!kv) return [];
  try {
    const rows = await kv.lRange(VOTES_LOG, 0, limit - 1);
    return rows
      .map((r) => {
        try {
          return JSON.parse(r) as VoteEvent;
        } catch {
          return null;
        }
      })
      .filter((x): x is VoteEvent => !!x);
  } catch {
    return [];
  }
}

// ── Admin: en çok oy alan oyunlar ──────────────────────────────────────────
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

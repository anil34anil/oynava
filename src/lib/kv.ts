/**
 * Paylaşılan beğeni/beğenmeme/oynanma sayacı + admin günlüğü — Upstash Redis REST API.
 *
 * ⚠️ node-redis (TCP) yerine @upstash/redis (HTTP/REST) kullanılır: serverless'te
 * (Vercel/Netlify) kalıcı TCP bağlantısı kopuyordu; REST stateless olduğu için
 * her platformda güvenilir çalışır.
 *
 * GEREKLİ ENV (Upstash konsolu → "REST API" bölümü):
 *   UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
 * (Eski Vercel KV adları KV_REST_API_URL/TOKEN de desteklenir.)
 * Yoksa sessizce devre dışı kalır — sayılar 0/false döner, site çökmez.
 */
import { Redis } from "@upstash/redis";

const REST_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

export const kvEnabled = Boolean(REST_URL && REST_TOKEN);
const redis = kvEnabled ? new Redis({ url: REST_URL!, token: REST_TOKEN! }) : null;

// ── Oynanma sayacı (ArcadeCMS "Most Played" paritesi) ─────────────────────
const PLAYS_Z = "oh:plays";

export async function incrPlay(gameId: string): Promise<void> {
  if (!redis) return;
  try {
    await redis.zincrby(PLAYS_Z, 1, gameId);
  } catch {
    /* yoksay */
  }
}

export async function getPlayCount(gameId: string): Promise<number> {
  if (!redis) return 0;
  try {
    const s = await redis.zscore(PLAYS_Z, gameId);
    return s ? Math.round(Number(s)) : 0;
  } catch {
    return 0;
  }
}

export async function getTopPlayedIds(limit = 60): Promise<string[]> {
  if (!redis) return [];
  try {
    const ids = await redis.zrange<string[]>(PLAYS_Z, 0, limit - 1, { rev: true });
    return Array.isArray(ids) ? (ids as string[]) : [];
  } catch {
    return [];
  }
}

// ── Genel cache (çeviri önbelleği) ────────────────────────────────────────
export async function kvGet(key: string): Promise<string | null> {
  if (!redis) return null;
  try {
    const v = await redis.get<string>(key);
    return v == null ? null : String(v);
  } catch {
    return null;
  }
}
export async function kvSet(key: string, value: string): Promise<void> {
  if (!redis) return;
  try {
    await redis.set(key, value);
  } catch {
    /* yoksay */
  }
}

// ── Beğeni / beğenmeme ─────────────────────────────────────────────────────
const LIKED_GAMES_SET = "oh:liked_games";
const likedKey = (id: string) => `oh:liked_by:${id}`;
const dislikedKey = (id: string) => `oh:disliked_by:${id}`;

export type Reactions = { count: number; dislikes: number; liked: boolean; disliked: boolean };
const EMPTY: Reactions = { count: 0, dislikes: 0, liked: false, disliked: false };

export async function getReactions(gameId: string, uid: string | undefined): Promise<Reactions> {
  if (!redis) return EMPTY;
  try {
    const [count, dislikes, liked, disliked] = await Promise.all([
      redis.scard(likedKey(gameId)),
      redis.scard(dislikedKey(gameId)),
      uid ? redis.sismember(likedKey(gameId), uid) : Promise.resolve(0),
      uid ? redis.sismember(dislikedKey(gameId), uid) : Promise.resolve(0),
    ]);
    return { count: count ?? 0, dislikes: dislikes ?? 0, liked: Boolean(liked), disliked: Boolean(disliked) };
  } catch {
    return EMPTY;
  }
}

export async function toggleReaction(gameId: string, uid: string, type: "like" | "dislike"): Promise<Reactions> {
  if (!redis) return EMPTY;
  try {
    const onKey = type === "like" ? likedKey(gameId) : dislikedKey(gameId);
    const offKey = type === "like" ? dislikedKey(gameId) : likedKey(gameId);
    const already = await redis.sismember(onKey, uid);
    if (already) {
      await redis.srem(onKey, uid);
    } else {
      await redis.sadd(onKey, uid);
      await redis.srem(offKey, uid);
      await redis.sadd(LIKED_GAMES_SET, gameId);
    }
    return getReactions(gameId, uid);
  } catch {
    return EMPTY;
  }
}

// ── Oy günlüğü (admin: IP + ülke) ─────────────────────────────────────────
const VOTES_LOG = "oh:votes_log";
export type VoteEvent = {
  gameId: string;
  type: "like" | "dislike";
  active: boolean;
  ip: string;
  country: string;
  ts: number;
};

export async function logVote(e: Omit<VoteEvent, "ts">): Promise<void> {
  if (!redis) return;
  try {
    await redis.lpush(VOTES_LOG, JSON.stringify({ ...e, ts: Date.now() }));
    await redis.ltrim(VOTES_LOG, 0, 1999);
  } catch {
    /* yoksay */
  }
}

export async function getVotesLog(limit = 300): Promise<VoteEvent[]> {
  if (!redis) return [];
  try {
    const rows = await redis.lrange<string>(VOTES_LOG, 0, limit - 1);
    return rows
      .map((r) => (typeof r === "string" ? safeParse(r) : (r as unknown as VoteEvent)))
      .filter((x): x is VoteEvent => !!x);
  } catch {
    return [];
  }
}

function safeParse(s: string): VoteEvent | null {
  try {
    return JSON.parse(s) as VoteEvent;
  } catch {
    return null;
  }
}

// ── Admin: en çok oy alan oyunlar ──────────────────────────────────────────
export async function getAllVotes(): Promise<{ gameId: string; likes: number; dislikes: number }[]> {
  if (!redis) return [];
  try {
    const gameIds = await redis.smembers(LIKED_GAMES_SET);
    if (!gameIds.length) return [];
    const [likes, dislikes] = await Promise.all([
      Promise.all(gameIds.map((id) => redis.scard(likedKey(id)))),
      Promise.all(gameIds.map((id) => redis.scard(dislikedKey(id)))),
    ]);
    return gameIds
      .map((gameId, i) => ({ gameId, likes: likes[i] ?? 0, dislikes: dislikes[i] ?? 0 }))
      .filter((v) => v.likes > 0 || v.dislikes > 0)
      .sort((a, b) => b.likes - a.likes || b.dislikes - a.dislikes);
  } catch {
    return [];
  }
}

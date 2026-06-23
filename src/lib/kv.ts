/**
 * Paylaşılan (tüm ziyaretçiler ortak) beğeni sayacı — Vercel KV / Upstash Redis.
 *
 * KURULUM: Vercel proje panelinde Storage → "Redis" (Marketplace, Upstash) ekle.
 * Env değişkenleri (KV_REST_API_URL, KV_REST_API_TOKEN) otomatik Production'a
 * enjekte edilir; lokal geliştirme için `vercel env pull .env.local` ile çekebilirsin.
 *
 * Env yoksa (kurulum tamamlanmadan önce) hata fırlatmak yerine sessizce devre dışı
 * kalır — site KV bağlanana kadar beğeni sayıları hep 0/false döner, build/SSR
 * çökmez.
 */
import { kv } from "@vercel/kv";

export const kvEnabled = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

const LIKED_GAMES_SET = "oh:liked_games"; // beğenisi olan tüm oyun id'leri

function likedBySetKey(gameId: string) {
  return `oh:liked_by:${gameId}`;
}

export async function getLikeState(gameId: string, uid: string | undefined) {
  if (!kvEnabled) return { count: 0, liked: false };
  const [count, liked] = await Promise.all([
    kv.scard(likedBySetKey(gameId)),
    uid ? kv.sismember(likedBySetKey(gameId), uid) : Promise.resolve(0),
  ]);
  return { count: count ?? 0, liked: Boolean(liked) };
}

/** Beğeniyi açar/kapatır (toggle), güncel { count, liked } döner. */
export async function toggleLike(gameId: string, uid: string) {
  if (!kvEnabled) return { count: 0, liked: false };
  const key = likedBySetKey(gameId);
  const already = await kv.sismember(key, uid);
  if (already) {
    await kv.srem(key, uid);
  } else {
    await kv.sadd(key, uid);
    await kv.sadd(LIKED_GAMES_SET, gameId);
  }
  const count = await kv.scard(key);
  return { count: count ?? 0, liked: !already };
}

/** Admin paneli için: en az 1 beğenisi olan tüm oyunlar, beğeni sayısına göre azalan. */
export async function getAllVotes(): Promise<{ gameId: string; count: number }[]> {
  if (!kvEnabled) return [];
  const gameIds = await kv.smembers(LIKED_GAMES_SET);
  if (!gameIds.length) return [];
  const counts = await Promise.all(gameIds.map((id) => kv.scard(likedBySetKey(id))));
  return gameIds
    .map((gameId, i) => ({ gameId, count: counts[i] ?? 0 }))
    .filter((v) => v.count > 0)
    .sort((a, b) => b.count - a.count);
}

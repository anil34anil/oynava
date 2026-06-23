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
import { createClient } from "@vercel/kv";

// Vercel KV (eski) `KV_REST_API_URL`/`KV_REST_API_TOKEN` adlarını kullanır; yeni
// Upstash Marketplace entegrasyonu ise `UPSTASH_REDIS_REST_URL`/`..._TOKEN` ekler.
// İkisini de destekle ki hangi entegrasyon eklenmiş olursa olsun çalışsın.
const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export const kvEnabled = Boolean(KV_URL && KV_TOKEN);

const kv = kvEnabled ? createClient({ url: KV_URL!, token: KV_TOKEN! }) : (null as never);

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

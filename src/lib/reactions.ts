"use client";

/**
 * İstemci-taraflı reaksiyon yükleyici (BATCHING).
 * Aynı anda mount olan yüzlerce ReactionPill'in ayrı ayrı /api/likes/:id çağırması
 * yerine, 80ms içinde biriken id'leri TEK /api/likes/batch isteğinde toplar.
 * → Vercel fonksiyon çağrısı/CPU maliyeti ~180x → ~1x.
 */
export type Reactions = { count: number; dislikes: number; liked: boolean; disliked: boolean };
const EMPTY: Reactions = { count: 0, dislikes: 0, liked: false, disliked: false };

const cache = new Map<string, Reactions>();
let queue: { id: string; resolve: (r: Reactions) => void }[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;

function flush() {
  const batch = queue;
  queue = [];
  timer = null;
  const ids = [...new Set(batch.map((b) => b.id))].filter((id) => !cache.has(id));
  const done = (map: Record<string, Reactions>) => {
    for (const id of ids) cache.set(id, map[id] ?? EMPTY);
    batch.forEach((b) => b.resolve(cache.get(b.id) ?? EMPTY));
  };
  if (ids.length === 0) {
    batch.forEach((b) => b.resolve(cache.get(b.id) ?? EMPTY));
    return;
  }
  fetch("/api/likes/batch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  })
    .then((r) => r.json())
    .then((map: Record<string, Reactions>) => done(map))
    .catch(() => done({}));
}

/** Bir oyunun reaksiyonunu (batch'lenmiş) yükler. */
export function loadReactions(id: string): Promise<Reactions> {
  if (cache.has(id)) return Promise.resolve(cache.get(id)!);
  return new Promise((resolve) => {
    queue.push({ id, resolve });
    if (!timer) timer = setTimeout(flush, 80);
  });
}

/** Toggle sonrası güncel durumu cache'e yaz (optimistik + sunucu yanıtı). */
export function setReactionCache(id: string, r: Reactions) {
  cache.set(id, r);
}

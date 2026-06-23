"use client";

import { useEffect, useState } from "react";

/**
 * Beğeni butonu — giriş yapmış/yapmamış herkes kullanabilir (anonim cihaz id'si
 * cookie ile takip edilir, hesap gerekmez). Sayaç tüm ziyaretçiler arasında
 * ortaktır (Vercel KV), localStorage'daki favoriden farklıdır.
 */
export function LikeButton({ id, className = "" }: { id: string; className?: string }) {
  const [count, setCount] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch(`/api/likes/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setCount(d.count);
        setLiked(d.liked);
      })
      .catch(() => setCount(0));
  }, [id]);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    // optimistik güncelleme
    setLiked((l) => !l);
    setCount((c) => (c ?? 0) + (liked ? -1 : 1));
    try {
      const res = await fetch(`/api/likes/${id}`, { method: "POST" });
      const d = await res.json();
      setCount(d.count);
      setLiked(d.liked);
    } catch {
      // hata olursa optimistik güncellemeyi geri al
      setLiked((l) => !l);
      setCount((c) => (c ?? 0) + (liked ? 1 : -1));
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      aria-label={liked ? "Beğeniyi geri al" : "Beğen"}
      onClick={toggle}
      disabled={busy}
      className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold backdrop-blur transition
        ${liked
          ? "border-neon bg-neon/15 text-neon"
          : "border-white/20 bg-black/40 text-white/70 hover:text-neon"} ${className}`}
    >
      <span>{liked ? "👍" : "👍🏻"}</span>
      <span>{count ?? "–"}</span>
    </button>
  );
}

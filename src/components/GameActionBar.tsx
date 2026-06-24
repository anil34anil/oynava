"use client";

import { useEffect, useState } from "react";
import { useFavorites } from "@/lib/useLocalProfile";

type Reactions = { count: number; dislikes: number; liked: boolean; disliked: boolean };

/** Sayıyı kısaltır: 1500 → 1,5B, 1200000 → 1,2M (CrazyGames/BuildNow tarzı). */
function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(".0", "").replace(".", ",") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(".0", "").replace(".", ",") + "B";
  return String(n);
}

/**
 * Oyun videosunun altına gömülü aksiyon çubuğu (BuildNow/CrazyGames tarzı):
 * beğen / beğenme / favori / paylaş / tam ekran. Beğeni sayacı tüm ziyaretçiler
 * arasında ortaktır (KV); favori cihaz-yereldir.
 */
export function GameActionBar({ id, onFullscreen }: { id: string; onFullscreen?: () => void }) {
  const { has, toggle: toggleFav } = useFavorites();
  const fav = has(id);
  const [r, setR] = useState<Reactions | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/likes/${id}`)
      .then((res) => res.json())
      .then(setR)
      .catch(() => setR({ count: 0, dislikes: 0, liked: false, disliked: false }));
  }, [id]);

  async function react(type: "like" | "dislike") {
    if (busy) return;
    setBusy(true);
    // optimistik
    setR((p) => {
      if (!p) return p;
      const next = { ...p };
      if (type === "like") {
        if (p.liked) next.count--;
        else {
          next.count++;
          if (p.disliked) next.dislikes--;
        }
        next.liked = !p.liked;
        if (next.liked) next.disliked = false;
      } else {
        if (p.disliked) next.dislikes--;
        else {
          next.dislikes++;
          if (p.liked) next.count--;
        }
        next.disliked = !p.disliked;
        if (next.disliked) next.liked = false;
      }
      return next;
    });
    try {
      const res = await fetch(`/api/likes/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      setR(await res.json());
    } catch {
      /* ağ hatası: optimistik kalır */
    } finally {
      setBusy(false);
    }
  }

  async function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) await navigator.share({ url });
      else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    } catch {
      /* iptal */
    }
  }

  const btn =
    "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition";

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-surface/70 px-3 py-2">
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => react("like")}
          disabled={busy}
          aria-label="Beğen"
          className={`${btn} ${r?.liked ? "bg-neon/15 text-neon" : "text-slate-400 hover:bg-white/[0.07] hover:text-ink"}`}
        >
          👍 <span>{r ? fmt(r.count) : "–"}</span>
        </button>
        <button
          onClick={() => react("dislike")}
          disabled={busy}
          aria-label="Beğenme"
          className={`${btn} ${r?.disliked ? "bg-neon-pink/15 text-neon-pink" : "text-slate-400 hover:bg-white/[0.07] hover:text-ink"}`}
        >
          👎 <span>{r ? fmt(r.dislikes) : "–"}</span>
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFav(id);
          }}
          aria-label={fav ? "Favorilerden çıkar" : "Favorilere ekle"}
          className={`${btn} ${fav ? "bg-neon-pink/15 text-neon-pink" : "text-slate-400 hover:bg-white/[0.07] hover:text-neon-pink"}`}
        >
          {fav ? "♥" : "♡"} <span className="hidden sm:inline">Favori</span>
        </button>
        <button
          onClick={share}
          aria-label="Paylaş"
          className={`${btn} text-slate-400 hover:bg-white/[0.07] hover:text-ink`}
        >
          ↗ <span className="hidden sm:inline">{copied ? "Kopyalandı" : "Paylaş"}</span>
        </button>
      </div>

      {onFullscreen && (
        <button onClick={onFullscreen} className="btn-primary py-1.5 text-xs">
          ⛶ Tam Ekran
        </button>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useFavorites } from "@/lib/useLocalProfile";
import { ReactionPill } from "./ReactionPill";

/**
 * Oyun videosunun altına gömülü aksiyon çubuğu (BuildNow/CrazyGames tarzı):
 * beğen/beğenme (YouTube tarzı pill) / favori / paylaş / tam ekran.
 */
export function GameActionBar({ id, onFullscreen }: { id: string; onFullscreen?: () => void }) {
  const { has, toggle: toggleFav } = useFavorites();
  const fav = has(id);
  const [copied, setCopied] = useState(false);

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
        <ReactionPill id={id} size="md" />
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

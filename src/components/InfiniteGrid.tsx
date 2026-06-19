"use client";

import { useEffect, useRef, useState } from "react";
import { Game } from "@/lib/catalog";
import { GameCard } from "./GameCard";

/**
 * Sonsuz kaydırma: tüm liste client'a gelir, IntersectionObserver ile
 * parça parça açığa çıkar (sayfa-içi, ağ isteği yok).
 */
export function InfiniteGrid({ games, step = 24 }: { games: Game[]; step?: number }) {
  const [count, setCount] = useState(step);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCount((c) => Math.min(c + step, games.length));
        }
      },
      { rootMargin: "600px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [games.length, step]);

  const visible = games.slice(0, count);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {visible.map((g, i) => (
          <GameCard key={g.id} game={g} priority={i < 6} />
        ))}
      </div>
      {count < games.length && (
        <div ref={sentinel} className="grid place-items-center py-10 text-sm text-slate-500">
          <span className="animate-float">↓ Daha fazla oyun yükleniyor…</span>
        </div>
      )}
    </>
  );
}

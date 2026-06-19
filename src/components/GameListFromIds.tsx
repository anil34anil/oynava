"use client";

import { useEffect, useState } from "react";
import { Game } from "@/lib/catalog";
import { GameGrid } from "./GameGrid";

/** id listesinden /api/games ile oyunları çekip grid çizer (favori/son oynanan). */
export function GameListFromIds({ ids, empty }: { ids: string[]; empty: React.ReactNode }) {
  const [games, setGames] = useState<Game[] | null>(null);

  useEffect(() => {
    if (ids.length === 0) {
      setGames([]);
      return;
    }
    let alive = true;
    fetch(`/api/games?ids=${ids.join(",")}`)
      .then((r) => r.json())
      .then((d) => alive && setGames(d))
      .catch(() => alive && setGames([]));
    return () => {
      alive = false;
    };
  }, [ids.join(",")]);

  if (games === null) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="skeleton aspect-[4/3] rounded-2xl" />
        ))}
      </div>
    );
  }

  if (games.length === 0) return <>{empty}</>;
  return <GameGrid games={games} />;
}

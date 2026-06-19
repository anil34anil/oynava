import type { Metadata } from "next";
import { getGames } from "@/lib/games";
import { InfiniteGrid } from "@/components/InfiniteGrid";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Tüm Oyunlar",
  description: "Binlerce ücretsiz HTML5 oyunun tamamı tek sayfada — sonsuz kaydır, oyna.",
};

export default async function AllGamesPage() {
  const games = await getGames();
  return (
    <div className="container-x space-y-6 py-6">
      <div className="flex items-center gap-3">
        <h1 className="font-display text-3xl font-black text-white neon-text">Tüm Oyunlar</h1>
        <span className="rounded-full border border-line px-3 py-1 text-sm text-slate-400">
          {games.length} oyun
        </span>
      </div>
      <InfiniteGrid games={games} />
    </div>
  );
}

import type { Metadata } from "next";
import { searchGames } from "@/lib/games";
import { GameGrid } from "@/components/GameGrid";
import { AutoTrScope } from "@/components/AutoTrScope";

export const dynamic = "force-dynamic";

// Arama sonucu sayfaları ince/yinelenen içerik sayılır; Google önerisi: noindex, follow.
export const metadata: Metadata = {
  title: "Oyun Ara — Ücretsiz Oyunlar",
  description: "Binlerce ücretsiz oyun arasında ara: aksiyon, yarış, bulmaca ve daha fazlası tarayıcında anında oynanır.",
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q ?? "";
  const results = await searchGames(q);

  return (
    <AutoTrScope className="container-x space-y-6 py-6">
      <h1 className="font-display text-2xl font-black text-ink">
        “{q}” için sonuçlar{" "}
        <span className="text-[1rem] text-slate-500">({results.length})</span>
      </h1>
      <GameGrid games={results} priorityCount={6} />
    </AutoTrScope>
  );
}

import { searchGames } from "@/lib/games";
import { GameGrid } from "@/components/GameGrid";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q ?? "";
  const results = await searchGames(q);

  return (
    <div className="container-x space-y-6 py-6">
      <h1 className="font-display text-2xl font-black text-white">
        “{q}” için sonuçlar{" "}
        <span className="text-base text-slate-500">({results.length})</span>
      </h1>
      <GameGrid games={results} priorityCount={6} />
    </div>
  );
}

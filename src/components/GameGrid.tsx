import { Game } from "@/lib/catalog";
import { GameCard } from "./GameCard";

type Props = {
  games: Game[];
  priorityCount?: number;
  /** true: CrazyGames tarzı yatay kaydırmalı tek satır (kategori önizleme rayları için). */
  scroll?: boolean;
};

export function GameGrid({ games, priorityCount = 0, scroll = false }: Props) {
  if (games.length === 0) {
    return (
      <div className="card-base grid place-items-center py-20 text-center">
        <p className="text-lg text-slate-400">Bu bölümde henüz oyun yok.</p>
        <p className="mt-1 text-sm text-slate-600">
          Feed bağlandığında binlerce oyun otomatik listelenecek.
        </p>
      </div>
    );
  }

  if (scroll) {
    return (
      <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 [scrollbar-width:thin]">
        {games.map((g, i) => (
          <div key={g.id} className="w-36 shrink-0 sm:w-40 md:w-44">
            <GameCard game={g} priority={i < priorityCount} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {games.map((g, i) => (
        <GameCard key={g.id} game={g} priority={i < priorityCount} />
      ))}
    </div>
  );
}

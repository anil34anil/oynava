import Image from "next/image";
import Link from "next/link";
import { Game, slugifyTitle } from "@/lib/catalog";
import { FavoriteButton } from "./FavoriteButton";

export function GameCard({ game, priority = false }: { game: Game; priority?: boolean }) {
  return (
    <Link
      href={`/oyun/${game.id}/${slugifyTitle(game.title)}`}
      className="group relative block overflow-hidden rounded-2xl border border-line bg-card transition-all duration-200 hover:-translate-y-1 hover:border-neon hover:shadow-glow"
    >
      <FavoriteButton id={game.id} />
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={game.thumb}
          alt={game.title}
          fill
          sizes="(max-width:640px) 50vw, (max-width:1024px) 25vw, 16vw"
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          priority={priority}
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-base via-base/10 to-transparent opacity-80" />

        {/* Hover'da oyna katmanı */}
        <div className="absolute inset-0 grid place-items-center bg-base/60 opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
          <span className="btn-primary scale-90 transition group-hover:scale-100">
            ▶ Oyna
          </span>
        </div>
      </div>

      <div className="p-3">
        <h3 className="truncate font-display text-sm font-semibold text-slate-100 group-hover:text-neon">
          {game.title}
        </h3>
        <p className="mt-0.5 truncate text-xs text-slate-500">{game.category}</p>
      </div>
    </Link>
  );
}

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getGameById, getByCategory, categorySlug } from "@/lib/games";
import { trInstructions, trDescription } from "@/lib/tr";
import { GamePlayer } from "@/components/GamePlayer";
import { GameGrid } from "@/components/GameGrid";
import { AdSlot } from "@/components/AdSlot";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const game = await getGameById(params.id);
  if (!game) return {};
  return {
    title: `${game.title} — Ücretsiz Oyna`,
    description: game.description?.slice(0, 160) || `${game.title} oyununu tarayıcında ücretsiz oyna.`,
    openGraph: { images: [game.thumb] },
  };
}

export default async function GamePage({ params }: { params: { id: string } }) {
  const game = await getGameById(params.id);
  if (!game) notFound();

  const related = (await getByCategory(categorySlug(game)))
    .filter((g) => g.id !== game.id)
    .slice(0, 12);

  return (
    <div className="container-x grid gap-6 py-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <nav className="text-sm text-slate-500">
          <span className="text-neon">{game.category}</span> / {game.title}
        </nav>

        <h1 className="font-display text-2xl font-black text-white md:text-3xl">{game.title}</h1>

        <GamePlayer game={game} />

        <div className="card-base p-5">
          <h2 className="mb-2 font-display text-lg font-bold text-white">🎯 Nasıl Oynanır?</h2>
          <p className="whitespace-pre-line text-slate-400">{trInstructions(game.instructions)}</p>
        </div>

        <div className="card-base p-5">
          <h2 className="mb-2 font-display text-lg font-bold text-white">Hakkında</h2>
          <p className="text-slate-400">{trDescription(game)}</p>
        </div>

        <section>
          <h2 className="mb-4 font-display text-xl font-bold text-white">Benzer Oyunlar</h2>
          <GameGrid games={related} />
        </section>
      </div>

      <aside className="space-y-4">
        <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR} className="min-h-[250px]" />
        <div className="card-base p-4">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-300">
            Etiketler
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {game.tags.split(",").filter(Boolean).slice(0, 12).map((t) => (
              <span key={t} className="rounded-md bg-white/5 px-2 py-1 text-xs text-slate-400">
                #{t.trim()}
              </span>
            ))}
          </div>
        </div>
        <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR} className="min-h-[250px]" />
      </aside>
    </div>
  );
}

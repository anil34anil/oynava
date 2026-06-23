import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getGameById, getByCategory, categorySlug } from "@/lib/games";
import { trInstructions, trDescription } from "@/lib/tr";
import { slugifyTitle } from "@/lib/catalog";
import { GamePlayer } from "@/components/GamePlayer";
import { GameGrid } from "@/components/GameGrid";
import { LikeButton } from "@/components/LikeButton";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const game = await getGameById(params.id);
  if (!game) return {};
  const desc = trDescription(game).slice(0, 160);
  return {
    title: `${game.title} — Ücretsiz Oyna`,
    description: desc,
    alternates: { canonical: `/oyun/${game.id}/${slugifyTitle(game.title)}` },
    openGraph: { title: `${game.title} — Ücretsiz Oyna`, description: desc, images: [game.thumb], type: "article" },
  };
}

export default async function GamePage({ params }: { params: { id: string } }) {
  const game = await getGameById(params.id);
  if (!game) notFound();

  const related = (await getByCategory(categorySlug(game)))
    .filter((g) => g.id !== game.id)
    .slice(0, 12);

  const url = `${SITE.url}/oyun/${game.id}/${slugifyTitle(game.title)}`;

  return (
    <div className="container-x grid gap-6 py-6 lg:grid-cols-[1fr_320px]">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "VideoGame",
            name: game.title,
            url,
            image: game.thumb,
            description: trDescription(game),
            inLanguage: "tr-TR",
            applicationCategory: "Game",
            operatingSystem: "Web Browser (HTML5)",
            genre: game.category,
            offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
            publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE.url },
              { "@type": "ListItem", position: 2, name: game.category, item: `${SITE.url}/oyunlar` },
              { "@type": "ListItem", position: 3, name: game.title, item: url },
            ],
          },
        ]}
      />
      <div className="space-y-6">
        <nav className="text-sm text-slate-500">
          <span className="text-neon">{game.category}</span> / {game.title}
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-2xl font-black text-white md:text-3xl">{game.title}</h1>
          <LikeButton id={game.id} className="px-3 py-1.5 text-sm" />
        </div>

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

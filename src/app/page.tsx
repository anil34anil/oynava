import Link from "next/link";
import { getGames } from "@/lib/games";
import { categorySlug, CATEGORIES } from "@/lib/catalog";
import { Hero } from "@/components/Hero";
import { GameGrid } from "@/components/GameGrid";
import { AdSlot } from "@/components/AdSlot";

export const revalidate = 3600;

export default async function HomePage() {
  const games = await getGames();
  const featured = games[0];
  const popular = games.slice(0, 18);

  // Her kategoriden bir şerit
  const rows = CATEGORIES.map((c) => ({
    cat: c,
    items: games.filter((g) => categorySlug(g) === c.slug).slice(0, 12),
  })).filter((r) => r.items.length > 0);

  return (
    <div className="container-x space-y-10 py-6">
      <Hero game={featured} />

      {/* Oynava Originals tanıtım */}
      <Link
        href="/orijinal/golge-savascisi"
        className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-neon-lime/30 bg-gradient-to-r from-neon-lime/10 to-neon-purple/10 p-6 transition hover:border-neon-lime"
      >
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-neon-lime">
            ★ Oynava Originals
          </span>
          <h2 className="mt-1 font-display text-2xl font-black text-white">Gölge Savaşçısı</h2>
          <p className="mt-1 max-w-md text-sm text-slate-400">
            Bize özel, telifsiz aksiyon-survival. Oyna, hayatta kal, jeton kazan.
          </p>
        </div>
        <span className="btn-primary shrink-0 group-hover:scale-105">▶ Oyna</span>
      </Link>

      <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_TOP} className="min-h-[90px]" />

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold text-white">🔥 Popüler Oyunlar</h2>
        </div>
        <GameGrid games={popular} priorityCount={6} />
      </section>

      {rows.map(({ cat, items }) => (
        <section key={cat.slug}>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="font-display text-xl font-bold text-white">{cat.tr}</h2>
            <Link
              href={`/kategori/${cat.slug}`}
              className="text-sm font-semibold text-neon hover:underline"
            >
              Tümünü gör →
            </Link>
          </div>
          <GameGrid games={items} />
        </section>
      ))}

      <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_BOTTOM} className="min-h-[90px]" />
    </div>
  );
}

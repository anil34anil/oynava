import Link from "next/link";
import { getGames } from "@/lib/games";
import { categorySlug, CATEGORIES } from "@/lib/catalog";
import { Hero } from "@/components/Hero";
import { GameGrid } from "@/components/GameGrid";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

const CAT_ICON: Record<string, string> = {
  aksiyon: "💥", macera: "🗺️", yaris: "🏎️", spor: "⚽", dovus: "🥊",
  bulmaca: "🧩", zeka: "♟️", io: "🌐", kiz: "💖", cocuk: "🧸", arcade: "🕹️", "3d": "🧊",
};

const PREMIUM_CATS = ["3d", "aksiyon", "yaris", "io"];

export default async function HomePage() {
  const games = await getGames();

  // Öne çıkan havuzu: önce Playgama (premium hissi) + GamePix (kaliteli), sonra premium türler.
  const premiumPool = games
    .filter((g) => g.id.startsWith("pgm-") || g.id.startsWith("gp-") || /premium|3d/i.test(g.tags) || PREMIUM_CATS.includes(categorySlug(g)))
    .sort((a, b) => ((a.id.startsWith("pgm-") ? 0 : a.id.startsWith("gp-") ? 1 : 2)) - (b.id.startsWith("pgm-") ? 0 : b.id.startsWith("gp-") ? 1 : 2));
  const featuredPool = (premiumPool.length >= 5 ? premiumPool : games).slice(0, 8);

  const popular = games.slice(0, 18);

  const rows = CATEGORIES.map((c) => ({
    cat: c,
    items: games.filter((g) => categorySlug(g) === c.slug).slice(0, 12),
  })).filter((r) => r.items.length > 0);

  return (
    <div className="container-x space-y-10 py-6">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE.name,
            url: SITE.url,
            inLanguage: "tr-TR",
            potentialAction: {
              "@type": "SearchAction",
              target: { "@type": "EntryPoint", urlTemplate: `${SITE.url}/ara?q={search_term_string}` },
              "query-input": "required name=search_term_string",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE.name,
            url: SITE.url,
            slogan: SITE.slogan,
            logo: `${SITE.url}/icon.svg`,
          },
        ]}
      />
      <Hero games={featuredPool} />

      {/* Kategori hızlı erişim ikonları */}
      <section>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-12">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/kategori/${c.slug}`}
              className="group flex flex-col items-center gap-1.5 rounded-2xl border border-line bg-card/60 py-3 transition hover:-translate-y-0.5 hover:border-neon hover:bg-card"
            >
              <span className="text-2xl transition group-hover:scale-110">{CAT_ICON[c.slug] ?? "🎮"}</span>
              <span className="px-1 text-center text-[11px] font-semibold leading-tight text-slate-400 group-hover:text-neon">
                {c.tr}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Premium tanıtım banner */}
      <Link
        href="/premium"
        className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-neon-purple/30 bg-gradient-to-r from-neon-purple/15 via-card to-neon/10 p-6 transition hover:border-neon-purple"
      >
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-neon-purple/20 blur-3xl" />
        <div className="relative">
          <span className="text-xs font-semibold uppercase tracking-widest text-neon-purple">
            ✦ Premium Oyunlar
          </span>
          <h2 className="mt-1 font-display text-2xl font-black text-white">Yüksek Grafikli 3D & WebGL Oyunlar</h2>
          <p className="mt-1 max-w-md text-sm text-slate-400">
            En kaliteli yarış, FPS, .io savaş ve 3D oyunlar — ücretsiz, indirme yok.
          </p>
        </div>
        <span className="btn-primary relative shrink-0 group-hover:scale-105">Keşfet →</span>
      </Link>

      <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_TOP} className="min-h-[90px]" />

      <section>
        <h2 className="mb-4 font-display text-2xl font-bold text-white">🔥 Popüler Oyunlar</h2>
        <GameGrid games={popular} priorityCount={6} />
      </section>

      {rows.map(({ cat, items }) => (
        <section key={cat.slug}>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="flex items-center gap-2 font-display text-xl font-bold text-white">
              <span>{CAT_ICON[cat.slug] ?? "🎮"}</span> {cat.tr}
            </h2>
            <Link href={`/kategori/${cat.slug}`} className="text-sm font-semibold text-neon hover:underline">
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

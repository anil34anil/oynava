import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getGameById, getByCategory, categorySlug, getGames } from "@/lib/games";
import { trDescription } from "@/lib/tr";
import { slugifyTitle, categoryBySlug } from "@/lib/catalog";
import { gameTagLinks } from "@/lib/tags";
import { COLLECTIONS } from "@/lib/collections";
import { GamePlayer } from "@/components/GamePlayer";
import { GameGrid } from "@/components/GameGrid";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import { t, localePath } from "@/lib/i18n";
import { seoAlternates } from "@/lib/seo";
import { getLocale, gameDescription, gameInstructions, gameFaq } from "@/lib/localize";
import { getPlayCount } from "@/lib/kv";

export const revalidate = 3600;

// En popüler ilk 150 oyun build'de pre-render (SSG); kalanlar ilk istekte ISR ile cache'lenir.
export async function generateStaticParams() {
  const games = await getGames();
  return games.slice(0, 150).map((g) => ({ id: g.id, slug: slugifyTitle(g.title) }));
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const game = await getGameById(params.id);
  if (!game) return {};
  const desc = trDescription(game).slice(0, 160);
  const title = `${game.title} — Ücretsiz Oyna | OYNAVA`;
  return {
    title,
    description: desc,
    alternates: seoAlternates(`/oyun/${game.id}/${slugifyTitle(game.title)}`),
    openGraph: { title, description: desc, images: [game.thumb], type: "article" },
    twitter: { card: "summary_large_image", title, description: desc, images: [game.thumb] },
  };
}

export default async function GamePage({ params }: { params: { id: string } }) {
  const game = await getGameById(params.id);
  if (!game) notFound();

  const locale = getLocale();
  const L = (p: string) => localePath(p, locale);
  const catSlug = categorySlug(game);
  const cat = categoryBySlug(catSlug);
  const related = (await getByCategory(catSlug)).filter((g) => g.id !== game.id).slice(0, 12);
  const inCollections = COLLECTIONS.filter((c) => (c.filter ? c.filter(game) : false)).slice(0, 6);

  const [desc, instr, faq, plays] = await Promise.all([
    gameDescription(game, locale),
    gameInstructions(game, locale),
    gameFaq(game, locale),
    getPlayCount(game.id),
  ]);
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
              { "@type": "ListItem", position: 2, name: cat?.tr ?? game.category, item: `${SITE.url}/kategori/${catSlug}` },
              { "@type": "ListItem", position: 3, name: game.title, item: url },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]}
      />
      <div className="space-y-6">
        <nav className="flex flex-wrap items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-slate-500">
          <Link href={L("/")} className="hover:text-secondary">{t(locale, "nav.home")}</Link>
          <span>/</span>
          <Link href={L(`/kategori/${catSlug}`)} className="hover:text-secondary">{t(locale, `cat.${catSlug}`)}</Link>
          <span>/</span>
          <span className="text-slate-300 normal-case">{game.title}</span>
        </nav>

        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="font-display text-2xl font-black text-ink md:text-3xl">{game.title}</h1>
          {plays > 0 && (
            <span className="font-mono text-xs text-slate-500">🔥 {plays.toLocaleString("tr-TR")} {t(locale, "game.plays")}</span>
          )}
        </div>

        <GamePlayer game={game} />

        <div className="card-base p-5">
          <h2 className="mb-2 font-display text-lg font-bold text-ink">🎯 {t(locale, "game.howToPlay")}</h2>
          <p className="whitespace-pre-line text-slate-400">{instr}</p>
        </div>

        <div className="card-base p-5">
          <h2 className="mb-2 font-display text-lg font-bold text-ink">{t(locale, "game.about")}</h2>
          <p className="text-slate-400">{desc}</p>
        </div>

        {/* SSS (FAQ) — rich snippet + içerik derinliği */}
        <div className="card-base p-5">
          <h2 className="mb-3 font-display text-lg font-bold text-ink">SSS</h2>
          <div className="space-y-3">
            {faq.map((f, i) => (
              <details key={i} className="group border-b border-line/60 pb-3 last:border-0">
                <summary className="cursor-pointer list-none font-semibold text-slate-200 marker:hidden">
                  <span className="text-secondary">▸ </span>{f.q}
                </summary>
                <p className="mt-2 whitespace-pre-line pl-4 text-sm text-slate-400">{f.a}</p>
              </details>
            ))}
          </div>
        </div>

        <section>
          <h2 className="mb-4 font-display text-xl font-bold text-ink">{t(locale, "game.similar")}</h2>
          <GameGrid games={related} />
        </section>
      </div>

      <aside className="space-y-4">
        <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR} className="min-h-[250px]" />

        {/* İç linkleme: oyunun ait olduğu koleksiyonlar */}
        {inCollections.length > 0 && (
          <div className="card-base p-4">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-300">
              {t(locale, "game.similar")}
            </h3>
            <div className="mt-3 flex flex-col gap-2">
              {inCollections.map((c) => (
                <Link key={c.slug} href={L(`/${c.slug}`)} className="text-sm text-slate-400 hover:text-secondary">
                  → {c.title}
                </Link>
              ))}
              <Link href={L(`/kategori/${catSlug}`)} className="text-sm text-neon hover:underline">
                → {t(locale, `cat.${catSlug}`)}
              </Link>
            </div>
          </div>
        )}

        <div className="card-base p-4">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-300">
            {t(locale, "game.tags")}
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {gameTagLinks(game).map((tg) => (
              <Link
                key={tg.slug}
                href={L(`/etiket/${tg.slug}`)}
                className="rounded-md bg-white/[0.06] px-2 py-1 text-xs text-slate-400 hover:bg-secondary/15 hover:text-secondary"
              >
                #{tg.label}
              </Link>
            ))}
          </div>
        </div>
        <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR} className="min-h-[250px]" />
      </aside>
    </div>
  );
}

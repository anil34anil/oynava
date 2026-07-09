import type { Metadata } from "next";
import Link from "next/link";
import { getGames, slugifyTitle, CATEGORIES } from "@/lib/games";
import { COLLECTIONS } from "@/lib/collections";
import { InfiniteGrid } from "@/components/InfiniteGrid";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import { t, localePath } from "@/lib/i18n";
import { getLocale } from "@/lib/localize";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Oyunlar — Binlerce Ücretsiz Oyun Oyna",
  description: "Binlerce ücretsiz oyun tek sayfada! Aksiyon, yarış, bulmaca ve daha fazlası — sonsuz kaydır, indirmeden anında oyun oyna.",
  alternates: { canonical: "/oyunlar" },
};

export default async function AllGamesPage() {
  const locale = getLocale();
  const games = await getGames();
  const L = (p: string) => localePath(p, locale);
  return (
    <div className="container-x space-y-6 py-6">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          numberOfItems: games.length,
          itemListElement: games.slice(0, 24).map((g, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE.url}/oyun/${g.id}/${slugifyTitle(g.title)}`,
            name: g.title,
          })),
        }}
      />
      <div className="flex items-center gap-3">
        <h1 className="font-display text-3xl font-black text-ink neon-text">{t(locale, "nav.all")}</h1>
        <span className="rounded-full border border-line px-3 py-1 text-sm text-slate-400">
          {games.length} {t(locale, "common.gamesCount")}
        </span>
      </div>
      <InfiniteGrid games={games} />

      {/* İç linkleme: kategoriler + koleksiyonlar (yetim sayfa bırakma, crawl derinliği) */}
      <section className="space-y-3 border-t border-line pt-6">
        <h2 className="font-display text-lg font-bold text-ink">{t(locale, "nav.categories")}</h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={L(`/kategori/${c.slug}`)}
              className="rounded-lg border border-line bg-white/5 px-3 py-1.5 text-sm text-slate-300 transition hover:border-neon hover:text-neon"
            >
              {t(locale, `cat.${c.slug}`)}
            </Link>
          ))}
        </div>
        <h2 className="pt-2 font-display text-lg font-bold text-ink">Koleksiyonlar</h2>
        <div className="flex flex-wrap gap-2">
          {COLLECTIONS.slice(0, 16).map((c) => (
            <Link
              key={c.slug}
              href={L(`/${c.slug}`)}
              className="rounded-lg border border-line bg-white/5 px-3 py-1.5 text-sm text-slate-300 transition hover:border-secondary hover:text-secondary"
            >
              {c.title}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

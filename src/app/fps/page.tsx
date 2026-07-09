import type { Metadata } from "next";
import Link from "next/link";
import { getFps, slugifyTitle, CATEGORIES } from "@/lib/games";
import { COLLECTIONS } from "@/lib/collections";
import { InfiniteGrid } from "@/components/InfiniteGrid";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import { t, localePath } from "@/lib/i18n";
import { getLocale, localizeText } from "@/lib/localize";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "FPS & Nişancı Oyunları — Online Atış Oyunları",
  description:
    "FPS ve nişancı oyunları: Blast Buddies tarzı blocky 3D online atış oyunları, battle royale, sniper ve çok oyunculu nişancılar. Ücretsiz, indirmeden tarayıcında oyna.",
  alternates: { canonical: "/fps" },
  openGraph: {
    title: "FPS & Nişancı Oyunları — Online Atış Oyunları",
    description: "Blocky 3D online FPS, battle royale ve sniper oyunları — ücretsiz, tarayıcıda.",
  },
};

export default async function FpsPage() {
  const locale = getLocale();
  const games = await getFps();
  const L = (p: string) => localePath(p, locale);
  const intro =
    locale === "tr"
      ? "Blast Buddies tarzı blocky 3D online atış oyunları, battle royale, sniper ve çok oyunculu nişancılar tek yerde. Silahını kuşan, rakiplerini alt et — ücretsiz, üyeliksiz, indirmeden tarayıcında oyna."
      : await localizeText(
          "Blast Buddies-style blocky 3D online shooters, battle royale, sniper and multiplayer FPS games in one place. Gear up and beat your rivals — free, no signup, play in your browser.",
          locale,
        );
  return (
    <div className="container-x space-y-6 py-6">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "FPS & Nişancı Oyunları",
          description: "Online FPS, battle royale ve nişancı oyunları koleksiyonu.",
          url: `${SITE.url}/fps`,
          inLanguage: "tr-TR",
          isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
        }}
      />
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
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-neon-purple/40 bg-neon-purple/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-neon-purple">
          🎯 FPS
        </span>
        <h1 className="font-display text-3xl font-black text-ink neon-text">{t(locale, "nav.fps")}</h1>
        <span className="rounded-full border border-line px-3 py-1 text-sm text-slate-400">{games.length} {t(locale, "common.gamesCount")}</span>
      </div>
      <p className="max-w-3xl text-slate-400">{intro}</p>

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

import Link from "next/link";
import type { Metadata } from "next";
import { getGames } from "@/lib/games";
import { topTags, MIN_TAG_GAMES } from "@/lib/tags";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import { t, localePath } from "@/lib/i18n";
import { getLocale } from "@/lib/localize";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Tüm Etiketler — Oyun Konuları",
  description: "Zombi, drift, futbol, giydirme ve yüzlerce oyun etiketi. İlgilendiğin konudaki ücretsiz oyunları tek tıkla keşfet.",
  alternates: { canonical: "/etiketler" },
};

export default async function TagsHubPage() {
  const games = await getGames();
  const tags = topTags(games, MIN_TAG_GAMES, 400);
  const locale = getLocale();
  const L = (p: string) => localePath(p, locale);

  return (
    <div className="container-x space-y-6 py-6">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Tüm Etiketler",
          url: `${SITE.url}/etiketler`,
          inLanguage: "tr-TR",
          isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
        }}
      />
      <nav className="font-mono text-xs uppercase tracking-wider text-slate-500">
        <Link href={L("/")} className="hover:text-secondary">{t(locale, "nav.home")}</Link>
        <span className="px-1.5">/</span>
        <span className="text-slate-300">Etiketler</span>
      </nav>

      <h1 className="font-display text-3xl font-black text-ink neon-text">Oyun Etiketleri</h1>
      <p className="max-w-3xl text-slate-400">
        İlgilendiğin konuya göre oyun keşfet. {tags.length}+ etiket arasından seç; her biri o konudaki en iyi
        ücretsiz oyunları bir araya getirir.
      </p>

      <div className="flex flex-wrap gap-2">
        {tags.map((tg) => (
          <Link
            key={tg.slug}
            href={L(`/etiket/${tg.slug}`)}
            className="rounded-lg border border-line bg-white/5 px-3 py-1.5 text-sm text-slate-300 transition hover:border-neon hover:text-neon"
          >
            #{tg.label} <span className="text-slate-500">{tg.count}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

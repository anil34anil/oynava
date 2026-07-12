import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getGames } from "@/lib/games";
import { COLLECTIONS, collectionBySlug, selectCollectionGames } from "@/lib/collections";
import { CATEGORIES, slugifyTitle } from "@/lib/catalog";
import { GameGrid } from "@/components/GameGrid";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import { seoAlternates } from "@/lib/seo";
import { t, localePath } from "@/lib/i18n";
import { getLocale } from "@/lib/localize";
import { translateText } from "@/lib/translate";
import { getTopPlayedIds } from "@/lib/kv";
import { COLLECTION_CONTENT } from "@/lib/collectionContent";

export const revalidate = 3600;

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ collection: c.slug }));
}

export async function generateMetadata({ params }: { params: { collection: string } }): Promise<Metadata> {
  const c = collectionBySlug(params.collection);
  if (!c) return { title: "Sayfa bulunamadı" };
  const desc = c.intro.slice(0, 160);
  return {
    title: `${c.title} — Ücretsiz Oyna | OYNAVA`,
    description: desc,
    keywords: c.keywords,
    alternates: seoAlternates(`/${c.slug}`),
    openGraph: { title: `${c.title} — Ücretsiz Oyna`, description: desc, type: "website" },
  };
}

export default async function CollectionPage({ params }: { params: { collection: string } }) {
  const c = collectionBySlug(params.collection);
  if (!c) notFound();

  const locale = getLocale();
  const all = await getGames();
  let games: typeof all;
  if (c.special === "mostPlayed") {
    const ids = await getTopPlayedIds(120);
    const byId = new Map(all.map((g) => [g.id, g]));
    games = ids.map((id) => byId.get(id)).filter(Boolean) as typeof all;
    if (games.length < 12) games = all.slice(0, 60); // henüz oynanma verisi yoksa
  } else {
    games = selectCollectionGames(c, all);
  }
  if (games.length === 0) notFound();

  const [title, intro] =
    locale === "tr"
      ? [c.title, c.intro]
      : await Promise.all([translateText(c.title, locale, "tr"), translateText(c.intro, locale, "tr")]);

  // İç linkler: diğer koleksiyonlar + kategoriler (yetim sayfa bırakma)
  const others = COLLECTIONS.filter((x) => x.slug !== c.slug).slice(0, 8);
  const L = (p: string) => localePath(p, locale);
  // Özgün gövde metni — yalnız en yüksek öncelikli koleksiyonlarda ve yalnız TR'de (çeviri maliyeti)
  const bodyTr = locale === "tr" ? COLLECTION_CONTENT[c.slug] ?? [] : [];

  return (
    <div className="container-x space-y-6 py-6">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: c.title,
            description: c.intro,
            url: `${SITE.url}/${c.slug}`,
            inLanguage: "tr-TR",
            isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE.url },
              { "@type": "ListItem", position: 2, name: c.title, item: `${SITE.url}/${c.slug}` },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            numberOfItems: games.length,
            itemListElement: games.slice(0, 24).map((g, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${SITE.url}/oyun/${g.id}/${slugifyTitle(g.title)}`,
              name: g.title,
            })),
          },
        ]}
      />

      <nav className="font-mono text-xs uppercase tracking-wider text-slate-500">
        <Link href={L("/")} className="hover:text-secondary">{t(locale, "nav.home")}</Link>
        <span className="px-1.5">/</span>
        <span className="text-slate-300">{title}</span>
      </nav>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl font-black text-ink neon-text">{title}</h1>
        <span className="rounded-full border border-line px-3 py-1 text-sm text-slate-400">
          {games.length} {t(locale, "common.gamesCount")}
        </span>
      </div>
      <p className="max-w-3xl text-slate-400">{intro}</p>

      <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_TOP} className="min-h-[90px]" />

      <GameGrid games={games} priorityCount={6} />

      {/* Özgün koleksiyon içeriği (SEO derinliği + AdSense değerli içerik) — yalnız TR, seçili koleksiyonlarda */}
      {bodyTr.length > 0 && (
        <section className="border-t border-line pt-6">
          <h2 className="mb-3 font-display text-xl font-bold text-ink">{c.title} Hakkında</h2>
          <div className="max-w-3xl space-y-3">
            {bodyTr.map((p, i) => (
              <p key={i} className="text-slate-400">{p}</p>
            ))}
          </div>
        </section>
      )}

      {/* İç linkleme: ilgili koleksiyonlar + kategoriler */}
      <section className="space-y-3 border-t border-line pt-6">
        <h2 className="font-display text-lg font-bold text-ink">İlgili Koleksiyonlar</h2>
        <div className="flex flex-wrap gap-2">
          {others.map((o) => (
            <Link
              key={o.slug}
              href={L(`/${o.slug}`)}
              className="rounded-lg border border-line bg-white/5 px-3 py-1.5 text-sm text-slate-300 transition hover:border-secondary hover:text-secondary"
            >
              {o.title}
            </Link>
          ))}
        </div>
        <h2 className="pt-2 font-display text-lg font-bold text-ink">{t(locale, "nav.categories")}</h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={L(`/kategori/${cat.slug}`)}
              className="rounded-lg border border-line bg-white/5 px-3 py-1.5 text-sm text-slate-300 transition hover:border-neon hover:text-neon"
            >
              {t(locale, `cat.${cat.slug}`)}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

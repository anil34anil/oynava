import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getGames } from "@/lib/games";
import { CATEGORIES, slugifyTitle } from "@/lib/catalog";
import { topTags, tagBySlug, MIN_TAG_GAMES } from "@/lib/tags";
import { GameGrid } from "@/components/GameGrid";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import { t, localePath } from "@/lib/i18n";
import { getLocale } from "@/lib/localize";

export const revalidate = 3600;

// En güçlü ~180 etiket build'de pre-render (SSG); kalanlar ilk istekte ISR.
export async function generateStaticParams() {
  const games = await getGames();
  return topTags(games, MIN_TAG_GAMES, 180).map((tg) => ({ tag: tg.slug }));
}

export async function generateMetadata({ params }: { params: { tag: string } }): Promise<Metadata> {
  const games = await getGames();
  const tg = tagBySlug(games, params.tag);
  if (!tg) return { title: "Etiket bulunamadı" };
  const desc = `${tg.label} oyunlarının en iyileri OYNAVA'da. ${tg.games.length} ücretsiz ${tg.label} oyununu indirmeden, tarayıcında oyna.`;
  return {
    title: `${tg.label} Oyunları — Ücretsiz Oyna`,
    description: desc.slice(0, 160),
    alternates: { canonical: `/etiket/${params.tag}` },
    openGraph: { title: `${tg.label} Oyunları — Ücretsiz Oyna`, description: desc.slice(0, 160) },
    // İnce etiket sayfaları (az oyun) indekslenmesin — sadece kullanıcı için.
    ...(tg.games.length < MIN_TAG_GAMES ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function TagPage({ params }: { params: { tag: string } }) {
  const games = await getGames();
  const tg = tagBySlug(games, params.tag);
  if (!tg) notFound();

  const locale = getLocale();
  const L = (p: string) => localePath(p, locale);
  const list = tg.games;
  const intro = `${tg.label} sevenler için en iyi ücretsiz oyunlar burada. ${list.length} ${tg.label.toLocaleLowerCase("tr")} oyununu indirmeden, üyelik gerekmeden doğrudan tarayıcında oynayabilirsin. Liste yeni oyunlarla sürekli güncellenir.`;

  // İç linkleme: ilgili diğer etiketler (yetim sayfa bırakma)
  const related = topTags(games, MIN_TAG_GAMES, 40)
    .filter((x) => x.slug !== params.tag)
    .slice(0, 14);

  return (
    <div className="container-x space-y-6 py-6">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${tg.label} Oyunları`,
            description: intro,
            url: `${SITE.url}/etiket/${params.tag}`,
            inLanguage: "tr-TR",
            isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE.url },
              { "@type": "ListItem", position: 2, name: "Etiketler", item: `${SITE.url}/etiketler` },
              { "@type": "ListItem", position: 3, name: `${tg.label} Oyunları`, item: `${SITE.url}/etiket/${params.tag}` },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            numberOfItems: list.length,
            itemListElement: list.slice(0, 24).map((g, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${SITE.url}/oyun/${g.id}/${slugifyTitle(g.title)}`,
              name: g.title,
            })),
          },
        ]}
      />

      <nav className="flex flex-wrap items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-slate-500">
        <Link href={L("/")} className="hover:text-secondary">{t(locale, "nav.home")}</Link>
        <span>/</span>
        <Link href={L("/etiketler")} className="hover:text-secondary">Etiketler</Link>
        <span>/</span>
        <span className="text-slate-300 normal-case">{tg.label}</span>
      </nav>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl font-black text-ink neon-text">#{tg.label} Oyunları</h1>
        <span className="rounded-full border border-line px-3 py-1 text-sm text-slate-400">
          {list.length} {t(locale, "common.gamesCount")}
        </span>
      </div>
      <p className="max-w-3xl text-slate-400">{intro}</p>

      <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_TOP} className="min-h-[90px]" />

      <GameGrid games={list} priorityCount={6} />

      {/* İç linkleme: ilgili etiketler + kategoriler */}
      <section className="space-y-3 border-t border-line pt-6">
        <h2 className="font-display text-lg font-bold text-ink">İlgili Etiketler</h2>
        <div className="flex flex-wrap gap-2">
          {related.map((r) => (
            <Link
              key={r.slug}
              href={L(`/etiket/${r.slug}`)}
              className="rounded-lg border border-line bg-white/5 px-3 py-1.5 text-sm text-slate-300 transition hover:border-secondary hover:text-secondary"
            >
              #{r.label}
            </Link>
          ))}
        </div>
        <h2 className="pt-2 font-display text-lg font-bold text-ink">{t(locale, "nav.categories")}</h2>
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
      </section>
    </div>
  );
}

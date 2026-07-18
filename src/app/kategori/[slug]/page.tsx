import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getByCategory, categoryBySlug, CATEGORIES, slugifyTitle } from "@/lib/games";
import { COLLECTIONS } from "@/lib/collections";
import { GameGrid } from "@/components/GameGrid";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import { t, localePath } from "@/lib/i18n";
import { getLocale } from "@/lib/localize";
import { translateText } from "@/lib/translate";
import { CATEGORY_CONTENT } from "@/lib/categoryContent";
import { relatedPostsForCategorySlug } from "@/lib/relatedContent";

// Kategori başına SSS (rich snippet + içerik derinliği). Şablon ama kategori adıyla özgünleşir.
function catFaq(catTr: string, topTitles: string[], count: number) {
  const name = catTr.toLocaleLowerCase("tr");
  return [
    {
      q: `${catTr} oyunları ücretsiz mi?`,
      a: `Evet. OYNAVA'daki tüm ${name} oyunları tamamen ücretsizdir; indirme, kurulum veya ödeme gerekmez. Sayfayı açtığın an doğrudan tarayıcında oynamaya başlarsın.`,
    },
    {
      q: `En iyi ${name} oyunları hangileri?`,
      a: topTitles.length
        ? `Şu an en çok oynanan ${name} oyunları arasında ${topTitles.slice(0, 3).join(", ")} öne çıkıyor. ${count}+ oyunun tamamı bu sayfada, popülerliğe göre sıralı.`
        : `Bu sayfadaki ${count}+ oyunu popülerliğe göre sıraladık; en üsttekiler en çok oynananlardır.`,
    },
    {
      q: `${catTr} oyunları telefonda oynanır mı?`,
      a: `Evet. Tüm oyunlar HTML5 tabanlıdır; telefon, tablet ve bilgisayarda dokunmatik veya klavyeyle akıcı çalışır. Ayrı uygulama indirmene gerek yoktur.`,
    },
    {
      q: `Oynamak için üye olmam gerekir mi?`,
      a: `Hayır, üyelik zorunlu değildir. İstersen favori ${name} oyunlarını kaydetmek ve beğeni bırakmak için ücretsiz hesap açabilirsin.`,
    },
  ];
}

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const cat = categoryBySlug(params.slug);
  if (!cat) return {};
  const desc = `${CATEGORY_CONTENT[cat.slug]?.lead ?? `En iyi ${cat.tr.toLowerCase()} oyunları.`} Ücretsiz, indirmeden tarayıcında oyna.`;
  return {
    title: `${cat.tr} Oyunları — Ücretsiz Oyna`,
    description: desc.slice(0, 160),
    alternates: { canonical: `/kategori/${cat.slug}` },
    openGraph: { title: `${cat.tr} Oyunları — Ücretsiz Oyna`, description: desc.slice(0, 160) },
  };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const cat = categoryBySlug(params.slug);
  if (!cat) notFound();

  const locale = getLocale();
  const games = await getByCategory(params.slug);
  const catName = t(locale, `cat.${cat.slug}`);
  const cc = CATEGORY_CONTENT[cat.slug];
  const introTr = cc?.lead ?? `En iyi ${cat.tr.toLowerCase()} oyunları, ücretsiz ve indirmeden.`;
  const intro = locale === "tr" ? introTr : await translateText(introTr, locale, "tr");
  // Uzun özgün gövde metni (yalnız TR'de; çeviri maliyeti/kalitesi için diğer dillerde lead yeterli)
  const bodyTr = locale === "tr" ? cc?.body ?? [] : [];
  const L = (p: string) => localePath(p, locale);

  const faq = catFaq(cat.tr, games.slice(0, 3).map((g) => g.title), games.length);
  // İç linkleme: diğer kategoriler + bu kategoriyle ilgili koleksiyonlar (yetim sayfa bırakma)
  const otherCats = CATEGORIES.filter((c) => c.slug !== cat.slug);
  const relatedCollections = COLLECTIONS.filter(
    (c) => c.filter && games.slice(0, 30).some((g) => c.filter!(g)),
  ).slice(0, 6);
  const relatedPosts = relatedPostsForCategorySlug(cat.slug);

  return (
    <div className="container-x space-y-6 py-6">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${cat.tr} Oyunları`,
          description: cc?.lead,
          url: `${SITE.url}/kategori/${cat.slug}`,
          inLanguage: "tr-TR",
          isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE.url },
            { "@type": "ListItem", position: 2, name: `${cat.tr} Oyunları`, item: `${SITE.url}/kategori/${cat.slug}` },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
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
      <div className="flex items-center gap-3">
        <h1 className="font-display text-3xl font-black text-ink neon-text">{catName}</h1>
        <span className="rounded-full border border-line px-3 py-1 text-sm text-slate-400">
          {games.length} {t(locale, "common.gamesCount")}
        </span>
      </div>

      {/* SEO + kullanıcı için kategori tanıtımı */}
      <p className="max-w-3xl text-slate-400">{intro}</p>

      <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_TOP} className="min-h-[90px]" />

      <GameGrid games={games} priorityCount={6} />

      {/* SSS — rich snippet + içerik derinliği */}
      <section className="border-t border-line pt-6">
        <h2 className="mb-3 font-display text-xl font-bold text-ink">
          {cat.tr} Oyunları — Sık Sorulan Sorular
        </h2>
        <div className="max-w-3xl space-y-3">
          {faq.map((f, i) => (
            <details key={i} className="group border-b border-line/60 pb-3 last:border-0">
              <summary className="cursor-pointer list-none font-semibold text-slate-200 marker:hidden">
                <span className="text-secondary">▸ </span>
                {f.q}
              </summary>
              <p className="mt-2 pl-4 text-sm text-slate-400">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Özgün kategori içeriği (SEO derinliği + AdSense değerli içerik) — yalnız TR */}
      {bodyTr.length > 0 && (
        <section className="border-t border-line pt-6">
          <h2 className="mb-3 font-display text-xl font-bold text-ink">{cat.tr} Oyunları Hakkında</h2>
          <div className="max-w-3xl space-y-3">
            {bodyTr.map((p, i) => (
              <p key={i} className="text-slate-400">{p}</p>
            ))}
          </div>
        </section>
      )}

      {/* İlgili rehberler: blog'dan bu kategoriye link denkliği geri akışı (SEO) */}
      {relatedPosts.length > 0 && locale === "tr" && (
        <section className="border-t border-line pt-6">
          <h2 className="mb-3 font-display text-lg font-bold text-ink">İlgili Rehberler</h2>
          <div className="flex flex-wrap gap-2">
            {relatedPosts.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="rounded-lg border border-line bg-white/5 px-3 py-1.5 text-sm text-slate-300 transition hover:border-tertiary hover:text-tertiary"
              >
                📖 {p.label}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* İç linkleme: ilgili koleksiyonlar + diğer kategoriler */}
      <section className="space-y-3 border-t border-line pt-6">
        {relatedCollections.length > 0 && (
          <>
            <h2 className="font-display text-lg font-bold text-ink">İlgili Koleksiyonlar</h2>
            <div className="flex flex-wrap gap-2">
              {relatedCollections.map((c) => (
                <Link
                  key={c.slug}
                  href={L(`/${c.slug}`)}
                  className="rounded-lg border border-line bg-white/5 px-3 py-1.5 text-sm text-slate-300 transition hover:border-secondary hover:text-secondary"
                >
                  {c.title}
                </Link>
              ))}
            </div>
          </>
        )}
        <h2 className="pt-2 font-display text-lg font-bold text-ink">Diğer Kategoriler</h2>
        <div className="flex flex-wrap gap-2">
          {otherCats.map((c) => (
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

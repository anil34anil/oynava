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

// Etiket sayfaları arasında duplicate içerik olmasın diye giriş metni slug'a göre varyasyonlanır.
function tagIntro(label: string, count: number, topTitles: string[]): string {
  const low = label.toLocaleLowerCase("tr");
  let h = 0;
  for (let i = 0; i < label.length; i++) h = (h * 31 + label.charCodeAt(i)) >>> 0;
  const openers = [
    `${label} sevenler için elimizdeki en iyi ücretsiz oyunları bu sayfada topladık.`,
    `En sevilen ${low} oyunlarını mı arıyorsun? Doğru yerdesin.`,
    `${label} temalı ${count} oyun, tek listede ve tamamen ücretsiz.`,
    `İşte tarayıcında oynayabileceğin en iyi ${low} oyunları.`,
  ];
  const closers = [
    `Hepsi indirme ve üyelik gerektirmeden, doğrudan tarayıcında açılır.`,
    `Telefon, tablet ve bilgisayarda akıcı çalışır; kurulum yok.`,
    `Liste yeni oyunlarla sürekli güncellenir — favorilerini kaydetmeyi unutma.`,
  ];
  const top = topTitles.length ? ` Öne çıkanlar: ${topTitles.slice(0, 3).join(", ")}.` : "";
  return `${openers[h % openers.length]}${top} ${closers[h % closers.length]}`;
}

function tagFaq(label: string, count: number) {
  const low = label.toLocaleLowerCase("tr");
  return [
    {
      q: `${label} oyunları ücretsiz mi?`,
      a: `Evet, bu sayfadaki ${count} ${low} oyununun tamamı ücretsizdir. İndirme, kurulum veya ödeme gerekmez; sayfayı açtığın an oynamaya başlarsın.`,
    },
    {
      q: `${label} oyunları telefonda çalışır mı?`,
      a: `Çalışır. Oyunlar HTML5 tabanlıdır ve telefon, tablet ve bilgisayarda dokunmatik veya klavyeyle akıcı şekilde oynanır.`,
    },
    {
      q: `Oynamak için üye olmam gerekir mi?`,
      a: `Hayır. ${label} oyunlarını üyelik olmadan oynayabilirsin; istersen favorilerini kaydetmek için ücretsiz hesap açabilirsin.`,
    },
  ];
}

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
  const topTitles = list.slice(0, 3).map((g) => g.title);
  const intro = tagIntro(tg.label, list.length, topTitles);
  const faq = tagFaq(tg.label, list.length);

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

      {/* SSS — rich snippet + içerik derinliği */}
      <section className="border-t border-line pt-6">
        <h2 className="mb-3 font-display text-xl font-bold text-ink">{tg.label} Oyunları — Sık Sorulan Sorular</h2>
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

import type { Metadata } from "next";
import Link from "next/link";
import { getOnline, slugifyTitle, CATEGORIES } from "@/lib/games";
import { COLLECTIONS } from "@/lib/collections";
import { InfiniteGrid } from "@/components/InfiniteGrid";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import { t, localePath } from "@/lib/i18n";
import { getLocale, localizeText } from "@/lib/localize";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Online Oyunlar — Çok Oyunculu & .io & FPS",
  description:
    "Online oynanan oyunlar: çok oyunculu .io arenaları, online FPS nişancı oyunları ve canlı rekabet. Ücretsiz, indirmeden tarayıcında oyna.",
  alternates: { canonical: "/online" },
  openGraph: { title: "Online Oyunlar — Çok Oyunculu & .io & FPS", description: "Online FPS, .io ve çok oyunculu oyunlar — ücretsiz, tarayıcıda." },
};

const ONLINE_FAQ: { q: string; a: string }[] = [
  {
    q: "Online oyunlar için üyelik veya indirme gerekir mi?",
    a: "Hayır. Tüm online oyunlar tarayıcıda çalışır; üyelik veya indirme olmadan doğrudan oynamaya başlarsın.",
  },
  {
    q: ".io oyunları nasıl oynanır?",
    a: "Küçük başlar, harita üzerinde büyüyerek veya puan toplayarak diğer oyunculara karşı rekabet edersin. Kurallar basittir, birkaç saniyede öğrenilir.",
  },
  {
    q: "Online FPS oyunlarında gecikme (ping) neden önemli?",
    a: "Yüksek gecikme, nişan alma ve hareket hissini geciktirir. Kararlı bir internet bağlantısı ve güncel bir tarayıcı kullanmak deneyimi belirgin iyileştirir.",
  },
  {
    q: "Aynı anda kaç oyuncuyla oynanır?",
    a: "Oyuna göre değişir; bazı .io arenalarında onlarca, bazı online FPS modlarında ise birkaç oyuncu aynı anda rekabet eder.",
  },
];

export default async function OnlinePage() {
  const locale = getLocale();
  const games = await getOnline();
  const L = (p: string) => localePath(p, locale);
  const intro =
    locale === "tr"
      ? "Çok oyunculu .io arenaları, online FPS nişancı oyunları ve canlı rekabet. Dünyanın dört bir yanından oyuncularla aynı anda oyna — ücretsiz, üyeliksiz, indirmeden."
      : await localizeText(
          "Multiplayer .io arenas, online FPS shooters and live competition. Play with players from around the world at the same time — free, no signup, no download.",
          locale,
        );
  return (
    <div className="container-x space-y-6 py-6">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Online Oyunlar",
          description: "Çok oyunculu .io ve online FPS oyunları.",
          url: `${SITE.url}/online`,
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
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: ONLINE_FAQ.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> Online
        </span>
        <h1 className="font-display text-3xl font-black text-ink neon-text">{t(locale, "nav.online")}</h1>
        <span className="rounded-full border border-line px-3 py-1 text-sm text-slate-400">{games.length} {t(locale, "common.gamesCount")}</span>
      </div>
      <p className="max-w-3xl text-slate-400">{intro}</p>

      <InfiniteGrid games={games} />

      {locale === "tr" && (
        <section className="border-t border-line pt-6">
          <h2 className="mb-3 font-display text-xl font-bold text-ink">Online Oyunlar — Sık Sorulan Sorular</h2>
          <div className="max-w-3xl space-y-3">
            {ONLINE_FAQ.map((f, i) => (
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
      )}

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

import Link from "next/link";
import { getGames } from "@/lib/games";
import { categorySlug, CATEGORIES, isOnline } from "@/lib/catalog";
import { GameGrid } from "@/components/GameGrid";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import { t, localePath } from "@/lib/i18n";
import { getLocale, localizeText } from "@/lib/localize";

const CAT_ICON: Record<string, string> = {
  aksiyon: "💥", macera: "🗺️", yaris: "🏎️", spor: "⚽", dovus: "🥊",
  bulmaca: "🧩", zeka: "♟️", io: "🌐", kiz: "💖", cocuk: "🧸", arcade: "🕹️", "3d": "🧊",
};

export default async function HomePage() {
  const locale = getLocale();
  const L = (p: string) => localePath(p, locale);
  const games = await getGames();
  const isTr = locale === "tr";
  const [premiumTitle, premiumDesc, onlineDesc, exploreLabel, liveLabel] = await Promise.all([
    localizeText("High-Graphics 3D & WebGL Games", locale),
    localizeText("The best racing, FPS, .io battle and 3D games — free, no download.", locale),
    localizeText("Multiplayer .io arenas and online FPS — live competition with players from around the world.", locale),
    localizeText("Explore", locale),
    localizeText("Live", locale),
  ]);

  const popular = games.slice(0, 24);
  const online = games.filter(isOnline).slice(0, 12);

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
      {/* Oyunlar hemen görünsün — siteye girer girmez oynamaya başla */}
      <section>
        <h1 className="mb-4 font-display text-2xl font-black text-ink">🔥 {t(locale, "home.popular")}</h1>
        <GameGrid games={popular} priorityCount={6} />
      </section>

      {/* Kategori hızlı erişim ikonları */}
      <section>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-12">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={L(`/kategori/${c.slug}`)}
              className="group flex flex-col items-center gap-1.5 rounded-2xl border border-line bg-card/60 py-3 transition hover:-translate-y-0.5 hover:border-neon hover:bg-card"
            >
              <span className="text-2xl transition group-hover:scale-110">{CAT_ICON[c.slug] ?? "🎮"}</span>
              <span className="px-1 text-center text-[11px] font-semibold leading-tight text-slate-400 group-hover:text-neon">
                {t(locale, `cat.${c.slug}`)}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Premium tanıtım banner */}
      <Link
        href={L("/premium")}
        className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-neon-purple/30 bg-gradient-to-r from-neon-purple/15 via-card to-neon/10 p-6 transition hover:border-neon-purple"
      >
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-neon-purple/20 blur-3xl" />
        <div className="relative">
          <span className="text-xs font-semibold uppercase tracking-widest text-neon-purple">
            ✦ {t(locale, "nav.premium")}
          </span>
          <h2 className="mt-1 font-display text-2xl font-black text-ink">
            {isTr ? "Yüksek Grafikli 3D & WebGL Oyunlar" : premiumTitle}
          </h2>
          <p className="mt-1 max-w-md text-sm text-slate-400">
            {isTr ? "En kaliteli yarış, FPS, .io savaş ve 3D oyunlar — ücretsiz, indirme yok." : premiumDesc}
          </p>
        </div>
        <span className="btn-primary relative shrink-0 group-hover:scale-105">{exploreLabel} →</span>
      </Link>

      <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_TOP} className="min-h-[90px]" />

      {/* Online Oyunlar widget'ı */}
      {online.length > 0 && (
        <section className="cv-auto rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.04] p-5">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-ink">
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-widest text-emerald-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> {liveLabel}
              </span>
              🌐 {t(locale, "nav.online")}
            </h2>
            <Link href={L("/online")} className="text-sm font-semibold text-emerald-400 hover:underline">
              {t(locale, "common.seeAll")} →
            </Link>
          </div>
          <p className="mb-4 max-w-2xl text-sm text-slate-400">
            {isTr
              ? "Çok oyunculu .io arenaları ve online FPS — dünyanın dört bir yanından oyuncularla canlı rekabet."
              : onlineDesc}
          </p>
          <GameGrid games={online} />
        </section>
      )}

      {rows.map(({ cat, items }) => (
        <section key={cat.slug} className="cv-auto">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="flex items-center gap-2 font-display text-xl font-bold text-ink">
              <span>{CAT_ICON[cat.slug] ?? "🎮"}</span> {t(locale, `cat.${cat.slug}`)}
            </h2>
            <Link href={L(`/kategori/${cat.slug}`)} className="text-sm font-semibold text-neon hover:underline">
              {t(locale, "common.seeAll")} →
            </Link>
          </div>
          <GameGrid games={items} />
        </section>
      ))}

      <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_BOTTOM} className="min-h-[90px]" />
    </div>
  );
}

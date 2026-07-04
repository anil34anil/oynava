import Link from "next/link";
import { getGames } from "@/lib/games";
import { categorySlug, CATEGORIES, isOnline, slugifyTitle } from "@/lib/catalog";
import { GameGrid } from "@/components/GameGrid";
import { AdSlot } from "@/components/AdSlot";
import { RecentlyPlayedRail } from "@/components/RecentlyPlayedRail";
import { JsonLd } from "@/components/JsonLd";
import { COLLECTIONS } from "@/lib/collections";
import { topTags, MIN_TAG_GAMES } from "@/lib/tags";
import { t, localePath } from "@/lib/i18n";
import { getLocale, localizeText } from "@/lib/localize";

// Ana sayfa SSS — rich snippet + özgün içerik (SEO)
const HOME_FAQ = [
  { q: "OYNAVA nedir?", a: "OYNAVA, binlerce ücretsiz HTML5 oyunu tek çatı altında toplayan Türkçe oyun portalıdır. Aksiyon, yarış, .io, bulmaca, spor ve daha birçok türde oyunu indirme yapmadan doğrudan tarayıcında oynarsın." },
  { q: "Oyunlar gerçekten ücretsiz mi?", a: "Evet, tüm oyunlar tamamen ücretsizdir. Gizli ücret, ödeme veya abonelik yoktur; site reklam gelirleriyle desteklenir." },
  { q: "İndirme veya kurulum gerekiyor mu?", a: "Hayır. Oyunlar tarayıcı tabanlıdır (HTML5/WebGL); oyunun üzerine tıkla, saniyeler içinde açılır. Uygulama indirmene gerek yok." },
  { q: "Mobilde (telefon/tablet) oynayabilir miyim?", a: "Evet. Oyunların çoğu dokunmatik kontrollerle telefon ve tablette akıcı çalışır. Sitemizi ana ekrana ekleyerek uygulama gibi de kullanabilirsin." },
  { q: "Üye olmam gerekiyor mu?", a: "Hayır, oynamak için üyelik zorunlu değildir. İstersen favori oyunlarını kaydetmek, günlük ödül ve başarımlar kazanmak için ücretsiz hesap açabilirsin." },
  { q: "Hangi tür oyunlar var?", a: "Araba ve yarış, nişancı (FPS), .io çok oyunculu, bulmaca, zekâ, spor, dövüş, kız oyunları, çocuk ve 3D oyunlar dahil geniş bir yelpaze bulunur." },
];

const CAT_ICON: Record<string, string> = {
  aksiyon: "💥", macera: "🗺️", yaris: "🏎️", spor: "⚽", dovus: "🥊",
  bulmaca: "🧩", zeka: "♟️", io: "🌐", kiz: "💖", cocuk: "🧸", arcade: "🕹️", "3d": "🧊",
};

export const revalidate = 3600;

export default async function HomePage() {
  const locale = getLocale();
  const L = (p: string) => localePath(p, locale);
  const games = await getGames();
  const isTr = locale === "tr";
  const [premiumTitle, premiumDesc, onlineDesc, exploreLabel, liveLabel, gotdLabel] = await Promise.all([
    localizeText("High-Graphics 3D & WebGL Games", locale),
    localizeText("The best racing, FPS, .io battle and 3D games — free, no download.", locale),
    localizeText("Multiplayer .io arenas and online FPS — live competition with players from around the world.", locale),
    localizeText("Explore", locale),
    localizeText("Live", locale),
    localizeText("Game of the Day", locale),
  ]);
  // Günün Oyunu — günlük deterministik seçim (ArcadeCMS "game of the day" paritesi)
  const dayKey = new Date().toISOString().slice(0, 10);
  let dh = 0;
  for (let i = 0; i < dayKey.length; i++) dh = (dh * 31 + dayKey.charCodeAt(i)) >>> 0;
  const gotd = games.length ? games[dh % games.length] : null;

  const popular = games.slice(0, 18);
  const online = games.filter(isOnline).slice(0, 8);

  // Tek geçişte kategorilere ayır (her kategori için tüm diziyi filtrelemek yerine)
  const byCat = new Map<string, typeof games>();
  for (const g of games) {
    const s = categorySlug(g);
    const arr = byCat.get(s);
    if (arr) {
      if (arr.length < 8) arr.push(g);
    } else byCat.set(s, [g]);
  }
  const rows = CATEGORIES.map((c) => ({ cat: c, items: byCat.get(c.slug) ?? [] })).filter((r) => r.items.length > 0);

  // İç linkleme + long-tail: popüler koleksiyonlar & etiketler
  const topCollections = COLLECTIONS.slice(0, 12);
  const popularTags = topTags(games, MIN_TAG_GAMES, 14);

  return (
    <div className="container-x space-y-10 py-6">
      {/* Kategori hızlı erişim ikonları — EN ÜSTTE */}
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

      {/* Günün Oyunu — kategorilerin hemen altında */}
      {gotd && (
        <Link
          href={L(`/oyun/${gotd.id}/${slugifyTitle(gotd.title)}`)}
          className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-neon/30 bg-gradient-to-r from-neon/15 via-card to-secondary/10 p-3 transition hover:border-neon sm:p-4"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={gotd.thumb} alt={gotd.title} width={112} height={84} loading="lazy" className="h-20 w-28 shrink-0 rounded-xl object-cover" />
          <div className="min-w-0">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-neon">🌟 {gotdLabel}</span>
            <div className="truncate font-display text-lg font-black text-ink sm:text-xl">{gotd.title}</div>
            <span className="text-sm text-slate-400">{gotd.category}</span>
          </div>
          <span className="btn-primary ml-auto shrink-0 group-hover:scale-105">▶</span>
        </Link>
      )}

      {/* Popüler oyunlar */}
      <section>
        <h1 className="mb-4 font-display text-2xl font-black text-ink">🔥 {t(locale, "home.popular")}</h1>
        <GameGrid games={popular} priorityCount={6} />
      </section>

      {/* Son oynadıkların — kişiselleştirilmiş ray (localStorage, sunucu maliyeti yok) */}
      <RecentlyPlayedRail />

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

      {/* ── SEO içerik bölümü (ana sayfa özgün metni + popüler konular + SSS) ── */}
      {isTr && (
        <section className="cv-auto space-y-6 border-t border-line pt-8">
          <div className="max-w-3xl space-y-3">
            <h2 className="font-display text-2xl font-black text-ink">Ücretsiz Oyunlar OYNAVA&apos;da</h2>
            <p className="text-slate-400">
              OYNAVA, binlerce <strong>ücretsiz online oyunu</strong> tek yerde toplayan Türkçe oyun portalıdır.
              Araba ve yarış oyunlarından nişancı (FPS) ve <Link href={L("/online")} className="text-secondary hover:underline">online .io oyunlarına</Link>,
              bulmaca ve zekâ oyunlarından kız ve çocuk oyunlarına kadar her zevke uygun binlerce HTML5 oyun burada.
              Hepsi <strong>indirme ve kurulum olmadan</strong>, doğrudan tarayıcında açılır.
            </p>
            <p className="text-slate-400">
              Oyunlar telefon, tablet ve bilgisayarda akıcı çalışır; üyelik zorunlu değildir. İstersen favori oyunlarını
              kaydedebilir, <Link href={L("/premium")} className="text-secondary hover:underline">premium 3D oyunları</Link> keşfedebilir
              veya <Link href={L("/oyunlar")} className="text-secondary hover:underline">tüm oyunlara</Link> göz atabilirsin.
              Yeni oyunlar sürekli eklenir — her gün yeni bir şeyler keşfet.
            </p>
          </div>

          {/* Popüler konular — iç linkleme (long-tail) */}
          <div className="space-y-3">
            <div className="flex items-end justify-between gap-3">
              <h2 className="font-display text-lg font-bold text-ink">Popüler Oyun Konuları</h2>
              <Link href={L("/koleksiyonlar")} className="shrink-0 text-sm font-semibold text-neon hover:underline">
                Tüm Koleksiyonlar →
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {topCollections.map((c) => (
                <Link key={c.slug} href={L(`/${c.slug}`)} className="rounded-lg border border-line bg-white/5 px-3 py-1.5 text-sm text-slate-300 transition hover:border-neon hover:text-neon">
                  {c.title}
                </Link>
              ))}
              {popularTags.map((tg) => (
                <Link key={tg.slug} href={L(`/etiket/${tg.slug}`)} className="rounded-lg border border-line bg-white/5 px-3 py-1.5 text-sm text-slate-300 transition hover:border-secondary hover:text-secondary">
                  #{tg.label}
                </Link>
              ))}
            </div>
          </div>

          {/* SSS */}
          <div className="space-y-3">
            <h2 className="font-display text-lg font-bold text-ink">Sık Sorulan Sorular</h2>
            <div className="max-w-3xl space-y-3">
              {HOME_FAQ.map((f, i) => (
                <details key={i} className="group border-b border-line/60 pb-3 last:border-0">
                  <summary className="cursor-pointer list-none font-semibold text-slate-200 marker:hidden">
                    <span className="text-secondary">▸ </span>{f.q}
                  </summary>
                  <p className="mt-2 pl-4 text-sm text-slate-400">{f.a}</p>
                </details>
              ))}
            </div>
          </div>

          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: HOME_FAQ.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            }}
          />
        </section>
      )}
    </div>
  );
}

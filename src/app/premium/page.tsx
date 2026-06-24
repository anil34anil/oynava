import type { Metadata } from "next";
import { getGames } from "@/lib/games";
import { categorySlug, slugifyTitle } from "@/lib/catalog";
import { InfiniteGrid } from "@/components/InfiniteGrid";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import { t } from "@/lib/i18n";
import { getLocale, localizeText } from "@/lib/localize";

export const metadata: Metadata = {
  title: "Premium Oyunlar — En İyi 3D ve WebGL Oyunlar",
  description: "En kaliteli 3D, WebGL, FPS, yarış ve .io savaş oyunları. Tarayıcında ücretsiz, yüksek grafikli oyun deneyimi.",
  alternates: { canonical: "/premium" },
};

const PREMIUM_CATS = ["3d", "aksiyon", "yaris", "io"];

export default async function PremiumPage() {
  const locale = getLocale();
  const all = await getGames();
  const intro =
    locale === "tr"
      ? "Yüksek grafikli 3D, WebGL, FPS, yarış ve .io savaş oyunlarının en iyileri — hepsi ücretsiz, indirme yok, tarayıcında akıcı."
      : await localizeText(
          "The best high-graphics 3D, WebGL, FPS, racing and .io battle games — all free, no download, smooth in your browser.",
          locale,
        );

  const isPremium = (g: (typeof all)[number]) =>
    g.id.startsWith("pgm-") || g.id.startsWith("gp-") || /premium|3d/i.test(g.tags) || PREMIUM_CATS.includes(categorySlug(g));
  // Playgama (premium hissi) ve GamePix (kaliteli) en üstte
  const prio = (g: (typeof all)[number]) => (g.id.startsWith("pgm-") ? 0 : g.id.startsWith("gp-") ? 1 : 2);
  const premium = all.filter(isPremium).sort((a, b) => prio(a) - prio(b));

  return (
    <div className="container-x space-y-6 py-6">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Premium Oyunlar",
          itemListElement: premium.slice(0, 20).map((g, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE.url}/oyun/${g.id}/${slugifyTitle(g.title)}`,
            name: g.title,
          })),
        }}
      />
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-neon-purple/40 bg-neon-purple/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-neon-purple">
          ✦ Premium
        </span>
        <h1 className="font-display text-3xl font-black text-ink neon-text">{t(locale, "nav.premium")}</h1>
        <span className="rounded-full border border-line px-3 py-1 text-sm text-slate-400">{premium.length} {t(locale, "common.gamesCount")}</span>
      </div>
      <p className="max-w-2xl text-slate-400">{intro}</p>

      <InfiniteGrid games={premium} />
    </div>
  );
}

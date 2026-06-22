import type { Metadata } from "next";
import { getGames } from "@/lib/games";
import { categorySlug, slugifyTitle } from "@/lib/catalog";
import { InfiniteGrid } from "@/components/InfiniteGrid";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Premium Oyunlar — En İyi 3D ve WebGL Oyunlar",
  description: "En kaliteli 3D, WebGL, FPS, yarış ve .io savaş oyunları. Tarayıcında ücretsiz, yüksek grafikli oyun deneyimi.",
  alternates: { canonical: "/premium" },
};

const PREMIUM_CATS = ["3d", "aksiyon", "yaris", "io"];

export default async function PremiumPage() {
  const all = await getGames();

  const premium = all
    .filter((g) => g.id.startsWith("gp-") || /premium|3d/i.test(g.tags) || PREMIUM_CATS.includes(categorySlug(g)))
    // GamePix (kalite sıralı) önce, sonra diğer yüksek-grafikli türler
    .sort((a, b) => (b.id.startsWith("gp-") ? 1 : 0) - (a.id.startsWith("gp-") ? 1 : 0));

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
        <h1 className="font-display text-3xl font-black text-white neon-text">Premium Oyunlar</h1>
        <span className="rounded-full border border-line px-3 py-1 text-sm text-slate-400">{premium.length} oyun</span>
      </div>
      <p className="max-w-2xl text-slate-400">
        Yüksek grafikli 3D, WebGL, FPS, yarış ve .io savaş oyunlarının en iyileri — hepsi
        ücretsiz, indirme yok, tarayıcında akıcı.
      </p>

      <InfiniteGrid games={premium} />
    </div>
  );
}

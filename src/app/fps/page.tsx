import type { Metadata } from "next";
import { getFps } from "@/lib/games";
import { InfiniteGrid } from "@/components/InfiniteGrid";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "FPS & Nişancı Oyunları — Online Atış Oyunları",
  description:
    "FPS ve nişancı oyunları: Blast Buddies tarzı blocky 3D online atış oyunları, battle royale, sniper ve çok oyunculu nişancılar. Ücretsiz, indirmeden tarayıcında oyna.",
  alternates: { canonical: "/fps" },
  openGraph: {
    title: "FPS & Nişancı Oyunları — Online Atış Oyunları",
    description: "Blocky 3D online FPS, battle royale ve sniper oyunları — ücretsiz, tarayıcıda.",
  },
};

export default async function FpsPage() {
  const games = await getFps();
  return (
    <div className="container-x space-y-6 py-6">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "FPS & Nişancı Oyunları",
          description: "Online FPS, battle royale ve nişancı oyunları koleksiyonu.",
          url: `${SITE.url}/fps`,
          inLanguage: "tr-TR",
          isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
        }}
      />
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-neon-purple/40 bg-neon-purple/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-neon-purple">
          🎯 FPS
        </span>
        <h1 className="font-display text-3xl font-black text-ink neon-text">FPS & Nişancı Oyunları</h1>
        <span className="rounded-full border border-line px-3 py-1 text-sm text-slate-400">{games.length} oyun</span>
      </div>
      <p className="max-w-3xl text-slate-400">
        <strong className="text-ink">Blast Buddies</strong> tarzı blocky 3D online atış oyunları, <strong className="text-ink">battle
        royale</strong>, sniper ve çok oyunculu nişancılar tek yerde. Silahını kuşan, rakiplerini alt et — ücretsiz, üyeliksiz,
        indirmeden tarayıcında oyna.
      </p>

      <InfiniteGrid games={games} />
    </div>
  );
}

import type { Metadata } from "next";
import { getOnline } from "@/lib/games";
import { InfiniteGrid } from "@/components/InfiniteGrid";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Online Oyunlar — Çok Oyunculu & .io & FPS",
  description:
    "Online oynanan oyunlar: çok oyunculu .io arenaları, online FPS nişancı oyunları ve canlı rekabet. Ücretsiz, indirmeden tarayıcında oyna.",
  alternates: { canonical: "/online" },
  openGraph: { title: "Online Oyunlar — Çok Oyunculu & .io & FPS", description: "Online FPS, .io ve çok oyunculu oyunlar — ücretsiz, tarayıcıda." },
};

export default async function OnlinePage() {
  const games = await getOnline();
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
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> Online
        </span>
        <h1 className="font-display text-3xl font-black text-ink neon-text">Online Oyunlar</h1>
        <span className="rounded-full border border-line px-3 py-1 text-sm text-slate-400">{games.length} oyun</span>
      </div>
      <p className="max-w-3xl text-slate-400">
        Çok oyunculu <strong className="text-ink">.io arenaları</strong>, <strong className="text-ink">online FPS</strong> nişancı
        oyunları ve canlı rekabet. Dünyanın dört bir yanından oyuncularla aynı anda oyna — ücretsiz, üyeliksiz, indirmeden.
      </p>

      <InfiniteGrid games={games} />
    </div>
  );
}

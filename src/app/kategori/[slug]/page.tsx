import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getByCategory, categoryBySlug, CATEGORIES } from "@/lib/games";
import { GameGrid } from "@/components/GameGrid";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

// Her kategori için özgün Türkçe tanıtım metni (SEO içeriği)
const CAT_INTRO: Record<string, string> = {
  aksiyon: "Tempolu nişancı, savaş ve macera oyunları burada. Reflekslerini test et, düşmanları alt et ve aksiyonun tadını çıkar.",
  macera: "Keşfedilecek dünyalar, çözülecek bulmacalar ve sürükleyici hikâyeler. Macera oyunlarıyla yeni diyarlara açıl.",
  yaris: "Araba, motor ve drift oyunları! Hızın doruğunda yarış, rakiplerini geç, pistin kralı ol.",
  spor: "Futbol, basketbol ve daha fazlası. Sevdiğin sporu tarayıcında oyna, şampiyonluğa koş.",
  dovus: "Boks, dövüş ve güreş oyunları. Yumrukları savur, kombolarını yap, ringin hâkimi sen ol.",
  bulmaca: "Zekânı çalıştıran bulmaca ve eşleştirme oyunları. Rahatla, düşün ve seviyeleri tek tek çöz.",
  zeka: "Strateji, mantık ve zekâ oyunları. Planla, taktik kur ve her hamlede bir adım önde ol.",
  io: "Çok oyunculu .io arenalarında dünyanın dört bir yanından oyuncularla yarış, büyü ve hayatta kal.",
  kiz: "Giydirme, makyaj, yemek ve dekorasyon oyunları. Yaratıcılığını konuştur, kendi stilini yarat.",
  cocuk: "Çocuklar için eğitici ve eğlenceli, güvenli oyunlar. Öğrenirken eğlenmenin tam zamanı.",
  arcade: "Hızlı, eğlenceli ve bağımlılık yapan arcade oyunları. Kısa molalarda yüksek skorun peşine düş.",
  "3d": "Yüksek grafikli 3D ve WebGL oyunlar. Tarayıcında konsol hissi veren akıcı oyun deneyimi.",
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const cat = categoryBySlug(params.slug);
  if (!cat) return {};
  const desc = `${CAT_INTRO[cat.slug] ?? `En iyi ${cat.tr.toLowerCase()} oyunları.`} Ücretsiz, indirmeden tarayıcında oyna.`;
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

  const games = await getByCategory(params.slug);

  return (
    <div className="container-x space-y-6 py-6">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${cat.tr} Oyunları`,
          description: CAT_INTRO[cat.slug],
          url: `${SITE.url}/kategori/${cat.slug}`,
          inLanguage: "tr-TR",
          isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
        }}
      />
      <div className="flex items-center gap-3">
        <h1 className="font-display text-3xl font-black text-white neon-text">{cat.tr} Oyunları</h1>
        <span className="rounded-full border border-line px-3 py-1 text-sm text-slate-400">
          {games.length} oyun
        </span>
      </div>

      {/* SEO + kullanıcı için kategori tanıtımı */}
      <p className="max-w-3xl text-slate-400">{CAT_INTRO[cat.slug] ?? `En iyi ${cat.tr.toLowerCase()} oyunları, ücretsiz ve indirmeden.`}</p>

      <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_TOP} className="min-h-[90px]" />

      <GameGrid games={games} priorityCount={6} />
    </div>
  );
}

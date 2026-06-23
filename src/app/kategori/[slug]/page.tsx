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
  aksiyon: "Tempolu nişancı, savaş ve macera oyunları burada. Reflekslerini test et, düşmanları alt et ve aksiyonun tadını çıkar. Tüm aksiyon oyunları ücretsiz ve indirmeden, doğrudan tarayıcında oynanır.",
  macera: "Keşfedilecek dünyalar, çözülecek bulmacalar ve sürükleyici hikâyeler. Macera oyunlarıyla yeni diyarlara açıl. Kaçış odası ve keşif temalı en iyi macera oyunları burada toplandı.",
  yaris: "Araba, motor ve drift oyunları! Hızın doruğunda yarış, rakiplerini geç, pistin kralı ol. Ücretsiz yarış oyunlarının en iyileri, indirmeden ve üyeliksiz tarayıcında.",
  spor: "Futbol, basketbol ve daha fazlası. Sevdiğin sporu tarayıcında oyna, şampiyonluğa koş. Penaltıdan turnuva moduna kadar en sevilen ücretsiz spor oyunları burada.",
  dovus: "Boks, dövüş ve güreş oyunları. Yumrukları savur, kombolarını yap, ringin hâkimi sen ol. Ücretsiz dövüş oyunlarının en iyileri, indirmeden anında oynanır.",
  bulmaca: "Zekânı çalıştıran bulmaca ve eşleştirme oyunları. Rahatla, düşün ve seviyeleri tek tek çöz. Match-3, mantık ve kelime bulmacaları dahil en geniş ücretsiz koleksiyon.",
  zeka: "Strateji, mantık ve zekâ oyunları. Planla, taktik kur ve her hamlede bir adım önde ol. Satranç, kule savunması ve mantık bulmacaları burada ücretsiz oynanır.",
  io: "Çok oyunculu .io arenalarında dünyanın dört bir yanından oyuncularla yarış, büyü ve hayatta kal. Tüm .io oyunları tarayıcıda, üyelik gerekmeden anında başlar.",
  kiz: "Giydirme, makyaj, yemek ve dekorasyon oyunları. Yaratıcılığını konuştur, kendi stilini yarat. Ücretsiz kız oyunlarının en yenileri ve en sevilenleri burada.",
  cocuk: "Çocuklar için eğitici ve eğlenceli, güvenli oyunlar. Öğrenirken eğlenmenin tam zamanı. Tüm içerikler yaşa uygun ve ebeveyn dostu seçildi.",
  arcade: "Hızlı, eğlenceli ve bağımlılık yapan arcade oyunları. Kısa molalarda yüksek skorun peşine düş. Klasik arcade keyfini hiçbir şey indirmeden tarayıcında yaşa.",
  "3d": "Yüksek grafikli 3D ve WebGL oyunlar. Tarayıcında konsol hissi veren akıcı oyun deneyimi. En kaliteli 3D oyunlar için Premium Oyunlar bölümüne de bakabilirsin.",
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
      <div className="flex items-center gap-3">
        <h1 className="font-display text-3xl font-black text-ink neon-text">{cat.tr} Oyunları</h1>
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

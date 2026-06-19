import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "İş Birlikleri ve Ortaklar",
  description: `${SITE.name} ile oyun yayını, reklam ve içerik iş birliği fırsatları.`,
};

export default function IsbirlikleriPage() {
  const L = SITE.legal;
  return (
    <LegalLayout title="İş Birlikleri ve Ortaklar">
      <p>
        {SITE.name}, oyun geliştiricileri, reklam ağları ve içerik üreticileriyle açık iş
        birliğine değer verir. Aşağıdaki başlıklarda bizimle çalışabilirsin.
      </p>

      <h2>Oyun Geliştiricileri</h2>
      <p>
        Bir HTML5 oyun geliştirdiysen, oyunlarını {SITE.name} üzerinden milyonlarca
        oyuncuya ulaştırabilirsin. Oyun kataloğumuz{" "}
        <strong>{SITE.gameProviders.join(" ve ")}</strong> ağları üzerinden beslenir;
        oyununu bu ağlara ekleyerek otomatik olarak sitemizde de yayınlanmasını
        sağlayabilirsin. Doğrudan yayın için bizimle iletişime geç.
      </p>

      <h2>Reklam ve Markalar</h2>
      <p>
        Reklam alanlarımız ({SITE.adProviders.join(", ")}) üzerinden yönetilir.
        Markanı oyuncu kitlemize tanıtmak veya özel reklam çözümleri için bizimle
        görüşebilirsin.
      </p>

      <h2>İçerik ve Medya</h2>
      <p>
        Oyun rehberleri, incelemeler veya tanıtım içerikleri için iş birliği
        tekliflerine açığız.
      </p>

      <h2>İletişim</h2>
      <p>
        Tüm iş birliği talepleri için:{" "}
        <a href={`mailto:${L.partnerEmail}`}>{L.partnerEmail}</a>
      </p>
    </LegalLayout>
  );
}

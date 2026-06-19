import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Erişilebilirlik",
  description: `${SITE.name} erişilebilirlik beyanı ve sürdürülen iyileştirmeler.`,
};

export default function ErisilebilirlikPage() {
  return (
    <LegalLayout title="Erişilebilirlik">
      <p>
        {SITE.name} olarak, sitemizin mümkün olan en geniş kitle tarafından
        kullanılabilir olmasını önemsiyoruz. Erişilebilirliği sürekli iyileştirmek için
        çalışıyoruz.
      </p>

      <h2>Yaptığımız Çalışmalar</h2>
      <ul>
        <li>Anlamlı (semantik) HTML ve açıklayıcı bağlantı/buton etiketleri.</li>
        <li>Görseller için alternatif (alt) metinler.</li>
        <li>Klavyeyle gezinmeye uygun menü ve arama.</li>
        <li>Okunabilirlik için yüksek kontrastlı renk paleti ve net tipografi.</li>
        <li>Mobil, tablet ve masaüstüne uyumlu duyarlı (responsive) tasarım.</li>
      </ul>

      <h2>Bilinen Sınırlamalar</h2>
      <p>
        Oyunlar üçüncü taraf ağlardan gömülü (iframe) olarak sunulur; bu oyunların
        kendi erişilebilirlik düzeyi geliştiricilerine bağlıdır ve bizim kontrolümüz
        dışında olabilir.
      </p>

      <h2>Geri Bildirim</h2>
      <p>
        Bir erişilebilirlik sorunuyla karşılaşırsan bize bildir; en kısa sürede
        gidermeye çalışırız:{" "}
        <a href={`mailto:${SITE.legal.contactEmail}`}>{SITE.legal.contactEmail}</a>.
      </p>
    </LegalLayout>
  );
}

import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Yaş Değerlendirmesi",
  description: `${SITE.name} oyunlarında PEGI temelli yaş değerlendirmesi ve içerik bilgilendirmesi.`,
};

const PEGI = [
  { age: "3+", color: "#2e7d32", desc: "Tüm yaşlara uygun. Şiddet içermez ya da çok hafif/komik biçimdedir. Korkutucu görüntü ve ses yoktur." },
  { age: "7+", color: "#7cb342", desc: "Genel olarak uygun; hafif korkutucu sahneler veya gerçekçi olmayan şiddet içerebilir." },
  { age: "12+", color: "#f9a825", desc: "Hayali karakterlere yönelik biraz daha gerçekçi şiddet veya hafif uygunsuz dil içerebilir." },
  { age: "16+", color: "#ef6c00", desc: "Gerçekçi şiddet, küfür, kumar temsili veya hafif cinsel içerik bulunabilir." },
  { age: "18+", color: "#c62828", desc: "Yetişkinlere yönelik yoğun içerik. Bu kategorideki oyunlar platformumuzda sunulmaz." },
];

export default function YasPage() {
  return (
    <LegalLayout title="Yaş Değerlendirmesi">
      <p>
        {SITE.name}'da oyun içeriklerini, Avrupa'da ve Türkiye'de yaygın olarak tanınan{" "}
        <strong>PEGI (Pan European Game Information)</strong> yaş sınıflandırma sistemini
        esas alarak değerlendiriyoruz. Amacımız, oyuncuların ve ebeveynlerin bilinçli
        seçim yapabilmesidir.
      </p>

      <h2>Yaş Kategorileri</h2>
      <div className="not-prose space-y-2">
        {PEGI.map((p) => (
          <div key={p.age} className="flex items-start gap-3 rounded-xl border border-line bg-card p-3">
            <span
              className="grid h-10 w-10 shrink-0 place-items-center rounded-lg font-display font-black text-white"
              style={{ background: p.color }}
            >
              {p.age}
            </span>
            <p className="text-sm text-slate-300">{p.desc}</p>
          </div>
        ))}
      </div>

      <h2>Önemli Notlar</h2>
      <ul>
        <li>
          Yaş değerlendirmesi yalnızca <strong>oyun içeriğini</strong> kapsar; üçüncü
          taraf ağlardan gösterilen <strong>reklamları kapsamaz</strong>.
        </li>
        <li>
          Bu sınıflandırma bir güvenlik göstergesidir; oyunun zorluk derecesi veya
          eğitsel/kalite önerisi değildir.
        </li>
        <li>18+ kategorisindeki oyunlar platformumuzda yer almaz.</li>
        <li>Küçük çocukların oyun oynarken ebeveyn gözetiminde olmasını öneririz.</li>
      </ul>

      <h2>Geri Bildirim</h2>
      <p>
        Bir oyunun yanlış sınıflandırıldığını düşünüyorsan{" "}
        <a href={`mailto:${SITE.legal.abuseEmail}`}>{SITE.legal.abuseEmail}</a> adresinden
        bize bildir.
      </p>
    </LegalLayout>
  );
}

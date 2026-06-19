import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kontak ve Künye",
  description: `${SITE.name} iletişim ve künye bilgileri.`,
};

export default function KunyePage() {
  const L = SITE.legal;
  // Tek e-posta mı kullanılıyor?
  const singleEmail = L.contactEmail === L.abuseEmail && L.contactEmail === L.partnerEmail;

  return (
    <LegalLayout title="Kontak ve Künye">
      <h2>İletişim</h2>
      <p>Sorularını, görüş, öneri ve bildirimlerini bize e-posta ile iletebilirsin:</p>
      {singleEmail ? (
        <ul>
          <li>
            E-posta: <a href={`mailto:${L.contactEmail}`}>{L.contactEmail}</a>{" "}
            (genel iletişim, şikâyet/uygunsuz içerik ve iş birliği)
          </li>
        </ul>
      ) : (
        <ul>
          <li>Genel iletişim: <a href={`mailto:${L.contactEmail}`}>{L.contactEmail}</a></li>
          <li>Şikâyet / uygunsuz içerik: <a href={`mailto:${L.abuseEmail}`}>{L.abuseEmail}</a></li>
          <li>İş birliği / reklam: <a href={`mailto:${L.partnerEmail}`}>{L.partnerEmail}</a></li>
        </ul>
      )}

      <h2>Künye</h2>
      <ul>
        <li><strong>Hizmet adı:</strong> {SITE.name} ({SITE.domain})</li>
        <li><strong>İşletmeci:</strong> {L.operator}</li>
        {L.address && <li><strong>Adres:</strong> {L.address}</li>}
        {L.taxOrRegistry && <li><strong>Vergi / Ticaret Sicil:</strong> {L.taxOrRegistry}</li>}
      </ul>
      <p className="text-sm text-slate-500">
        {SITE.name} bireysel olarak işletilen, reklam destekli bir hizmettir. İletişim
        e-posta üzerinden sağlanır. Doğrudan ürün/hizmet satışına geçilmesi hâlinde
        e-ticaret mevzuatı gereği ek kimlik/adres bilgileri bu sayfada yayınlanacaktır.
      </p>

      <h2>İçerik Sorumluluğu</h2>
      <p>
        {SITE.name}, üçüncü taraf oyun ağları ({SITE.gameProviders.join(", ")}) üzerinden
        sunulan HTML5 oyunlarını yayınlar. Oyunların telif ve içerik sorumluluğu ilgili
        geliştiricilere aittir. Reklamlar, anlaşmalı reklam ağları tarafından gösterilir.
      </p>

      <h2>Telif Hakkı / Kaldırma Talepleri</h2>
      <p>
        Bir içeriğin haklarını ihlal ettiğini düşünüyorsan{" "}
        <a href={`mailto:${L.abuseEmail}`}>{L.abuseEmail}</a> adresinden bize bildir;
        incelendikten sonra gerekli işlem yapılır.
      </p>
    </LegalLayout>
  );
}

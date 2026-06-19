import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Veri Koruma Kuralları",
  description: `${SITE.name} gizlilik ve veri koruma politikası (KVKK ve GDPR).`,
};

export default function VeriKorumaPage() {
  const L = SITE.legal;
  return (
    <LegalLayout title="Veri Koruma Kuralları" updated="19 Haziran 2026">
      <p>
        {SITE.name} ({SITE.domain}) olarak kişisel verilerinin korunmasına önem
        veriyoruz. Bu politika, 6698 sayılı <strong>Kişisel Verilerin Korunması Kanunu
        (KVKK)</strong> ve Avrupa Birliği <strong>Genel Veri Koruma Tüzüğü (GDPR)</strong>{" "}
        kapsamında verilerinin nasıl işlendiğini açıklar.
      </p>

      <h2>1. Veri Sorumlusu Kimdir?</h2>
      <p>
        Veri sorumlusu, bu hizmetin işletmecisidir: <strong>{L.operator}</strong>
        {L.address && <> — {L.address}</>}. İletişim:{" "}
        <a href={`mailto:${L.contactEmail}`}>{L.contactEmail}</a>.
      </p>

      <h2>2. Hangi Verileri Topluyoruz?</h2>
      <ul>
        <li>
          <strong>Cihazında saklanan veriler (localStorage):</strong> oluşturduğun
          kullanıcı adı, avatar, favori oyunlar, son oynananlar ve sanal jeton bakiyesi.
          Bu veriler sunucularımıza gönderilmez; yalnızca senin tarayıcında tutulur.
        </li>
        <li>
          <strong>Hesap bilgileri:</strong> e-posta ile kayıt olursan e-posta adresin ve
          şifrenin <em>geri döndürülemez şekilde şifrelenmiş (hash'lenmiş)</em> hâli
          saklanır. Şifren düz metin olarak tutulmaz.
        </li>
        <li>
          <strong>Otomatik teknik veriler:</strong> IP adresi, tarayıcı/cihaz türü ve
          kullanım istatistikleri, hizmetin çalışması ve reklam gösterimi sırasında
          işlenebilir.
        </li>
        <li>
          <strong>Çerezler:</strong> reklam ağları (örn. Google AdSense) ve oyun ağları,
          kişiselleştirme ve ölçümleme için çerez kullanabilir.
        </li>
      </ul>

      <h2>3. Verileri Hangi Amaçla ve Hukuki Dayanakla İşliyoruz?</h2>
      <ul>
        <li>Hizmeti sunmak ve oyun deneyimini iyileştirmek (meşru menfaat / sözleşme).</li>
        <li>Reklam göstermek ve geliri sağlamak (açık rıza / meşru menfaat).</li>
        <li>Güvenlik, kötüye kullanımın önlenmesi ve yasal yükümlülükler.</li>
      </ul>

      <h2>4. Üçüncü Taraflarla Paylaşım</h2>
      <p>
        Verilerin, hizmetin sunulması için gerekli olduğu ölçüde aşağıdaki üçüncü
        taraflarla işlenebilir:
      </p>
      <ul>
        <li><strong>Oyun ağları:</strong> {SITE.gameProviders.join(", ")} (oyunlar iframe ile sunulur).</li>
        <li><strong>Reklam ağları:</strong> {SITE.adProviders.join(", ")}.</li>
      </ul>
      <p>
        Bu sağlayıcıların kendi gizlilik politikaları geçerlidir. Reklam çerezlerini{" "}
        <a href="/gizlilik-tercihleri">Gizlilik Tercihleri</a> sayfasından yönetebilirsin.
      </p>

      <h2>5. Veriler Nerede İşlenir ve Ne Kadar Saklanır?</h2>
      <p>
        Cihazında saklanan veriler sen silene kadar tarayıcında kalır (tarayıcı verilerini
        temizleyerek dilediğin an silebilirsin). Üçüncü taraf sağlayıcıların verileri
        kendi politikalarındaki sürelerce işlenir.
      </p>

      <h2>6. Haklarınız</h2>
      <p>KVKK md. 11 ve GDPR kapsamında şu haklara sahipsin:</p>
      <ul>
        <li>Verilerinin işlenip işlenmediğini öğrenme ve bunlara erişme,</li>
        <li>Düzeltilmesini, silinmesini veya yok edilmesini isteme,</li>
        <li>İşlemeye itiraz etme ve rızanı geri çekme,</li>
        <li>Veri taşınabilirliği (uygun olduğu hâllerde).</li>
      </ul>
      <p>
        Cihazındaki verileri istediğin an <a href="/profil">profil</a> sayfandan veya
        tarayıcı ayarlarından silebilirsin.
      </p>

      <h2>7. Çocukların Gizliliği</h2>
      <p>
        Bilerek 13 yaş altı çocuklardan kişisel veri toplamayız. Ebeveyn gözetimi
        öneririz; bkz. <a href="/yas-degerlendirmesi">Yaş Değerlendirmesi</a>.
      </p>

      <h2>8. İletişim ve Başvuru</h2>
      <p>
        Haklarını kullanmak veya sorularını iletmek için:{" "}
        <a href={`mailto:${L.contactEmail}`}>{L.contactEmail}</a>.
      </p>

      <h2>9. Politikadaki Değişiklikler</h2>
      <p>
        Bu politika zaman zaman güncellenebilir. Güncel sürüm her zaman bu sayfada
        yayınlanır.
      </p>
    </LegalLayout>
  );
}

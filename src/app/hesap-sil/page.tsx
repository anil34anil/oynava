import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { AccountDeletion } from "@/components/AccountDeletion";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hesap ve Veri Silme",
  description: "OYNAVA hesabını ve cihazındaki tüm verilerini kalıcı olarak sil.",
  alternates: { canonical: "/hesap-sil" },
};

export default function HesapSilPage() {
  const L = SITE.legal;
  return (
    <LegalLayout title="Hesap ve Veri Silme" updated="28 Haziran 2026">
      <p>
        OYNAVA&apos;da oluşturduğun hesap ve tüm kullanıcı verilerin (kullanıcı adı, avatar,
        favori oyunlar, son oynananlar, sanal jeton, başarımlar ve oturum bilgisi){" "}
        <strong>yalnızca senin cihazında (tarayıcı belleğinde)</strong> saklanır; sunucularımızda
        kalıcı bir hesap tutulmaz.
      </p>

      <h2>1. Verilerini Hemen Sil</h2>
      <p>
        Aşağıdaki butonla bu cihazdaki tüm OYNAVA verilerini <strong>kalıcı olarak</strong>{" "}
        silebilirsin. İşlem geri alınamaz.
      </p>
      <div className="not-prose my-4">
        <AccountDeletion />
      </div>

      <h2>2. E-posta ile Silme Talebi</h2>
      <p>
        Hesabını veya verilerini e-posta ile de silmemizi isteyebilirsin. Talebini{" "}
        <a href={`mailto:${L.contactEmail}?subject=Hesap%20Silme%20Talebi`}>{L.contactEmail}</a>{" "}
        adresine gönder; en kısa sürede işleme alınır.
      </p>

      <h2>3. Reklam ve Analitik Verileri</h2>
      <p>
        Reklam ve ölçümleme amacıyla üçüncü taraflar (örn. Google) tarafından çerez/IP üzerinden
        işlenen veriler bizim sunucularımızda tutulmaz. Bunları{" "}
        <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
          Google Reklam Ayarları
        </a>{" "}
        üzerinden yönetebilir veya silebilirsin. Ayrıntı için{" "}
        <a href="/veri-koruma">Veri Koruma Kuralları</a> sayfasına bak.
      </p>

      <h2>4. Google ile Giriş</h2>
      <p>
        Google hesabınla giriş yaptıysan, OYNAVA&apos;nın erişimini{" "}
        <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer">
          Google Hesap İzinleri
        </a>{" "}
        sayfasından da kaldırabilirsin.
      </p>
    </LegalLayout>
  );
}

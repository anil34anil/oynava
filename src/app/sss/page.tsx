import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular (SSS)",
  description: `${SITE.name} hakkında sık sorulan sorular: ücretsiz mi, oyunlar nasıl çalışır, güvenli mi?`,
};

const QA: { q: string; a: React.ReactNode }[] = [
  {
    q: `${SITE.name} nedir?`,
    a: (
      <p>
        {SITE.name}, tarayıcıda çalışan binlerce ücretsiz HTML5 oyunu tek çatı altında
        toplayan bir oyun portalıdır. İndirme, kurulum veya üyelik zorunluluğu olmadan;
        bilgisayar, tablet ve telefondan oynayabilirsin.
      </p>
    ),
  },
  {
    q: `${SITE.name} gerçekten ücretsiz mi? Nasıl gelir elde ediyorsunuz?`,
    a: (
      <p>
        Evet, oyunlar ücretsizdir. Gelirimiz, oyun aralarında ve sayfalarda gösterilen
        reklamlardan elde edilir ({SITE.adProviders.join(", ")}). Reklam geliri, hizmeti
        ücretsiz tutmamızı sağlar.
      </p>
    ),
  },
  {
    q: "Oyunlar nereden geliyor?",
    a: (
      <p>
        Oyunlar, {SITE.gameProviders.join(" ve ")} gibi HTML5 oyun dağıtım ağları
        üzerinden sağlanır ve sitemize gömülü (iframe) olarak sunulur. Oyunların telif
        hakları ilgili geliştiricilerine aittir.
      </p>
    ),
  },
  {
    q: "Çocuklar için güvenli mi?",
    a: (
      <p>
        Oyunların büyük bölümü her yaşa uygundur. Yine de oyun içeriği için{" "}
        <a href="/yas-degerlendirmesi">PEGI yaş değerlendirmesi</a> ölçütlerini esas
        alıyoruz ve 18+ içerikleri sunmuyoruz. Reklamlar üçüncü taraf ağlardan geldiği
        için ebeveyn gözetimi öneririz.
      </p>
    ),
  },
  {
    q: "HTML5 ve casual (gündelik) oyun ne demek?",
    a: (
      <p>
        HTML5 oyunları, ek bir program/eklenti gerektirmeden doğrudan tarayıcıda çalışan
        oyunlardır. Casual oyunlar ise kolay öğrenilen, kısa sürede oynanabilen,
        eğlenceye odaklı oyunlardır.
      </p>
    ),
  },
  {
    q: "Oyunu başlatınca siyah ekran görüyorum, ne yapmalıyım?",
    a: (
      <ul>
        <li>Sayfayı yenile (F5) ve oyunun yüklenmesini birkaç saniye bekle.</li>
        <li>Reklam engelleyici (AdBlock) eklentisini bu site için kapat.</li>
        <li>Tarayıcı önbelleğini temizle veya farklı bir tarayıcı dene.</li>
      </ul>
    ),
  },
  {
    q: "Oyun ilerlememem neden kayboldu?",
    a: (
      <p>
        Oyun kayıtları ve favoriler tarayıcının yerel deposunda (localStorage) tutulur.
        Tarayıcı verilerini/çerezleri temizlersen, gizli sekmede oynarsan veya farklı bir
        cihaz/tarayıcı kullanırsan kayıtlar görünmeyebilir.
      </p>
    ),
  },
  {
    q: "Oyunlar yavaş yükleniyor veya takılıyor, neden?",
    a: (
      <p>
        Performans; internet hızına, cihazının gücüne ve oyunun boyutuna bağlıdır.
        Gereksiz sekmeleri kapatmak, tarayıcıyı güncellemek ve donanım hızlandırmayı
        açmak genelde yardımcı olur.
      </p>
    ),
  },
  {
    q: "Bir oyunda ya da reklamda uygunsuz içerik görürsem ne yapmalıyım?",
    a: (
      <p>
        Lütfen bize bildir:{" "}
        <a href={`mailto:${SITE.legal.abuseEmail}`}>{SITE.legal.abuseEmail}</a>. İçeriği
        inceleyip gerekli işlemi yaparız.
      </p>
    ),
  },
  {
    q: "Oyun geliştirdim, sitenizde yayınlayabilir miyim? / İş birliği",
    a: (
      <p>
        Memnuniyetle. <a href="/isbirlikleri">İş birlikleri ve Ortaklar</a> sayfasına
        bak veya{" "}
        <a href={`mailto:${SITE.legal.partnerEmail}`}>{SITE.legal.partnerEmail}</a>{" "}
        adresinden bize ulaş.
      </p>
    ),
  },
];

export default function SSSPage() {
  return (
    <LegalLayout title="Sıkça Sorulan Sorular">
      {QA.map((item, i) => (
        <div key={i}>
          <h2>{item.q}</h2>
          {item.a}
        </div>
      ))}
    </LegalLayout>
  );
}

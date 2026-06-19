/**
 * Blog yazıları — özgün Türkçe içerik. AdSense "değerli içerik" beklentisi + SEO için.
 * Yeni yazı eklemek: bu diziye bir nesne ekle. body satırları paragraf/başlık olur.
 */

export type Post = {
  slug: string;
  title: string;
  date: string; // ISO
  excerpt: string;
  body: string[]; // "## " ile başlayan satır alt başlık, "- " madde, diğerleri paragraf
};

export const POSTS: Post[] = [
  {
    slug: "tarayicida-oynanan-ucretsiz-oyunlar-rehberi",
    title: "Tarayıcıda Oynanan Ücretsiz Oyunlar: Başlangıç Rehberi",
    date: "2026-06-10",
    excerpt:
      "İndirme ve kurulum olmadan, doğrudan tarayıcıdan oynanan HTML5 oyunlar nasıl çalışır? Hangi tür oyunlar var, nelere dikkat etmeli?",
    body: [
      "Tarayıcı oyunları, bilgisayarına ya da telefonuna hiçbir şey indirmeden, doğrudan internet tarayıcısı üzerinden oynayabildiğin oyunlardır. Bir bağlantıya tıklarsın, oyun saniyeler içinde açılır ve oynamaya başlarsın. Bu basitlik, onları her yaştan oyuncu için cazip kılar.",
      "## HTML5 oyunlar nasıl çalışır?",
      "Eski yıllarda tarayıcı oyunları Flash gibi eklentilere ihtiyaç duyardı. Bugün ise oyunlar HTML5, JavaScript ve WebGL gibi modern web teknolojileriyle yazılıyor. Bu sayede ek bir program yüklemeden, mobil ve masaüstü fark etmeksizin akıcı şekilde çalışıyorlar.",
      "## Hangi oyun türleri var?",
      "Tarayıcı oyunları neredeyse her zevke hitap eder:",
      "- Aksiyon ve nişancı oyunları: hızlı refleks gerektiren, tempolu oyunlar.",
      "- Yarış oyunları: araba ve motor sürme keyfi.",
      "- Bulmaca ve zekâ oyunları: mantık ve strateji.",
      "- .io oyunları: aynı anda birçok oyuncuyla rekabet.",
      "- Arcade ve gündelik (casual) oyunlar: kısa molalarda hızlı eğlence.",
      "## Nelere dikkat etmeli?",
      "Akıcı bir deneyim için tarayıcını güncel tut, gereksiz sekmeleri kapat ve iyi bir internet bağlantısı kullan. Oyun açılmazsa sayfayı yenilemek çoğu sorunu çözer.",
      "Oynava'da binlerce ücretsiz oyunu tek çatı altında bulabilir, favorilerine ekleyebilir ve kaldığın yerden devam edebilirsin. Üstelik hepsi tamamen ücretsiz.",
    ],
  },
  {
    slug: "io-oyunlari-nedir-nasil-oynanir",
    title: ".io Oyunları Nedir ve Nasıl Oynanır?",
    date: "2026-06-13",
    excerpt:
      "Agar.io ile popülerleşen .io türü oyunlar neden bu kadar bağımlılık yapıyor? Yeni başlayanlar için ipuçları.",
    body: [
      ".io oyunları, genellikle çok sayıda oyuncunun aynı anda küçük bir arenada rekabet ettiği, kuralları basit ama oynaması derin olan çevrimiçi oyunlardır. İsimlerini, bu türü popülerleştiren oyunların kullandığı '.io' alan adından alırlar.",
      "## Neden bu kadar popüler?",
      "Başarılarının sırrı sadelikte: birkaç saniyede öğrenir, hemen oynamaya başlarsın. Ama ustalaşmak zaman ister. Küçük başlar, rakiplerini yenerek büyür ve lider tablosunun zirvesini hedeflersin.",
      "## Yeni başlayanlar için ipuçları",
      "- Başta küçükken agresif olma; önce güvenli şekilde büyü.",
      "- Köşelere sıkışma; her zaman bir kaçış yolun olsun.",
      "- Daha büyük rakiplerden uzak dur, küçükleri avla.",
      "- Haritayı ve rakiplerin hareketini sürekli izle.",
      "## Hangi cihazlarda oynanır?",
      "Çoğu .io oyunu hem masaüstü hem mobil tarayıcıda çalışır. Fare/klavye ya da dokunmatik kontrollerle oynayabilirsin. Oynava'daki .io kategorisinden hemen bir oyuna girip deneyebilirsin.",
    ],
  },
  {
    slug: "cocuklar-icin-guvenli-oyun-secimi",
    title: "Çocuklar İçin Güvenli Oyun Seçimi: Ebeveyn Rehberi",
    date: "2026-06-16",
    excerpt:
      "Çocuğunuzun yaşına uygun oyunu nasıl seçersiniz? Yaş değerlendirmesi, ekran süresi ve güvenlik ipuçları.",
    body: [
      "Çevrimiçi oyunlar, doğru seçildiğinde çocuklar için eğlenceli ve hatta öğretici olabilir. Ancak yaşa uygun içerik seçmek ve sağlıklı sınırlar koymak önemlidir.",
      "## Yaş değerlendirmesine bakın",
      "Oynava'da oyunları, Avrupa'da yaygın kullanılan PEGI sistemine göre değerlendiriyoruz (3+, 7+, 12+, 16+). Çocuğunuzun yaşına uygun etiketleri tercih edin. Ayrıntılar için Yaş Değerlendirmesi sayfamıza bakabilirsiniz.",
      "## Ekran süresine dikkat",
      "- Belirli bir günlük oyun süresi belirleyin ve buna birlikte uyun.",
      "- Oyun aralarında mola verilmesini teşvik edin.",
      "- Yatmadan hemen önce oyunu sınırlandırın.",
      "## Reklamlar konusunda bilinçli olun",
      "Ücretsiz oyunlar reklamlarla desteklenir ve reklamlar üçüncü taraf ağlardan gelir. Küçük çocukların oyun oynarken gözetim altında olması, beklenmedik içeriklerle karşılaşma ihtimalini azaltır.",
      "## Birlikte oynayın",
      "Çocuğunuzla birlikte oyun seçmek ve ara sıra birlikte oynamak, hem güven verir hem de keyifli bir paylaşım olur. Uygunsuz bir içerikle karşılaşırsanız bize bildirebilirsiniz.",
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

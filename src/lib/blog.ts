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
    slug: "en-iyi-ucretsiz-futbol-oyunlari",
    title: "En İyi Ücretsiz Futbol Oyunları (Tarayıcıda Oyna)",
    date: "2026-06-21",
    excerpt:
      "İndirme yok, üyelik yok: tarayıcıda oynanabilecek en iyi ücretsiz futbol oyunları ve türleri. Penaltıdan kafa topuna kadar.",
    body: [
      "Futbol, dünyanın en sevilen sporu; oyun dünyasında da öyle. İyi haber şu: en keyifli futbol oyunlarının çoğunu artık hiçbir şey indirmeden, doğrudan tarayıcından oynayabilirsin. İşte tür tür futbol oyunları ve nasıl seçeceğin.",
      "## Penaltı ve frikik oyunları",
      "Hızlı ve heyecanlı: tek bir vuruşa odaklanırsın. Açıyı ve gücü ayarlayıp kaleciyi geçmek basit görünse de ustalaşması zaman alır. Kısa molalarda mükemmeldir.",
      "## Kafa topu ve mini saha oyunları",
      "Basit fizik, eğlenceli oynanış. Genellikle iki oyunculu modu da olur; arkadaşınla aynı klavyede kapışabilirsin.",
      "## Yönetim ve taktik oyunları",
      "Sahada oynamak yerine takımını yönetmek istersen, kadro kurup taktik belirlediğin futbol oyunları da var. Daha çok düşünmeyi sever.",
      "## Nasıl seçmeli?",
      "- Hızlı eğlence istiyorsan: penaltı/mini saha oyunları.",
      "- Arkadaşınla oynayacaksan: 2 oyunculu modu olanlar.",
      "- Strateji seviyorsan: yönetim oyunları.",
      "## Nereden oynayabilirim?",
      "Oynava'nın [Spor kategorisinde](/kategori/spor) futbol başta olmak üzere yüzlerce ücretsiz spor oyunu var. Üstelik Türkçe arama da yapabilirsin: arama kutusuna 'futbol' yazman yeterli. Hepsi ücretsiz, indirmesiz ve mobil uyumlu.",
    ],
  },
  {
    slug: "tarayicida-en-iyi-araba-ve-yaris-oyunlari",
    title: "Tarayıcıda En İyi Araba ve Yarış Oyunları",
    date: "2026-06-21",
    excerpt:
      "Drift, ralli, trafik ve park etme: tarayıcıda ücretsiz oynanan araba ve yarış oyunlarının türleri ve ipuçları.",
    body: [
      "Hız tutkunları için harika bir dönem: en iyi araba ve yarış oyunlarını indirmeden, tarayıcında akıcı şekilde oynayabilirsin. İşte popüler türler ve hangisinin sana göre olduğu.",
      "## Yarış ve drift oyunları",
      "Pistte rakipleri geçmek, virajlarda drift atmak... Tempolu ve adrenalin dolu. Yeni nesil tarayıcı oyunları 3D grafiklerle gerçekçi bir his veriyor.",
      "## Trafik ve sürüş oyunları",
      "Trafiğin içinde kaza yapmadan ilerlemek ya da uzun yolda araç kullanmak. Daha sakin ama bağımlılık yapan bir tür.",
      "## Park etme oyunları",
      "Sabır ve hassasiyet ister. Aracı dar alanlara çizmeden park etmek göründüğünden zordur.",
      "## İpuçları",
      "- Virajdan önce yavaşla; sonra gazla. Hız her zaman kazandırmaz.",
      "- Drift için frene kısa dokunup direksiyonu çevir.",
      "- Klavye yerine mümkünse oyunu tam ekran oyna; kontrol kolaylaşır.",
      "## Nereden oynanır?",
      "En iyileri Oynava'nın [Yarış kategorisinde](/kategori/yaris). Yüksek grafikli 3D yarış oyunları için [Premium Oyunlar](/premium) bölümüne de bak. Türkçe 'araba' veya 'yarış' araması da çalışır.",
    ],
  },
  {
    slug: "tarayicida-3d-oyunlar-yuksek-grafik",
    title: "Tarayıcıda 3D Oyunlar: İndirmeden Yüksek Grafik",
    date: "2026-06-21",
    excerpt:
      "WebGL sayesinde tarayıcıda çalışan 3D oyunlar nasıl bu kadar iyi görünüyor? Türler ve performans ipuçları.",
    body: [
      "Birkaç yıl önce 'tarayıcı oyunu' deyince akla basit 2D oyunlar gelirdi. Bugün WebGL teknolojisi sayesinde, indirme gerektirmeden çalışan etkileyici 3D oyunlar oynayabiliyoruz.",
      "## WebGL nedir, neden önemli?",
      "WebGL, tarayıcının ekran kartını kullanarak 3D grafik çizmesini sağlayan bir teknolojidir. Bu sayede yarış, nişancı ve macera oyunları konsol hissine yaklaşan görsellerle, eklenti olmadan çalışır.",
      "## Hangi türlerde 3D parlıyor?",
      "- Yarış: gerçekçi araçlar ve pistler.",
      "- Nişancı (FPS): derinlik hissi ve akıcı hareket.",
      "- .io savaş oyunları: 3D arenalarda çok oyunculu rekabet.",
      "## Performans ipuçları",
      "- Tarayıcını güncel tut ve donanım hızlandırmayı aç.",
      "- Gereksiz sekmeleri kapat; 3D oyunlar daha çok kaynak ister.",
      "- Takılma olursa oyunun grafik ayarını düşür (varsa).",
      "## Nereden başlamalı?",
      "Oynava'nın [Premium Oyunlar](/premium) bölümü, en kaliteli 3D ve WebGL oyunlarını bir araya getirir. Ayrıca [3D kategorisine](/kategori/3d) göz atabilir, ücretsiz ve indirmeden oynayabilirsin.",
    ],
  },
  {
    slug: "bulmaca-oyunlari-beyne-faydalari",
    title: "Bulmaca ve Zekâ Oyunları: Beyne Faydaları ve En Sevilen Türler",
    date: "2026-06-20",
    excerpt:
      "Bulmaca oyunları sadece eğlenceli değil; hafıza, dikkat ve problem çözme becerini de geliştirir. Türler ve ipuçları.",
    body: [
      "Bulmaca ve zekâ oyunları, hızlı reflekslerden çok düşünmeyi, planlamayı ve örüntü tanımayı ödüllendirir. Kısa molalarda oynanabilecek kadar pratik, ustalaşması ise yıllar alacak kadar derin olabilirler.",
      "## Beyne faydaları",
      "- Hafıza ve dikkat: Eşleştirme ve hatırlama temelli oyunlar kısa süreli hafızayı çalıştırır.",
      "- Problem çözme: Her seviye, çözüme giden yolu planlamanı ister; bu beceri günlük hayata da yansır.",
      "- Odaklanma: Bir bulmacaya dalmak, dikkat süresini uzatmaya yardımcı olabilir.",
      "Bu etkiler mucize değildir; ama düzenli, ölçülü oynamak keyifli bir zihinsel egzersizdir.",
      "## En sevilen bulmaca türleri",
      "- Eşleştirme (match-3): Aynı renk/sembolleri yan yana getirerek patlatma.",
      "- Mantık bulmacaları: Sudoku, akış (flow) ve blok yerleştirme gibi kurallı oyunlar.",
      "- Kelime oyunları: Harflerden kelime üretme, bulmaca çözme.",
      "- Fizik tabanlı bulmacalar: Nesneleri doğru noktaya ulaştırmak için yer çekimi ve momentumu kullanma.",
      "## Yeni başlayanlar için ipuçları",
      "- Aceleci olma; çoğu bulmacada hız değil, doğru hamle önemlidir.",
      "- Birkaç hamle ileriyi düşün; anlık çözümler seni köşeye sıkıştırabilir.",
      "- Takıldığında kısa bir mola ver; göz gezdirdiğinde çözüm çoğu zaman netleşir.",
      "## Nereden başlamalı?",
      "Oynava'nın Bulmaca kategorisinde her seviyeye uygun yüzlerce ücretsiz oyun var. İndirme gerektirmeden, doğrudan tarayıcından oynayabilir; favorilerine ekleyip kaldığın yerden devam edebilirsin.",
    ],
  },
  {
    slug: "aksiyon-rpg-hack-and-slash-turu-rehberi",
    title: "Aksiyon-RPG ve Hack & Slash Türü: Yeni Başlayanlar İçin Rehber",
    date: "2026-06-20",
    excerpt:
      "Tepeden görünüşlü hack & slash oyunları neden bu kadar bağımlılık yapar? Ganimet, seviye ve boss savaşlarının mantığı.",
    body: [
      "Aksiyon rol yapma oyunları (Aksiyon-RPG), hızlı tempolu dövüş ile karakter geliştirmeyi bir araya getiren bir türdür. 'Hack & slash' (vur-kır) adı verilen alt türde ise çok sayıda düşmanı yenmek, ganimet toplamak ve giderek güçlenmek esastır.",
      "## Türün temel mekanikleri",
      "- Ganimet (loot): Yenilen düşmanlar eşya, altın veya güçlendirme düşürür. Bunları toplamak ilerlemenin temelidir.",
      "- Seviye atlama: Deneyim puanı (XP) topladıkça karakterin güçlenir; daha çok hasar verir, daha dayanıklı olursun.",
      "- Dalgalar ve boss'lar: Düşmanlar dalgalar hâlinde gelir; belirli aralıklarla güçlü bir 'boss' ile karşılaşırsın.",
      "## Neden bu kadar keyifli?",
      "Sürekli bir ilerleme hissi verir: her ganimet, her seviye seni biraz daha güçlü yapar. 'Bir dalga daha' deyip oynamaya devam etmek çok kolaydır. Basit kontroller, derin bir gelişim döngüsüyle birleşir.",
      "## Yeni başlayanlar için ipuçları",
      "- Sürekli hareket et; tek yerde durma, düşmanlar seni kuşatır.",
      "- Ganimetleri ıskalama; can ve güç düşürenleri öncelikle topla.",
      "- Boss'larda sabırlı ol: vur-kaç taktiğiyle hasar al-ver dengesini koru.",
      "## Tarayıcıda denemek ister misin?",
      "Oynava'ya özel geliştirdiğimiz Zindan Avcısı, tam da bu türde, tamamen özgün bir aksiyon-RPG'dir. İndirme gerektirmez, doğrudan tarayıcında akıcı çalışır ve skorundan jeton kazandırır. Originals bölümünden hemen oynayabilirsin.",
    ],
  },
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

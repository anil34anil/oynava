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

import { SEO_POSTS } from "./blogSeo";
import { ORIGINAL_POSTS } from "./blogOriginal";

const BASE_POSTS: Post[] = [
  {
    slug: "arcade-oyunlari-en-iyi-turler",
    title: "Arcade Oyunları: En İyi Türler ve Yüksek Skor İpuçları",
    date: "2026-06-22",
    excerpt:
      "Kısa molalarda hızlı eğlence arayanlar için arcade oyunlarının en sevilen türleri ve yüksek skor yapmanın püf noktaları.",
    body: [
      "Arcade oyunları, oyun dünyasının en eski ve en sade köşesidir: basit kontroller, hızlı başlangıç, anında eğlence. Uzun öğrenme eğrisi yoktur; bir oyuna birkaç saniyede alışır, dakikalar içinde skor kovalamaya başlarsın.",
      "## En sevilen arcade türleri",
      "- Sonsuz koşu (endless runner): Engellerden kaçarak ne kadar uzağa gidebileceğini test edersin.",
      "- Atış galerisi: Hedefleri vurarak puan topladığın, refleks odaklı oyunlar.",
      "- Beceri/denge oyunları: Tek dokunuşla zamanlama gerektiren, basit ama bağımlılık yapan mekanikler.",
      "- Klasik patlatma ve toplama oyunları: Renk eşleştirme veya nesne toplama temelli, kısa seanslık oyunlar.",
      "## Yüksek skor için ipuçları",
      "- Sabit bir ritim bul; panikleyip hızlanmak çoğu zaman hata yaptırır.",
      "- Her oyunun bir 'güvenli bölge' deseni vardır; ilk denemelerde bunu öğrenmeye odaklan.",
      "- Skor tablosundaki en iyi süreni geçmeyi hedef koy, rakiple değil kendinle yarış.",
      "## Nereden oynanır?",
      "Oynava'nın [Arcade kategorisinde](/kategori/arcade) klasik ve modern arcade oyunlarının en iyileri ücretsiz ve indirmesiz oynanır. Bulmaca sevenler [Bulmaca kategorisine](/kategori/bulmaca) de bakabilir; tamamı tarayıcıda anında açılır.",
    ],
  },
  {
    slug: "korku-ve-zombi-oyunlari-rehberi",
    title: "Korku ve Zombi Oyunları: Gerilimi Sevenler İçin Rehber",
    date: "2026-06-22",
    excerpt:
      "Karanlık koridorlar, zombi dalgaları ve gerilim dolu hikâyeler: tarayıcıda oynanan korku ve zombi oyunlarının en sevilen türleri.",
    body: [
      "Korku ve zombi oyunları, gerilimi ve hayatta kalma içgüdüsünü ön plana çıkaran bir türdür. Amaç çoğu zaman basittir: hayatta kal, kaynaklarını yönet, doğru anda saldır veya kaç.",
      "## En sevilen alt türler",
      "- Zombi hayatta kalma: Dalgalar hâlinde gelen zombilere karşı barikat kurup direnmek.",
      "- Atmosferik korku: Karanlık mekânlarda ipuçlarını takip ederek ilerlemek, ani sürprizlerle karşılaşmak.",
      "- Aksiyonlu zombi avı: Silah ve ekipmanla büyük zombi kalabalıklarını temizlemek.",
      "## Gerilimi yönetmenin yolları",
      "- Kaynaklarını (mühimmat, can, barikat malzemesi) erken tüketmek yerine biriktir.",
      "- Sesli ipuçlarına dikkat et; çoğu oyun tehlikeyi görmeden önce duyurur.",
      "- Dar koridorlarda köşeye sıkışmaktan kaçın; her zaman bir geri çekilme yolun olsun.",
      "## Nereden oynanır?",
      "Oynava'nın [Aksiyon kategorisinde](/kategori/aksiyon) zombi hayatta kalma ve gerilim dolu oyunların en iyileri ücretsiz olarak bulunur. Daha yüksek grafikli deneyimler için [Premium Oyunlar](/premium) bölümüne de göz atabilirsin.",
    ],
  },
  {
    slug: "macera-oyunlari-nasil-oynanir",
    title: "Macera Oyunları Nasıl Oynanır? En İyi Türler ve İpuçları",
    date: "2026-06-22",
    excerpt:
      "Keşif, bulmaca ve hikâye bir arada: macera oyunlarının en sevilen alt türleri ve yeni başlayanlar için pratik ipuçları.",
    body: [
      "Macera oyunları, hızlı reflekslerden çok keşfetmeyi, gözlem yapmayı ve hikâyenin içine girmeyi sever. Bir haritayı adım adım açmak ya da kilitli bir kapının şifresini çözmek, bu türün en tatmin edici anlarıdır.",
      "## En sevilen macera alt türleri",
      "- Kaçış (escape) oyunları: Kapalı bir mekândan ipuçlarını birleştirerek çıkmaya çalışırsın.",
      "- Keşif/platform macera: Haritayı gezerek gizli alanları ve eşyaları bulursun.",
      "- Hikâye odaklı macera: Diyaloglar ve seçimlerle ilerleyen, atmosferi yoğun oyunlar.",
      "## Yeni başlayanlar için ipuçları",
      "- Aceleci olma; çoğu macera bulmacasında gözlem hız kadar önemlidir.",
      "- Ekrandaki her detayı incele; ipuçları genelde göz önünde ama dikkat ister.",
      "- Takıldığın bir yerde geriye dönüp daha önce topladığın eşyaları kontrol et.",
      "## Nereden başlamalı?",
      "Oynava'nın [Macera kategorisinde](/kategori/macera) keşif, kaçış ve hikâye odaklı yüzlerce ücretsiz oyun var. Bulmaca sevenler [Bulmaca kategorisine](/kategori/bulmaca) de göz atabilir; tamamı indirmeden, doğrudan tarayıcıda oynanır.",
    ],
  },
  {
    slug: "dovus-oyunlari-rehberi-boks-ve-kombo",
    title: "Dövüş Oyunları Rehberi: Boks, Kombo ve Ring Taktikleri",
    date: "2026-06-22",
    excerpt:
      "Dövüş oyunlarında zamanlama neden hızdan daha önemli? Boks, ringde taktik ve kombo yapmanın temelleri.",
    body: [
      "Dövüş oyunları, refleks kadar zamanlama ve okuma gerektiren bir türdür. Rakibinin hareketini önceden sezip doğru anda vurmak, ham hızdan çok daha değerlidir.",
      "## Türün temel mekanikleri",
      "- Zamanlama: Doğru anda vurmak ya da blok yapmak, ardı ardına tuşa basmaktan daha etkilidir.",
      "- Kombo: Belirli vuruş sıraları üst üste eklenince daha çok hasar verir.",
      "- Mesafe kontrolü: Ringde/arenada doğru mesafeyi tutmak, hem saldırıyı hem savunmayı kolaylaştırır.",
      "## Boks oyunlarına özel ipuçları",
      "- Sürekli yumruk atmak yerine rakibin açığını bekle.",
      "- Blok ve yana kaçma, can barını korumanın en ucuz yoludur.",
      "- Enerji/stamina barı düşükken saldırıya geçme; karşı atağa açık kalırsın.",
      "## Nereden oynanır?",
      "Oynava'nın [Dövüş kategorisinde](/kategori/dovus) boks, ringde dövüş ve kombo tabanlı yüzlerce ücretsiz oyun var. Aksiyon sevenler [Aksiyon kategorisine](/kategori/aksiyon) de bakabilir; hepsi indirmesiz ve tarayıcı üzerinden anında oynanır.",
    ],
  },
  {
    slug: "zeka-ve-strateji-oyunlari-nasil-gelistirilir",
    title: "Zekâ ve Strateji Oyunları: Mantığını Geliştiren En İyi Türler",
    date: "2026-06-22",
    excerpt:
      "Satranç, kule savunması ve mantık bulmacaları: strateji oyunları planlama becerini nasıl geliştirir, hangi türden başlamalısın?",
    body: [
      "Zekâ ve strateji oyunları, anlık reflekslerden çok birkaç hamle ileriyi görmeyi ödüllendirir. Her karar bir sonrakini etkiler; bu yüzden sabırlı oynayan oyuncular genelde daha iyi sonuç alır.",
      "## En sevilen strateji türleri",
      "- Klasik masa oyunları: Satranç ve tavla gibi kurallı, derin oyunlar.",
      "- Kule savunması (tower defense): Kaynaklarını doğru yere yerleştirip dalgaları durdurursun.",
      "- Mantık bulmacaları: Sınırlı hamleyle hedefe ulaşmayı gerektiren bulmacalar.",
      "## Stratejini geliştirmenin yolları",
      "- Her hamleden önce \"bu hamle bana ne kazandırır, rakibe ne kaybettirir\" diye sor.",
      "- Kaynaklarını (zaman, altın, enerji) erken harcamak yerine biriktirip doğru anda kullan.",
      "- Kaybettiğin oyunları tekrar gözden geçir; hatanın nerede olduğunu görmek en hızlı öğrenme yoludur.",
      "## Nereden başlamalı?",
      "Oynava'nın [Zekâ & Strateji kategorisinde](/kategori/zeka) kule savunması, satranç ve mantık bulmacaları yüzlerce ücretsiz oyun olarak seni bekliyor. Bulmaca sevenler [Bulmaca kategorisine](/kategori/bulmaca) de bakabilir.",
    ],
  },
  {
    slug: "mobilde-en-iyi-ucretsiz-oyunlar",
    title: "Mobilde Oynanabilecek En İyi Ücretsiz Oyunlar",
    date: "2026-06-21",
    excerpt:
      "Telefonuna hiçbir şey indirmeden, tarayıcıdan oynayabileceğin en iyi ücretsiz mobil oyunlar ve türleri.",
    body: [
      "Telefonunda yer kaplayan oyunlardan sıkıldıysan iyi haber: en eğlenceli oyunların çoğunu artık hiçbir şey indirmeden, doğrudan mobil tarayıcından oynayabilirsin. İşte mobilde en iyi çalışan ücretsiz oyun türleri.",
      "## Dokunmatik kontrole uygun türler",
      "- Arcade ve gündelik oyunlar: tek parmakla, kısa molalarda.",
      "- Bulmaca ve eşleştirme: dokunmatikle çok rahat oynanır.",
      "- .io oyunları: mobilde sürükle-bırak kontrolüyle akıcı.",
      "## Neden indirmeden oynamak avantajlı?",
      "Depolama alanı harcamazsın, güncelleme beklemezsin ve tek bağlantıyla anında başlarsın. Tarayıcı oyunları telefonun hafızasını şişirmez.",
      "## Performans ipuçları",
      "- Arka plandaki uygulamaları kapat.",
      "- İyi bir Wi-Fi veya stabil mobil veri kullan.",
      "- Oyunu tam ekran modunda oyna.",
      "## Nereden başlamalı?",
      "Oynava tamamen mobil uyumludur. [Arcade](/kategori/arcade), [Bulmaca](/kategori/bulmaca) ve [.io oyunları](/kategori/io) kategorileri mobilde özellikle keyiflidir. Tümüne [Tüm Oyunlar](/oyunlar) sayfasından da ulaşabilirsin.",
    ],
  },
  {
    slug: "kiz-oyunlari-giydirme-makyaj-rehberi",
    title: "Kız Oyunları: Giydirme, Makyaj ve Dekorasyon Rehberi",
    date: "2026-06-21",
    excerpt:
      "Giydirme, makyaj, yemek ve dekorasyon... Yaratıcılığını konuşturabileceğin ücretsiz kız oyunlarının türleri.",
    body: [
      "Kız oyunları, yaratıcılığı ve stil duygusunu ön plana çıkaran, her yaştan oyuncunun keyif aldığı geniş bir türdür. İşte en popüler alt türler ve ne sunduğu.",
      "## Giydirme oyunları",
      "Karakterlere kıyafet, aksesuar ve saç modeli seçerek kombinler oluşturursun. Moda zevkini deneme alanı gibidir.",
      "## Makyaj ve bakım oyunları",
      "Makyaj, cilt bakımı ve kuaför temalı oyunlar. Adım adım dönüşümler izlemek keyiflidir.",
      "## Yemek ve dekorasyon oyunları",
      "Pasta yapmaktan oda dekore etmeye kadar; planlama ve estetik bir arada.",
      "## Neden bu kadar seviliyor?",
      "Stres atmaya uygun, sakin ve ödüllendirici bir oynanışları var. Acele ettirmez; kendi temponda yaratırsın.",
      "## Nereden oynanır?",
      "Oynava'nın [Kız Oyunları kategorisinde](/kategori/kiz) yüzlerce ücretsiz giydirme, makyaj ve dekorasyon oyunu var. Türkçe 'giydirme', 'makyaj' veya 'yemek' araması da çalışır. Hepsi ücretsiz ve indirmesiz.",
    ],
  },
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
  {
    slug: "en-iyi-araba-ve-yaris-oyunlari-rehberi",
    title: "En İyi Araba ve Yarış Oyunları Rehberi",
    date: "2026-06-25",
    excerpt:
      "Drift, park etme, ralli ve şehir sürüşü… Ücretsiz araba ve yarış oyunlarının türleri, ipuçları ve nereden oynanacağı.",
    body: [
      "Araba ve yarış oyunları, tarayıcı oyunlarının en kalabalık ve en sevilen türlerinden biridir. Gerçekçi sürüş simülasyonlarından arcade tarzı hızlı yarışlara kadar geniş bir yelpaze sunar.",
      "## Popüler alt türler",
      "- Drift oyunları: Virajlarda kontrollü kayma becerisi ister.",
      "- Park etme oyunları: Dar alanlarda sabır ve hassasiyet gerektirir.",
      "- Ralli ve arazi: Zorlu pistlerde dayanıklılık testidir.",
      "- Trafikte sürüş: Sonsuz sürüşte engellerden kaçma odaklıdır.",
      "## Daha iyi yarışmak için ipuçları",
      "- Frene zamanında bas; viraj öncesi hız kesmek tur süreni kısaltır.",
      "- Drift oyunlarında gaz-fren dengesini öğren.",
      "- Park oyunlarında aynaları ve kamera açısını kullan.",
      "## Nereden oynanır?",
      "Tüm bu türlerin en iyilerini [En İyi Araba Oyunları](/en-iyi-araba-oyunlari) ve [En İyi Yarış Oyunları](/en-iyi-yaris-oyunlari) koleksiyonlarında bulabilirsin. Motor sevenler [Motor Oyunları](/motor-oyunlari) sayfasına, park ustaları [Park Etme Oyunları](/park-etme-oyunlari) sayfasına göz atabilir — hepsi ücretsiz ve indirmesiz.",
    ],
  },
  {
    slug: "2-kisilik-oyunlar-arkadasinla-oyna",
    title: "2 Kişilik Oyunlar: Arkadaşınla Aynı Ekranda Oyna",
    date: "2026-06-25",
    excerpt:
      "Tek klavyede iki oyuncu! Arkadaşınla oynayabileceğin en iyi 2 kişilik oyunların türleri ve önerileri.",
    body: [
      "2 kişilik oyunlar, aynı bilgisayar başında arkadaşınla veya kardeşinle rekabet etmenin en pratik yoludur. Çevrim içi bağlantı gerekmez; tek klavyede iki oyuncu ayrı tuşlarla oynar.",
      "## Hangi türler 2 kişilik oynanır?",
      "- Dövüş oyunları: Klasik karşılıklı mücadele.",
      "- Futbol ve spor: Birebir maçlar.",
      "- Yarış: Bölünmüş ekranda kapışma.",
      "- Bulmaca ve iş birliği (co-op): Birlikte çözme keyfi.",
      "## İpuçları",
      "- Tuş düzenini oyuna başlamadan birlikte belirleyin.",
      "- Co-op oyunlarda iletişim, rekabette ise hız önemlidir.",
      "## Nereden oynanır?",
      "En iyi seçenekleri [2 Kişilik Oyunlar](/2-kisilik-oyunlar) koleksiyonunda topladık. Dövüş sevenler [En İyi Dövüş Oyunları](/en-iyi-dovus-oyunlari), futbol sevenler [En İyi Futbol Oyunları](/en-iyi-futbol-oyunlari) sayfasına bakabilir.",
    ],
  },
];

// Temel yazılar + programmatic SEO yazıları, tarihe göre (yeni üstte) birleşik liste.
export const POSTS: Post[] = [...ORIGINAL_POSTS, ...BASE_POSTS, ...SEO_POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

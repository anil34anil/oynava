/**
 * En yüksek arama hacimli / en yüksek öncelikli koleksiyonlar için ÖZGÜN, elle yazılmış
 * gövde metni (2 paragraf). Amaç: `collections.ts`'teki kısa `intro` tek başına ince kalıyor;
 * bu dosya SEO derinliği + AdSense "değerli içerik" sinyali için ek metin sağlar.
 *
 * Yalnızca en-değerli ~20 koleksiyon kapsanır (56'nın tamamı DEĞİL) — düşük hacimli
 * long-tail koleksiyonlara zorlama/şablon metin eklemek thin-duplicate riski taşır.
 * `[collection]/page.tsx` bu haritada slug yoksa hiçbir ek bölüm göstermez (fallback yok, sessiz atlanır).
 */
export const COLLECTION_CONTENT: Record<string, string[]> = {
  "en-iyi-araba-oyunlari": [
    "Araba oyunları, yarış tutkusunu farklı biçimlerde yaşatır: kimi oyunda trafik arasından ustaca sıyrılırsın, kimi oyunda dar bir alana kusursuz park etmeye çalışırsın, kimi oyunda ise açık bir pistte rakiplerini geçmek için gaza yüklenirsin. Bu çeşitlilik, türü hem yeni başlayanlar hem de deneyimli sürücüler için ilgi çekici kılar.",
    "İyi bir sürüş, çoğu zaman sabırla gelir: viraja girmeden hız kesmek, düz yolda ise gaza yüklenmek çoğu oyunda en hızlı turu getirir. Bazı yapımlar gerçekçi fizik motoruna sahipken bazıları daha arcade bir his verir — ikisi de kendi tarzında eğlencelidir. Tüm oyunlar tarayıcıda, hesap açmadan anında başlar.",
  ],
  "en-iyi-yaris-oyunlari": [
    "Yarış oyunlarının kalbinde tek bir his vardır: hız. Formula pistlerinden şehir sokaklarına, motor yarışlarından drift arenalarına kadar farklı disiplinler bu koleksiyonda bir araya geldi. Kimi oyun gerçekçi bir simülasyon sunar, kimi oyun ise abartılı takla ve çarpışma efektleriyle daha eğlenceli bir tona kayar.",
    "Rakiplerini geçmenin anahtarı genellikle iç viraj çizgisini (racing line) doğru kullanmaktır: virajın dışından değil, iç kısmından geçmek mesafeyi kısaltır. Nitro veya turbo gücünü düz yollarda değil, geçiş fırsatı bulduğun anlarda kullanmak daha stratejik bir tercihtir. Tüm yarış oyunları mobilde de dokunmatik direksiyonla akıcı çalışır.",
  ],
  "en-iyi-savas-oyunlari": [
    "Savaş oyunları, taktik ve aksiyonu bir araya getiren geniş bir yelpazeyi kapsar. Cephe hattı çatışmalarından komando görevlerine, tank düellolarından üs savunma senaryolarına kadar farklı bakış açıları bu koleksiyonda toplandı. Kimi oyun tek başına ilerlediğin görev tabanlı bir yapıya sahipken, kimisi dalga dalga gelen düşmanlara karşı savunma kurmanı ister.",
    "Bu tür oyunlarda başarı genellikle örtünmeyi (cover) doğru kullanmak ve mühimmatı israf etmemekle gelir; açık alanda ilerlemek yerine siperden siper atlamak hayatta kalma şansını artırır. Ekipman ve silah yükseltmeleri genellikle oyun ilerledikçe açılır, bu yüzden erken bölümlerde tedbirli oynamak uzun vadede işine yarar.",
  ],
  "en-iyi-nisanci-oyunlari": [
    "Nişancı (FPS/TPS) oyunları, hız ve hassasiyeti aynı anda test eder. Birinci şahıs görüş açısıyla oynanan klasik atış oyunlarından, keskin nişancı (sniper) senaryolarına ve büyük ölçekli battle royale arenalarına kadar bu koleksiyon türün en sevilen alt dallarını bir araya getiriyor. Refleks kadar haritayı okumak da bu türde belirleyicidir.",
    "Nişan alma becerisini geliştirmenin en pratik yolu, ateş etmeden önce hedefin hareket yönünü tahmin etmektir; sabit bir noktaya değil, hedefin gideceği noktaya nişan almak isabeti artırır. Çok oyunculu modlarda köşelerde beklemek yerine haritada sürekli pozisyon değiştirmek seni daha az öngörülebilir yapar. Oyunların çoğu klavye-fare ile en akıcı deneyimi sunar.",
  ],
  "2-kisilik-oyunlar": [
    "2 kişilik oyunlar, aynı ekranı ve aynı klavyeyi paylaşarak oynanan sosyal bir deneyim sunar. Kooperatif bulmacalardan (biri ateşi biri suyu yönetir, ikisi birlikte ilerler) karşılıklı dövüş ve yarış oyunlarına kadar geniş bir yelpaze burada toplandı. Aile içi veya arkadaşlar arası kısa bir rekabet için idealdir.",
    "İşbirliğine dayalı oyunlarda iletişim en önemli beceridir — kim ne zaman hareket edecek, kim hangi mekanizmayı tetikleyecek gibi kararları sözlü olarak koordine etmek çoğu bulmacayı kolaylaştırır. Rekabetçi oyunlarda ise klavye düzenini (kimin hangi tuşları kullanacağını) oynamaya başlamadan netleştirmek karışıklığı önler. Tüm oyunlar tek cihazda, üyelik gerekmeden oynanır.",
  ],
  "ucretsiz-online-oyunlar": [
    "Online oyunlar, dünyanın farklı yerlerindeki gerçek oyuncularla aynı anda rekabet etme fırsatı sunar. .io tarzı büyüme arenalarından çok oyunculu nişancı modlarına kadar bu koleksiyondaki her oyun gerçek zamanlı bağlantı gerektirir; yani her maç, botlarla değil canlı insanlarla oynanır ve bu da onu öngörülemez ve heyecanlı kılar.",
    "İyi bir internet bağlantısı bu türde performans kadar önemlidir; kararsız Wi-Fi yerine mümkünse kablolu bağlantı veya güçlü bir sinyal kullanmak gecikmeyi (ping) azaltır. Çoğu online oyunda erken agresif oynamak yerine önce haritayı ve rakip davranışlarını gözlemlemek, uzun vadede daha güvenli bir strateji sağlar.",
  ],
  "cocuklar-icin-oyunlar": [
    "Bu koleksiyon, ebeveynlerin gönül rahatlığıyla seçebileceği, yaşa uygun ve yapıcı temalı oyunları bir araya getirir. Renk-şekil eşleştirmeden basit bulmacalara, hayvan bakımından boyama etkinliklerine kadar içerikler; şiddet veya korkutucu öğe barındırmayacak şekilde özenle seçildi. Amaç, eğlenirken öğrenmeyi teşvik etmek.",
    "Küçük yaş grupları için kontroller olabildiğince sadedir — genelde tek tıklama veya sürükle-bırak yeterlidir. Oyunların çoğu tablette dokunmatik ile ebeveyn gözetiminde bile rahatça kullanılabilir. Daha fazla ipucu için [ebeveynler için güvenli oyun rehberimize](/blog/cocuklar-icin-guvenli-oyun-secme-rehberi) göz atabilirsin.",
  ],
  "populer-html5-oyunlar": [
    "Bu liste, OYNAVA'daki en çok tercih edilen HTML5 oyunlarını bir araya getiriyor. Tür sınırı yok — aksiyon, bulmaca, yarış ve strateji bir arada; ortak noktaları, topluluğun en sık tıkladığı ve en uzun süre oynadığı yapımlar olmaları. Yeni bir şey denemek istediğinde, nereden başlayacağını bilmiyorsan bu sayfa iyi bir başlangıç noktasıdır.",
    "Popülerlik sıralaması statik değildir; siteye yeni oyunlar eklendikçe ve oyuncu tercihleri değiştikçe liste de güncellenir. Bu yüzden zaman zaman geri dönüp bu sayfaya bakmak, daha önce fark etmediğin bir favori bulmanı sağlayabilir.",
  ],
  "en-cok-oynanan-oyunlar": [
    "Bu sayfa, gerçek oynanma verilerine dayanır — algoritma tahmini değil, oyuncuların fiilen en çok tıkladığı ve en uzun süre içinde kaldığı oyunlar burada listelenir. Bir oyunun burada yer alması, geniş bir kitle tarafından test edilip beğenildiğinin somut göstergesidir.",
    "Yeni bir oyun keşfetmek istediğinde ama ne seçeceğine karar veremediğinde, bu liste güvenli bir başlangıçtır: sıralamadaki her başlık, binlerce oyuncunun onayından geçmiştir. Liste düzenli olarak güncellenir; bugünün favorisi yarın değişebilir.",
  ],
  "yeni-eklenen-oyunlar": [
    "Bu sayfa, siteye en son eklenen oyunları kronolojik sırayla listeler. Oyun kütüphanesi sürekli büyüdüğü için burası, henüz keşfedilmemiş taze içerikleri ilk görebileceğin yerdir. Sık oyun oynayan ve tekrar tekrar aynı başlıklara dönmek istemeyenler için düzenli ziyaret etmeye değer bir köşedir.",
    "Yeni eklenen oyunlar arasında zaman zaman mevsimsel veya güncel temalı yapımlar da yer alır. Bu listeyi favorilerine ekleyip haftada bir göz atmak, popüler olmadan önce bir oyunu ilk keşfedenlerden olmanı sağlayabilir.",
  ],
  "en-iyi-3d-oyunlar": [
    "3D oyunlar, WebGL teknolojisinin gücünü tarayıcıya taşır. Gerçekçi araç simülasyonlarından birinci şahıs nişancılara, fizik tabanlı bulmacalardan açık dünya keşif oyunlarına kadar bu koleksiyondaki her başlık, indirmeden konsol benzeri bir görsel deneyim sunmayı hedefler. Derinlik hissi ve akıcı animasyonlar bu türü diğerlerinden ayırır.",
    "En iyi performans için güncel bir tarayıcı kullanmak ve donanım hızlandırmasının açık olduğundan emin olmak yeterlidir; çoğu 3D oyun bu ayarla belirgin şekilde daha akıcı çalışır. Daha yüksek grafikli seçenekler için [Premium Oyunlar bölümüne](/premium) de göz atabilirsin.",
  ],
  "en-iyi-futbol-oyunlari": [
    "Futbol oyunları, sahanın heyecanını tek dokunuşla tarayıcıya taşır. Klasik penaltı atışlarından tam takım maçlarına, serbest vuruş yarışmalarından turnuva modlarına kadar bu koleksiyon farklı futbol deneyimlerini bir araya getiriyor. Kısa bir maç birkaç dakikada biter, turnuva modları ise seni kupayı kaldırana dek oyunda tutar.",
    "İyi bir vuruş, çoğu oyunda zamanlama çubuğunu doğru anda durdurmakla ilgilidir; acele etmek yerine göstergeyi izleyip doğru noktada tıklamak isabeti belirgin biçimde artırır. Kaleci karşısında köşeleri hedeflemek, ortadan vurmaktan her zaman daha güvenlidir.",
  ],
  "zombi-oyunlari": [
    "Zombi oyunları, hayatta kalma gerilimini ön plana çıkarır. Dalgalar hâlinde gelen zombi sürülerine karşı barikat kurduğun savunma oyunlarından, karanlık koridorlarda ilerlediğin atmosferik korku yapımlarına kadar bu koleksiyon türün farklı tonlarını kapsıyor. Amaç genelde nettir: hayatta kal, kaynaklarını yönet, doğru anda saldır veya geri çekil.",
    "Mühimmat ve can gibi kaynakları erken tüketmek yerine biriktirmek, kritik anlarda hayat kurtarır. Dar koridorlarda köşeye sıkışmaktan kaçınmak ve her zaman bir geri çekilme rotası bırakmak, bu türde en temel hayatta kalma prensibidir. Gerilimi daha yumuşak yaşamak istersen [korku oyunları koleksiyonuna](/korku-oyunlari) da göz atabilirsin.",
  ],
  "en-iyi-bulmaca-oyunlari": [
    "Bulmaca oyunları, hızdan çok düşünmeyi ödüllendirir. Üçlü eşleştirmeden (match-3) birleştirme (merge) oyunlarına, mahjong'dan mantık bulmacalarına kadar bu koleksiyon zihni dinlendirirken çalıştıran türleri bir araya getiriyor. Kısa bir molada oynamaya uygun oldukları kadar, uzun seanslarda da tatmin edici bir ilerleme hissi verirler.",
    "Zincirleme (combo) hamleler kovalamak, tek tek yapılan hamlelerden çok daha fazla puan kazandırır; bu yüzden acele etmeden birkaç hamle ileriyi düşünmek genelde işe yarar. Takıldığın bir seviyede aynı stratejiyi tekrar etmek yerine farklı bir sırayla denemek çoğu zaman çözümü bulmanı sağlar.",
  ],
  "en-iyi-dovus-oyunlari": [
    "Dövüş oyunları refleks, zamanlama ve kombo ezberi üzerine kuruludur. Klasik ring boksundan sokak dövüşlerine, karate ve stickman kapışmalarından silahlı arena savaşlarına kadar farklı stiller bu koleksiyonda bir araya geldi. Kimi oyun tek tuşla erişilebilir sadelikte, kimisi özel hareket dizileriyle derinlik sunar.",
    "İyi bir dövüşçü yalnızca saldırmaz; blok atmayı ve doğru anda karşı atağa geçmeyi de bilir. Rakibin saldırı ritmini birkaç round izleyip okumak, kör saldırmaktan çok daha etkilidir. Çoğu oyun tek oyunculu kariyer modunun yanında aynı klavyede iki kişilik dövüş imkânı da sunar.",
  ],
  "en-iyi-minecraft-oyunlari": [
    "Minecraft tarzı blok (blocky/voxel) oyunlar, açık uçlu yaratıcılığı ön plana çıkarır. Kaynak toplayıp kendi yapılarını inşa ettiğin sandbox yapımlardan, blok dünyasında hayatta kalmaya çalıştığın survival oyunlara kadar bu koleksiyon türün farklı yorumlarını bir araya getiriyor. Sınır genelde yalnızca hayal gücündür.",
    "Yeni başlayanlar için en pratik yaklaşım, önce temel kaynakları (odun, taş) güvenli bir şekilde toplamak, ardından daha karmaşık yapılara geçmektir. Kendi geliştirdiğimiz [BlokKraft](/oyun/ov-blokkraft/blokkraft) oyunumuz da tam olarak bu türden — gerçek zamanlı kayıt özelliğiyle inşa ettiğin dünyaya istediğin an geri dönebilirsin.",
  ],
  "ates-ve-su-oyunlari": [
    "Ateş ve Su tarzı oyunlar, iki farklı karakteri aynı anda (ya da bir arkadaşınla birlikte) yönettiğin işbirlikçi bulmacalardır. Biri ateşten, diğeri sudan zarar görür; bu yüzden ikisinin de güvenle ilerleyebilmesi için ortamı birlikte kullanman gerekir — biri bir mekanizmayı tetiklerken diğeri geçebileceği yolu açar.",
    "Bu oyunlarda başarı, iki karakteri sırayla değil eş zamanlı düşünmekle gelir: bir sonraki bölümün her iki karakter için de nasıl çözüleceğini önceden planlamak, deneme-yanılmadan çok daha hızlı ilerletir. Arkadaşınla oynarken rolleri net paylaşmak (biri ateş, biri su) koordinasyonu kolaylaştırır.",
  ],
  "yilan-oyunlari": [
    "Yılan oyunları, basit ama bağımlılık yapan bir formülü paylaşır: ye, büyü, kendine veya rakiplerine çarpma. Klasik tek oyunculu yılan oyunundan, çok oyunculu slither tarzı arenalara kadar bu koleksiyon türün hem nostaljik hem modern yorumlarını bir araya getiriyor.",
    "Çok oyunculu arenalarda hayatta kalmanın anahtarı, büyük yılanların yakınından geçmemek ve kendi kuyruğunu gereksiz yere kıvırıp risk almamaktır. Haritanın açık alanlarında büyümek, kalabalık merkezlerde risk almaktan her zaman daha güvenlidir.",
  ],
  "tetris-oyunlari": [
    "Tetris tarzı blok oyunları, düşen parçaları doğru yerleştirerek satırları temizlemeye dayanan klasik bir formülü paylaşır. Orijinal düşen bloklardan modern blok-yerleştirme bulmacalarına kadar bu koleksiyon türün farklı versiyonlarını bir araya getiriyor; basit kuralları saniyeler içinde öğrenilir.",
    "Yüksek skor için parçaları rastgele değil, boşluk bırakmayacak şekilde önceden planlamak gerekir; özellikle uzun ve düz parçaları kritik anlar için saklamak çoklu satır temizleme (ve daha yüksek puan) fırsatı yaratır. Hız arttıkça sakin kalmak, panikle hızlı hamle yapmaktan daha iyi sonuç verir.",
  ],
  "sudoku-oyunlari": [
    "Sudoku, 9x9'luk bir ızgarayı mantık yürüterek 1'den 9'a kadar rakamlarla doldurduğun klasik bir sayı bulmacasıdır. Şans faktörü yoktur — her bulmacanın tek ve mantıkla ulaşılabilir bir çözümü vardır. Bu koleksiyon, kolay seviyeden zora doğru farklı zorlukta sudoku bulmacalarını bir araya getiriyor.",
    "Yeni başlayanlar için en pratik teknik, önce en az boşluğu olan satır, sütun veya 3x3 kutudan başlamaktır; burada doğru rakamı bulma ihtimali daha yüksektir. İlerledikçe 'aday rakamları' not almak (bir hücreye gelebilecek olası sayıları küçükçe işaretlemek) zor bulmacalarda büyük kolaylık sağlar.",
  ],
  "satranc-oyunlari": [
    "Satranç, binlerce yıldır oynanan ve hâlâ en derin strateji oyunlarından biri olmayı sürdüren bir masa oyunudur. Bu koleksiyondaki oyunlarda bilgisayara karşı pratik yapabilir veya bir arkadaşına karşı klasik bir düello oynayabilirsin; zorluk seviyeleri genellikle yeni başlayandan ileri seviyeye kadar ayarlanabilir.",
    "Açılışta merkezi kontrol etmek (piyonları ve atları tahtanın ortasına doğru geliştirmek) neredeyse her oyunda avantaj sağlar. Taşları erken feda etmek yerine her hamlede 'bu hamle beni nasıl bir pozisyona sokar' diye bir adım ileriyi düşünmek, satrançta gelişimin en önemli adımıdır.",
  ],
};

/**
 * SEO odaklı ek blog yazıları — uzun kuyruk anahtar kelimeler için özgün rehberler.
 * Kompakt "spec" verisinden tam Post üretilir (intro + bölümler + iç linkli kapanış).
 * İç linkler koleksiyon/kategori sayfalarına bağlanır → tematik otorite + crawl derinliği.
 */
import type { Post } from "./blog";

type Spec = {
  slug: string;
  title: string;
  excerpt: string;
  intro: string;
  sections: [string, string[]][];
  cta: string; // markdown iç link içeren kapanış paragrafı
};

// Tarihleri yay (en yeni üstte; her yazı 1 gün arayla) — taze içerik sinyali.
function dateForIndex(i: number): string {
  const d = new Date("2026-06-26T00:00:00Z");
  d.setUTCDate(d.getUTCDate() - i);
  return d.toISOString().slice(0, 10);
}

function build(spec: Spec, i: number): Post {
  const body: string[] = [spec.intro];
  for (const [h, lines] of spec.sections) {
    body.push(`## ${h}`);
    body.push(...lines);
  }
  body.push("## Nereden oynanır?");
  body.push(spec.cta);
  return { slug: spec.slug, title: spec.title, date: dateForIndex(i), excerpt: spec.excerpt, body };
}

const SPECS: Spec[] = [
  {
    slug: "en-iyi-10-araba-oyunu-2026",
    title: "En İyi 10 Araba Oyunu (2026)",
    excerpt: "Drift'ten park etmeye, ralliden şehir sürüşüne 2026'nın en iyi ücretsiz araba oyunları.",
    intro: "Araba oyunları tarayıcı oyunlarının en sevilen türü. Bu listede gerçekçi sürüş hissi veren, kontrolleri akıcı ve grafikleri tatmin edici araba oyunlarını derledik.",
    sections: [
      ["Nasıl seçtik?", ["- Kontrol hassasiyeti ve sürüş hissi", "- Grafik ve performans dengesi", "- Çeşitlilik: drift, park, ralli, trafik"]],
      ["İpucu", ["Yarış oyunlarında viraja girmeden frene basmak, çıkışta tam gaz vermek tur sürenizi belirgin kısaltır."]],
    ],
    cta: "Tüm araba oyunlarını [En İyi Araba Oyunları](/en-iyi-araba-oyunlari) sayfasında; saf yarış sevenler [En İyi Yarış Oyunları](/en-iyi-yaris-oyunlari) koleksiyonunda bulabilir.",
  },
  {
    slug: "tarayicida-ucretsiz-fps-oynama-rehberi",
    title: "Tarayıcıda Ücretsiz FPS Oynama Rehberi",
    excerpt: "İndirme yok! Tarayıcıda akıcı çalışan online FPS ve nişancı oyunları nasıl oynanır?",
    intro: "Modern HTML5 ve WebGL sayesinde artık kaliteli FPS oyunlarını indirme yapmadan tarayıcıda oynayabiliyorsunuz. Bu rehberde nişancı oyunlarına hızlı bir başlangıç yapıyoruz.",
    sections: [
      ["Performans için", ["- Donanım hızlandırmayı (hardware acceleration) açık tutun", "- Gereksiz sekmeleri kapatın", "- Mümkünse kablolu internet kullanın"]],
      ["Yeni başlayanlara", ["WASD ile hareket, fare ile nişan temel kuraldır. Önce hedef alıştırması (aim) yapan modlarla başlayın."]],
    ],
    cta: "En iyi nişancı oyunları için [FPS / Nişancı Oyunları](/en-iyi-nisanci-oyunlari) ve canlı çok oyunculu için [Ücretsiz Online Oyunlar](/ucretsiz-online-oyunlar) koleksiyonlarına göz atın.",
  },
  {
    slug: "yeni-baslayanlar-icin-io-oyunlari",
    title: "Yeni Başlayanlar İçin .io Oyunları",
    excerpt: ".io oyunları nedir, nasıl oynanır ve başlangıç için en iyi .io oyunları hangileri?",
    intro: ".io oyunları; basit kurallar, anında başlama ve çok oyunculu rekabetle tanınır. Birkaç dakikada öğrenilir ama ustalaşması zaman alır.",
    sections: [
      ["Temel mantık", ["- Küçük başla, büyüyerek hayatta kal", "- Haritanın kenarlarını kullanarak köşeye sıkışmaktan kaçın", "- Daha büyük rakiplerden uzak dur"]],
      ["Strateji", ["Erken oyunda agresif olmak yerine güvenli büyümek, çoğu .io oyununda daha yüksek skor getirir."]],
    ],
    cta: "Tüm çok oyunculu arenalar [Ücretsiz Online Oyunlar](/ucretsiz-online-oyunlar) ve [.io Oyunları](/kategori/io) sayfalarında.",
  },
  {
    slug: "2-kisilik-oyun-onerileri",
    title: "Arkadaşınla Oynayacak 2 Kişilik Oyun Önerileri",
    excerpt: "Tek klavyede iki oyuncu! Aynı ekranda oynanan en eğlenceli 2 kişilik oyunlar.",
    intro: "İnternet bağlantısına gerek kalmadan, aynı bilgisayar başında arkadaşınla rekabet etmenin en pratik yolu 2 kişilik oyunlar.",
    sections: [
      ["Hangi türler uygun?", ["- Dövüş ve spor: birebir kapışma", "- Co-op bulmaca: birlikte çözme", "- Yarış: bölünmüş ekran"]],
      ["İpucu", ["Başlamadan tuş düzenini birlikte belirleyin; co-op'ta iletişim, rekabette hız önemlidir."]],
    ],
    cta: "Seçtiğimiz en iyiler [2 Kişilik Oyunlar](/2-kisilik-oyunlar) sayfasında; dövüş sevenler [Dövüş Oyunları](/en-iyi-dovus-oyunlari) koleksiyonuna bakabilir.",
  },
  {
    slug: "cocuklar-icin-en-guvenli-oyunlar",
    title: "Çocuklar İçin En Güvenli ve Eğitici Oyunlar",
    excerpt: "Ebeveynler için rehber: çocuklara uygun, güvenli ve öğretici ücretsiz oyunlar nasıl seçilir?",
    intro: "Çocuklar için oyun seçerken eğlence kadar güvenlik ve eğitsel değer de önemli. Bu rehberde nelere dikkat edileceğini ve iyi örnekleri paylaşıyoruz.",
    sections: [
      ["Nelere dikkat etmeli?", ["- Şiddet içermeyen, yaşa uygun içerik", "- Basit ve sezgisel kontroller", "- Renkli, teşvik edici görsel dil"]],
      ["Ebeveyn ipucu", ["İlk oturumlarda çocuğunuzla birlikte oynamak hem güven verir hem de uygun içeriği birlikte seçmenizi sağlar."]],
    ],
    cta: "Yaşa uygun seçkiyi [Çocuklar İçin Oyunlar](/cocuklar-icin-oyunlar) ve [Çocuk kategorisinde](/kategori/cocuk) bulabilirsiniz; boyama sevenler [Boyama Oyunları](/boyama-oyunlari) sayfasına bakabilir.",
  },
  {
    slug: "minecraft-benzeri-tarayici-oyunlari",
    title: "Minecraft Benzeri Tarayıcı Oyunları",
    excerpt: "İndirmeden oynanan, Minecraft tarzı blok inşa ve hayatta kalma oyunları.",
    intro: "Blok (blocky) tarzı inşa, kazma ve hayatta kalma oyunları büyük bir kitleye sahip. Minecraft'ın tadını tarayıcıda ücretsiz almak mümkün.",
    sections: [
      ["Tür çeşitleri", ["- Yaratıcı mod: serbest inşa", "- Hayatta kalma: kaynak topla, gece düşmanlarından korun", "- Blok atış (pixel shooter): blok dünyasında FPS"]],
      ["İpucu", ["Hayatta kalma modlarında ilk gece bir sığınak yapmak en kritik adımdır."]],
    ],
    cta: "Tümünü [En İyi Minecraft Oyunları](/en-iyi-minecraft-oyunlari) sayfasında; blok-atış sevenler [FPS / Nişancı Oyunları](/en-iyi-nisanci-oyunlari) koleksiyonuna bakabilir.",
  },
  {
    slug: "telefonda-oynanan-en-iyi-tarayici-oyunlari",
    title: "Telefonda Oynanan En İyi Tarayıcı Oyunları",
    excerpt: "Uygulama indirmeden, mobil tarayıcıda akıcı çalışan dokunmatik uyumlu oyunlar.",
    intro: "Tüm oyunlarımız mobil tarayıcıda da çalışır; ancak bazıları dokunmatik kontrol için özellikle uygundur. İşte telefonda en iyi deneyimi veren türler.",
    sections: [
      ["Dokunmatiğe uygun türler", ["- Tek dokunuş arcade oyunları", "- Kaydırmalı bulmacalar", "- Otomatik koşan (runner) oyunlar"]],
      ["Pil ve performans", ["Mobilde uzun oturumlarda parlaklığı düşürmek ve arka plan uygulamalarını kapatmak akıcılığı artırır."]],
    ],
    cta: "Hızlı eğlence için [Arcade kategorisine](/kategori/arcade), bulmaca sevenler [En İyi Bulmaca Oyunları](/en-iyi-bulmaca-oyunlari) sayfasına bakabilir.",
  },
  {
    slug: "en-iyi-zombi-hayatta-kalma-oyunlari",
    title: "En İyi Zombi ve Hayatta Kalma Oyunları",
    excerpt: "Zombi sürülerine karşı dayan, üssünü savun: gerilim dolu ücretsiz hayatta kalma oyunları.",
    intro: "Zombi oyunları aksiyon ve gerilimi birleştirir. Kıt kaynaklarla hayatta kalma hissi, türü bu kadar bağımlılık yapan şeydir.",
    sections: [
      ["Hayatta kalma taktikleri", ["- Mühimmatı boşa harcama, kafa vuruşlarına odaklan", "- Kaçış yolunu her zaman açık tut", "- Yükseltmeleri savunmaya öncelikli harca"]],
      ["Atmosfer", ["Korku oyunlarını kulaklıkla oynamak gerilimi katlar; ses ipuçları düşman yönünü ele verir."]],
    ],
    cta: "Tüm seçkiyi [Zombi Oyunları](/zombi-oyunlari) sayfasında; daha fazla aksiyon için [Aksiyon kategorisine](/kategori/aksiyon) göz atın.",
  },
  {
    slug: "drift-oyunlari-nasil-ustalasilir",
    title: "Drift Oyunlarında Nasıl Ustalaşılır?",
    excerpt: "Kontrollü kayma sanatı: drift oyunlarında yüksek skor için teknikler.",
    intro: "Drift, hız ve kontrolü dengelemenin sanatıdır. Doğru zamanlama ile virajları stil puanına çevirebilirsiniz.",
    sections: [
      ["Temel teknik", ["- Viraja girmeden gaz kes, direksiyonu kır", "- Kaymayı el freni veya gaz-fren dengesiyle başlat", "- Çıkışta yavaşça gaza yüklen"]],
      ["Skor için", ["Drift zincirini bozmadan uzun tutmak çarpanı yükseltir; sabırlı sürüş daha çok puan getirir."]],
    ],
    cta: "Drift ve daha fazlası için [En İyi Araba Oyunları](/en-iyi-araba-oyunlari) ve [En İyi Yarış Oyunları](/en-iyi-yaris-oyunlari) koleksiyonlarına bakın.",
  },
  {
    slug: "en-iyi-futbol-oyunlari-rehberi",
    title: "En İyi Futbol Oyunları Rehberi",
    excerpt: "Penaltıdan turnuvaya: tarayıcıda ücretsiz oynanan en iyi futbol oyunları.",
    intro: "Futbol oyunları; penaltı atışından tam maça kadar geniş bir yelpaze sunar. Refleks ve zamanlama burada her şeydir.",
    sections: [
      ["Türler", ["- Penaltı/serbest vuruş: nişan ve güç", "- Kafa topu: zamanlama", "- Tam maç: taktik ve kontrol"]],
      ["İpucu", ["Penaltıda kalecinin hareketini bekleyip son anda köşeyi seçmek isabet oranını artırır."]],
    ],
    cta: "Tümü [En İyi Futbol Oyunları](/en-iyi-futbol-oyunlari) sayfasında; diğer sporlar için [Spor kategorisine](/kategori/spor) bakın.",
  },
  {
    slug: "bulmaca-oyunlari-zihni-nasil-gelistirir",
    title: "Bulmaca Oyunları Zihni Nasıl Geliştirir?",
    excerpt: "Match-3'ten mantık bulmacalarına: hem eğlendiren hem zihni çalıştıran oyunlar.",
    intro: "Bulmaca oyunları, problem çözme ve örüntü tanıma becerilerini eğlenceli bir şekilde çalıştırır. Kısa molalar için idealdir.",
    sections: [
      ["Popüler türler", ["- Match-3 ve eşleştirme", "- Mantık ve kaçış odası", "- Kelime ve sayı bulmacaları"]],
      ["İpucu", ["Takıldığınızda birkaç hamle geri gidip tahtayı bütün olarak görmek çoğu zaman çözümü açığa çıkarır."]],
    ],
    cta: "Tümü [En İyi Bulmaca Oyunları](/en-iyi-bulmaca-oyunlari) ve [Bulmaca kategorisinde](/kategori/bulmaca); strateji sevenler [Zekâ & Strateji](/kategori/zeka) sayfasına bakabilir.",
  },
  {
    slug: "stickman-oyunlari-neden-bu-kadar-populer",
    title: "Stickman Oyunları Neden Bu Kadar Popüler?",
    excerpt: "Sade çizgi karakter, derin oynanış: stickman oyunlarının sırrı.",
    intro: "Stickman (çöp adam) oyunları basit görselleriyle dikkat çeker ama oynanışları şaşırtıcı derecede derin olabilir.",
    sections: [
      ["Tür çeşitleri", ["- Stickman dövüş", "- Stickman nişancı", "- Stickman parkur ve fizik oyunları"]],
      ["Çekiciliği", ["Sade görsel, oyuncunun mekaniğe odaklanmasını sağlar; bu da hızlı öğrenme ve akıcı eğlence demektir."]],
    ],
    cta: "Hepsi [Stickman Oyunları](/stickman-oyunlari) sayfasında; aksiyon için [Aksiyon kategorisine](/kategori/aksiyon) bakın.",
  },
  {
    slug: "kule-savunma-oyunlari-strateji-rehberi",
    title: "Kule Savunma (Tower Defense) Strateji Rehberi",
    excerpt: "Kulelerini doğru yerleştir, dalgaları durdur: tower defense temel stratejileri.",
    intro: "Kule savunma oyunları planlama ve kaynak yönetimi ister. Doğru kule yerleşimi galibiyetle yenilgi arasındaki farktır.",
    sections: [
      ["Temel strateji", ["- Yol dönüşlerine yavaşlatıcı kuleler koy", "- Menzilli kuleleri kavşaklara yerleştir", "- Erken yükseltme > çok sayıda zayıf kule"]],
      ["Kaynak yönetimi", ["İlk dalgalarda fazla harcamayın; biriken altını kritik dalga öncesi güçlü yükseltmelere ayırın."]],
    ],
    cta: "Tümü [Kule Savunma Oyunları](/kule-savunma-oyunlari) ve [Zekâ & Strateji](/kategori/zeka) sayfalarında.",
  },
  {
    slug: "kiz-giydirme-oyunlari-moda-rehberi",
    title: "Kız Giydirme Oyunları: Stil ve Moda Rehberi",
    excerpt: "Kombin yap, stilini yarat: en yeni ücretsiz giydirme ve moda oyunları.",
    intro: "Giydirme oyunları yaratıcılığı ve stil duygusunu eğlenceyle birleştirir. Renk, doku ve aksesuar uyumu burada öne çıkar.",
    sections: [
      ["Türler", ["- Günlük kombin ve sokak modası", "- Tema giydirme (parti, düğün, mevsim)", "- Makyaj ve saç tasarımı"]],
      ["İpucu", ["Bütünlük için iki-üç ana renkte kalmak, kombinleri daha şık gösterir."]],
    ],
    cta: "Hepsi [Kız Giydirme Oyunları](/kiz-giydirme-oyunlari) ve [Makyaj Oyunları](/makyaj-oyunlari) sayfalarında; [Kız Oyunları kategorisine](/kategori/kiz) de bakabilirsin.",
  },
  {
    slug: "yemek-yapma-oyunlari-mutfagin-sefi-ol",
    title: "Yemek Yapma Oyunları: Mutfağın Şefi Ol",
    excerpt: "Restoran işlet, pasta yap, sipariş yetiştir: en iyi ücretsiz aşçılık oyunları.",
    intro: "Yemek oyunları zaman yönetimi ve hız ister. Sipariş yetiştirme telaşı, türü bu kadar bağımlılık yapan şeydir.",
    sections: [
      ["Tür çeşitleri", ["- Restoran/zaman yönetimi", "- Tarif tamamlama", "- Tatlı ve fast-food hazırlama"]],
      ["İpucu", ["Siparişleri gruplayarak hazırlamak (aynı malzemeyi bir arada) servisi hızlandırır."]],
    ],
    cta: "Tümü [Yemek Yapma Oyunları](/yemek-yapma-oyunlari) sayfasında; [Kız Oyunları kategorisine](/kategori/kiz) de göz atabilirsin.",
  },
  {
    slug: "motor-oyunlari-arazi-ve-akrobasi",
    title: "Motor Oyunları: Arazi ve Akrobasi",
    excerpt: "Engebeli arazide denge, rampada akrobasi: en iyi ücretsiz motosiklet oyunları.",
    intro: "Motor oyunları denge ve cesaret gerektirir. Doğru ağırlık aktarımı, takla atmak ile bitiş çizgisi arasındaki farktır.",
    sections: [
      ["Türler", ["- Arazi/trial: denge odaklı", "- Akrobasi/rampa", "- Hız ve yarış"]],
      ["İpucu", ["Tepe tırmanışlarında geriye yaslanmak, inişlerde öne eğilmek dengeyi korur."]],
    ],
    cta: "Tümü [Motor Oyunları](/motor-oyunlari) sayfasında; dört teker sevenler [En İyi Araba Oyunları](/en-iyi-araba-oyunlari) koleksiyonuna bakabilir.",
  },
  {
    slug: "park-etme-oyunlari-kusursuz-manevra",
    title: "Park Etme Oyunları: Kusursuz Manevra Rehberi",
    excerpt: "Dar alan, zorlu manevra: park etme oyunlarında nasıl ustalaşılır?",
    intro: "Park etme oyunları sabır ve hassasiyet ister. Gerçekçi sürüş fiziğiyle, küçük bir hata bile baştan başlatabilir.",
    sections: [
      ["Teknik", ["- Yavaş ve kontrollü ilerle", "- Aynaları ve kamera açısını kullan", "- Direksiyonu erken kır, geç düzelt"]],
      ["İpucu", ["Acele etmeyin; çoğu park oyununda süre değil isabet puan getirir."]],
    ],
    cta: "Tümü [Park Etme Oyunları](/park-etme-oyunlari) sayfasında; sürüş sevenler [En İyi Araba Oyunları](/en-iyi-araba-oyunlari) koleksiyonuna bakabilir.",
  },
  {
    slug: "mahjong-oyunlari-rahatlatici-eslestirme",
    title: "Mahjong Oyunları: Rahatlatıcı Eşleştirme",
    excerpt: "Taşları eşleştir, tahtayı temizle: zihin dinlendiren mahjong oyunları.",
    intro: "Mahjong, sabır ve örüntü tanıma oyunudur. Telaşsız temposuyla hem rahatlatır hem zihni çalıştırır.",
    sections: [
      ["Nasıl oynanır?", ["- Yalnızca serbest (kenarı açık) taşlar eşleşir", "- Üstte/yanında taş olmayanları seç", "- Alttaki taşları erken açmaya çalış"]],
      ["İpucu", ["Önce büyük blokları açacak eşleşmelere odaklanın; sona kalan kilitli taşlar oyunu bitirir."]],
    ],
    cta: "Tümü [Mahjong Oyunları](/mahjong-oyunlari) ve [Bulmaca kategorisinde](/kategori/bulmaca).",
  },
  {
    slug: "bilardo-oyunlari-8-top-taktikleri",
    title: "Bilardo Oyunları: 8 Top Taktikleri",
    excerpt: "İstaka ile nişan, açı hesabı: bilardoda rakibini yenmenin yolları.",
    intro: "Bilardo, açı ve güç kontrolü oyunudur. Beyaz topun nereye gideceğini planlamak, sıradaki vuruşu kurar.",
    sections: [
      ["Temel taktik", ["- Vuruştan önce sıradaki topu da düşün", "- Açıyı topun merkezinden hesapla", "- Güçten çok isabete odaklan"]],
      ["İpucu", ["Beyaz topu kontrol etmek (pozisyon oyunu), tek tek top sokmaktan daha önemlidir."]],
    ],
    cta: "Tümü [Bilardo Oyunları](/bilardo-oyunlari) sayfasında; daha fazla beceri oyunu için [Arcade kategorisine](/kategori/arcade) bakın.",
  },
  {
    slug: "kosma-ve-parkur-oyunlari-rekor-kir",
    title: "Koşma ve Parkur Oyunları: Rekor Kır",
    excerpt: "Engellerden atla, hızını koru: bağımlılık yapan sonsuz koşu oyunları.",
    intro: "Parkur ve koşu oyunları refleks ve ritim ister. Tek bir hata oyunu bitirebilir; bu da 'bir daha' dedirten şeydir.",
    sections: [
      ["Tür çeşitleri", ["- Sonsuz koşu (endless runner)", "- Parkur ve duvar tırmanma", "- Kaçış temalı oyunlar"]],
      ["İpucu", ["Hıza kapılmayın; sabit bir ritim tutturmak rekorların anahtarıdır."]],
    ],
    cta: "Tümü [Koşma & Parkur Oyunları](/kosma-kacma-oyunlari) sayfasında; hızlı eğlence için [Arcade kategorisine](/kategori/arcade) bakın.",
  },
  {
    slug: "en-iyi-3d-oyunlar-tarayicida-konsol-hissi",
    title: "En İyi 3D Oyunlar: Tarayıcıda Konsol Hissi",
    excerpt: "WebGL ile yüksek grafik: indirmeden oynanan en iyi 3D oyunlar.",
    intro: "WebGL teknolojisi, tarayıcıda konsol seviyesine yaklaşan 3D oyunları mümkün kıldı. İndirme yok, kurulum yok.",
    sections: [
      ["Neden 3D?", ["- Daha sürükleyici dünya", "- Gerçekçi fizik ve kamera", "- FPS, yarış ve macera için ideal"]],
      ["Performans", ["3D oyunlarda akıcılık için tarayıcı donanım hızlandırması ve güncel sürüm önemlidir."]],
    ],
    cta: "Tümü [En İyi 3D Oyunlar](/en-iyi-3d-oyunlar) ve [3D Oyunlar kategorisinde](/kategori/3d); kaliteli seçki için [Premium Oyunlar](/premium) sayfasına bakın.",
  },
  {
    slug: "online-coklu-oyunculu-oyunlarda-basari",
    title: "Online Çok Oyunculu Oyunlarda Nasıl Başarılı Olunur?",
    excerpt: "Gerçek rakiplere karşı oynarken işe yarayan temel taktikler.",
    intro: "Çok oyunculu oyunlar, yapay zekâya değil gerçek insanlara karşı oynamanın heyecanını verir. Bu da farklı bir strateji gerektirir.",
    sections: [
      ["Temel ilkeler", ["- Haritayı ve doğma noktalarını öğren", "- Açgözlülük yerine konum avantajı", "- Gecikmeyi (ping) düşürmek için yakın sunucu seç"]],
      ["Gelişim", ["Kaybettiğin maçları gözden geçirmek, en hızlı gelişme yöntemidir."]],
    ],
    cta: "Tüm online oyunlar [Ücretsiz Online Oyunlar](/ucretsiz-online-oyunlar) ve [Online Oyunlar](/online) sayfalarında.",
  },
  {
    slug: "html5-oyunlar-nedir-neden-gelecek",
    title: "HTML5 Oyunlar Nedir ve Neden Geleceğin Oyunları?",
    excerpt: "İndirme gerektirmeyen, her cihazda çalışan HTML5 oyunların avantajları.",
    intro: "HTML5 oyunlar, doğrudan tarayıcıda çalışan, kurulum gerektirmeyen modern oyunlardır. Flash'ın yerini aldılar ve çok daha güçlüler.",
    sections: [
      ["Avantajları", ["- İndirme/kurulum yok", "- Bilgisayar, telefon, tablette çalışır", "- Anında başlama"]],
      ["Teknoloji", ["WebGL ve modern tarayıcı API'leri sayesinde 3D, fizik ve çok oyunculu deneyimler artık tarayıcıda mümkün."]],
    ],
    cta: "Binlerce HTML5 oyununun en popülerleri [Popüler HTML5 Oyunları](/populer-html5-oyunlar) ve [Tüm Oyunlar](/oyunlar) sayfalarında.",
  },
  {
    slug: "ofiste-mola-icin-hizli-oyunlar",
    title: "Ofiste ve Mola Aralarında Hızlı Oyunlar",
    excerpt: "Birkaç dakikada bitebilen, anında başlayan hafif oyunlar.",
    intro: "Kısa molalarda zihni dağıtmak için ağır oyunlara gerek yok. Hızlı başlayan, hızlı biten oyunlar tam da bunun için.",
    sections: [
      ["İdeal türler", ["- Arcade ve hyper-casual", "- Tek dokunuş beceri oyunları", "- Kısa bulmacalar"]],
      ["İpucu", ["Kaydetme gerektirmeyen, her an bırakılabilen oyunlar mola için en uygunudur."]],
    ],
    cta: "Hızlı eğlence için [Arcade kategorisine](/kategori/arcade) ve [En İyi Bulmaca Oyunları](/en-iyi-bulmaca-oyunlari) sayfasına bakın.",
  },
  {
    slug: "en-iyi-savas-ve-asker-oyunlari",
    title: "En İyi Savaş ve Asker Oyunları",
    excerpt: "Cephe savaşları, komando görevleri, strateji: ücretsiz savaş oyunları.",
    intro: "Savaş oyunları aksiyon, nişancılık ve stratejiyi bir araya getirir. Taktiksel düşünme burada refleks kadar önemlidir.",
    sections: [
      ["Türler", ["- Birinci şahıs cephe (FPS)", "- Komando/sızma", "- Askeri strateji"]],
      ["İpucu", ["Açık alanda kalmak yerine siper kullanmak hayatta kalma süresini ciddi artırır."]],
    ],
    cta: "Tümü [En İyi Savaş Oyunları](/en-iyi-savas-oyunlari) ve [Aksiyon kategorisinde](/kategori/aksiyon); nişancılar için [FPS / Nişancı Oyunları](/en-iyi-nisanci-oyunlari) sayfasına bakın.",
  },
  {
    slug: "boyama-oyunlari-yaraticiligi-gelistir",
    title: "Boyama Oyunları: Çocuklarda Yaratıcılığı Geliştir",
    excerpt: "Renk seç, resim boya: çocuklar için güvenli ve eğitici boyama oyunları.",
    intro: "Boyama oyunları, çocukların renk uyumu ve el-göz koordinasyonunu eğlenerek geliştirmesine yardımcı olur.",
    sections: [
      ["Faydaları", ["- Renk ve şekil tanıma", "- İnce motor becerileri", "- Sakinleştirici, odaklandırıcı etki"]],
      ["İpucu", ["Çocuğunuza serbest boyama alanı tanımak, kurallı boyamadan daha çok yaratıcılık geliştirir."]],
    ],
    cta: "Tümü [Boyama Oyunları](/boyama-oyunlari) ve [Çocuklar İçin Oyunlar](/cocuklar-icin-oyunlar) sayfalarında.",
  },
  {
    slug: "doktor-oyunlari-eglenceli-meslek-tanitimi",
    title: "Doktor Oyunları: Eğlenceli Meslek Tanıtımı",
    excerpt: "Hastaları iyileştir, dişçilik öğren: çocuklar için doktor ve hastane oyunları.",
    intro: "Doktor oyunları, çocuklara sağlık mesleklerini eğlenceli ve korkusuz bir şekilde tanıtır.",
    sections: [
      ["Tür çeşitleri", ["- Genel muayene ve tedavi", "- Diş doktoru", "- Acil/ameliyat simülasyonu"]],
      ["Eğitsel değer", ["Bu oyunlar, doktor korkusunu azaltmaya ve hijyen alışkanlıklarını pekiştirmeye yardımcı olabilir."]],
    ],
    cta: "Tümü [Doktor Oyunları](/doktor-oyunlari) ve [Çocuk kategorisinde](/kategori/cocuk).",
  },
  {
    slug: "makyaj-oyunlari-baslangic-rehberi",
    title: "Makyaj Oyunları: Başlangıç Rehberi",
    excerpt: "Göz makyajından manikürün: yaratıcı ve eğlenceli güzellik oyunları.",
    intro: "Makyaj oyunları renk uyumu ve estetik duygusunu eğlenceyle geliştirir; sınırsız deneme yapma özgürlüğü sunar.",
    sections: [
      ["Türler", ["- Yüz makyajı", "- Manikür ve nail art", "- Saç ve bakım"]],
      ["İpucu", ["Doğal görünüm için ten rengiyle uyumlu tonlarda kalmak en şık sonucu verir."]],
    ],
    cta: "Tümü [Makyaj Oyunları](/makyaj-oyunlari) ve [Kız Giydirme Oyunları](/kiz-giydirme-oyunlari) sayfalarında.",
  },
  {
    slug: "arcade-oyunlarinin-tarihi-ve-bugunu",
    title: "Arcade Oyunlarının Tarihi ve Bugünü",
    excerpt: "Atari salonlarından tarayıcıya: arcade oyunlarının evrimi.",
    intro: "Arcade oyunları, video oyun kültürünün temelini attı. Bugün aynı sade eğlence, tarayıcıda ücretsiz yaşıyor.",
    sections: [
      ["Dün ve bugün", ["- Jetonlu salon makineleri", "- Ev konsollarına taşınma", "- Tarayıcı/HTML5 dönemi"]],
      ["Neden hâlâ popüler?", ["Kolay öğrenilen, zor ustalaşılan mekanikler arcade'i zamansız kılar."]],
    ],
    cta: "Klasik ve modern arcade için [Arcade kategorisine](/kategori/arcade) ve [Popüler HTML5 Oyunları](/populer-html5-oyunlar) sayfasına bakın.",
  },
  {
    slug: "en-iyi-yaris-oyunlari-turleri",
    title: "En İyi Yarış Oyunları ve Türleri",
    excerpt: "Formula, ralli, sokak yarışı: yarış oyunu türleri ve önerileri.",
    intro: "Yarış oyunları, hız tutkunları için geniş bir tür yelpazesi sunar. Her tür farklı bir beceri seti ister.",
    sections: [
      ["Türler", ["- Formula/pist yarışı", "- Ralli/arazi", "- Sokak ve trafik yarışı"]],
      ["İpucu", ["İdeal viraj çizgisi (racing line) öğrenmek, tüm yarış türlerinde sürenizi kısaltır."]],
    ],
    cta: "Tümü [En İyi Yarış Oyunları](/en-iyi-yaris-oyunlari) ve [Yarış kategorisinde](/kategori/yaris); araba sevenler [En İyi Araba Oyunları](/en-iyi-araba-oyunlari) sayfasına bakabilir.",
  },
  {
    slug: "macera-oyunlari-kesfe-cikanlar-icin",
    title: "Macera Oyunları: Keşfe Çıkanlar İçin",
    excerpt: "Bulmacalar, hikâyeler, yeni dünyalar: en iyi ücretsiz macera oyunları.",
    intro: "Macera oyunları keşif ve problem çözmeyi birleştirir. Sabırlı oyuncuyu sürükleyici hikâyelerle ödüllendirir.",
    sections: [
      ["Tür çeşitleri", ["- Kaçış odası", "- Platform-macera", "- Hikâye odaklı keşif"]],
      ["İpucu", ["Çevreyi dikkatle incelemek; çoğu macera oyununda ipuçları detaylarda saklıdır."]],
    ],
    cta: "Tümü [Macera kategorisinde](/kategori/macera); bulmaca sevenler [En İyi Bulmaca Oyunları](/en-iyi-bulmaca-oyunlari) sayfasına bakabilir.",
  },
  {
    slug: "dovus-oyunlari-kombo-rehberi",
    title: "Dövüş Oyunları: Kombo ve Zamanlama Rehberi",
    excerpt: "Yumrukları savur, kombolarını yap: dövüş oyunlarında ustalaşma.",
    intro: "Dövüş oyunları refleks, zamanlama ve hareket ezberini bir araya getirir. Bloklamayı öğrenmek saldırı kadar önemlidir.",
    sections: [
      ["Temel beceriler", ["- Blok ve kaçış zamanlaması", "- Temel kombo zincirleri", "- Mesafe (spacing) kontrolü"]],
      ["İpucu", ["Sürekli saldırmak yerine rakibin hatasını bekleyip ceza vermek daha etkilidir."]],
    ],
    cta: "Tümü [En İyi Dövüş Oyunları](/en-iyi-dovus-oyunlari) ve [Dövüş kategorisinde](/kategori/dovus).",
  },
  {
    slug: "spor-oyunlari-cesitleri",
    title: "Spor Oyunları Çeşitleri ve Önerileri",
    excerpt: "Futbol, basketbol, tenis ve daha fazlası: ücretsiz spor oyunları.",
    intro: "Spor oyunları, sevdiğiniz sporu tarayıcıda yaşamanın yolu. Penaltıdan tam maça kadar her seviyeye hitap eder.",
    sections: [
      ["Popüler dallar", ["- Futbol ve basketbol", "- Tenis ve bilardo", "- Olimpik ve ekstrem sporlar"]],
      ["İpucu", ["Çoğu spor oyununda zamanlama, güçten daha belirleyicidir; sabırlı ol."]],
    ],
    cta: "Tümü [Spor kategorisinde](/kategori/spor); futbol sevenler [En İyi Futbol Oyunları](/en-iyi-futbol-oyunlari) sayfasına bakabilir.",
  },
  {
    slug: "en-iyi-nisanci-oyunlari-aim-rehberi",
    title: "En İyi Nişancı Oyunları ve Aim (Nişan) Rehberi",
    excerpt: "Nişan alma becerini geliştir: FPS oyunlarında daha iyi olmanın yolları.",
    intro: "İyi nişan, FPS oyunlarının kalbidir. Fare hassasiyetinden çapraz işaret (crosshair) yerleşimine kadar her detay önemlidir.",
    sections: [
      ["Aim geliştirme", ["- Sabit ve rahat bir fare hassasiyeti bul", "- Çapraz işareti baş hizasında tut", "- Refleks yerine ön nişan (pre-aim) çalış"]],
      ["İpucu", ["Hareket ederken ateş etmek isabeti düşürür; vuruş anında durmak doğruluğu artırır."]],
    ],
    cta: "Tümü [FPS / Nişancı Oyunları](/en-iyi-nisanci-oyunlari) ve [Ücretsiz Online Oyunlar](/ucretsiz-online-oyunlar) sayfalarında.",
  },
  {
    slug: "tek-elle-oynanan-mobil-oyunlar",
    title: "Tek Elle Oynanan Mobil Oyunlar",
    excerpt: "Otobüste, yolda, ayaktayken: tek elle kolayca oynanan oyunlar.",
    intro: "Bazen iki el lüks. Tek dokunuş ya da tek başparmakla oynanabilen oyunlar, hareket hâlinde eğlence için ideal.",
    sections: [
      ["Uygun türler", ["- Tek dokunuş arcade", "- Dikey kaydırma oyunları", "- Zamanlama temelli beceri oyunları"]],
      ["İpucu", ["Dikey (portrait) modda çalışan oyunlar tek el kullanımı için en rahatıdır."]],
    ],
    cta: "Hızlı tek-el oyunları için [Arcade kategorisine](/kategori/arcade) bakın.",
  },
  {
    slug: "beyin-egzersizi-zeka-oyunlari",
    title: "Beyin Egzersizi İçin Zekâ Oyunları",
    excerpt: "Hafıza, mantık, strateji: zihni formda tutan ücretsiz oyunlar.",
    intro: "Zekâ oyunları, eğlenirken hafıza ve mantık becerilerini çalıştırmanın keyifli bir yolu. Her yaşa uygun seçenekler var.",
    sections: [
      ["Türler", ["- Hafıza ve eşleştirme", "- Mantık ve sudoku tarzı", "- Satranç ve strateji"]],
      ["İpucu", ["Her gün kısa süreli düzenli pratik, uzun seyrek oturumlardan daha etkilidir."]],
    ],
    cta: "Tümü [Zekâ & Strateji kategorisinde](/kategori/zeka) ve [En İyi Bulmaca Oyunları](/en-iyi-bulmaca-oyunlari) sayfasında.",
  },
  {
    slug: "en-cok-oynanan-oyunlar-neden-populer",
    title: "En Çok Oynanan Oyunlar Neden Bu Kadar Popüler?",
    excerpt: "Topluluğun favorisi olan oyunların ortak özellikleri.",
    intro: "Bazı oyunlar diğerlerinden çok daha fazla oynanır. Bunun arkasında ortak birkaç tasarım sırrı var.",
    sections: [
      ["Ortak özellikler", ["- Hızlı ve sürtünmesiz başlangıç", "- 'Bir daha' dedirten kısa döngü", "- Adil zorluk eğrisi"]],
      ["Keşfet", ["Topluluğun en çok oynadığı oyunları takip etmek, kaliteli oyun bulmanın kestirme yoludur."]],
    ],
    cta: "Gerçek oynanma sayısına göre [En Çok Oynanan Oyunlar](/en-cok-oynanan-oyunlar) ve [Yeni Eklenen Oyunlar](/yeni-eklenen-oyunlar) sayfalarına bakın.",
  },
  {
    slug: "noel-ve-yilbasi-oyunlari",
    title: "Noel ve Yılbaşı Temalı Oyunlar",
    excerpt: "Kar, hediye, Noel Baba: mevsimlik eğlence için tatil oyunları.",
    intro: "Yılbaşı temalı oyunlar, tatil ruhunu ekrana taşır. Süsleme, hediye dağıtma ve kar temalı bulmacalar sezonun favorisi.",
    sections: [
      ["Tür çeşitleri", ["- Süsleme ve dekorasyon", "- Hediye toplama arcade", "- Kar ve buz temalı bulmacalar"]],
      ["İpucu", ["Tatil oyunları kısa ve şenlikli olur; aileyle birlikte oynamak için idealdir."]],
    ],
    cta: "Bulmaca sevenler [En İyi Bulmaca Oyunları](/en-iyi-bulmaca-oyunlari), aile için [Çocuklar İçin Oyunlar](/cocuklar-icin-oyunlar) sayfasına bakabilir.",
  },
  {
    slug: "balik-ve-deniz-temalı-oyunlar",
    title: "Balık ve Deniz Temalı Oyunlar",
    excerpt: "Balık tut, denizaltını keşfet: sakin ve eğlenceli su temalı oyunlar.",
    intro: "Deniz temalı oyunlar, rahatlatıcı atmosferleriyle öne çıkar. Balık tutmadan akvaryum yönetimine kadar geniş bir yelpaze sunar.",
    sections: [
      ["Türler", ["- Balık tutma simülasyonu", "- Sualtı keşif/macera", "- Akvaryum ve balık büyütme"]],
      ["İpucu", ["Balık tutma oyunlarında sabır ve doğru zamanlama, büyük av için anahtardır."]],
    ],
    cta: "Daha fazla sakin oyun için [En İyi Bulmaca Oyunları](/en-iyi-bulmaca-oyunlari) ve [Macera kategorisine](/kategori/macera) bakın.",
  },
  {
    slug: "tank-ve-savas-araci-oyunlari",
    title: "Tank ve Savaş Aracı Oyunları",
    excerpt: "Zırhını kuşan, ateş et: tank ve askeri araç oyunları.",
    intro: "Tank oyunları, ağır makinelerin gücünü ve taktiksel nişancılığı birleştirir. Konum ve zamanlama her şeydir.",
    sections: [
      ["Taktik", ["- Açık alanda kalma, siper kullan", "- Önce zayıf noktayı (yan/arka zırh) hedefle", "- Ekip oyununda destek ol"]],
      ["İpucu", ["Sürekli hareket etmek, sabit durup vurmaktan daha güvenlidir."]],
    ],
    cta: "Tümü [En İyi Savaş Oyunları](/en-iyi-savas-oyunlari) ve [Aksiyon kategorisinde](/kategori/aksiyon).",
  },
  {
    slug: "kelime-ve-bilgi-oyunlari",
    title: "Kelime ve Bilgi Yarışması Oyunları",
    excerpt: "Kelime bul, bilgini sına: eğlenceli ve öğretici kelime oyunları.",
    intro: "Kelime ve bilgi oyunları, eğlenirken kelime dağarcığını ve genel kültürü geliştirir. Her yaşa hitap eder.",
    sections: [
      ["Türler", ["- Kelime bulmaca ve anagram", "- Bilgi yarışması (quiz)", "- Harf ve kelime türetme"]],
      ["İpucu", ["Kelime oyunlarında kısa ve sık kullanılan eklerle başlamak hızlı puan getirir."]],
    ],
    cta: "Tümü [Zekâ & Strateji kategorisinde](/kategori/zeka) ve [En İyi Bulmaca Oyunları](/en-iyi-bulmaca-oyunlari) sayfasında.",
  },
  {
    slug: "atlatma-ve-platform-oyunlari",
    title: "Atlama ve Platform Oyunları",
    excerpt: "Zıpla, tırman, engelleri aş: klasik platform oyunlarının en iyileri.",
    intro: "Platform oyunları, zamanlama ve hassas kontrol ister. Klasik 'zıpla ve geç' mekaniği nesiller boyu sevildi.",
    sections: [
      ["Tür çeşitleri", ["- Klasik 2D platform", "- Hassas zıplama (precision)", "- Bulmaca-platform"]],
      ["İpucu", ["Zıplama mesafesini ölçmek için tehlikeli atlayışlardan önce küçük denemeler yapın."]],
    ],
    cta: "Tümü [Macera kategorisinde](/kategori/macera) ve [Arcade kategorisinde](/kategori/arcade).",
  },
  {
    slug: "ucak-ve-helikopter-oyunlari",
    title: "Uçak ve Helikopter Oyunları",
    excerpt: "Gökyüzünü fethet: uçuş, hava savaşı ve helikopter oyunları.",
    intro: "Uçuş oyunları özgürlük hissi verir. Sakin uçuş simülasyonlarından kıyasıya hava savaşlarına kadar uzanır.",
    sections: [
      ["Türler", ["- Uçuş simülasyonu", "- Hava savaşı/nişancı", "- Helikopter görev ve kurtarma"]],
      ["İpucu", ["İrtifa ve hız dengesini korumak, hem savaşta hem inişte hayat kurtarır."]],
    ],
    cta: "Daha fazla aksiyon için [Aksiyon kategorisine](/kategori/aksiyon) ve [En İyi Savaş Oyunları](/en-iyi-savas-oyunlari) sayfasına bakın.",
  },
  {
    slug: "fizik-tabanli-oyunlar",
    title: "Fizik Tabanlı Oyunlar: Mantık ve Yaratıcılık",
    excerpt: "Yerçekimi, denge, sıçrama: fizik motorlu zekice oyunlar.",
    intro: "Fizik tabanlı oyunlar, gerçek dünya kurallarını oyunlaştırır. Yaratıcı çözümler ve deneme-yanılma ödüllendirilir.",
    sections: [
      ["Tür çeşitleri", ["- Denge ve yığma", "- İp kesme/nesne yönlendirme", "- Araç fiziği"]],
      ["İpucu", ["İlk denemede çözmeye çalışmayın; fizik oyunları sabırlı deneylerle açılır."]],
    ],
    cta: "Tümü [En İyi Bulmaca Oyunları](/en-iyi-bulmaca-oyunlari) ve [Zekâ & Strateji kategorisinde](/kategori/zeka).",
  },
  {
    slug: "hayvan-ve-evcil-dostlar-oyunlari",
    title: "Hayvan ve Evcil Hayvan Oyunları",
    excerpt: "Besle, bak, oyna: çocuklar için sevimli hayvan oyunları.",
    intro: "Hayvan oyunları, sorumluluk ve şefkat duygusunu eğlenceyle aşılar. Özellikle çocuklar için idealdir.",
    sections: [
      ["Türler", ["- Evcil hayvan bakımı", "- Hayvan kuaförü/temizlik", "- Çiftlik ve hayvanat bahçesi yönetimi"]],
      ["İpucu", ["Bakım oyunlarında düzenli görevleri (besleme, temizlik) ihmal etmemek puanı yükseltir."]],
    ],
    cta: "Tümü [Çocuklar İçin Oyunlar](/cocuklar-icin-oyunlar) ve [Çocuk kategorisinde](/kategori/cocuk).",
  },
  {
    slug: "soygun-ve-hirsiz-oyunlari",
    title: "Soygun ve Hırsız Oyunları",
    excerpt: "Plan yap, fark edilmeden kaç: gizlilik ve aksiyon dolu soygun oyunları.",
    intro: "Soygun oyunları, planlama ve gizliliği aksiyonla birleştirir. Doğru zamanlama, yakalanmakla kaçmak arasındaki farktır.",
    sections: [
      ["Mekanikler", ["- Gizlilik ve görüş alanından kaçınma", "- Bulmaca çözerek ilerleme", "- Hız ve kaçış"]],
      ["İpucu", ["Acele etmeyin; çoğu soygun oyununda sabır, gürültü yapmaktan daha kazançlıdır."]],
    ],
    cta: "Daha fazla aksiyon-macera için [Aksiyon kategorisine](/kategori/aksiyon) ve [Macera kategorisine](/kategori/macera) bakın.",
  },
  {
    slug: "klavye-kisayollari-ile-daha-iyi-oyna",
    title: "Klavye Kısayolları ile Tarayıcı Oyunlarında Daha İyi Oyna",
    excerpt: "Tam ekran, sessize alma, yenileme: oyun keyfini artıran küçük püf noktaları.",
    intro: "Tarayıcı oyunlarından en iyi verimi almak için birkaç pratik ipucu, deneyimi belirgin iyileştirir.",
    sections: [
      ["Faydalı alışkanlıklar", ["- Tam ekran için oyun içi tam ekran düğmesini kullan", "- Gereksiz sekmeleri kapatarak performansı artır", "- Takılma olursa sayfayı yenile"]],
      ["İpucu", ["Çoğu oyunda WASD + fare standarttır; oyuna başlamadan kontrol şemasına göz atın."]],
    ],
    cta: "Hemen denemek için [Tüm Oyunlar](/oyunlar) sayfasına git veya sürpriz için bir [rastgele oyun](/rastgele) aç.",
  },
  {
    slug: "ucretsiz-oyunlar-nasil-gelir-elde-eder",
    title: "Ücretsiz Oyunlar Nasıl Ücretsiz Olabiliyor?",
    excerpt: "Reklam destekli model: ücretsiz oyun platformları nasıl ayakta kalır?",
    intro: "Binlerce oyunu ücretsiz sunmak mümkün, çünkü bu platformlar reklam destekli çalışır. Peki bu model nasıl işliyor?",
    sections: [
      ["Model", ["- Oyun içi ve sayfa reklamları", "- Oyun ağlarıyla gelir paylaşımı", "- Premium/oyun-içi satın almalar (opsiyonel)"]],
      ["Oyuncuya etkisi", ["Reklam destekli model, oyuncunun ücret ödemeden binlerce oyuna erişmesini sağlar."]],
    ],
    cta: "Keşfetmeye [Popüler HTML5 Oyunları](/populer-html5-oyunlar) veya [Premium Oyunlar](/premium) sayfasından başlayabilirsin.",
  },
  {
    slug: "io-oyunlarinin-yukselisi",
    title: ".io Oyunlarının Yükselişi ve En İyileri",
    excerpt: "agar.io'dan bugüne: .io türünün popülerliğinin arkasındaki sebepler.",
    intro: ".io oyunları, sade tarayıcı çok oyunculu oyunların simgesi oldu. Anında başlama ve sosyal rekabet, türü zirveye taşıdı.",
    sections: [
      ["Neden popüler?", ["- Üyelik/indirme yok", "- Kısa ve yoğun maçlar", "- Herkese açık dünya rekabeti"]],
      ["Strateji", ["Çoğu .io oyununda erken oyunda güvenli büyümek, geç oyunda agresif olmaktan daha çok kazandırır."]],
    ],
    cta: "Tümü [.io Oyunları kategorisinde](/kategori/io) ve [Ücretsiz Online Oyunlar](/ucretsiz-online-oyunlar) sayfasında.",
  },
  {
    slug: "aile-ile-oynanacak-oyunlar",
    title: "Tüm Aile ile Oynanacak Oyunlar",
    excerpt: "Küçük büyük herkese uygun, birlikte oynanan eğlenceli oyunlar.",
    intro: "Aile vakti için oyun seçerken herkesin keyif alacağı, kolay öğrenilen ve rekabeti tatlı oyunlar idealdir.",
    sections: [
      ["İyi seçenekler", ["- 2 kişilik yarış ve spor", "- Sıra tabanlı bulmacalar", "- Eğitici çocuk oyunları"]],
      ["İpucu", ["Sırayla oynanan oyunlar, tek cihazda tüm ailenin katılımını kolaylaştırır."]],
    ],
    cta: "Birlikte oynamak için [2 Kişilik Oyunlar](/2-kisilik-oyunlar) ve [Çocuklar İçin Oyunlar](/cocuklar-icin-oyunlar) sayfalarına bakın.",
  },
  {
    slug: "merge-ve-birlestirme-oyunlari",
    title: "Merge (Birleştirme) Oyunları Rehberi",
    excerpt: "Aynıları birleştir, büyüt, geliş: bağımlılık yapan merge oyunları.",
    intro: "Merge oyunları basit bir fikir üzerine kurulu: aynı nesneleri birleştirerek daha büyüğünü elde et. Sade ama çok tatmin edici.",
    sections: [
      ["Mantık", ["- İkili eşleştirerek seviye atlat", "- Tahta yönetimi: yer aç, tıkanma", "- Hedef odaklı ilerleme"]],
      ["İpucu", ["Tahtayı erken doldurmamak için küçük birleştirmeleri biriktirmeden yapın."]],
    ],
    cta: "Tümü [En İyi Bulmaca Oyunları](/en-iyi-bulmaca-oyunlari) ve [Bulmaca kategorisinde](/kategori/bulmaca).",
  },
  {
    slug: "tarayici-oyunlari-guvenli-mi",
    title: "Tarayıcı Oyunları Güvenli mi? Bilmeniz Gerekenler",
    excerpt: "İndirmesiz oyunların güvenliği, çerezler ve ebeveyn önerileri.",
    intro: "Tarayıcı oyunları indirme gerektirmediği için cihazınıza dosya yüklemez; bu da onları görece güvenli kılar. Yine de bilinmesi gerekenler var.",
    sections: [
      ["Güvenlik avantajı", ["- Kurulum/dosya yok", "- İzole tarayıcı ortamında çalışır", "- Anında kapatılabilir"]],
      ["Dikkat", ["Reklamlara tıklarken dikkatli olun ve çocuklar için gözetim önerilir; çerez tercihlerinizi yönetebilirsiniz."]],
    ],
    cta: "Çerez tercihlerini [Gizlilik Tercihleri](/gizlilik-tercihleri) sayfasından yönetebilir, güvenli seçki için [Çocuklar İçin Oyunlar](/cocuklar-icin-oyunlar) sayfasına bakabilirsiniz.",
  },
  {
    slug: "kart-ve-masa-oyunlari",
    title: "Kart ve Masa Oyunları: Klasiklerin Dijital Hali",
    excerpt: "Solitaire, satranç, tavla: sevilen masa oyunlarının ücretsiz dijital versiyonları.",
    intro: "Kart ve masa oyunları, dijital ortamda da çekiciliğini koruyor. Tek başına ya da rakibe karşı, her zaman keyifli.",
    sections: [
      ["Popüler oyunlar", ["- Solitaire ve kart oyunları", "- Satranç ve dama", "- Tavla ve domino"]],
      ["İpucu", ["Strateji oyunlarında birkaç hamle ileriyi düşünmek, anlık hamleden çok daha kazançlıdır."]],
    ],
    cta: "Tümü [Zekâ & Strateji kategorisinde](/kategori/zeka).",
  },
  {
    slug: "yeni-eklenen-oyunlari-takip-et",
    title: "Yeni Eklenen Oyunları Takip Etmenin Avantajları",
    excerpt: "Trendleri ilk sen yakala: yeni oyunları takip etmek neden işe yarar?",
    intro: "Oyun dünyası hızlı değişir. Yeni eklenen oyunları takip etmek, henüz kalabalıklaşmamış oyunlarda öne geçmeni sağlar.",
    sections: [
      ["Neden takip etmeli?", ["- Taze mekanikleri ilk deneme", "- Online oyunlarda erken avantaj", "- En iyileri herkesten önce keşfetme"]],
      ["İpucu", ["Yeni online oyunlarda topluluk küçükken katılmak, sıralamada yükselmeyi kolaylaştırır."]],
    ],
    cta: "En güncel oyunlar [Yeni Eklenen Oyunlar](/yeni-eklenen-oyunlar) ve topluluk favorileri [En Çok Oynanan Oyunlar](/en-cok-oynanan-oyunlar) sayfasında.",
  },
  {
    slug: "en-iyi-bulmaca-oyunlari-rehberi",
    title: "En İyi Bulmaca Oyunları Rehberi (2026)",
    excerpt: "Match-3'ten mantık bulmacalarına: zekânı zorlayacak en iyi ücretsiz bulmaca oyunları.",
    intro: "Bulmaca oyunları hem rahatlatır hem zihni keskin tutar. Eşleştirme, mantık ve kelime türleriyle her seviyeye uygun seçenek var. Bu rehberde tarzına göre doğru bulmacayı seçmeni kolaylaştırıyoruz.",
    sections: [
      ["Bulmaca türleri", ["- **Match-3:** hızlı, ödüllü, mola dostu", "- **Mantık/blok:** sabır ve planlama ister", "- **Kelime:** kelime dağarcığını geliştirir"]],
      ["Daha iyi oynamak için", ["Aceleci hamleler yerine birkaç hamle ileriyi düşünmek, çoğu bulmacada daha yüksek skor ve daha az takılma sağlar."]],
    ],
    cta: "Tüm seçenekler [En İyi Bulmaca Oyunları](/en-iyi-bulmaca-oyunlari) koleksiyonunda; strateji sevenler [Zekâ & Strateji](/kategori/zeka) kategorisine de bakmalı.",
  },
  {
    slug: "zeka-oyunlari-beyin-egzersizi",
    title: "Zekâ Oyunları: Eğlenirken Beyin Egzersizi",
    excerpt: "Strateji ve mantık oyunları hafızayı ve problem çözmeyi nasıl güçlendirir?",
    intro: "Zekâ oyunları sadece eğlence değil; planlama, dikkat ve problem çözme becerilerini de çalıştırır. Düzenli oynamak, kısa molalarda zihni dinç tutmanın keyifli bir yolu.",
    sections: [
      ["Hangi beceriyi geliştirir?", ["- Planlama ve öngörü (strateji)", "- Dikkat ve örüntü tanıma (mantık)", "- Hafıza ve hız (refleks bulmacaları)"]],
      ["Öneri", ["Her gün 10-15 dakikalık kısa seanslar, uzun ve seyrek oturumlardan daha verimlidir."]],
    ],
    cta: "Beyin çalıştıran oyunlar [Zekâ & Strateji](/kategori/zeka) kategorisinde; rahatlatıcı seçenekler için [En İyi Bulmaca Oyunları](/en-iyi-bulmaca-oyunlari) koleksiyonuna göz at.",
  },
  {
    slug: "zombi-oyunlari-hayatta-kalma-taktikleri",
    title: "Zombi Oyunlarında Hayatta Kalma Taktikleri",
    excerpt: "Mermini koru, kaçış yolunu planla: zombi oyunlarında daha uzun hayatta kalmanın yolları.",
    intro: "Zombi oyunları gerilim ve aksiyonu bir arada sunar. Kaynak yönetimi ve konumlanma, çoğu oyunda hayatta kalmanın anahtarıdır. İşte daha uzun dayanmanı sağlayacak temel taktikler.",
    sections: [
      ["Temel kurallar", ["- Mermiyi boşa harcama, kafa nişanını tercih et", "- Sırtını duvara ver, çevrelenme", "- Kaçış yolunu önceden belirle"]],
      ["İleri taktik", ["Dar koridorlar zombileri tek sıraya sokar; kalabalık alanlardan uzak durmak ömrünü ciddi uzatır."]],
    ],
    cta: "Tüm hayatta kalma savaşları [Zombi Oyunları](/zombi-oyunlari) koleksiyonunda; daha fazla aksiyon için [En İyi Nişancı Oyunları](/en-iyi-nisanci-oyunlari) sayfasına bak.",
  },
  {
    slug: "minecraft-tarzi-oyunlar",
    title: "Minecraft Tarzı Oyunlar: Kutu Dünyada Yarat ve Keşfet",
    excerpt: "İndirme yok! Tarayıcıda oynanan en iyi Minecraft tarzı inşa ve hayatta kalma oyunları.",
    intro: "Blok dünyalarda inşa etmek, kazmak ve hayatta kalmak kuşaklar boyu sevildi. Tarayıcı sürümleri, kurulum derdi olmadan bu yaratıcı deneyimi sunar.",
    sections: [
      ["Bu türde ne var?", ["- Serbest inşa (creative) modları", "- Kaynak toplama ve hayatta kalma", "- Piksel/voxel keşif dünyaları"]],
      ["Yeni başlayana", ["Önce güvenli bir sığınak inşa et, sonra keşfe çık. Gece düşmanlarına karşı ışık ve duvar en iyi savunmadır."]],
    ],
    cta: "Hepsi [En İyi Minecraft Oyunları](/en-iyi-minecraft-oyunlari) koleksiyonunda; bol grafik isteyenler [En İyi 3D Oyunlar](/en-iyi-3d-oyunlar) sayfasına da bakmalı.",
  },
  {
    slug: "en-iyi-futbol-oyunlari-2026",
    title: "En İyi Futbol Oyunları (2026)",
    excerpt: "Penaltıdan turnuvaya: tarayıcıda ücretsiz oynanan en iyi futbol oyunları.",
    intro: "Futbol oyunları, kısa maçlardan turnuva modlarına geniş bir yelpaze sunar. Hızlı bir penaltı atışından tam saha kapışmaya kadar her zevke uygun seçenek var.",
    sections: [
      ["Mod çeşitleri", ["- Penaltı atışları (hızlı keyif)", "- Tek maç ve turnuva", "- Kafa topu / mini futbol varyasyonları"]],
      ["İpucu", ["Şut atarken gücü ve yönü birlikte ayarlamak, kalecisi güçlü oyunlarda gol şansını artırır."]],
    ],
    cta: "Sahaya çıkmak için [En İyi Futbol Oyunları](/en-iyi-futbol-oyunlari) koleksiyonu ve [Spor](/kategori/spor) kategorisi seni bekliyor.",
  },
  {
    slug: "giydirme-oyunlari-stil-rehberi",
    title: "Giydirme ve Makyaj Oyunları: Stil Rehberi",
    excerpt: "Kendi tarzını yarat: en eğlenceli giydirme, makyaj ve moda oyunları.",
    intro: "Giydirme ve makyaj oyunları yaratıcılığı serbest bırakır. Renk uyumu, kombin ve detaylarla kendi stilini tasarlamak hem keyifli hem rahatlatıcı.",
    sections: [
      ["Tarz ipuçları", ["- Renkleri 2-3 ana tonla sınırlı tut", "- Aksesuarı abartma, dengeyi koru", "- Tema ve mekâna uygun kombin seç"]],
      ["Eğlence katmanı", ["Birçok oyun mevsim ve etkinlik temaları sunar; aynı karaktere farklı tarzlar deneyerek koleksiyon yapabilirsin."]],
    ],
    cta: "Moda tutkunları [Kız Giydirme Oyunları](/kiz-giydirme-oyunlari) ve [Makyaj Oyunları](/makyaj-oyunlari) koleksiyonlarını sevecek.",
  },
  {
    slug: "kule-savunma-strateji-rehberi",
    title: "Kule Savunma (Tower Defense) Strateji Rehberi",
    excerpt: "Doğru kuleyi doğru yere koy: kule savunma oyunlarında kazanma stratejileri.",
    intro: "Kule savunma oyunları, planlama ve ekonomi yönetimini test eder. Düşman dalgalarını durdurmak için kule seçimi ve yerleşimi her şeyi belirler.",
    sections: [
      ["Temel strateji", ["- Yol dönüşlerine yüksek hasarlı kuleler koy", "- Yavaşlatan kulelerle hasar kulelerini birleştir", "- Para biriktirip kritik noktayı güçlendir"]],
      ["İleri seviye", ["Erken dalgalarda fazla harcamayıp ekonomiyi büyütmek, geç dalgalarda güçlü bir savunma kurmanı sağlar."]],
    ],
    cta: "Savunmanı kur: [Kule Savunma Oyunları](/kule-savunma-oyunlari) koleksiyonu ve [Zekâ & Strateji](/kategori/zeka) kategorisi.",
  },
  {
    slug: "cocuklar-icin-guvenli-oyun-secimi",
    title: "Çocuklar İçin Güvenli Oyun Seçimi: Ebeveyn Rehberi",
    excerpt: "Yaşa uygun, şiddet içermeyen, eğitici oyunları nasıl seçersiniz?",
    intro: "Çocuklar için oyun seçerken yaş uygunluğu, içerik ve süre önemlidir. Bu rehber, eğlenceli ama güvenli bir oyun deneyimi için ebeveynlere pratik öneriler sunar.",
    sections: [
      ["Nelere dikkat etmeli?", ["- Şiddet içermeyen, renkli ve sade oyunlar", "- Eğitici (sayı, renk, eşleştirme) içerikler", "- Makul oyun süresi ve molalar"]],
      ["Güvenlik notu", ["Oyun sürelerini birlikte belirlemek ve ekran molaları vermek, sağlıklı bir alışkanlık oluşturur. Yaş rehberimiz yol gösterir."]],
    ],
    cta: "Aileler için [Çocuklar İçin Oyunlar](/cocuklar-icin-oyunlar) koleksiyonu ve [Çocuk](/kategori/cocuk) kategorisi güvenli seçimler sunar.",
  },
  {
    slug: "mobil-tarayicida-oyun-oynama-rehberi",
    title: "Mobil Tarayıcıda Oyun Oynama Rehberi",
    excerpt: "Telefonda akıcı oyun: uygulama indirmeden tarayıcıda en iyi deneyim için ipuçları.",
    intro: "HTML5 oyunlar telefon tarayıcısında uygulama indirmeden çalışır. Birkaç basit ayarla mobilde daha akıcı ve keyifli bir deneyim elde edebilirsin.",
    sections: [
      ["Daha akıcı için", ["- Arka plan sekmelerini kapat", "- Pil tasarrufu modu performansı düşürebilir", "- Wi-Fi, online oyunlarda daha stabildir"]],
      ["Pratik ipucu", ["Sık oynadığın siteyi 'ana ekrana ekle' ile uygulama gibi açabilir, tam ekran ve hızlı erişim kazanabilirsin."]],
    ],
    cta: "Mobilde hemen başlamak için [Popüler HTML5 Oyunlar](/populer-html5-oyunlar) ve [Yeni Eklenen Oyunlar](/yeni-eklenen-oyunlar) sayfalarına göz at.",
  },
  {
    slug: "park-etme-oyunlari-rehberi",
    title: "Park Etme Oyunları: Hassas Sürüşün Keyfi",
    excerpt: "Dar alana kusursuz park: park etme oyunlarında ustalaşma ipuçları.",
    intro: "Park etme oyunları sabır ve hassasiyet ister. Direksiyon, gaz ve fren kontrolünü dengelemek, çiziksiz park etmenin sırrıdır.",
    sections: [
      ["Temel teknik", ["- Yavaş ve kontrollü ilerle", "- Aynalara/kamera açısına dikkat et", "- Direksiyonu erken çevirip açıyı ayarla"]],
      ["Zorluk arttıkça", ["İleri seviyelerde römork ve dar geçitler gelir; sabırlı ve küçük düzeltmelerle ilerlemek en iyi sonucu verir."]],
    ],
    cta: "Direksiyon başına: [Park Etme Oyunları](/park-etme-oyunlari) koleksiyonu ve [Yarış](/kategori/yaris) kategorisi.",
  },
  {
    slug: "bilardo-oyunlari-ipuclari",
    title: "Bilardo Oyunları: Açı ve Vuruş İpuçları",
    excerpt: "Doğru açı, doğru güç: bilardo oyunlarında daha iyi oynamanın yolları.",
    intro: "Bilardo, geometri ve kontrolün buluştuğu sakin ama rekabetçi bir oyundur. Açıyı okumak ve vuruş gücünü ayarlamak, masada fark yaratır.",
    sections: [
      ["Temel ilkeler", ["- Vuruştan önce açıyı zihninde çiz", "- Gücü topun gideceği mesafeye göre ayarla", "- Beyaz topun nereye gideceğini de planla"]],
      ["İpucu", ["Sert vuruş her zaman iyi değildir; kontrollü ve planlı vuruşlar pozisyonu korumana yardım eder."]],
    ],
    cta: "Istakanı al: [Bilardo Oyunları](/bilardo-oyunlari) koleksiyonu ve daha fazla zihinsel oyun için [Zekâ & Strateji](/kategori/zeka).",
  },
];

export const SEO_POSTS: Post[] = SPECS.map(build);

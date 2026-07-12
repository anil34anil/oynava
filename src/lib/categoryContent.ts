/**
 * Kategori sayfaları için ÖZGÜN, elle yazılmış Türkçe içerik.
 *
 * Amaç: kategori sayfaları head-term ("araba oyunları", "aksiyon oyunları" ...) için
 * asıl sıralama hedefidir. Tek kısa paragraf yerine her kategoriye benzersiz, derinlikli
 * metin → hem SEO sıralaması hem AdSense "değerli içerik" sinyali güçlenir.
 *
 * - lead : kısa özet (meta description + sayfa üstü giriş)
 * - body : sayfanın altında render edilen 2 özgün paragraf (kategoriye ÖZEL, şablon değil)
 *
 * Yeni kategori eklerken buraya benzersiz metin yaz; fallback jenerik ve incedir.
 */
export type CategoryContent = { lead: string; body: string[] };

export const CATEGORY_CONTENT: Record<string, CategoryContent> = {
  originals: {
    lead:
      "Oynava ekibinin sıfırdan tasarlayıp geliştirdiği, yalnızca burada oynayabileceğin özgün oyunlar. Başka hiçbir sitede bulamayacağın, tamamen bize ait yapımlar.",
    body: [
      "Oynava Originals, dışarıdan derlenen oyunların aksine kendi stüdyomuzda kod satır satır yazılan yapımlardan oluşur. İzometrik aksiyon-RPG GölgeDiyarı'nda gölge yaratıklarıyla savaşıp beş nadirlik kademesinde ganimet toplar, ekipmanını yükseltirsin; Minecraft tarzı 3B sanal dünya BlokKraft'ta ise blok kırar, kaynak toplar ve kendi dünyanı özgürce inşa edersin. Her ikisi de tarayıcıda, indirmeden çalışır ve ilerlemen otomatik kaydedilir.",
      "Bu oyunlar bilgisayarda klavye-fare, mobilde dokunmatik kontrollerle oynanabilir. Amacımız reklam kuşatması olmayan, gerçekten keyifli ve özgün bir oyun deneyimi sunmak. Oynava Originals koleksiyonu düzenli olarak yeni yapımlarla büyüyor — geri gel, her ziyarette yeni bir şey bulabilirsin.",
    ],
  },
  aksiyon: {
    lead:
      "Tempolu nişancı, savaş ve hayatta kalma oyunları burada. Reflekslerini test et, düşmanları alt et; hepsi ücretsiz ve indirmeden tarayıcında.",
    body: [
      "Aksiyon oyunları hızlı karar verme, keskin refleks ve iyi bir nişan gerektirir. Bu kategoride birinci ve üçüncü şahıs nişancılardan (FPS/TPS) zombi hayatta kalma oyunlarına, ninja ve stickman dövüşlerinden büyük ölçekli savaş simülasyonlarına kadar geniş bir yelpaze bulacaksın. Kısa turlu arcade nişancılar hızlı bir adrenalin molası sunarken, görev tabanlı oyunlar seni saatlerce ekrana bağlar.",
      "Yeni başlıyorsan düşük tempolu hedef-vurma oyunlarıyla nişan alışkanlığını geliştir, ardından çok oyunculu arenalara geç. Çoğu aksiyon oyunu hem klavye-fare hem dokunmatik kontrol destekler; mobilde de akıcı çalışır. Sayfadaki oyunlar popülerliğe göre sıralıdır — en üsttekiler topluluğun en çok oynadıklarıdır.",
    ],
  },
  macera: {
    lead:
      "Keşfedilecek dünyalar, çözülecek bulmacalar ve sürükleyici hikâyeler. Macera oyunlarıyla yeni diyarlara açıl; ücretsiz ve indirmeden.",
    body: [
      "Macera oyunları keşif, hikâye ve problem çözmeyi bir araya getirir. Kaçış odası (escape room) yapımlarında ipuçlarını birleştirip kilitli kapıları açar, platform-macera oyunlarında tehlikeli bölümleri atlayarak ilerler, nokta-tıkla maceralarında ise gizemli bir dünyanın sırlarını çözersin. Aceleden çok gözlem ve sabır ödüllendirilir.",
      "Bu türden en iyi verimi almak için çevreyi dikkatle incele; çoğu bulmacanın çözümü sahnede saklıdır. Takıldığında geri dönüp topladığın eşyaları yeniden gözden geçir. Macera oyunlarının çoğu tek oturuşta bitmez — ilerlemen kaydedildiği için istediğin an kaldığın yerden devam edebilirsin.",
    ],
  },
  yaris: {
    lead:
      "Araba, motor ve drift oyunları! Hızın doruğunda yarış, rakiplerini geç, pistin kralı ol. Ücretsiz yarış oyunları, indirmeden ve üyeliksiz.",
    body: [
      "Yarış oyunları tür olarak oldukça çeşitlidir: gerçekçi araba simülasyonlarından çılgın trafik oyunlarına, drift ve motor yarışlarından park etme ve sürüş becerisi testlerine kadar her damak tadına uygun bir başlık var. 3B grafikli yapımlar konsol hissi verirken, hafif arcade yarışlar anında açılıp hızlı eğlence sunar.",
      "İyi bir yarışçı olmanın sırrı frenleme noktalarını öğrenmektir; virajlara girmeden önce hızını ayarlayan sürücü, düz yolda gaza yüklenenden daha hızlı tur atar. Nitro/turbo desteğini rakip geçişleri için sakla. Oyunlar bilgisayarda ok tuşları veya WASD ile, mobilde dokunmatik gaz-fren-direksiyon ile oynanır.",
    ],
  },
  spor: {
    lead:
      "Futbol, basketbol ve daha fazlası. Sevdiğin sporu tarayıcında oyna, şampiyonluğa koş — ücretsiz ve indirmeden.",
    body: [
      "Spor oyunları gerçek sahaların heyecanını tarayıcıya taşır. Penaltı atışlarından tam kadro futbol maçlarına, üç sayılık basket yarışmalarından bilardo, tenis ve golf gibi hassasiyet oyunlarına kadar geniş bir seçki bu kategoride toplandı. Kısa maçlar hızlı bir mola sunarken, turnuva modları kupayı kaldırana dek seni oyunda tutar.",
      "Spor oyunlarında başarı çoğu zaman zamanlamayla ilgilidir: doğru anda vurulan şut, iyi ayarlanmış bir pas veya tam yerinde bir savunma maçı çevirir. Çoğu başlık tek oyunculu turnuvanın yanı sıra aynı cihazda iki kişilik moda da sahiptir — arkadaşınla karşılıklı oynayabilirsin.",
    ],
  },
  dovus: {
    lead:
      "Boks, dövüş ve güreş oyunları. Yumrukları savur, kombolarını yap, ringin hâkimi ol. Ücretsiz dövüş oyunları, indirmeden anında.",
    body: [
      "Dövüş oyunları refleks, zamanlama ve kombo ezberi üzerine kuruludur. Klasik ring boksundan sokak dövüşlerine, stickman kapışmalarından silahlı arena savaşlarına kadar farklı stiller bu kategoride yer alır. Kimi oyun tek tuşla erişilebilir sadelikte, kimisi ise özel hareket ve bitiriş vuruşlarıyla derinlik sunar.",
      "İyi bir dövüşçü sadece saldırmaz; savunmayı, blok atmayı ve doğru anda karşı atağa geçmeyi de bilir. Rakibin ritmini okuyup boşluk bulduğunda kombonu başlat. Oyunların çoğu tek oyunculu kariyer modunun yanında aynı klavyede iki kişilik dövüş imkânı da verir.",
    ],
  },
  bulmaca: {
    lead:
      "Zekânı çalıştıran bulmaca ve eşleştirme oyunları. Rahatla, düşün ve seviyeleri tek tek çöz — en geniş ücretsiz koleksiyon burada.",
    body: [
      "Bulmaca oyunları hem dinlendirici hem de zihin açıcıdır. Üçlü eşleştirme (match-3), birleştirme (merge), balon patlatma, mahjong ve kelime bulmacaları bu kategorinin en sevilen türleridir. Kısa seanslarda rahatlamak isteyenler için idealdir; her seviye bir öncekinden biraz daha zorlaşarak seni ustalaşmaya iter.",
      "Yüksek puan için acele etmek yerine hamlelerini planla; çoğu bulmacada birkaç saniye düşünmek, gelişigüzel oynamaktan çok daha verimlidir. Zincirleme (combo) hamleleri kovala — art arda yapılan eşleştirmeler genellikle bonus puan kazandırır. Oyunlar tamamen tarayıcı tabanlıdır ve telefonda dokunmatikle akıcı çalışır.",
    ],
  },
  zeka: {
    lead:
      "Strateji, mantık ve zekâ oyunları. Planla, taktik kur ve her hamlede bir adım önde ol — ücretsiz ve indirmeden.",
    body: [
      "Zekâ ve strateji oyunları uzun vadeli düşünmeyi ödüllendirir. Satranç ve masa oyunlarından kule savunmasına, kaynak yönetimi ve şehir kurma oyunlarından mantık bulmacalarına kadar bu kategori planlama sevenler için bir hazine. Refleksten çok öngörü ve doğru karar önemlidir.",
      "Strateji oyunlarında erken yapılan küçük hatalar ilerleyen turlarda büyür; bu yüzden ilk hamlelerini savurmadan, bir plan dahilinde oyna. Kaynaklarını (altın, birim, enerji) hemen tüketmek yerine biriktirip doğru anda kullanan oyuncu genellikle kazanır. Oyunlar bilgisayarda fareyle, mobilde dokunmatikle rahatça oynanır.",
    ],
  },
  io: {
    lead:
      "Çok oyunculu .io arenalarında dünyanın dört bir yanından oyuncularla yarış, büyü ve hayatta kal — üyeliksiz, anında.",
    body: [
      ".io oyunları basit kuralları ve gerçek zamanlı çok oyunculu yapısıyla bağımlılık yapar. Yılanını veya hücreni büyüterek rakipleri yuttuğun klasik büyüme oyunlarından, takım tabanlı nişancı io arenalarına ve tank/uçak savaşlarına kadar farklı türleri kapsar. Her maç kısa ve heyecanlıdır; öldüğünde saniyeler içinde yeniden doğar, kaldığın yerden devam edersin.",
      "İyi bir io oyuncusu erken agresif oynamak yerine önce güvenle büyür, ardından fırsat kollar. Haritanın kenarlarını ve kalabalık bölgeleri akıllıca kullan; köşeye sıkışmaktan kaçın. Tüm .io oyunları tarayıcıda, üyelik gerekmeden anında başlar ve mobil cihazlarda da oynanabilir.",
    ],
  },
  kiz: {
    lead:
      "Giydirme, makyaj, yemek ve dekorasyon oyunları. Yaratıcılığını konuştur, kendi stilini yarat — ücretsiz ve indirmeden.",
    body: [
      "Kız oyunları yaratıcılığı ve tarz duygusunu ön plana çıkarır. Giydirme ve moda oyunlarında kombinler hazırlar, makyaj oyunlarında farklı görünümler denersin; yemek ve pastane oyunlarında tarifleri adım adım uygular, dekorasyon oyunlarında ise mekânları kendi zevkine göre tasarlarsın. Sınır yok, tamamen senin hayal gücüne kalmış.",
      "Bu tür oyunlar rahatlatıcıdır ve doğru-yanlış baskısı olmadan denemene izin verir; istediğin kadar farklı stil deneyip beğendiğini seçebilirsin. Çoğu başlık renk, aksesuar ve tema açısından oldukça zengindir. Oyunlar telefon ve tablette dokunmatik kontrollerle akıcı çalışır, üyelik gerektirmez.",
    ],
  },
  cocuk: {
    lead:
      "Çocuklar için eğitici ve eğlenceli, güvenli oyunlar. Öğrenirken eğlenmenin tam zamanı — yaşa uygun ve ebeveyn dostu.",
    body: [
      "Çocuk oyunları eğlenceyle öğrenmeyi birleştirir. Renkleri, sayıları ve harfleri tanıtan eğitici oyunlardan boyama ve çizim etkinliklerine, basit bulmacalardan hayvan bakımı ve eşleştirme oyunlarına kadar bu kategorideki içerikler küçük yaş grubu düşünülerek seçilmiştir. Kontroller sadedir; çocuklar zorlanmadan oynayabilir.",
      "Bu bölümdeki oyunlar şiddet içermeyen, olumlu ve yapıcı temalara sahiptir. Yine de ekran süresini dengede tutmak ve içerikleri birlikte keşfetmek için ebeveyn eşliğini öneririz. Tüm oyunlar tarayıcıda çalışır, indirme veya kurulum gerektirmez ve tablette dokunmatikle rahatça oynanır.",
    ],
  },
  arcade: {
    lead:
      "Hızlı, eğlenceli ve bağımlılık yapan arcade oyunları. Kısa molalarda yüksek skorun peşine düş — indirmeden, tarayıcında.",
    body: [
      "Arcade oyunları oyun dünyasının en sade ve en doğrudan köşesidir: basit kontroller, hızlı başlangıç, anında eğlence. Sonsuz koşu (endless runner), atış galerisi, tek dokunuş beceri oyunları ve klasik toplama-patlatma yapımları bu kategorinin bel kemiğidir. Uzun bir öğrenme eğrisi yoktur; saniyeler içinde oyuna dalarsın.",
      "Arcade oyunlarında yüksek skorun anahtarı sabit bir ritim tutturmaktır; panikleyip hızlanmak çoğu zaman hata yaptırır. Her oyunun bir deseni vardır — ilk denemelerde bunu öğrenmeye odaklan, rakiple değil kendi en iyi skorunla yarış. Kısa seanslık yapısıyla arcade, iki dakikalık molalar için biçilmiş kaftandır.",
    ],
  },
  "3d": {
    lead:
      "Yüksek grafikli 3D ve WebGL oyunlar. Tarayıcında konsol hissi veren akıcı deneyim — ücretsiz ve indirmeden.",
    body: [
      "3D oyunlar, WebGL teknolojisi sayesinde eskiden yalnızca indirilerek oynanabilen görsel kaliteyi doğrudan tarayıcına taşır. Bu kategoride gerçekçi araç simülasyonları, birinci şahıs nişancılar, açık dünya keşif oyunları ve fizik tabanlı yapımlar bulunur. Derinlik hissi ve akıcı animasyonlar deneyimi konsola yaklaştırır.",
      "En iyi performans için bilgisayarda güncel bir tarayıcı kullanman ve gereksiz sekmeleri kapatman yeterlidir; oyunlar donanımı verimli kullanacak şekilde optimize edilmiştir. Daha da yüksek grafikli başlıklar için Premium Oyunlar bölümüne göz atabilirsin. 3D oyunların birçoğu mobil cihazlarda da çalışır.",
    ],
  },
};

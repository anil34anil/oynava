/**
 * Programmatic SEO koleksiyonları — long-tail aramalar için otomatik landing
 * sayfaları (/en-iyi-araba-oyunlari, /2-kisilik-oyunlar, /yeni-eklenen-oyunlar …).
 *
 * Her koleksiyon bir slug + Türkçe başlık/açıklama + oyun seçici (filter) taşır.
 * `app/[collection]/page.tsx` bunları render eder; sitemap + iç linkler kullanır.
 */
import { Game, categorySlug, isOnline, isFpsShooter } from "./catalog";

export type Collection = {
  slug: string;
  title: string; // H1 / sayfa başlığı (TR)
  intro: string; // SEO tanıtım metni (TR)
  keywords: string[];
  /** Oyun havuzundan seçim. `order` verilirse filtre yerine sıralı ilk N alınır. */
  filter?: (g: Game) => boolean;
  takeNewest?: number; // getGames sırası "en yeni üstte" → ilk N
};

const re = (p: string) => new RegExp(p, "i");
const has = (g: Game, p: RegExp) => p.test(`${g.title} ${g.tags} ${g.category} ${g.description}`);

export const COLLECTIONS: Collection[] = [
  {
    slug: "en-iyi-araba-oyunlari",
    title: "En İyi Araba Oyunları",
    intro:
      "En iyi ücretsiz araba oyunları burada! Drift, park, ralli ve şehir sürüşü — gaza bas, rakiplerini geç. Tüm araba oyunları indirmeden, tarayıcında oynanır.",
    keywords: ["araba oyunları", "araba oyunu", "car games", "ücretsiz araba oyunları"],
    filter: (g) => has(g, re("\\bcar\\b|araba|driving|drift|parking|vehicle|otomobil")),
  },
  {
    slug: "en-iyi-yaris-oyunlari",
    title: "En İyi Yarış Oyunları",
    intro:
      "Hızın doruğundaki ücretsiz yarış oyunları: araba, motor ve formula yarışları. Pisti yak, birinci ol — hepsi tarayıcında, üyeliksiz.",
    keywords: ["yarış oyunları", "racing games", "motor yarışı"],
    filter: (g) => categorySlug(g) === "yaris" || has(g, re("racing|race|drift|moto|bike")),
  },
  {
    slug: "en-iyi-savas-oyunlari",
    title: "En İyi Savaş Oyunları",
    intro:
      "Ücretsiz savaş ve asker oyunları: cephe savaşları, komando görevleri ve strateji. Silahını kuşan, zafere koş — tarayıcında indirmeden oyna.",
    keywords: ["savaş oyunları", "war games", "asker oyunları"],
    filter: (g) => has(g, re("\\bwar\\b|battle|army|soldier|military|combat|savaş|asker")),
  },
  {
    slug: "en-iyi-nisanci-oyunlari",
    title: "En İyi Nişancı (FPS) Oyunları",
    intro:
      "En iyi ücretsiz FPS ve nişancı oyunları: online atış, battle royale ve sniper. Hedefe kilitlen, rakiplerini alt et — indirmeden tarayıcında.",
    keywords: ["nişancı oyunları", "fps oyunları", "atış oyunları", "shooter games"],
    filter: (g) => isFpsShooter(g),
  },
  {
    slug: "2-kisilik-oyunlar",
    title: "2 Kişilik Oyunlar",
    intro:
      "Arkadaşınla aynı ekranda oynayabileceğin en iyi 2 kişilik oyunlar. Dövüş, yarış, futbol ve daha fazlası — tek klavyede iki oyuncu, ücretsiz.",
    keywords: ["2 kişilik oyunlar", "iki kişilik oyunlar", "2 player games", "two player"],
    filter: (g) => has(g, re("2 ?player|two ?player|2 ?kişilik|iki kişilik|2p\\b|local multiplayer|co-?op")),
  },
  {
    slug: "ucretsiz-online-oyunlar",
    title: "Ücretsiz Online Oyunlar",
    intro:
      "Dünyanın dört bir yanından oyuncularla oynanan ücretsiz online oyunlar: .io arenaları, çok oyunculu FPS ve canlı rekabet. Üyeliksiz, indirmeden.",
    keywords: ["online oyunlar", "ücretsiz online oyunlar", "çok oyunculu oyunlar", "io oyunları"],
    filter: (g) => isOnline(g),
  },
  {
    slug: "cocuklar-icin-oyunlar",
    title: "Çocuklar İçin Oyunlar",
    intro:
      "Çocuklar için güvenli, eğitici ve eğlenceli ücretsiz oyunlar. Öğrenirken eğlendiren, yaşa uygun içerikler — reklamsız oyun keyfi tarayıcında.",
    keywords: ["çocuk oyunları", "çocuklar için oyunlar", "eğitici oyunlar", "kids games"],
    filter: (g) => categorySlug(g) === "cocuk" || has(g, re("kids|child|educational|baby|çocuk|eğitici")),
  },
  {
    slug: "populer-html5-oyunlar",
    title: "Popüler HTML5 Oyunları",
    intro:
      "En çok oynanan popüler HTML5 oyunları tek listede. İndirme yok, kurulum yok — en sevilen tarayıcı oyunlarını hemen oyna.",
    keywords: ["popüler oyunlar", "html5 oyunlar", "en çok oynanan oyunlar"],
    takeNewest: 60,
  },
  {
    slug: "yeni-eklenen-oyunlar",
    title: "Yeni Eklenen Oyunlar",
    intro:
      "Siteye en son eklenen yeni oyunlar burada. Her gün güncellenen taze HTML5 oyunlarını ilk sen keşfet — ücretsiz ve indirmeden.",
    keywords: ["yeni oyunlar", "yeni eklenen oyunlar", "güncel oyunlar"],
    takeNewest: 48,
  },
  {
    slug: "en-iyi-3d-oyunlar",
    title: "En İyi 3D Oyunlar",
    intro:
      "Yüksek grafikli ücretsiz 3D ve WebGL oyunları. Tarayıcında konsol hissi veren akıcı 3D oyun deneyimi — indirmeden, üyeliksiz.",
    keywords: ["3d oyunlar", "webgl oyunlar", "3 boyutlu oyunlar"],
    filter: (g) => categorySlug(g) === "3d" || has(g, re("\\b3d\\b|webgl")),
  },
  {
    slug: "en-iyi-futbol-oyunlari",
    title: "En İyi Futbol Oyunları",
    intro:
      "Ücretsiz futbol oyunları: penaltı, serbest vuruş ve turnuva modları. Takımını seç, gol at, şampiyon ol — tarayıcında indirmeden.",
    keywords: ["futbol oyunları", "football games", "soccer", "penaltı oyunları"],
    filter: (g) => has(g, re("football|soccer|futbol|penalty|penaltı")),
  },
  {
    slug: "zombi-oyunlari",
    title: "Zombi Oyunları",
    intro:
      "Hayatta kalma temalı ücretsiz zombi oyunları. Zombi sürülerini alt et, üssünü savun, son insan sen ol — korku dolu aksiyon tarayıcında.",
    keywords: ["zombi oyunları", "zombie games", "hayatta kalma oyunları"],
    filter: (g) => has(g, re("zombie|zombi|undead|survival")),
  },
  {
    slug: "en-iyi-bulmaca-oyunlari",
    title: "En İyi Bulmaca Oyunları",
    intro:
      "Zekânı çalıştıran ücretsiz bulmaca ve eşleştirme oyunları: match-3, mantık, kelime ve yapboz. Rahatla, düşün, çöz — indirmeden tarayıcında.",
    keywords: ["bulmaca oyunları", "puzzle games", "zeka oyunları", "match 3"],
    filter: (g) => categorySlug(g) === "bulmaca" || has(g, re("puzzle|match.?3|jigsaw|bulmaca|brain")),
  },
  {
    slug: "en-iyi-dovus-oyunlari",
    title: "En İyi Dövüş Oyunları",
    intro:
      "Ücretsiz dövüş oyunları: boks, karate ve sokak kavgası. Kombolarını yap, ringin hâkimi ol — indirmeden, tarayıcında oyna.",
    keywords: ["dövüş oyunları", "fighting games", "boks oyunları"],
    filter: (g) => categorySlug(g) === "dovus" || has(g, re("fighting|fight|boxing|karate|dövüş|kavga")),
  },
  {
    slug: "en-iyi-minecraft-oyunlari",
    title: "En İyi Minecraft Oyunları",
    intro:
      "Minecraft tarzı ücretsiz blok (blocky) inşa, hayatta kalma ve macera oyunları. Dünyanı kur, maden kaz, yarat — indirmeden tarayıcında oyna.",
    keywords: ["minecraft oyunları", "minecraft", "blok oyunları", "blocky games"],
    filter: (g) => has(g, re("minecraft|blocky|block ?craft|voxel|pixel ?craft|mine ?craft")),
  },
  {
    slug: "kiz-giydirme-oyunlari",
    title: "Kız Giydirme Oyunları",
    intro:
      "En yeni ücretsiz kız giydirme oyunları: moda, stil ve kombin. Karakterini giydir, kendi tarzını yarat — tarayıcında indirmeden oyna.",
    keywords: ["giydirme oyunları", "kız giydirme oyunları", "dress up games", "moda oyunları"],
    filter: (g) => has(g, re("dress ?up|dressup|giydirme|fashion|moda|stylist")),
  },
  {
    slug: "makyaj-oyunlari",
    title: "Makyaj Oyunları",
    intro:
      "Ücretsiz makyaj ve güzellik oyunları: göz makyajı, ruj, manikür ve bakım. Yaratıcılığını konuştur — indirmeden tarayıcında oyna.",
    keywords: ["makyaj oyunları", "makeup games", "güzellik oyunları"],
    filter: (g) => has(g, re("makeup|make ?up|makyaj|salon|manicure|beauty|güzellik")),
  },
  {
    slug: "yemek-yapma-oyunlari",
    title: "Yemek Yapma Oyunları",
    intro:
      "Ücretsiz yemek yapma ve aşçılık oyunları: restoran, pasta, dondurma ve fast food. Mutfağın şefi ol — tarayıcında indirmeden.",
    keywords: ["yemek oyunları", "aşçılık oyunları", "cooking games", "restoran oyunları"],
    filter: (g) => has(g, re("cooking|cook|chef|restaurant|kitchen|yemek|aşçı|pasta|cake|pizza|burger")),
  },
  {
    slug: "motor-oyunlari",
    title: "Motor Oyunları",
    intro:
      "Ücretsiz motosiklet ve motor oyunları: arazi, akrobasi ve hız. Gaz kelebeğini sonuna kadar aç — indirmeden tarayıcında oyna.",
    keywords: ["motor oyunları", "motosiklet oyunları", "moto games", "bike games"],
    filter: (g) => has(g, re("\\bmoto\\b|motorcycle|motorbike|\\bbike\\b|bmx|motosiklet|motor")),
  },
  {
    slug: "park-etme-oyunlari",
    title: "Park Etme Oyunları",
    intro:
      "Ücretsiz araba park etme oyunları: dar alanlar, zorlu manevralar ve gerçekçi sürüş. Direksiyona geç, kusursuz park et — tarayıcında.",
    keywords: ["park etme oyunları", "araba park oyunları", "parking games"],
    filter: (g) => has(g, re("parking|park ?et|car ?park")),
  },
  {
    slug: "stickman-oyunlari",
    title: "Stickman Oyunları",
    intro:
      "Ücretsiz stickman (çöp adam) oyunları: dövüş, nişancı, parkur ve macera. Hızlı ve eğlenceli stickman aksiyonu — indirmeden tarayıcında.",
    keywords: ["stickman oyunları", "çöp adam oyunları", "stickman games"],
    filter: (g) => has(g, re("stickman|stick ?man|çöp adam")),
  },
  {
    slug: "kule-savunma-oyunlari",
    title: "Kule Savunma Oyunları",
    intro:
      "Ücretsiz kule savunma (tower defense) ve strateji oyunları. Kulelerini diz, düşman dalgalarını durdur, üssünü koru — tarayıcında indirmeden.",
    keywords: ["kule savunma oyunları", "tower defense", "strateji oyunları"],
    filter: (g) => has(g, re("tower ?defense|tower ?defence|kule savunma|td\\b")),
  },
  {
    slug: "mahjong-oyunlari",
    title: "Mahjong Oyunları",
    intro:
      "Ücretsiz mahjong ve eşleştirme oyunları. Taşları eşleştir, tahtayı temizle, zekânı sına — rahatlatıcı mahjong keyfi tarayıcında.",
    keywords: ["mahjong oyunları", "mahjong games", "eşleştirme oyunları"],
    filter: (g) => has(g, re("mahjong|mah ?jong")),
  },
  {
    slug: "bilardo-oyunlari",
    title: "Bilardo Oyunları",
    intro:
      "Ücretsiz bilardo ve 8 top oyunları. İstaka ile nişan al, topları cebe gönder, rakibini yen — gerçekçi bilardo tarayıcında.",
    keywords: ["bilardo oyunları", "8 ball pool", "pool games", "bilardo"],
    filter: (g) => has(g, re("billiard|8 ?ball|\\bpool\\b|snooker|bilardo|istaka")),
  },
  {
    slug: "kosma-kacma-oyunlari",
    title: "Koşma & Kaçma (Parkur) Oyunları",
    intro:
      "Ücretsiz koşu, parkur ve sonsuz kaçış oyunları. Engellerden atla, hızını koru, rekor kır — bağımlılık yapan koşu oyunları tarayıcında.",
    keywords: ["koşu oyunları", "parkur oyunları", "runner games", "kaçış oyunları"],
    filter: (g) => has(g, re("\\brun\\b|runner|running|parkour|parkur|endless|escape|koş")),
  },
  {
    slug: "boyama-oyunlari",
    title: "Boyama Oyunları",
    intro:
      "Çocuklar için ücretsiz boyama ve çizim oyunları. Renkleri seç, resimleri boya, yaratıcılığını geliştir — güvenli ve eğlenceli, tarayıcında.",
    keywords: ["boyama oyunları", "çizim oyunları", "coloring games"],
    filter: (g) => has(g, re("coloring|colour|paint|drawing|boyama|çizim")),
  },
  {
    slug: "doktor-oyunlari",
    title: "Doktor Oyunları",
    intro:
      "Çocuklar için ücretsiz doktor ve hastane oyunları. Hastaları iyileştir, ameliyat yap, dişçilik öğren — eğitici ve eğlenceli, tarayıcında.",
    keywords: ["doktor oyunları", "hastane oyunları", "doctor games", "diş doktoru"],
    filter: (g) => has(g, re("doctor|dentist|hospital|surgery|doktor|hastane|dişçi")),
  },
];

export function collectionBySlug(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}

/** Bir koleksiyonun oyunlarını verilen havuzdan seçer. */
export function selectCollectionGames(c: Collection, games: Game[], limit = 120): Game[] {
  if (c.takeNewest) return games.slice(0, c.takeNewest);
  return games.filter((g) => (c.filter ? c.filter(g) : false)).slice(0, limit);
}

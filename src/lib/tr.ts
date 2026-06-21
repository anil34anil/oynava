/**
 * Feed içeriği (açıklama/talimat) İngilizce gelir. Burada Türkçeleştiriyoruz:
 *  - Talimatlar: GameMonetize'da çok tekrar eden kalıp ifadeler eşlenir.
 *  - Açıklama: başlık + kategoriden temiz bir Türkçe metin üretilir.
 * (Tam otomatik çeviri için ileride bir çeviri API'si eklenebilir.)
 */

import { Game, CATEGORIES, categorySlug } from "./catalog";

/** Türkçe karakterleri sadeleştirip küçük harfe çevirir (arama eşleştirmesi için). */
export function normalizeTr(s: string): string {
  return (s || "")
    .toLowerCase()
    .replace(/[ığüşöçâî]/g, (m) => ({ ı: "i", ğ: "g", ü: "u", ş: "s", ö: "o", ç: "c", â: "a", î: "i" }[m] ?? m))
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Türkçe arama terimi → İngilizce karşılıklar. Oyun verisi İngilizce olduğundan,
 * kullanıcı "futbol" yazınca "football/soccer" oyunları da gelsin diye genişletiriz.
 */
const SEARCH_SYNONYMS: Record<string, string[]> = {
  futbol: ["football", "soccer"], basketbol: ["basketball"], voleybol: ["volleyball"],
  tenis: ["tennis"], beyzbol: ["baseball"], golf: ["golf"], bilardo: ["billiard", "pool", "8 ball", "snooker"],
  kriket: ["cricket"], hokey: ["hockey"], boks: ["boxing", "punch"], gures: ["wrestling"],
  yaris: ["racing", "race", "drift", "driving"], araba: ["car", "auto", "driving"],
  motor: ["motorcycle", "moto", "bike", "motorbike"], bisiklet: ["bike", "bicycle", "bmx"],
  kamyon: ["truck"], otobus: ["bus"], tren: ["train"], ucak: ["plane", "airplane", "flight", "aircraft"],
  helikopter: ["helicopter"], gemi: ["ship", "boat"], tank: ["tank"], park: ["parking"],
  savas: ["war", "battle", "combat"], asker: ["soldier", "army", "military", "commando"],
  silah: ["gun", "weapon", "shooting"], nisanci: ["shooter", "shooting", "sniper"], nisan: ["shoot", "aim"],
  bomba: ["bomb"], zombi: ["zombie"], korku: ["horror", "scary"], hayalet: ["ghost"],
  dovus: ["fight", "fighting", "combat"], savasci: ["warrior", "fighter"], ninja: ["ninja"],
  kilic: ["sword", "blade"], kahraman: ["hero", "superhero"],
  bulmaca: ["puzzle"], hafiza: ["memory"], eslestirme: ["match", "match 3", "match3"], zeka: ["brain", "logic"],
  satranc: ["chess"], tavla: ["backgammon"], domino: ["domino"], kart: ["card", "solitaire"],
  kule: ["tower"], savunma: ["defense", "defence"], strateji: ["strategy"],
  balik: ["fish", "fishing"], at: ["horse"], kopek: ["dog", "puppy"], kedi: ["cat", "kitten"],
  orumcek: ["spider"], ejderha: ["dragon"], canavar: ["monster"], dinozor: ["dino", "dinosaur"],
  tavsan: ["rabbit", "bunny"], ayi: ["bear"], kus: ["bird"], yilan: ["snake"], unicorn: ["unicorn"],
  kiz: ["girl", "girls"], bebek: ["baby"], prenses: ["princess"], giydirme: ["dress up", "dressup"],
  makyaj: ["makeup"], sac: ["hair"], moda: ["fashion"], dugun: ["wedding"], boyama: ["coloring", "color", "paint"],
  yemek: ["cooking", "cook", "food"], asci: ["cook", "chef", "cooking"], pasta: ["cake"], dondurma: ["ice cream"],
  doktor: ["doctor", "hospital"], dis: ["dentist", "teeth"], okul: ["school"], hastane: ["hospital"],
  uzay: ["space", "galaxy"], robot: ["robot"], roket: ["rocket"], gezegen: ["planet"],
  bina: ["building", "city"], ev: ["house", "home"], ciftlik: ["farm"], market: ["market", "shop", "store"],
  para: ["money", "coin", "cash"], altin: ["gold"], elmas: ["diamond", "gem", "jewel"],
  balon: ["balloon", "bubble"], seker: ["candy", "sugar", "sweet"], meyve: ["fruit"], blok: ["block"],
  kup: ["cube"], top: ["ball"], halat: ["rope"], koprubina: ["bridge"],
  kosu: ["run", "running", "runner"], atlama: ["jump", "jumping"], zipla: ["jump"], kacis: ["escape", "run"],
  macera: ["adventure"], platform: ["platform", "platformer"], arcade: ["arcade"],
  piyano: ["piano"], muzik: ["music"], dans: ["dance"], ritim: ["rhythm"],
  futbolcu: ["football", "soccer player"], penalti: ["penalty"], kale: ["goalkeeper", "goal"],
  yuzme: ["swim", "swimming"], kayak: ["ski", "snowboard"], paten: ["skate", "skating"],
  hazine: ["treasure"], buyucu: ["wizard", "mage"], peri: ["fairy"], cadi: ["witch"],
};

/** Aramayı Türkçe terim + İngilizce karşılıklarıyla genişletir. */
export function searchTerms(query: string): string[] {
  const q = normalizeTr(query);
  const out = new Set<string>();
  if (q.length > 1) out.add(q);
  for (const w of q.split(" ").filter((w) => w.length > 1)) {
    out.add(w);
    for (const syn of SEARCH_SYNONYMS[w] ?? []) out.add(normalizeTr(syn));
  }
  return [...out];
}

/** Oyunun Türkçe kategori adı */
export function trCategory(game: Game): string {
  const slug = categorySlug(game);
  return CATEGORIES.find((c) => c.slug === slug)?.tr ?? "Arcade";
}

// Sık geçen İngilizce kontrol ifadeleri → Türkçe
const PHRASES: [RegExp, string][] = [
  [/to click any button.*mouse/gi, "Butonlara tıklamak için fareyi kullan"],
  [/use (the )?mouse( to play| to interact| to aim| to shoot)?/gi, "Fareyi kullan"],
  [/left mouse button/gi, "Sol fare tuşu"],
  [/right mouse button/gi, "Sağ fare tuşu"],
  [/mouse click/gi, "Fare tıklaması"],
  [/click( to play| to start| to jump| to shoot)?/gi, "Tıkla"],
  [/tap( and hold| to play| the screen)?/gi, "Dokun"],
  [/touch( the screen| to play)?/gi, "Ekrana dokun"],
  [/swipe/gi, "Kaydır"],
  [/drag( and drop)?/gi, "Sürükle"],
  [/arrow keys?/gi, "Ok tuşları"],
  [/wasd keys?/gi, "WASD tuşları"],
  [/\bwasd\b/gi, "WASD"],
  [/space ?bar/gi, "Boşluk tuşu"],
  [/to move/gi, "hareket için"],
  [/to jump/gi, "zıplamak için"],
  [/to shoot/gi, "ateş etmek için"],
  [/to aim/gi, "nişan almak için"],
  [/keyboard/gi, "klavye"],
  [/and have fun!?/gi, "ve keyfine bak!"],
  [/enjoy( the game)?!?/gi, "İyi eğlenceler!"],
];

/** İngilizce talimatı Türkçe'ye yaklaştırır; tanınmazsa genel Türkçe metin verir. */
export function trInstructions(raw: string): string {
  const text = (raw || "").trim();
  if (!text) return "Oyunu başlatmak için ekrana tıkla. Yönlendirmeler oyun içinde gösterilir.";

  let out = text;
  for (const [re, tr] of PHRASES) out = out.replace(re, tr);

  // Hâlâ ağırlıklı İngilizce ise (Türkçeleşmemişse) güvenli genel metne düş
  const turkishHints = /(fare|tıkla|dokun|tuş|hareket|zıpla|ateş|kaydır|sürükle|boşluk|nişan)/i;
  if (!turkishHints.test(out)) {
    return "Fare veya klavye ile oyna. Detaylı kontroller oyun ekranında gösterilir.";
  }
  // Madde işaretlerini koru, baş harfi büyüt
  return out
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.charAt(0).toUpperCase() + l.slice(1))
    .join("\n");
}

/** Başlık + kategoriden temiz bir Türkçe açıklama üretir. */
export function trDescription(game: Game): string {
  const cat = trCategory(game).toLowerCase();
  return (
    `${game.title}, tarayıcında ücretsiz oynayabileceğin eğlenceli bir ${cat} oyunudur. ` +
    `İndirme, kurulum veya üyelik gerekmez — sayfa açılır açılmaz başlar. ` +
    `Hemen oyna, yüksek skorun peşine düş ve favorilerine ekle!`
  );
}

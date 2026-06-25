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
  korsan: ["pirate"], kovboy: ["cowboy"], polis: ["police", "cop"], hirsiz: ["thief", "robber"],
  itfaiye: ["firefighter", "fire truck"], maden: ["mining", "mine"], okcu: ["archery", "bow", "arrow"],
  noel: ["christmas", "santa"], cadilar: ["halloween"], buz: ["ice"], kar: ["snow"],
  yapboz: ["jigsaw", "puzzle"], kelime: ["word"], matematik: ["math", "number"], harf: ["letter", "alphabet"],
  poker: ["poker"], slot: ["slot", "casino"], tetris: ["block", "blocks"],
  maymun: ["monkey"], aslan: ["lion"], penguen: ["penguin"], tavuk: ["chicken"], kelebek: ["butterfly"],
  deniz: ["sea", "ocean"], ada: ["island"], orman: ["forest", "jungle"], saray: ["castle"],
  restoran: ["restaurant"], pizza: ["pizza"], burger: ["burger"], sebze: ["vegetable"],
  kuafor: ["hair salon", "hairdresser"], tirnak: ["nail"], aile: ["family"], ikiz: ["twins"],
  bistro: ["bistro", "diner"], kafe: ["cafe", "coffee shop"], dondurmaci: ["ice cream", "ice cream shop"],
  doner: ["kebab", "shawarma"], simit: ["bagel"], firin: ["bakery"], cikolata: ["chocolate"],
  kabugu: ["shell"], orumcekadam: ["spiderman"], yarasa: ["bat", "batman"],
  uzayli: ["alien"], kurt: ["wolf"],
  fil: ["elephant"], zurafa: ["giraffe"], yunus: ["dolphin"], ahtapot: ["octopus"],
  ari: ["bee"], solucan: ["worm"], bocek: ["bug", "insect"],
  labirent: ["maze", "labyrinth"], merdiven: ["ladder"], kopru: ["bridge"],
  vinc: ["crane"], traktor: ["tractor"], forklift: ["forklift"], itfaiyearaci: ["fire truck"],
  ambulans: ["ambulance"], helikopterci: ["chopper"], denizalti: ["submarine"],
  golcup: ["trophy", "cup"], madalya: ["medal"], sampiyon: ["champion"],
  takim: ["team"], lig: ["league"], turnuva: ["tournament", "championship"],
  oda: ["room", "escape room"], anahtar: ["key"], sandik: ["chest", "box"],
  define: ["treasure"], harita: ["map"], pusula: ["compass"],
  sehir: ["city"], kasaba: ["town"],
  basket: ["basketball"], berber: ["barber", "hair salon"], dedektif: ["detective"],
  casus: ["spy"], kurtarma: ["rescue"], tamirci: ["mechanic", "repair"],
  kamp: ["camp", "camping"], patlama: ["explosion", "blast"], yangin: ["fire"],
  soygun: ["heist", "robbery"], casino: ["casino"], zindan: ["dungeon"],
  gladyator: ["gladiator"], samuray: ["samurai"], ejder: ["dragon"],
  fps: ["fps", "shooter", "first person shooter", "shooting"], online: ["online", "multiplayer", ".io"],
  cokoyunculu: ["multiplayer", "online"], arena: ["arena", "battle"], sniper: ["sniper", "shooting"],
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

// Oyuna özgü, BENZERSİZ ve daha derin açıklama üretir (ince/yinelenen içerik riskini
// azaltır). Kategori + etiketler + başlık karmasıyla cümleler varyasyonlanır.
const DESC_ADJ = ["eğlenceli", "bağımlılık yapan", "sürükleyici", "akıcı", "heyecan dolu", "rahatlatıcı", "tempolu"];
const DESC_OPEN = [
  (t: string, c: string, a: string) => `${t}, tarayıcında ücretsiz oynayabileceğin ${a} bir ${c} oyunudur.`,
  (t: string, c: string, a: string) => `${t}, ${c} türünü sevenler için ${a} bir HTML5 oyunudur.`,
  (t: string, c: string, a: string) => `${t} ile ${c} dünyasına dal; ${a} mekaniğiyle ilk dakikadan oyunun içindesin.`,
];

function descHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** Başlık + kategori + etiketlerden özgün, derin bir Türkçe açıklama üretir. */
export function trDescription(game: Game): string {
  const cat = trCategory(game).toLowerCase();
  const h = descHash(game.title);
  const open = DESC_OPEN[h % DESC_OPEN.length](game.title, cat, DESC_ADJ[h % DESC_ADJ.length]);

  const tags = (game.tags || "")
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 1 && t.length < 22)
    .slice(0, 3);
  const themeLine = tags.length
    ? `Oyun ${tags.join(", ")} gibi temalar etrafında şekillenir ve ${game.title} severler için tam isabettir. `
    : "";

  const why =
    `${game.title} oynamak için indirme, kurulum veya üyelik gerekmez — sayfa açılır açılmaz başlar ` +
    `ve hem bilgisayarda hem mobil tarayıcıda akıcı çalışır. `;
  const cta = `Hemen oyna, yüksek skorun peşine düş, favorilerine ekle ve benzer ${cat} oyunlarını keşfet!`;

  return `${open} ${themeLine}${why}${cta}`;
}

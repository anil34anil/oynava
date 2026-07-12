/**
 * Video-üstü "hook" başlığı üretici — her oyun için kategori/etikete uygun,
 * dikkat çekici tek satırlık Türkçe başlık üretir (kullanıcının verdiği 14
 * örnek başlığın TARZINDA, ama HER oyun kendi kategorisinde özgün bir başlık alır).
 *
 * ⚠️ EMOJİ YOK: ffmpeg drawtext + Sora/Hanken Grotesk fontları emoji glyph'i
 * içermiyor (test edildi — tofu kutucuğu render ediyor). Bu yüzden video
 * ÜZERİNE yazılan hook metninde emoji kullanılmaz; vurgu noktalama ve
 * büyük harfle sağlanır (örn. "Tarayıcıda FPS?? Evet.").
 *
 * Seçim deterministiktir (game.id hash'i) — aynı oyun her çalıştırmada aynı
 * hook'u alır (idempotent, rastgele her seferinde değişmez).
 */
import { categorySlug, isFpsShooter, isOnline, type Game } from "../../../src/lib/catalog.ts";

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function pick(pool: string[], seed: string): string {
  return pool[hashStr(seed) % pool.length];
}

const re = (p: string) => new RegExp(p, "i");
const has = (g: Game, p: RegExp) => p.test(`${g.title} ${g.tags} ${g.category} ${g.description ?? ""}`);

const ZOMBIE_RE = re("zombie|zombi|undead");
const HORROR_RE = re("horror|scary|creepy|granny|ghost|nightmare|korku|hayalet");
const DRIFT_RE = re("drift");
const PARKING_RE = re("parking|park ?et");
const TWO_PLAYER_RE = re("2 ?player|two ?player|2 ?kişilik|iki kişilik|2p\\b|local multiplayer|co-?op");
const MERGE_PUZZLE_RE = re("merge|match.?3|bubble|mahjong|jigsaw");

const POOLS: Record<string, string[]> = {
  originals: [
    "Bunu biz yaptık.",
    "Kendi oyunumuz, indirmeden oynanır.",
    "Sıfırdan yazdığımız oyun bu.",
    "Başka hiçbir sitede yok.",
  ],
  fps: [
    "Tarayıcıda FPS?? Evet.",
    "Bu grafikle indirme yok.",
    "Nişan aldım, bitirdim.",
    "Hiç indirmeden nişancı oyunu.",
  ],
  zombie: [
    "Son mermiyle...",
    "Zombiler geldi, ben gittim.",
    "Son ana kadar dayandım.",
    "Bu dalgayı zor atlattım.",
  ],
  horror: [
    "Gece geç saatte açmayın.",
    "Bu sesi duyunca zıpladım.",
    "İçeri girmemeliydim.",
    "Sesi açık izleyin, pişman olmazsınız.",
  ],
  io: [
    "1. sıraya kadar kestim.",
    "Küçük başladım, dev oldum.",
    "Herkesi yuttum.",
    "Skor tahtasının tepesindeyim.",
  ],
  drift: [
    "İndirmeden drift atıyorum.",
    "Bu virajı zor aldım.",
    "Lastik izi bıraktım.",
    "Tam köşede kurtardım.",
  ],
  parking: [
    "3. denemede park ettim.",
    "Bu manevra imkansız gibiydi.",
    "Milimetrik park.",
    "Bir çizik bile yok.",
  ],
  racing: [
    "Bu pist beni bitirdi.",
    "Son viraja kadar liderdim.",
    "Nitro'yu tam zamanında bastım.",
    "Tarayıcıda bu hızda yarış olur mu?",
  ],
  puzzle: [
    "Bu sesi dinle.",
    "Bitirmeden bırakamadım.",
    "Elim durmadı.",
    "Bu kadar tatmin edici olmamalıydı.",
  ],
  girls: [
    "Bu kombin 10/10.",
    "Stilim tam oturdu.",
    "Bu makyaj harika oldu.",
    "Kendi tarzımı yarattım.",
  ],
  twoPlayer: [
    "Arkadaşınla tek klavyede.",
    "İkimiz de kazanamadık.",
    "Bu oyun kavga çıkarır.",
    "Tek ekranda iki oyuncu.",
  ],
  threeD: [
    "Bu TARAYICIDA çalışıyor.",
    "Konsol grafiği, indirme yok.",
    "Bunu görünce şaşıracaksın.",
    "3D ve tamamen ücretsiz.",
  ],
  sports: [
    "Son saniye golü.",
    "Bu golü kaçırmazdım.",
    "Uzatmalarda kazandım.",
    "Penaltıyı köşeye çaktım.",
  ],
  fighting: [
    "Kombomu izleyin.",
    "Tek yumrukta bitti.",
    "Ringin hâkimi bendim.",
    "Bu ralli sonunda kazandım.",
  ],
  strategy: [
    "Beynimi zorladı bu.",
    "3 hamlede kazandım.",
    "Planım tam işledi.",
    "Bir adım önde kaldım.",
  ],
  arcade: [
    "Skorumu kırdım.",
    "Bir tur daha dedim, 10 tur oldu.",
    "Bu kadar basit, bu kadar bağımlılık yapıyor.",
    "Durduramadım kendimi.",
  ],
  adventure: [
    "Bu bulmaca kafamı karıştırdı.",
    "Çıkışı buldum sonunda.",
    "İpucunu son anda gördüm.",
    "Bu dünyayı keşfetmeye doyamadım.",
  ],
  kids: [
    "Bu oyun çok tatlı.",
    "Öğrenirken eğlendim.",
    "Küçükler için harika.",
    "Renkler harika görünüyor.",
  ],
  fallback: [
    "İndirmeden oynadım, bitiremedim.",
    "Bu oyunu bulunca durdum.",
    "Tarayıcıda bunu bilmiyordum.",
    "Bir bağlantı, saniyeler içinde açıldı.",
  ],
};

/** Oyunun kategori/etiketlerine göre en uygun havuzu seçer (öncelik sırası önemli). */
function poolFor(game: Game): string[] {
  if (game.id.startsWith("ov-")) return POOLS.originals;
  if (has(game, ZOMBIE_RE)) return POOLS.zombie;
  if (has(game, HORROR_RE)) return POOLS.horror;
  if (isFpsShooter(game)) return POOLS.fps;
  if (has(game, DRIFT_RE)) return POOLS.drift;
  if (has(game, PARKING_RE)) return POOLS.parking;

  const cat = categorySlug(game);
  if (cat === "io" || isOnline(game)) return POOLS.io;
  if (has(game, TWO_PLAYER_RE)) return POOLS.twoPlayer;
  if (cat === "yaris") return POOLS.racing;
  if (cat === "bulmaca" || has(game, MERGE_PUZZLE_RE)) return POOLS.puzzle;
  if (cat === "kiz") return POOLS.girls;
  if (cat === "3d") return POOLS.threeD;
  if (cat === "spor") return POOLS.sports;
  if (cat === "dovus") return POOLS.fighting;
  if (cat === "zeka") return POOLS.strategy;
  if (cat === "macera") return POOLS.adventure;
  if (cat === "cocuk") return POOLS.kids;
  if (cat === "arcade") return POOLS.arcade;
  return POOLS.fallback;
}

/** Verilen oyun için deterministik, kategoriye özgü, emoji'siz hook metni. */
export function hookFor(game: Game): string {
  return pick(poolFor(game), game.id);
}

/**
 * Feed içeriği (açıklama/talimat) İngilizce gelir. Burada Türkçeleştiriyoruz:
 *  - Talimatlar: GameMonetize'da çok tekrar eden kalıp ifadeler eşlenir.
 *  - Açıklama: başlık + kategoriden temiz bir Türkçe metin üretilir.
 * (Tam otomatik çeviri için ileride bir çeviri API'si eklenebilir.)
 */

import { Game, CATEGORIES, categorySlug } from "./catalog";

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

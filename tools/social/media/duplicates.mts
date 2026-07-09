/**
 * Aynı oyunun farklı sağlayıcılarda (ör. hem GameMonetize hem GameDistribution'da)
 * tekrar yayınlanmış kopyalarını tespit eder — böylece aynı içerik için birden
 * fazla sosyal medya videosu üretilmez (spam görünümü + gereksiz iş).
 *
 * Yöntem: küçük harfe indirgeme + Türkçe karakter sadeleştirme (src/lib/tr.ts'teki
 * normalizeTr ile aynı mantık — o dosya extensionless import kullandığından
 * native Node ESM'de çözülemiyor, bu yüzden 3 satırlık mantık burada izole
 * tutuldu) + token kümesi + basit Levenshtein eşiğiyle karşılaştırır. Yeni bir
 * "fuzzy match" kütüphanesi eklemeye gerek yok — 6000+ oyunluk kataloğa göre
 * yeterince hızlı (O(n²) yerine normalize başlığın ilk birkaç karakterine göre
 * gruplandırıp karşılaştırma yapılır).
 *
 * ÖNEMLİ: Gruplama KATEGORİYE göre YAPILMAZ — aynı oyun farklı sağlayıcılarda
 * çelişen kategorilerde etiketlenebiliyor (ör. bir "Family Simulator" oyunu
 * GameDistribution'da "Casual"/çocuk, GameMonetize'da "Adventure"/macera
 * olarak geçiyor; canlı veriyle doğrulandı). Kategoriye göre gruplamak bu
 * kopyaları hiç karşılaştırmadan kaçırıyordu — bunun yerine başlığın kendisi
 * kullanılır (sağlayıcı kategorilendirmesinden bağımsız, çok daha güvenilir).
 */
import type { CatalogGame } from "../catalogSource.mts";

function normalizeTr(s: string): string {
  return (s || "")
    .toLowerCase()
    .replace(/[ığüşöçâî]/g, (m) => ({ ı: "i", ğ: "g", ü: "u", ş: "s", ö: "o", ç: "c", â: "a", î: "i" }[m] ?? m))
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

const NOISE = /\b(free|online|game|3d|2d|hd|io|the|multiplayer)\b/g;
function titleKey(title: string): string {
  return normalizeTr(title).replace(NOISE, "").replace(/[^a-z0-9]+/g, "").trim();
}

function similar(a: string, b: string): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  const dist = levenshtein(a, b);
  const maxLen = Math.max(a.length, b.length);
  return dist / maxLen < 0.15; // %85+ benzerlik
}

const PREFIX_LEN = 4;

/** Normalize başlığın ilk birkaç karakterine göre gruplayıp aynı/çok benzer başlıklı oyunları tek kümede toplar. */
export function findDuplicateGroups(games: CatalogGame[]): Map<string, CatalogGame[]> {
  const byPrefix = new Map<string, { g: CatalogGame; key: string }[]>();
  for (const g of games) {
    const key = titleKey(g.title);
    if (key.length < 2) continue; // çok kısa/anlamsız başlık — karşılaştırmaya değmez
    const prefix = key.slice(0, PREFIX_LEN);
    const list = byPrefix.get(prefix);
    if (list) list.push({ g, key });
    else byPrefix.set(prefix, [{ g, key }]);
  }

  const groupOf = new Map<string, CatalogGame[]>(); // game.id -> group
  for (const keyed of byPrefix.values()) {
    const groups: { key: string; members: CatalogGame[] }[] = [];
    for (const item of keyed) {
      const existing = groups.find((gr) => similar(gr.key, item.key));
      if (existing) existing.members.push(item.g);
      else groups.push({ key: item.key, members: [item.g] });
    }
    for (const gr of groups) {
      if (gr.members.length < 2) continue;
      for (const m of gr.members) groupOf.set(m.id, gr.members);
    }
  }
  return groupOf;
}

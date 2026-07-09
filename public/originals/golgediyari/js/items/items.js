/**
 * Items — item modeli + prosedürel üretim (adım 6'nın veri katmanı).
 *
 * Item şekli (düz JSON — kaydetme/ağ serileştirmesi bedava):
 * { uid, slot, rarity, ilvl, name, base:{dmg?|armor?}, affixes:{stat:val},
 *   sockets: (gem|null)[], upLvl }
 *
 * Rarity → affix adedi + soket şansı + isim rengi. Değerler ilvl ile ölçeklenir;
 * denge eğrileri tek yerde (bu dosya) durur.
 */
let uidCounter = 1;

/** Kayıt yüklenince uid çakışmasını önler (persistence çağırır). */
export function setUidBase(n) { uidCounter = Math.max(uidCounter, n + 1); }

export const RARITIES = {
  common:    { w: 100, affixes: 0, sockets: 0,   mult: 1.0, tr: "Sıradan",   color: "#9ca3af" },
  magic:     { w: 45,  affixes: 1, sockets: 0.1, mult: 1.15, tr: "Büyülü",   color: "#60a5fa" },
  rare:      { w: 18,  affixes: 2, sockets: 0.25, mult: 1.35, tr: "Nadir",   color: "#facc15" },
  epic:      { w: 6,   affixes: 3, sockets: 0.5, mult: 1.6, tr: "Destansı",  color: "#c084fc" },
  legendary: { w: 1.5, affixes: 4, sockets: 1,   mult: 2.0, tr: "Efsanevi",  color: "#fb923c" },
};

export const SLOTS = {
  weapon: { tr: "Silah",   bases: ["Kılıç", "Balta", "Asa", "Hançer"], stat: "dmg" },
  helmet: { tr: "Miğfer",  bases: ["Miğfer", "Başlık", "Taç"],         stat: "armor" },
  chest:  { tr: "Zırh",    bases: ["Zırh", "Cübbe", "Yelek"],          stat: "armor" },
  boots:  { tr: "Bot",     bases: ["Bot", "Çizme", "Sandalet"],        stat: "armor" },
  ring:   { tr: "Yüzük",   bases: ["Yüzük", "Halka", "Mühür"],         stat: null },
  amulet: { tr: "Kolye",   bases: ["Kolye", "Tılsım", "Nazarlık"],     stat: null },
};

/** Affix havuzu: [anahtar, TR ad, ilvl başına değer, taban] */
const AFFIX_POOL = [
  ["str",  "Güç",        0.8, 2],
  ["dex",  "Çeviklik",   0.8, 2],
  ["int",  "Zeka",       0.8, 2],
  ["vit",  "Dayanıklılık", 0.8, 2],
  ["dmg",  "Hasar",      0.9, 3],
  ["armor", "Zırh",      1.1, 3],
  ["crit", "Kritik Şans %", 0.15, 1],
  ["hp",   "Can",        3.5, 10],
  ["mp",   "Mana",       1.6, 5],
];
export const AFFIX_TR = Object.fromEntries(AFFIX_POOL.map(([k, tr]) => [k, tr]));

const PREFIX = {
  magic: ["Keskin", "Sağlam", "Hızlı", "Parlak"],
  rare: ["Gölgeli", "Kadim", "Fırtına", "Ay Işığı"],
  epic: ["Kıyamet", "Ejder", "Hayalet", "Cehennem"],
  legendary: ["GÖLGEDİYAR", "Kral Katili", "Sonsuzluk", "İlk Karanlık"],
};

export const GEMS = {
  yakut:   { tr: "Yakut",   color: "#ef4444", stat: "dmg",  perIlvl: 1.2, base: 4 },
  safir:   { tr: "Safir",   color: "#3b82f6", stat: "mp",   perIlvl: 2.5, base: 8 },
  zumrut:  { tr: "Zümrüt",  color: "#22c55e", stat: "hp",   perIlvl: 4,   base: 12 },
  elmas:   { tr: "Elmas",   color: "#e2e8f0", stat: "crit", perIlvl: 0.2, base: 1 },
};

function pickWeighted(entries) {
  const total = entries.reduce((s, [, v]) => s + v.w, 0);
  let r = Math.random() * total;
  for (const [k, v] of entries) { r -= v.w; if (r <= 0) return k; }
  return entries[0][0];
}

export function rollRarity(boost = 1) {
  // boost > 1 → nadir kademelerin ağırlığı artar (elite/boss dropları)
  const entries = Object.entries(RARITIES).map(([k, v], i) => [k, { w: v.w * (i > 0 ? boost : 1) }]);
  return pickWeighted(entries);
}

export function generateItem(ilvl, { rarity, slot } = {}) {
  rarity = rarity ?? rollRarity();
  slot = slot ?? Object.keys(SLOTS)[(Math.random() * Object.keys(SLOTS).length) | 0];
  const R = RARITIES[rarity];
  const S = SLOTS[slot];

  const base = {};
  if (S.stat === "dmg") base.dmg = Math.round((6 + ilvl * 1.6) * R.mult);
  if (S.stat === "armor") base.armor = Math.round((4 + ilvl * 1.2) * R.mult);

  // Affix'ler: havuzdan tekrarsız çek
  const pool = [...AFFIX_POOL];
  const affixes = {};
  for (let i = 0; i < R.affixes && pool.length; i++) {
    const idx = (Math.random() * pool.length) | 0;
    const [key, , per, b] = pool.splice(idx, 1)[0];
    affixes[key] = Math.max(1, Math.round((b + ilvl * per) * (0.8 + Math.random() * 0.4)));
  }

  const sockets = Math.random() < R.sockets ? [null] : [];
  const baseName = S.bases[(Math.random() * S.bases.length) | 0];
  const name = rarity === "common" ? baseName
    : `${PREFIX[rarity][(Math.random() * PREFIX[rarity].length) | 0]} ${baseName}`;

  return { uid: uidCounter++, slot, rarity, ilvl, name, base, affixes, sockets, upLvl: 0 };
}

export function generateGem(ilvl) {
  const keys = Object.keys(GEMS);
  const type = keys[(Math.random() * keys.length) | 0];
  const G = GEMS[type];
  return {
    uid: uidCounter++, slot: "gem", rarity: "magic", ilvl, gemType: type,
    name: `${G.tr} Taşı`, base: {}, affixes: { [G.stat]: Math.round(G.base + ilvl * G.perIlvl) },
    sockets: [], upLvl: 0,
  };
}

/** Yükseltme maliyeti/kazancı — Demirci (M4) kullanır. */
export function upgradeCost(item) { return Math.round(25 * Math.pow(1.6, item.upLvl) * RARITIES[item.rarity].mult); }
export function applyUpgrade(item) {
  item.upLvl++;
  if (item.base.dmg) item.base.dmg = Math.round(item.base.dmg * 1.12);
  if (item.base.armor) item.base.armor = Math.round(item.base.armor * 1.12);
}

/** Enchant: rastgele bir affix'i yeniden çevirir (kumar — daha iyi ya da kötü gelebilir). */
export function enchantCost(item) { return Math.round(40 * RARITIES[item.rarity].mult * (1 + item.ilvl * 0.2)); }
export function applyEnchant(item) {
  const keys = Object.keys(item.affixes);
  if (keys.length === 0) return false;
  const key = keys[(Math.random() * keys.length) | 0];
  const [, , per, b] = AFFIX_POOL.find(([k]) => k === key) ?? [null, null, 0.8, 2];
  item.affixes[key] = Math.max(1, Math.round((b + item.ilvl * per) * (0.8 + Math.random() * 0.55)));
  return true;
}

/** Bir item'ın toplam stat katkısı (soketli gemler dahil) — stats sistemi okur. */
export function itemStats(item) {
  const out = { ...item.affixes };
  if (item.base.dmg) out.dmg = (out.dmg ?? 0) + item.base.dmg;
  if (item.base.armor) out.armor = (out.armor ?? 0) + item.base.armor;
  for (const g of item.sockets) {
    if (!g) continue;
    for (const [k, v] of Object.entries(g.affixes)) out[k] = (out[k] ?? 0) + v;
  }
  return out;
}

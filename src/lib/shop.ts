/**
 * Mağaza kataloğu — sanal jetonla alınan kozmetikler (avatar, rozet, tema).
 * Fiyatlar SANAL jeton cinsindendir. Gerçek-para satışı için Stripe entegrasyonu
 * + ödeme hesabı gerekir (README'ye bak) — burada para AKTARIMI YOKTUR.
 */

export type ShopItem = {
  id: string;
  name: string;
  kind: "avatar" | "badge" | "theme";
  value: string; // avatar emoji / rozet emoji / tema rengi
  price: number;
  desc: string;
};

export const SHOP_ITEMS: ShopItem[] = [
  { id: "av-ninja", name: "Ninja", kind: "avatar", value: "🥷", price: 150, desc: "Sessiz ve ölümcül avatar." },
  { id: "av-alien", name: "Uzaylı", kind: "avatar", value: "👽", price: 150, desc: "Galaksiler arası oyuncu." },
  { id: "av-robot", name: "Robot", kind: "avatar", value: "🤖", price: 200, desc: "Yapay zekâ pilotu." },
  { id: "av-dragon", name: "Ejderha", kind: "avatar", value: "🐉", price: 300, desc: "Efsanevi nadir avatar." },
  { id: "av-crown", name: "Kral", kind: "avatar", value: "👑", price: 500, desc: "Lider tablosu kralları için." },

  { id: "bd-fire", name: "Ateş Rozeti", kind: "badge", value: "🔥", price: 120, desc: "Profilinde alev alev yan." },
  { id: "bd-star", name: "Yıldız Rozeti", kind: "badge", value: "⭐", price: 120, desc: "Yıldız oyuncu nişanı." },
  { id: "bd-bolt", name: "Şimşek Rozeti", kind: "badge", value: "⚡", price: 180, desc: "Hız tutkunları için." },
  { id: "bd-skull", name: "Kurukafa", kind: "badge", value: "💀", price: 250, desc: "Hardcore oyuncu rozeti." },

  { id: "th-neon", name: "Neon Tema", kind: "theme", value: "#00e5ff", price: 220, desc: "Profil vurgu rengi: neon mavi." },
  { id: "th-purple", name: "Mor Tema", kind: "theme", value: "#a855f7", price: 220, desc: "Profil vurgu rengi: mor." },
  { id: "th-pink", name: "Pembe Tema", kind: "theme", value: "#ff2d75", price: 220, desc: "Profil vurgu rengi: pembe." },
  { id: "th-lime", name: "Lime Tema", kind: "theme", value: "#b6ff3b", price: 220, desc: "Profil vurgu rengi: lime yeşili." },
];

export const COIN_PACKS = [
  { id: "pack-s", coins: 500, price: "₺29,99" },
  { id: "pack-m", coins: 1500, price: "₺69,99" },
  { id: "pack-l", coins: 5000, price: "₺199,99" },
];

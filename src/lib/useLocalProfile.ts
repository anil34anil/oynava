"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Tarayıcı-tarafı (localStorage) kullanıcı durumu: favoriler, son oynananlar,
 * yerel profil (kullanıcı adı/avatar), sanal jeton ve sahip olunan kozmetikler.
 *
 * NOT: Bu, GERÇEK hesap/giriş DEĞİLDİR — cihazda saklanır. Gerçek kullanıcı girişi
 * ve cihazlar arası senkron için backend + NextAuth gerekir (README'ye bak).
 * Gerçek-para satışı için ödeme entegrasyonu (Stripe) eklenmelidir.
 */

const KEYS = {
  fav: "oh:favorites",
  recent: "oh:recent",
  recentCards: "oh:recent_cards",
  profile: "oh:profile",
  coins: "oh:coins",
  owned: "oh:owned",
  streak: "oh:streak",
  playsTotal: "oh:plays_total",
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, val: T) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
    window.dispatchEvent(new Event("oh:storage"));
  } catch {
    /* yoksay */
  }
}

export type LocalProfile = {
  username: string;
  avatar: string; // emoji veya url
};

const DEFAULT_PROFILE: LocalProfile = { username: "Misafir Oyuncu", avatar: "🎮" };

export function useFavorites() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setIds(read<string[]>(KEYS.fav, []));
    sync();
    window.addEventListener("oh:storage", sync);
    return () => window.removeEventListener("oh:storage", sync);
  }, []);

  const toggle = useCallback((id: string) => {
    const cur = read<string[]>(KEYS.fav, []);
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    write(KEYS.fav, next);
  }, []);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, toggle, has };
}

export function pushRecent(id: string) {
  if (typeof window === "undefined") return;
  const cur = read<string[]>(KEYS.recent, []).filter((x) => x !== id);
  write(KEYS.recent, [id, ...cur].slice(0, 24));
}

export function useRecent() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    const sync = () => setIds(read<string[]>(KEYS.recent, []));
    sync();
    window.addEventListener("oh:storage", sync);
    return () => window.removeEventListener("oh:storage", sync);
  }, []);
  return ids;
}

// Son oynananları kart olarak göstermek için hafif meta önbelleği (sunucuya gitmeden render).
export type RecentCard = { id: string; title: string; thumb: string; category?: string };

export function pushRecentCard(card: RecentCard) {
  if (typeof window === "undefined") return;
  const cur = read<RecentCard[]>(KEYS.recentCards, []).filter((x) => x.id !== card.id);
  write(KEYS.recentCards, [card, ...cur].slice(0, 18));
}

export function useRecentCards() {
  const [cards, setCards] = useState<RecentCard[]>([]);
  useEffect(() => {
    const sync = () => setCards(read<RecentCard[]>(KEYS.recentCards, []));
    sync();
    window.addEventListener("oh:storage", sync);
    return () => window.removeEventListener("oh:storage", sync);
  }, []);
  return cards;
}

// ── Günlük giriş ödülü (streak) — sanal jeton kazandırır ────────────────────
type StreakData = { days: number; lastClaim: string };
const dayStr = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

export function useStreak() {
  const [data, setData] = useState<StreakData>({ days: 0, lastClaim: "" });
  useEffect(() => {
    const sync = () => setData(read<StreakData>(KEYS.streak, { days: 0, lastClaim: "" }));
    sync();
    window.addEventListener("oh:storage", sync);
    return () => window.removeEventListener("oh:storage", sync);
  }, []);

  const canClaim = data.lastClaim !== dayStr(0);
  const claim = useCallback((): number => {
    const cur = read<StreakData>(KEYS.streak, { days: 0, lastClaim: "" });
    if (cur.lastClaim === dayStr(0)) return 0;
    const days = cur.lastClaim === dayStr(-1) ? cur.days + 1 : 1; // dün geldiyse seri devam
    write(KEYS.streak, { days, lastClaim: dayStr(0) });
    const reward = 20 + Math.min(days, 7) * 10; // seri uzadıkça artan ödül (max 90)
    write(KEYS.coins, read<number>(KEYS.coins, 500) + reward);
    return reward;
  }, []);

  return { days: data.days, canClaim, claim };
}

// ── Toplam oynama sayısı (başarımlar için kümülatif) ───────────────────────
export function bumpPlays() {
  if (typeof window === "undefined") return;
  write(KEYS.playsTotal, read<number>(KEYS.playsTotal, 0) + 1);
}
export function usePlaysTotal() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const sync = () => setN(read<number>(KEYS.playsTotal, 0));
    sync();
    window.addEventListener("oh:storage", sync);
    return () => window.removeEventListener("oh:storage", sync);
  }, []);
  return n;
}

export function useProfile() {
  const [profile, setProfile] = useState<LocalProfile>(DEFAULT_PROFILE);
  const [coins, setCoins] = useState(0);
  const [owned, setOwned] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => {
      setProfile(read<LocalProfile>(KEYS.profile, DEFAULT_PROFILE));
      setCoins(read<number>(KEYS.coins, 500)); // hoş geldin bonusu (sanal)
      setOwned(read<string[]>(KEYS.owned, []));
    };
    sync();
    window.addEventListener("oh:storage", sync);
    return () => window.removeEventListener("oh:storage", sync);
  }, []);

  const save = useCallback((p: Partial<LocalProfile>) => {
    const cur = read<LocalProfile>(KEYS.profile, DEFAULT_PROFILE);
    write(KEYS.profile, { ...cur, ...p });
  }, []);

  /** Sanal jetonla kozmetik satın al. Gerçek para DEĞİL. true=başarılı */
  const buy = useCallback((itemId: string, price: number): boolean => {
    const c = read<number>(KEYS.coins, 500);
    const o = read<string[]>(KEYS.owned, []);
    if (o.includes(itemId)) return true;
    if (c < price) return false;
    write(KEYS.coins, c - price);
    write(KEYS.owned, [...o, itemId]);
    return true;
  }, []);

  const addCoins = useCallback((n: number) => {
    write(KEYS.coins, read<number>(KEYS.coins, 500) + n);
  }, []);

  return { profile, coins, owned, save, buy, addCoins };
}

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
export type RecentCard = { id: string; title: string; thumb: string };

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

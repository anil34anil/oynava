"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * E-posta + şifre ile giriş (cihaz-yerel).
 * Şifreler düz metin DEĞİL — SHA-256 + rastgele salt ile hash'lenip localStorage'da
 * saklanır. Bu, tek cihazda çalışan gerçek bir kayıt/giriş akışıdır.
 *
 * ⚠️ ÜRETİM GÜVENLİĞİ: localStorage tarayıcıda durur, cihazlar arası senkron olmaz
 * ve XSS'e karşı sunucu kadar güvenli değildir. Gerçek/çok cihazlı güvenli giriş için
 * NextAuth + veritabanı + sunucu tarafı bcrypt önerilir (README'ye bak).
 */

export type Account = {
  email: string;
  salt?: string;
  hash?: string;
  username: string;
  avatar: string;
  provider?: "password" | "google";
  createdAt: number;
};

const K_ACCOUNTS = "oh:accounts";
const K_SESSION = "oh:session";

function readAccounts(): Record<string, Account> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(K_ACCOUNTS) || "{}");
  } catch {
    return {};
  }
}
function writeAccounts(a: Record<string, Account>) {
  localStorage.setItem(K_ACCOUNTS, JSON.stringify(a));
}

function randomSalt(): string {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  return Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
}

async function hashPw(password: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (x) => x.toString(16).padStart(2, "0")).join("");
}

function validEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

/** Bu e-postayla daha önce kayıt olunmuş mu? (modal: giriş mi kayıt mı kararı için) */
export function accountExists(email: string): boolean {
  return Boolean(readAccounts()[email.trim().toLowerCase()]);
}

// ── Kullanıcı adı (CrazyGames tarzı kurulum) ──────────────────────────────
// Kurallar: 6-20 karakter; sadece harf, sayı, "." ve "_".
const USERNAME_RE = /^[A-Za-z0-9._]+$/;

export function usernameChecks(name: string): { lengthOk: boolean; charsOk: boolean; valid: boolean } {
  const lengthOk = name.length >= 6 && name.length <= 20;
  const charsOk = name.length > 0 && USERNAME_RE.test(name);
  return { lengthOk, charsOk, valid: lengthOk && charsOk };
}

/** Rastgele, uygun (6-20, geçerli karakter) bir kullanıcı adı üretir. */
export function generateUsername(): string {
  const adj = ["Hizli", "Gizli", "Cesur", "Vahsi", "Sessiz", "Kara", "Altin", "Mavi", "Kizil", "Yildiz", "Gece", "Simsek", "Kurt", "Sahin", "Buz"];
  const noun = ["Kaplan", "Avci", "Ninja", "Komando", "Nisanci", "Kartal", "Pars", "Aslan", "Korsan", "Robot", "Fenix", "Golge", "Ejder", "Pilot"];
  const a = adj[Math.floor(Math.random() * adj.length)];
  const n = noun[Math.floor(Math.random() * noun.length)];
  const num = Math.floor(Math.random() * 900 + 10); // 10-909
  return `${a}${n}${num}`;
}

export type AuthUser = { email: string; username: string; avatar: string; createdAt?: number };

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      const email = localStorage.getItem(K_SESSION);
      const acc = email ? readAccounts()[email] : null;
      setUser(acc ? { email: acc.email, username: acc.username, avatar: acc.avatar, createdAt: acc.createdAt } : null);
      setReady(true);
    };
    sync();
    window.addEventListener("oh:auth", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("oh:auth", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const register = useCallback(
    async (email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
      email = email.trim().toLowerCase();
      if (!validEmail(email)) return { ok: false, error: "Geçerli bir e-posta gir." };
      if (password.length < 6) return { ok: false, error: "Şifre en az 6 karakter olmalı." };
      const accounts = readAccounts();
      if (accounts[email]) return { ok: false, error: "Bu e-posta zaten kayıtlı. Giriş yap." };
      const salt = randomSalt();
      const hash = await hashPw(password, salt);
      accounts[email] = {
        email,
        salt,
        hash,
        username: email.split("@")[0],
        avatar: "🎮",
        createdAt: Date.now(),
      };
      writeAccounts(accounts);
      localStorage.setItem(K_SESSION, email);
      window.dispatchEvent(new Event("oh:auth"));
      return { ok: true };
    },
    [],
  );

  const login = useCallback(
    async (email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
      email = email.trim().toLowerCase();
      const acc = readAccounts()[email];
      if (!acc) return { ok: false, error: "Böyle bir hesap yok. Kayıt ol." };
      if (acc.provider === "google" || !acc.salt || !acc.hash) {
        return { ok: false, error: "Bu hesap Google ile oluşturuldu. 'Google ile devam et' ile giriş yap." };
      }
      const hash = await hashPw(password, acc.salt);
      if (hash !== acc.hash) return { ok: false, error: "Şifre hatalı." };
      localStorage.setItem(K_SESSION, email);
      window.dispatchEvent(new Event("oh:auth"));
      return { ok: true };
    },
    [],
  );

  /** Google ile giriş: GIS'ten gelen profil bilgisiyle hesabı oluştur/güncelle. */
  const loginWithGoogle = useCallback(
    (profile: { email: string; name?: string; picture?: string }) => {
      const email = profile.email.trim().toLowerCase();
      if (!email) return { ok: false };
      const accounts = readAccounts();
      const existing = accounts[email];
      accounts[email] = {
        email,
        provider: "google",
        username: profile.name || existing?.username || email.split("@")[0],
        avatar: profile.picture || existing?.avatar || "🎮",
        createdAt: existing?.createdAt ?? Date.now(),
      };
      writeAccounts(accounts);
      localStorage.setItem(K_SESSION, email);
      window.dispatchEvent(new Event("oh:auth"));
      return { ok: true };
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(K_SESSION);
    window.dispatchEvent(new Event("oh:auth"));
  }, []);

  const updateAccount = useCallback((patch: Partial<Pick<Account, "username" | "avatar">>) => {
    const email = localStorage.getItem(K_SESSION);
    if (!email) return;
    const accounts = readAccounts();
    if (!accounts[email]) return;
    accounts[email] = { ...accounts[email], ...patch };
    writeAccounts(accounts);
    window.dispatchEvent(new Event("oh:auth"));
  }, []);

  return { user, ready, register, login, loginWithGoogle, logout, updateAccount };
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { useProfile, useFavorites, useRecent } from "@/lib/useLocalProfile";
import { useAuth } from "@/lib/auth";
import { useOpenLogin } from "@/lib/useLoginModal";
import { SHOP_ITEMS } from "@/lib/shop";

export default function ProfilePage() {
  const { profile, coins, owned, save } = useProfile();
  const { user, logout, updateAccount } = useAuth();
  const openLogin = useOpenLogin();
  const { ids: favs } = useFavorites();
  const recent = useRecent();
  const [name, setName] = useState(profile.username);

  // Profil değişikliklerini hem yerel profile hem (girişliyse) hesaba yaz
  const saveName = (username: string) => {
    save({ username });
    updateAccount({ username });
  };
  const saveAvatar = (avatar: string) => {
    save({ avatar });
    updateAccount({ avatar });
  };

  const ownedAvatars = SHOP_ITEMS.filter((i) => i.kind === "avatar" && owned.includes(i.id));
  const ownedBadges = SHOP_ITEMS.filter((i) => i.kind === "badge" && owned.includes(i.id));

  return (
    <div className="container-x max-w-4xl space-y-8 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-black text-white neon-text">Profilim</h1>
        {user ? (
          <div className="flex items-center gap-3 text-sm">
            <span className="rounded-lg bg-white/5 px-3 py-1.5 text-slate-400">✉ {user.email}</span>
            <button onClick={logout} className="btn-ghost py-2 text-xs">Çıkış Yap</button>
          </div>
        ) : (
          <button onClick={openLogin} className="btn-primary py-2 text-xs">Giriş Yap / Kayıt Ol</button>
        )}
      </div>

      <div className="card-base flex flex-col items-center gap-4 p-6 sm:flex-row sm:items-start">
        <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white/5 text-5xl shadow-glow">
          {user?.avatar?.startsWith("http") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatar} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            profile.avatar
          )}
        </div>
        <div className="flex-1 space-y-3">
          <label className="block text-xs uppercase tracking-wider text-slate-500">Kullanıcı adı</label>
          <div className="flex gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              className="flex-1 rounded-xl border border-line bg-base/60 px-4 py-2 text-white outline-none focus:border-neon"
            />
            <button onClick={() => saveName(name.trim() || "Misafir Oyuncu")} className="btn-primary py-2">
              Kaydet
            </button>
          </div>

          <div className="flex flex-wrap gap-4 pt-2 text-sm">
            <span className="rounded-lg bg-white/5 px-3 py-1.5">🪙 <b className="text-neon">{coins}</b> jeton</span>
            <Link href="/favorilerim" className="rounded-lg bg-white/5 px-3 py-1.5 hover:text-neon">
              ♥ <b>{favs.length}</b> favori
            </Link>
            <span className="rounded-lg bg-white/5 px-3 py-1.5">🕒 <b>{recent.length}</b> son oynanan</span>
          </div>
        </div>
      </div>

      {/* Sahip olunan avatarlar */}
      <section className="card-base p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-white">Avatarların</h2>
          <Link href="/magaza" className="text-sm font-semibold text-neon hover:underline">Mağaza →</Link>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => saveAvatar("🎮")}
            className="grid h-14 w-14 place-items-center rounded-xl border border-line bg-white/5 text-2xl hover:border-neon"
          >
            🎮
          </button>
          {ownedAvatars.map((a) => (
            <button
              key={a.id}
              onClick={() => saveAvatar(a.value)}
              className={`grid h-14 w-14 place-items-center rounded-xl border bg-white/5 text-2xl hover:border-neon ${
                profile.avatar === a.value ? "border-neon shadow-glow" : "border-line"
              }`}
            >
              {a.value}
            </button>
          ))}
          {ownedAvatars.length === 0 && (
            <p className="self-center text-sm text-slate-500">
              Henüz avatar yok. <Link href="/magaza" className="text-neon">Mağazadan</Link> al.
            </p>
          )}
        </div>
      </section>

      {/* Rozetler */}
      <section className="card-base p-5">
        <h2 className="mb-3 font-display text-lg font-bold text-white">Rozetlerin</h2>
        <div className="flex flex-wrap gap-3 text-2xl">
          {ownedBadges.length > 0
            ? ownedBadges.map((b) => (
                <span key={b.id} className="grid h-12 w-12 place-items-center rounded-xl bg-white/5">
                  {b.value}
                </span>
              ))
            : <p className="text-sm text-slate-500">Henüz rozet yok.</p>}
        </div>
      </section>

      <p className="text-center text-xs text-slate-600">
        Profilin şu an bu cihazda saklanıyor. Cihazlar arası senkron ve gerçek giriş için
        hesap sistemi (backend) eklenecek.
      </p>
    </div>
  );
}

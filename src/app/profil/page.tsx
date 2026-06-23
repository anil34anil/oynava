"use client";

import Link from "next/link";
import { useState } from "react";
import { useProfile, useFavorites, useRecent } from "@/lib/useLocalProfile";
import { useAuth } from "@/lib/auth";
import { useOpenLogin } from "@/lib/useLoginModal";
import { SHOP_ITEMS } from "@/lib/shop";
import { GameListFromIds } from "@/components/GameListFromIds";

type Tab = "begenilen" | "ayarlar";

export default function ProfilePage() {
  const { profile, coins, owned, save } = useProfile();
  const { user, logout, updateAccount } = useAuth();
  const openLogin = useOpenLogin();
  const { ids: favs } = useFavorites();
  const recent = useRecent();
  const [name, setName] = useState(profile.username);
  const [tab, setTab] = useState<Tab>("begenilen");
  const [shared, setShared] = useState(false);

  const saveName = (username: string) => {
    save({ username });
    updateAccount({ username });
  };
  const saveAvatar = (avatar: string) => {
    save({ avatar });
    updateAccount({ avatar });
  };

  const displayName = user?.username ?? profile.username;
  const displayAvatar = user?.avatar ?? profile.avatar;
  const memberDays = user?.createdAt
    ? Math.max(0, Math.floor((Date.now() - user.createdAt) / 86_400_000))
    : null;

  const ownedAvatars = SHOP_ITEMS.filter((i) => i.kind === "avatar" && owned.includes(i.id));
  const ownedBadges = SHOP_ITEMS.filter((i) => i.kind === "badge" && owned.includes(i.id));

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) await navigator.share({ title: `${displayName} — OYNAVA`, url });
      else {
        await navigator.clipboard.writeText(url);
        setShared(true);
        setTimeout(() => setShared(false), 1500);
      }
    } catch {
      /* iptal edildi */
    }
  };

  const Avatar = ({ size }: { size: string }) =>
    displayAvatar.startsWith("http") ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={displayAvatar} alt="" className={`${size} rounded-2xl object-cover`} referrerPolicy="no-referrer" />
    ) : (
      <span className={`grid ${size} place-items-center rounded-2xl bg-black/[0.04]`}>{displayAvatar}</span>
    );

  return (
    <div className="container-x max-w-5xl space-y-6 py-6">
      {/* Banner + kimlik */}
      <div className="overflow-hidden rounded-3xl border border-line bg-card">
        <div className="h-28 bg-gradient-to-r from-neon/25 via-neon-lime/20 to-neon-purple/25 sm:h-36" />
        <div className="relative flex flex-col gap-4 px-5 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <div className="-mt-12 shrink-0 rounded-2xl border-4 border-card bg-card text-6xl shadow-glow sm:-mt-14">
              <Avatar size="h-24 w-24 text-6xl" />
            </div>
            <div className="pb-1">
              <h1 className="font-display text-2xl font-black text-ink sm:text-3xl">{displayName}</h1>
              <p className="text-sm text-slate-500">📍 Türkiye</p>
            </div>
          </div>
          <div className="flex gap-2 pb-1">
            {user ? (
              <>
                <button onClick={() => setTab("ayarlar")} className="btn-ghost py-2 text-xs">✎ Profili düzenle</button>
                <button onClick={share} className="btn-ghost py-2 text-xs">↗ {shared ? "Kopyalandı" : "Profili paylaş"}</button>
              </>
            ) : (
              <button onClick={openLogin} className="btn-primary py-2 text-xs">Giriş Yap / Kayıt Ol</button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[260px_1fr]">
        {/* Sol: istatistikler */}
        <aside className="space-y-4">
          <div className="card-base p-5">
            <h2 className="font-display text-lg font-bold text-ink">İstatistikler</h2>
            <ul className="mt-3 space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-black/[0.04]">📅</span>
                <span>
                  <span className="block text-slate-500">Üye gün sayısı</span>
                  <b className="text-ink">{memberDays === null ? "—" : `${memberDays} gün`}</b>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-black/[0.04]">👍</span>
                <span>
                  <span className="block text-slate-500">Beğenilen oyunlar</span>
                  <b className="text-ink">{favs.length}</b>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-black/[0.04]">🕒</span>
                <span>
                  <span className="block text-slate-500">Son oynananlar</span>
                  <b className="text-ink">{recent.length}</b>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-black/[0.04]">🪙</span>
                <span>
                  <span className="block text-slate-500">Jeton</span>
                  <b className="text-neon">{coins}</b>
                </span>
              </li>
            </ul>
          </div>
          {user && (
            <button onClick={logout} className="btn-ghost w-full py-2 text-xs">Çıkış Yap</button>
          )}
        </aside>

        {/* Sağ: sekmeler */}
        <div className="space-y-5">
          <div className="flex gap-2">
            <button
              onClick={() => setTab("begenilen")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                tab === "begenilen" ? "bg-neon text-[#fffdf8]" : "border border-line text-slate-400 hover:text-ink"
              }`}
            >
              Beğenilen Oyunlar
            </button>
            <button
              onClick={() => setTab("ayarlar")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                tab === "ayarlar" ? "bg-neon text-[#fffdf8]" : "border border-line text-slate-400 hover:text-ink"
              }`}
            >
              Ayarlar
            </button>
          </div>

          {tab === "begenilen" ? (
            <GameListFromIds
              ids={favs}
              empty={
                <div className="card-base p-8 text-center text-slate-500">
                  Henüz favori oyunun yok. Oyun kartlarındaki ♥ ile favorilerine ekle!
                  <div className="mt-3">
                    <Link href="/oyunlar" className="text-neon hover:underline">Oyunları keşfet →</Link>
                  </div>
                </div>
              }
            />
          ) : (
            <div className="space-y-5">
              {/* Kullanıcı adı */}
              <section className="card-base p-5">
                <label className="block text-xs uppercase tracking-wider text-slate-500">Kullanıcı adı</label>
                <div className="mt-2 flex gap-2">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={20}
                    className="flex-1 rounded-xl border border-line bg-base/60 px-4 py-2 text-ink outline-none focus:border-neon"
                  />
                  <button onClick={() => saveName(name.trim() || "Misafir Oyuncu")} className="btn-primary py-2">
                    Kaydet
                  </button>
                </div>
              </section>

              {/* Avatarlar */}
              <section className="card-base p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold text-ink">Avatarın</h2>
                  <Link href="/magaza" className="text-sm font-semibold text-neon hover:underline">Mağaza →</Link>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => saveAvatar("🎮")}
                    className="grid h-14 w-14 place-items-center rounded-xl border border-line bg-black/[0.04] text-2xl hover:border-neon"
                  >
                    🎮
                  </button>
                  {ownedAvatars.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => saveAvatar(a.value)}
                      className={`grid h-14 w-14 place-items-center rounded-xl border bg-black/[0.04] text-2xl hover:border-neon ${
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
                <h2 className="mb-3 font-display text-lg font-bold text-ink">Rozetlerin</h2>
                <div className="flex flex-wrap gap-3 text-2xl">
                  {ownedBadges.length > 0
                    ? ownedBadges.map((b) => (
                        <span key={b.id} className="grid h-12 w-12 place-items-center rounded-xl bg-black/[0.04]">
                          {b.value}
                        </span>
                      ))
                    : <p className="text-sm text-slate-500">Henüz rozet yok.</p>}
                </div>
              </section>

              {!user && (
                <p className="text-center text-xs text-slate-600">
                  Profilin şu an bu cihazda saklanıyor. Cihazlar arası senkron için giriş yap.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

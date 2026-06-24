"use client";

import { useState } from "react";
import { useProfile } from "@/lib/useLocalProfile";
import { SHOP_ITEMS, COIN_PACKS, ShopItem } from "@/lib/shop";
import { AutoTrScope } from "@/components/AutoTrScope";

export default function ShopPage() {
  const { coins, owned, buy, save } = useProfile();
  const [toast, setToast] = useState<string | null>(null);

  function handleBuy(item: ShopItem) {
    if (owned.includes(item.id)) {
      if (item.kind === "avatar") save({ avatar: item.value });
      setToast(item.kind === "avatar" ? `${item.name} avatarı kuşanıldı` : "Zaten sahipsin");
      return;
    }
    const ok = buy(item.id, item.price);
    setToast(ok ? `${item.name} satın alındı!` : "Yeterli jetonun yok 😕");
    if (ok && item.kind === "avatar") save({ avatar: item.value });
    setTimeout(() => setToast(null), 2200);
  }

  const groups: { title: string; kind: ShopItem["kind"] }[] = [
    { title: "🧑‍🚀 Avatarlar", kind: "avatar" },
    { title: "🎖️ Rozetler", kind: "badge" },
    { title: "🎨 Profil Temaları", kind: "theme" },
  ];

  return (
    <AutoTrScope className="container-x space-y-8 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-black text-ink neon-text">Mağaza</h1>
        <div className="rounded-xl border border-line bg-card px-4 py-2 font-display text-lg text-neon">
          🪙 {coins} jeton
        </div>
      </div>

      {/* Gerçek-para uyarısı (dürüstlük) */}
      <div className="card-base border-neon-purple/40 p-4 text-sm text-slate-400">
        <strong className="text-ink">Not:</strong> Kozmetikler <em>sanal jetonla</em> alınır.
        Aşağıdaki jeton paketleri gerçek ödeme entegrasyonu (Stripe) bağlanınca aktif olur —
        şu an demo amaçlıdır, gerçek tahsilat yapmaz.
      </div>

      {groups.map((g) => (
        <section key={g.kind} className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">{g.title}</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {SHOP_ITEMS.filter((i) => i.kind === g.kind).map((item) => {
              const isOwned = owned.includes(item.id);
              return (
                <div key={item.id} className="card-base flex flex-col items-center gap-2 p-4 text-center">
                  <div
                    className="grid h-16 w-16 place-items-center rounded-2xl text-3xl"
                    style={
                      item.kind === "theme"
                        ? { background: item.value, color: "#070912" }
                        : { background: "rgba(255,255,255,.05)" }
                    }
                  >
                    {item.kind === "theme" ? "🎨" : item.value}
                  </div>
                  <div className="font-display text-sm font-semibold text-ink">{item.name}</div>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                  <button
                    onClick={() => handleBuy(item)}
                    className={isOwned ? "btn-ghost w-full py-2 text-xs" : "btn-primary w-full py-2 text-xs"}
                  >
                    {isOwned ? (item.kind === "avatar" ? "Kuşan" : "Sahipsin ✓") : `🪙 ${item.price}`}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-ink">💳 Jeton Paketleri</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {COIN_PACKS.map((p) => (
            <div key={p.id} className="card-base flex items-center justify-between p-5">
              <div>
                <div className="font-display text-2xl font-black text-neon">🪙 {p.coins}</div>
                <div className="text-sm text-slate-500">{p.price}</div>
              </div>
              <button
                onClick={() => setToast("Ödeme entegrasyonu (Stripe) henüz bağlı değil.")}
                className="btn-ghost py-2 text-xs"
              >
                Satın Al
              </button>
            </div>
          ))}
        </div>
      </section>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-neon bg-card px-5 py-3 text-sm text-ink shadow-glow">
          {toast}
        </div>
      )}
    </AutoTrScope>
  );
}

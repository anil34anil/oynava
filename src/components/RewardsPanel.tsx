"use client";

import { useState } from "react";
import { useStreak, usePlaysTotal, useFavorites } from "@/lib/useLocalProfile";
import { ACHIEVEMENTS, isEarned, earnedCount, type Stats } from "@/lib/achievements";

/**
 * Günlük giriş ödülü (streak → sanal jeton) + başarım rozetleri.
 * Tamamen localStorage; sunucu maliyeti yok. Profil sayfasında gösterilir.
 */
export function RewardsPanel() {
  const { days, canClaim, claim } = useStreak();
  const played = usePlaysTotal();
  const { ids: favs } = useFavorites();
  const [reward, setReward] = useState<number | null>(null);

  const stats: Stats = { played, favorites: favs.length, streak: days };
  const earned = earnedCount(stats);

  return (
    <section className="card-base space-y-5 p-5">
      {/* Günlük ödül */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold text-ink">🎁 Günlük Ödül</h2>
          <p className="text-sm text-slate-500">
            {days > 0 ? `${days} günlük seri 🔥 — her gün gelince ödül artar` : "Her gün gel, jeton kazan!"}
          </p>
        </div>
        {canClaim ? (
          <button onClick={() => setReward(claim())} className="btn-primary py-2 text-sm">
            Ödülü Al
          </button>
        ) : (
          <span className="rounded-full border border-line px-3 py-1.5 text-sm text-slate-400">
            Bugünkü alındı ✓
          </span>
        )}
      </div>
      {reward !== null && reward > 0 && (
        <p className="rounded-lg bg-neon/10 px-3 py-2 text-sm font-semibold text-neon">
          +{reward} 🪙 jeton kazandın! Mağazadan avatar/rozet alabilirsin.
        </p>
      )}

      {/* Başarımlar */}
      <div>
        <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-slate-300">
          Başarımlar <span className="text-slate-500">{earned}/{ACHIEVEMENTS.length}</span>
        </h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {ACHIEVEMENTS.map((a) => {
            const ok = isEarned(a, stats);
            const cur = stats[a.stat];
            return (
              <div
                key={a.id}
                title={a.desc}
                className={`rounded-xl border p-3 text-center transition ${
                  ok ? "border-neon/40 bg-neon/[0.06]" : "border-line bg-white/[0.03] opacity-60"
                }`}
              >
                <div className={`text-2xl ${ok ? "" : "grayscale"}`}>{a.icon}</div>
                <div className="mt-1 truncate text-xs font-semibold text-slate-200">{a.title}</div>
                <div className="text-[11px] text-slate-500">
                  {ok ? "Tamamlandı" : `${Math.min(cur, a.need)}/${a.need}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

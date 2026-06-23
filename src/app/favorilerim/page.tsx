"use client";

import Link from "next/link";
import { useFavorites, useRecent } from "@/lib/useLocalProfile";
import { GameListFromIds } from "@/components/GameListFromIds";

export default function FavoritesPage() {
  const { ids: favs } = useFavorites();
  const recent = useRecent();

  return (
    <div className="container-x space-y-10 py-6">
      <section className="space-y-4">
        <h1 className="font-display text-3xl font-black text-ink neon-text">♥ Favorilerim</h1>
        <GameListFromIds
          ids={favs}
          empty={
            <div className="card-base grid place-items-center py-16 text-center">
              <p className="text-lg text-slate-400">Henüz favori oyunun yok.</p>
              <Link href="/oyunlar" className="btn-primary mt-4">
                Oyunlara göz at
              </Link>
            </div>
          }
        />
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl font-bold text-ink">🕒 Son Oynananlar</h2>
        <GameListFromIds
          ids={recent}
          empty={<p className="text-slate-500">Henüz oyun oynamadın.</p>}
        />
      </section>
    </div>
  );
}

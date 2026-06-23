"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Game, slugifyTitle } from "@/lib/catalog";
import { trDescription } from "@/lib/tr";

/** Öne çıkan: premium oyunlar arasında otomatik döner (her ~6 sn). */
export function Hero({ games }: { games: Game[] }) {
  const pool = games.length ? games : [];
  const [i, setI] = useState(0);

  useEffect(() => {
    if (pool.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % pool.length), 6000);
    return () => clearInterval(t);
  }, [pool.length]);

  const game = pool[i];
  const href = game ? `/oyun/${game.id}/${slugifyTitle(game.title)}` : "/premium";

  return (
    <section className="relative overflow-hidden rounded-3xl border border-line bg-card">
      <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-neon/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-neon-purple/20 blur-3xl" />

      <div className="relative grid gap-6 p-6 md:grid-cols-2 md:items-center md:p-10">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-neon/40 bg-neon/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-neon">
            <span className="h-2 w-2 animate-pulse rounded-full bg-neon" /> Öne Çıkan
          </span>
          <h1 className="mt-4 font-display text-3xl font-black leading-tight text-ink md:text-5xl">
            {game?.title ?? "Tarayıcında Akıcı Oyun Deneyimi"}
          </h1>
          <p className="mt-3 line-clamp-2 max-w-md text-slate-400">
            {game ? trDescription(game).slice(0, 150) : "Binlerce HTML5 oyun anında parmaklarının ucunda."}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={href} className="btn-primary">▶ Hemen Oyna</Link>
            <Link href="/premium" className="btn-ghost">✦ Premium Oyunlar</Link>
          </div>

          {/* döndürme göstergeleri */}
          {pool.length > 1 && (
            <div className="mt-5 flex gap-1.5">
              {pool.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setI(idx)}
                  aria-label={`Öne çıkan ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all ${idx === i ? "w-6 bg-neon" : "w-1.5 bg-black/15 hover:bg-black/30"}`}
                />
              ))}
            </div>
          )}
        </div>

        <Link href={href} className="group relative block aspect-video overflow-hidden rounded-2xl border border-line shadow-glow-purple">
          {game ? (
            <Image
              key={game.id}
              src={game.thumb}
              alt={game.title}
              fill
              sizes="(max-width:768px) 100vw, 50vw"
              className="object-cover transition duration-500 group-hover:scale-105"
              priority
              unoptimized
            />
          ) : (
            <div className="grid h-full place-items-center bg-gradient-to-br from-neon-purple/20 to-neon/20 text-6xl">🎮</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-base/80 via-transparent to-transparent" />
          <span className="absolute inset-0 grid place-items-center opacity-0 transition group-hover:opacity-100">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-neon/90 text-2xl text-[#fffdf8] shadow-glow">▶</span>
          </span>
        </Link>
      </div>
    </section>
  );
}

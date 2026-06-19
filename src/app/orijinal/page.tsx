import type { Metadata } from "next";
import Link from "next/link";
import { ORIGINALS } from "@/lib/originals";

export const metadata: Metadata = {
  title: "Oynava Originals — Bize Özel Oyunlar",
  description: "Oynava'ya özel, tamamen özgün (telifsiz) HTML5 oyunlar. Oyna, jeton kazan.",
};

export default function OriginalsPage() {
  return (
    <div className="container-x py-8">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-neon-lime/40 bg-neon-lime/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-neon-lime">
          ★ Originals
        </span>
        <h1 className="font-display text-3xl font-black text-white neon-text">Bize Özel Oyunlar</h1>
      </div>
      <p className="mt-2 max-w-2xl text-slate-400">
        Oynava ekibinin geliştirdiği, tamamen özgün HTML5 oyunlar. İndirme yok, akıcı oynanır,
        skorundan jeton kazanırsın.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ORIGINALS.map((g) => (
          <Link
            key={g.slug}
            href={`/orijinal/${g.slug}`}
            className="card-base group flex flex-col gap-3 p-6 transition hover:-translate-y-1 hover:border-neon-lime hover:shadow-glow"
          >
            <span className="text-5xl">{g.emoji}</span>
            <h2 className="font-display text-xl font-bold text-white group-hover:text-neon-lime">{g.title}</h2>
            <p className="text-sm text-slate-400">{g.desc}</p>
            <span className="btn-primary mt-2 self-start py-1.5 text-xs">▶ Oyna</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { GolgeGame } from "@/components/GolgeGame";

export const metadata: Metadata = {
  title: "Gölge Savaşçısı — Oynava Originals",
  description:
    "Oynava'ya özel, telifsiz özgün aksiyon-survival oyunu. Tarayıcında akıcı oyna, jeton kazan.",
};

export default function GolgePage() {
  return (
    <div className="container-x space-y-6 py-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-neon-lime/40 bg-neon-lime/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-neon-lime">
          ★ Oynava Originals
        </span>
        <h1 className="font-display text-3xl font-black text-white neon-text">Gölge Savaşçısı</h1>
      </div>

      <GolgeGame />

      <div className="card-base mx-auto max-w-[960px] p-5 text-sm text-slate-400">
        <h2 className="mb-2 font-display text-lg font-bold text-white">Hakkında</h2>
        <p>
          <b className="text-white">Gölge Savaşçısı</b>, tamamen bize ait (telifsiz) özgün bir
          aksiyon-survival oyunudur — saf HTML5 Canvas ile yazılmıştır, indirme/eklenti gerektirmez.
          Bu, "konsol oyunu kalitesinde AAA" değil; tarayıcıda gerçekten akıcı çalışan, türünün
          özgün bir örneğidir. Skorundan <b className="text-neon">jeton kazanır</b>, mağazada
          harcarsın.
        </p>
      </div>
    </div>
  );
}

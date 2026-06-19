import type { Metadata } from "next";
import Link from "next/link";
import { NeonDriveGame } from "@/components/NeonDriveGame";

export const metadata: Metadata = {
  title: "Neon Sürüş — Oynava Originals",
  description: "Oynava'ya özel, telifsiz sonsuz şerit-kaçış yarış oyunu. Tarayıcında akıcı oyna, jeton kazan.",
};

export default function NeonSurusPage() {
  return (
    <div className="container-x space-y-6 py-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/orijinal" className="rounded-full border border-neon-lime/40 bg-neon-lime/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-neon-lime hover:bg-neon-lime/20">
          ★ Oynava Originals
        </Link>
        <h1 className="font-display text-3xl font-black text-white neon-text">Neon Sürüş</h1>
      </div>

      <NeonDriveGame />

      <div className="card-base mx-auto max-w-[480px] p-5 text-sm text-slate-400">
        <h2 className="mb-2 font-display text-lg font-bold text-white">Nasıl Oynanır?</h2>
        <p>
          <b className="text-white">← →</b> ok tuşları veya <b className="text-white">A / D</b> ile şerit değiştir;
          mobilde ekranın sol/sağ yarısına dokun. Pembe engellere çarpma, yeşil jetonları topla.
          Hız arttıkça skorun ve kazandığın jeton da artar. Bu oyun tamamen Oynava'ya aittir (telifsiz, özgün).
        </p>
      </div>
    </div>
  );
}

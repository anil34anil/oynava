import type { Metadata } from "next";
import Link from "next/link";
import { DungeonGame } from "@/components/DungeonGame";

export const metadata: Metadata = {
  title: "Zindan Avcısı — Oynava Originals",
  description: "Oynava'ya özel, telifsiz aksiyon-RPG. Ganimet topla, seviye atla, boss'ları yen. Tarayıcında akıcı oyna.",
};

export default function ZindanPage() {
  return (
    <div className="container-x space-y-6 py-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/orijinal" className="rounded-full border border-neon-lime/40 bg-neon-lime/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-neon-lime hover:bg-neon-lime/20">
          ★ Oynava Originals
        </Link>
        <h1 className="font-display text-3xl font-black text-white neon-text">Zindan Avcısı</h1>
      </div>

      <DungeonGame />

      <div className="card-base mx-auto max-w-[900px] p-5 text-sm text-slate-400">
        <h2 className="mb-2 font-display text-lg font-bold text-white">Nasıl Oynanır?</h2>
        <p>
          <b className="text-white">WASD</b> ile hareket et, <b className="text-white">fareyle</b> nişan al,
          <b className="text-white"> sol tık / boşluk</b> ile ateş et. Düşmanları öldürünce ganimet düşer:
          <b className="text-neon-lime"> 🪙 jeton</b> (puan + kazanç), <b className="text-neon-lime">💚 can</b> ve
          <b className="text-neon-pink"> ✨ güç</b> (hasarını artırır). XP topla, seviye atla; her 5. dalgada bir
          <b className="text-neon-purple"> boss</b> çıkar. Bu oyun tamamen Oynava'ya aittir — Diablo türünde, özgün
          ve telifsiz bir aksiyon-RPG'dir (hiçbir markanın kopyası değildir).
        </p>
      </div>
    </div>
  );
}

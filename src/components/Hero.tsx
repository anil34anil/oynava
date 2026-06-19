import Image from "next/image";
import Link from "next/link";
import { Game, slugifyTitle } from "@/lib/catalog";
import { trDescription } from "@/lib/tr";

export function Hero({ game }: { game?: Game }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-line bg-card">
      <div className="absolute inset-0 bg-grid-fade" />
      <div className="relative grid gap-6 p-6 md:grid-cols-2 md:items-center md:p-10">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-neon/40 bg-neon/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-neon">
            ● Öne Çıkan
          </span>
          <h1 className="mt-4 font-display text-3xl font-black leading-tight text-white md:text-5xl">
            {game?.title ?? "Tarayıcında Akıcı Oyun Deneyimi"}
          </h1>
          <p className="mt-3 max-w-md text-slate-400">
            {game
              ? trDescription(game).slice(0, 160)
              : "İndirme yok, kurulum yok. Binlerce HTML5 oyun anında parmaklarının ucunda."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {game ? (
              <Link
                href={`/oyun/${game.id}/${slugifyTitle(game.title)}`}
                className="btn-primary"
              >
                ▶ Hemen Oyna
              </Link>
            ) : (
              <Link href="/kategori/3d" className="btn-primary">
                ▶ 3D Oyunlar
              </Link>
            )}
            <Link href="/kategori/aksiyon" className="btn-ghost">
              Aksiyon Oyunları
            </Link>
          </div>
        </div>

        <div className="relative aspect-video overflow-hidden rounded-2xl border border-line shadow-glow-purple">
          {game ? (
            <Image
              src={game.thumb}
              alt={game.title}
              fill
              sizes="(max-width:768px) 100vw, 50vw"
              className="object-cover"
              priority
              unoptimized
            />
          ) : (
            <div className="grid h-full place-items-center bg-gradient-to-br from-neon-purple/20 to-neon/20 text-6xl">
              🎮
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

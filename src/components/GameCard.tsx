"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { Game, slugifyTitle } from "@/lib/catalog";
import { FavoriteButton } from "./FavoriteButton";
import { ReactionPill } from "./ReactionPill";
import { useLocale, localizedHref } from "@/lib/useLocaleClient";

export function GameCard({ game, priority = false }: { game: Game; priority?: boolean }) {
  // Masaüstünde fareyle üzerine gelince (kısa gecikmeyle) oyunu canlı önizle.
  const [preview, setPreview] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const locale = useLocale();

  const startHover = () => {
    if (window.matchMedia("(hover: none)").matches) return; // dokunmatik: önizleme yok
    timer.current = setTimeout(() => setPreview(true), 600);
  };
  const endHover = () => {
    if (timer.current) clearTimeout(timer.current);
    setPreview(false);
  };

  return (
    <Link
      href={localizedHref(`/oyun/${game.id}/${slugifyTitle(game.title)}`, locale)}
      onMouseEnter={startHover}
      onMouseLeave={endHover}
      className="group relative block overflow-hidden rounded-2xl border border-line bg-card transition-all duration-200 hover:-translate-y-1 hover:border-neon hover:shadow-glow"
    >
      <FavoriteButton id={game.id} />
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={game.thumb}
          alt={`${game.title} - ücretsiz oyna`}
          fill
          sizes="(max-width:640px) 50vw, (max-width:1024px) 25vw, 16vw"
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          /* Oyun CDN'leri (gamemonetize/gamepix/playgama) görseli zaten optimize WebP
             olarak edge'den sunar; Vercel optimizer'ından geçirmek 6700 görselde
             kota/maliyet yaratır → doğrudan CDN servisi (unoptimized) bilinçli tercih. */
          unoptimized
        />

        {/* Canlı önizleme: fare üstündeyken oyunu iframe ile göster (tıklama Link'e geçsin) */}
        {preview && (
          <iframe
            src={game.url}
            title={`${game.title} önizleme`}
            aria-hidden
            tabIndex={-1}
            loading="lazy"
            className="pointer-events-none absolute inset-0 z-[1] h-full w-full bg-black"
          />
        )}

        {!preview && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-base via-base/10 to-transparent opacity-80" />
            <div className="absolute inset-0 grid place-items-center bg-base/60 opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
              <span className="btn-primary scale-90 transition group-hover:scale-100">▶ Oyna</span>
            </div>
          </>
        )}

        {/* Önizleme yüklenirken sağ üstte küçük "CANLI" rozeti */}
        {preview && (
          <span className="absolute left-2 top-2 z-[2] rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            ● Önizleme
          </span>
        )}
      </div>

      <div className="p-3">
        <h3 className="truncate font-display text-sm font-semibold text-slate-100 group-hover:text-neon">
          {game.title}
        </h3>
        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="truncate text-xs text-slate-500">{game.category}</p>
          <ReactionPill id={game.id} size="sm" />
        </div>
      </div>
    </Link>
  );
}

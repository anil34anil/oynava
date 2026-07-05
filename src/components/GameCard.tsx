"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { Game, slugifyTitle } from "@/lib/catalog";
import { FavoriteButton } from "./FavoriteButton";
import { useLocale, localizedHref } from "@/lib/useLocaleClient";

/**
 * Oyun kartı — CrazyGames/Poki tarzı: SADECE görsel (oyun adı zaten thumbnail'de yazılı).
 * Kart altında ayrı başlık/kategori metni YOK → temiz ızgara. Oyun adı hover'da alt şeritte
 * belirir; ayrıca aria-label + alt metninde bulunur (SEO/erişilebilirlik korunur).
 */
export function GameCard({ game, priority = false }: { game: Game; priority?: boolean }) {
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
      aria-label={game.title}
      onMouseEnter={startHover}
      onMouseLeave={endHover}
      className="group relative block aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-card transition-all duration-200 hover:-translate-y-1 hover:border-neon hover:shadow-glow"
    >
      <FavoriteButton id={game.id} />
      <Image
        src={game.thumb}
        alt={`${game.title} - ücretsiz oyna`}
        fill
        sizes="(max-width:640px) 50vw, (max-width:1024px) 25vw, 16vw"
        className="object-contain transition-transform duration-300 group-hover:scale-105"
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
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

      {/* Hover'da "▶ Oyna" (önizleme yokken) */}
      {!preview && (
        <div className="absolute inset-0 z-[1] grid place-items-center bg-base/40 opacity-0 backdrop-blur-[1px] transition group-hover:opacity-100">
          <span className="btn-primary scale-90 transition group-hover:scale-100">▶ Oyna</span>
        </div>
      )}

      {/* Oyun adı — hover'da alt şeritte (temiz; SEO için DOM'da) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] bg-gradient-to-t from-base/95 via-base/70 to-transparent p-2 pt-6 opacity-0 transition group-hover:opacity-100">
        <span className="block truncate text-xs font-semibold text-slate-100">{game.title}</span>
      </div>

      {preview && (
        <span className="absolute left-2 top-2 z-[3] rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
          ● Önizleme
        </span>
      )}
    </Link>
  );
}

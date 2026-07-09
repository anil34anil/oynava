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
      className="group relative z-0 block aspect-[4/3] overflow-hidden rounded-2xl bg-card ring-1 ring-inset ring-white/5 transition-transform duration-200 hover:z-20 hover:scale-125 hover:shadow-glow"
    >
      <FavoriteButton id={game.id} />

      {/* Gercek veriye dayali rozet: HOT = Redis'teki gercek oynanma sayisina gore ilk 20,
          YENI = katalogda yeni eklenen oyun. Sahte/rastgele rozet yok. */}
      {!preview && (game.hot || game.isNew) && (
        <span
          className={`absolute left-2 top-2 z-10 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow ${
            game.hot ? "bg-orange-500" : "bg-emerald-500"
          }`}
        >
          {game.hot ? "🔥 HOT" : "🆕 YENİ"}
        </span>
      )}

      {/* CrazyGames/Poki tarzı: görsel kutuyu TAM doldurur (object-cover), farklı en-boy
          oranlarında bulanık kutu/çerçeve görünümü oluşturan letterbox katmanı YOK.
          object-position: top → çoğu kaynağın logo/başlık grafiği görselin üst-orta
          bölgesinde olduğundan kırpma orada değil altta/kenarlarda gerçekleşir. */}
      <Image
        src={game.thumb}
        alt={`${game.title} - ücretsiz oyna`}
        fill
        sizes="(max-width:640px) 50vw, (max-width:1024px) 25vw, 16vw"
        className="object-cover object-top"
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        unoptimized
      />

      {/* Gameplay önizleme: sağlayıcının resmi video klibi varsa onu oynat (reklamsız),
          yoksa canlı iframe'e düş (tıklama Link'e geçsin). object-contain: gerçek oynanış
          kırpılmadan tam görünür; bulanık arka plan altından süzülür, boşluk hissi vermez. */}
      {preview && game.previewVideo && (
        <video
          src={game.previewVideo}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] h-full w-full object-contain"
        />
      )}
      {preview && !game.previewVideo && (
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

      {/* Oyun adı — hover'da alt şeritte (temiz; SEO için DOM'da). line-clamp-2: uzun
          isimler kesilip "..." ile boğulmak yerine 2 satıra sarılarak tam okunur. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] bg-gradient-to-t from-base/95 via-base/70 to-transparent p-2 pt-6 opacity-0 transition group-hover:opacity-100">
        <span className="line-clamp-2 text-xs font-semibold leading-tight text-slate-100">{game.title}</span>
      </div>

      {preview && (
        <span className="absolute left-2 top-2 z-[3] rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
          ● Önizleme
        </span>
      )}
    </Link>
  );
}

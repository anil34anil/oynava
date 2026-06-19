"use client";

import { useRef, useState } from "react";
import { Game } from "@/lib/catalog";
import { pushRecent } from "@/lib/useLocalProfile";

export function GamePlayer({ game }: { game: Game }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  function goFullscreen() {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  }

  return (
    <div className="card-base overflow-hidden">
      <div ref={wrapRef} className="relative aspect-video w-full bg-black">
        {started ? (
          <iframe
            src={game.url}
            title={game.title}
            className="absolute inset-0 h-full w-full"
            allow="autoplay; fullscreen; gamepad; microphone; clipboard-write"
            allowFullScreen
            scrolling="no"
          />
        ) : (
          <button
            onClick={() => {
              setStarted(true);
              pushRecent(game.id);
            }}
            className="group absolute inset-0 grid place-items-center"
            style={{
              backgroundImage: `linear-gradient(rgba(7,9,18,.6),rgba(7,9,18,.85)), url(${game.thumb})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <span className="grid h-20 w-20 place-items-center rounded-full bg-neon text-3xl text-base shadow-glow transition group-hover:scale-110">
              ▶
            </span>
            <span className="absolute bottom-6 font-display text-sm uppercase tracking-widest text-white">
              Başlatmak için tıkla
            </span>
          </button>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line p-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="rounded-md bg-white/5 px-2 py-1">HTML5</span>
          <span className="rounded-md bg-white/5 px-2 py-1">
            {game.width}×{game.height}
          </span>
        </div>
        <div className="flex gap-2">
          {started && (
            <button onClick={() => setStarted(false)} className="btn-ghost py-2 text-xs">
              ↻ Yeniden
            </button>
          )}
          <button onClick={goFullscreen} className="btn-primary py-2 text-xs">
            ⛶ Tam Ekran
          </button>
        </div>
      </div>
    </div>
  );
}

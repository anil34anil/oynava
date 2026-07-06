"use client";

import { useRef, useState, useEffect, useCallback } from "react";

/**
 * CrazyGames tarzı yatay kaydırmalı ray: çıplak kaydırma çubuğu yerine
 * sol/sağ ok butonları. Dokunmatik cihazlarda parmakla kaydırma zaten çalışır,
 * butonlar sadece mouse/masaüstü için ekstra kolaylık.
 */
export function ScrollRow({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [update]);

  const scrollBy = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="group/row relative">
      {canLeft && (
        <button
          type="button"
          aria-label="Sola kaydır"
          onClick={() => scrollBy(-1)}
          className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-line bg-base/90 p-2 text-ink shadow-lg backdrop-blur transition hover:border-neon hover:text-neon md:flex"
        >
          ◀
        </button>
      )}
      <div
        ref={ref}
        className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-2"
      >
        {children}
      </div>
      {canRight && (
        <button
          type="button"
          aria-label="Sağa kaydır"
          onClick={() => scrollBy(1)}
          className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-line bg-base/90 p-2 text-ink shadow-lg backdrop-blur transition hover:border-neon hover:text-neon md:flex"
        >
          ▶
        </button>
      )}
    </div>
  );
}

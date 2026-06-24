"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { LOCALES, DEFAULT_LOCALE, isLocale, localeMeta } from "@/lib/i18n";
import { useLocale } from "@/lib/useLocaleClient";

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function choose(code: string) {
    // Mevcut yoldan dil önekini çıkar, yenisini uygula
    const seg = pathname.split("/")[1];
    const bare = isLocale(seg) ? "/" + pathname.split("/").slice(2).join("/") : pathname;
    const clean = bare === "" ? "/" : bare;
    const target = code === DEFAULT_LOCALE ? clean : `/${code}${clean === "/" ? "" : clean}`;
    document.cookie = `oh_locale=${code}; path=/; max-age=31536000; samesite=lax`;
    setOpen(false);
    router.push(target);
    router.refresh();
  }

  const cur = localeMeta(locale);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Dil seç"
        className="flex items-center gap-2 rounded-lg border border-line bg-white/5 px-2.5 py-1.5 font-mono text-xs uppercase text-slate-300 transition hover:border-secondary hover:text-secondary"
      >
        <Flag cc={cur.cc} />
        <span className="hidden sm:inline">{cur.code}</span>
        <span className="text-[10px]">▾</span>
      </button>
      {open && (
        <div className="glass absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-lg py-1 shadow-glow">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => choose(l.code)}
              className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition hover:bg-white/10 ${
                l.code === locale ? "text-secondary" : "text-slate-200"
              }`}
            >
              <Flag cc={l.cc} />
              <span>{l.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Ülke bayrağı görseli (flagcdn; emoji bayrakları Windows'ta çizilmiyor). */
function Flag({ cc }: { cc: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/h20/${cc}.png`}
      srcSet={`https://flagcdn.com/h40/${cc}.png 2x`}
      width={26}
      height={20}
      alt=""
      className="h-[18px] w-[26px] shrink-0 rounded-[3px] object-cover ring-1 ring-white/15"
    />
  );
}

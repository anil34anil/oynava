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
        className="flex items-center gap-1.5 rounded-lg border border-line bg-white/5 px-2.5 py-1.5 font-mono text-xs uppercase text-slate-300 transition hover:border-secondary hover:text-secondary"
      >
        <span className="text-base leading-none">{cur.flag}</span>
        <span className="hidden sm:inline">{cur.code}</span>
        <span className="text-[10px]">▾</span>
      </button>
      {open && (
        <div className="glass absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-lg py-1 shadow-glow">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => choose(l.code)}
              className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition hover:bg-white/10 ${
                l.code === locale ? "text-secondary" : "text-slate-200"
              }`}
            >
              <span className="text-base">{l.flag}</span>
              <span>{l.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

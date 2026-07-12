"use client";

import { useEffect, useState } from "react";

/**
 * Tema seçici (tester raporu 5. madde): Koyu → Açık → Sistem döngüsü.
 * Seçim "oh:theme" anahtarında saklanır; ilk boyamada FOUC olmaması için
 * aynı mantık layout <head>'indeki inline script'te de uygulanır.
 * Varsayılan: koyu (marka görünümü) — kullanıcı isterse sistemi izler.
 */

type Mode = "dark" | "light" | "system";
const KEY = "oh:theme";
const ORDER: Mode[] = ["dark", "light", "system"];
const META: Record<Mode, { icon: string; label: string }> = {
  dark: { icon: "🌙", label: "Koyu tema" },
  light: { icon: "☀️", label: "Açık tema" },
  system: { icon: "🖥️", label: "Sistem teması" },
};

function systemTheme(): "dark" | "light" {
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function apply(mode: Mode) {
  const t = mode === "system" ? systemTheme() : mode;
  document.documentElement.dataset.theme = t;
}

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode | null>(null); // null = SSR/ilk boyama

  useEffect(() => {
    let m: Mode = "dark";
    try {
      const v = localStorage.getItem(KEY);
      if (v === "light" || v === "system") m = v;
    } catch {
      /* yoksay */
    }
    setMode(m);
  }, []);

  // "Sistem" modundayken işletim sistemi teması değişirse canlı izle
  useEffect(() => {
    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => apply("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mode]);

  function cycle() {
    const cur = mode ?? "dark";
    const next = ORDER[(ORDER.indexOf(cur) + 1) % ORDER.length];
    setMode(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* yoksay */
    }
    apply(next);
  }

  const m = META[mode ?? "dark"];
  return (
    <button
      onClick={cycle}
      title={`${m.label} — değiştirmek için tıkla`}
      aria-label={m.label}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-lg text-slate-300 transition hover:bg-white/[0.07]"
    >
      <span aria-hidden>{m.icon}</span>
    </button>
  );
}

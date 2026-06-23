"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CATEGORIES } from "@/lib/catalog";
import { SIDEBAR_TOGGLE_EVENT } from "@/lib/useSidebar";

const CAT_ICON: Record<string, string> = {
  aksiyon: "💥", macera: "🗺️", yaris: "🏎️", spor: "⚽", dovus: "🥊",
  bulmaca: "🧩", zeka: "♟️", io: "🌐", kiz: "💖", cocuk: "🧸", arcade: "🕹️", "3d": "🧊",
};

type NavItem = { href: string; label: string; icon: string; accent?: "green" | "amber" | "terra" };

const PRIMARY: NavItem[] = [
  { href: "/online", label: "Online Oyunlar", icon: "🟢", accent: "green" },
  { href: "/fps", label: "FPS / Nişancı", icon: "🎯", accent: "terra" },
  { href: "/premium", label: "Premium Oyunlar", icon: "✦", accent: "amber" },
  { href: "/oyunlar", label: "Tüm Oyunlar", icon: "🎮" },
  { href: "/blog", label: "Blog", icon: "✍️" },
  { href: "/favorilerim", label: "Favorilerim", icon: "♥" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Header'daki hamburger → çekmeceyi aç/kapat
  useEffect(() => {
    const onToggle = () => setOpen((o) => !o);
    window.addEventListener(SIDEBAR_TOGGLE_EVENT, onToggle);
    return () => window.removeEventListener(SIDEBAR_TOGGLE_EVENT, onToggle);
  }, []);

  // Rota değişince mobil çekmeceyi kapat
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  const accentClass = (a?: NavItem["accent"], active = false) => {
    if (active) return "bg-neon/12 text-neon font-bold";
    return "text-slate-300 hover:bg-black/[0.04] hover:text-ink";
  };

  const nav = (
    <nav className="flex flex-col gap-0.5 p-3">
      {PRIMARY.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${accentClass(item.accent, active)}`}
          >
            <span className="grid w-5 place-items-center text-[1rem]">
              {item.href === "/online" ? (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
              ) : (
                item.icon
              )}
            </span>
            {item.label}
          </Link>
        );
      })}

      <div className="mt-4 mb-1 px-3 text-[11px] font-bold uppercase tracking-widest text-slate-500">
        Kategoriler
      </div>
      {CATEGORIES.map((c) => {
        const href = `/kategori/${c.slug}`;
        const active = isActive(href);
        return (
          <Link
            key={c.slug}
            href={href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${accentClass(undefined, active)}`}
          >
            <span className="grid w-5 place-items-center text-[1rem]">{CAT_ICON[c.slug] ?? "🎮"}</span>
            {c.tr}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Masaüstü: sabit sol sütun */}
      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 overflow-y-auto border-r border-line bg-surface/60 lg:block">
        {nav}
      </aside>

      {/* Mobil: karartma + soldan kayan çekmece */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm transition-opacity duration-200 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed left-0 top-0 z-[56] h-full w-72 overflow-y-auto border-r border-line bg-surface shadow-2xl transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <span className="font-display text-lg font-black text-ink">Menü</span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Menüyü kapat"
            className="grid h-9 w-9 place-items-center rounded-full text-slate-400 hover:bg-black/[0.05] hover:text-ink"
          >
            ✕
          </button>
        </div>
        {nav}
      </aside>
    </>
  );
}

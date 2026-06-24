"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CATEGORIES } from "@/lib/catalog";
import { SIDEBAR_TOGGLE_EVENT } from "@/lib/useSidebar";

// Her öğe için emoji + 3D his veren gradyan (ikon kutucuğu rengi)
const CAT: Record<string, { icon: string; grad: string }> = {
  aksiyon: { icon: "💥", grad: "from-orange-400 to-red-500" },
  macera: { icon: "🗺️", grad: "from-emerald-400 to-teal-600" },
  yaris: { icon: "🏎️", grad: "from-sky-400 to-blue-600" },
  spor: { icon: "⚽", grad: "from-lime-400 to-green-600" },
  dovus: { icon: "🥊", grad: "from-rose-400 to-red-600" },
  bulmaca: { icon: "🧩", grad: "from-violet-400 to-purple-600" },
  zeka: { icon: "♟️", grad: "from-indigo-400 to-blue-700" },
  io: { icon: "🌐", grad: "from-cyan-400 to-sky-600" },
  kiz: { icon: "💖", grad: "from-pink-400 to-fuchsia-600" },
  cocuk: { icon: "🧸", grad: "from-amber-300 to-orange-500" },
  arcade: { icon: "🕹️", grad: "from-fuchsia-400 to-purple-600" },
  "3d": { icon: "🧊", grad: "from-slate-400 to-cyan-600" },
};

type NavItem = { href: string; label: string; icon: string; grad: string; online?: boolean };

const PRIMARY: NavItem[] = [
  { href: "/online", label: "Online Oyunlar", icon: "🟢", grad: "from-emerald-400 to-green-600", online: true },
  { href: "/fps", label: "FPS / Nişancı", icon: "🎯", grad: "from-orange-400 to-red-600" },
  { href: "/premium", label: "Premium Oyunlar", icon: "✦", grad: "from-amber-400 to-orange-500" },
  { href: "/oyunlar", label: "Tüm Oyunlar", icon: "🎮", grad: "from-violet-400 to-indigo-600" },
  { href: "/blog", label: "Blog", icon: "✍️", grad: "from-sky-400 to-blue-600" },
  { href: "/favorilerim", label: "Favorilerim", icon: "♥", grad: "from-pink-400 to-rose-600" },
];

/** 3D his veren ikon kutucuğu: gradyan + iç parıltı + alt gölge; hover'da eğilir/büyür. */
function IconTile({ icon, grad, active, online }: { icon: string; grad: string; active: boolean; online?: boolean }) {
  return (
    <span
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${grad} text-[15px]
        shadow-[inset_0_1px_0_rgba(255,255,255,.45),0_3px_5px_-1px_rgba(60,46,26,.35)]
        ring-1 ring-black/5 transition-transform duration-200
        group-hover:-rotate-6 group-hover:scale-110 ${active ? "animate-float" : ""}`}
    >
      {online ? (
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
        </span>
      ) : (
        <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,.35)]">{icon}</span>
      )}
    </span>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onToggle = () => setOpen((o) => !o);
    window.addEventListener(SIDEBAR_TOGGLE_EVENT, onToggle);
    return () => window.removeEventListener(SIDEBAR_TOGGLE_EVENT, onToggle);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  const itemCls = (active: boolean) =>
    `group flex items-center gap-3 rounded-2xl px-2.5 py-2 text-sm font-semibold transition ${
      active
        ? "bg-neon/12 text-neon shadow-[inset_0_0_0_1px_rgba(47,107,67,.25)]"
        : "text-slate-300 hover:bg-black/[0.04] hover:text-ink"
    }`;

  const nav = (
    <nav className="flex flex-col gap-1 p-3">
      {PRIMARY.map((item) => {
        const active = isActive(item.href);
        return (
          <Link key={item.href} href={item.href} className={itemCls(active)}>
            <IconTile icon={item.icon} grad={item.grad} active={active} online={item.online} />
            {item.label}
          </Link>
        );
      })}

      <div className="mt-4 mb-1 flex items-center gap-2 px-2 text-[11px] font-extrabold uppercase tracking-widest text-slate-500">
        <span className="h-px flex-1 bg-line" /> Kategoriler <span className="h-px flex-1 bg-line" />
      </div>
      {CATEGORIES.map((c) => {
        const href = `/kategori/${c.slug}`;
        const active = isActive(href);
        const meta = CAT[c.slug] ?? { icon: "🎮", grad: "from-slate-400 to-slate-600" };
        return (
          <Link key={c.slug} href={href} className={itemCls(active)}>
            <IconTile icon={meta.icon} grad={meta.grad} active={active} />
            {c.tr}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Masaüstü: sabit sol sütun */}
      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r border-line bg-surface/70 lg:block">
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

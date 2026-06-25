"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CATEGORIES } from "@/lib/catalog";
import { SIDEBAR_TOGGLE_EVENT } from "@/lib/useSidebar";
import { useT } from "@/lib/useLocaleClient";

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

type NavItem = { href: string; tkey: string; icon: string; online?: boolean; raw?: boolean };

const PRIMARY: NavItem[] = [
  { href: "/online", tkey: "nav.online", icon: "🟢", online: true },
  { href: "/en-cok-oynanan-oyunlar", tkey: "nav.mostPlayed", icon: "🔥" },
  { href: "/fps", tkey: "nav.fps", icon: "🎯" },
  { href: "/premium", tkey: "nav.premium", icon: "✦" },
  { href: "/oyunlar", tkey: "nav.all", icon: "🎮" },
  { href: "/rastgele", tkey: "nav.random", icon: "🎲", raw: true },
  { href: "/blog", tkey: "nav.blog", icon: "✍️" },
  { href: "/favorilerim", tkey: "nav.favorites", icon: "♥" },
];

/** Sade ikon — arka plan yok, sadece sembol; hover'da hafif büyür, aktifken yüzer. */
function IconTile({ icon, active, online }: { icon: string; active: boolean; online?: boolean }) {
  return (
    <span
      className={`grid h-7 w-7 shrink-0 place-items-center text-xl transition-transform duration-200
        group-hover:scale-125 ${active ? "animate-float" : ""}`}
    >
      {online ? (
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tertiary/60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-tertiary shadow-glow-green" />
        </span>
      ) : (
        icon
      )}
    </span>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { t, href, locale } = useT();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onToggle = () => setOpen((o) => !o);
    window.addEventListener(SIDEBAR_TOGGLE_EVENT, onToggle);
    return () => window.removeEventListener(SIDEBAR_TOGGLE_EVENT, onToggle);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // pathname dil önekli olabilir (/en/online); localize edilmiş hedefle karşılaştır
  const isActive = (bareHref: string) => {
    const full = href(bareHref);
    if (bareHref === "/") return pathname === "/" || pathname === `/${locale}`;
    return pathname === full || pathname.startsWith(full + "/");
  };

  const itemCls = (active: boolean) =>
    `group flex items-center gap-3 rounded-lg border-l-2 px-2.5 py-2 font-mono text-[13px] uppercase tracking-[0.04em] transition ${
      active
        ? "border-secondary bg-secondary/10 font-bold text-secondary"
        : "border-transparent text-slate-300 hover:bg-white/[0.06] hover:text-secondary"
    }`;

  const nav = (
    <nav className="flex flex-col gap-1 p-3">
      {PRIMARY.map((item) => {
        const active = isActive(item.href);
        const inner = (
          <>
            <IconTile icon={item.icon} active={active} online={item.online} />
            {t(item.tkey)}
          </>
        );
        // raw (örn. /rastgele route handler) tam sayfa gezinme ister → <a>
        return item.raw ? (
          <a key={item.href} href={href(item.href)} className={itemCls(active)}>
            {inner}
          </a>
        ) : (
          <Link key={item.href} href={href(item.href)} className={itemCls(active)}>
            {inner}
          </Link>
        );
      })}

      <div className="mt-4 mb-1 flex items-center gap-2 px-2 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
        <span className="h-px flex-1 bg-line" /> {t("nav.categories")} <span className="h-px flex-1 bg-line" />
      </div>
      {CATEGORIES.map((c) => {
        const bare = `/kategori/${c.slug}`;
        const active = isActive(bare);
        const meta = CAT[c.slug] ?? { icon: "🎮", grad: "from-slate-400 to-slate-600" };
        return (
          <Link key={c.slug} href={href(bare)} className={itemCls(active)}>
            <IconTile icon={meta.icon} active={active} />
            {t(`cat.${c.slug}`)}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Masaüstü: sabit sol sütun */}
      <aside className="glass sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-y-0 border-l-0 lg:block">
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
          <span className="font-display text-lg font-black text-ink">{t("common.menu")}</span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Menüyü kapat"
            className="grid h-9 w-9 place-items-center rounded-full text-slate-400 hover:bg-white/[0.07] hover:text-ink"
          >
            ✕
          </button>
        </div>
        {nav}
      </aside>
    </>
  );
}

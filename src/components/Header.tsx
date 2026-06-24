"use client";

import Link from "next/link";
import { SearchBar } from "./SearchBar";
import { ProfileChip } from "./ProfileChip";
import { Logo } from "./Logo";
import { useToggleSidebar } from "@/lib/useSidebar";

export function Header() {
  const toggleSidebar = useToggleSidebar();

  return (
    <header className="glass sticky top-0 z-50 border-x-0 border-t-0 shadow-[0_0_20px_rgba(208,188,255,0.1)]">
      <div className="container-x flex h-16 items-center gap-3">
        {/* Mobil: menü (hamburger) — masaüstünde sol sidebar zaten görünür */}
        <button
          onClick={toggleSidebar}
          aria-label="Menüyü aç"
          className="grid h-10 w-10 place-items-center rounded-xl text-slate-300 hover:bg-white/[0.07] hover:text-ink lg:hidden"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>

        <Link href="/" className="shrink-0 transition hover:opacity-90">
          <Logo />
        </Link>

        <div className="mx-auto hidden max-w-xl flex-1 md:block">
          <SearchBar />
        </div>

        <ProfileChip />
      </div>

      <div className="container-x py-2 md:hidden">
        <SearchBar />
      </div>
    </header>
  );
}

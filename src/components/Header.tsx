import Link from "next/link";
import { CATEGORIES } from "@/lib/catalog";
import { SearchBar } from "./SearchBar";
import { ProfileChip } from "./ProfileChip";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-base/80 backdrop-blur-xl">
      <div className="container-x flex h-16 items-center gap-4">
        <Link href="/" className="shrink-0 transition hover:opacity-90">
          <Logo />
        </Link>

        <div className="mx-auto hidden max-w-xl flex-1 md:block">
          <SearchBar />
        </div>

        <ProfileChip />
      </div>

      <nav className="border-t border-line/60 bg-surface/60">
        <div className="container-x flex items-center gap-1 overflow-x-auto py-2 text-sm">
          <Link
            href="/premium"
            className="whitespace-nowrap rounded-lg bg-neon-purple/10 px-3 py-1.5 font-display font-semibold uppercase tracking-wide text-neon-purple hover:bg-neon-purple/20"
          >
            ✦ Premium Oyunlar
          </Link>
          <Link
            href="/oyunlar"
            className="whitespace-nowrap rounded-lg px-3 py-1.5 font-display font-semibold uppercase tracking-wide text-slate-400 hover:bg-white/5 hover:text-neon"
          >
            Tüm Oyunlar
          </Link>
          <Link
            href="/blog"
            className="whitespace-nowrap rounded-lg px-3 py-1.5 font-display font-semibold uppercase tracking-wide text-slate-400 hover:bg-white/5 hover:text-neon"
          >
            Blog
          </Link>
          <Link
            href="/favorilerim"
            className="whitespace-nowrap rounded-lg px-3 py-1.5 font-display font-semibold uppercase tracking-wide text-slate-400 hover:bg-white/5 hover:text-neon-pink"
          >
            ♥ Favoriler
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/kategori/${c.slug}`}
              className="whitespace-nowrap rounded-lg px-3 py-1.5 font-display font-semibold uppercase tracking-wide text-slate-400 transition hover:bg-white/5 hover:text-neon"
            >
              {c.tr}
            </Link>
          ))}
        </div>
      </nav>

      <div className="container-x py-2 md:hidden">
        <SearchBar />
      </div>
    </header>
  );
}

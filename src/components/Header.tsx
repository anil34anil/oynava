import Link from "next/link";
import { CATEGORIES } from "@/lib/catalog";
import { SearchBar } from "./SearchBar";
import { ProfileChip } from "./ProfileChip";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-base/80 backdrop-blur-xl">
      <div className="container-x flex h-16 items-center gap-4">
        <Link href="/" className="group flex shrink-0 items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-neon text-base font-display text-lg font-black shadow-glow">
            O
          </span>
          <span className="font-display text-xl font-black tracking-widest text-white neon-text group-hover:text-neon">
            OYNAVA
          </span>
        </Link>

        <div className="mx-auto hidden max-w-xl flex-1 md:block">
          <SearchBar />
        </div>

        <ProfileChip />
      </div>

      <nav className="border-t border-line/60 bg-surface/60">
        <div className="container-x flex items-center gap-1 overflow-x-auto py-2 text-sm">
          <Link
            href="/orijinal/golge-savascisi"
            className="whitespace-nowrap rounded-lg bg-neon-lime/10 px-3 py-1.5 font-display font-semibold uppercase tracking-wide text-neon-lime hover:bg-neon-lime/20"
          >
            ★ Originals
          </Link>
          <Link
            href="/oyunlar"
            className="whitespace-nowrap rounded-lg px-3 py-1.5 font-display font-semibold uppercase tracking-wide text-slate-400 hover:bg-white/5 hover:text-neon"
          >
            Tüm Oyunlar
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

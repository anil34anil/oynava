import Link from "next/link";
import type { Metadata } from "next";
import { CATEGORIES } from "@/lib/catalog";
import { COLLECTIONS } from "@/lib/collections";

export const metadata: Metadata = {
  title: "Sayfa bulunamadı (404)",
  robots: { index: false, follow: true },
};

// Yardımcı 404 — kullanıcıyı sitede tutar (bounce azaltır): arama + kategoriler + koleksiyonlar.
export default function NotFound() {
  const collections = COLLECTIONS.slice(0, 10);
  return (
    <div className="container-x max-w-3xl py-16 text-center">
      <div className="font-display text-7xl font-black text-neon">404</div>
      <h1 className="mt-3 font-display text-2xl font-bold text-ink">Aradığın sayfa bulunamadı</h1>
      <p className="mx-auto mt-2 max-w-md text-slate-400">
        Sayfa taşınmış ya da hiç var olmamış olabilir. Merak etme — binlerce ücretsiz oyun bir tık ötede.
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary px-5 py-2.5">🏠 Ana Sayfa</Link>
        <Link href="/oyunlar" className="btn-ghost px-5 py-2.5">🎮 Tüm Oyunlar</Link>
        <Link href="/rastgele" className="btn-ghost px-5 py-2.5">🎲 Rastgele Oyun</Link>
      </div>

      <div className="mt-10 text-left">
        <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-slate-300">Kategoriler</h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/kategori/${c.slug}`}
              className="rounded-lg border border-line bg-white/5 px-3 py-1.5 text-sm text-slate-300 transition hover:border-neon hover:text-neon"
            >
              {c.tr}
            </Link>
          ))}
        </div>

        <h2 className="mb-3 mt-6 font-display text-sm font-semibold uppercase tracking-wider text-slate-300">Popüler Koleksiyonlar</h2>
        <div className="flex flex-wrap gap-2">
          {collections.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="rounded-lg border border-line bg-white/5 px-3 py-1.5 text-sm text-slate-300 transition hover:border-secondary hover:text-secondary"
            >
              {c.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

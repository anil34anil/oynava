import Link from "next/link";

/**
 * "House ad" — reklam yuvası boşken (AdSense henüz yok/dolmadı) gösterilen
 * kendi iç tanıtım banner'ımız. Site boş görünmesin, ziyaretçi içerikte kalsın.
 * format="vertical" → yan ray (uzun); diğerleri → yatay banner.
 */
export function HousePromo({ format = "auto", className = "" }: { format?: string; className?: string }) {
  const vertical = format === "vertical";

  if (vertical) {
    return (
      <Link
        href="/orijinal/golge-savascisi"
        className={`relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border border-neon-lime/30 bg-gradient-to-b from-neon-lime/10 to-neon-purple/10 p-4 text-center transition hover:border-neon-lime ${className}`}
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-neon-lime">★ Originals</span>
        <span className="text-4xl">🎮</span>
        <span className="font-display text-sm font-bold text-white">Gölge Savaşçısı</span>
        <span className="text-xs text-slate-400">Bize özel oyun. Oyna, jeton kazan.</span>
        <span className="btn-primary mt-1 py-1.5 text-xs">▶ Oyna</span>
      </Link>
    );
  }

  return (
    <Link
      href="/oyunlar"
      className={`relative flex items-center justify-center gap-4 overflow-hidden rounded-xl border border-neon/30 bg-gradient-to-r from-neon/10 to-neon-purple/10 px-6 text-center transition hover:border-neon ${className}`}
    >
      <span className="text-2xl">🔥</span>
      <span className="font-display text-sm font-bold text-white sm:text-base">
        Binlerce ücretsiz oyun seni bekliyor
      </span>
      <span className="btn-primary py-1.5 text-xs">Tüm Oyunlar →</span>
    </Link>
  );
}

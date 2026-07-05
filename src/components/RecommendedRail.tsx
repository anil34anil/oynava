"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRecentCards, useFavorites } from "@/lib/useLocalProfile";
import { slugifyTitle } from "@/lib/catalog";
import { useLocale, localizedHref, useAutoTr } from "@/lib/useLocaleClient";

export type RecoItem = { id: string; title: string; thumb: string; category: string };

/**
 * "Senin İçin Önerilenler" — ziyaretçiye özel öneri rayı (tamamen localStorage, sunucu maliyeti yok).
 * Kullanıcının oynadığı/favorilediği kategorilere göre havuzdan sıralar; her ziyarette değişir.
 * Geçmiş yoksa havuzu karıştırıp gösterir (yeni ziyaretçide de dolu + değişken).
 */
export function RecommendedRail({ pool }: { pool: RecoItem[] }) {
  const cards = useRecentCards();
  const { ids: favIds } = useFavorites();
  const locale = useLocale();
  const [heading] = useAutoTr(["Senin İçin Önerilenler"]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const recommended = useMemo(() => {
    if (!pool.length) return [];
    const catCount = new Map<string, number>();
    for (const c of cards) if (c.category) catCount.set(c.category, (catCount.get(c.category) || 0) + 1);
    const topCats = [...catCount.entries()].sort((a, b) => b[1] - a[1]).map((e) => e[0]).slice(0, 3);
    const played = new Set<string>([...cards.map((c) => c.id), ...favIds]);
    const notPlayed = pool.filter((g) => !played.has(g.id));
    const src = notPlayed.length >= 8 ? notPlayed : pool;
    // İlgili kategoriler öncelikli + hafif rastgelelik → her seferinde farklı düzen
    const score = (g: RecoItem) => (topCats.includes(g.category) ? 2 : 0) + Math.random();
    return [...src].sort((a, b) => score(b) - score(a)).slice(0, 14);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards, favIds, pool, mounted]);

  if (!mounted || recommended.length === 0) return null;

  return (
    <section className="cv-auto">
      <h2 className="mb-4 font-display text-xl font-bold text-ink">🎯 {heading}</h2>
      <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 [scrollbar-width:thin]">
        {recommended.map((g) => (
          <Link
            key={g.id}
            href={localizedHref(`/oyun/${g.id}/${slugifyTitle(g.title)}`, locale)}
            aria-label={g.title}
            className="group relative w-40 shrink-0 overflow-hidden rounded-xl border border-line bg-card transition hover:-translate-y-1 hover:border-neon sm:w-44"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={g.thumb}
                alt={g.title}
                fill
                sizes="180px"
                className="object-contain transition-transform duration-300 group-hover:scale-105"
                unoptimized
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-base/95 to-transparent p-1.5 pt-5 opacity-0 transition group-hover:opacity-100">
                <span className="block truncate text-[11px] font-semibold text-slate-100">{g.title}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

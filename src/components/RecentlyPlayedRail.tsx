"use client";

import Image from "next/image";
import Link from "next/link";
import { useRecentCards } from "@/lib/useLocalProfile";
import { slugifyTitle } from "@/lib/catalog";
import { useLocale, localizedHref, useAutoTr } from "@/lib/useLocaleClient";

/**
 * "Son Oynadıkların" yatay rayı — tamamen localStorage'tan (sunucuya istek YOK).
 * Yeni ziyaretçide (veri yoksa) hiç render edilmez.
 */
export function RecentlyPlayedRail() {
  const cards = useRecentCards();
  const locale = useLocale();
  const [heading] = useAutoTr(["Son Oynadıkların"]);

  if (!cards.length) return null;

  return (
    <section className="cv-auto">
      <h2 className="mb-4 font-display text-xl font-bold text-ink">🕒 {heading}</h2>
      <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 [scrollbar-width:thin]">
        {cards.map((c) => (
          <Link
            key={c.id}
            href={localizedHref(`/oyun/${c.id}/${slugifyTitle(c.title)}`, locale)}
            className="group w-36 shrink-0 overflow-hidden rounded-xl border border-line bg-card transition hover:-translate-y-1 hover:border-neon"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={c.thumb}
                alt={c.title}
                fill
                sizes="144px"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                unoptimized
              />
            </div>
            <p className="truncate px-2 py-1.5 text-xs font-medium text-slate-300 group-hover:text-neon">
              {c.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

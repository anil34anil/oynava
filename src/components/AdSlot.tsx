"use client";

import { useEffect } from "react";

/**
 * Google AdSense reklam yuvası.
 * .env.local içine NEXT_PUBLIC_ADSENSE_CLIENT eklenince gerçek reklam basar;
 * eklenmemişse "Reklam Alanı" placeholder'ı gösterir (geliştirme görünümü).
 */
export function AdSlot({
  slot,
  format = "auto",
  className = "",
}: {
  slot?: string;
  format?: string;
  className?: string;
}) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    if (!client) return;
    try {
      // @ts-expect-error adsbygoogle global
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* yoksay */
    }
  }, [client]);

  if (!client || !slot) {
    return (
      <div
        className={`grid min-h-[100px] place-items-center rounded-xl border border-dashed border-line bg-white/[0.02] text-xs uppercase tracking-widest text-slate-600 ${className}`}
      >
        Reklam Alanı
      </div>
    );
  }

  return (
    <ins
      className={`adsbygoogle block ${className}`}
      style={{ display: "block" }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}

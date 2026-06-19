"use client";

import { useEffect } from "react";
import { HousePromo } from "./HousePromo";
import { SITE } from "@/lib/site";

/**
 * Google AdSense reklam yuvası.
 * NEXT_PUBLIC_ADSENSE_CLIENT + slot tanımlıysa gerçek reklam basar;
 * tanımlı değilse boş kalmasın diye kendi tanıtım banner'ımızı (HousePromo) gösterir.
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
  const client = SITE.adsenseClient || process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    // Yalnızca gerçek bir <ins> (client + slot) varken push et.
    if (!client || !slot) return;
    try {
      // @ts-expect-error adsbygoogle global
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* yoksay */
    }
  }, [client, slot]);

  if (!client || !slot) {
    return <HousePromo format={format} className={className} />;
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

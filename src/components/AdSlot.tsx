"use client";

import { useEffect } from "react";
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

  // Gerçek reklam slotu yoksa HİÇBİR ŞEY gösterme (AdSense onaylanıp slot girilene kadar
  // boş "house promo" kutuları çıkmasın). Slot tanımlanınca gerçek reklam basılır.
  if (!client || !slot) return null;

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

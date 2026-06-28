"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/site";

/**
 * AdSense kütüphanesini yükler — ANCAK içeriği az sayfalarda (admin, giriş) yüklemez.
 * Böylece AdSense "Otomatik Reklamlar" bu sayfalara reklam basamaz (politika uyumu).
 */
const NO_AD_RE = /(^|\/)(admin|giris)(\/|$)/;

export function AdsenseScript() {
  const pathname = usePathname() || "";
  const client = SITE.adsenseClient || process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  if (!client || NO_AD_RE.test(pathname)) return null;

  return (
    <Script
      id="adsbygoogle-init"
      async
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
    />
  );
}

"use client";

import { useEffect } from "react";

/**
 * Service worker'ı kaydeder → PWA "güvenilir/app-ready" (TWA + "ana ekrana ekle").
 * Hata olursa sessizce geçer; siteyi etkilemez.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return null;
}

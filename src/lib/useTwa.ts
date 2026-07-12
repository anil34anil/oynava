"use client";

import { useEffect, useState } from "react";

/**
 * Android TWA (Google Play uygulaması com.oynava.www.twa) tespiti.
 *
 * TWA'da İLK gezinmenin referrer'ı "android-app://<paket>" olur; sonraki
 * sayfa geçişlerinde kaybolduğu için tespit localStorage'a yazılır ve cihaz
 * uygulamayı bir kez açtıysa kalıcı bilinir. Yedek sinyal: Android +
 * standalone display-mode (ana ekrana eklenmiş PWA da uygulama sayılır —
 * puanlama bağlantısı her iki durumda da anlamlıdır).
 */

export const PLAY_PACKAGE = "com.oynava.www.twa";
export const PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${PLAY_PACKAGE}`;

const TWA_KEY = "oh:twa";

export function detectTwa(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (document.referrer.startsWith(`android-app://${PLAY_PACKAGE}`)) {
      localStorage.setItem(TWA_KEY, "1");
      return true;
    }
    if (localStorage.getItem(TWA_KEY) === "1") return true;
    const isAndroid = /android/i.test(navigator.userAgent);
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    return isAndroid && standalone;
  } catch {
    return false;
  }
}

/** SSR-güvenli hook: sunucuda/ilk boyamada false, mount sonrası gerçek değer. */
export function useIsTwa(): boolean {
  const [twa, setTwa] = useState(false);
  useEffect(() => {
    setTwa(detectTwa());
  }, []);
  return twa;
}

/** Play Store puanlama sayfasını açar (Android'de market://, aksi halde web). */
export function openPlayRating() {
  const isAndroid = typeof navigator !== "undefined" && /android/i.test(navigator.userAgent);
  window.location.href = isAndroid ? `market://details?id=${PLAY_PACKAGE}` : PLAY_STORE_URL;
}

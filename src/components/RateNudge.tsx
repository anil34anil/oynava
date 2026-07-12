"use client";

import { useEffect, useState } from "react";
import { usePlaysTotal } from "@/lib/useLocalProfile";
import { useIsTwa, openPlayRating } from "@/lib/useTwa";
import { useAutoTr } from "@/lib/useLocaleClient";

/**
 * Google Play "uygulamayı puanla" nazik hatırlatması (tester raporu 4. madde).
 * Yalnızca uygulama (TWA/standalone Android) içinde ve kullanıcı en az 3 oyun
 * oynadıktan sonra BİR KEZ gösterilir; "Puanla" veya "Kapat" sonrası bir daha çıkmaz.
 */

const DONE_KEY = "oh:rate_done";
const MIN_PLAYS = 3;

export function RateNudge() {
  const twa = useIsTwa();
  const plays = usePlaysTotal();
  const [open, setOpen] = useState(false);
  const [title, body, rate, later] = useAutoTr([
    "Oynava'yı beğendin mi?",
    "Google Play'de puanlaman bize çok yardımcı olur — 10 saniye sürer.",
    "⭐ Puanla",
    "Daha sonra",
  ]);

  useEffect(() => {
    if (!twa || plays < MIN_PLAYS) return;
    try {
      if (localStorage.getItem(DONE_KEY)) return;
    } catch {
      return;
    }
    // Oyun sonrası akışı bölmemek için kısa gecikmeyle göster
    const t = setTimeout(() => setOpen(true), 2500);
    return () => clearTimeout(t);
  }, [twa, plays]);

  function dismiss(rated: boolean) {
    try {
      localStorage.setItem(DONE_KEY, rated ? "rated" : "dismissed");
    } catch {
      /* yoksay */
    }
    setOpen(false);
    if (rated) openPlayRating();
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label={title}
      className="fixed inset-x-3 bottom-3 z-[70] sm:left-auto sm:right-4 sm:w-96"
    >
      <div className="glass rounded-2xl p-4 shadow-glow">
        <p className="font-display text-sm font-bold text-ink">{title}</p>
        <p className="mt-1 text-xs text-slate-400">{body}</p>
        <div className="mt-3 flex gap-2">
          <button onClick={() => dismiss(true)} className="btn-primary flex-1 py-2 text-xs">
            {rate}
          </button>
          <button
            onClick={() => dismiss(false)}
            className="btn-ghost flex-1 py-2 text-xs"
          >
            {later}
          </button>
        </div>
      </div>
    </div>
  );
}

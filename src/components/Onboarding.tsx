"use client";

import { useEffect, useState } from "react";
import { useAutoTr } from "@/lib/useLocaleClient";

/**
 * Yeni kullanıcı karşılama turu (tester raporu 2. madde): ilk ziyarette
 * 3 adımlık hafif alt kart. "Atla" her adımda var; tamamlanınca/atlanınca
 * localStorage ile bir daha gösterilmez. Ağır tour kütüphanesi bilinçli olarak
 * kullanılmadı (performans + SEO).
 */

const KEY = "oh:onboarded";

const STEPS = [
  {
    icon: "🎮",
    title: "Oynava'ya hoş geldin!",
    body: "4000'den fazla ücretsiz oyun seni bekliyor. Sol menüden veya ana sayfadaki raylardan kategorine göz at.",
  },
  {
    icon: "⚡",
    title: "İndirme yok, bekleme yok",
    body: "Bir oyuna dokun, saniyeler içinde oynamaya başla. Cihazına hiçbir şey yüklenmez.",
  },
  {
    icon: "❤️",
    title: "Favorile, kaldığın yerden devam et",
    body: "Beğendiğin oyunları ♥ ile favorilerine ekle; son oynadıkların otomatik hatırlanır. Her gün girerek jeton ödülü kazan!",
  },
] as const;

export function Onboarding() {
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);
  const texts = useAutoTr([
    ...STEPS.flatMap((s) => [s.title, s.body]),
    "Atla",
    "İleri",
    "Başla!",
  ]);
  const [skip, next, start] = texts.slice(STEPS.length * 2);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined;
    // Çerez bandıyla (z-100, ilk ziyaret) üst üste binmesin: onay verilene
    // kadar bekle, "oh:consent" olayı gelince göster.
    const tryOpen = () => {
      try {
        if (localStorage.getItem(KEY) || !localStorage.getItem("oh:consent")) return;
      } catch {
        return;
      }
      t = setTimeout(() => setOpen(true), 1200);
    };
    tryOpen();
    window.addEventListener("oh:consent", tryOpen);
    return () => {
      window.removeEventListener("oh:consent", tryOpen);
      if (t) clearTimeout(t);
    };
  }, []);

  function finish() {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* yoksay */
    }
    setOpen(false);
  }

  if (!open) return null;

  const s = STEPS[step];
  const last = step === STEPS.length - 1;

  return (
    <div
      role="dialog"
      aria-label={texts[step * 2]}
      className="fixed inset-x-3 bottom-3 z-[80] sm:left-1/2 sm:right-auto sm:w-[420px] sm:-translate-x-1/2"
    >
      <div className="glass rounded-2xl p-5 shadow-glow">
        <div className="flex items-start gap-3">
          <span className="text-3xl" aria-hidden>{s.icon}</span>
          <div className="min-w-0">
            <p className="font-display text-base font-bold text-ink">{texts[step * 2]}</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-400">{texts[step * 2 + 1]}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-1.5" aria-hidden>
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${i === step ? "w-5 bg-neon" : "w-1.5 bg-slate-700"}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={finish} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-ink">
              {skip}
            </button>
            <button
              onClick={() => (last ? finish() : setStep(step + 1))}
              className="btn-primary px-4 py-1.5 text-xs"
            >
              {last ? start : next}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Consent = { essential: true; analytics: boolean; ads: boolean };
const KEY = "oh:consent";

/**
 * Site ilk açıldığında çıkan çerez onay pop-up'ı.
 * Zorunlu çerezler her zaman açıktır; analitik ve reklam çerezleri opsiyoneldir.
 * Seçim "oh:consent" anahtarında saklanır → /gizlilik-tercihleri ile aynı depo.
 */
export function CookieConsent() {
  const [show, setShow] = useState(false);
  const [custom, setCustom] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [ads, setAds] = useState(true);

  useEffect(() => {
    // Seçim daha önce yapıldıysa gösterme (SSR/client uyuşmazlığını önlemek için
    // sadece mount sonrası karar veriyoruz).
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  function save(c: Consent) {
    try {
      localStorage.setItem(KEY, JSON.stringify(c));
      window.dispatchEvent(new Event("oh:consent"));
    } catch {
      /* yoksay */
    }
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] p-3 sm:p-4">
      <div className="container-x">
        <div className="card-base mx-auto max-w-4xl border-neon/30 p-5 shadow-glow">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🍪</span>
            <div className="flex-1">
              <h2 className="font-display text-lg font-bold text-white">Çerez Tercihleri</h2>
              <p className="mt-1 text-sm text-slate-400">
                Sitenin çalışması için <strong className="text-slate-200">zorunlu çerezleri</strong>{" "}
                kullanıyoruz. Ayrıca izin verirsen ölçümleme ve kişiselleştirilmiş reklam
                çerezlerini de kullanırız. Ayrıntılar için{" "}
                <Link href="/veri-koruma" className="text-neon hover:underline">Veri Koruma Kuralları</Link>.
              </p>

              {custom && (
                <div className="mt-4 space-y-2">
                  <Toggle label="Zorunlu çerezler" desc="Temel işlevler, güvenlik. Kapatılamaz." checked disabled />
                  <Toggle
                    label="Ölçümleme / Analitik"
                    desc="Kullanımı anonim ölçüp deneyimi iyileştirir."
                    checked={analytics}
                    onChange={setAnalytics}
                  />
                  <Toggle
                    label="Kişiselleştirilmiş reklamlar"
                    desc="Reklam ağlarının ilgi alanına göre reklam göstermesine izin verir."
                    checked={ads}
                    onChange={setAds}
                  />
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => save({ essential: true, analytics: true, ads: true })}
                  className="btn-primary py-2 text-xs"
                >
                  Tümünü Kabul Et
                </button>
                <button
                  onClick={() => save({ essential: true, analytics: false, ads: false })}
                  className="btn-ghost py-2 text-xs"
                >
                  Sadece Zorunlu (Reddet)
                </button>
                {custom ? (
                  <button
                    onClick={() => save({ essential: true, analytics, ads })}
                    className="btn-ghost border-neon py-2 text-xs text-neon"
                  >
                    Seçimi Kaydet
                  </button>
                ) : (
                  <button onClick={() => setCustom(true)} className="btn-ghost py-2 text-xs">
                    Özelleştir
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Toggle({
  label,
  desc,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-line bg-base/40 p-3">
      <div>
        <div className="text-sm font-semibold text-white">{label}</div>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        aria-pressed={checked}
        className={`mt-0.5 h-6 w-11 shrink-0 rounded-full p-1 transition ${checked ? "bg-neon" : "bg-white/10"} ${disabled ? "opacity-60" : ""}`}
      >
        <span className={`block h-4 w-4 rounded-full bg-base transition ${checked ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
}

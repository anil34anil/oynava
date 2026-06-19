"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Consent = { essential: true; analytics: boolean; ads: boolean };
const KEY = "oh:consent";

export default function PrivacyManagerPage() {
  const [c, setC] = useState<Consent>({ essential: true, analytics: false, ads: false });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY);
      if (v) setC({ ...JSON.parse(v), essential: true });
    } catch {
      /* yoksay */
    }
  }, []);

  function persist(next: Consent) {
    setC(next);
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("oh:consent"));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const Row = ({
    title,
    desc,
    checked,
    disabled,
    onChange,
  }: {
    title: string;
    desc: string;
    checked: boolean;
    disabled?: boolean;
    onChange?: (v: boolean) => void;
  }) => (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-line bg-card p-4">
      <div>
        <div className="font-display font-semibold text-white">{title}</div>
        <p className="mt-1 text-sm text-slate-400">{desc}</p>
      </div>
      <button
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={`mt-1 h-7 w-12 shrink-0 rounded-full p-1 transition ${
          checked ? "bg-neon" : "bg-white/10"
        } ${disabled ? "opacity-60" : ""}`}
        aria-pressed={checked}
      >
        <span
          className={`block h-5 w-5 rounded-full bg-base transition ${checked ? "translate-x-5" : ""}`}
        />
      </button>
    </div>
  );

  return (
    <div className="container-x max-w-3xl py-8">
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:text-neon">Ana Sayfa</Link> / Gizlilik Tercihleri
      </nav>
      <h1 className="font-display text-3xl font-black text-white neon-text">Gizlilik Tercihleri</h1>
      <p className="mt-4 text-slate-300">
        Çerez ve veri kullanımı tercihlerini buradan yönetebilirsin. Seçimlerin bu
        cihazda saklanır. Ayrıntılar için{" "}
        <Link href="/veri-koruma" className="text-neon hover:underline">Veri Koruma Kuralları</Link>.
      </p>

      <div className="mt-6 space-y-3">
        <Row
          title="Zorunlu çerezler"
          desc="Sitenin temel çalışması için gereklidir (oturum, tercihler, güvenlik). Kapatılamaz."
          checked
          disabled
        />
        <Row
          title="Ölçümleme / Analitik"
          desc="Site kullanımını anonim olarak ölçüp deneyimi iyileştirmemize yardımcı olur."
          checked={c.analytics}
          onChange={(v) => persist({ ...c, analytics: v })}
        />
        <Row
          title="Kişiselleştirilmiş reklamlar"
          desc="Reklam ağlarının (örn. Google AdSense) sana daha ilgili reklamlar göstermesine izin verir. Kapatırsan genel reklamlar gösterilir."
          checked={c.ads}
          onChange={(v) => persist({ ...c, ads: v })}
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={() => persist({ essential: true, analytics: true, ads: true })} className="btn-primary">
          Tümünü Kabul Et
        </button>
        <button onClick={() => persist({ essential: true, analytics: false, ads: false })} className="btn-ghost">
          Tümünü Reddet
        </button>
      </div>

      {saved && <p className="mt-4 text-sm text-neon">✓ Tercihlerin kaydedildi.</p>}

      <p className="mt-8 text-xs text-slate-600">
        Not: Kişiselleştirilmiş reklamların tam yasal yönetimi için yayına geçişte bir
        onay yönetim platformu (CMP) entegre edilmesi önerilir (örn. Google'ın CMP'si).
      </p>
    </div>
  );
}

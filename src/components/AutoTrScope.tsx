"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "@/lib/useLocaleClient";
import { DEFAULT_LOCALE } from "@/lib/i18n";

/**
 * İçindeki Türkçe metin düğümlerini (DOM) geçerli dile otomatik çevirir (/api/i18n).
 * Tek tek string sarmadan bütün bir sayfa/bölümü çevirmek için kullanılır.
 * Inputların value'larına dokunmaz; yalnızca görünür metinleri çevirir.
 */
export function AutoTrScope({ children, className }: { children: React.ReactNode; className?: string }) {
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (locale === DEFAULT_LOCALE || !ref.current) return;
    const walker = document.createTreeWalker(ref.current, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    const texts: string[] = [];
    while (walker.nextNode()) {
      const n = walker.currentNode as Text;
      const parent = n.parentElement?.tagName;
      if (parent === "SCRIPT" || parent === "STYLE") continue;
      const s = (n.nodeValue || "").trim();
      if (s.length > 1 && /[a-zçğıöşü]/i.test(s)) {
        nodes.push(n);
        texts.push(s);
      }
    }
    if (!texts.length) return;
    let alive = true;
    fetch("/api/i18n", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: locale, q: texts }),
    })
      .then((r) => r.json())
      .then((d: { t: string[] }) => {
        if (!alive) return;
        nodes.forEach((n, i) => {
          if (d.t?.[i] && n.nodeValue) n.nodeValue = n.nodeValue.replace(texts[i], d.t[i]);
        });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [locale]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

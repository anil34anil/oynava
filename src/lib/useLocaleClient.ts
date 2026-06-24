"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { DEFAULT_LOCALE, isLocale, localePath, type Locale, t as tBase } from "./i18n";

// İstemci çeviri önbelleği (oturum boyu) — `${locale}${tr}` → çeviri
const trCache = new Map<string, string>();

/**
 * Türkçe metinleri geçerli dile otomatik çevirir (API + Redis önbellekli).
 * tr ise olduğu gibi döner; diğer dillerde önce Türkçe gösterip sonra çeviriyle değişir.
 */
export function useAutoTr(strings: string[]): string[] {
  const locale = useLocale();
  const key = strings.join("");
  const [out, setOut] = useState<string[]>(strings);

  useEffect(() => {
    if (locale === DEFAULT_LOCALE) {
      setOut(strings);
      return;
    }
    const resolve = () => strings.map((s) => trCache.get(`${locale}${s}`) ?? s);
    const need = strings.filter((s) => s && !trCache.has(`${locale}${s}`));
    if (need.length === 0) {
      setOut(resolve());
      return;
    }
    let alive = true;
    fetch("/api/i18n", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: locale, q: need }),
    })
      .then((r) => r.json())
      .then((d: { t: string[] }) => {
        need.forEach((s, i) => trCache.set(`${locale}${s}`, d.t?.[i] ?? s));
        if (alive) setOut(resolve());
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, key]);

  return locale === DEFAULT_LOCALE ? strings : out;
}

/** İstemci tarafında geçerli dili URL yolundan okur (/en/... → en). */
export function useLocale(): Locale {
  const pathname = usePathname() || "/";
  const seg = pathname.split("/")[1];
  return isLocale(seg) ? seg : DEFAULT_LOCALE;
}

/** Bir yolu geçerli dile göre önekler (tr → öneksiz). */
export const localizedHref = localePath;

/** İstemci bileşenleri için çeviri kısayolu. */
export function useT() {
  const locale = useLocale();
  return {
    locale,
    t: (key: string) => tBase(locale, key),
    href: (path: string) => localizedHref(path, locale),
  };
}

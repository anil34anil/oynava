"use client";

import { usePathname } from "next/navigation";
import { DEFAULT_LOCALE, isLocale, type Locale, t as tBase } from "./i18n";

/** İstemci tarafında geçerli dili URL yolundan okur (/en/... → en). */
export function useLocale(): Locale {
  const pathname = usePathname() || "/";
  const seg = pathname.split("/")[1];
  return isLocale(seg) ? seg : DEFAULT_LOCALE;
}

/** Bir yolu geçerli dile göre önekler (tr → öneksiz). */
export function localizedHref(path: string, locale: string): string {
  if (locale === DEFAULT_LOCALE) return path;
  if (path === "/") return `/${locale}`;
  return `/${locale}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** İstemci bileşenleri için çeviri kısayolu. */
export function useT() {
  const locale = useLocale();
  return {
    locale,
    t: (key: string) => tBase(locale, key),
    href: (path: string) => localizedHref(path, locale),
  };
}

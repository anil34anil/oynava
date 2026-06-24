"use client";

import { usePathname } from "next/navigation";
import { DEFAULT_LOCALE, isLocale, localePath, type Locale, t as tBase } from "./i18n";

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

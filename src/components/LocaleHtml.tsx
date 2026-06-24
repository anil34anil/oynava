"use client";

import { useEffect } from "react";
import { useLocale } from "@/lib/useLocaleClient";
import { localeDir } from "@/lib/i18n";

/** <html lang/dir> değerlerini geçerli dile göre ayarlar (Arapça için RTL). */
export function LocaleHtml() {
  const locale = useLocale();
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = localeDir(locale);
  }, [locale]);
  return null;
}

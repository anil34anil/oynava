import { NextRequest, NextResponse } from "next/server";
import { LOCALE_CODES, DEFAULT_LOCALE } from "@/lib/i18n";

const NON_DEFAULT = LOCALE_CODES.filter((l) => l !== DEFAULT_LOCALE);
const COOKIE = "oh_locale";

/**
 * Çoklu dil — TR VARSAYILAN ve SABİT. Öneksiz yol HER ZAMAN TR'dir.
 *  - /en, /es … → önek soyulur, `x-locale` header + cookie (hatırlama için) set edilir.
 *  - /tr/... → öneksiz kanonik adrese yönlendirilir.
 *  - Öneksiz yol → HER ZAMAN TR. Cookie'ye göre geri yönlendirme YOK → dil asla kaymaz.
 *  Diğer diller yalnızca /xx önekli adreslerde geçerlidir (dil değiştiriciden gelir).
 *  Otomatik dil algılama da YOK → ilk ziyaret hep TR.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const seg = pathname.split("/")[1];

  // 1) Bilinen dil öneki → soy + header/cookie
  if (NON_DEFAULT.includes(seg as (typeof NON_DEFAULT)[number])) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.slice(seg.length + 1) || "/";
    const headers = new Headers(req.headers);
    headers.set("x-locale", seg);
    const res = NextResponse.rewrite(url, { request: { headers } });
    res.cookies.set(COOKIE, seg, { path: "/", maxAge: 31536000, sameSite: "lax" });
    return res;
  }

  // 2) /tr/... → kanonik (öneksiz)
  if (seg === DEFAULT_LOCALE) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.slice(DEFAULT_LOCALE.length + 1) || "/";
    return NextResponse.redirect(url);
  }

  // 3) Öneksiz yol → varsayılan TR (cookie ile geri yönlendirme yok → dil sabit kalır)
  return NextResponse.next();
}

export const config = {
  // Middleware YALNIZCA dil önekli yollarda çalışır (/en, /es/... ve kanonikleştirilecek /tr).
  // Öneksiz TR yolları (trafiğin ~tamamı) middleware'i HİÇ tetiklemez — zaten sadece
  // next() dönüyordu → gereksiz Function/Edge çağrısı ortadan kalkar (Netlify compute tasarrufu).
  // NOT: Bu liste i18n.ts'teki LOCALE_CODES ile senkron tutulmalı (matcher statik olmalı, dinamik olamaz).
  matcher: [
    "/(en|nl|es|ko|id|az|ar|tr)",
    "/(en|nl|es|ko|id|az|ar|tr)/:path*",
  ],
};

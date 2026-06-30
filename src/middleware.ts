import { NextRequest, NextResponse } from "next/server";
import { LOCALE_CODES, DEFAULT_LOCALE, isLocale } from "@/lib/i18n";

const NON_DEFAULT = LOCALE_CODES.filter((l) => l !== DEFAULT_LOCALE);
const COOKIE = "oh_locale";

/**
 * Çoklu dil yönlendirmesi — TR VARSAYILAN, otomatik dil algılama YOK.
 *  - /en, /es … → önek soyulur, sayfa render; `x-locale` header + cookie set edilir.
 *  - /tr/... → öneksiz kanonik adrese yönlendirilir.
 *  - Öneksiz yol + non-tr cookie → kullanıcının SEÇTİĞİ dilde tutmak için /{dil} adresine.
 *  - İlk ziyaret → HER ZAMAN TR (öneksiz). Dil yalnızca kullanıcı bizzat seçerse değişir.
 *    (Telefon/tarayıcı diline göre otomatik yönlendirme kaldırıldı.)
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

  // 3) Öneksiz yol — kullanıcı bir dil SEÇTİYSE (cookie) orada tut
  const cookie = req.cookies.get(COOKIE)?.value;
  if (cookie && cookie !== DEFAULT_LOCALE && isLocale(cookie)) {
    const url = req.nextUrl.clone();
    url.pathname = `/${cookie}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // _next, api, admin ve dosya uzantılı istekler hariç
  matcher: ["/((?!_next|api|admin|.*\\.).*)"],
};

import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, checkPassword, tokenForPassword } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "ADMIN_PASSWORD ayarlanmamış" }, { status: 500 });
  }
  if (!password || !checkPassword(password)) {
    return NextResponse.json({ error: "Hatalı şifre" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, tokenForPassword(password), {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}

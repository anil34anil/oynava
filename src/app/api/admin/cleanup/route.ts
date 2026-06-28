import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { flushTranslationCache } from "@/lib/kv";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/cleanup → çeviri önbelleğini (oh:tr:*) siler, Redis'te yer açar.
 * Sadece admin (cookie) erişebilir. Dolu (noeviction) Redis'te bile çalışır (DEL boşaltır).
 */
export async function GET() {
  if (!isAdminRequest()) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const deleted = await flushTranslationCache();
  return NextResponse.json({ ok: true, deleted, message: `${deleted} çeviri önbellek anahtarı silindi, Redis'te yer açıldı.` });
}

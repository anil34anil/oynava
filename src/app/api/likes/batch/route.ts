import { NextRequest, NextResponse } from "next/server";
import { getReactions } from "@/lib/kv";

const UID_COOKIE = "oh_uid";

/**
 * POST /api/likes/batch  body: { ids: string[] }
 * Birden çok oyunun reaksiyonunu TEK istekte döner → liste sayfalarındaki yüzlerce
 * kart için tek tek istek yerine tek fonksiyon çağrısı (Vercel CPU/invocation tasarrufu).
 */
export async function POST(req: NextRequest) {
  const uid = req.cookies.get(UID_COOKIE)?.value;
  const { ids } = (await req.json().catch(() => ({}))) as { ids?: string[] };
  if (!Array.isArray(ids) || ids.length === 0) return NextResponse.json({});
  const uniq = [...new Set(ids)].slice(0, 300);
  const entries = await Promise.all(uniq.map(async (id) => [id, await getReactions(id, uid)] as const));
  return NextResponse.json(Object.fromEntries(entries));
}

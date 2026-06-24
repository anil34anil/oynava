import { NextRequest, NextResponse } from "next/server";
import { translateText } from "@/lib/translate";

/**
 * POST /api/i18n  body: { to: string, q: string[], from?: string }
 * İstemci bileşenlerinin Türkçe metinlerini hedef dile çevirir (Redis önbellekli).
 */
export async function POST(req: NextRequest) {
  const { to, q, from } = (await req.json().catch(() => ({}))) as {
    to?: string;
    q?: string[];
    from?: string;
  };
  if (!to || !Array.isArray(q)) return NextResponse.json({ t: [] });
  const src = from || "tr";
  const t = await Promise.all(q.map((s) => translateText(String(s ?? ""), to, src)));
  return NextResponse.json({ t });
}

import { NextRequest, NextResponse } from "next/server";
import { incrPlay } from "@/lib/kv";

/** POST /api/play/:id → oyun başlatıldığında oynanma sayacını artırır. */
export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  await incrPlay(params.id);
  return NextResponse.json({ ok: true });
}

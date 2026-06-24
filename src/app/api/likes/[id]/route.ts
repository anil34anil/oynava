import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getReactions, toggleReaction } from "@/lib/kv";

const UID_COOKIE = "oh_uid";

function readUid(req: NextRequest): string | undefined {
  return req.cookies.get(UID_COOKIE)?.value;
}

/** GET /api/likes/:id → { count, dislikes, liked, disliked } (anonim ziyaretçiler dahil) */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const uid = readUid(req);
  const state = await getReactions(params.id, uid);
  return NextResponse.json(state);
}

/**
 * POST /api/likes/:id  body: { type?: "like" | "dislike" }
 * Beğeni/beğenmemeyi aç-kapat (karşılıklı dışlayıcı), güncel reaksiyonları döner.
 */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  let uid = readUid(req);
  let isNewUid = false;
  if (!uid) {
    uid = randomUUID();
    isNewUid = true;
  }

  const body = (await req.json().catch(() => ({}))) as { type?: "like" | "dislike" };
  const type = body.type === "dislike" ? "dislike" : "like";

  const state = await toggleReaction(params.id, uid, type);
  const res = NextResponse.json(state);
  if (isNewUid) {
    res.cookies.set(UID_COOKIE, uid, {
      maxAge: 60 * 60 * 24 * 365 * 5,
      sameSite: "lax",
      path: "/",
    });
  }
  return res;
}

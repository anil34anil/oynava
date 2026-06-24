import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getReactions, toggleReaction, logVote } from "@/lib/kv";

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

  // IP + ülke (Vercel başlıkları) ile oy olayını günlüğe yaz
  const ip =
    (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "";
  const country = req.headers.get("x-vercel-ip-country") || "";
  const active = type === "like" ? state.liked : state.disliked;
  await logVote({ gameId: params.id, type, active, ip, country });

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

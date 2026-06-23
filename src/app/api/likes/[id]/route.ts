import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getLikeState, toggleLike } from "@/lib/kv";

const UID_COOKIE = "oh_uid";

function readUid(req: NextRequest): string | undefined {
  return req.cookies.get(UID_COOKIE)?.value;
}

/** GET /api/likes/:id → { count, liked } (giriş yapmamış ziyaretçiler de kullanır) */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const uid = readUid(req);
  const state = await getLikeState(params.id, uid);
  return NextResponse.json(state);
}

/** POST /api/likes/:id → beğeniyi aç/kapat (toggle), { count, liked } döner */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  let uid = readUid(req);
  let isNewUid = false;
  if (!uid) {
    uid = randomUUID();
    isNewUid = true;
  }

  const state = await toggleLike(params.id, uid);
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

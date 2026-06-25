import { NextRequest, NextResponse } from "next/server";
import { getGames } from "@/lib/games";
import { slugifyTitle } from "@/lib/catalog";

/** GET /rastgele → rastgele bir oyun sayfasına yönlendirir (ArcadeCMS "random game"). */
export async function GET(req: NextRequest) {
  const games = await getGames();
  if (!games.length) return NextResponse.redirect(new URL("/oyunlar", req.nextUrl.origin));
  const g = games[Math.floor(Math.random() * games.length)];
  return NextResponse.redirect(new URL(`/oyun/${g.id}/${slugifyTitle(g.title)}`, req.nextUrl.origin), { status: 307 });
}

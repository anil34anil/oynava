import { NextRequest, NextResponse } from "next/server";
import { getGames } from "@/lib/games";

export const revalidate = 3600;

/** GET /api/games?ids=12,34  → verilen id'lere ait oyunlar (favori/son oynanan için) */
export async function GET(req: NextRequest) {
  const idsParam = req.nextUrl.searchParams.get("ids");
  const games = await getGames();

  if (idsParam) {
    const ids = idsParam.split(",").filter(Boolean);
    const byId = new Map(games.map((g) => [g.id, g]));
    // İstenen sırayı koru
    const result = ids.map((id) => byId.get(id)).filter(Boolean);
    return NextResponse.json(result);
  }

  return NextResponse.json(games.slice(0, 100));
}

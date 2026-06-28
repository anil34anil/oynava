import { NextResponse } from "next/server";
import { getGames } from "@/lib/games";

// Edge'de cache'lenir (ISR) → kullanıcı başına en fazla 1 istek, fonksiyon maliyeti ~0.
export const revalidate = 3600;

/**
 * GET /api/search-index → tüm oyunların ince listesi [{i:id, t:title, c:category}].
 * Anlık arama önerileri (autocomplete) için istemci bunu BİR kez çeker ve yerelde filtreler.
 */
export async function GET() {
  const games = await getGames();
  const index = games.map((g) => ({ i: g.id, t: g.title, c: g.category }));
  return NextResponse.json(index, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

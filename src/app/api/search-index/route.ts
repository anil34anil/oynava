import { NextResponse } from "next/server";
import { getGames } from "@/lib/games";

// Netlify statik route handler'ı (/api/*) sunmuyor → fonksiyon olarak çalışsın.
// CDN cache header'ı ile yine edge'den servis edilir; fonksiyon ~saatte 1 çalışır.
export const dynamic = "force-dynamic";

/**
 * GET /api/search-index → tüm oyunların ince listesi [{i:id, t:title, c:category}].
 * Anlık arama önerileri (autocomplete) için istemci bunu BİR kez çeker ve yerelde filtreler.
 */
export async function GET() {
  const games = await getGames();
  const index = games.map((g) => ({ i: g.id, t: g.title, c: g.category }));
  return NextResponse.json(index, {
    headers: {
      "Cache-Control": "public, max-age=600, s-maxage=3600, stale-while-revalidate=86400",
      "Netlify-CDN-Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400, durable",
    },
  });
}

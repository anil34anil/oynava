import type { Metadata } from "next";
import Link from "next/link";
import { isAdminRequest } from "@/lib/adminAuth";
import { getAllVotes } from "@/lib/kv";
import { getGames, slugifyTitle } from "@/lib/games";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";

export const metadata: Metadata = { robots: { index: false, follow: false } };
export const revalidate = 0;

export default async function AdminVotesPage() {
  if (!isAdminRequest()) {
    return (
      <div className="container-x">
        <AdminLoginForm />
      </div>
    );
  }

  const votes = await getAllVotes();
  const games = await getGames();
  const byId = new Map(games.map((g) => [g.id, g]));

  return (
    <div className="container-x space-y-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-black text-ink">👍 Oylanan Oyunlar</h1>
        <AdminLogoutButton />
      </div>

      {votes.length === 0 ? (
        <p className="text-slate-400">Henüz beğeni yok.</p>
      ) : (
        <div className="card-base overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-slate-400">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Oyun</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3 text-right">Beğeni</th>
              </tr>
            </thead>
            <tbody>
              {votes.map((v, i) => {
                const game = byId.get(v.gameId);
                return (
                  <tr key={v.gameId} className="border-b border-line/50">
                    <td className="px-4 py-3 text-slate-500">{i + 1}</td>
                    <td className="px-4 py-3 font-semibold text-ink">
                      {game ? (
                        <Link href={`/oyun/${game.id}/${slugifyTitle(game.title)}`} className="hover:text-neon">
                          {game.title}
                        </Link>
                      ) : (
                        v.gameId
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-400">{game?.category ?? "—"}</td>
                    <td className="px-4 py-3 text-right font-display text-neon">{v.count}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

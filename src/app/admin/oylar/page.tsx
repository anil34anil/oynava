import type { Metadata } from "next";
import Link from "next/link";
import { isAdminRequest } from "@/lib/adminAuth";
import { getAllVotes, getVotesLog } from "@/lib/kv";
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

  const [votes, log, games] = await Promise.all([getAllVotes(), getVotesLog(300), getGames()]);
  const byId = new Map(games.map((g) => [g.id, g]));
  const flag = (cc: string) => (cc && cc.length === 2 ? String.fromCodePoint(...[...cc.toUpperCase()].map((c) => 127397 + c.charCodeAt(0))) : "");
  const fmtTime = (ts: number) =>
    new Date(ts).toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="container-x space-y-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-black text-ink">👍👎 Oylanan Oyunlar</h1>
        <AdminLogoutButton />
      </div>

      {votes.length === 0 ? (
        <p className="text-slate-400">Henüz oy yok.</p>
      ) : (
        <div className="card-base overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-slate-400">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Oyun</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3 text-right">👍 Beğeni</th>
                <th className="px-4 py-3 text-right">👎 Beğenmeme</th>
                <th className="px-4 py-3 text-right">Net</th>
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
                    <td className="px-4 py-3 text-right font-display text-neon">{v.likes}</td>
                    <td className="px-4 py-3 text-right font-display text-neon-pink">{v.dislikes}</td>
                    <td className="px-4 py-3 text-right font-display text-slate-300">{v.likes - v.dislikes}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Oy günlüğü: IP + ülke */}
      <h2 className="pt-4 font-display text-xl font-black text-ink">🌍 Son Oylar (IP + Ülke)</h2>
      {log.length === 0 ? (
        <p className="text-slate-400">
          Henüz kayıtlı oy olayı yok. (Bu özellik eklendikten sonraki oylar burada IP + ülkeyle listelenir.)
        </p>
      ) : (
        <div className="card-base overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-slate-400">
              <tr>
                <th className="px-4 py-3">Zaman</th>
                <th className="px-4 py-3">Oyun</th>
                <th className="px-4 py-3">Oy</th>
                <th className="px-4 py-3">Ülke</th>
                <th className="px-4 py-3">IP</th>
              </tr>
            </thead>
            <tbody>
              {log.map((e, i) => {
                const game = byId.get(e.gameId);
                return (
                  <tr key={i} className="border-b border-line/50">
                    <td className="px-4 py-3 text-slate-500">{fmtTime(e.ts)}</td>
                    <td className="px-4 py-3 text-ink">{game?.title ?? e.gameId}</td>
                    <td className={`px-4 py-3 ${e.type === "like" ? "text-neon" : "text-neon-pink"}`}>
                      {e.type === "like" ? "👍 beğeni" : "👎 beğenmeme"}
                      {e.active ? "" : " (geri alındı)"}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {e.country ? `${flag(e.country)} ${e.country}` : "—"}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-400">{e.ip || "—"}</td>
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

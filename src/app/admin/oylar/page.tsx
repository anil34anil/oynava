import type { Metadata } from "next";
import Link from "next/link";
import { isAdminRequest } from "@/lib/adminAuth";
import { getAllVotes, getVotesLog, getTopPlayed } from "@/lib/kv";
import { getGames, slugifyTitle } from "@/lib/games";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";

export const metadata: Metadata = { robots: { index: false, follow: false } };
export const revalidate = 0;

export default async function AdminPanelPage() {
  if (!isAdminRequest()) {
    return (
      <div className="container-x">
        <AdminLoginForm />
      </div>
    );
  }

  const [played, votes, log, games] = await Promise.all([
    getTopPlayed(100),
    getAllVotes(),
    getVotesLog(300),
    getGames(),
  ]);
  const byId = new Map(games.map((g) => [g.id, g]));
  const flag = (cc: string) =>
    cc && cc.length === 2 ? String.fromCodePoint(...[...cc.toUpperCase()].map((c) => 127397 + c.charCodeAt(0))) : "";
  const fmtTime = (ts: number) =>
    new Date(ts).toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

  // Özet istatistikler
  const totalPlays = played.reduce((s, p) => s + p.plays, 0);
  const totalLikes = votes.reduce((s, v) => s + v.likes, 0);
  const totalDislikes = votes.reduce((s, v) => s + v.dislikes, 0);

  const Stat = ({ label, value, tone = "text-ink" }: { label: string; value: string | number; tone?: string }) => (
    <div className="card-base p-4">
      <div className="text-xs uppercase tracking-wider text-slate-500">{label}</div>
      <div className={`mt-1 font-display text-2xl font-black ${tone}`}>{value}</div>
    </div>
  );

  return (
    <div className="container-x space-y-8 py-8">
      {/* Başlık + aksiyonlar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-black text-ink">🎮 Yönetim Paneli</h1>
        <div className="flex items-center gap-2">
          <a href="/api/admin/cleanup" className="btn-ghost py-2 text-xs" title="Çeviri önbelleğini siler, dolu Redis'te yer açar">
            🧹 Redis temizle
          </a>
          <AdminLogoutButton />
        </div>
      </div>

      {/* Özet kartları */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Toplam Oynanma" value={totalPlays.toLocaleString("tr-TR")} tone="text-neon" />
        <Stat label="Oylanan Oyun" value={votes.length.toLocaleString("tr-TR")} />
        <Stat label="Toplam 👍" value={totalLikes.toLocaleString("tr-TR")} tone="text-neon" />
        <Stat label="Toplam 👎" value={totalDislikes.toLocaleString("tr-TR")} tone="text-neon-pink" />
      </div>

      {/* 1) En çok oynanan oyunlar */}
      <section className="space-y-3">
        <h2 className="font-display text-xl font-black text-ink">🔥 En Çok Oynanan Oyunlar</h2>
        {played.length === 0 ? (
          <p className="text-slate-400">Henüz oynanma verisi yok.</p>
        ) : (
          <div className="card-base overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line text-slate-400">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Oyun</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3 text-right">Oynanma</th>
                </tr>
              </thead>
              <tbody>
                {played.map((p, i) => {
                  const game = byId.get(p.gameId);
                  return (
                    <tr key={p.gameId} className="border-b border-line/50">
                      <td className="px-4 py-3 text-slate-500">{i + 1}</td>
                      <td className="px-4 py-3 font-semibold text-ink">
                        {game ? (
                          <Link href={`/oyun/${game.id}/${slugifyTitle(game.title)}`} className="hover:text-neon">
                            {game.title}
                          </Link>
                        ) : (
                          p.gameId
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-400">{game?.category ?? "—"}</td>
                      <td className="px-4 py-3 text-right font-display text-neon">{p.plays.toLocaleString("tr-TR")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 2) Oylanan oyunlar */}
      <section className="space-y-3">
        <h2 className="font-display text-xl font-black text-ink">👍👎 Oylanan Oyunlar</h2>
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
                  <th className="px-4 py-3 text-right">👍</th>
                  <th className="px-4 py-3 text-right">👎</th>
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
      </section>

      {/* 3) Oy günlüğü: IP + ülke */}
      <section className="space-y-3">
        <h2 className="font-display text-xl font-black text-ink">🌍 Son Oylar (IP + Ülke)</h2>
        {log.length === 0 ? (
          <p className="text-slate-400">Henüz kayıtlı oy olayı yok.</p>
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
                      <td className="px-4 py-3 text-slate-300">{e.country ? `${flag(e.country)} ${e.country}` : "—"}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-400">{e.ip || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

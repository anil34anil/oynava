import type { Metadata } from "next";
import { getGames } from "@/lib/games";
import { InfiniteGrid } from "@/components/InfiniteGrid";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/localize";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Oyunlar — Binlerce Ücretsiz Oyun Oyna",
  description: "Binlerce ücretsiz oyun tek sayfada! Aksiyon, yarış, bulmaca ve daha fazlası — sonsuz kaydır, indirmeden anında oyun oyna.",
  alternates: { canonical: "/oyunlar" },
};

export default async function AllGamesPage() {
  const locale = getLocale();
  const games = await getGames();
  return (
    <div className="container-x space-y-6 py-6">
      <div className="flex items-center gap-3">
        <h1 className="font-display text-3xl font-black text-ink neon-text">{t(locale, "nav.all")}</h1>
        <span className="rounded-full border border-line px-3 py-1 text-sm text-slate-400">
          {games.length} {t(locale, "common.gamesCount")}
        </span>
      </div>
      <InfiniteGrid games={games} />
    </div>
  );
}

/**
 * Medya seçici — spesifikasyondaki kademeli seçim mantığı:
 *   Preview Video > Trailer > Gameplay Video > Animated Thumbnail > GIF > Thumbnail
 * "İlk bulunanı kullanma" → tüm adaylar toplanır, önce kademe (tier), sonra
 * kalite puanına göre sıralanır; en iyisi seçilir.
 *
 * Duplicate-aware: bir oyun başka sağlayıcılarda da varsa (bkz. duplicates.mts),
 * grup içindeki TÜM adaylar bir arada değerlendirilir ve içerik yalnızca grubun
 * "kanonik" (en iyi medyaya sahip) üyesi için üretilir — diğerleri
 * skipped_duplicate olarak işaretlenir (aynı içerik iki kez üretilmesin diye).
 */
import type { CatalogGame } from "../catalogSource.mts";
import type { MediaProvider } from "../providers/types.mts";
import type { MediaCandidate, ProviderId, SelectedMedia } from "../types.mts";
import { tierRank } from "../types.mts";

function bestCandidate(candidates: MediaCandidate[]): MediaCandidate | null {
  if (!candidates.length) return null;
  return [...candidates].sort(
    (a, b) => tierRank(a.tier) - tierRank(b.tier) || b.qualityScore - a.qualityScore,
  )[0];
}

export function selectMedia(
  game: CatalogGame,
  registry: Record<ProviderId, MediaProvider>,
  duplicateGroups: Map<string, CatalogGame[]>,
): SelectedMedia {
  const group = duplicateGroups.get(game.id);

  if (group && group.length > 1) {
    // Grubun tamamı için adayları topla, en iyisini bul.
    const withCandidates = group.map((g) => ({
      game: g,
      candidates: registry[g.providerId].getCandidates(g),
    }));
    const ranked = withCandidates
      .map((w) => ({ ...w, best: bestCandidate(w.candidates) }))
      .filter((w) => w.best)
      .sort(
        (a, b) =>
          tierRank(a.best!.tier) - tierRank(b.best!.tier) || b.best!.qualityScore - a.best!.qualityScore,
      );
    const canonical = ranked[0];
    if (!canonical) {
      return { game, providerId: game.providerId, candidate: null };
    }
    if (canonical.game.id !== game.id) {
      // Bu oyun grubun kanonik üyesi değil → içerik üretme, kanoniği işaret et.
      return {
        game,
        providerId: game.providerId,
        candidate: null,
        duplicateOf: [canonical.game.id],
      };
    }
    return {
      game,
      providerId: canonical.game.providerId,
      candidate: canonical.best,
      duplicateOf: group.filter((g) => g.id !== game.id).map((g) => g.id),
    };
  }

  const candidates = registry[game.providerId].getCandidates(game);
  return { game, providerId: game.providerId, candidate: bestCandidate(candidates) };
}

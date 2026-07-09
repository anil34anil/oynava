/**
 * Media Provider arayüzü — yeni bir sağlayıcı eklemek için tek yapılması gereken:
 * bu arayüzü uygulayan bir dosya yazmak + registry.mts'e bir satır eklemek.
 */
import type { CatalogGame } from "../catalogSource.mts";
import type { MediaCandidate } from "../types.mts";

export interface MediaProvider {
  id: string;
  /** Bu oyun için bulabildiği tüm medya adaylarını (varsa video, her zaman thumbnail) döndürür. */
  getCandidates(game: CatalogGame): MediaCandidate[];
}

/** Çözünürlük + kademe ağırlığından 0-100 kalite puanı hesaplar. */
export function scoreOf(
  tierWeight: number,
  width: number | undefined,
  height: number | undefined,
): number {
  const pixels = (width ?? 0) * (height ?? 0);
  // Çözünürlük katkısı en fazla +15 puan (kademe ağırlığı baskın kalsın diye sınırlı).
  const resBonus = Math.min(15, Math.round(pixels / 100000));
  return Math.min(100, tierWeight + resBonus);
}

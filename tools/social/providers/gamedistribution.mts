/**
 * GameDistribution — canlı API "Asset" dizisinde birden çok çözünürlükte thumbnail
 * sunar (1280x720'ye kadar), video/gif alanı yok (doğrulandı). En büyük asset'i
 * kullanırız — thumbnail kademesi içinde en iyi kaliteyi garantiler.
 */
import type { CatalogGame } from "../catalogSource.mts";
import type { MediaCandidate, SocialConfig } from "../types.mts";
import { scoreOf, type MediaProvider } from "./types.mts";

export function createGameDistributionProvider(config: SocialConfig): MediaProvider {
  return {
    id: "gamedistribution",
    getCandidates(game: CatalogGame): MediaCandidate[] {
      if (!game.thumb) return [];
      // games.ts seed'e yazarken 512x384'ü seçiyor; burada dosya adındaki boyut
      // ipucunu okuyup (varsa) daha isabetli bir kalite puanı üretiyoruz.
      const m = /-(\d+)x(\d+)\.jpg$/i.exec(game.thumb);
      const width = m ? Number(m[1]) : Number(game.width) || undefined;
      const height = m ? Number(m[2]) : Number(game.height) || undefined;
      return [
        {
          tier: "thumbnail",
          url: game.thumb,
          isVideo: false,
          providerId: "gamedistribution",
          width,
          height,
          qualityScore: scoreOf(config.qualityWeights.thumbnail, width, height),
        },
      ];
    },
  };
}

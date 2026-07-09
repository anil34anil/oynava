/**
 * GameMonetize — canlı feed API'si sadece `thumb` alanı döndürüyor (video/gif yok,
 * doğrulandı). Bu yüzden tek kademe: thumbnail → Ken Burns şablonuna düşer.
 */
import type { CatalogGame } from "../catalogSource.mts";
import type { MediaCandidate, SocialConfig } from "../types.mts";
import { scoreOf, type MediaProvider } from "./types.mts";

export function createGameMonetizeProvider(config: SocialConfig): MediaProvider {
  return {
    id: "gamemonetize",
    getCandidates(game: CatalogGame): MediaCandidate[] {
      if (!game.thumb) return [];
      return [
        {
          tier: "thumbnail",
          url: game.thumb,
          isVideo: false,
          providerId: "gamemonetize",
          width: Number(game.width) || undefined,
          height: Number(game.height) || undefined,
          qualityScore: scoreOf(config.qualityWeights.thumbnail, Number(game.width), Number(game.height)),
        },
      ];
    },
  };
}

/**
 * GamePix — JSON feed'i `banner_image`/`image` alanları döndürür, video/gif
 * alanı yoktur. Tek kademe: thumbnail.
 */
import type { CatalogGame } from "../catalogSource.mts";
import type { MediaCandidate, SocialConfig } from "../types.mts";
import { scoreOf, type MediaProvider } from "./types.mts";

export function createGamePixProvider(config: SocialConfig): MediaProvider {
  return {
    id: "gamepix",
    getCandidates(game: CatalogGame): MediaCandidate[] {
      if (!game.thumb) return [];
      return [
        {
          tier: "thumbnail",
          url: game.thumb,
          isVideo: false,
          providerId: "gamepix",
          width: Number(game.width) || undefined,
          height: Number(game.height) || undefined,
          qualityScore: scoreOf(config.qualityWeights.thumbnail, Number(game.width), Number(game.height)),
        },
      ];
    },
  };
}

/**
 * Oynava Originals (kendi geliştirdiğimiz oyunlar, ör. BlokKraft) — tek özel
 * durum: bu oyunlar bize ait, reklamsız ve aynı origin altında (public/originals/)
 * çalıştığı için Playwright ile GERÇEK oynanış kaydı güvenle otomatikleştirilebilir.
 * (Üçüncü taraf sağlayıcıların iframe'lerinde bu denenmiyor — geçmiş denemede
 * reklam/çapraz-origin nedeniyle güvenilir çıkmamıştı; bkz. tools/gameplay-preview.mjs.)
 *
 * capture:true olan aday, video/pipeline.mts içinde Playwright ile canlı
 * kaydedilir — burada sadece "hangi sayfa kaydedilecek" bilgisini üretiriz.
 */
import path from "node:path";
import { pathToFileURL } from "node:url";
import { projectRoot } from "../catalogSource.mts";
import type { CatalogGame } from "../catalogSource.mts";
import type { MediaCandidate, SocialConfig } from "../types.mts";
import { scoreOf, type MediaProvider } from "./types.mts";

export function createOriginalsProvider(config: SocialConfig): MediaProvider {
  return {
    id: "originals",
    getCandidates(game: CatalogGame): MediaCandidate[] {
      const out: MediaCandidate[] = [];
      if (game.url?.startsWith("/originals/")) {
        const localFile = path.join(projectRoot, "public", game.url);
        out.push({
          tier: "gameplay",
          url: pathToFileURL(localFile).href,
          isVideo: false,
          capture: true,
          providerId: "originals",
          width: config.video.width,
          height: config.video.height,
          qualityScore: scoreOf(config.qualityWeights.gameplay, config.video.width, config.video.height),
        });
      }
      if (game.thumb) {
        out.push({
          tier: "thumbnail",
          url: pathToFileURL(path.join(projectRoot, "public", game.thumb)).href,
          isVideo: false,
          providerId: "originals",
          qualityScore: scoreOf(config.qualityWeights.thumbnail, Number(game.width), Number(game.height)),
        });
      }
      return out;
    },
  };
}

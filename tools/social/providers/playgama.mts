/**
 * Playgama — tek gerçek "resmi önizleme videosu" kaynağımız (statik seed'de
 * previewVideo alanı olarak gelir: static.playgama.com/p-video/{id}/orig_length_h320.mp4).
 * Diğer üç sağlayıcının canlı API'leri hiç video alanı döndürmüyor (bu proje
 * için doğrulandı) — bu yüzden video kademesi sadece burada var.
 */
import type { CatalogGame } from "../catalogSource.mts";
import type { MediaCandidate, SocialConfig } from "../types.mts";
import { scoreOf, type MediaProvider } from "./types.mts";

export function createPlaygamaProvider(config: SocialConfig): MediaProvider {
  return {
    id: "playgama",
    getCandidates(game: CatalogGame): MediaCandidate[] {
      const out: MediaCandidate[] = [];
      if (game.previewVideo) {
        // Dosya adındaki "_h320" gibi bir ipucu varsa yükseklik tahmini yap (kalite puanı için).
        const m = /_h(\d+)\.mp4$/i.exec(game.previewVideo);
        const height = m ? Number(m[1]) : undefined;
        out.push({
          tier: "preview",
          url: game.previewVideo,
          isVideo: true,
          providerId: "playgama",
          width: height ? Math.round((height * 16) / 9) : undefined,
          height,
          qualityScore: scoreOf(config.qualityWeights.preview, height ? Math.round((height * 16) / 9) : 0, height),
        });
      }
      if (game.thumb) {
        out.push({
          tier: "thumbnail",
          url: game.thumb,
          isVideo: false,
          providerId: "playgama",
          qualityScore: scoreOf(config.qualityWeights.thumbnail, Number(game.width), Number(game.height)),
        });
      }
      return out;
    },
  };
}

/**
 * Şablon kayıt defteri — hangi medya kademesinin hangi şablonla işleneceğini
 * eşler. Yeni şablon eklemek için buraya bir satır eklemek yeterli.
 */
import type { MediaTier } from "../../types.mts";
import type { VideoTemplate } from "./types.mts";
import { kenburnsTemplate } from "./kenburns.mts";
import { clipTemplate } from "./clip.mts";

const VIDEO_TIERS = new Set<MediaTier>(["preview", "trailer", "gameplay"]);

/** Adayın kademesine göre doğru şablonu seçer: gerçek video varsa "clip", yoksa "kenburns". */
export function templateFor(tier: MediaTier): VideoTemplate {
  return VIDEO_TIERS.has(tier) ? clipTemplate : kenburnsTemplate;
}

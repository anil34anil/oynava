/**
 * Sağlayıcı kayıt defteri — YENİ BİR SAĞLAYICI EKLEMEK İÇİN:
 *  1) providers/<isim>.mts dosyasında create<İsim>Provider(config) yaz (MediaProvider uygula)
 *  2) aşağıya import + kayıt satırı ekle
 * Başka hiçbir yeri değiştirmeye gerek yok — media/selector.mts registry'i döngüyle kullanır.
 */
import type { ProviderId, SocialConfig } from "../types.mts";
import type { MediaProvider } from "./types.mts";
import { createPlaygamaProvider } from "./playgama.mts";
import { createGameMonetizeProvider } from "./gamemonetize.mts";
import { createGameDistributionProvider } from "./gamedistribution.mts";
import { createGamePixProvider } from "./gamepix.mts";
import { createOriginalsProvider } from "./originals.mts";

export function createProviderRegistry(config: SocialConfig): Record<ProviderId, MediaProvider> {
  return {
    playgama: createPlaygamaProvider(config),
    gamemonetize: createGameMonetizeProvider(config),
    gamedistribution: createGameDistributionProvider(config),
    gamepix: createGamePixProvider(config),
    originals: createOriginalsProvider(config),
  };
}

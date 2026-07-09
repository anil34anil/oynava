/**
 * Videodan en iyi kareyi seçer — kendi "en detaylı kare" skorlayıcımızı yazmak
 * yerine ffmpeg'in yerleşik `thumbnail` filtresini kullanıyoruz (histogram
 * varyansına göre bir grup kare içinden en temsili olanı seçen, bu iş için
 * tasarlanmış resmi filtre). Nihai (marka bindirilmiş) videodan kare alınır,
 * böylece oyun adı/logo zaten kare üzerinde olur — ayrı bir metin bindirme
 * adımına gerek kalmaz (kod tekrarı yok).
 *
 * Kapanış kartının (son endCardSec saniye) thumbnail'e seçilmesini önlemek
 * için tarama sadece kapanıştan önceki bölümle sınırlanır.
 */
import { runFfmpeg } from "./ffmpeg.mts";
import type { SocialConfig } from "../types.mts";

export async function extractThumbnail(
  videoPath: string,
  durationSec: number,
  config: SocialConfig,
  outFile: string,
): Promise<void> {
  const scanDuration = Math.max(1, durationSec - config.video.endCardSec);
  const frames = Math.max(1, Math.round(scanDuration * config.video.fps));
  await runFfmpeg([
    "-y",
    "-i",
    videoPath,
    "-t",
    String(scanDuration),
    "-vf",
    `thumbnail=n=${frames}`,
    "-frames:v",
    "1",
    "-update",
    "1",
    outFile,
  ]);
}

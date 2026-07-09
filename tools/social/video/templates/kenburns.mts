/**
 * Ken Burns şablonu — statik thumbnail'i yavaş pan/zoom ile "canlı" bir dikey
 * videoya çevirir. Kısa video kısaları üreten pek çok araç (Poki/CrazyGames
 * tarzı otomatik reklam kesitleri dahil) bu tekniği kullanır; üç sağlayıcımızın
 * (GameMonetize/GameDistribution/GamePix) hiçbiri video sunmadığı için (bkz.
 * providers/*.mts yorumları) kataloğun büyük çoğunluğu bu şablona düşecek.
 */
import type { TemplateInput, TemplateOutput } from "./types.mts";

export function kenburnsTemplate({ config }: TemplateInput): TemplateOutput {
  const { width: W, height: H, fps, defaultDurationSec: dur } = config.video;
  const totalFrames = fps * dur;
  // flags=lanczos: varsayılan bilinear'dan belirgin daha keskin büyütme.
  // unsharp: büyütme + video sıkıştırmasının yumuşattığı kenarları geri kazandırır.
  const filterGraph =
    `[0:v]scale=${W * 2}:${H * 2}:force_original_aspect_ratio=increase:flags=lanczos,` +
    `crop=${W * 2}:${H * 2},` +
    `zoompan=z='min(zoom+0.0015,1.5)':d=${totalFrames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=${W}x${H}:fps=${fps},` +
    `unsharp=5:5:0.8:5:5:0.0[base]`;
  return {
    inputArgs: ["-loop", "1"],
    filterGraph,
    durationSec: dur,
  };
}

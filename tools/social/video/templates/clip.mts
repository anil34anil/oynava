/**
 * Klip şablonu — gerçek bir video kaynağını (Playgama önizleme videosu veya
 * Originals oyunlarımızın Playwright kaydı) 1080x1920'ye getirir ve hedef
 * süreye uydurur. Kaynak kısaysa döngüye alınır (-stream_loop), uzunsa
 * pipeline çıktıda `-t` ile keser — böylece 20-40sn aralığı her zaman sağlanır.
 * Ses her zaman kapatılır (bkz. pipeline.mts: `-an`) — üçüncü taraf oyun sesi
 * telif/tutarlılık riski taşır.
 *
 * Kalite notu: Playgama önizleme videoları sadece 320p yükseklikte geliyor
 * (CDN dosya adı: orig_length_h320.mp4). Bunu doğrudan 1920 yüksekliğe
 * "cover" ile büyütmek (6x) belirgin bulanıklık veriyordu. Bunun yerine
 * GameCard.tsx'te zaten kullanılan tekniğin videodaki karşılığı: kaynağı
 * OLDUĞU boyutta (kırpılmadan) ortala, arkasını aynı karenin bulanık/karartılmış
 * büyütülmüş kopyasıyla doldur. Böylece hem boşluk kalmıyor hem de asıl
 * görüntü gereğinden fazla büyütülüp pikselleşmiyor.
 */
import type { TemplateInput, TemplateOutput } from "./types.mts";

export function clipTemplate({ config, sourceDurationSec }: TemplateInput): TemplateOutput {
  const { width: W, height: H, fps, defaultDurationSec: target } = config.video;
  const inputArgs: string[] = [];

  if (sourceDurationSec > 0 && sourceDurationSec < target) {
    const loops = Math.ceil(target / sourceDurationSec) - 1;
    if (loops > 0) inputArgs.push("-stream_loop", String(loops));
  }

  const filterGraph = [
    `[0:v]split=2[bgsrc][fgsrc]`,
    // Arka plan: tam kareyi kapla, bulanıklaştır + karart (asıl görüntüyü öne çıkarır).
    `[bgsrc]scale=${W}:${H}:force_original_aspect_ratio=increase:flags=lanczos,crop=${W}:${H},gblur=sigma=28,eq=brightness=-0.15[bgb]`,
    // Ön plan: kırpılmadan sığdır, keskinleştir (kaynak zaten küçükse gereksiz büyütme yapılmaz).
    `[fgsrc]scale=${W}:${H}:force_original_aspect_ratio=decrease:flags=lanczos,unsharp=5:5:0.7:5:5:0.0[fgs]`,
    `[bgb][fgs]overlay=(W-w)/2:(H-h)/2:format=auto,fps=${fps}[base]`,
  ].join(";");

  return { inputArgs, filterGraph, durationSec: target };
}

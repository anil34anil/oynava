/**
 * Video üretim hattı — bir SelectedMedia'yı alır, nihai marka bindirilmiş
 * dikey (1080x1920) mp4 + thumbnail.jpg üretir. Tek bir oyun için tüm video
 * adımlarını (medya temini → şablon → marka → kodlama → kare seçimi) bir
 * araya getiren tek yer burasıdır; queue.mts bunu her oyun için çağırır.
 */
import fs from "node:fs";
import path from "node:path";
import { CATEGORIES, slugifyTitle } from "../../../src/lib/catalog.ts";
import { cacheMedia } from "../media/cache.mts";
import { captureOriginalsGameplay } from "./capture.mts";
import { probeDurationSec, runFfmpeg, hasAudioStream } from "./ffmpeg.mts";
import { templateFor } from "./templates/registry.mts";
import { buildBrandingFilter } from "./branding.mts";
import { extractThumbnail } from "./thumbnail.mts";
import { hookFor } from "../captions/hooks.mts";
import type { SelectedMedia, SocialConfig } from "../types.mts";

function categoryLabelTr(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.tr ?? slug;
}

export type PipelineResult = {
  videoPath: string;
  thumbnailPath: string;
  durationSec: number;
};

export async function renderGameVideo(
  selected: SelectedMedia,
  config: SocialConfig,
): Promise<PipelineResult> {
  const { game, candidate } = selected;
  if (!candidate) throw new Error("Medya adayı yok");

  const localPath = candidate.capture
    ? await captureOriginalsGameplay(candidate.url, game.id, config)
    : await cacheMedia(candidate.url, config.cacheDir);

  const sourceDurationSec = candidate.isVideo || candidate.capture ? await probeDurationSec(localPath) : 0;

  // Ses: yalnızca ÜÇÜNCÜ TARAF sağlayıcı dosyalarında (capture DEĞİL) ve kaynakta
  // gerçekten bir ses akışı varsa korunur — bu dosyalar sağlayıcının (Playgama vb.)
  // resmi tanıtım klibidir, kendi sesiyle birlikte yayılım için sağlanmıştır.
  // Kendi oyunlarımızın (Originals) Playwright kaydında ses akışı hiç yakalanmaz
  // (bkz. capture.mts) — o yüzden capture=true olan kaynaklarda her zaman sessiz kalır.
  const keepAudio = !candidate.capture && candidate.isVideo && (await hasAudioStream(localPath));

  const template = templateFor(candidate.tier);
  const built = template({ mediaPath: localPath, config, sourceDurationSec });

  const brandingFilter = buildBrandingFilter({
    config,
    gameTitle: game.title,
    categoryLabel: categoryLabelTr(game.categorySlug),
    durationSec: built.durationSec,
    hookText: hookFor(game),
  });

  // Klasör adı oyun adına göre (+ id son eki, tekillik ve ledger/rapor eşlemesi için) —
  // "output/pgm-97426" yerine "output/piece-of-cake-merge-bake-pgm-97426" gibi
  // takip etmesi çok daha kolay bir isimle.
  const outDir = path.join(config.outputDir, `${slugifyTitle(game.title)}-${game.id}`);
  fs.mkdirSync(outDir, { recursive: true });
  const videoPath = path.join(outDir, "video.mp4");
  const thumbnailPath = path.join(outDir, "thumbnail.jpg");

  // Ses korunuyorsa: kapanış kartının başladığı anda kısa bir fade-out (0.3sn) —
  // sesin "Şimdi Oyna" karartmasıyla aynı anda kesilmesi yerine yumuşak biter.
  const endStart = Math.max(0, built.durationSec - config.video.endCardSec);
  const audioArgs = keepAudio
    ? [
        "-map",
        "0:a",
        "-af",
        `afade=t=out:st=${endStart}:d=0.3`,
        "-c:a",
        "aac",
        "-b:a",
        "128k",
      ]
    : ["-an"];

  await runFfmpeg([
    "-y",
    ...built.inputArgs,
    "-i",
    localPath,
    "-i",
    config.brand.logoPath,
    "-filter_complex",
    `${built.filterGraph};${brandingFilter}`,
    "-map",
    "[branded]",
    ...audioArgs,
    "-r",
    String(config.video.fps),
    "-t",
    String(built.durationSec),
    "-c:v",
    config.video.codec,
    "-preset",
    config.video.preset,
    "-crf",
    String(config.video.crf),
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    videoPath,
  ]);

  await extractThumbnail(videoPath, built.durationSec, config, thumbnailPath);

  return { videoPath, thumbnailPath, durationSec: built.durationSec };
}

/**
 * ffmpeg-static üzerine ince bir Promise sarmalayıcı (proje zaten bu paketi
 * devDependency olarak taşıyor — bkz. tools/gameplay-preview.mjs). Yeni bir
 * ffmpeg wrapper paketi (fluent-ffmpeg vb.) eklemeye gerek yok; ihtiyacımız
 * olan tek şey execFile + stderr parse.
 */
import { execFile } from "node:child_process";
// @ts-ignore — ffmpeg-static için tip tanımı yok, tek satırlık kullanım yeterli.
import ffmpegPath from "ffmpeg-static";
import { projectRoot } from "../catalogSource.mts";

export function runFfmpeg(args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    // cwd = proje kökü: branding.mts font yollarını KASITLI olarak proje-köküne
    // GÖRELİ verir (ör. "tools/social/assets/fonts/Sora.ttf") — Windows'ta
    // mutlak yoldaki sürücü harfi (`C:\...`) drawtext'in fontfile= değerini
    // bozup sessizce sistem yedek fontuna düşüyordu (Türkçe karakterler
    // tofu kutucuğu oluyordu). Göreli yol bu sınıf hatayı tamamen ortadan kaldırır.
    execFile(ffmpegPath as unknown as string, args, { cwd: projectRoot, maxBuffer: 1024 * 1024 * 64 }, (err, _stdout, stderr) => {
      if (err) return reject(new Error(stderr || err.message));
      resolve(stderr);
    });
  });
}

function parseDuration(text: string): number {
  const m = /Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/.exec(text);
  if (!m) return 0;
  return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]);
}

/** ffprobe binary'si ffmpeg-static'te yok — süreyi ffmpeg'in kendi stderr çıktısından ayrıştırırız. */
export async function probeDurationSec(file: string): Promise<number> {
  try {
    const stderr = await runFfmpeg(["-i", file, "-f", "null", "-"]);
    return parseDuration(stderr);
  } catch (e) {
    return parseDuration((e as Error).message);
  }
}

/**
 * Kaynak dosyada ses akışı (Audio stream) var mı? ffprobe olmadığı için yine
 * ffmpeg'in "-i" başlık çıktısını (stderr) tarıyoruz — "Stream #0:x: Audio:" satırı.
 */
export async function hasAudioStream(file: string): Promise<boolean> {
  const AUDIO_RE = /Stream #\d+:\d+[^\n]*:\s*Audio:/;
  try {
    const stderr = await runFfmpeg(["-i", file, "-f", "null", "-"]);
    return AUDIO_RE.test(stderr);
  } catch (e) {
    // Bazı kaynaklarda "-f null -" hatayla sonuçlanabilir (ör. video-only, kısa dosya);
    // yine de başlık bilgisi hata mesajının içinde (stderr) yer alır.
    return AUDIO_RE.test((e as Error).message);
  }
}

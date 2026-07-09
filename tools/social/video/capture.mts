/**
 * Originals oyunlarımız için otomatik oynanış kaydı (Playwright + CDP screencast).
 * tools/gameplay-preview.mjs'teki teknik temel alınır (kare-kare screencast →
 * ffmpeg), ama basitleştirilir: kendi oyunlarımızda reklam/menü bekleme
 * gerekmez (aynı origin, reklamsız), doğrudan oynanışa geçilir.
 *
 * Genişletme noktası: bir oyunun kendi public/originals/<slug>/ klasöründe
 * `social-director.mjs` dosyası varsa (export default async (page, ms) => {...})
 * onu çalıştırır — oyuna özel koreografi (ör. BlokKraft'ta önce kaz, sonra inşa
 * et) ileride kod dokunmadan eklenebilir. Yoksa jenerik bir "gezinme" akışı
 * (WASD + fare hareketi + tıklama) kullanılır — herhangi bir HTML5/canvas
 * oyununda makul görsel hareket üretir.
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { runFfmpeg } from "./ffmpeg.mts";
import type { SocialConfig } from "../types.mts";

async function genericDrive(page: import("playwright").Page, ms: number): Promise<void> {
  const clickers = ["text=/oyna/i", "text=/play/i", "text=/başlat/i", "#btnPlay", "canvas"];
  for (const sel of clickers) {
    try {
      const el = page.locator(sel).first();
      if (await el.count()) await el.click({ timeout: 800, force: true });
    } catch {
      /* yoksay */
    }
  }
  await page.waitForTimeout(500);

  const keys = ["KeyW", "KeyA", "KeyS", "KeyD", "Space"];
  const end = Date.now() + ms;
  while (Date.now() < end) {
    const key = keys[Math.floor(Math.random() * keys.length)];
    await page.keyboard.down(key).catch(() => {});
    await page.mouse.move(300 + Math.random() * 480, 500 + Math.random() * 700, { steps: 8 }).catch(() => {});
    await page.waitForTimeout(250 + Math.random() * 300);
    await page.keyboard.up(key).catch(() => {});
    if (Math.random() < 0.15) await page.mouse.down().catch(() => {});
    if (Math.random() < 0.15) await page.mouse.up().catch(() => {});
  }
}

async function recordScreencast(
  page: import("playwright").Page,
  context: import("playwright").BrowserContext,
  framesDir: string,
  durationMs: number,
): Promise<number> {
  fs.mkdirSync(framesDir, { recursive: true });
  let frameCount = 0;
  const cdp = await context.newCDPSession(page);
  const onFrame = async (payload: { data: string; sessionId: number }) => {
    frameCount++;
    fs.writeFileSync(path.join(framesDir, `f-${String(frameCount).padStart(5, "0")}.jpeg`), Buffer.from(payload.data, "base64"));
    await cdp.send("Page.screencastFrameAck", { sessionId: payload.sessionId as unknown as string }).catch(() => {});
  };
  cdp.on("Page.screencastFrame", onFrame as any);
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 80, everyNthFrame: 1 } as any);
  await genericDrive(page, durationMs);
  await cdp.send("Page.stopScreencast").catch(() => {});
  cdp.off("Page.screencastFrame", onFrame as any);
  return frameCount;
}

/** Bir Originals oyununu kaydeder, mp4 dosya yolunu döner (önbelleğe yazılır). */
export async function captureOriginalsGameplay(
  pageUrl: string,
  gameId: string,
  config: SocialConfig,
): Promise<string> {
  const outFile = path.join(config.cacheDir, `capture-${gameId}.mp4`);
  if (fs.existsSync(outFile) && fs.statSync(outFile).size > 0) return outFile; // zaten kaydedilmiş

  const durationMs = config.video.defaultDurationSec * 1000;
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: config.video.width, height: config.video.height } });
  const page = await context.newPage();
  const framesDir = path.join(config.cacheDir, `_frames-${gameId}`);
  try {
    await page.goto(pageUrl, { waitUntil: "load", timeout: 30000 });
    await page.waitForTimeout(1200);

    // Oyuna özel koreografi varsa onu kullan (extensibility hook).
    const directorPath = path.join(path.dirname(new URL(pageUrl).pathname), "social-director.mjs");
    let usedCustomDirector = false;
    if (fs.existsSync(directorPath)) {
      try {
        const mod = await import(new URL(`file://${directorPath}`).href);
        const cdp = await context.newCDPSession(page);
        fs.mkdirSync(framesDir, { recursive: true });
        let frameCount = 0;
        const onFrame = async (payload: { data: string; sessionId: number }) => {
          frameCount++;
          fs.writeFileSync(path.join(framesDir, `f-${String(frameCount).padStart(5, "0")}.jpeg`), Buffer.from(payload.data, "base64"));
          await cdp.send("Page.screencastFrameAck", { sessionId: payload.sessionId as unknown as string }).catch(() => {});
        };
        cdp.on("Page.screencastFrame", onFrame as any);
        await cdp.send("Page.startScreencast", { format: "jpeg", quality: 80, everyNthFrame: 1 } as any);
        await mod.default(page, durationMs);
        await cdp.send("Page.stopScreencast").catch(() => {});
        cdp.off("Page.screencastFrame", onFrame as any);
        usedCustomDirector = true;
      } catch {
        usedCustomDirector = false;
      }
    }
    if (!usedCustomDirector) {
      await recordScreencast(page, context, framesDir, durationMs);
    }

    await runFfmpeg([
      "-y",
      "-framerate",
      String(config.video.fps),
      "-i",
      path.join(framesDir, "f-%05d.jpeg"),
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      outFile,
    ]);
    return outFile;
  } finally {
    fs.rmSync(framesDir, { recursive: true, force: true });
    await context.close();
    await browser.close();
  }
}

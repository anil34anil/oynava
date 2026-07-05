/**
 * Gerçek gameplay klip üretici (Playwright + CDP screencast + ffmpeg).
 *
 * Önceki deneme (sabit süre kaydet) menü/reklam ekranını yakalıyordu.
 * Bu sürüm: sayfayı önce SESSİZ izler (screenshot diff ile "hareket" tespit
 * eder — menü/reklam genelde durağandır, gerçek oynanışta piksel değişimi
 * sürekli ve yüksektir), gerçek oynanış başladığını anlayınca CDP screencast
 * ile kayda başlar, N saniye toplar, ffmpeg ile mp4'e çevirir.
 *
 * ÇALIŞTIR: node tools/gameplay-preview.mjs
 */
import { chromium } from "playwright";
import ffmpegPath from "ffmpeg-static";
import { execFile } from "child_process";
import fs from "fs";
import path from "path";

const OUT = "screenshots/gameplay";
const MAX_WARMUP_MS = 25000; // menü/reklamı atlamak için en fazla bekleme
const CLIP_MS = 8000; // kaydedilecek gerçek oynanış süresi
const MOTION_THRESHOLD = 12; // ortalama piksel farkı eşiği (0-255)
const STABLE_HITS_NEEDED = 3; // üst üste kaç ölçümde "hareketli" görülürse oynanış kabul edilir

const GAMES = [
  { id: "79953", url: "https://html5.gamemonetize.co/t2a672cdfu2471c0ek19v6fr26za27z7/" },
  { id: "80757", url: "https://html5.gamemonetize.co/5wnj7eq5j718vi5zur2rm64ld4jguwl7/" },
];

function avgDiff(bufA, bufB) {
  // Basit: iki JPEG screenshot buffer boyutu farkını kaba bir hareket sinyali olarak kullan
  // (gerçek piksel karşılaştırması için PNG+raw gerekir; boyut farkı JPEG'de sahne karmaşıklığıyla ilişkilidir)
  return Math.abs(bufA.length - bufB.length);
}

function framesToMp4(framesDir, outFile) {
  return new Promise((resolve, reject) => {
    execFile(
      ffmpegPath,
      [
        "-y",
        "-framerate",
        "15",
        "-i",
        path.join(framesDir, "f-%05d.jpeg"),
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        outFile,
      ],
      (err, stdout, stderr) => {
        if (err) return reject(new Error(stderr || err.message));
        resolve();
      },
    );
  });
}

async function warmupAndFindGameplay(page) {
  const start = Date.now();
  let prevShot = null;
  let stableHits = 0;

  // Yaygın "play/başlat" tetikleyicileri dene (bulunamazsa yoksay)
  const tryClickStart = async () => {
    const selectors = [
      "text=/play/i",
      "text=/oyna/i",
      "text=/start/i",
      "#play-btn",
      ".play-button",
      "canvas",
    ];
    for (const sel of selectors) {
      try {
        const el = page.locator(sel).first();
        if (await el.count()) {
          await el.click({ timeout: 800, force: true });
        }
      } catch {
        /* yoksay */
      }
    }
  };

  while (Date.now() - start < MAX_WARMUP_MS) {
    await tryClickStart();
    await page.mouse.click(400, 300).catch(() => {});
    await page.waitForTimeout(600);

    const shot = await page.screenshot({ type: "jpeg", quality: 40 }).catch(() => null);
    if (shot && prevShot) {
      const d = avgDiff(shot, prevShot);
      if (d > MOTION_THRESHOLD * 50) {
        stableHits++;
        if (stableHits >= STABLE_HITS_NEEDED) {
          return true; // gerçek oynanış olarak kabul edildi
        }
      } else {
        stableHits = 0;
      }
    }
    prevShot = shot;
  }
  return false; // süre doldu, en iyi tahminle devam edilecek
}

async function recordClip(page, cdp, framesDir) {
  fs.mkdirSync(framesDir, { recursive: true });
  let frameCount = 0;
  const onFrame = async (payload) => {
    frameCount++;
    const file = path.join(framesDir, `f-${String(frameCount).padStart(5, "0")}.jpeg`);
    fs.writeFileSync(file, Buffer.from(payload.data, "base64"));
    await cdp.send("Page.screencastFrameAck", { sessionId: payload.sessionId }).catch(() => {});
    // Oyunun sürekli "canlı" görünmesi için ekstra girdi gönder
    const x = 200 + Math.random() * 400;
    const y = 150 + Math.random() * 300;
    page.mouse.move(x, y).catch(() => {});
  };
  cdp.on("Page.screencastFrame", onFrame);
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 70, everyNthFrame: 1 });
  await page.waitForTimeout(CLIP_MS);
  await cdp.send("Page.stopScreencast").catch(() => {});
  cdp.off("Page.screencastFrame", onFrame);
  return frameCount;
}

async function run() {
  const browser = await chromium.launch();

  for (const g of GAMES) {
    console.log(`\n[${g.id}] açılıyor: ${g.url}`);
    const context = await browser.newContext({ viewport: { width: 800, height: 600 } });
    const page = await context.newPage();
    try {
      await page.goto(g.url, { waitUntil: "load", timeout: 30000 });
      await page.waitForTimeout(1500);

      const found = await warmupAndFindGameplay(page);
      console.log(`[${g.id}] gerçek oynanış tespiti: ${found ? "OK" : "süre doldu, yine de kaydediliyor"}`);

      const cdp = await context.newCDPSession(page);
      const framesDir = path.join(OUT, g.id, "frames");
      const n = await recordClip(page, cdp, framesDir);
      console.log(`[${g.id}] ${n} kare yakalandı`);

      const outFile = path.join(OUT, `${g.id}.mp4`);
      await framesToMp4(framesDir, outFile);
      console.log(`[${g.id}] mp4 üretildi -> ${outFile}`);
      fs.rmSync(framesDir, { recursive: true, force: true });
    } catch (e) {
      console.error(`[${g.id}] hata:`, e.message);
    }
    await context.close();
  }

  await browser.close();
}

run();

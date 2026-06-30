/**
 * OYNAVA — Play Store ekran görüntüsü üretici (Playwright).
 *
 * KURULUM (bir kez):
 *   npm i -D playwright
 *   npx playwright install chromium
 *
 * ÇALIŞTIR:
 *   node tools/play-screenshots.mjs
 *
 * Çıktı: ./screenshots/ klasörüne phone-*, tablet7-*, tablet10-* PNG'leri.
 * Boyutlar Play standardında (oran ≤ 2:1): telefon 1080×1920, 7" 1200×1920, 10" 1600×2560.
 */
import { chromium } from "playwright";
import fs from "fs";

const BASE = process.env.SITE || "https://www.oynava.com";
const OUT = "screenshots";
fs.mkdirSync(OUT, { recursive: true });

// viewport(CSS) × dpr = çıktı pikseli. Layout CSS genişliğine göre değişir.
const PROFILES = [
  { key: "phone", vw: 540, vh: 960, dpr: 2, mobile: true }, // 1080×1920 (mobil düzen)
  { key: "tablet7", vw: 960, vh: 1536, dpr: 1.25, mobile: false }, // 1200×1920 (tablet)
  { key: "tablet10", vw: 1280, vh: 2048, dpr: 1.25, mobile: false }, // 1600×2560 (geniş + sidebar)
];

const ROUTES = {
  home: "/",
  online: "/online",
  premium: "/premium",
  "3d": "/kategori/3d",
  fps: "/fps",
  profil: "/profil",
  kategori: "/kategori/yaris",
};

// Hangi profil hangi sayfaları çeksin
const PLAN = {
  phone: ["home", "online", "premium", "3d", "fps", "profil"],
  tablet7: ["home", "kategori", "premium"],
  tablet10: ["home", "online", "premium"],
};

// Sayfayı oturt: lazy görselleri tetiklemek için yavaşça kaydır, başa dön
async function settle(page) {
  try {
    await page.evaluate(
      () =>
        new Promise((res) => {
          let y = 0;
          const t = setInterval(() => {
            window.scrollBy(0, 700);
            y += 700;
            if (y >= document.body.scrollHeight) {
              clearInterval(t);
              res();
            }
          }, 120);
        }),
    );
    await page.waitForTimeout(900);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(700);
  } catch {
    /* yoksay */
  }
}

// Çerez bildirimi / login modalı varsa kapat (temiz görüntü)
async function dismissOverlays(page) {
  for (const re of [/Kabul/i, /Tamam/i, /Anladım/i, /Accept/i, /Reddet/i, /Tümünü/i]) {
    try {
      const b = page.locator("button", { hasText: re }).first();
      if (await b.count()) await b.click({ timeout: 1500 });
    } catch {
      /* yoksay */
    }
  }
  try {
    await page.keyboard.press("Escape");
  } catch {
    /* yoksay */
  }
}

async function shot(page, name) {
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log("  ✓", `${name}.png`);
}

const run = async () => {
  const browser = await chromium.launch();
  for (const p of PROFILES) {
    console.log(`\n=== ${p.key} (${Math.round(p.vw * p.dpr)}×${Math.round(p.vh * p.dpr)}) ===`);
    const ctx = await browser.newContext({
      viewport: { width: p.vw, height: p.vh },
      deviceScaleFactor: p.dpr,
      isMobile: p.mobile,
      hasTouch: true,
      locale: "tr-TR",
    });
    const page = await ctx.newPage();

    // İlk yüklemede overlay'leri kapat
    await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 60000 }).catch(() => {});
    await dismissOverlays(page);

    // Statik sayfalar
    for (const k of PLAN[p.key]) {
      try {
        await page.goto(BASE + ROUTES[k], { waitUntil: "domcontentloaded", timeout: 60000 });
        await settle(page);
        await shot(page, `${p.key}-${k}`);
      } catch (e) {
        console.log("  ✗", k, e.message);
      }
    }

    // Oyun detay (sadece telefon) + oyun oynanırken (hepsi)
    try {
      await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
      const href = await page.locator('a[href*="/oyun/"]').first().getAttribute("href");
      if (href) {
        await page.goto(BASE + href, { waitUntil: "domcontentloaded", timeout: 60000 });
        await settle(page);
        if (p.key === "phone") await shot(page, `${p.key}-game-detail`);

        // Oyunu başlat (▶ "Başlatmak için tıkla" butonu)
        let started = false;
        for (const sel of ['button:has-text("Başlat")', 'button:has-text("▶")']) {
          try {
            const b = page.locator(sel).first();
            if (await b.count()) {
              await b.click({ timeout: 4000 });
              started = true;
              break;
            }
          } catch {
            /* yoksay */
          }
        }
        if (started) {
          await page.waitForTimeout(9000); // oyun iframe'i yüklensin
          await shot(page, `${p.key}-gameplay`);
        }
      }
    } catch (e) {
      console.log("  ✗ gameplay", e.message);
    }

    await ctx.close();
  }
  await browser.close();
  console.log(`\n✅ TAMAM → '${OUT}/' klasörüne bak.`);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

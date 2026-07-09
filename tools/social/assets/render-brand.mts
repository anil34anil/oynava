/**
 * Marka görsellerini (logo amblemi) TEK SEFERLİK üretir.
 *
 * Neden Playwright: proje zaten devDependency olarak taşıyor (yeni bağımlılık
 * yok); src/components/Logo.tsx'teki GERÇEK marka SVG'sini birebir kullanır,
 * böylece video overlay'i site logosuyla senkron kalır — marka rengi
 * değişirse burada da tek satır güncellenir.
 *
 * ÇALIŞTIR (sadece assets/logo.png eksikse gerekir; branding.mts otomatik
 * çağırır): node tools/social/assets/render-brand.mts
 */
import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
export const LOGO_PNG = path.join(DIR, "logo.png");

// src/components/Logo.tsx ile birebir aynı SVG (marka değişirse orada + burada güncelle).
const LOGO_SVG = `
<svg viewBox="0 0 64 64" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#4cd7f6" />
      <stop offset="1" stop-color="#d0bcff" />
    </linearGradient>
  </defs>
  <rect x="3" y="3" width="58" height="58" rx="16" fill="#0b1326" />
  <rect x="4.5" y="4.5" width="55" height="55" rx="14.5" fill="none" stroke="url(#g)" stroke-width="3" />
  <path d="M25 20 L46 32 L25 44 Z" fill="url(#g)" />
</svg>`;

export async function renderBrandAssets(): Promise<void> {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 512, height: 512 } });
  await page.setContent(
    `<html><body style="margin:0;background:transparent">${LOGO_SVG}</body></html>`,
  );
  await page.screenshot({ path: LOGO_PNG, omitBackground: true });
  await browser.close();
}

// Doğrudan çalıştırılırsa üret.
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  renderBrandAssets().then(() => console.log("logo.png üretildi:", LOGO_PNG));
}

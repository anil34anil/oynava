/**
 * OYNAVA Social Media Factory — tek giriş noktası.
 *
 *   node tools/social/cli.mts                 → gerçek oynanış VİDEOSU olan oyunları işler
 *   node tools/social/cli.mts --limit 20       → sadece ilk 20 (deneme/test için)
 *   node tools/social/cli.mts --only ov-blokkraft
 *   node tools/social/cli.mts --force          → ledger'ı yoksay, hepsini yeniden üret
 *   node tools/social/cli.mts --concurrency 4  → config.json'daki değeri geçici geçersiz kılar
 *   node tools/social/cli.mts --all             → videosu olmayanları da (statik görsel/Ken Burns) işle
 *
 * VARSAYILAN DAVRANIŞ: sadece gerçek video kaynağı olan oyunlar (Playgama
 * preview + Originals gameplay kaydı) işlenir; statik thumbnail'den Ken Burns
 * üretilecek oyunlar (GameMonetize/GameDistribution/GamePix'in tamamı + video
 * içermeyen Playgama kayıtları) TAMAMEN atlanır — sosyal medya paylaşımı için
 * gerçek oynanış görüntüsü tercih edildiği için (kullanıcı talebi).
 *
 * (package.json DO_NOT_TOUCH listesinde olduğu için `npm run social` script'i
 * henüz eklenmedi — kullanıcı onayı bekleniyor. O ana kadar yukarıdaki `node`
 * komutu birebir aynı işi yapar.)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadCatalog } from "./catalogSource.mts";
import { findDuplicateGroups } from "./media/duplicates.mts";
import { selectMedia } from "./media/selector.mts";
import { createProviderRegistry } from "./providers/registry.mts";
import { renderGameVideo } from "./video/pipeline.mts";
import { generateCaptions } from "./captions/generator.mts";
import { LedgerStore } from "./ledger.mts";
import { runQueue } from "./queue.mts";
import { writeReport, type RunResultRow } from "./report.mts";
import { renderBrandAssets, LOGO_PNG } from "./assets/render-brand.mts";
import type { SocialConfig } from "./types.mts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

function parseArgs(argv: string[]) {
  const out: { force: boolean; all: boolean; limit?: number; only?: string; concurrency?: number; config?: string } = {
    force: false,
    all: false,
  };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--force") out.force = true;
    else if (argv[i] === "--all") out.all = true;
    else if (argv[i] === "--limit") out.limit = Number(argv[++i]);
    else if (argv[i] === "--only") out.only = argv[++i];
    else if (argv[i] === "--concurrency") out.concurrency = Number(argv[++i]);
    else if (argv[i] === "--config") out.config = argv[++i];
  }
  return out;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  // --config ile alternatif bir config dosyası verilebilir (ör. config.hooks.json)
  // — farklı outputDir/stateFile taşıyarak ÖNCEKİ üretimi (tools/social/output/,
  // state/ledger.json) hiç dokunmadan ayrı bir üretim çalıştırmayı sağlar.
  const configFileName = args.config ?? "tools/social/config.json";
  const config: SocialConfig = JSON.parse(fs.readFileSync(path.join(ROOT, configFileName), "utf8"));
  // config.json'daki yollar proje köküne görelidir; mutlak yola çeviriyoruz.
  config.outputDir = path.join(ROOT, config.outputDir);
  config.cacheDir = path.join(ROOT, config.cacheDir);
  config.stateFile = path.join(ROOT, config.stateFile);
  // NOT: brand.fonts.*/logoPath KASITLI olarak proje-köküne GÖRELİ bırakılır
  // (config.json'daki haliyle) — ffmpeg.mts bunları cwd=projectRoot ile
  // çalıştırır. Mutlak Windows yoluna (`C:\...`) çevirmek drawtext'in
  // fontfile= ayrıştırmasını bozuyordu (bkz. ffmpeg.mts yorumu).
  if (args.concurrency) config.concurrency = args.concurrency;

  if (!fs.existsSync(config.brand.logoPath)) {
    console.log("[social] logo.png bulunamadı, üretiliyor...");
    await renderBrandAssets();
  }

  console.log("[social] katalog yükleniyor...");
  let catalog = loadCatalog();
  console.log(`[social] toplam ${catalog.length} oyun bulundu.`);

  if (args.only) catalog = catalog.filter((g) => g.id === args.only);
  const ledger = new LedgerStore(config.stateFile);
  if (!args.force) catalog = catalog.filter((g) => !ledger.isDone(g.id));
  if (args.limit) catalog = catalog.slice(0, args.limit);
  console.log(`[social] işlenecek: ${catalog.length} oyun (force=${args.force}).`);

  if (catalog.length === 0) {
    console.log("[social] işlenecek yeni oyun yok. (--force ile hepsini yeniden üretebilirsin)");
    return;
  }

  console.log("[social] tekrarlanan oyunlar tespit ediliyor...");
  const duplicateGroups = findDuplicateGroups(loadCatalog()); // tam katalog üzerinden (kısmi listede grup kaçmasın)
  const registry = createProviderRegistry(config);

  const results: RunResultRow[] = [];
  const tasks = catalog.map((game) => async () => {
    const selected = selectMedia(game, registry, duplicateGroups);

    if (selected.duplicateOf && !selected.candidate) {
      ledger.set(game.id, { status: "skipped_duplicate", processedAt: new Date().toISOString() });
      results.push({ gameId: game.id, title: game.title, status: "skipped_duplicate" });
      return;
    }
    if (!selected.candidate) {
      ledger.set(game.id, { status: "skipped_no_media", processedAt: new Date().toISOString() });
      results.push({ gameId: game.id, title: game.title, status: "skipped_no_media" });
      return;
    }
    // Varsayılan: gerçek video kaynağı yoksa (statik thumbnail → Ken Burns'e
    // düşecekse) hiç işleme — --all ile bu davranış kapatılabilir.
    const hasRealVideo = selected.candidate.isVideo || selected.candidate.capture;
    if (!args.all && !hasRealVideo) {
      ledger.set(game.id, { status: "skipped_no_video", processedAt: new Date().toISOString() });
      results.push({ gameId: game.id, title: game.title, status: "skipped_no_video" });
      return;
    }

    const { videoPath, thumbnailPath } = await renderGameVideo(selected, config);
    const captions = await generateCaptions(game, config);
    fs.writeFileSync(path.join(path.dirname(videoPath), "captions.json"), JSON.stringify(captions, null, 2));

    ledger.set(game.id, {
      status: "done",
      tier: selected.candidate.tier,
      providerId: selected.candidate.providerId,
      outputDir: path.dirname(videoPath),
      processedAt: new Date().toISOString(),
    });
    results.push({
      gameId: game.id,
      title: game.title,
      status: "done",
      tier: selected.candidate.tier,
      providerId: selected.candidate.providerId,
    });
    console.log(`[social] ✅ ${game.title} (${selected.candidate.tier}) -> ${videoPath}`);
    void thumbnailPath;
  });

  await runQueue(tasks, config.concurrency, (i, result) => {
    if (!result.ok) {
      const game = catalog[i];
      const message = (result.error as Error)?.message ?? String(result.error);
      ledger.set(game.id, { status: "failed", error: message, processedAt: new Date().toISOString() });
      results.push({ gameId: game.id, title: game.title, status: "failed", error: message });
      console.error(`[social] ❌ ${game.title}: ${message}`);
    }
  });

  const { mdPath } = writeReport(config.outputDir, results);
  console.log(`\n[social] tamamlandı. Rapor: ${mdPath}`);
  console.log(`[social] ledger özeti:`, ledger.summary());
}

main().catch((e) => {
  console.error("[social] BEKLENMEYEN HATA:", e);
  process.exit(1);
});

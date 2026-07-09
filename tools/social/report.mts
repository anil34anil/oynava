/**
 * Çalıştırma raporu — JSON (makine okunur) + Markdown (insan okunur) olarak
 * `outputDir/reports/` altına yazılır. "Hiç medya bulunamazsa rapor oluştur"
 * gereksinimi burada karşılanır: skipped_no_media listesi ayrı bölümde.
 */
import fs from "node:fs";
import path from "node:path";
import type { JobStatus } from "./types.mts";

export type RunResultRow = {
  gameId: string;
  title: string;
  status: JobStatus;
  tier?: string;
  providerId?: string;
  error?: string;
};

export function writeReport(outputDir: string, rows: RunResultRow[]): { jsonPath: string; mdPath: string } {
  const dir = path.join(outputDir, "reports");
  fs.mkdirSync(dir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const jsonPath = path.join(dir, `report-${stamp}.json`);
  const mdPath = path.join(dir, `report-${stamp}.md`);

  const byStatus: Record<string, RunResultRow[]> = {};
  for (const r of rows) (byStatus[r.status] ??= []).push(r);

  fs.writeFileSync(jsonPath, JSON.stringify({ generatedAt: new Date().toISOString(), rows }, null, 2));

  const lines: string[] = [];
  lines.push(`# OYNAVA Social Media Factory — Çalıştırma Raporu`, "", `Tarih: ${new Date().toLocaleString("tr-TR")}`, "");
  lines.push(`## Özet`, "");
  for (const [status, list] of Object.entries(byStatus)) lines.push(`- **${status}**: ${list.length}`);
  lines.push("", `Toplam işlenen: ${rows.length}`, "");

  const noMedia = byStatus["skipped_no_media"] ?? [];
  if (noMedia.length) {
    lines.push(`## ⚠️ Medya bulunamayan oyunlar (${noMedia.length})`, "");
    for (const r of noMedia) lines.push(`- ${r.title} (${r.gameId})`);
    lines.push("");
  }

  const failed = byStatus["failed"] ?? [];
  if (failed.length) {
    lines.push(`## ❌ Hata alan oyunlar (${failed.length})`, "");
    for (const r of failed) lines.push(`- ${r.title} (${r.gameId}): ${r.error}`);
    lines.push("");
  }

  const done = byStatus["done"] ?? [];
  if (done.length) {
    lines.push(`## ✅ Başarıyla üretilenler (${done.length})`, "");
    for (const r of done) lines.push(`- ${r.title} — kademe: ${r.tier}, kaynak: ${r.providerId}`);
    lines.push("");
  }

  fs.writeFileSync(mdPath, lines.join("\n"));
  return { jsonPath, mdPath };
}

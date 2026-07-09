/**
 * Kalıcı ilerleme defteri (resume desteği).
 *
 * Binlerce oyun tek seferde işlenemeyeceği / yarıda kesilebileceği için her
 * oyunun sonucu diske yazılır. Bir sonraki çalıştırma zaten "done" olanları
 * atlar (--force verilmedikçe) → "kaldığı yerden devam etme" budur.
 *
 * Atomik yazım: önce .tmp dosyasına yaz, sonra rename et — yarıda kesilen bir
 * write, ledger.json'ı bozuk (yarım JSON) bırakmasın diye.
 */
import fs from "node:fs";
import path from "node:path";
import type { Ledger, LedgerEntry } from "./types.mts";

export class LedgerStore {
  private data: Ledger = {};
  private readonly file: string;
  constructor(file: string) {
    this.file = file;
    this.load();
  }

  private load() {
    try {
      this.data = JSON.parse(fs.readFileSync(this.file, "utf8"));
    } catch {
      this.data = {};
    }
  }

  get(id: string): LedgerEntry | undefined {
    return this.data[id];
  }

  isDone(id: string): boolean {
    return this.data[id]?.status === "done";
  }

  set(id: string, entry: LedgerEntry) {
    this.data[id] = entry;
    this.persist();
  }

  private persist() {
    fs.mkdirSync(path.dirname(this.file), { recursive: true });
    const tmp = `${this.file}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(this.data, null, 2));
    fs.renameSync(tmp, this.file);
  }

  summary() {
    const rows = Object.values(this.data);
    const byStatus: Record<string, number> = {};
    for (const r of rows) byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;
    return { total: rows.length, byStatus };
  }
}

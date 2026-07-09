/**
 * İçerik-adresli medya önbelleği — aynı URL bir daha indirilmez (spesifikasyon:
 * "İndirilen medya tekrar indirilmesin"). Anahtar: sha1(url); dosya adı da aynı
 * hash olduğu için varlık kontrolü = tek bir fs.existsSync, ayrı bir manifest
 * dosyasına gerek yok (daha az taşınacak durum, daha az bozulma riski).
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

function extOf(url: string): string {
  const clean = url.split("?")[0].split("#")[0];
  const ext = path.extname(clean);
  return ext && ext.length <= 6 ? ext : ".bin";
}

function hashOf(url: string): string {
  return crypto.createHash("sha1").update(url).digest("hex");
}

/** Verilen medya URL'sini (http/https veya file://) önbelleğe indirir/kopyalar, yerel yolu döner. */
export async function cacheMedia(url: string, cacheDir: string): Promise<string> {
  fs.mkdirSync(cacheDir, { recursive: true });
  const dest = path.join(cacheDir, hashOf(url) + extOf(url));
  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) return dest; // zaten inik

  if (url.startsWith("file://")) {
    fs.copyFileSync(fileURLToPath(url), dest);
    return dest;
  }

  const res = await fetch(url, { headers: { "User-Agent": "OynavaSocialFactory/1.0" } });
  if (!res.ok) throw new Error(`İndirme başarısız (${res.status}): ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return dest;
}

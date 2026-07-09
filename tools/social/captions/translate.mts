/**
 * Ücretsiz makine çevirisi — src/lib/translate.ts'teki AYNI anahtarsız Google
 * uç noktasını kullanır (üretimde zaten kanıtlanmış), ama Redis yerine basit
 * bir dosya önbelleği kullanır: bu araç bağımsız çalışabilmeli (REDIS_URL
 * ayarlanmamış olsa bile), ve zaten kv.ts extensionless import zinciri
 * yüzünden native Node ESM'de doğrudan import edilemiyor (bkz. media/duplicates.mts
 * yorumu — aynı sınıf sorun). Oyun açıklamaları neredeyse hiç değişmediği için
 * kalıcı dosya önbelleği burada Redis'ten daha basit ve yeterlidir.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

function hash(s: string): string {
  return crypto.createHash("sha1").update(s).digest("hex").slice(0, 20);
}

let cache: Record<string, string> | null = null;
let cacheFile = "";

function loadCache(cacheDir: string): Record<string, string> {
  if (cache) return cache;
  cacheFile = path.join(cacheDir, "translations.json");
  try {
    cache = JSON.parse(fs.readFileSync(cacheFile, "utf8"));
  } catch {
    cache = {};
  }
  return cache;
}

function saveCache() {
  fs.mkdirSync(path.dirname(cacheFile), { recursive: true });
  fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
}

async function fetchTranslation(text: string, target: string, source: string): Promise<string | null> {
  const url =
    `https://translate.googleapis.com/translate_a/single?client=gtx` +
    `&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) return null;
    const data = (await res.json()) as [string, string][][];
    const segs = data?.[0];
    if (!Array.isArray(segs)) return null;
    return segs.map((s) => s?.[0] ?? "").join("");
  } catch {
    return null;
  }
}

/** Metni hedef dile çevirir (dosya önbellekli). Başarısızsa orijinali döner (asla patlamaz). */
export async function translateCached(
  text: string,
  target: string,
  source: string,
  cacheDir: string,
): Promise<string> {
  const trimmed = (text || "").trim();
  if (!trimmed || target === source) return text;

  const store = loadCache(cacheDir);
  const key = `${source}:${target}:${hash(trimmed)}`;
  if (store[key] != null) return store[key];

  const out = await fetchTranslation(trimmed, target, source);
  if (out) {
    store[key] = out;
    saveCache();
    return out;
  }
  return text;
}

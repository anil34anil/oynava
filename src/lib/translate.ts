/**
 * Ücretsiz makine çevirisi + Redis önbelleği.
 *
 * Google'ın resmi olmayan (anahtarsız, ücretsiz) çeviri uç noktasını kullanır ve
 * SONUCU Redis'te kalıcı önbelleğe alır → her metin/dil bir kez çevrilir, sonra
 * cache'den gelir. Böylece binlerce oyun için bile maliyet/istek minimumda kalır.
 *
 * ⚠️ Resmi olmayan uç nokta nadiren hız sınırlamasına takılabilir; o durumda
 * çeviri başarısız olursa ORİJİNAL metin döner (site çökmez, "kötü" görünmez).
 */
import { createHash } from "crypto";
import { kvGet, kvSet } from "./kv";
import { DEFAULT_LOCALE } from "./i18n";

function hash(s: string): string {
  return createHash("sha1").update(s).digest("hex").slice(0, 16);
}

async function fetchTranslation(text: string, target: string, source: string): Promise<string | null> {
  const url =
    `https://translate.googleapis.com/translate_a/single?client=gtx` +
    `&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      // Çeviriler kalıcı; uzun süre cache'lenebilir (Next fetch cache).
      next: { revalidate: 60 * 60 * 24 * 30 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as [string, string][][];
    const segs = data?.[0];
    if (!Array.isArray(segs)) return null;
    return segs.map((s) => s?.[0] ?? "").join("");
  } catch {
    return null;
  }
}

/**
 * Tek bir metni hedef dile çevirir (Redis önbellekli). Hedef = kaynak ise veya
 * çeviri başarısızsa orijinali döndürür.
 */
export async function translateText(
  text: string,
  target: string,
  source: string = "en",
): Promise<string> {
  const trimmed = (text || "").trim();
  if (!trimmed || target === source || target === DEFAULT_LOCALE) return text;

  const cacheKey = `oh:tr:${source}:${target}:${hash(trimmed)}`;
  const cached = await kvGet(cacheKey);
  if (cached != null) return cached;

  const out = await fetchTranslation(trimmed, target, source);
  if (out) {
    await kvSet(cacheKey, out);
    return out;
  }
  return text; // başarısızlık: orijinal
}

/** Birden çok metni paralel çevirir (her biri ayrı önbellekli). */
export async function translateMany(texts: string[], target: string, source = "en"): Promise<string[]> {
  return Promise.all(texts.map((t) => translateText(t, target, source)));
}

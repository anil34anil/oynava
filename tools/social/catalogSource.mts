/**
 * Fabrikanın "katalog kaynağı" — src/lib/games.ts'teki CANLI feed birleştirmesinden
 * KASITLI olarak farklıdır: burada sadece commit'lenmiş seed JSON dosyaları okunur.
 *
 * Neden: canlı feed'ler (GameDistribution/GamePix/GameMonetize) saatlik döner ve
 * sayfalıdır (ilk birkaç yüz oyun) — "yeni oyun" tespiti ve tekrar-üretilebilirlik
 * için kararlı bir küme değildir. Seed dosyaları ise projede zaten "kataloğun
 * gerçek kaynağı" (bkz. CLAUDE.md/RULES.md) — bir oyun sitede kalıcı olarak
 * görünsün istiyorsak zaten seed'e girer (BlokKraft, 48 yeni Playgama oyunu gibi).
 * Böylece fabrika, siteyle aynı "gerçek" oyun kümesi üzerinde çalışır.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { categorySlug, type Game } from "../../src/lib/catalog.ts";
import type { ProviderId } from "./types.mts";

import ovSeed from "../../src/data/games.originals.seed.json" with { type: "json" };
import pgmSeed from "../../src/data/games.pgm.seed.json" with { type: "json" };
import gdSeed from "../../src/data/games.gd.seed.json" with { type: "json" };
import gpSeed from "../../src/data/games.gp.seed.json" with { type: "json" };
import gmSeed from "../../src/data/games.seed.json" with { type: "json" };

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const projectRoot = ROOT;

export function providerOf(game: Game): ProviderId {
  if (game.id.startsWith("ov-")) return "originals";
  if (game.id.startsWith("pgm-")) return "playgama";
  if (game.id.startsWith("gd-")) return "gamedistribution";
  if (game.id.startsWith("gp-")) return "gamepix";
  return "gamemonetize"; // GameMonetize id'leri düz sayısal (ör. "81366")
}

export type CatalogGame = Game & { providerId: ProviderId; categorySlug: string };

/** Tüm seed kaynaklarını tek, sağlayıcı-etiketli listede birleştirir (id'ye göre tekil). */
export function loadCatalog(): CatalogGame[] {
  const all = [
    ...(ovSeed as Game[]),
    ...(pgmSeed as Game[]),
    ...(gdSeed as Game[]),
    ...(gpSeed as Game[]),
    ...(gmSeed as Game[]),
  ].filter((g) => g.id && g.url);

  const seen = new Set<string>();
  const out: CatalogGame[] = [];
  for (const g of all) {
    if (seen.has(g.id)) continue;
    seen.add(g.id);
    out.push({ ...g, providerId: providerOf(g), categorySlug: categorySlug(g) });
  }
  return out;
}

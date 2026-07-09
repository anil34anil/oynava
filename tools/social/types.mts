/**
 * OYNAVA Social Media Factory — paylaşılan tipler.
 * Tüm alt modüller (providers, media, video, captions) bunları kullanır.
 */
import type { Game } from "../../src/lib/catalog.ts";

export type { Game };

/** Kaynak sağlayıcı kimliği — Game.id önekiyle bire bir eşleşir (bkz. providers/registry.mts). */
export type ProviderId = "playgama" | "gamemonetize" | "gamedistribution" | "gamepix" | "originals";

/**
 * Medya kalite kademesi — spesifikasyondaki öncelik sırası (yüksekten düşüğe).
 * `rank` küçük = daha iyi; sıralama ve "ilk bulunanı kullanma, en kaliteliyi seç"
 * mantığında karşılaştırma anahtarı olarak kullanılır.
 */
export const MEDIA_TIERS = [
  "preview",            // sağlayıcının resmi önizleme klibi
  "trailer",            // resmi tanıtım videosu
  "gameplay",           // gerçek oynanış kaydı (ör. kendi Originals oyunlarımız — Playwright ile)
  "animated_thumbnail",  // WebP/GIF döngüsü şeklinde canlı küçük resim
  "gif",
  "thumbnail",          // statik görsel (her zaman mevcut — son çare)
] as const;
export type MediaTier = (typeof MEDIA_TIERS)[number];
export const tierRank = (t: MediaTier): number => MEDIA_TIERS.indexOf(t);

export type MediaCandidate = {
  tier: MediaTier;
  url: string;
  isVideo: boolean;
  providerId: ProviderId;
  /** 0-100 — çözünürlük + kademe ağırlığına göre hesaplanır (bkz. media/selector.mts). */
  qualityScore: number;
  width?: number;
  height?: number;
  /**
   * true ise `url` indirilecek bir medya dosyası değil, Playwright'in canlı
   * kayıt yapacağı bir sayfadır (bkz. providers/originals.mts — kendi
   * oyunlarımız reklamsız/aynı-origin olduğu için otomatik oynanış kaydı
   * güvenle alınabilir; üçüncü taraf iframe'lerde bu denenmez).
   */
  capture?: boolean;
};

/** Bir oyun için seçilen nihai medya + kaynağı. */
export type SelectedMedia = {
  game: Game;
  providerId: ProviderId;
  candidate: MediaCandidate | null; // null = hiç medya bulunamadı (rapora düşer)
  /** Aynı oyunun diğer sağlayıcılardaki kopyaları (duplicate-detection sonucu, bilgi amaçlı). */
  duplicateOf?: string[];
};

export type Platform = "youtube" | "tiktok" | "instagram";

export type CaptionSet = {
  youtube: { title: string; description: string; hashtags: string[] };
  tiktok: { description: string; hashtags: string[] };
  instagram: { description: string; hashtags: string[] };
};

export type JobStatus = "done" | "failed" | "skipped_no_media" | "skipped_duplicate" | "skipped_no_video";

export type LedgerEntry = {
  status: JobStatus;
  tier?: MediaTier;
  providerId?: ProviderId;
  outputDir?: string;
  error?: string;
  processedAt: string; // ISO
};

export type Ledger = Record<string, LedgerEntry>; // key = game.id

export type SocialConfig = {
  concurrency: number;
  outputDir: string;
  cacheDir: string;
  stateFile: string;
  providers: Record<ProviderId, { enabled: boolean }>;
  video: {
    width: number;
    height: number;
    fps: number;
    minDurationSec: number;
    maxDurationSec: number;
    defaultDurationSec: number;
    codec: string;
    crf: number;
    preset: string;
    endCardSec: number;
    endCardText: string;
  };
  brand: {
    name: string;
    url: string;
    colors: { bg: string; accent: string; accent2: string; ink: string };
    fonts: { display: string; body: string };
    logoPath: string;
    logoScaleW: number;
  };
  captions: {
    youtubeTitleMax: number;
    youtubeDescMax: number;
    tiktokDescMax: number;
    instagramDescMax: number;
    maxHashtagsYoutube: number;
    maxHashtagsTiktok: number;
    maxHashtagsInstagram: number;
    brandHashtags: string[];
    genericHashtags: string[];
    categoryHashtags: Record<string, string[]>;
  };
  qualityWeights: Record<MediaTier, number>;
};

/**
 * Video şablonu arayüzü — YENİ ŞABLON EKLEMEK İÇİN:
 *  1) templates/<isim>.mts içinde bu arayüzü uygulayan bir fonksiyon yaz
 *  2) registry.mts'e kayıt satırı ekle
 * Şablon, `[base]` etiketli 1080x1920/fps bir video filtre-zinciri üretir;
 * marka bindirmesi (branding.mts) bunun üzerine eklenir — şablonlar markadan
 * habersizdir, tek sorumlulukları "medyayı doğru boyut/süreye getirmek".
 */
import type { SocialConfig } from "../../types.mts";

export type TemplateInput = {
  /** Yerel dosya yolu (önbellekten inen görsel/video veya Playwright kaydı). */
  mediaPath: string;
  config: SocialConfig;
  /** Kaynağın gerçek süresi (video ise saniye; görsel ise 0). */
  sourceDurationSec: number;
};

export type TemplateOutput = {
  /** ffmpeg'e `-i` olarak verilecek ek argümanlar (ör. -loop 1) dahil giriş tanımı. */
  inputArgs: string[];
  /** `[0:v]...[base]` üreten filtre grafiği parçası (branding.mts bunu genişletir). */
  filterGraph: string;
  /** Nihai video süresi (saniye) — branding'in son-kart zamanlamasını hesaplaması için. */
  durationSec: number;
};

export type VideoTemplate = (input: TemplateInput) => TemplateOutput;

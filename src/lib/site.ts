/**
 * Site geneli kimlik & yasal bilgiler — TEK kaynak.
 * Yasal sayfalar (künye, veri koruma, vb.) buradan okur.
 *
 * ⚠️ DOLDUR: Aşağıdaki "TODO" alanları KENDİ gerçek bilgilerinle değiştirilmeli.
 * Künye/iletişim bilgileri yasal olarak doğru ve sana ait olmak zorundadır
 * (uydurma bilgi koyma). Domain alınca e-posta/adresi güncelle.
 */

export const SITE = {
  name: "OYNAVA",
  slogan: "Bir tık, bin oyun",
  // TODO: gerçek domainini yaz
  domain: "oynava.com",
  url: "https://oynava.com",
  launchYear: 2026,

  // Google AdSense yayıncı kimliği (herkese açık; sayfa kaynağında zaten görünür).
  adsenseClient: "ca-pub-1026618703580570",

  // Google Search Console doğrulama token'ı (meta yöntemi). GSC'de site eklenince
  // verilen "content" değerini buraya yapıştır; <head>'e otomatik eklenir.
  googleSiteVerification: "",

  // Google ile Giriş (Google Identity Services) — OAuth Client ID.
  // console.cloud.google.com → OAuth client (Web) → yetkili origin: https://oynava.com
  // Boşsa "Google ile giriş" butonu gizlenir; e-posta girişi yine çalışır.
  googleClientId: "",

  // Site sahibi bilgileri (KVKK "Veri Sorumlusu").
  // Bireysel, reklam destekli aşamada: e-posta ile iletişim; adres yayınlanmıyor.
  // Para ile satışa geçince (e-ticaret) bir adres (örn. sanal ofis) eklenmeli.
  legal: {
    // İstersen gerçek ad-soyadınla değiştir; bireysel hizmet için marka adı da olur.
    operator: "OYNAVA (bireysel hizmet)",
    // Vergi/sicil kaydın varsa yaz; yoksa boş bırak (gizlenir).
    taxOrRegistry: "",
    // Adres yayınlamak istemiyorsan boş bırak (künyede gizlenir).
    address: "",
    // Tüm iletişim tek adres üzerinden:
    contactEmail: "oynava@outlook.com",
    abuseEmail: "oynava@outlook.com",
    partnerEmail: "oynava@outlook.com",
  },

  // Oyun ve reklam sağlayıcıları (doğru — sitede gerçekten kullanılıyor)
  gameProviders: ["GameMonetize", "GameDistribution"],
  adProviders: ["Google AdSense", "GameMonetize", "GameDistribution"],
} as const;

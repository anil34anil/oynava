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
  // Vercel'de apex (oynava.com) www'ye 308 yönlendirme yapıyor; gerçek (yönlendirmesiz)
  // adres www'li olduğu için canonical/sitemap/JSON-LD hep bunu kullanmalı.
  url: "https://www.oynava.com",
  launchYear: 2026,

  // Google AdSense yayıncı kimliği (herkese açık; sayfa kaynağında zaten görünür).
  adsenseClient: "ca-pub-1026618703580570",

  // Google Analytics (GA4) ölçüm kimliği. Boşsa GA scripti eklenmez.
  gaMeasurementId: "G-CBZQ2XXFCY",

  // Google Search Console doğrulama token'ı (meta yöntemi). GSC'de site eklenince
  // verilen "content" değerini buraya yapıştır; <head>'e otomatik eklenir.
  googleSiteVerification: "",

  // Google ile Giriş (Google Identity Services) — OAuth Client ID.
  // console.cloud.google.com → OAuth client (Web) → yetkili origin: https://oynava.com
  // Boşsa "Google ile giriş" butonu gizlenir; e-posta girişi yine çalışır.
  googleClientId: "399656444068-385ogelqn0v7f5mhgf82p4s6hu24ckpc.apps.googleusercontent.com",

  // Facebook ile giriş — Facebook for Developers'ta uygulama açıp App ID al.
  // Boşsa buton "yakında" durumunda gösterilir (kurulum tamamlanınca aktifleşir).
  facebookAppId: "",
  // Apple ile giriş — Apple Developer hesabı (yıllık ücretli) + Service ID gerekir.
  // Boşsa buton "yakında" durumunda gösterilir.
  appleClientId: "",

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

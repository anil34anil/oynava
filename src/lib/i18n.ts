/**
 * Çoklu dil (i18n) yapılandırması. Varsayılan Türkçe; diğer diller ülkeye göre
 * otomatik seçilir veya kullanıcı dil seçiciyle değiştirir.
 *
 * Arayüz metinleri statik sözlükten (UI) gelir; oyun başlık/açıklamaları gibi
 * dinamik içerik `translate.ts` ile (ücretsiz + Redis önbellekli) çevrilir.
 */

export const DEFAULT_LOCALE = "tr" as const;

// Sitenin gösterildiği ülkelere göre diller (Search Console listesinden).
// cc = bayrak için ülke kodu (flagcdn görselleri; Windows emoji bayraklarını çizmiyor).
export const LOCALES = [
  { code: "tr", name: "Türkçe", flag: "🇹🇷", cc: "tr", dir: "ltr" },
  { code: "en", name: "English", flag: "🇬🇧", cc: "gb", dir: "ltr" },
  { code: "nl", name: "Nederlands", flag: "🇳🇱", cc: "nl", dir: "ltr" },
  { code: "es", name: "Español", flag: "🇪🇸", cc: "es", dir: "ltr" },
  { code: "ko", name: "한국어", flag: "🇰🇷", cc: "kr", dir: "ltr" },
  { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩", cc: "id", dir: "ltr" },
  { code: "az", name: "Azərbaycan", flag: "🇦🇿", cc: "az", dir: "ltr" },
  { code: "ar", name: "العربية", flag: "🇪🇬", cc: "eg", dir: "rtl" },
] as const;

export type Locale = (typeof LOCALES)[number]["code"];

export const LOCALE_CODES = LOCALES.map((l) => l.code) as Locale[];

export function isLocale(x: string | undefined | null): x is Locale {
  return !!x && (LOCALE_CODES as string[]).includes(x);
}

/** Bir yolu dile göre önekler (tr → öneksiz). Sunucu+istemci ortak kullanılır. */
export function localePath(path: string, locale: string): string {
  if (locale === DEFAULT_LOCALE) return path;
  if (path === "/") return `/${locale}`;
  return `/${locale}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function localeMeta(code: string) {
  return LOCALES.find((l) => l.code === code) ?? LOCALES[0];
}

export function localeDir(code: string): "ltr" | "rtl" {
  return localeMeta(code).dir as "ltr" | "rtl";
}

// Ülke (ISO-2) → dil eşlemesi (otomatik yönlendirme için).
export const COUNTRY_LOCALE: Record<string, Locale> = {
  TR: "tr", NL: "nl", ES: "es", CO: "es", KR: "ko", ID: "id",
  AZ: "az", EG: "ar", GB: "en", IN: "en", PH: "en", US: "en",
};

/** Arayüz (statik) metinleri. Eksik anahtar/dil İngilizce'ye, o da yoksa anahtara düşer. */
export const UI: Record<string, Record<string, string>> = {
  tr: {
    "nav.online": "Online Oyunlar", "nav.fps": "FPS / Nişancı", "nav.premium": "Premium Oyunlar",
    "nav.all": "Tüm Oyunlar", "nav.blog": "Blog", "nav.favorites": "Favorilerim", "nav.categories": "Kategoriler",
    "home.popular": "Popüler Oyunlar", "common.playNow": "Oyna", "common.seeAll": "Tümünü gör",
    "common.search": "Oyun ara... (örn. yarış, futbol, zombi)", "common.login": "Giriş yap",
    "common.games": "oyun", "common.menu": "Menü",
    "action.like": "Beğen", "action.dislike": "Beğenme", "action.favorite": "Favori",
    "action.share": "Paylaş", "action.fullscreen": "Tam Ekran",
    "cat.aksiyon": "Aksiyon", "cat.macera": "Macera", "cat.yaris": "Yarış", "cat.spor": "Spor",
    "cat.dovus": "Dövüş", "cat.bulmaca": "Bulmaca", "cat.zeka": "Zekâ & Strateji", "cat.io": ".io Oyunları",
    "cat.kiz": "Kız Oyunları", "cat.cocuk": "Çocuk", "cat.arcade": "Arcade", "cat.3d": "3D Oyunlar",
  },
  en: {
    "nav.online": "Online Games", "nav.fps": "FPS / Shooter", "nav.premium": "Premium Games",
    "nav.all": "All Games", "nav.blog": "Blog", "nav.favorites": "Favorites", "nav.categories": "Categories",
    "home.popular": "Popular Games", "common.playNow": "Play", "common.seeAll": "See all",
    "common.search": "Search games... (e.g. racing, football, zombie)", "common.login": "Sign in",
    "common.games": "games", "common.menu": "Menu",
    "action.like": "Like", "action.dislike": "Dislike", "action.favorite": "Favorite",
    "action.share": "Share", "action.fullscreen": "Fullscreen",
    "cat.aksiyon": "Action", "cat.macera": "Adventure", "cat.yaris": "Racing", "cat.spor": "Sports",
    "cat.dovus": "Fighting", "cat.bulmaca": "Puzzle", "cat.zeka": "Brain & Strategy", "cat.io": ".io Games",
    "cat.kiz": "Girls", "cat.cocuk": "Kids", "cat.arcade": "Arcade", "cat.3d": "3D Games",
  },
  nl: {
    "nav.online": "Online Spellen", "nav.fps": "FPS / Schutter", "nav.premium": "Premium Spellen",
    "nav.all": "Alle Spellen", "nav.blog": "Blog", "nav.favorites": "Favorieten", "nav.categories": "Categorieën",
    "home.popular": "Populaire Spellen", "common.playNow": "Speel", "common.seeAll": "Bekijk alles",
    "common.search": "Zoek games... (bijv. racen, voetbal, zombie)", "common.login": "Inloggen",
    "common.games": "spellen", "common.menu": "Menu",
    "action.like": "Leuk", "action.dislike": "Niet leuk", "action.favorite": "Favoriet",
    "action.share": "Delen", "action.fullscreen": "Volledig scherm",
    "cat.aksiyon": "Actie", "cat.macera": "Avontuur", "cat.yaris": "Racen", "cat.spor": "Sport",
    "cat.dovus": "Vechten", "cat.bulmaca": "Puzzel", "cat.zeka": "Brein & Strategie", "cat.io": ".io-spellen",
    "cat.kiz": "Meisjes", "cat.cocuk": "Kinderen", "cat.arcade": "Arcade", "cat.3d": "3D-spellen",
  },
  es: {
    "nav.online": "Juegos en línea", "nav.fps": "FPS / Disparos", "nav.premium": "Juegos premium",
    "nav.all": "Todos los juegos", "nav.blog": "Blog", "nav.favorites": "Favoritos", "nav.categories": "Categorías",
    "home.popular": "Juegos populares", "common.playNow": "Jugar", "common.seeAll": "Ver todo",
    "common.search": "Buscar juegos... (p. ej. carreras, fútbol, zombis)", "common.login": "Iniciar sesión",
    "common.games": "juegos", "common.menu": "Menú",
    "action.like": "Me gusta", "action.dislike": "No me gusta", "action.favorite": "Favorito",
    "action.share": "Compartir", "action.fullscreen": "Pantalla completa",
    "cat.aksiyon": "Acción", "cat.macera": "Aventura", "cat.yaris": "Carreras", "cat.spor": "Deportes",
    "cat.dovus": "Lucha", "cat.bulmaca": "Rompecabezas", "cat.zeka": "Cerebro y estrategia", "cat.io": "Juegos .io",
    "cat.kiz": "Chicas", "cat.cocuk": "Niños", "cat.arcade": "Arcade", "cat.3d": "Juegos 3D",
  },
  ko: {
    "nav.online": "온라인 게임", "nav.fps": "FPS / 슈터", "nav.premium": "프리미엄 게임",
    "nav.all": "모든 게임", "nav.blog": "블로그", "nav.favorites": "즐겨찾기", "nav.categories": "카테고리",
    "home.popular": "인기 게임", "common.playNow": "플레이", "common.seeAll": "모두 보기",
    "common.search": "게임 검색... (예: 레이싱, 축구, 좀비)", "common.login": "로그인",
    "common.games": "게임", "common.menu": "메뉴",
    "action.like": "좋아요", "action.dislike": "싫어요", "action.favorite": "즐겨찾기",
    "action.share": "공유", "action.fullscreen": "전체 화면",
    "cat.aksiyon": "액션", "cat.macera": "어드벤처", "cat.yaris": "레이싱", "cat.spor": "스포츠",
    "cat.dovus": "격투", "cat.bulmaca": "퍼즐", "cat.zeka": "두뇌 & 전략", "cat.io": ".io 게임",
    "cat.kiz": "여아 게임", "cat.cocuk": "어린이", "cat.arcade": "아케이드", "cat.3d": "3D 게임",
  },
  id: {
    "nav.online": "Game Online", "nav.fps": "FPS / Penembak", "nav.premium": "Game Premium",
    "nav.all": "Semua Game", "nav.blog": "Blog", "nav.favorites": "Favorit", "nav.categories": "Kategori",
    "home.popular": "Game Populer", "common.playNow": "Main", "common.seeAll": "Lihat semua",
    "common.search": "Cari game... (mis. balap, sepak bola, zombie)", "common.login": "Masuk",
    "common.games": "game", "common.menu": "Menu",
    "action.like": "Suka", "action.dislike": "Tidak suka", "action.favorite": "Favorit",
    "action.share": "Bagikan", "action.fullscreen": "Layar penuh",
    "cat.aksiyon": "Aksi", "cat.macera": "Petualangan", "cat.yaris": "Balap", "cat.spor": "Olahraga",
    "cat.dovus": "Pertarungan", "cat.bulmaca": "Teka-teki", "cat.zeka": "Otak & Strategi", "cat.io": "Game .io",
    "cat.kiz": "Game Cewek", "cat.cocuk": "Anak-anak", "cat.arcade": "Arcade", "cat.3d": "Game 3D",
  },
  az: {
    "nav.online": "Onlayn Oyunlar", "nav.fps": "FPS / Atıcı", "nav.premium": "Premium Oyunlar",
    "nav.all": "Bütün Oyunlar", "nav.blog": "Bloq", "nav.favorites": "Sevimlilər", "nav.categories": "Kateqoriyalar",
    "home.popular": "Populyar Oyunlar", "common.playNow": "Oyna", "common.seeAll": "Hamısına bax",
    "common.search": "Oyun axtar... (məs. yarış, futbol, zombi)", "common.login": "Daxil ol",
    "common.games": "oyun", "common.menu": "Menyu",
    "action.like": "Bəyən", "action.dislike": "Bəyənmə", "action.favorite": "Sevimli",
    "action.share": "Paylaş", "action.fullscreen": "Tam ekran",
    "cat.aksiyon": "Aksiya", "cat.macera": "Macəra", "cat.yaris": "Yarış", "cat.spor": "İdman",
    "cat.dovus": "Döyüş", "cat.bulmaca": "Tapmaca", "cat.zeka": "Beyin & Strategiya", "cat.io": ".io Oyunları",
    "cat.kiz": "Qız Oyunları", "cat.cocuk": "Uşaqlar", "cat.arcade": "Arkada", "cat.3d": "3D Oyunlar",
  },
  ar: {
    "nav.online": "ألعاب أونلاين", "nav.fps": "FPS / تصويب", "nav.premium": "ألعاب مميزة",
    "nav.all": "جميع الألعاب", "nav.blog": "مدونة", "nav.favorites": "المفضلة", "nav.categories": "الفئات",
    "home.popular": "ألعاب شائعة", "common.playNow": "العب", "common.seeAll": "عرض الكل",
    "common.search": "ابحث عن ألعاب... (مثل سباق، كرة قدم، زومبي)", "common.login": "تسجيل الدخول",
    "common.games": "لعبة", "common.menu": "القائمة",
    "action.like": "إعجاب", "action.dislike": "عدم إعجاب", "action.favorite": "مفضلة",
    "action.share": "مشاركة", "action.fullscreen": "ملء الشاشة",
    "cat.aksiyon": "أكشن", "cat.macera": "مغامرة", "cat.yaris": "سباق", "cat.spor": "رياضة",
    "cat.dovus": "قتال", "cat.bulmaca": "ألغاز", "cat.zeka": "ذكاء واستراتيجية", "cat.io": "ألعاب .io",
    "cat.kiz": "ألعاب البنات", "cat.cocuk": "أطفال", "cat.arcade": "أركيد", "cat.3d": "ألعاب ثلاثية الأبعاد",
  },
};

// Ek arayüz anahtarları (oyun sayfası başlıkları, breadcrumb vb.)
const EXTRA: Record<string, Record<string, string>> = {
  tr: { "game.howToPlay": "Nasıl Oynanır?", "game.about": "Hakkında", "game.similar": "Benzer Oyunlar", "game.tags": "Etiketler", "nav.home": "Ana Sayfa", "common.gamesCount": "oyun", "nav.random": "Rastgele Oyun", "nav.mostPlayed": "En Çok Oynanan", "game.plays": "kez oynandı" },
  en: { "game.howToPlay": "How to Play?", "game.about": "About", "game.similar": "Similar Games", "game.tags": "Tags", "nav.home": "Home", "common.gamesCount": "games", "nav.random": "Random Game", "nav.mostPlayed": "Most Played", "game.plays": "plays" },
  nl: { "game.howToPlay": "Hoe te spelen?", "game.about": "Over", "game.similar": "Soortgelijke spellen", "game.tags": "Labels", "nav.home": "Home", "common.gamesCount": "spellen", "nav.random": "Willekeurig spel", "nav.mostPlayed": "Meest gespeeld", "game.plays": "keer gespeeld" },
  es: { "game.howToPlay": "¿Cómo jugar?", "game.about": "Acerca de", "game.similar": "Juegos similares", "game.tags": "Etiquetas", "nav.home": "Inicio", "common.gamesCount": "juegos", "nav.random": "Juego aleatorio", "nav.mostPlayed": "Más jugados", "game.plays": "partidas" },
  ko: { "game.howToPlay": "플레이 방법", "game.about": "게임 소개", "game.similar": "비슷한 게임", "game.tags": "태그", "nav.home": "홈", "common.gamesCount": "게임", "nav.random": "랜덤 게임", "nav.mostPlayed": "최다 플레이", "game.plays": "회 플레이" },
  id: { "game.howToPlay": "Cara Bermain", "game.about": "Tentang", "game.similar": "Game Serupa", "game.tags": "Tag", "nav.home": "Beranda", "common.gamesCount": "game", "nav.random": "Game Acak", "nav.mostPlayed": "Paling Banyak Dimainkan", "game.plays": "kali dimainkan" },
  az: { "game.howToPlay": "Necə Oynamalı", "game.about": "Haqqında", "game.similar": "Oxşar Oyunlar", "game.tags": "Teqlər", "nav.home": "Ana səhifə", "common.gamesCount": "oyun", "nav.random": "Təsadüfi Oyun", "nav.mostPlayed": "Ən Çox Oynanan", "game.plays": "dəfə oynanıb" },
  ar: { "game.howToPlay": "كيف تلعب؟", "game.about": "حول اللعبة", "game.similar": "ألعاب مماثلة", "game.tags": "الوسوم", "nav.home": "الرئيسية", "common.gamesCount": "لعبة", "nav.random": "لعبة عشوائية", "nav.mostPlayed": "الأكثر لعباً", "game.plays": "مرة لعب" },
};
for (const l of Object.keys(EXTRA)) Object.assign(UI[l], EXTRA[l]);

/** Statik arayüz metni getir. */
export function t(locale: string, key: string): string {
  return UI[locale]?.[key] ?? UI.en[key] ?? UI.tr[key] ?? key;
}

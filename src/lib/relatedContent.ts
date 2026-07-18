/**
 * Blog ↔ Kategori/Koleksiyon çift yönlü iç linkleme (SEO: konu otoritesi + link
 * denkliği akışı). Anahtar kelime eşleştirmesi yalnızca ÇOK KELİMELİ, spesifik
 * Türkçe ifadeler üzerinden yapılır (ör. "araba oyunları", tek başına "oyun"
 * değil) — yanlış-pozitif/anlamsız eşleşme riski böylece düşük tutulur.
 */
import { CATEGORIES } from "./catalog";
import { COLLECTIONS } from "./collections";
import { POSTS, type Post } from "./blog";
import { SITE } from "./site";

export type RelatedLink = { label: string; href: string };

// Kategoriler oyun sınıflandırması için İNGİLİZCE `match` kullanır (game.tags/category
// alanları İngilizce); blog metni Türkçe olduğundan burada ayrı, Türkçe bir eşleştirme
// listesi tutuyoruz. Yalnızca gerçekten o kategoriyi işaret eden spesifik ifadeler.
const CATEGORY_TR_KEYWORDS: Record<string, string[]> = {
  aksiyon: ["aksiyon oyun", "nişancı oyun", "silahlı oyun"],
  macera: ["macera oyun"],
  yaris: ["araba oyun", "yarış oyun", "ralli oyun", "drift oyun", "motor oyun"],
  spor: ["spor oyun", "futbol oyun", "basketbol oyun"],
  dovus: ["dövüş oyun", "boks oyun"],
  bulmaca: ["bulmaca oyun", "eşleştirme oyun", "sudoku"],
  zeka: ["strateji oyun", "zeka oyun", "satranç", "tavla"],
  io: [".io oyun", "io oyun"],
  kiz: ["kız oyun", "giydirme oyun", "makyaj oyun"],
  cocuk: ["çocuk oyun", "eğitici oyun"],
  arcade: ["arcade oyun"],
  "3d": ["3d oyun", "3 boyutlu oyun"],
};

type Scored<T> = { item: T; score: number };

function scoreText(haystack: string, needles: string[]): number {
  let score = 0;
  for (const n of needles) {
    if (haystack.includes(n.toLowerCase())) score++;
  }
  return score;
}

function textOfPost(p: Post): string {
  return `${p.title} ${p.excerpt} ${p.body.join(" ")}`.toLowerCase();
}

/** Bir blog yazısı için ilgili kategori + koleksiyon linkleri (en çok 4). */
export function relatedLinksForPost(post: Post): RelatedLink[] {
  const text = textOfPost(post);

  const catHits: Scored<{ slug: string; tr: string }>[] = CATEGORIES.map((c) => ({
    item: c,
    score: scoreText(text, CATEGORY_TR_KEYWORDS[c.slug] ?? []),
  })).filter((x) => x.score > 0);

  const colHits: Scored<{ slug: string; title: string }>[] = COLLECTIONS.map((c) => ({
    item: c,
    score: scoreText(text, c.keywords),
  })).filter((x) => x.score > 0);

  // Koleksiyonlar daha spesifik (long-tail) → önce onlar; eşit skorda ilk bulunan kalır.
  const links: RelatedLink[] = [
    ...colHits
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((x) => ({ label: x.item.title, href: `/${x.item.slug}` })),
    ...catHits
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map((x) => ({ label: x.item.tr, href: `/kategori/${x.item.slug}` })),
  ];

  // Aynı href'in tekrarını at, toplamda en fazla 4 link göster (spam görünümünden kaçın).
  const seen = new Set<string>();
  return links.filter((l) => (seen.has(l.href) ? false : (seen.add(l.href), true))).slice(0, 4);
}

/** Bir kategori/koleksiyon sayfası için ilgili blog yazıları (en çok 3). */
export function relatedPostsFor(matchKeywords: string[]): RelatedLink[] {
  const hits = POSTS.map((p) => ({ item: p, score: scoreText(textOfPost(p), matchKeywords) })).filter(
    (x) => x.score > 0,
  );
  return hits
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((x) => ({ label: x.item.title, href: `/blog/${x.item.slug}` }));
}

export function relatedPostsForCategorySlug(slug: string): RelatedLink[] {
  return relatedPostsFor(CATEGORY_TR_KEYWORDS[slug] ?? []);
}

export function relatedPostsForCollectionKeywords(keywords: string[]): RelatedLink[] {
  return relatedPostsFor(keywords);
}

export const SITE_URL = SITE.url;

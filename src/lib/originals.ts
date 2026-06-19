/** Oynava'ya özel (telifsiz) kendi oyunlarımız. */
export type Original = { slug: string; title: string; emoji: string; desc: string };

export const ORIGINALS: Original[] = [
  {
    slug: "golge-savascisi",
    title: "Gölge Savaşçısı",
    emoji: "🗡️",
    desc: "Dalga dalga gelen düşmanları yok et, seviye atla, hayatta kal.",
  },
  {
    slug: "neon-surus",
    title: "Neon Sürüş",
    emoji: "🏎️",
    desc: "Engellerden kaç, jetonları topla, hızlandıkça skoru yükselt.",
  },
];

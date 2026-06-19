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
  {
    slug: "zindan-avcisi",
    title: "Zindan Avcısı",
    emoji: "🛡️",
    desc: "Diablo türü aksiyon-RPG: ganimet topla, seviye atla, boss'ları yen.",
  },
];

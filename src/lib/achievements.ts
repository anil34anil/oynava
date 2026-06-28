/**
 * Başarımlar (rozetler) — tamamen localStorage istatistiklerinden hesaplanır.
 * Sunucuya bağlı değildir; etkileşim/engagement artırmak için.
 */
export type Stats = { played: number; favorites: number; streak: number };

export type Achievement = {
  id: string;
  icon: string;
  title: string;
  desc: string;
  need: number;
  stat: keyof Stats;
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-play", icon: "🎮", title: "İlk Adım", desc: "İlk oyununu oyna", need: 1, stat: "played" },
  { id: "play-10", icon: "🔥", title: "Isınıyor", desc: "10 oyun oyna", need: 10, stat: "played" },
  { id: "play-50", icon: "⭐", title: "Oyun Kurdu", desc: "50 oyun oyna", need: 50, stat: "played" },
  { id: "play-200", icon: "👑", title: "Efsane", desc: "200 oyun oyna", need: 200, stat: "played" },
  { id: "fav-5", icon: "❤️", title: "Koleksiyoncu", desc: "5 oyunu favorile", need: 5, stat: "favorites" },
  { id: "fav-20", icon: "💎", title: "Küratör", desc: "20 oyunu favorile", need: 20, stat: "favorites" },
  { id: "streak-3", icon: "📅", title: "Düzenli", desc: "3 gün üst üste gel", need: 3, stat: "streak" },
  { id: "streak-7", icon: "🏆", title: "Sadık Oyuncu", desc: "7 gün üst üste gel", need: 7, stat: "streak" },
];

export function isEarned(a: Achievement, s: Stats): boolean {
  return s[a.stat] >= a.need;
}

export function earnedCount(s: Stats): number {
  return ACHIEVEMENTS.reduce((n, a) => n + (isEarned(a, s) ? 1 : 0), 0);
}

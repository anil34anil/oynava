/**
 * Arka planda silik/sönük oyun karakterleri — modern karanlık tema dekoru.
 * Sabit (fixed), içeriğin ARKASINDA (-z-10), tıklamayı engellemez.
 */
const ICONS = ["👾", "🎮", "👻", "🕹️", "🎯", "🏎️", "🐉", "⚔️", "🛸", "🤖", "🦖", "🧙", "💣", "🏆", "🎲", "🚀"];

export function BackgroundDecor() {
  // Sabit bir desen üret (SSR/CSR tutarlı olsun diye rastgelelik yok).
  const cells = Array.from({ length: 120 }, (_, i) => ICONS[i % ICONS.length]);
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="flex h-full w-full flex-wrap content-start gap-x-12 gap-y-10 p-8 opacity-[0.04]">
        {cells.map((ic, i) => (
          <span
            key={i}
            className="select-none text-5xl"
            style={{ transform: `rotate(${(i % 5) * 8 - 16}deg)` }}
          >
            {ic}
          </span>
        ))}
      </div>
    </div>
  );
}

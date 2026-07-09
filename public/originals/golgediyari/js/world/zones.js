/**
 * ZoneSystem — açık dünya bölgeleri + spawn yönetimi.
 * M1: başlangıç bölgesi "Kül Ovası" — sabit noktalarda düşman sürüleri,
 * ölen sürüler gecikmeyle yeniden doğar (açık dünya hissi).
 * M4'te genişler: zindan portalı, boss odası, world event dalgaları.
 *
 * Sürü tanımı veri odaklı: yeni bölge/sürü eklemek = PACKS'e satır eklemek.
 */
const RESPAWN_SEC = 22;

/** Başlangıç bölgesi sürüleri: [x, z, tip, adet, eliteŞansı] */
const PACKS = [
  { x: 10, z: -6, type: "golge_kulu", n: 3, elite: 0.15 },
  { x: -12, z: -10, type: "golge_kulu", n: 4, elite: 0.15 },
  { x: 6, z: -16, type: "kemik_okcu", n: 2, elite: 0.2 },
  { x: -8, z: 12, type: "kemik_okcu", n: 3, elite: 0.2 },
  { x: 16, z: 10, type: "mezar_devi", n: 1, elite: 0.35 },
  { x: -18, z: -2, type: "mezar_devi", n: 1, elite: 0.35 },
  { x: 0, z: -22, type: "golge_kulu", n: 5, elite: 0.1 },
];

export function createZoneSystem() {
  // pack durumu: alive sayacı + respawn zamanlayıcı
  const state = PACKS.map(() => ({ alive: 0, timer: 0, members: new Set() }));

  function spawnPack(events, i) {
    const p = PACKS[i];
    const s = state[i];
    for (let n = 0; n < p.n; n++) {
      const a = (n / p.n) * Math.PI * 2;
      events.emit("enemy:spawn", {
        type: p.type,
        x: p.x + Math.sin(a) * 1.6,
        z: p.z + Math.cos(a) * 1.6,
        elite: Math.random() < p.elite,
      });
    }
  }

  return {
    name: "zones",

    init(ctx) {
      const { events, world } = ctx;
      // enemy:spawn sonrası en son yaratılan id'yi pakete bağlamak yerine
      // basit sayaç izleme: died olayında konuma en yakın paketi bul.
      events.on("enemy:died", ({ x, z, boss }) => {
        if (boss) return;
        let best = -1, bd = Infinity;
        PACKS.forEach((p, i) => {
          const d = (p.x - x) ** 2 + (p.z - z) ** 2;
          if (d < bd) { bd = d; best = i; }
        });
        if (best >= 0) {
          state[best].alive--;
          if (state[best].alive <= 0) state[best].timer = RESPAWN_SEC;
        }
      });
      // İlk spawn
      PACKS.forEach((p, i) => { state[i].alive = p.n; spawnPack(events, i); });
      void world;
    },

    update(ctx, dt) {
      const { events } = ctx;
      state.forEach((s, i) => {
        if (s.alive <= 0 && s.timer > 0) {
          s.timer -= dt;
          if (s.timer <= 0) { s.alive = PACKS[i].n; spawnPack(events, i); }
        }
      });
    },
  };
}

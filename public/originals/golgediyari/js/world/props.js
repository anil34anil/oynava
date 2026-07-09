/**
 * PropsSystem — dünya dekoru + bölge sınırları.
 * Prosedürel kayalar/dikilitaşlar (deterministik konum — seed'li) ve
 * oyuncu+düşmanların oynanabilir alan dışına çıkmasını önleyen clamp.
 * Bölgeler: Kül Ovası (merkez 0,0, r=34) · Kara Zindan (merkez 250,0, r=30).
 */
/* global THREE */
import { Assets } from "../core/assets.js";

export const REGIONS = {
  ova:   { cx: 0, cz: 0, r: 34, tr: "Kül Ovası" },
  zindan: { cx: 250, cz: 0, r: 30, tr: "Kara Zindan" },
};

export function regionAt(x) { return x > 150 ? REGIONS.zindan : REGIONS.ova; }

export function createPropsSystem() {
  return {
    name: "props",

    init(ctx) {
      const { three } = ctx;
      // Deterministik sözde-rastgele (her açılışta aynı dünya)
      let s = 42;
      const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;

      // Bölge içi dekor karışımı: ova = ağaç+kaya+kristal, zindan = sütun+kristal+kaya
      const MIX = {
        ova: ["tree", "tree", "rock", "rock", "rock", "crystal", "pillar"],
        zindan: ["pillar", "pillar", "rock", "crystal", "crystal", "rock"],
      };
      for (const [key, reg] of Object.entries(REGIONS)) {
        const mix = MIX[key];
        for (let i = 0; i < 34; i++) {
          const a = rnd() * Math.PI * 2;
          const d = reg.r * (0.35 + rnd() * 0.62);
          const x = reg.cx + Math.sin(a) * d, z = reg.cz + Math.cos(a) * d;
          if (Math.hypot(x - reg.cx, z - reg.cz) < 7) continue;   // merkez boş
          if (Math.hypot(x - reg.cx, z - 20) < 4) continue;       // portal önü boş
          const p = Assets.prop(mix[(rnd() * mix.length) | 0], rnd);
          p.position.set(x, 0, z);
          p.rotation.y = rnd() * Math.PI * 2;
          three.scene.add(p);
        }
        // Sınır dikilitaş çemberi (görsel ipucu)
        for (let i = 0; i < 16; i++) {
          const a = (i / 16) * Math.PI * 2;
          const p = Assets.prop("pillar", rnd);
          p.position.set(reg.cx + Math.sin(a) * reg.r, 0, reg.cz + Math.cos(a) * reg.r);
          three.scene.add(p);
        }
      }
    },

    update(ctx) {
      const { world } = ctx;
      // Oyuncu + düşmanlar bölge çemberi içinde kalır
      for (const id of world.query("transform", "team")) {
        const t = world.get(id, "transform");
        const reg = regionAt(t.x);
        const dx = t.x - reg.cx, dz = t.z - reg.cz;
        const d = Math.hypot(dx, dz);
        if (d > reg.r - 1) {
          const k = (reg.r - 1) / d;
          t.x = reg.cx + dx * k;
          t.z = reg.cz + dz * k;
        }
      }
    },
  };
}

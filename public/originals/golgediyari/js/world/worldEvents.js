/**
 * WorldEventSystem — "Gölge İstilası" (World Event sistemi).
 * Periyodik olarak (istila arası ~75 sn) oyuncunun yakınında dalga halinde
 * düşman belirir; duyuru bandı gösterilir. Dalga temizlenirse bonus altın +
 * XP yağmuru. Yalnız Kül Ovası'nda tetiklenir (zindanı bölmez).
 * Yayınlar: worldevent:start, worldevent:cleared
 */
import { regionAt, REGIONS } from "./props.js";

const INTERVAL = 75;
const WAVE = [
  { type: "golge_kulu", n: 6, elite: 0.25 },
  { type: "kemik_okcu", n: 3, elite: 0.3 },
];

export function createWorldEventSystem() {
  let timer = 25; // ilk istila erken gelsin (oyuncu sistemi hemen görsün)
  let active = false;
  let remaining = 0;
  let banner;

  function announce(text, color = "#c084fc") {
    banner.textContent = text;
    banner.style.color = color;
    banner.classList.remove("hidden");
    clearTimeout(announce._t);
    announce._t = setTimeout(() => banner.classList.add("hidden"), 3500);
  }

  return {
    name: "worldEvents",

    init(ctx) {
      banner = document.createElement("div");
      banner.className = "we-banner hidden";
      document.getElementById("hud").appendChild(banner);

      ctx.events.on("enemy:died", ({ tag }) => {
        if (!active || tag !== "istila") return;
        remaining--;
        if (remaining <= 0) {
          active = false;
          const bonus = 150 + Math.round(Math.random() * 100);
          ctx.inv.addGold(bonus);
          ctx.progress.addXp(250);
          announce(`İstila püskürtüldü! +${bonus} altın`, "#4ade80");
          ctx.events.emit("worldevent:cleared", {});
        }
      });
    },

    update(ctx, dt) {
      const { world, events } = ctx;
      if (active) return;
      const pid = world.first("player", "transform");
      if (pid === null || world.has(pid, "dead")) return;
      const pt = world.get(pid, "transform");
      if (regionAt(pt.x) !== REGIONS.ova) return; // yalnız ovada

      timer -= dt;
      if (timer > 0) return;
      timer = INTERVAL;

      // Dalga: oyuncunun çevresine halka şeklinde
      active = true;
      remaining = 0;
      for (const w of WAVE) {
        for (let i = 0; i < w.n; i++) {
          const a = Math.random() * Math.PI * 2;
          const d = 7 + Math.random() * 4;
          events.emit("enemy:spawn", {
            type: w.type,
            x: pt.x + Math.sin(a) * d,
            z: pt.z + Math.cos(a) * d,
            elite: Math.random() < w.elite,
            tag: "istila",
          });
          remaining++;
        }
      }
      announce("⚠ GÖLGE İSTİLASI! Dalgayı püskürt!");
      events.emit("worldevent:start", { count: remaining });
      ctx.cam.shake(0.5);
    },
  };
}

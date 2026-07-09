/**
 * DamageTextSystem — yüzen hasar sayıları (hit feedback).
 * "ui:dmgtext" olayını dinler; HUD katmanına div ekler, dünya konumunu her
 * karede ekrana iz düşürüp yukarı süzülerek soldurur. DOM havuzu ile GC dostu.
 */
export function createDamageTextSystem() {
  const active = []; // {el, x, z, y, t, life}
  const pool = [];
  let hud;

  function spawn({ x, z, amount, crit, isPlayer, heal }) {
    const el = pool.pop() ?? document.createElement("div");
    el.className = "dmg" + (crit ? " crit" : "") + (isPlayer ? " own" : "") + (heal ? " heal" : "");
    el.textContent = heal ? `+${amount}` : crit ? `${amount}!` : String(amount);
    hud.appendChild(el);
    active.push({ el, x: x + (Math.random() - 0.5) * 0.6, z, y: 1.8, t: 0, life: crit ? 1.0 : 0.75 });
  }

  return {
    name: "damageText",

    init(ctx) {
      hud = document.getElementById("hud");
      ctx.events.on("ui:dmgtext", spawn);
    },

    update(_ctx, dt) {
      for (let i = active.length - 1; i >= 0; i--) {
        const d = active[i];
        d.t += dt;
        d.y += 1.6 * dt;
        if (d.t >= d.life) {
          d.el.remove();
          pool.push(d.el);
          active.splice(i, 1);
        }
      }
    },

    render(ctx) {
      const p = { x: 0, y: 0, behind: false };
      for (const d of active) {
        ctx.cam.worldToScreen(d.x, d.y, d.z, p);
        d.el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%,-50%)`;
        d.el.style.opacity = String(Math.max(0, 1 - d.t / d.life));
        d.el.style.display = p.behind ? "none" : "block";
      }
    },
  };
}

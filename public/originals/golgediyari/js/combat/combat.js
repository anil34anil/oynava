/**
 * CombatSystem — hasar çözümü, can/mana, ölüm (adım 4'ün çekirdeği).
 *
 * TEK hasar kapısı: events.emit("combat:damage", {source, target, amount, tags})
 * Bütün saldırılar (oyuncu, düşman, skill, projectile) buradan geçer →
 * krit, i-frame, ölüm, hit feedback tek yerde. Yeni hasar kaynağı eklemek
 * için bu sisteme dokunmak GEREKMEZ.
 *
 * Bileşenler: health {hp,max}, mana {mp,max}, team {id}, damageable (etiket)
 * Yayınlar: combat:hit (uygulandı), combat:death, ui:dmgtext
 */
import { BALANCE } from "../config/balance.js";

export function createCombatSystem() {
  return {
    name: "combat",

    init(ctx) {
      const { world, events, cam } = ctx;

      events.on("combat:damage", ({ source, target, amount, critChance, tags = [] }) => {
        if (!world.isAlive(target) || !world.has(target, "health")) return;
        if (world.has(target, "invulnerable")) return;   // dodge i-frame
        if (world.has(target, "dead")) return;

        // Krit
        const cc = critChance ?? BALANCE.combat.critChance;
        const crit = Math.random() < cc;
        let final = amount * (crit ? BALANCE.combat.critMult : 1);
        // Zırh azaltması (ekipman — adım 8): armor/(armor+60) oranında keser
        const armor = world.get(target, "stats")?.armor ?? 0;
        if (armor > 0) final *= 1 - armor / (armor + 60);
        final = Math.max(1, Math.round(final));

        const h = world.get(target, "health");
        h.hp = Math.max(0, h.hp - final);

        const t = world.get(target, "transform");
        events.emit("combat:hit", { source, target, amount: final, crit, tags });
        if (t) events.emit("ui:dmgtext", { x: t.x, z: t.z, amount: final, crit, isPlayer: world.has(target, "player") });

        // Oyuncu vurulunca hafif, kritte güçlü sarsıntı
        if (world.has(target, "player")) cam.shake(0.35);
        else if (crit) cam.shake(0.18);

        if (h.hp <= 0) {
          world.add(target, "dead", { t: 0 });
          events.emit("combat:death", { id: target, killer: source });
        }
      });
    },

    update(ctx, dt) {
      const { world } = ctx;
      // Rejenerasyon (yalnız oyuncu; düşmanlar rejenerasyonsuz)
      const pid = world.first("player", "health");
      if (pid !== null && !world.has(pid, "dead")) {
        const h = world.get(pid, "health");
        h.hp = Math.min(h.max, h.hp + BALANCE.combat.hpRegen * dt);
        const m = world.get(pid, "mana");
        if (m) m.mp = Math.min(m.max, m.mp + BALANCE.combat.manaRegen * dt);
      }
    },
  };
}

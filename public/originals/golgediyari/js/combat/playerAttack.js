/**
 * PlayerAttackSystem — temel saldırı (skill'ler adım 9'da bunun üstüne gelir).
 * "attack" aksiyonu (J / gamepad A / mobil buton): imlecin baktığı yöne dön,
 * önündeki yay içindeki düşmanlara vur. Hasar = stats sistemi türetilmiş
 * değeri (yoksa balance taban değeri). Cooldown balance'tan.
 * Yayınlar: player:attack (animasyon/ses/efekt için).
 */
/* global THREE */
import { BALANCE } from "../config/balance.js";

export function createPlayerAttackSystem() {
  const groundHit = new THREE.Vector3();
  let cd = 0;

  return {
    name: "playerAttack",

    update(ctx, dt) {
      const { world, input, events, cam } = ctx;
      cd = Math.max(0, cd - dt);
      const pid = world.first("player", "transform");
      if (pid === null || world.has(pid, "dead")) return;
      const fsm = world.get(pid, "fsm");
      if (fsm.state === "dodge") return;

      if (!input.held("attack") || cd > 0) return;

      const t = world.get(pid, "transform");
      const C = BALANCE.combat;
      const stats = world.get(pid, "stats"); // adım 8'de ekipmanla türetilecek
      const damage = stats?.attackDamage ?? C.baseAttackDamage;
      const critChance = stats?.critChance ?? C.critChance;
      cd = stats?.attackCooldown ?? C.baseAttackCooldown;

      // Saldırı yönü: imleç zemin noktası (varsa), yoksa baktığı yön
      let dirX = Math.sin(t.rotY), dirZ = Math.cos(t.rotY);
      if (cam.pointerToGround(input.pointer.x, input.pointer.y, groundHit)) {
        const ox = groundHit.x - t.x, oz = groundHit.z - t.z;
        const d = Math.hypot(ox, oz);
        if (d > 0.3) { dirX = ox / d; dirZ = oz / d; t.rotY = Math.atan2(dirX, dirZ); }
      }

      // Yay içi düşmanlar
      const facing = Math.atan2(dirX, dirZ);
      let hitAny = false;
      for (const eid of world.query("damageable", "transform", "team")) {
        if (world.get(eid, "team").id === "player" || world.has(eid, "dead")) continue;
        const et = world.get(eid, "transform");
        const ox = et.x - t.x, oz = et.z - t.z;
        const dist = Math.hypot(ox, oz);
        if (dist > C.baseAttackRange + (world.get(eid, "hurtbox")?.r ?? 0.6)) continue;
        let ang = Math.atan2(ox, oz) - facing;
        while (ang > Math.PI) ang -= 2 * Math.PI;
        while (ang < -Math.PI) ang += 2 * Math.PI;
        if (Math.abs(ang) > C.baseAttackArc / 2) continue;
        events.emit("combat:damage", { source: pid, target: eid, amount: damage, critChance });
        hitAny = true;
      }
      events.emit("player:attack", { id: pid, hit: hitAny, dirX, dirZ });
    },
  };
}

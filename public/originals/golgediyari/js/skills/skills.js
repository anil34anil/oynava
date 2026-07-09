/**
 * SkillSystem — 4 aktif yetenek (adım 9).
 * Her skill: seviye kilidi + mana maliyeti + cooldown + efekt fonksiyonu.
 * Hasar = oyuncu attackDamage × katsayı × skillPower (talent çarpanı).
 * Efektler mevcut olay altyapısını kullanır (combat:damage / projectile:spawn)
 * → skill eklemek combat koduna dokunmayı GEREKTİRMEZ.
 * Yayınlar: skill:cast {key}, skill:cd {key, cd, max} (HUD dinler)
 */
/* global THREE */
import { BALANCE } from "../config/balance.js";

export const SKILLS = {
  skill1: {
    tr: "Gölge Yarığı", icon: "🌑", unlock: 2, mana: 12, cd: 3,
    desc: "İleri delip geçen gölge mermisi (hasar ×1.5)",
    cast(ctx, pid, aim) {
      const dmg = skillDmg(ctx, pid, 1.5);
      ctx.events.emit("projectile:spawn", {
        x: aim.x0, z: aim.z0, dirX: aim.dirX, dirZ: aim.dirZ,
        speed: 15, radius: 0.45, life: 1.4, color: 0x8b5cf6,
        damage: dmg, team: "player", pierce: 3,
        critChance: ctx.world.get(pid, "stats").critChance,
      });
    },
  },
  skill2: {
    tr: "Karanlık Nova", icon: "💥", unlock: 4, mana: 20, cd: 6,
    desc: "Çevrendeki tüm düşmanlara patlama (hasar ×1.2, yarıçap 4.5)",
    cast(ctx, pid, aim) {
      const dmg = skillDmg(ctx, pid, 1.2);
      const R = 4.5;
      forEnemiesInRange(ctx, aim.x0, aim.z0, R, (eid) => {
        ctx.events.emit("combat:damage", { source: pid, target: eid, amount: dmg });
      });
      ctx.cam.shake(0.4);
      ctx.events.emit("fx:nova", { x: aim.x0, z: aim.z0, r: R, color: 0x8b5cf6 });
    },
  },
  skill3: {
    tr: "Kan Hasadı", icon: "🩸", unlock: 6, mana: 16, cd: 5,
    desc: "Önündeki yaya vur; verdiğin hasarın %40'ı kadar iyileş",
    cast(ctx, pid, aim) {
      const dmg = skillDmg(ctx, pid, 1.3);
      let total = 0;
      forEnemiesInArc(ctx, pid, aim, 3.0, 2.2, (eid) => {
        ctx.events.emit("combat:damage", { source: pid, target: eid, amount: dmg });
        total += dmg;
      });
      if (total > 0) {
        const h = ctx.world.get(pid, "health");
        const heal = Math.round(total * 0.4);
        h.hp = Math.min(h.max, h.hp + heal);
        ctx.events.emit("ui:dmgtext", { x: aim.x0, z: aim.z0, amount: heal, crit: false, isPlayer: false, heal: true });
      }
    },
  },
  skill4: {
    tr: "Gölge Fırtınası", icon: "🌀", unlock: 8, mana: 30, cd: 12,
    desc: "8 yöne gölge mermisi yağdır (mermi başına hasar ×0.9)",
    cast(ctx, pid, aim) {
      const dmg = skillDmg(ctx, pid, 0.9);
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        ctx.events.emit("projectile:spawn", {
          x: aim.x0, z: aim.z0, dirX: Math.sin(a), dirZ: Math.cos(a),
          speed: 13, radius: 0.35, life: 1.2, color: 0xc084fc,
          damage: dmg, team: "player", pierce: 1,
          critChance: ctx.world.get(pid, "stats").critChance,
        });
      }
      ctx.cam.shake(0.3);
    },
  },
};

function skillDmg(ctx, pid, mult) {
  const s = ctx.world.get(pid, "stats");
  return Math.round(s.attackDamage * mult * (s.skillPower ?? 1));
}

function forEnemiesInRange(ctx, x, z, r, fn) {
  for (const eid of ctx.world.query("damageable", "transform", "team")) {
    if (ctx.world.get(eid, "team").id === "player" || ctx.world.has(eid, "dead")) continue;
    const t = ctx.world.get(eid, "transform");
    if ((t.x - x) ** 2 + (t.z - z) ** 2 <= r * r) fn(eid);
  }
}

function forEnemiesInArc(ctx, pid, aim, range, arc, fn) {
  const facing = Math.atan2(aim.dirX, aim.dirZ);
  forEnemiesInRange(ctx, aim.x0, aim.z0, range, (eid) => {
    const t = ctx.world.get(eid, "transform");
    let ang = Math.atan2(t.x - aim.x0, t.z - aim.z0) - facing;
    while (ang > Math.PI) ang -= 2 * Math.PI;
    while (ang < -Math.PI) ang += 2 * Math.PI;
    if (Math.abs(ang) <= arc / 2) fn(eid);
  });
}

export function createSkillSystem() {
  const cds = { skill1: 0, skill2: 0, skill3: 0, skill4: 0 };
  const groundHit = new THREE.Vector3();

  return {
    name: "skills",

    init(ctx) {
      ctx.skills = {
        defs: SKILLS,
        cooldowns: cds,
        isUnlocked: (key) => (ctx.world.get(ctx.world.first("player"), "progress")?.level ?? 1) >= SKILLS[key].unlock,
      };
    },

    update(ctx, dt) {
      const { world, input, events, cam } = ctx;
      for (const k in cds) cds[k] = Math.max(0, cds[k] - dt);

      const pid = world.first("player", "transform");
      if (pid === null || world.has(pid, "dead")) return;
      if (world.get(pid, "fsm").state === "dodge") return;
      const prog = world.get(pid, "progress");
      const mana = world.get(pid, "mana");
      const t = world.get(pid, "transform");

      for (const key of Object.keys(SKILLS)) {
        if (!input.justPressed(key)) continue;
        const S = SKILLS[key];
        if ((prog?.level ?? 1) < S.unlock || cds[key] > 0 || mana.mp < S.mana) continue;

        // Nişan: imleç zemin noktası; yoksa bakış yönü
        let dirX = Math.sin(t.rotY), dirZ = Math.cos(t.rotY);
        if (cam.pointerToGround(input.pointer.x, input.pointer.y, groundHit)) {
          const ox = groundHit.x - t.x, oz = groundHit.z - t.z;
          const d = Math.hypot(ox, oz);
          if (d > 0.3) { dirX = ox / d; dirZ = oz / d; t.rotY = Math.atan2(dirX, dirZ); }
        }

        mana.mp -= S.mana;
        cds[key] = S.cd;
        S.cast(ctx, pid, { x0: t.x, z0: t.z, dirX, dirZ });
        events.emit("skill:cast", { key });
        events.emit("skill:cd", { key, cd: S.cd, max: S.cd });
      }
    },
  };
}

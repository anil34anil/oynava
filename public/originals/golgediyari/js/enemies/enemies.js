/**
 * EnemySystem — düşman AI + yaşam döngüsü (adım 5).
 *
 * AI durum makinesi (ai.state): "idle" → "chase" → "attack" → ("dead")
 *  - idle: aggro yarıçapında oyuncu var mı diye bakar (0.25 sn'de bir — perf)
 *  - chase: oyuncuya koşar; sürü ayrışması (separation) ile üst üste binmez
 *  - attack: menzildeyse durup vurur (melee: damage event / ranged: ok fırlatır)
 *  - dead: küçülerek kaybolur, XP olayı yayınlanır, varlık silinir
 *
 * Spawn API (bölge/dalga sistemleri kullanır):
 *   events.emit("enemy:spawn", { type:"golge_kulu", x, z, elite?:true, bossKey?:string })
 * Yayınlar: enemy:died {id, type, elite, boss, x, z} (loot + görevler dinler)
 */
/* global THREE */
import { Assets } from "../core/assets.js";
import { BALANCE } from "../config/balance.js";

const AGGRO_CHECK = 0.25;
const DEATH_FADE = 0.6;

export function createEnemySystem() {
  return {
    name: "enemies",

    init(ctx) {
      const { world, events, three } = ctx;

      events.on("enemy:spawn", ({ type, x, z, elite = false, bossKey, tag }) => {
        const def = bossKey ? BALANCE.enemies[bossKey] : BALANCE.enemies[type];
        if (!def) return;
        const E = BALANCE.enemies.elite;
        const hp = Math.round(def.hp * (elite ? E.hpMult : 1));
        const id = world.create();
        world.add(id, "transform", { x, z, rotY: 0 });
        world.add(id, "team", { id: "enemy" });
        world.add(id, "damageable", {});
        world.add(id, "health", { hp, max: hp });
        world.add(id, "hurtbox", { r: 0.55 * def.scale * (elite ? E.scaleMult : 1) });
        world.add(id, "enemy", {
          type: bossKey ?? type,
          def,
          elite,
          boss: !!bossKey,
          name: elite ? `${E.prefixes[(Math.random() * E.prefixes.length) | 0]} ${def.name}` : def.name,
          dmg: def.dmg * (elite ? E.dmgMult : 1),
          speed: def.speed,
          attackCd: def.attackCd,
          xp: Math.round(def.xp * (elite ? E.xpMult : 1)),
          phase: 1,
          tag,
        });
        world.add(id, "ai", { state: "idle", t: Math.random() * AGGRO_CHECK, cd: 0 });
        const mesh = Assets.enemyPawn(bossKey ?? type, def.color, def.scale * (elite ? E.scaleMult : 1), elite || !!bossKey);
        three.scene.add(mesh);
        world.add(id, "mesh", { obj: mesh });
      });

      // Vuruş tepkisi: kısa scale-punch (render'da sönümlenir)
      events.on("combat:hit", ({ target }) => {
        const e = world.get(target, "enemy");
        if (e) e.hitT = 0.14;
      });

      // Saldırı animasyonu: kol savurma zamanlayıcısı
      events.on("enemy:attack", ({ id }) => {
        const e = world.get(id, "enemy");
        if (e) e.atkT = 0.3;
      });

      // Ölüm: AI'yı kapat, fade başlat (destroy update'te)
      events.on("combat:death", ({ id }) => {
        if (!world.has(id, "enemy")) return;
        const e = world.get(id, "enemy");
        const t = world.get(id, "transform");
        events.emit("enemy:died", { id, type: e.type, elite: e.elite, boss: e.boss, xp: e.xp, x: t.x, z: t.z, tag: e.tag });
      });
    },

    update(ctx, dt) {
      const { world, events } = ctx;
      const pid = world.first("player", "transform");
      const pt = pid !== null ? world.get(pid, "transform") : null;
      const playerDead = pid === null || world.has(pid, "dead");

      for (const id of [...world.query("enemy", "ai", "transform")]) {
        const e = world.get(id, "enemy");
        const ai = world.get(id, "ai");
        const t = world.get(id, "transform");

        // ── Ölüm animasyonu ──
        if (world.has(id, "dead")) {
          const d = world.get(id, "dead");
          d.t += dt;
          if (d.t >= DEATH_FADE) {
            const m = world.get(id, "mesh")?.obj;
            if (m) ctx.three.scene.remove(m);
            world.destroy(id);
          }
          continue;
        }

        ai.cd = Math.max(0, ai.cd - dt);

        // ── Boss faz 2 ──
        if (e.boss && e.phase === 1) {
          const h = world.get(id, "health");
          if (h.hp / h.max <= e.def.phase2At) {
            e.phase = 2;
            e.speed = e.def.speed * e.def.phase2SpeedMult;
            e.attackCd = e.def.attackCd * e.def.phase2AttackCdMult;
            events.emit("boss:phase2", { id });
            // Yardımcı çağır
            for (let i = 0; i < 4; i++) {
              const a = (i / 4) * Math.PI * 2;
              events.emit("enemy:spawn", { type: "golge_kulu", x: t.x + Math.sin(a) * 3, z: t.z + Math.cos(a) * 3 });
            }
          }
        }

        if (playerDead || !pt) { ai.state = "idle"; continue; }
        const ox = pt.x - t.x, oz = pt.z - t.z;
        const dist = Math.hypot(ox, oz);

        switch (ai.state) {
          case "idle":
            ai.t += dt;
            if (ai.t >= AGGRO_CHECK) {
              ai.t = 0;
              if (dist <= e.def.aggroR) ai.state = "chase";
            }
            break;

          case "chase": {
            if (dist <= e.def.range) { ai.state = "attack"; break; }
            if (dist > e.def.aggroR * 2.2) { ai.state = "idle"; break; }
            // Oyuncuya doğru + sürü ayrışması
            let mx = ox / dist, mz = oz / dist;
            for (const oid of world.query("enemy", "transform")) {
              if (oid === id || world.has(oid, "dead")) continue;
              const ot = world.get(oid, "transform");
              const sx = t.x - ot.x, sz = t.z - ot.z;
              const sd = sx * sx + sz * sz;
              if (sd < 1.2 && sd > 1e-4) {
                const s = 0.6 / Math.sqrt(sd);
                mx += sx * s; mz += sz * s;
              }
            }
            const ml = Math.hypot(mx, mz) || 1;
            t.x += (mx / ml) * e.speed * dt;
            t.z += (mz / ml) * e.speed * dt;
            t.rotY = Math.atan2(ox, oz);
            break;
          }

          case "attack": {
            if (dist > e.def.range * 1.25) { ai.state = "chase"; break; }
            t.rotY = Math.atan2(ox, oz);
            if (ai.cd === 0) {
              ai.cd = e.attackCd;
              if (e.def.ranged) {
                const P = BALANCE.projectiles.enemyArrow;
                events.emit("projectile:spawn", {
                  x: t.x, z: t.z, dirX: ox / dist, dirZ: oz / dist,
                  speed: P.speed, radius: P.radius, life: P.life, color: P.color,
                  damage: e.dmg, team: "enemy",
                });
              } else {
                events.emit("combat:damage", { source: id, target: pid, amount: e.dmg });
              }
              events.emit("enemy:attack", { id });
            }
            break;
          }
        }
      }
    },

    render(ctx, _alpha) {
      const { world, time } = ctx;
      const dt = 1 / 60;
      for (const id of world.query("enemy", "mesh", "transform")) {
        const t = world.get(id, "transform");
        const e = world.get(id, "enemy");
        const m = world.get(id, "mesh").obj;
        m.position.set(t.x, 0, t.z);
        m.rotation.y = t.rotY;

        const baseScale = e.def.scale * (e.elite ? BALANCE.enemies.elite.scaleMult : 1);
        const dead = world.get(id, "dead");
        if (dead) {
          const k = 1 - dead.t / DEATH_FADE;
          m.scale.setScalar(Math.max(0.01, k) * baseScale);
          m.rotation.x = dead.t * 2.2; // devrilerek yok ol
          continue;
        }

        // Vuruş punch'ı: kısa büyüyüp normale dönme
        e.hitT = Math.max(0, (e.hitT ?? 0) - dt);
        m.scale.setScalar(baseScale * (1 + e.hitT * 1.4));

        // Uzuv animasyonu
        const L = m.userData.limbs;
        if (L) {
          const chasing = world.get(id, "ai").state === "chase";
          const w = chasing ? Math.sin(time.elapsed * 10 + id) : Math.sin(time.elapsed * 1.6 + id) * 0.12;
          const amp = chasing ? 0.7 : 0.06;
          if (L.lLeg) { L.lLeg.rotation.x = w * amp; L.rLeg.rotation.x = -w * amp; }
          e.atkT = Math.max(0, (e.atkT ?? 0) - dt);
          if (e.atkT > 0) { // saldırı: kollar öne savrulur
            const k = e.atkT / 0.3;
            if (L.rArm) L.rArm.rotation.x = -2.2 * (1 - k) * k * 4;
            if (L.lArm) L.lArm.rotation.x = -2.2 * (1 - k) * k * 4;
          } else if (L.lArm) {
            L.lArm.rotation.x = -w * amp * 0.8;
            if (L.rArm) L.rArm.rotation.x = w * amp * 0.8;
          }
          if (L.torso && chasing) L.torso.rotation.z = Math.sin(time.elapsed * 10 + id) * 0.05;
        }
        // Elite aurası döner/nefes alır
        const aura = m.userData.aura;
        if (aura) {
          aura.rotation.z = time.elapsed * 2;
          aura.material.opacity = 0.55 + Math.sin(time.elapsed * 4) * 0.2;
        }
        if (world.get(id, "ai").state === "chase") m.position.y = Math.abs(Math.sin(time.elapsed * 9 + id)) * 0.07;
      }
    },
  };
}

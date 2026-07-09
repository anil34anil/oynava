/**
 * ProjectileSystem — mermi/ok/büyü topu simülasyonu.
 * Herkes kullanır (düşman oku, oyuncu skill'i): spawn için event yeter →
 * events.emit("projectile:spawn", {x, z, dirX, dirZ, speed, radius, life,
 *   damage, team, color, critChance?})
 * Çarpışma: karşı takımdaki "damageable" varlıklarla daire kesişimi.
 */
/* global THREE */
import { Assets } from "../core/assets.js";

export function createProjectileSystem() {
  const pool = []; // mesh havuzu (GC baskısını azalt)

  function getMesh(scene, color) {
    let m = pool.pop();
    if (!m) {
      m = new THREE.Mesh(Assets.cylinder(0.12, 0.12, 0.5, 6),
        new THREE.MeshBasicMaterial({ color: 0xffffff }));
      m.rotation.x = Math.PI / 2;
    }
    m.material.color.setHex(color);
    m.visible = true;
    scene.add(m);
    return m;
  }

  return {
    name: "projectiles",

    init(ctx) {
      const { world, events, three } = ctx;
      events.on("projectile:spawn", (p) => {
        const id = world.create();
        world.add(id, "transform", { x: p.x, z: p.z, rotY: Math.atan2(p.dirX, p.dirZ) });
        world.add(id, "projectile", {
          dirX: p.dirX, dirZ: p.dirZ, speed: p.speed, radius: p.radius,
          life: p.life, damage: p.damage, team: p.team, critChance: p.critChance,
          pierce: p.pierce ?? 0, hitIds: new Set(),
        });
        world.add(id, "mesh", { obj: getMesh(three.scene, p.color ?? 0xffffff) });
      });
    },

    update(ctx, dt) {
      const { world, events, three } = ctx;
      for (const id of [...world.query("projectile", "transform")]) {
        const pr = world.get(id, "projectile");
        const t = world.get(id, "transform");
        t.x += pr.dirX * pr.speed * dt;
        t.z += pr.dirZ * pr.speed * dt;
        pr.life -= dt;

        // Çarpışma: karşı takım
        let dead = pr.life <= 0;
        if (!dead) {
          for (const eid of world.query("damageable", "transform", "team")) {
            if (world.get(eid, "team").id === pr.team || world.has(eid, "dead")) continue;
            if (pr.hitIds.has(eid)) continue;
            const et = world.get(eid, "transform");
            const r = (world.get(eid, "hurtbox")?.r ?? 0.6) + pr.radius;
            if ((et.x - t.x) ** 2 + (et.z - t.z) ** 2 <= r * r) {
              events.emit("combat:damage", { source: -1, target: eid, amount: pr.damage, critChance: pr.critChance });
              pr.hitIds.add(eid);
              if (pr.pierce-- <= 0) { dead = true; break; }
            }
          }
        }

        if (dead) {
          const m = world.get(id, "mesh").obj;
          three.scene.remove(m);
          m.visible = false;
          pool.push(m);
          world.destroy(id);
        }
      }
    },

    render(ctx) {
      const { world } = ctx;
      for (const id of world.query("projectile", "mesh")) {
        const t = world.get(id, "transform");
        const m = world.get(id, "mesh").obj;
        m.position.set(t.x, 0.9, t.z);
        m.rotation.y = t.rotY;
      }
    },
  };
}

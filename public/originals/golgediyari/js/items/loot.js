/**
 * LootSystem — drop + yerde duran ganimet + toplama (adım 6).
 *
 * enemy:died → drop kararı:
 *   altın: her zaman (miktar xp ile orantılı) · item: %22 (elite %70, boss %100 + 2 ekstra)
 *   gem: %6 (elite %15) · elite/boss rarity boost ile daha iyi kademe çeker
 * Yerde: rarity renkli kutu + ışık sütunu. Oyuncu üzerinden yürüyünce toplanır
 * (çanta doluysa yerde kalır). Yayınlar: loot:pickup {item|gold}
 */
/* global THREE */
import { generateItem, generateGem, RARITIES } from "./items.js";
import { Assets } from "../core/assets.js";

const PICKUP_R = 1.1;
const DROP_TTL = 90; // yerde kalma süresi (sn)

export function createLootSystem() {
  function dropMesh(scene, color, isGold) {
    const g = new THREE.Group();
    const box = new THREE.Mesh(
      isGold ? Assets.cylinder(0.18, 0.18, 0.08, 8) : Assets.box(0.3, 0.3, 0.3),
      new THREE.MeshLambertMaterial({ color, emissive: color, emissiveIntensity: 0.35 }),
    );
    box.position.y = 0.25;
    const beam = new THREE.Mesh(
      Assets.cylinder(0.05, 0.12, 2.2, 6),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.28 }),
    );
    beam.position.y = 1.1;
    g.add(box, beam);
    scene.add(g);
    return g;
  }

  function spawnDrop(ctx, x, z, payload) {
    const { world, three } = ctx;
    const id = world.create();
    const a = Math.random() * Math.PI * 2, r = 0.4 + Math.random() * 0.8;
    world.add(id, "transform", { x: x + Math.sin(a) * r, z: z + Math.cos(a) * r, rotY: 0 });
    const color = payload.gold ? 0xfbbf24
      : parseInt(RARITIES[payload.item.rarity].color.slice(1), 16);
    world.add(id, "drop", { ...payload, ttl: DROP_TTL });
    world.add(id, "mesh", { obj: dropMesh(three.scene, color, !!payload.gold) });
  }

  return {
    name: "loot",

    init(ctx) {
      const { events } = ctx;
      events.on("enemy:died", ({ x, z, elite, boss, xp }) => {
        const ilvl = ctx.world.get(ctx.world.first("player"), "progress")?.level ?? 1;

        spawnDrop(ctx, x, z, { gold: Math.max(2, Math.round(xp * (0.5 + Math.random() * 0.5))) });

        const itemChance = boss ? 1 : elite ? 0.7 : 0.22;
        const boost = boss ? 12 : elite ? 5 : 1;
        if (Math.random() < itemChance)
          spawnDrop(ctx, x, z, { item: generateItem(ilvl, { rarity: undefined }), boost });
        if (boss) for (let i = 0; i < 2; i++)
          spawnDrop(ctx, x, z, { item: generateItem(ilvl + 2) });
        if (Math.random() < (elite ? 0.15 : 0.06))
          spawnDrop(ctx, x, z, { item: generateGem(ilvl) });
      });
    },

    update(ctx, dt) {
      const { world, events, inv, three } = ctx;
      const pid = world.first("player", "transform");
      if (pid === null) return;
      const pt = world.get(pid, "transform");

      for (const id of [...world.query("drop", "transform")]) {
        const d = world.get(id, "drop");
        const t = world.get(id, "transform");
        d.ttl -= dt;
        let take = false;
        if ((t.x - pt.x) ** 2 + (t.z - pt.z) ** 2 <= PICKUP_R * PICKUP_R) {
          if (d.gold) { inv.addGold(d.gold); take = true; }
          else if (inv.addItem(d.item)) take = true; // çanta doluysa yerde kalır
          if (take) events.emit("loot:pickup", { gold: d.gold, item: d.item });
        }
        if (take || d.ttl <= 0) {
          three.scene.remove(world.get(id, "mesh").obj);
          world.destroy(id);
        }
      }
    },

    render(ctx) {
      const { world, time } = ctx;
      for (const id of world.query("drop", "mesh")) {
        const t = world.get(id, "transform");
        const m = world.get(id, "mesh").obj;
        m.position.set(t.x, Math.sin(time.elapsed * 3 + id) * 0.06, t.z);
        m.rotation.y = time.elapsed * 1.5;
      }
    },
  };
}

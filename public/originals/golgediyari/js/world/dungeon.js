/**
 * DungeonSystem — Kara Zindan + boss savaşı (Dungeon sistemi + Boss).
 * Kül Ovası'ndaki portala yürü → zindana ışınlan. Zindan tek seferde kurulur:
 * elite ağırlıklı sürüler + en dipte "Kara Bekçi" (fazlı boss, HUD barı).
 * Boss ölünce: bol ganimet + geri dönüş. Girişteki portal ovaya döndürür.
 * Yayınlar: dungeon:enter, dungeon:cleared, boss:spawn
 */
/* global THREE */
import { Assets } from "../core/assets.js";
import { REGIONS } from "./props.js";

const PORTAL_R = 1.6;

export function createDungeonSystem() {
  let built = false;
  let bossId = null;
  let cleared = false;
  let cooldown = 0; // ışınlanma sonrası portal tekrar tetiklenmesin
  let enterAt = 0;  // hız koşusu (liderlik istatistiği)

  const portals = []; // render'da döndürülür (girdap hissi)

  function portalMesh(scene, color, x, z) {
    const g = new THREE.Group();
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(1.0, 1.45, 28),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.85, side: THREE.DoubleSide }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.05;
    const ring2 = new THREE.Mesh(
      new THREE.RingGeometry(0.55, 0.8, 24),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35, side: THREE.DoubleSide }),
    );
    ring2.rotation.x = -Math.PI / 2;
    ring2.position.y = 0.08;
    const beam = new THREE.Mesh(
      Assets.cylinder(0.5, 1.1, 5, 12),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.18 }),
    );
    beam.position.y = 2.5;
    // Taş kemer (portal kapısı hissi)
    const stone = Assets.std(0x39415c);
    const p1 = new THREE.Mesh(Assets.box(0.45, 3.2, 0.45), stone);
    p1.position.set(-1.9, 1.6, 0);
    const p2 = p1.clone(); p2.position.x = 1.9;
    const top = new THREE.Mesh(Assets.box(4.3, 0.45, 0.5), stone);
    top.position.y = 3.4;
    [p1, p2, top].forEach((s) => { s.castShadow = true; });
    // Portal ışığı (loş nokta ışık — atmosfer)
    const light = new THREE.PointLight(color, 1.4, 11);
    light.position.y = 1.6;
    g.add(ring, ring2, beam, p1, p2, top, light);
    g.position.set(x, 0, z);
    scene.add(g);
    portals.push({ ring, ring2 });
    return g;
  }

  function buildDungeon(ctx) {
    const { events, three } = ctx;
    const Z = REGIONS.zindan;
    // Zemin (uzak bölge — ana chunk origin'de)
    const ground = Assets.groundChunk(Z.r * 2.2, true); // koyu zindan zemini
    ground.position.set(Z.cx, 0, Z.cz);
    three.scene.add(ground);
    // Elite ağırlıklı sürüler
    const packs = [
      { x: Z.cx - 8, z: 8, type: "golge_kulu", n: 4, elite: 0.4 },
      { x: Z.cx + 8, z: 6, type: "kemik_okcu", n: 3, elite: 0.4 },
      { x: Z.cx, z: -8, type: "mezar_devi", n: 2, elite: 0.5 },
      { x: Z.cx - 10, z: -14, type: "golge_kulu", n: 5, elite: 0.35 },
      { x: Z.cx + 9, z: -16, type: "kemik_okcu", n: 3, elite: 0.45 },
    ];
    for (const p of packs)
      for (let i = 0; i < p.n; i++) {
        const a = (i / p.n) * Math.PI * 2;
        events.emit("enemy:spawn", { type: p.type, x: p.x + Math.sin(a) * 1.5, z: p.z + Math.cos(a) * 1.5, elite: Math.random() < p.elite });
      }
  }

  function spawnBoss(ctx) {
    const { events, world } = ctx;
    const Z = REGIONS.zindan;
    events.emit("enemy:spawn", { type: "boss", bossKey: "boss_karabekci", x: Z.cx, z: Z.cz - 24 });
    // Az önce yaratılan boss'u bul (enemy.boss=true tek varlık)
    for (const id of world.query("enemy")) {
      if (world.get(id, "enemy").boss) { bossId = id; break; }
    }
    events.emit("boss:spawn", { id: bossId, name: "KARA BEKÇİ" });
  }

  return {
    name: "dungeon",

    init(ctx) {
      const { three, events, world } = ctx;
      portalMesh(three.scene, 0xc084fc, 0, 20);                       // ova → zindan
      portalMesh(three.scene, 0x22d3ee, REGIONS.zindan.cx, 20);        // zindan → ova

      events.on("enemy:died", ({ id, boss }) => {
        if (!boss || id !== bossId) return;
        cleared = true;
        const time = Math.round(ctx.time.elapsed - enterAt);
        events.emit("dungeon:cleared", { id, time });
        void world;
      });
    },

    update(ctx, dt) {
      const { world, events } = ctx;
      cooldown = Math.max(0, cooldown - dt);
      if (cooldown > 0) return;
      const pid = world.first("player", "transform");
      if (pid === null || world.has(pid, "dead")) return;
      const t = world.get(pid, "transform");
      const Z = REGIONS.zindan;

      // Ova portalı → zindana gir
      if (Math.hypot(t.x - 0, t.z - 20) < PORTAL_R) {
        t.x = Z.cx; t.z = 16;
        cooldown = 2;
        if (!built) {
          built = true;
          enterAt = ctx.time.elapsed;
          buildDungeon(ctx);
          spawnBoss(ctx);
        }
        events.emit("dungeon:enter", {});
        events.emit("ui:zone", { name: "Kara Zindan" });
      }
      // Zindan portalı → ovaya dön
      else if (Math.hypot(t.x - Z.cx, t.z - 20) < PORTAL_R) {
        t.x = 0; t.z = 16;
        cooldown = 2;
        events.emit("ui:zone", { name: "Kül Ovası" });
      }
      void cleared;
    },

    render(ctx) {
      // Portal halkaları zıt yönlerde döner (girdap)
      for (const p of portals) {
        p.ring.rotation.z = ctx.time.elapsed * 1.2;
        p.ring2.rotation.z = -ctx.time.elapsed * 2.1;
      }
    },
  };
}

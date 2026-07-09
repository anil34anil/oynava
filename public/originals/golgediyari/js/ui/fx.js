/**
 * FxSystem — parçacık + dünya efektleri (havuzlu, GC dostu).
 *  - Vuruş kıvılcımı (combat:hit), ölüm ruh patlaması (combat:death)
 *  - Seviye atlama altın çeşmesi (player:levelup), loot parıltısı
 *  - Nova halkası (fx:nova), dodge iz efekti (player:dodge)
 *  - Ortam közleri: oyuncu çevresinde süzülen gölge zerreleri (atmosfer)
 * Tek geometri + renk başına paylaşılan materyal; havuz 160 parçacıkla sınırlı.
 */
/* global THREE */

const MAX_PARTICLES = 160;
const EMBER_COUNT = 34;

export function createFxSystem() {
  const rings = [];      // {mesh, t, life, grow}
  const parts = [];      // aktif parçacıklar {m, vx, vy, vz, t, life, spin}
  const pool = [];
  let embers;            // THREE.Points — ortam zerreleri
  let emberData;
  let geo, mats;

  function getPart(scene, color) {
    let m = pool.pop();
    if (!m) {
      if (parts.length >= MAX_PARTICLES) return null;
      m = new THREE.Mesh(geo, null);
    }
    m.material = mats.get(color) ?? (() => {
      const mat = new THREE.MeshBasicMaterial({ color, transparent: true });
      mats.set(color, mat);
      return mat;
    })();
    m.visible = true;
    scene.add(m);
    return m;
  }

  function burst(ctx, x, y, z, color, n, speed = 4, up = 3) {
    for (let i = 0; i < n; i++) {
      const m = getPart(ctx.three.scene, color);
      if (!m) return;
      m.position.set(x, y, z);
      const a = Math.random() * Math.PI * 2;
      const s = speed * (0.4 + Math.random() * 0.6);
      parts.push({
        m,
        vx: Math.sin(a) * s, vz: Math.cos(a) * s,
        vy: up * (0.5 + Math.random() * 0.8),
        t: 0, life: 0.45 + Math.random() * 0.35,
        spin: (Math.random() - 0.5) * 12,
        scale: 0.5 + Math.random() * 0.9,
      });
    }
  }

  return {
    name: "fx",

    init(ctx) {
      const { three, events, world } = ctx;
      geo = new THREE.TetrahedronGeometry(0.09, 0);
      mats = new Map();

      const posOf = (id) => world.get(id, "transform");

      events.on("combat:hit", ({ target, crit }) => {
        const t = posOf(target);
        if (t) burst(ctx, t.x, 1.1, t.z, crit ? 0xfbbf24 : 0xff6644, crit ? 8 : 4, crit ? 6 : 4);
      });
      events.on("combat:death", ({ id }) => {
        const t = posOf(id);
        const e = world.get(id, "enemy");
        if (t) burst(ctx, t.x, 0.9, t.z, e?.def.color ?? 0x8b5cf6, e?.boss ? 40 : 14, e?.boss ? 8 : 5, 4);
      });
      events.on("player:levelup", () => {
        const pid = world.first("player", "transform");
        const t = posOf(pid);
        if (t) burst(ctx, t.x, 0.4, t.z, 0xfbbf24, 30, 3.5, 7);
      });
      events.on("player:dodge", () => {
        const pid = world.first("player", "transform");
        const t = posOf(pid);
        if (t) burst(ctx, t.x, 0.5, t.z, 0x8b5cf6, 6, 2.5, 1.5);
      });
      events.on("loot:pickup", ({ gold }) => {
        const pid = world.first("player", "transform");
        const t = posOf(pid);
        if (t && gold) burst(ctx, t.x, 1.2, t.z, 0xfbbf24, 3, 2, 3);
      });
      events.on("skill:cast", () => ctx.cam.shake(0.12));
      events.on("boss:phase2", () => {
        const t = { x: 250, z: -24 };
        burst(ctx, t.x, 1.5, t.z, 0xff2211, 36, 9, 5);
        ctx.cam.shake(0.8);
      });
      events.on("fx:nova", ({ x, z, r, color }) => {
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(0.4, 0.9, 32),
          new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.85, side: THREE.DoubleSide }),
        );
        ring.rotation.x = -Math.PI / 2;
        ring.position.set(x, 0.05, z);
        three.scene.add(ring);
        rings.push({ mesh: ring, t: 0, life: 0.45, grow: r });
        burst(ctx, x, 0.6, z, color, 22, 7, 4);
      });

      // Ortam közleri: yavaşça süzülen zerreler
      emberData = [];
      const pos = new Float32Array(EMBER_COUNT * 3);
      for (let i = 0; i < EMBER_COUNT; i++) {
        emberData.push({ a: Math.random() * Math.PI * 2, r: 4 + Math.random() * 14, y: Math.random() * 3, sp: 0.1 + Math.random() * 0.3 });
      }
      embers = new THREE.Points(
        new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(pos, 3)),
        new THREE.PointsMaterial({ color: 0x9f7aea, size: 0.09, transparent: true, opacity: 0.7 }),
      );
      three.scene.add(embers);
    },

    update(ctx, dt) {
      // Parçacıklar: balistik + dönüş + küçülme
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.t += dt;
        p.vy -= 12 * dt;
        p.m.position.x += p.vx * dt;
        p.m.position.y = Math.max(0.03, p.m.position.y + p.vy * dt);
        p.m.position.z += p.vz * dt;
        p.m.rotation.x += p.spin * dt;
        p.m.rotation.z += p.spin * dt;
        const k = 1 - p.t / p.life;
        p.m.scale.setScalar(Math.max(0.01, k) * p.scale);
        if (p.t >= p.life) {
          ctx.three.scene.remove(p.m);
          p.m.visible = false;
          pool.push(p.m);
          parts.splice(i, 1);
        }
      }
      // Nova halkaları
      for (let i = rings.length - 1; i >= 0; i--) {
        const f = rings[i];
        f.t += dt;
        const k = f.t / f.life;
        f.mesh.scale.setScalar(1 + k * f.grow);
        f.mesh.material.opacity = 0.85 * (1 - k);
        if (f.t >= f.life) {
          ctx.three.scene.remove(f.mesh);
          f.mesh.geometry.dispose();
          f.mesh.material.dispose();
          rings.splice(i, 1);
        }
      }
    },

    render(ctx) {
      // Közler oyuncu çevresinde döner
      const { world, time } = ctx;
      const pid = world.first("player", "transform");
      if (pid === null || !embers) return;
      const t = world.get(pid, "transform");
      const attr = embers.geometry.attributes.position;
      for (let i = 0; i < EMBER_COUNT; i++) {
        const e = emberData[i];
        const a = e.a + time.elapsed * e.sp;
        attr.setXYZ(i,
          t.x + Math.sin(a) * e.r,
          0.4 + e.y + Math.sin(time.elapsed * 0.8 + i) * 0.5,
          t.z + Math.cos(a) * e.r);
      }
      attr.needsUpdate = true;
    },
  };
}

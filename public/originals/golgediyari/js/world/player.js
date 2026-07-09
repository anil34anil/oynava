/**
 * PlayerSystem — karakter controller (debugPawn'ın kalıcı halefi).
 *
 * Hareket modeli (ARPG standardı):
 *  - Klavye/gamepad: kamera hizalı analog vektör → ivmeli hız (accel/decel).
 *  - Fare/dokunuş: yere tıkla-yürü; basılı tutunca hedef sürekli güncellenir
 *    (Diablo tarzı "sürükleyerek yönlendirme"). Analog girdi tıklama hedefini iptal eder.
 *  - Dodge: mevcut hareket yönüne (dururken baktığı yöne) sabit hızlı atılma.
 *    İlk dodgeIframes saniyesi hasar-geçirmez ("invulnerable" bileşeni — combat
 *    sistemi bu bileşene bakacak). Cooldown bitmeden tekrarlanamaz.
 *
 * Durum makinesi (fsm.state): "idle" | "run" | "dodge"
 * Yayınlanan olaylar: player:spawn, player:dodge (UI/ses/efekt sistemleri dinler).
 */
/* global THREE */
import { Assets } from "../core/assets.js";
import { BALANCE } from "../config/balance.js";

export function createPlayerSystem() {
  const P = BALANCE.player;
  const groundHit = new THREE.Vector3();
  let marker; // tıkla-yürü halkası

  return {
    name: "player",

    init(ctx) {
      const { world, three, events } = ctx;
      const id = world.create();
      world.add(id, "player", {});
      world.add(id, "transform", { x: 0, z: 0, rotY: 0 });
      world.add(id, "motion", { vx: 0, vz: 0 });
      // Combat kimliği (adım 4): tek hasar kapısı bu bileşenleri okur
      world.add(id, "team", { id: "player" });
      world.add(id, "damageable", {});
      world.add(id, "hurtbox", { r: 0.5 });
      world.add(id, "health", { hp: P.baseStats.hp, max: P.baseStats.hp });
      world.add(id, "mana", { mp: P.baseStats.mana, max: P.baseStats.mana });
      world.add(id, "fsm", { state: "idle", t: 0 });
      world.add(id, "dodge", { cd: 0, dirX: 0, dirZ: 1 });
      world.add(id, "moveTarget", { x: 0, z: 0, active: false });
      const mesh = Assets.playerPawn();
      three.scene.add(mesh);
      world.add(id, "mesh", { obj: mesh });
      marker = Assets.clickMarker();
      three.scene.add(marker);
      // Saldırı savuruş animasyonu için zamanlayıcı (render'da kullanılır)
      world.get(id, "player").swingT = 0;
      events.on("player:attack", () => { world.get(id, "player").swingT = 0.28; });
      events.emit("player:spawn", { id });
    },

    update(ctx, dt) {
      const { world, input, cam, events } = ctx;
      const id = world.first("player", "transform");
      if (id === null) return;
      const t = world.get(id, "transform");
      const mo = world.get(id, "motion");
      const fsm = world.get(id, "fsm");
      const dg = world.get(id, "dodge");
      const tgt = world.get(id, "moveTarget");

      // ── Ölüm/yeniden doğma: 2.5 sn sonra tam canla başlangıçta ──
      if (world.has(id, "dead")) {
        const d = world.get(id, "dead");
        d.t += dt;
        mo.vx = mo.vz = 0;
        if (d.t >= 2.5) {
          world.removeComp(id, "dead");
          const h = world.get(id, "health");
          h.hp = h.max;
          t.x = 0; t.z = 0;
          fsm.state = "idle"; fsm.t = 0;
          events.emit("player:respawn", { id });
        }
        return;
      }

      dg.cd = Math.max(0, dg.cd - dt);
      fsm.t += dt;

      // ── DODGE durumu: girdiyi yok say, sabit hızla kay ──
      if (fsm.state === "dodge") {
        mo.vx = dg.dirX * P.dodgeSpeed;
        mo.vz = dg.dirZ * P.dodgeSpeed;
        if (fsm.t >= P.dodgeIframes) world.removeComp(id, "invulnerable");
        if (fsm.t >= P.dodgeDuration) { fsm.state = "idle"; fsm.t = 0; }
      } else {
        // ── İstenen hız: analog girdi > tıkla-yürü ──
        let dx = 0, dz = 0;
        const yaw = THREE.MathUtils.degToRad(BALANCE.camera.yawDeg);
        const cos = Math.cos(yaw), sin = Math.sin(yaw);
        if (input.move.x || input.move.y) {
          dx = input.move.x * cos - input.move.y * sin;
          dz = -input.move.x * sin - input.move.y * cos;
          tgt.active = false; // analog girdi tıklama hedefini iptal eder
        } else {
          if ((input.pointer.down || input.justPointerDown()) &&
              cam.pointerToGround(input.pointer.x, input.pointer.y, groundHit)) {
            tgt.x = groundHit.x; tgt.z = groundHit.z; tgt.active = true;
          }
          if (tgt.active) {
            const ox = tgt.x - t.x, oz = tgt.z - t.z;
            const dist = Math.hypot(ox, oz);
            if (dist <= P.clickStopDist) tgt.active = false;
            else { dx = ox / dist; dz = oz / dist; }
          }
        }

        // ── İvmeli hız (kare hızından bağımsız üstel yaklaşım) ──
        const moveSpeed = world.get(id, "stats")?.moveSpeed ?? P.moveSpeed; // talent/ekipman hızı
        const rate = (dx || dz) ? P.accel : P.decel;
        const k = 1 - Math.exp(-rate * dt);
        mo.vx += (dx * moveSpeed - mo.vx) * k;
        mo.vz += (dz * moveSpeed - mo.vz) * k;

        // ── Dodge başlat ──
        if (input.justPressed("dodge") && dg.cd === 0) {
          const speed = Math.hypot(mo.vx, mo.vz);
          if (speed > 0.5) { dg.dirX = mo.vx / speed; dg.dirZ = mo.vz / speed; }
          else { dg.dirX = Math.sin(t.rotY); dg.dirZ = Math.cos(t.rotY); }
          fsm.state = "dodge"; fsm.t = 0;
          dg.cd = P.dodgeCooldown;
          world.add(id, "invulnerable", {});
          tgt.active = false;
          events.emit("player:dodge", { id });
        } else {
          const newState = Math.hypot(mo.vx, mo.vz) > 0.3 ? "run" : "idle";
          if (newState !== fsm.state) { fsm.state = newState; fsm.t = 0; }
        }
      }

      // ── Konum + yön ──
      t.x += mo.vx * dt;
      t.z += mo.vz * dt;
      const speed = Math.hypot(mo.vx, mo.vz);
      if (speed > 0.3) {
        const targetRot = Math.atan2(mo.vx, mo.vz);
        let diff = targetRot - t.rotY;
        while (diff > Math.PI) diff -= 2 * Math.PI;
        while (diff < -Math.PI) diff += 2 * Math.PI;
        t.rotY += diff * Math.min(1, P.turnLerp * dt);
      }

      // ── Tıkla-yürü işareti ──
      marker.visible = tgt.active;
      if (tgt.active) marker.position.set(tgt.x, 0.02, tgt.z);
    },

    render(ctx) {
      const { world, time } = ctx;
      const id = world.first("player", "mesh");
      if (id === null) return;
      const t = world.get(id, "transform");
      const fsm = world.get(id, "fsm");
      const pc = world.get(id, "player");
      const m = world.get(id, "mesh").obj;
      m.position.set(t.x, 0, t.z);
      m.rotation.y = t.rotY;

      // Gövde duruşu: koşuda zıplama+öne eğilme, dodge'da güçlü eğilme
      if (fsm.state === "run") {
        m.position.y = Math.abs(Math.sin(time.elapsed * 10)) * 0.08;
        m.rotation.x = 0.08;
      } else if (fsm.state === "dodge") {
        m.rotation.x = 0.35;
      } else {
        m.rotation.x = 0;
      }

      // Uzuv animasyonu: koşu sallanımı + kılıç savuruşu
      const L = m.userData.limbs;
      if (L) {
        const run = fsm.state === "run";
        const w = Math.sin(time.elapsed * 11);
        const amp = run ? 0.75 : 0.04;
        L.lLeg.rotation.x = w * amp;
        L.rLeg.rotation.x = -w * amp;
        L.lArm.rotation.x = -w * amp * 0.9;

        pc.swingT = Math.max(0, pc.swingT - 1 / 60);
        if (pc.swingT > 0) {
          // Savuruş: yukarıdan öne kesik (parabolik)
          const k = pc.swingT / 0.28;
          L.rArm.rotation.x = -0.5 - Math.sin((1 - k) * Math.PI) * 1.9;
        } else {
          L.rArm.rotation.x = w * amp * 0.9;
        }
        if (run) L.torso.rotation.z = w * 0.04;
      }
    },
  };
}

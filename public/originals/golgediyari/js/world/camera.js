/**
 * CameraSystem — izometrik takip kamerası (adım 3: tam sürüm).
 *  - Yumuşak takip (kare hızından bağımsız lerp)
 *  - Ekran sarsıntısı: ctx.cam.shake(güç) — combat hit feedback bunu çağırır
 *  - Zoom: fare tekerleği + iki parmak pinch (mobil)
 *  - ctx.cam.pointerToGround(px,py,out): ekran → zemin dünyası koordinatı.
 *    (player, combat hedefleme ve loot tıklaması hep bunu kullanır — tek kopya)
 */
/* global THREE */
import { BALANCE } from "../config/balance.js";

export function createCameraSystem() {
  const C = BALANCE.camera;
  const yaw = THREE.MathUtils.degToRad(C.yawDeg);
  const pitch = THREE.MathUtils.degToRad(C.pitchDeg);
  const baseOffset = new THREE.Vector3(
    Math.sin(yaw) * Math.cos(pitch),
    Math.sin(pitch),
    Math.cos(yaw) * Math.cos(pitch),
  );

  let zoom = 1;                 // 1 = varsayılan mesafe
  const ZOOM_MIN = 0.65, ZOOM_MAX = 1.5;
  let shakeMag = 0;             // mevcut sarsıntı gücü (sönümlenir)
  let pinchDist = 0;

  const lookTarget = new THREE.Vector3();
  const desired = new THREE.Vector3();
  const tmp = new THREE.Vector3();

  return {
    name: "camera",

    init(ctx) {
      const { three } = ctx;

      // Dış API — diğer sistemler kamerayı buradan kullanır
      ctx.cam = {
        shake(mag = 0.3) { shakeMag = Math.min(1.2, shakeMag + mag); },
        pointerToGround(px, py, out) {
          const ndc = tmp.set((px / innerWidth) * 2 - 1, -(py / innerHeight) * 2 + 1, 0.5);
          ndc.unproject(three.camera);
          const dir = ndc.sub(three.camera.position).normalize();
          if (dir.y >= -1e-4) return null;
          const t = -three.camera.position.y / dir.y;
          out.set(
            three.camera.position.x + dir.x * t, 0,
            three.camera.position.z + dir.z * t,
          );
          return out;
        },
        /** Dünya noktasını ekran pikseline çevirir (hasar yazıları/HUD için). */
        worldToScreen(x, y, z, out) {
          tmp.set(x, y, z).project(three.camera);
          out.x = (tmp.x + 1) / 2 * innerWidth;
          out.y = (-tmp.y + 1) / 2 * innerHeight;
          out.behind = tmp.z > 1;
          return out;
        },
      };

      // Zoom: tekerlek
      addEventListener("wheel", (e) => {
        zoom = THREE.MathUtils.clamp(zoom + Math.sign(e.deltaY) * 0.08, ZOOM_MIN, ZOOM_MAX);
      }, { passive: true });

      // Zoom: pinch (iki parmak)
      addEventListener("touchmove", (e) => {
        if (e.touches.length !== 2) { pinchDist = 0; return; }
        const d = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        );
        if (pinchDist) zoom = THREE.MathUtils.clamp(zoom * (pinchDist / d), ZOOM_MIN, ZOOM_MAX);
        pinchDist = d;
      }, { passive: true });
      addEventListener("touchend", () => { pinchDist = 0; });
    },

    update(ctx, dt) {
      const { world, three } = ctx;
      const pid = world.first("player", "transform");
      if (pid === null) return;
      const t = world.get(pid, "transform");

      desired.set(t.x, 0, t.z).addScaledVector(baseOffset, C.distance * zoom);
      const k = 1 - Math.exp(-C.followLerp * dt);
      three.camera.position.lerp(desired, k);
      lookTarget.lerp(tmp.set(t.x, 1, t.z), k);

      // Sarsıntı: sönümlenen rastgele ofset
      if (shakeMag > 0.001) {
        three.camera.position.x += (Math.random() - 0.5) * shakeMag;
        three.camera.position.z += (Math.random() - 0.5) * shakeMag;
        shakeMag *= Math.exp(-9 * dt);
      } else shakeMag = 0;

      three.camera.lookAt(lookTarget);
    },
  };
}

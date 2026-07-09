/**
 * Scene — Three.js sahnesi + ışıklandırma + renderer kurulumu.
 * Mobil performans: pixelRatio sınırlanır, gölge haritası tek yönlü ışıkta
 * küçük tutulur. "Açık Dünya Bölgeleri" adımında chunk yükleme buraya bağlanır.
 */
/* global THREE */
import { Assets } from "../core/assets.js";
import { BALANCE } from "../config/balance.js";

export function createThree(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(Assets.PALETTE.fog);
  scene.fog = new THREE.Fog(Assets.PALETTE.fog, 30, 70);

  // Işık: loş zindan atmosferi — ambient + "ay ışığı" + mor dolgu (rim hissi)
  scene.add(new THREE.HemisphereLight(0x8899cc, 0x1a1030, 0.75));
  const fill = new THREE.DirectionalLight(0x8b5cf6, 0.25);
  fill.position.set(-10, 8, -12);
  scene.add(fill);
  const sun = new THREE.DirectionalLight(0xaabbff, 1.15);
  sun.position.set(12, 20, 8);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  const s = 24;
  Object.assign(sun.shadow.camera, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 60 });
  scene.add(sun);

  // Placeholder zemin (tek chunk) — bölge sistemi gelene dek
  scene.add(Assets.groundChunk(BALANCE.world.chunkSize * 3));

  const camera = new THREE.PerspectiveCamera(BALANCE.camera.fov, 1, 0.1, 200);

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  addEventListener("resize", resize);
  resize();

  // Otomatik kalite: ilk 4 sn'de FPS < 34 ise pixelRatio'yu ve gölgeleri düşür
  // (zayıf mobil GPU sigortası — güçlü cihazlarda hiç devreye girmez)
  let frames = 0;
  const t0 = performance.now();
  (function probe() {
    frames++;
    const dtMs = performance.now() - t0;
    if (dtMs < 4000) return requestAnimationFrame(probe);
    const fps = frames / (dtMs / 1000);
    if (fps < 34) {
      renderer.setPixelRatio(1);
      renderer.shadowMap.enabled = false;
      scene.traverse((o) => { if (o.material) o.material.needsUpdate = true; });
    }
  })();

  return { renderer, scene, camera, sun };
}

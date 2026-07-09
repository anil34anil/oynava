/**
 * Assets — prosedürel varlık fabrikası (harici dosya YOK).
 * 3D görünüm: çok parçalı gövdeler (kol/bacak/silah ayrı — animasyon için
 * userData.limbs'e kaydedilir), flat-shaded stilize materyaller, emissive
 * detaylar (göz, rün, kristal) ve canvas'tan üretilen zemin dokusu.
 * İleride gerçek asset eklenirse yalnız bu modül değişir.
 */
/* global THREE */

const PALETTE = {
  ground: 0x1c2333,
  groundLine: 0x2b3550,
  playerBody: 0x8b5cf6,
  playerTrim: 0xfbbf24,
  elite: 0xf97316,
  fog: 0x0b1026,
};

const matCache = new Map();
const geoCache = new Map();

/** Stilize flat-shaded materyal (paylaşımlı — renk+seçenek başına tek kopya). */
function std(color, opts = {}) {
  const key = `${color}|${JSON.stringify(opts)}`;
  if (!matCache.has(key)) {
    matCache.set(key, new THREE.MeshStandardMaterial({
      color, roughness: 0.85, metalness: 0.08, flatShading: true, ...opts,
    }));
  }
  return matCache.get(key);
}

function mesh(geo, mat, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  return m;
}

export const Assets = {
  PALETTE,
  std,

  material(name, opts = {}) { return std(PALETTE[name] ?? 0xffffff, opts); },

  box(w, h, d) {
    const key = `box${w},${h},${d}`;
    if (!geoCache.has(key)) geoCache.set(key, new THREE.BoxGeometry(w, h, d));
    return geoCache.get(key);
  },

  cylinder(rt, rb, h, seg = 10) {
    const key = `cyl${rt},${rb},${h},${seg}`;
    if (!geoCache.has(key)) geoCache.set(key, new THREE.CylinderGeometry(rt, rb, h, seg));
    return geoCache.get(key);
  },

  /** Prosedürel zemin dokusu — çatlaklı/lekelenmiş kül toprağı. */
  groundTexture(base = "#1c2333", spot = "#232c44", dark = "#141a2b") {
    const key = `gt${base}${spot}`;
    if (matCache.has(key)) return matCache.get(key);
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d");
    g.fillStyle = base;
    g.fillRect(0, 0, 256, 256);
    let s = 7;
    const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 260; i++) { // lekeler
      g.fillStyle = rnd() < 0.5 ? spot : dark;
      g.globalAlpha = 0.12 + rnd() * 0.2;
      const r = 4 + rnd() * 22;
      g.beginPath();
      g.arc(rnd() * 256, rnd() * 256, r, 0, 7);
      g.fill();
    }
    g.globalAlpha = 0.25; // çatlaklar
    g.strokeStyle = dark;
    for (let i = 0; i < 26; i++) {
      g.beginPath();
      let x = rnd() * 256, y = rnd() * 256;
      g.moveTo(x, y);
      for (let j = 0; j < 5; j++) { x += (rnd() - 0.5) * 60; y += (rnd() - 0.5) * 60; g.lineTo(x, y); }
      g.stroke();
    }
    g.globalAlpha = 1;
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    matCache.set(key, tex);
    return tex;
  },

  /** Zemin parçası — dokulu; zindan için koyu ton. */
  groundChunk(size, dark = false) {
    const tex = dark
      ? this.groundTexture("#12172a", "#1a2036", "#0c1020")
      : this.groundTexture();
    tex.repeat.set(size / 9, size / 9);
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(size, size),
      new THREE.MeshStandardMaterial({ map: tex, roughness: 1, metalness: 0 }),
    );
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    const g = new THREE.Group();
    g.add(plane);
    return g;
  },

  /** Tıkla-yürü hedef işareti — yere yapışık halka. */
  clickMarker() {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.35, 0.5, 24),
      new THREE.MeshBasicMaterial({ color: PALETTE.playerTrim, transparent: true, opacity: 0.9, side: THREE.DoubleSide }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.02;
    ring.visible = false;
    return ring;
  },

  /**
   * Oyuncu — zırhlı gölge şövalyesi: gövde+omuzluk+miğfer+pelerin+kılıç.
   * userData.limbs = {lArm,rArm,lLeg,rLeg,torso,weapon} → player.js canlandırır.
   */
  playerPawn() {
    const g = new THREE.Group();
    const body = std(PALETTE.playerBody);
    const trim = std(PALETTE.playerTrim, { metalness: 0.5, roughness: 0.4 });
    const darkM = std(0x2a2140);

    const torso = new THREE.Group();
    torso.add(mesh(this.box(0.62, 0.72, 0.4), body, 0, 0, 0));
    torso.add(mesh(this.box(0.66, 0.16, 0.44), trim, 0, -0.32, 0));          // kemer
    torso.add(mesh(this.box(0.3, 0.3, 0.3), trim, -0.42, 0.3, 0));           // omuzluk L
    torso.add(mesh(this.box(0.3, 0.3, 0.3), trim, 0.42, 0.3, 0));            // omuzluk R
    // Pelerin
    const cape = mesh(this.box(0.5, 0.85, 0.06), darkM, 0, -0.12, -0.26);
    cape.rotation.x = 0.12;
    torso.add(cape);
    // Baş + miğfer + gözler
    const head = new THREE.Group();
    head.add(mesh(this.box(0.36, 0.34, 0.36), std(0xcbb6ff), 0, 0, 0));
    head.add(mesh(this.box(0.42, 0.18, 0.42), trim, 0, 0.2, 0));             // miğfer
    head.add(mesh(this.box(0.1, 0.12, 0.44), trim, 0, 0.32, 0));             // tepelik
    const eyeM = std(0x22d3ee, { emissive: 0x22d3ee, emissiveIntensity: 1.6 });
    head.add(mesh(this.box(0.07, 0.05, 0.02), eyeM, -0.09, 0.0, 0.19));
    head.add(mesh(this.box(0.07, 0.05, 0.02), eyeM, 0.09, 0.0, 0.19));
    head.position.y = 0.58;
    torso.add(head);
    torso.position.y = 1.02;
    g.add(torso);

    // Kollar (pivotlar omuzda)
    const mkArm = (side) => {
      const p = new THREE.Group();
      p.position.set(0.42 * side, 1.3, 0);
      p.add(mesh(this.box(0.18, 0.52, 0.18), body, 0, -0.26, 0));
      p.add(mesh(this.box(0.2, 0.16, 0.2), trim, 0, -0.52, 0)); // eldiven
      g.add(p);
      return p;
    };
    const lArm = mkArm(-1), rArm = mkArm(1);
    // Kılıç sağ elde
    const sword = new THREE.Group();
    sword.add(mesh(this.box(0.07, 0.75, 0.14), std(0xd8e4ff, { metalness: 0.8, roughness: 0.25, emissive: 0x8b5cf6, emissiveIntensity: 0.25 }), 0, 0.55, 0));
    sword.add(mesh(this.box(0.24, 0.07, 0.09), trim, 0, 0.14, 0));
    sword.add(mesh(this.box(0.06, 0.2, 0.06), darkM, 0, 0, 0));
    sword.position.set(0, -0.55, 0.1);
    rArm.add(sword);
    // Bacaklar (pivot kalçada)
    const mkLeg = (side) => {
      const p = new THREE.Group();
      p.position.set(0.17 * side, 0.66, 0);
      p.add(mesh(this.box(0.2, 0.6, 0.22), darkM, 0, -0.3, 0));
      p.add(mesh(this.box(0.22, 0.14, 0.3), trim, 0, -0.56, 0.03)); // bot
      g.add(p);
      return p;
    };
    const lLeg = mkLeg(-1), rLeg = mkLeg(1);

    g.userData.limbs = { torso, lArm, rArm, lLeg, rLeg, weapon: sword };
    return g;
  },

  /**
   * Düşman — tipe göre farklı siluet. userData.limbs animasyon için.
   * typeKey: golge_kulu | kemik_okcu | mezar_devi | boss_karabekci
   */
  enemyPawn(typeKey, color, scale = 1, elite = false) {
    const g = new THREE.Group();
    const body = std(color);
    const eyeM = std(0xff3344, { emissive: 0xff2233, emissiveIntensity: 2 });
    const boneM = std(0xd9dee7);
    const darkM = std(0x1a1428);
    const limbs = {};

    const eyes = (parent, w = 0.07, y = 0, z = 0.16, gap = 0.08) => {
      parent.add(mesh(this.box(w, 0.05, 0.02), eyeM, -gap, y, z));
      parent.add(mesh(this.box(w, 0.05, 0.02), eyeM, gap, y, z));
    };

    if (typeKey === "golge_kulu") {
      // Kambur küçük iblis: öne eğik gövde, pençe kollar, boynuz
      const torso = new THREE.Group();
      const t = mesh(this.box(0.5, 0.55, 0.42), body, 0, 0, 0.05);
      t.rotation.x = 0.35;
      torso.add(t);
      const head = new THREE.Group();
      head.add(mesh(this.box(0.34, 0.3, 0.32), body, 0, 0, 0));
      head.add(mesh(this.box(0.06, 0.22, 0.06), darkM, -0.13, 0.24, 0));   // boynuz
      head.add(mesh(this.box(0.06, 0.22, 0.06), darkM, 0.13, 0.24, 0));
      eyes(head);
      head.position.set(0, 0.32, 0.22);
      torso.add(head);
      torso.position.y = 0.72;
      g.add(torso);
      const mkClaw = (side) => {
        const p = new THREE.Group();
        p.position.set(0.32 * side, 0.85, 0.1);
        p.add(mesh(this.box(0.13, 0.45, 0.13), body, 0, -0.22, 0));
        p.add(mesh(this.box(0.18, 0.16, 0.2), darkM, 0, -0.48, 0.03));     // pençe
        g.add(p);
        return p;
      };
      limbs.lArm = mkClaw(-1); limbs.rArm = mkClaw(1);
      const mkLeg = (side) => {
        const p = new THREE.Group();
        p.position.set(0.14 * side, 0.42, 0);
        p.add(mesh(this.box(0.14, 0.4, 0.16), darkM, 0, -0.2, 0));
        g.add(p);
        return p;
      };
      limbs.lLeg = mkLeg(-1); limbs.rLeg = mkLeg(1);
      limbs.torso = torso;
    } else if (typeKey === "kemik_okcu") {
      // Sıska iskelet okçu: ince kemik uzuvlar, kafatası, yay
      const torso = new THREE.Group();
      torso.add(mesh(this.box(0.4, 0.5, 0.24), boneM, 0, 0, 0));
      torso.add(mesh(this.box(0.44, 0.05, 0.26), darkM, 0, 0.1, 0));       // kaburga çizgisi
      torso.add(mesh(this.box(0.44, 0.05, 0.26), darkM, 0, -0.06, 0));
      const head = new THREE.Group();
      head.add(mesh(this.box(0.3, 0.28, 0.28), boneM, 0, 0, 0));
      head.add(mesh(this.box(0.22, 0.1, 0.06), darkM, 0, -0.06, 0.13));    // çene boşluğu
      eyes(head, 0.06, 0.04, 0.14, 0.07);
      head.position.y = 0.42;
      torso.add(head);
      torso.position.y = 0.95;
      g.add(torso);
      const mkArm = (side) => {
        const p = new THREE.Group();
        p.position.set(0.26 * side, 1.12, 0);
        p.add(mesh(this.box(0.09, 0.46, 0.09), boneM, 0, -0.23, 0));
        g.add(p);
        return p;
      };
      limbs.lArm = mkArm(-1); limbs.rArm = mkArm(1);
      // Yay sol elde
      const bow = new THREE.Group();
      const arc = mesh(this.cylinder(0.02, 0.02, 0.9, 6), darkM, 0, 0, 0);
      arc.rotation.z = 0; arc.scale.z = 3; // hafif kavis hissi
      bow.add(arc);
      bow.add(mesh(this.box(0.01, 0.86, 0.01), std(0xf1f5f9), 0.06, 0, 0)); // kiriş
      bow.position.set(0, -0.45, 0.05);
      limbs.lArm.add(bow);
      const mkLeg = (side) => {
        const p = new THREE.Group();
        p.position.set(0.12 * side, 0.62, 0);
        p.add(mesh(this.box(0.1, 0.6, 0.1), boneM, 0, -0.3, 0));
        g.add(p);
        return p;
      };
      limbs.lLeg = mkLeg(-1); limbs.rLeg = mkLeg(1);
      limbs.torso = torso; limbs.weapon = bow;
    } else {
      // mezar_devi / boss: hantal taş golem — geniş gövde, koca yumruklar, rünler
      const isBoss = typeKey === "boss_karabekci";
      const torso = new THREE.Group();
      torso.add(mesh(this.box(0.95, 0.85, 0.6), body, 0, 0, 0));
      torso.add(mesh(this.box(0.5, 0.4, 0.5), body, 0, 0.62, 0));          // baş (gövdeye gömük)
      eyes(torso, 0.09, 0.66, 0.26, 0.11);
      // Rün taşları (emissive)
      const runeM = std(isBoss ? 0xff4433 : 0x22d3ee, { emissive: isBoss ? 0xff2211 : 0x22d3ee, emissiveIntensity: 1.2 });
      torso.add(mesh(this.box(0.12, 0.12, 0.03), runeM, -0.22, 0.12, 0.31));
      torso.add(mesh(this.box(0.1, 0.1, 0.03), runeM, 0.18, -0.14, 0.31));
      if (isBoss) { // boynuzlar + omuz dikenleri
        torso.add(mesh(this.box(0.1, 0.4, 0.1), darkM, -0.25, 0.95, 0));
        torso.add(mesh(this.box(0.1, 0.4, 0.1), darkM, 0.25, 0.95, 0));
        torso.add(mesh(this.box(0.2, 0.35, 0.2), darkM, -0.6, 0.5, 0));
        torso.add(mesh(this.box(0.2, 0.35, 0.2), darkM, 0.6, 0.5, 0));
      }
      torso.position.y = 1.05;
      g.add(torso);
      const mkFist = (side) => {
        const p = new THREE.Group();
        p.position.set(0.62 * side, 1.35, 0);
        p.add(mesh(this.box(0.24, 0.5, 0.24), body, 0, -0.25, 0));
        p.add(mesh(this.box(0.34, 0.3, 0.34), std(0x334155), 0, -0.6, 0)); // taş yumruk
        g.add(p);
        return p;
      };
      limbs.lArm = mkFist(-1); limbs.rArm = mkFist(1);
      const mkLeg = (side) => {
        const p = new THREE.Group();
        p.position.set(0.28 * side, 0.64, 0);
        p.add(mesh(this.box(0.26, 0.6, 0.3), std(0x334155), 0, -0.3, 0));
        g.add(p);
        return p;
      };
      limbs.lLeg = mkLeg(-1); limbs.rLeg = mkLeg(1);
      limbs.torso = torso;
    }

    if (elite) {
      const aura = new THREE.Mesh(
        new THREE.RingGeometry(0.55, 0.72, 20),
        new THREE.MeshBasicMaterial({ color: PALETTE.elite, transparent: true, opacity: 0.75, side: THREE.DoubleSide }),
      );
      aura.rotation.x = -Math.PI / 2;
      aura.position.y = 0.03;
      g.add(aura);
      g.userData.aura = aura;
    }
    g.scale.setScalar(scale);
    g.userData.limbs = limbs;
    return g;
  },

  /** Harita dekoru: ölü ağaç / kaya / parlayan kristal / harabe sütunu. */
  prop(kind, rnd) {
    const g = new THREE.Group();
    if (kind === "tree") {
      const bark = std(0x2d2438);
      const trunk = mesh(this.cylinder(0.09, 0.16, 1.6 + rnd() * 0.8, 6), bark, 0, 0.8, 0);
      g.add(trunk);
      for (let i = 0; i < 3; i++) { // çıplak dallar
        const br = mesh(this.cylinder(0.03, 0.05, 0.7 + rnd() * 0.4, 5), bark, 0, 1.3 + rnd() * 0.5, 0);
        br.rotation.z = 0.6 + rnd() * 0.7;
        br.rotation.y = rnd() * Math.PI * 2;
        g.add(br);
      }
    } else if (kind === "crystal") {
      const c = rnd() < 0.5 ? 0x8b5cf6 : 0x22d3ee;
      const cm = std(c, { emissive: c, emissiveIntensity: 0.9, roughness: 0.3 });
      const n = 2 + (rnd() * 2 | 0);
      for (let i = 0; i < n; i++) {
        const h = 0.5 + rnd() * 0.9;
        const cr = mesh(new THREE.ConeGeometry(0.14 + rnd() * 0.1, h, 5), cm, (rnd() - 0.5) * 0.5, h / 2, (rnd() - 0.5) * 0.5);
        cr.rotation.z = (rnd() - 0.5) * 0.4;
        g.add(cr);
      }
    } else if (kind === "pillar") {
      const pm = std(0x39415c);
      const h = 1.8 + rnd() * 1.6;
      g.add(mesh(this.box(0.5, h, 0.5), pm, 0, h / 2, 0));
      g.add(mesh(this.box(0.7, 0.2, 0.7), pm, 0, h + 0.1, 0));
      g.add(mesh(this.box(0.7, 0.18, 0.7), pm, 0, 0.09, 0));
      g.rotation.z = (rnd() - 0.5) * 0.12; // hafif yıkık
    } else { // rock
      const rm = std(0x2b3550);
      const r = mesh(new THREE.DodecahedronGeometry(0.4 + rnd() * 0.6, 0), rm, 0, 0.3, 0);
      r.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3);
      g.add(r);
      if (rnd() < 0.5) {
        const r2 = mesh(new THREE.DodecahedronGeometry(0.2 + rnd() * 0.3, 0), rm, 0.5, 0.15, 0.2);
        r2.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3);
        g.add(r2);
      }
    }
    // Dekor gölge maliyeti yüksek, görsel katkısı düşük → yalnız karakterler gölge düşürür
    g.traverse((c) => { if (c.isMesh) c.castShadow = false; });
    return g;
  },
};

/**
 * Balance — TÜM oyun ayarı tek yerde (veri odaklı tasarım).
 * Sistemler sihirli sayı içermez; her şey buradan okunur. Böylece denge
 * değişikliği kod değişikliği gerektirmez ve ileride bu obje sunucudan
 * da beslenebilir (canlı denge yaması / sezonluk ayar).
 */
export const BALANCE = {
  player: {
    moveSpeed: 6.2,        // birim/sn
    accel: 30,             // hedef hıza yaklaşma oranı (1/sn)
    decel: 18,             // bırakınca yavaşlama oranı (1/sn)
    dodgeSpeed: 16,        // atılma hızı
    dodgeDuration: 0.28,   // sn
    dodgeIframes: 0.22,    // atılmanın hasar-geçirmez ilk bölümü (sn)
    dodgeCooldown: 0.9,    // sn
    turnLerp: 14,          // yön dönme yumuşatması
    clickStopDist: 0.25,   // tıkla-yürü hedefe varış eşiği (birim)
    baseStats: { hp: 100, mana: 50, str: 10, dex: 10, int: 10, vit: 10 },
  },
  camera: {
    // İzometrik his: sabit açı + yumuşak takip (Diablo benzeri ama özgün değerler)
    pitchDeg: 52,
    yawDeg: 45,
    distance: 17,
    fov: 34,               // dar FOV → orto-benzeri derinlik
    followLerp: 5.5,
  },
  world: {
    chunkSize: 24,         // açık dünya bölme boyutu (bölge sistemi için)
  },
  combat: {
    baseAttackCooldown: 0.45,
    baseAttackDamage: 12,
    baseAttackRange: 2.1,     // melee yay menzili
    baseAttackArc: 1.6,       // radyan — önündeki yay genişliği
    critChance: 0.05,
    critMult: 1.5,
    manaRegen: 6,             // mana/sn
    hpRegen: 0.5,             // can/sn (savaş dışı hissi; düşük)
  },
  xp: {
    // Seviye n → n+1 için gereken XP
    needed: (lvl) => Math.round(80 * Math.pow(lvl, 1.45)),
    maxLevel: 60,
    statPointsPerLevel: 3,
    talentPointsPerLevel: 1,
  },
  enemies: {
    // Tip tanımları — AI sistemi bunları okur; yeni düşman = yeni satır
    golge_kulu: {   // hızlı melee sürü birimi
      name: "Gölge Kulu", hp: 30, dmg: 6, speed: 4.6, range: 1.3,
      attackCd: 1.1, aggroR: 9, xp: 14, scale: 0.8, color: 0x7c3aed, ranged: false,
    },
    kemik_okcu: {   // menzilli iskelet
      name: "Kemik Okçu", hp: 22, dmg: 9, speed: 3.2, range: 8,
      attackCd: 1.8, aggroR: 11, xp: 18, scale: 0.9, color: 0x94a3b8, ranged: true,
    },
    mezar_devi: {   // yavaş tank
      name: "Mezar Devi", hp: 90, dmg: 16, speed: 2.4, range: 1.8,
      attackCd: 1.9, aggroR: 8, xp: 40, scale: 1.5, color: 0x475569, ranged: false,
    },
    elite: {        // elite modifikatörleri (taban tipe uygulanır)
      hpMult: 3.2, dmgMult: 1.7, xpMult: 3.5, scaleMult: 1.25,
      auraColor: 0xf97316,
      prefixes: ["Lanetli", "Kadim", "Öfkeli", "Zehirli", "Buzul"],
    },
    boss_karabekci: { // bölge boss'u
      name: "Kara Bekçi", hp: 900, dmg: 24, speed: 3.4, range: 2.4,
      attackCd: 1.4, aggroR: 14, xp: 600, scale: 2.4, color: 0xdc2626, ranged: false,
      phase2At: 0.5,  // canı %50 altına inince faz 2: hızlanır + yardımcı çağırır
      phase2SpeedMult: 1.45, phase2AttackCdMult: 0.65,
    },
  },
  projectiles: {
    enemyArrow: { speed: 11, radius: 0.25, life: 2.2, color: 0xcbd5e1 },
  },
};

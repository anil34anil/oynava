/**
 * Net Serialize — multiplayer hazırlık katmanı (adım 12).
 *
 * Oyun şimdiden ağ dostu tasarlandı:
 *  - Simülasyon sabit 60 Hz adımlı ve deterministik eğilimli (engine.js)
 *  - Girdi soyut aksiyonlara indirgenmiş (input.js) → "input stream" olarak
 *    gönderilebilir (client-side prediction + server reconciliation'a uygun)
 *  - Tüm oyun durumu düz veri bileşenlerinde (ecs.js) → snapshot bedava
 *  - Item/karakter zaten JSON (persistence.js aynı şekli kaydediyor)
 *
 * Bu modül o sözleşmenin kanıtı: dinamik varlıkların anlık görüntüsünü üretir
 * ve uygular. Gerçek sunucu geldiğinde WebSocket üstünde bu iki fonksiyon
 * kullanılır; oyun sistemlerinde DEĞİŞİKLİK GEREKMEZ.
 */

const SYNC_COMPONENTS = ["transform", "health", "motion", "enemy", "projectile", "team"];

/** Dünyanın ağa gönderilebilir anlık görüntüsü (yalnız senkronize bileşenler). */
export function worldSnapshot(world) {
  const entities = {};
  for (const type of SYNC_COMPONENTS) {
    for (const id of world.query(type)) {
      (entities[id] ??= {})[type] = structuredClone(world.get(id, type));
    }
  }
  return { t: Date.now(), entities };
}

/** Snapshot'ı dünyaya uygular (otoriter sunucudan gelen durum). */
export function applySnapshot(world, snap) {
  for (const [idStr, comps] of Object.entries(snap.entities)) {
    const id = Number(idStr);
    if (!world.isAlive(id)) continue; // varlık eşleme/yaratma sunucu protokolüne kalır
    for (const [type, data] of Object.entries(comps)) {
      const cur = world.get(id, type);
      if (cur) Object.assign(cur, data);
      else world.add(id, type, data);
    }
  }
}

/** Girdi karesi — istemci sunucuya bunu yollar (prediction için sıra no ile). */
export function inputFrame(input, seq) {
  return {
    seq,
    move: { x: input.move.x, y: input.move.y },
    held: ["attack", "dodge", "skill1", "skill2", "skill3", "skill4"].filter((a) => input.held(a)),
  };
}

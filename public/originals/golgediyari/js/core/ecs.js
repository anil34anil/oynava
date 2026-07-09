/**
 * ECS-lite — varlık/bileşen deposu.
 * Varlık = sayısal id. Bileşen = düz veri objesi (davranış İÇERMEZ).
 * Davranış sistemlerde yaşar (engine.js'e kaydedilir). Bu ayrım sayesinde
 * yeni mekanikler (loot, buff, AI...) mevcut kodu değiştirmeden eklenir ve
 * ileride multiplayer için durum serileştirme bedavaya gelir.
 */
export class World {
  #nextId = 1;
  #stores = new Map();   // compType -> Map(entityId -> data)
  #alive = new Set();

  create() {
    const id = this.#nextId++;
    this.#alive.add(id);
    return id;
  }

  destroy(id) {
    if (!this.#alive.delete(id)) return;
    for (const store of this.#stores.values()) store.delete(id);
  }

  isAlive(id) { return this.#alive.has(id); }

  add(id, type, data = {}) {
    if (!this.#stores.has(type)) this.#stores.set(type, new Map());
    this.#stores.get(type).set(id, data);
    return data;
  }

  get(id, type) { return this.#stores.get(type)?.get(id); }
  has(id, type) { return this.#stores.get(type)?.has(id) ?? false; }
  removeComp(id, type) { this.#stores.get(type)?.delete(id); }

  /** Verilen TÜM bileşenlere sahip varlık id'lerini döndürür. */
  *query(...types) {
    if (types.length === 0) return;
    // En küçük store üzerinden yürü (performans)
    const stores = types.map((t) => this.#stores.get(t));
    if (stores.some((s) => !s)) return;
    stores.sort((a, b) => a.size - b.size);
    outer: for (const id of stores[0].keys()) {
      for (let i = 1; i < stores.length; i++) if (!stores[i].has(id)) continue outer;
      yield id;
    }
  }

  /** Tek sonuç beklenen sorgular için (ör. "player" etiketi). */
  first(...types) {
    for (const id of this.query(...types)) return id;
    return null;
  }
}

/**
 * EventBus — sistemler arası gevşek bağlantı (pub/sub).
 * Sistemler birbirini import ETMEZ; "combat:hit", "loot:drop", "ui:levelup"
 * gibi olaylar üzerinden haberleşir → her sistem tek başına değiştirilebilir.
 */
export class EventBus {
  #handlers = new Map(); // event -> Set<fn>

  on(event, fn) {
    if (!this.#handlers.has(event)) this.#handlers.set(event, new Set());
    this.#handlers.get(event).add(fn);
    return () => this.off(event, fn); // aboneliği kaldırma fonksiyonu döner
  }

  off(event, fn) {
    this.#handlers.get(event)?.delete(fn);
  }

  once(event, fn) {
    const un = this.on(event, (...args) => { un(); fn(...args); });
    return un;
  }

  emit(event, payload) {
    const set = this.#handlers.get(event);
    if (!set) return;
    for (const fn of [...set]) fn(payload);
  }
}

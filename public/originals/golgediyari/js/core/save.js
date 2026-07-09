/**
 * SaveStore — sürümlü localStorage kayıt katmanı (iskelet).
 * Tüm kalıcı durum tek JSON altında tutulur; şema sürümü artınca migrate()
 * zinciri eski kayıtları taşır → oyuncu ilerlemesi asla kaybolmaz.
 * Save System adımında (11) slot/karakter desteğiyle genişletilecek;
 * arayüz şimdiden sabitlendi ki diğer sistemler buna karşı kod yazabilsin.
 */
const KEY = "oynava.golgediyari.save";
const SCHEMA_VERSION = 1;

/** Sürüm yükseltme adımları: [eskiSürüm] = (data) => yeniData */
const MIGRATIONS = {
  // 1: (data) => ({ ...data, yeniAlan: varsayılan })
};

export class SaveStore {
  #data;

  constructor() {
    this.#data = this.#load();
  }

  #load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return { v: SCHEMA_VERSION };
      let data = JSON.parse(raw);
      while (data.v < SCHEMA_VERSION) {
        const mig = MIGRATIONS[data.v];
        data = mig ? mig(data) : { ...data };
        data.v++;
      }
      return data;
    } catch {
      return { v: SCHEMA_VERSION }; // bozuk kayıt → sıfırdan (crash yok)
    }
  }

  get(path, fallback = undefined) {
    let cur = this.#data;
    for (const k of path.split(".")) {
      if (cur == null || typeof cur !== "object") return fallback;
      cur = cur[k];
    }
    return cur === undefined ? fallback : cur;
  }

  set(path, value) {
    const keys = path.split(".");
    let cur = this.#data;
    for (let i = 0; i < keys.length - 1; i++) {
      if (typeof cur[keys[i]] !== "object" || cur[keys[i]] === null) cur[keys[i]] = {};
      cur = cur[keys[i]];
    }
    cur[keys[keys.length - 1]] = value;
    this.flush();
  }

  flush() {
    try { localStorage.setItem(KEY, JSON.stringify(this.#data)); } catch { /* kota/private mode */ }
  }

  wipe() {
    this.#data = { v: SCHEMA_VERSION };
    this.flush();
  }
}

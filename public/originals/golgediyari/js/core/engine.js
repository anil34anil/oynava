/**
 * Engine — oyun döngüsü.
 * Sabit zaman adımlı simülasyon (60 Hz) + değişken kare hızında render.
 * Sabit adım: fizik/combat her cihazda deterministik davranır (mobil 30fps'te
 * de PC 144fps'te de aynı oyun) ve multiplayer senkronizasyonuna hazırdır.
 *
 * Sistem sözleşmesi: { name, update(ctx, dt)? , render(ctx, alpha)? }
 * ctx = { world, events, input, three:{scene,camera,renderer}, time }
 */
const STEP = 1 / 60;
const MAX_ACC = 0.25; // sekme arka plana alınıp dönünce "ölüm sarmalını" önler

export class Engine {
  #systems = [];
  #running = false;
  #acc = 0;
  #last = 0;
  #raf = 0;

  constructor(ctx) {
    this.ctx = ctx;
    ctx.time = { elapsed: 0, step: STEP };
    // Sekme gizlenince duraklat (pil + adalet)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) this.#last = 0;
    });
  }

  /** Sistemler kayıt sırasına göre çalışır (input → oyun mantığı → kamera → render). */
  register(system) {
    this.#systems.push(system);
    system.init?.(this.ctx);
    return this;
  }

  start() {
    if (this.#running) return;
    this.#running = true;
    this.#last = 0;
    const loop = (now) => {
      if (!this.#running) return;
      this.#raf = requestAnimationFrame(loop);
      now /= 1000;
      if (!this.#last) this.#last = now;
      this.#acc = Math.min(this.#acc + (now - this.#last), MAX_ACC);
      this.#last = now;

      while (this.#acc >= STEP) {
        this.ctx.time.elapsed += STEP;
        for (const s of this.#systems) s.update?.(this.ctx, STEP);
        this.#acc -= STEP;
      }
      const alpha = this.#acc / STEP; // render interpolasyonu için
      for (const s of this.#systems) s.render?.(this.ctx, alpha);
    };
    this.#raf = requestAnimationFrame(loop);
  }

  stop() {
    this.#running = false;
    cancelAnimationFrame(this.#raf);
  }
}

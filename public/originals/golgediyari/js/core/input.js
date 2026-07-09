/**
 * Input — cihazdan bağımsız AKSİYON katmanı.
 * Oyun kodu asla "W tuşu" ya da "A butonu" bilmez; yalnızca soyut aksiyonları
 * okur: move (analog vektör), attack, dodge, skill1-4, interact.
 * Kaynaklar: klavye+fare, Gamepad API, dokunmatik (sanal joystick UI adımında
 * bu katmana bağlanacak — oyun kodu değişmeden).
 */
const KEYMAP = {
  KeyW: "up", KeyS: "down", KeyA: "left", KeyD: "right",
  ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
  Space: "dodge", ShiftLeft: "dodge",
  KeyJ: "attack",
  Digit1: "skill1", Digit2: "skill2", Digit3: "skill3", Digit4: "skill4",
  KeyE: "interact", KeyI: "inventory", KeyC: "character", KeyT: "talents", Escape: "menu",
};
const PAD_BUTTONS = { 0: "attack", 1: "dodge", 2: "interact", 3: "inventory", 4: "skill1", 5: "skill2", 6: "skill3", 7: "skill4", 9: "menu" };
const DEADZONE = 0.22;

export class Input {
  #down = new Set();      // şu an basılı aksiyonlar
  #pressed = new Set();   // bu karede YENİ basılanlar (edge)
  #released = new Set();
  #digital = { up: false, down: false, left: false, right: false };
  #touchMove = null;      // sanal joystick {x,y} — UI katmanı yazar
  #pointerPressed = false; // bu karede YENİ tıklandı (tap, adım kaçırmasın diye edge)

  /** Analog hareket vektörü (x: sağ+, y: ileri+), uzunluk ≤ 1. */
  move = { x: 0, y: 0 };
  /** Fare/dokunuş ile hedefleme (dünya koordinatına çevirme kamera sisteminde). */
  pointer = { x: 0, y: 0, down: false };

  constructor(target = window) {
    target.addEventListener("keydown", (e) => {
      const a = KEYMAP[e.code];
      if (!a || e.repeat) return;
      e.preventDefault();
      this.#press(a);
    });
    target.addEventListener("keyup", (e) => {
      const a = KEYMAP[e.code];
      if (a) this.#release(a);
    });
    target.addEventListener("blur", () => this.#clearAll());
    target.addEventListener("pointermove", (e) => {
      this.pointer.x = e.clientX; this.pointer.y = e.clientY;
    });
    target.addEventListener("pointerdown", (e) => {
      if (!e.isPrimary) return;
      this.pointer.x = e.clientX; this.pointer.y = e.clientY;
      this.pointer.down = true;
      this.#pointerPressed = true;
    });
    target.addEventListener("pointerup", (e) => { if (e.isPrimary) this.pointer.down = false; });
  }

  #press(a) {
    if (a in this.#digital) { this.#digital[a] = true; return; }
    if (!this.#down.has(a)) this.#pressed.add(a);
    this.#down.add(a);
  }
  #release(a) {
    if (a in this.#digital) { this.#digital[a] = false; return; }
    if (this.#down.delete(a)) this.#released.add(a);
  }
  #clearAll() {
    this.#down.clear();
    Object.keys(this.#digital).forEach((k) => (this.#digital[k] = false));
  }

  /** Sanal joystick (mobil UI) buraya vektör yazar; null = pasif. */
  setTouchMove(v) { this.#touchMove = v; }

  /** Mobil butonlar/testler aksiyonu buradan tetikler (klavyeyle aynı yoldan geçer). */
  simulate(action, down) { down ? this.#press(action) : this.#release(action); }

  held(a) { return this.#down.has(a); }
  justPressed(a) { return this.#pressed.has(a); }
  justReleased(a) { return this.#released.has(a); }
  /** Bu karede yeni tıklama/dokunuş başladı mı (tap dahil — pointerup gelmiş olsa bile). */
  justPointerDown() { return this.#pointerPressed; }

  /** Engine her sabit adım başında çağırır: gamepad'i örnekle, move'u birleştir. */
  update() {
    // Gamepad (bağlıysa ilk pad)
    let gx = 0, gy = 0;
    const pad = navigator.getGamepads?.()[0];
    if (pad) {
      const ax = pad.axes[0] ?? 0, ay = pad.axes[1] ?? 0;
      if (Math.hypot(ax, ay) > DEADZONE) { gx = ax; gy = -ay; }
      for (const [i, a] of Object.entries(PAD_BUTTONS)) {
        const b = pad.buttons[i];
        if (b?.pressed) this.#press(a);
        else if (this.#down.has(a)) this.#release(a);
      }
    }
    // Öncelik: dokunmatik > gamepad > klavye
    if (this.#touchMove) {
      this.move.x = this.#touchMove.x; this.move.y = this.#touchMove.y;
    } else if (gx || gy) {
      this.move.x = gx; this.move.y = gy;
    } else {
      const d = this.#digital;
      let x = (d.right ? 1 : 0) - (d.left ? 1 : 0);
      let y = (d.up ? 1 : 0) - (d.down ? 1 : 0);
      const len = Math.hypot(x, y);
      if (len > 1) { x /= len; y /= len; }
      this.move.x = x; this.move.y = y;
    }
  }

  /** Engine her sabit adım SONUNDA çağırır: edge bayraklarını temizle. */
  endFrame() {
    this.#pressed.clear();
    this.#released.clear();
    this.#pointerPressed = false;
  }
}

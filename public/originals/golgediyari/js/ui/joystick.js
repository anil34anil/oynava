/**
 * JoystickSystem — mobil kontroller (adım 10, dokunmatik).
 * Yalnız kaba işaretçili (dokunmatik) cihazlarda kurulur.
 * Sol: sanal joystick → input.setTouchMove (aksiyon katmanına analog vektör).
 * Sağ: Saldırı (büyük) + Dodge + 4 skill butonu → input.simulate ile klavyeyle
 * AYNI yoldan geçer; oyun kodu mobil olduğunu bilmez.
 */
export function createJoystickSystem() {
  return {
    name: "joystick",

    init(ctx) {
      if (!matchMedia("(pointer: coarse)").matches) return;
      const { input } = ctx;
      const hud = document.getElementById("hud");

      // ── Sol joystick ──
      const zone = document.createElement("div");
      zone.className = "joy-zone";
      zone.innerHTML = `<div class="joy-base"><div class="joy-knob"></div></div>`;
      hud.appendChild(zone);
      const base = zone.firstChild, knob = base.firstChild;
      const R = 52;
      let touchId = null, cx = 0, cy = 0;

      zone.addEventListener("touchstart", (e) => {
        if (touchId !== null) return;
        const t = e.changedTouches[0];
        touchId = t.identifier;
        cx = t.clientX; cy = t.clientY;
        base.style.left = `${cx}px`; base.style.top = `${cy}px`;
        base.classList.add("on");
        e.preventDefault();
      }, { passive: false });

      zone.addEventListener("touchmove", (e) => {
        for (const t of e.changedTouches) {
          if (t.identifier !== touchId) continue;
          let dx = t.clientX - cx, dy = t.clientY - cy;
          const d = Math.hypot(dx, dy);
          if (d > R) { dx *= R / d; dy *= R / d; }
          knob.style.transform = `translate(${dx}px,${dy}px)`;
          input.setTouchMove({ x: dx / R, y: -dy / R }); // ekran-yukarı = ileri
        }
        e.preventDefault();
      }, { passive: false });

      const endJoy = (e) => {
        for (const t of e.changedTouches) {
          if (t.identifier !== touchId) continue;
          touchId = null;
          knob.style.transform = "";
          base.classList.remove("on");
          input.setTouchMove(null);
        }
      };
      zone.addEventListener("touchend", endJoy);
      zone.addEventListener("touchcancel", endJoy);

      // ── Sağ aksiyon butonları ──
      const pad = document.createElement("div");
      pad.className = "actionpad";
      const mkBtn = (cls, label, action) => {
        const b = document.createElement("div");
        b.className = `abtn ${cls}`;
        b.textContent = label;
        b.addEventListener("touchstart", (e) => { input.simulate(action, true); b.classList.add("on"); e.preventDefault(); e.stopPropagation(); }, { passive: false });
        const up = (e) => { input.simulate(action, false); b.classList.remove("on"); e.preventDefault(); };
        b.addEventListener("touchend", up);
        b.addEventListener("touchcancel", up);
        pad.appendChild(b);
        return b;
      };
      mkBtn("atk", "⚔️", "attack");
      mkBtn("ddg", "💨", "dodge");
      mkBtn("s1", "🌑", "skill1");
      mkBtn("s2", "💥", "skill2");
      mkBtn("s3", "🩸", "skill3");
      mkBtn("s4", "🌀", "skill4");
      hud.appendChild(pad);
    },
  };
}

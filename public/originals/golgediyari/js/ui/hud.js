/**
 * HudSystem — savaş içi arayüz (adım 10).
 * Can/mana küreleri, saldırı+4 skill barı (cooldown süpürgeli), XP barı,
 * seviye/altın, bölge adı, düşman can barları (yalnız hasarlılar),
 * boss barı, ölüm perdesi, seviye atlama flaşı.
 * DOM bir kez kurulur; her render'da yalnız değerler güncellenir (reflow yok).
 */
import { SKILLS } from "../skills/skills.js";
import { BALANCE } from "../config/balance.js";

export function createHudSystem() {
  let el = {};             // isim → DOM referansı
  const hpBars = new Map(); // enemyId → bar div
  let bossId = null;

  function h(tag, cls, parent, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    parent.appendChild(e);
    return e;
  }

  return {
    name: "hud",

    init(ctx) {
      const { events, world } = ctx;
      const hud = document.getElementById("hud");

      // Bölge adı + altın + seviye
      const top = h("div", "hud-top", hud);
      el.zone = h("div", "hud-zone", top, "Kül Ovası");
      const tr = h("div", "hud-topright", top);
      el.level = h("span", "hud-level", tr, "Sv 1");
      el.gold = h("span", "hud-gold", tr, "0 🜚");

      // Boss barı
      el.bossWrap = h("div", "hud-boss hidden", hud);
      el.bossName = h("div", "hud-boss-name", el.bossWrap, "");
      const bossOuter = h("div", "hud-boss-bar", el.bossWrap);
      el.bossFill = h("div", "hud-boss-fill", bossOuter);

      // Alt bar: küreler + skiller + xp
      const bottom = h("div", "hud-bottom", hud);
      el.hpOrb = h("div", "orb hp", bottom);
      el.hpFill = h("div", "orb-fill", el.hpOrb);
      el.hpText = h("div", "orb-text", el.hpOrb, "");
      const bar = h("div", "skillbar", bottom);
      el.slots = {};
      const mk = (key, label, icon) => {
        const s = h("div", "skillslot", bar);
        s.dataset.key = key;
        h("div", "ss-icon", s, icon);
        el.slots[key] = { root: s, cd: h("div", "ss-cd", s), key: h("div", "ss-key", s, label) };
      };
      mk("attack", "J", "⚔️");
      Object.entries(SKILLS).forEach(([k, S], i) => mk(k, String(i + 1), S.icon));
      el.manaOrb = h("div", "orb mana", bottom);
      el.manaFill = h("div", "orb-fill", el.manaOrb);
      el.manaText = h("div", "orb-text", el.manaOrb, "");
      el.xpOuter = h("div", "xpbar", hud);
      el.xpFill = h("div", "xp-fill", el.xpOuter);

      // Panel açma butonları (mobil erişim; klavye: I / C / T)
      const menu = h("div", "hud-menu", hud);
      [["inventory", "🎒"], ["character", "🧍"], ["talents", "✨"]].forEach(([a, ic]) => {
        const b = h("button", "hud-btn", menu, ic);
        b.addEventListener("pointerdown", (e) => { e.stopPropagation(); events.emit("ui:toggle", { panel: a }); });
      });

      // Ölüm perdesi + seviye flaşı
      el.death = h("div", "death-veil hidden", hud);
      h("div", "death-text", el.death, "ÖLDÜN");
      h("div", "death-sub", el.death, "Gölgeler seni geri getiriyor...");
      el.lvlFlash = h("div", "lvl-flash hidden", hud, "");

      events.on("combat:death", ({ id }) => { if (world.has(id, "player")) el.death.classList.remove("hidden"); });
      events.on("player:respawn", () => el.death.classList.add("hidden"));
      events.on("player:levelup", ({ level }) => {
        el.lvlFlash.textContent = `SEVİYE ${level}!`;
        el.lvlFlash.classList.remove("hidden");
        setTimeout(() => el.lvlFlash.classList.add("hidden"), 1800);
      });
      events.on("boss:spawn", ({ id, name }) => {
        bossId = id;
        el.bossName.textContent = name;
        el.bossWrap.classList.remove("hidden");
      });
      events.on("ui:zone", ({ name }) => { el.zone.textContent = name; });
    },

    render(ctx) {
      const { world, inv, skills, cam } = ctx;
      const pid = world.first("player", "health");
      if (pid === null) return;
      const hp = world.get(pid, "health");
      const mana = world.get(pid, "mana");
      const prog = world.get(pid, "progress");

      el.hpFill.style.height = `${(hp.hp / hp.max) * 100}%`;
      el.hpText.textContent = `${Math.ceil(hp.hp)}`;
      el.manaFill.style.height = `${(mana.mp / mana.max) * 100}%`;
      el.manaText.textContent = `${Math.floor(mana.mp)}`;
      el.gold.textContent = `${inv.bag.gold} 🜚`;

      if (prog) {
        el.level.textContent = `Sv ${prog.level}`;
        el.xpFill.style.width = `${(prog.xp / BALANCE.xp.needed(prog.level)) * 100}%`;
      }

      // Skill slotları: kilit + cooldown + mana yetersiz
      for (const [key, S] of Object.entries(SKILLS)) {
        const slot = el.slots[key];
        const locked = (prog?.level ?? 1) < S.unlock;
        slot.root.classList.toggle("locked", locked);
        slot.root.classList.toggle("nomana", !locked && mana.mp < S.mana);
        const cd = skills.cooldowns[key];
        slot.cd.style.height = cd > 0 ? `${(cd / S.cd) * 100}%` : "0";
      }

      // Düşman can barları — yalnız hasar almış canlılar
      const seen = new Set();
      const p = { x: 0, y: 0, behind: false };
      for (const eid of world.query("enemy", "health", "transform")) {
        const h2 = world.get(eid, "health");
        if (world.has(eid, "dead") || h2.hp >= h2.max) continue;
        const t = world.get(eid, "transform");
        cam.worldToScreen(t.x, 2.2 * (world.get(eid, "enemy").def.scale ?? 1), t.z, p);
        if (p.behind) continue;
        seen.add(eid);
        let bar = hpBars.get(eid);
        if (!bar) {
          bar = document.createElement("div");
          bar.className = "ehp";
          bar.innerHTML = "<i></i>";
          document.getElementById("hud").appendChild(bar);
          hpBars.set(eid, bar);
        }
        bar.style.transform = `translate(${p.x}px,${p.y}px) translateX(-50%)`;
        bar.firstChild.style.width = `${(h2.hp / h2.max) * 100}%`;
      }
      for (const [eid, bar] of hpBars) if (!seen.has(eid)) { bar.remove(); hpBars.delete(eid); }

      // Boss barı
      if (bossId !== null) {
        if (!world.isAlive(bossId) || world.has(bossId, "dead")) {
          el.bossWrap.classList.add("hidden");
          bossId = null;
        } else {
          const bh = world.get(bossId, "health");
          el.bossFill.style.width = `${(bh.hp / bh.max) * 100}%`;
        }
      }
    },
  };
}

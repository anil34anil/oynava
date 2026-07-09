/**
 * QuestSystem — NPC "Kâhya Deren" + görev zinciri + günlük görev (NPC + Quest + Daily).
 * NPC ova merkezinin kenarında durur; yaklaşınca E ipucu, E ile görev paneli.
 * Zincir görevler sırayla açılır; günlük görev tarihe kilitlidir (her gün yenilenir).
 * İlerleme enemy:died üzerinden sayılır; ödül: altın + XP (+ boss görevi item).
 * Durum save'e yazılır. Yayınlar: quest:done
 */
/* global THREE */
import { Assets } from "../core/assets.js";
import { generateItem } from "../items/items.js";

const NPC_POS = { x: -4, z: 16 };
const TALK_R = 2.2;

/** Zincir görevler — sırayla. cond: enemy:died payload'ına bakar ("event" tipi worldevent:cleared sayar). */
const CHAIN = [
  { id: "q1", tr: "İlk Temizlik", desc: "10 düşman öldür", need: 10, cond: () => true, gold: 100, xp: 200 },
  { id: "q2", tr: "Seçkin Avı", desc: "3 elite düşman öldür", need: 3, cond: (e) => e.elite, gold: 300, xp: 400 },
  { id: "q3", tr: "Devlerin Sonu", desc: "5 Mezar Devi öldür", need: 5, cond: (e) => e.type === "mezar_devi", gold: 450, xp: 600 },
  { id: "q4", tr: "Zindanın Kalbi", desc: "Kara Bekçi'yi öldür", need: 1, cond: (e) => e.boss, gold: 1000, xp: 1500, item: true },
  { id: "q5", tr: "Zindan Temizliği", desc: "Kara Zindan'da 15 düşman öldür", need: 15, cond: (e) => e.x > 150, gold: 700, xp: 900 },
  { id: "q6", tr: "Ova Bekçisi", desc: "2 Gölge İstilası püskürt", need: 2, event: "worldevent:cleared", gold: 900, xp: 1200, item: true },
];

function todayKey() { return new Date().toISOString().slice(0, 10); }

export function createQuestSystem() {
  let state;   // { chainIdx, progress, daily:{date, count, done} }
  let panel, hint, tracker, open = false;

  function dailyNeed() { return 25; }

  /** HUD görev takipçisi — aktif görev + günlük her an ekranda. */
  function renderTracker() {
    const q = CHAIN[state.chainIdx];
    const d = state.daily;
    let html = `<div class="qt-title">📜 GÖREVLER</div>`;
    html += q
      ? `<div class="qt-q"><b>${q.tr}</b> — ${q.desc} <span class="qt-p">${Math.min(state.progress, q.need)}/${q.need}</span></div>`
      : `<div class="qt-q qt-done">Zincir tamamlandı ✓</div>`;
    html += d.done
      ? `<div class="qt-q qt-done">☀ Günün Avı ✓</div>`
      : `<div class="qt-q">☀ Günün Avı <span class="qt-p">${Math.min(d.count, dailyNeed())}/${dailyNeed()}</span></div>`;
    tracker.innerHTML = html;
  }

  function render(ctx) {
    if (!open) { panel.classList.add("hidden"); return; }
    panel.classList.remove("hidden");
    const q = CHAIN[state.chainIdx];
    let html = `<div class="panel-head"><span class="panel-title">📜 Kâhya Deren</span><button class="panel-x">✕</button></div><div class="panel-body">`;
    if (q) {
      html += `<div class="q-row"><b>${q.tr}</b><div class="tal-desc">${q.desc}</div>
        <div class="q-prog">${Math.min(state.progress, q.need)}/${q.need}</div>
        <div class="tal-desc">Ödül: ${q.gold} altın · ${q.xp} XP${q.item ? " · Destansı ganimet" : ""}</div></div><hr>`;
    } else {
      html += `<div class="q-row"><b>Tüm görevler tamam!</b><div class="tal-desc">Gölgeler senden korkuyor.</div></div><hr>`;
    }
    const d = state.daily;
    html += `<div class="q-row"><b>☀ Günün Avı</b><div class="tal-desc">Bugün ${dailyNeed()} düşman öldür</div>
      <div class="q-prog">${d.done ? "TAMAMLANDI" : `${Math.min(d.count, dailyNeed())}/${dailyNeed()}`}</div>
      <div class="tal-desc">Ödül: 500 altın</div></div></div>`;
    panel.innerHTML = html;
    panel.querySelector(".panel-x").addEventListener("pointerdown", () => { open = false; render(ctx); });
    panel.addEventListener("pointerdown", (e) => e.stopPropagation());
  }

  return {
    name: "quests",

    init(ctx) {
      const { world, events, three, save } = ctx;

      state = save.get("quests") ?? { chainIdx: 0, progress: 0, daily: { date: todayKey(), count: 0, done: false } };
      if (state.daily.date !== todayKey()) state.daily = { date: todayKey(), count: 0, done: false }; // günlük sıfırla

      // NPC görseli: altın cübbeli kâhya (oyuncu gövdesi, altın kaplama + fener ışığı)
      const npc = Assets.playerPawn();
      const gold = Assets.std(0xfbbf24, { metalness: 0.3, roughness: 0.5 });
      npc.traverse((c) => { if (c.isMesh) c.material = gold; });
      npc.position.set(NPC_POS.x, 0, NPC_POS.z);
      const lantern = new THREE.PointLight(0xffc86b, 1.1, 7);
      lantern.position.y = 2;
      npc.add(lantern);
      three.scene.add(npc);

      // DOM
      const hud = document.getElementById("hud");
      hint = document.createElement("div");
      hint.className = "npc-hint hidden";
      hint.textContent = "E — Konuş";
      hud.appendChild(hint);
      panel = document.createElement("div");
      panel.className = "panel quest-panel hidden";
      hud.appendChild(panel);
      tracker = document.createElement("div");
      tracker.className = "q-tracker";
      hud.appendChild(tracker);
      renderTracker();

      function advance(q) {
        state.progress++;
        if (state.progress >= q.need) {
          ctx.inv.addGold(q.gold);
          ctx.progress.addXp(q.xp);
          if (q.item) ctx.inv.addItem(generateItem((ctx.progress.data.level ?? 1) + 2, { rarity: "epic" }));
          events.emit("quest:done", { id: q.id, tr: q.tr });
          state.chainIdx++;
          state.progress = 0;
        }
      }

      events.on("enemy:died", (e) => {
        const q = CHAIN[state.chainIdx];
        if (q && !q.event && q.cond(e)) advance(q);
        if (!state.daily.done) {
          state.daily.count++;
          if (state.daily.count >= dailyNeed()) {
            state.daily.done = true;
            ctx.inv.addGold(500);
            events.emit("quest:done", { id: "daily", tr: "Günün Avı" });
          }
        }
        save.set("quests", state);
        renderTracker();
        if (open) render(ctx);
      });

      // Olay tabanlı görevler (ör. q6: istila püskürtme)
      events.on("worldevent:cleared", () => {
        const q = CHAIN[state.chainIdx];
        if (q?.event === "worldevent:cleared") {
          advance(q);
          save.set("quests", state);
          renderTracker();
          if (open) render(ctx);
        }
      });

      // Görev tamamlanınca toast
      events.on("quest:done", ({ tr }) => {
        const el = document.createElement("div");
        el.className = "ach-toast";
        el.textContent = `📜 Görev tamamlandı: ${tr}`;
        hud.appendChild(el);
        setTimeout(() => el.remove(), 3200);
      });
    },

    update(ctx) {
      const { world, input, cam } = ctx;
      const pid = world.first("player", "transform");
      if (pid === null) return;
      const t = world.get(pid, "transform");
      const near = Math.hypot(t.x - NPC_POS.x, t.z - NPC_POS.z) < TALK_R;

      if (near && input.justPressed("interact")) { open = !open; render(ctx); }
      if (!near && open) { open = false; render(ctx); }

      // E ipucu NPC üstünde
      if (near && !open) {
        const p = { x: 0, y: 0, behind: false };
        cam.worldToScreen(NPC_POS.x, 2.3, NPC_POS.z, p);
        hint.style.transform = `translate(${p.x}px,${p.y}px) translateX(-50%)`;
        hint.classList.remove("hidden");
      } else hint.classList.add("hidden");
    },
  };
}

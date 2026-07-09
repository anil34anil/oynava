/**
 * AchievementSystem — başarımlar + yerel liderlik istatistikleri (adım: meta).
 * Olay dinleyerek koşulları sayar; açılan başarım toast ile duyurulur ve
 * save'e yazılır. 🏆 butonu: başarım listesi + kişisel rekorlar
 * (liderlik tablosu — şimdilik yerel; multiplayer'da sunucuya taşınacak şekil
 * zaten düz JSON).
 */
const DEFS = [
  { id: "ilk_kan",    tr: "İlk Kan",          desc: "İlk düşmanını öldür" },
  { id: "avci_100",   tr: "Avcı",             desc: "100 düşman öldür" },
  { id: "kiyim_500",  tr: "Kıyım",            desc: "500 düşman öldür" },
  { id: "seviye_10",  tr: "Tecrübeli",        desc: "10. seviyeye ulaş" },
  { id: "seviye_25",  tr: "Usta",             desc: "25. seviyeye ulaş" },
  { id: "efsanevi",   tr: "Efsane Toplayıcı", desc: "Efsanevi bir eşya bul" },
  { id: "boss",       tr: "Bekçi Katili",     desc: "Kara Bekçi'yi öldür" },
  { id: "istila",     tr: "Savunmacı",        desc: "Bir Gölge İstilası'nı püskürt" },
  { id: "zengin",     tr: "Hazine Avcısı",    desc: "Toplam 2000 altın kazan" },
];

export function createAchievementSystem() {
  let data;   // { unlocked:{id:true}, stats:{kills, bossKills, goldEarned, bestDungeonTime, maxLevel} }
  let panel, open = false;

  function toast(text) {
    const el = document.createElement("div");
    el.className = "ach-toast";
    el.textContent = `🏆 ${text}`;
    document.getElementById("hud").appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }

  return {
    name: "achievements",

    init(ctx) {
      const { events, save, world } = ctx;
      data = save.get("meta") ?? {
        unlocked: {},
        stats: { kills: 0, bossKills: 0, goldEarned: 0, bestDungeonTime: null, maxLevel: 1 },
      };
      const S = data.stats;

      function unlock(id) {
        if (data.unlocked[id]) return;
        data.unlocked[id] = true;
        const def = DEFS.find((d) => d.id === id);
        toast(def?.tr ?? id);
        save.set("meta", data);
      }
      const persist = () => save.set("meta", data);

      events.on("enemy:died", ({ boss }) => {
        S.kills++;
        if (S.kills === 1) unlock("ilk_kan");
        if (S.kills >= 100) unlock("avci_100");
        if (S.kills >= 500) unlock("kiyim_500");
        if (boss) { S.bossKills++; unlock("boss"); }
        persist();
      });
      events.on("player:levelup", ({ level }) => {
        S.maxLevel = Math.max(S.maxLevel, level);
        if (level >= 10) unlock("seviye_10");
        if (level >= 25) unlock("seviye_25");
        persist();
      });
      events.on("loot:pickup", ({ gold, item }) => {
        if (gold) { S.goldEarned += gold; if (S.goldEarned >= 2000) unlock("zengin"); }
        if (item?.rarity === "legendary") unlock("efsanevi");
        persist();
      });
      events.on("worldevent:cleared", () => unlock("istila"));
      events.on("dungeon:cleared", ({ time }) => {
        if (S.bestDungeonTime === null || time < S.bestDungeonTime) S.bestDungeonTime = time;
        persist();
      });

      // Panel + buton
      const hud = document.getElementById("hud");
      const btn = document.createElement("button");
      btn.className = "hud-btn";
      btn.textContent = "🏆";
      hud.querySelector(".hud-menu").appendChild(btn);
      panel = document.createElement("div");
      panel.className = "panel hidden";
      hud.appendChild(panel);

      const render = () => {
        if (!open) { panel.classList.add("hidden"); return; }
        panel.classList.remove("hidden");
        let html = `<div class="panel-head"><span class="panel-title">🏆 Başarımlar</span><button class="panel-x">✕</button></div><div class="panel-body">`;
        for (const d of DEFS) {
          const ok = !!data.unlocked[d.id];
          html += `<div class="tal-row" style="opacity:${ok ? 1 : 0.45}"><div><b>${ok ? "✅" : "🔒"} ${d.tr}</b><div class="tal-desc">${d.desc}</div></div></div>`;
        }
        html += `<hr><b>Kişisel Rekorlar</b>
          <div class="st-row"><span>Toplam Kill</span><b>${S.kills}</b></div>
          <div class="st-row"><span>Boss Kill</span><b>${S.bossKills}</b></div>
          <div class="st-row"><span>En Yüksek Seviye</span><b>${S.maxLevel}</b></div>
          <div class="st-row"><span>Kazanılan Altın</span><b>${S.goldEarned}</b></div>
          <div class="st-row"><span>En Hızlı Zindan</span><b>${S.bestDungeonTime ? S.bestDungeonTime + " sn" : "—"}</b></div></div>`;
        panel.innerHTML = html;
        panel.querySelector(".panel-x").addEventListener("pointerdown", () => { open = false; render(); });
        panel.addEventListener("pointerdown", (e) => e.stopPropagation());
      };
      btn.addEventListener("pointerdown", (e) => { e.stopPropagation(); open = !open; render(); });
      void world;
    },
  };
}

/**
 * ProgressSystem — XP / seviye / stat puanı / talent (pasif) ağacı (adım 9).
 *
 * progress bileşeni: { level, xp, statPoints, talentPoints,
 *                      spent:{str,dex,int,vit}, talents:{id:rank} }
 * enemy:died → XP; seviye atlayınca puanlar + tam can + "player:levelup".
 * ctx.progress API: spendStat(k), spendTalent(id) — UI panelleri çağırır.
 * Talent etkileri stats türetmesine (inventory.recompute) çarpan olarak girer.
 */
import { BALANCE } from "../config/balance.js";

/** Pasif talent ağacı — veri odaklı: yeni pasif = yeni satır. */
export const TALENTS = {
  guc_ustaligi: { tr: "Güç Ustalığı",  desc: "Saldırı hasarı +%3/rütbe",  max: 5, mod: (s, r) => { s.attackDamage = Math.round(s.attackDamage * (1 + 0.03 * r)); } },
  celik_beden:  { tr: "Çelik Beden",   desc: "Azami can +%4/rütbe",       max: 5, mod: (s, r) => { s.hpMax = Math.round(s.hpMax * (1 + 0.04 * r)); } },
  olum_dokunusu:{ tr: "Ölüm Dokunuşu", desc: "Kritik şans +%1.5/rütbe",   max: 5, mod: (s, r) => { s.critChance += 0.015 * r; } },
  ruzgar_adimi: { tr: "Rüzgâr Adımı",  desc: "Hareket hızı +%3/rütbe",    max: 5, mod: (s, r) => { s.moveSpeed *= 1 + 0.03 * r; } },
  mana_akisi:   { tr: "Mana Akışı",    desc: "Azami mana +%6/rütbe",      max: 5, mod: (s, r) => { s.mpMax = Math.round(s.mpMax * (1 + 0.06 * r)); } },
  golge_ustasi: { tr: "Gölge Ustası",  desc: "Skill hasarı +%5/rütbe",    max: 5, mod: (s, r) => { s.skillPower = (s.skillPower ?? 1) * (1 + 0.05 * r); } },
};

export function createProgressSystem() {
  return {
    name: "progress",

    init(ctx) {
      const { world, events, inv } = ctx;
      const pid = world.first("player");
      const prog = world.add(pid, "progress", {
        level: 1, xp: 0, statPoints: 0, talentPoints: 0,
        spent: { str: 0, dex: 0, int: 0, vit: 0 },
        talents: {},
      });

      function addXp(n) {
        const X = BALANCE.xp;
        if (prog.level >= X.maxLevel) return;
        prog.xp += n;
        let leveled = false;
        while (prog.xp >= X.needed(prog.level) && prog.level < X.maxLevel) {
          prog.xp -= X.needed(prog.level);
          prog.level++;
          prog.statPoints += X.statPointsPerLevel;
          prog.talentPoints += X.talentPointsPerLevel;
          leveled = true;
        }
        if (leveled) {
          const h = world.get(pid, "health");
          h.hp = h.max; // seviye atlama tam can
          inv.recompute();
          events.emit("player:levelup", { level: prog.level });
        }
        events.emit("xp:changed", { xp: prog.xp, level: prog.level });
      }

      events.on("enemy:died", ({ xp }) => addXp(xp));

      ctx.progress = {
        get data() { return prog; },
        addXp,
        spendStat(k) {
          if (prog.statPoints <= 0 || !(k in prog.spent)) return false;
          prog.statPoints--;
          prog.spent[k]++;
          inv.recompute();
          return true;
        },
        spendTalent(id) {
          const T = TALENTS[id];
          if (!T || prog.talentPoints <= 0) return false;
          const cur = prog.talents[id] ?? 0;
          if (cur >= T.max) return false;
          prog.talentPoints--;
          prog.talents[id] = cur + 1;
          inv.recompute();
          return true;
        },
      };
    },
  };
}

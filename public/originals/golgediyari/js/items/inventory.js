/**
 * InventorySystem — çanta + ekipman + stat türetme (adım 7-8).
 *
 * Oyuncu bileşenleri:
 *   bag       { items: Item[], gold, size }
 *   equipment { weapon, helmet, chest, boots, ring, amulet }  (Item | null)
 *   stats     { attackDamage, attackCooldown, critChance, armor, hpMax, mpMax,
 *               str, dex, int, vit }  ← HER equip/çıkar/level işleminde yeniden türetilir
 *
 * Dış API (ctx.inv): addItem, addGold, equip(uid), unequip(slot), sell(uid),
 * socketGem(itemUid, gemUid), recompute(). UI (M3) ve Demirci (M4) bunu çağırır.
 * Yayınlar: inv:changed, stats:changed (UI dinler).
 */
import { BALANCE } from "../config/balance.js";
import { itemStats, RARITIES } from "./items.js";
import { TALENTS } from "../skills/progress.js";

export function createInventorySystem() {
  return {
    name: "inventory",

    init(ctx) {
      const { world, events } = ctx;
      const pid = world.first("player");
      const bag = world.add(pid, "bag", { items: [], gold: 0, size: 24 });
      const eq = world.add(pid, "equipment", {
        weapon: null, helmet: null, chest: null, boots: null, ring: null, amulet: null,
      });
      world.add(pid, "stats", {});

      function recompute() {
        const P = BALANCE.player.baseStats;
        const prog = world.get(pid, "progress"); // seviye sistemi (M3) stat puanı yazar
        const s = {
          str: P.str + (prog?.spent.str ?? 0),
          dex: P.dex + (prog?.spent.dex ?? 0),
          int: P.int + (prog?.spent.int ?? 0),
          vit: P.vit + (prog?.spent.vit ?? 0),
          dmg: 0, armor: 0, crit: 0, hp: 0, mp: 0,
        };
        for (const item of Object.values(eq)) {
          if (!item) continue;
          for (const [k, v] of Object.entries(itemStats(item))) s[k] = (s[k] ?? 0) + v;
        }
        const C = BALANCE.combat;
        const stats = world.get(pid, "stats");
        stats.str = s.str; stats.dex = s.dex; stats.int = s.int; stats.vit = s.vit;
        stats.attackDamage = Math.round(C.baseAttackDamage + s.str * 0.8 + s.dmg);
        stats.attackCooldown = Math.max(0.22, C.baseAttackCooldown * (1 - s.dex * 0.004));
        stats.critChance = C.critChance + s.dex * 0.002 + s.crit / 100;
        stats.armor = s.armor;
        stats.hpMax = Math.round(BALANCE.player.baseStats.hp + s.vit * 6 + s.hp);
        stats.mpMax = Math.round(BALANCE.player.baseStats.mana + s.int * 4 + s.mp);
        stats.moveSpeed = BALANCE.player.moveSpeed;
        stats.skillPower = 1;
        // Pasif talent çarpanları (adım 9) — puan harcanan her pasif stats'ı değiştirir
        if (prog) for (const [tid, rank] of Object.entries(prog.talents ?? {})) TALENTS[tid]?.mod(stats, rank);
        // Max can/mana güncelle (oranı koru)
        const h = world.get(pid, "health");
        const ratio = h.hp / h.max;
        h.max = stats.hpMax; h.hp = Math.min(h.max, Math.max(1, Math.round(h.max * ratio)));
        const m = world.get(pid, "mana");
        const mr = m.mp / m.max;
        m.max = stats.mpMax; m.mp = Math.round(m.max * mr);
        events.emit("stats:changed", { stats });
      }

      ctx.inv = {
        get bag() { return bag; },
        get equipment() { return eq; },
        recompute,

        addGold(n) { bag.gold += n; events.emit("inv:changed", {}); },

        addItem(item) {
          if (bag.items.length >= bag.size) return false;
          bag.items.push(item);
          events.emit("inv:changed", {});
          return true;
        },

        equip(uid) {
          const idx = bag.items.findIndex((i) => i.uid === uid);
          if (idx < 0) return false;
          const item = bag.items[idx];
          if (!(item.slot in eq)) return false; // gem vb. kuşanılamaz
          bag.items.splice(idx, 1);
          if (eq[item.slot]) bag.items.push(eq[item.slot]); // eskisini çantaya
          eq[item.slot] = item;
          recompute();
          events.emit("inv:changed", {});
          return true;
        },

        unequip(slot) {
          if (!eq[slot] || bag.items.length >= bag.size) return false;
          bag.items.push(eq[slot]);
          eq[slot] = null;
          recompute();
          events.emit("inv:changed", {});
          return true;
        },

        sell(uid) {
          const idx = bag.items.findIndex((i) => i.uid === uid);
          if (idx < 0) return false;
          const item = bag.items.splice(idx, 1)[0];
          bag.gold += Math.round(8 * RARITIES[item.rarity].mult * (1 + item.ilvl * 0.3));
          events.emit("inv:changed", {});
          return true;
        },

        socketGem(itemUid, gemUid) {
          const all = [...bag.items, ...Object.values(eq).filter(Boolean)];
          const item = all.find((i) => i.uid === itemUid);
          const gIdx = bag.items.findIndex((i) => i.uid === gemUid);
          if (!item || gIdx < 0) return false;
          const slot = item.sockets.findIndex((s) => s === null);
          if (slot < 0) return false;
          item.sockets[slot] = bag.items.splice(gIdx, 1)[0];
          recompute();
          events.emit("inv:changed", {});
          return true;
        },
      };

      recompute();
    },
  };
}

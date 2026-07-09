/**
 * PersistenceSystem — kayıt köprüsü (adım 11).
 * SaveStore (sürümlü localStorage) ile oyun durumu arasında çevirmen:
 * karakter ilerlemesi, çanta/ekipman/altın, başarımlar, liderlik istatistikleri.
 * Item'lar zaten düz JSON olduğundan serileştirme bedava.
 * Otomatik kayıt: 8 sn'de bir + sekme kapanırken.
 */
import { setUidBase } from "../items/items.js";

const AUTOSAVE_SEC = 8;

export function createPersistenceSystem() {
  let timer = 0;

  function collect(ctx) {
    const { world, inv } = ctx;
    const pid = world.first("player");
    const prog = world.get(pid, "progress");
    return {
      progress: { level: prog.level, xp: prog.xp, statPoints: prog.statPoints,
        talentPoints: prog.talentPoints, spent: prog.spent, talents: prog.talents },
      gold: inv.bag.gold,
      bag: inv.bag.items,
      equipment: inv.equipment,
    };
  }

  return {
    name: "persistence",

    init(ctx) {
      const { world, save, inv, events } = ctx;
      const pid = world.first("player");

      // ── Yükle ──
      const data = save.get("character");
      if (data) {
        const prog = world.get(pid, "progress");
        Object.assign(prog, data.progress);
        inv.bag.gold = data.gold ?? 0;
        inv.bag.items.push(...(data.bag ?? []));
        for (const [slot, item] of Object.entries(data.equipment ?? {})) {
          if (item) inv.equipment[slot] = item;
        }
        // uid çakışması önle
        let maxUid = 0;
        const scan = (i) => { if (i) { maxUid = Math.max(maxUid, i.uid); i.sockets?.forEach(scan); } };
        inv.bag.items.forEach(scan);
        Object.values(inv.equipment).forEach(scan);
        setUidBase(maxUid);
        inv.recompute();
        // Yüklenen seviyeye göre tam can başla
        const h = world.get(pid, "health");
        h.hp = h.max;
        events.emit("xp:changed", { xp: prog.xp, level: prog.level });
      }

      const persist = () => { save.set("character", collect(ctx)); };
      addEventListener("beforeunload", persist);
      addEventListener("visibilitychange", () => { if (document.hidden) persist(); });
      ctx.persist = persist; // başarım/görev sistemleri anında kayıt için çağırabilir
    },

    update(ctx, dt) {
      timer += dt;
      if (timer >= AUTOSAVE_SEC) {
        timer = 0;
        ctx.persist();
      }
    },
  };
}

/**
 * PanelSystem — Envanter (I) / Karakter (C) / Yetenekler (T) panelleri (adım 10).
 * Tek panel açık kalır; içerik yalnız açıkken ve inv:changed/stats:changed
 * olaylarında yeniden çizilir (her karede DOM üretimi YOK).
 * Item tıklama → detay + eylemler (Kuşan / Sat / Taş Tak).
 */
import { RARITIES, SLOTS, AFFIX_TR, upgradeCost, applyUpgrade, enchantCost, applyEnchant } from "../items/items.js";
import { TALENTS } from "../skills/progress.js";

export function createPanelSystem() {
  let open = null;      // "inventory" | "character" | "talents" | null
  let root, body, title;
  let selectedUid = null;
  let ctxRef;

  function itemLabel(item) {
    return `<b style="color:${RARITIES[item.rarity].color}">${item.name}</b>`;
  }

  function itemDetails(item) {
    const rows = [];
    rows.push(`<div class="tt-rar" style="color:${RARITIES[item.rarity].color}">${RARITIES[item.rarity].tr} ${item.slot === "gem" ? "Taş" : SLOTS[item.slot].tr} · Sv ${item.ilvl}${item.upLvl ? ` · +${item.upLvl}` : ""}</div>`);
    if (item.base.dmg) rows.push(`<div>Hasar: <b>${item.base.dmg}</b></div>`);
    if (item.base.armor) rows.push(`<div>Zırh: <b>${item.base.armor}</b></div>`);
    for (const [k, v] of Object.entries(item.affixes)) rows.push(`<div class="tt-affix">+${v} ${AFFIX_TR[k] ?? k}</div>`);
    if (item.sockets.length) {
      const s = item.sockets.map((g) => (g ? `● ${g.name}` : "○ boş soket")).join(" · ");
      rows.push(`<div class="tt-sock">${s}</div>`);
    }
    return rows.join("");
  }

  function render() {
    if (!open) { root.classList.add("hidden"); return; }
    root.classList.remove("hidden");
    const { world, inv, progress } = ctxRef;
    const pid = world.first("player");
    const prog = world.get(pid, "progress");
    const stats = world.get(pid, "stats");

    if (open === "inventory") {
      title.textContent = `🎒 Envanter — ${inv.bag.gold} altın`;
      let html = `<div class="eq-row">`;
      for (const [slot, item] of Object.entries(inv.equipment)) {
        html += `<div class="eq-slot" data-unequip="${slot}" title="${SLOTS[slot].tr}">
          <span class="eq-name">${item ? itemLabel(item) : `<i>${SLOTS[slot].tr}</i>`}</span></div>`;
      }
      html += `</div><div class="bag-grid">`;
      inv.bag.items.forEach((item) => {
        html += `<div class="bag-item ${selectedUid === item.uid ? "sel" : ""}" data-uid="${item.uid}"
          style="border-color:${RARITIES[item.rarity].color}">${item.slot === "gem" ? "💎" : { weapon: "⚔️", helmet: "🪖", chest: "🛡️", boots: "🥾", ring: "💍", amulet: "📿" }[item.slot]}</div>`;
      });
      for (let i = inv.bag.items.length; i < inv.bag.size; i++) html += `<div class="bag-item empty"></div>`;
      html += `</div>`;
      const sel = inv.bag.items.find((i) => i.uid === selectedUid);
      if (sel) {
        html += `<div class="tt">${itemLabel(sel)}${itemDetails(sel)}<div class="tt-actions">`;
        if (sel.slot !== "gem") html += `<button data-act="equip">Kuşan</button>`;
        if (sel.slot === "gem") html += `<button data-act="socket">Taş Tak (silaha)</button>`;
        if (sel.slot !== "gem") html += `<button data-act="upgrade">Yükselt (${upgradeCost(sel)} altın)</button>`;
        if (sel.slot !== "gem" && Object.keys(sel.affixes).length > 0)
          html += `<button data-act="enchant">Büyüle (${enchantCost(sel)} altın)</button>`;
        html += `<button data-act="sell">Sat</button></div></div>`;
      }
      body.innerHTML = html;
    } else if (open === "character") {
      title.textContent = `🧍 Karakter — Sv ${prog.level}`;
      const st = (k, tr) => `<div class="st-row"><span>${tr}</span><b>${stats[k]}</b>
        ${prog.statPoints > 0 ? `<button data-stat="${k === "str" ? "str" : k}">+</button>` : ""}</div>`;
      body.innerHTML = `
        <div class="st-pts">Stat Puanı: <b>${prog.statPoints}</b></div>
        <div class="st-row"><span>Güç</span><b>${stats.str}</b>${prog.statPoints > 0 ? '<button data-stat="str">+</button>' : ""}</div>
        <div class="st-row"><span>Çeviklik</span><b>${stats.dex}</b>${prog.statPoints > 0 ? '<button data-stat="dex">+</button>' : ""}</div>
        <div class="st-row"><span>Zeka</span><b>${stats.int}</b>${prog.statPoints > 0 ? '<button data-stat="int">+</button>' : ""}</div>
        <div class="st-row"><span>Dayanıklılık</span><b>${stats.vit}</b>${prog.statPoints > 0 ? '<button data-stat="vit">+</button>' : ""}</div>
        <hr>
        <div class="st-row"><span>Saldırı Hasarı</span><b>${stats.attackDamage}</b></div>
        <div class="st-row"><span>Kritik Şans</span><b>%${(stats.critChance * 100).toFixed(1)}</b></div>
        <div class="st-row"><span>Zırh</span><b>${stats.armor}</b></div>
        <div class="st-row"><span>Azami Can</span><b>${stats.hpMax}</b></div>
        <div class="st-row"><span>Azami Mana</span><b>${stats.mpMax}</b></div>`;
      void st;
    } else if (open === "talents") {
      title.textContent = `✨ Yetenekler — Puan: ${prog.talentPoints}`;
      let html = "";
      for (const [id, T] of Object.entries(TALENTS)) {
        const rank = prog.talents[id] ?? 0;
        html += `<div class="tal-row">
          <div><b>${T.tr}</b> <span class="tal-rank">${rank}/${T.max}</span><div class="tal-desc">${T.desc}</div></div>
          ${prog.talentPoints > 0 && rank < T.max ? `<button data-talent="${id}">+</button>` : ""}</div>`;
      }
      body.innerHTML = html;
      void progress;
    }
  }

  return {
    name: "panels",

    init(ctx) {
      ctxRef = ctx;
      const hud = document.getElementById("hud");
      root = document.createElement("div");
      root.className = "panel hidden";
      root.innerHTML = `<div class="panel-head"><span class="panel-title"></span><button class="panel-x">✕</button></div><div class="panel-body"></div>`;
      hud.appendChild(root);
      title = root.querySelector(".panel-title");
      body = root.querySelector(".panel-body");
      root.querySelector(".panel-x").addEventListener("pointerdown", () => { open = null; render(); });

      // Tek delegasyonla tüm tıklamalar
      body.addEventListener("pointerdown", (e) => {
        e.stopPropagation();
        const t = e.target;
        const { inv, progress } = ctx;
        if (t.dataset.uid) { selectedUid = Number(t.dataset.uid); render(); return; }
        if (t.dataset.unequip) { inv.unequip(t.dataset.unequip); return; }
        if (t.dataset.stat) { progress.spendStat(t.dataset.stat); return; }
        if (t.dataset.talent) { progress.spendTalent(t.dataset.talent); return; }
        if (t.dataset.act) {
          const item = inv.bag.items.find((i) => i.uid === selectedUid);
          if (!item) return;
          if (t.dataset.act === "equip") inv.equip(item.uid);
          if (t.dataset.act === "sell") { inv.sell(item.uid); selectedUid = null; }
          if (t.dataset.act === "socket") {
            const target = inv.equipment.weapon ?? Object.values(inv.equipment).find((i) => i?.sockets.includes(null));
            if (target) inv.socketGem(target.uid, item.uid);
          }
          if (t.dataset.act === "upgrade" && inv.bag.gold >= upgradeCost(item)) {
            inv.addGold(-upgradeCost(item));
            applyUpgrade(item);
            inv.recompute();
          }
          if (t.dataset.act === "enchant" && inv.bag.gold >= enchantCost(item)) {
            inv.addGold(-enchantCost(item));
            applyEnchant(item);
            inv.recompute();
          }
          render();
        }
      });
      root.addEventListener("pointerdown", (e) => e.stopPropagation());

      ctx.events.on("ui:toggle", ({ panel }) => { open = open === panel ? null : panel; render(); });
      ctx.events.on("inv:changed", () => { if (open) render(); });
      ctx.events.on("stats:changed", () => { if (open) render(); });
      ctx.events.on("player:levelup", () => { if (open) render(); });
    },

    update(ctx) {
      const { input } = ctx;
      if (input.justPressed("inventory")) { open = open === "inventory" ? null : "inventory"; render(); }
      if (input.justPressed("character")) { open = open === "character" ? null : "character"; render(); }
      if (input.justPressed("talents")) { open = open === "talents" ? null : "talents"; render(); }
      if (input.justPressed("menu") && open) { open = null; render(); }
    },
  };
}

/**
 * GölgeDiyarı — Oynava Originals ARPG. Önyükleme (bootstrap).
 * Sistem kayıt SIRASI çalışma sırasıdır:
 *   input → oyun mantığı sistemleri → kamera → render
 * Yeni sistem eklemek = createXSystem() yazıp buraya register etmek;
 * mevcut hiçbir dosyaya dokunulmaz (açık/kapalı ilkesi).
 */
import { Engine } from "./core/engine.js";
import { World } from "./core/ecs.js";
import { EventBus } from "./core/events.js";
import { Input } from "./core/input.js";
import { SaveStore } from "./core/save.js";
import { createThree } from "./world/scene.js";
import { createCameraSystem } from "./world/camera.js";
import { createPlayerSystem } from "./world/player.js";
import { createPlayerAttackSystem } from "./combat/playerAttack.js";
import { createCombatSystem } from "./combat/combat.js";
import { createProjectileSystem } from "./combat/projectiles.js";
import { createEnemySystem } from "./enemies/enemies.js";
import { createZoneSystem } from "./world/zones.js";
import { createInventorySystem } from "./items/inventory.js";
import { createLootSystem } from "./items/loot.js";
import { createProgressSystem } from "./skills/progress.js";
import { createSkillSystem } from "./skills/skills.js";
import { createDamageTextSystem } from "./ui/damageText.js";
import { createHudSystem } from "./ui/hud.js";
import { createPanelSystem } from "./ui/panels.js";
import { createJoystickSystem } from "./ui/joystick.js";
import { createFxSystem } from "./ui/fx.js";
import { createPropsSystem } from "./world/props.js";
import { createDungeonSystem } from "./world/dungeon.js";
import { createWorldEventSystem } from "./world/worldEvents.js";
import { createQuestSystem } from "./npc/quests.js";
import { createAchievementSystem } from "./meta/achievements.js";
import { createPersistenceSystem } from "./meta/persistence.js";

const canvas = document.getElementById("c");
const three = createThree(canvas);

const ctx = {
  world: new World(),
  events: new EventBus(),
  input: new Input(),
  save: new SaveStore(),
  three,
};

const engine = new Engine(ctx);

// Girdi örnekleme her adımın başında, edge temizliği sonunda
engine.register({ name: "inputBegin", update: () => ctx.input.update() });

// ── Kamera ÖNCE (ctx.cam API'sini kurar; player/attack hedefleme kullanır) ──
engine.register(createCameraSystem());

// ── Oyun sistemleri ──
engine.register(createPlayerSystem());
engine.register(createPlayerAttackSystem());
engine.register(createEnemySystem());
engine.register(createProjectileSystem());
engine.register(createCombatSystem());
engine.register(createInventorySystem());
engine.register(createProgressSystem()); // inventory'den SONRA (recompute kullanır)
engine.register(createSkillSystem());
engine.register(createLootSystem());
engine.register(createPersistenceSystem()); // inventory+progress'ten SONRA (kayıt yükler)
engine.register(createZoneSystem());
engine.register(createPropsSystem());
engine.register(createDungeonSystem());
engine.register(createWorldEventSystem());
engine.register(createQuestSystem());

// ── UI katmanı ──
engine.register(createDamageTextSystem());
engine.register(createHudSystem());
engine.register(createAchievementSystem()); // HUD'dan sonra (menüye 🏆 butonu ekler)
engine.register(createPanelSystem());
engine.register(createJoystickSystem());
engine.register(createFxSystem());
engine.register({ name: "inputEnd", update: () => ctx.input.endFrame() });
engine.register({
  name: "render",
  render: () => three.renderer.render(three.scene, three.camera),
});

engine.start();
document.getElementById("loading")?.remove();

// Geliştirme/test tutamacı — otomatik testler oyun durumunu buradan okur.
window.__gd = ctx;

"use client";

import { useEffect, useRef, useState } from "react";
import { useProfile } from "@/lib/useLocalProfile";

/**
 * "Zindan Avcısı" — Oynava Originals.
 * Özgün (telifsiz) tepeden görünüşlü aksiyon-RPG. Diablo TÜRÜNDE, kopya değil.
 * WASD/oklar: hareket • Fare: nişan • Sol tık / boşluk: ateş.
 * Düşmanlar loot düşürür (jeton/can/güç), seviye atladıkça güçlenirsin, her 5. dalga boss.
 */

type V = { x: number; y: number };
type Enemy = V & { hp: number; max: number; r: number; spd: number; boss: boolean; hue: number };
type Bullet = V & { vx: number; vy: number; life: number; dmg: number };
type Loot = V & { kind: "coin" | "heal" | "power"; life: number };
type Particle = V & { vx: number; vy: number; life: number; hue: number };

export function DungeonGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { addCoins } = useProfile();
  const [state, setState] = useState<"intro" | "playing" | "over">("intro");
  const [hud, setHud] = useState({ score: 0, wave: 1, level: 1, hp: 100, dmg: 2 });
  const [reward, setReward] = useState(0);
  const startRef = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const W = (canvas.width = 900);
    const H = (canvas.height = 600);

    const keys: Record<string, boolean> = {};
    const mouse = { x: W / 2, y: H / 2, down: false };

    let p: V & { hp: number; speed: number; dmg: number; fireCd: number };
    let enemies: Enemy[], bullets: Bullet[], loot: Loot[], parts: Particle[];
    let score: number, wave: number, level: number, xp: number, xpNext: number, coins: number;
    let spawnLeft: number, alive: boolean, raf = 0, lastHud = 0, fireTimer = 0;

    function reset() {
      p = { x: W / 2, y: H / 2, hp: 100, speed: 3.3, dmg: 2, fireCd: 12 };
      enemies = []; bullets = []; loot = []; parts = [];
      score = 0; wave = 0; level = 1; xp = 0; xpNext = 6; coins = 0;
      spawnLeft = 0; alive = true;
      nextWave();
    }

    function nextWave() {
      wave++;
      const boss = wave % 5 === 0;
      spawnLeft = boss ? 1 : 4 + wave;
    }

    function burst(x: number, y: number, hue: number, n: number) {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * 7, s = 1 + Math.random() * 4;
        parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, hue });
      }
    }

    function spawnEnemy(boss: boolean) {
      const edge = Math.floor(Math.random() * 4);
      let x = 0, y = 0;
      if (edge === 0) { x = Math.random() * W; y = -30; }
      else if (edge === 1) { x = W + 30; y = Math.random() * H; }
      else if (edge === 2) { x = Math.random() * W; y = H + 30; }
      else { x = -30; y = Math.random() * H; }
      if (boss) enemies.push({ x, y, hp: 60 + wave * 12, max: 60 + wave * 12, r: 36, spd: 0.9, boss: true, hue: 280 });
      else {
        const hp = 3 + Math.floor(wave * 1.4);
        enemies.push({ x, y, hp, max: hp, r: 13, spd: 1.4 + Math.random() * 0.8, boss: false, hue: 350 });
      }
    }

    function dropLoot(x: number, y: number, boss: boolean) {
      const r = Math.random();
      const kind: Loot["kind"] = boss ? "power" : r < 0.12 ? "heal" : r < 0.2 ? "power" : "coin";
      loot.push({ x, y, kind, life: 600 });
    }

    function endGame() {
      alive = false; cancelAnimationFrame(raf);
      const earned = Math.floor(score / 18) + coins;
      setReward(earned);
      if (earned > 0) addCoins(earned);
      setState("over");
    }

    function loop(t: number) {
      raf = requestAnimationFrame(loop);
      if (!alive) return;

      // hareket
      let dx = 0, dy = 0;
      if (keys["w"] || keys["arrowup"]) dy--;
      if (keys["s"] || keys["arrowdown"]) dy++;
      if (keys["a"] || keys["arrowleft"]) dx--;
      if (keys["d"] || keys["arrowright"]) dx++;
      const l = Math.hypot(dx, dy) || 1;
      p.x = Math.max(16, Math.min(W - 16, p.x + (dx / l) * p.speed));
      p.y = Math.max(16, Math.min(H - 16, p.y + (dy / l) * p.speed));

      // ateş
      fireTimer--;
      if ((mouse.down || keys[" "]) && fireTimer <= 0) {
        const a = Math.atan2(mouse.y - p.y, mouse.x - p.x);
        bullets.push({ x: p.x, y: p.y, vx: Math.cos(a) * 9, vy: Math.sin(a) * 9, life: 70, dmg: p.dmg });
        fireTimer = p.fireCd;
      }

      // dalga üretimi
      if (spawnLeft > 0 && enemies.length < 14) {
        if (Math.random() < 0.04 + wave * 0.004) { spawnEnemy(wave % 5 === 0); spawnLeft--; }
      }
      if (spawnLeft <= 0 && enemies.length === 0) nextWave();

      bullets = bullets.filter((b) => {
        b.x += b.vx; b.y += b.vy; b.life--;
        return b.life > 0 && b.x > -10 && b.x < W + 10 && b.y > -10 && b.y < H + 10;
      });

      for (const e of enemies) {
        const a = Math.atan2(p.y - e.y, p.x - e.x);
        e.x += Math.cos(a) * e.spd; e.y += Math.sin(a) * e.spd;
        if (Math.hypot(e.x - p.x, e.y - p.y) < e.r + 14) {
          p.hp -= e.boss ? 0.9 : 0.5; burst(p.x, p.y, 0, 2);
        }
      }
      for (const b of bullets) for (const e of enemies) {
        if (e.hp > 0 && Math.hypot(b.x - e.x, b.y - e.y) < e.r) {
          e.hp -= b.dmg; b.life = 0; burst(b.x, b.y, e.hue, 4);
        }
      }
      enemies = enemies.filter((e) => {
        if (e.hp <= 0) {
          score += e.boss ? 120 : 12; xp += e.boss ? 6 : 1;
          burst(e.x, e.y, e.hue, e.boss ? 40 : 14);
          dropLoot(e.x, e.y, e.boss);
          return false;
        }
        return true;
      });

      // seviye
      if (xp >= xpNext) {
        level++; xp = 0; xpNext = Math.floor(xpNext * 1.5);
        p.dmg += 1; p.hp = Math.min(100, p.hp + 15);
        if (level % 3 === 0) p.fireCd = Math.max(4, p.fireCd - 1);
        burst(p.x, p.y, 180, 30);
      }

      // loot toplama
      loot = loot.filter((o) => {
        o.life--;
        if (Math.hypot(o.x - p.x, o.y - p.y) < 22) {
          if (o.kind === "coin") { coins++; score += 5; }
          else if (o.kind === "heal") p.hp = Math.min(100, p.hp + 25);
          else { p.dmg += 1; }
          burst(o.x, o.y, o.kind === "coin" ? 50 : o.kind === "heal" ? 140 : 30, 10);
          return false;
        }
        return o.life > 0;
      });

      parts = parts.filter((q) => { q.x += q.vx; q.y += q.vy; q.vx *= 0.94; q.vy *= 0.94; q.life -= 0.03; return q.life > 0; });

      if (p.hp <= 0) endGame();

      // çizim — zindan zemini
      ctx.fillStyle = "#0a0a12"; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(120,90,160,.08)"; ctx.lineWidth = 1;
      for (let gx = 0; gx < W; gx += 45) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke(); }
      for (let gy = 0; gy < H; gy += 45) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke(); }

      for (const q of parts) { ctx.globalAlpha = Math.max(0, q.life); ctx.fillStyle = `hsl(${q.hue} 100% 60%)`; ctx.fillRect(q.x - 1.5, q.y - 1.5, 3, 3); }
      ctx.globalAlpha = 1;

      // loot
      for (const o of loot) {
        const c = o.kind === "coin" ? "#ffd24a" : o.kind === "heal" ? "#5dff8f" : "#ff7bd5";
        ctx.shadowBlur = 12; ctx.shadowColor = c; ctx.fillStyle = c;
        ctx.beginPath(); ctx.arc(o.x, o.y, o.kind === "coin" ? 6 : 8, 0, 7); ctx.fill();
      }

      ctx.shadowBlur = 10; ctx.shadowColor = "#9ad8ff"; ctx.fillStyle = "#cfeeff";
      for (const b of bullets) { ctx.beginPath(); ctx.arc(b.x, b.y, 3, 0, 7); ctx.fill(); }

      for (const e of enemies) {
        ctx.shadowBlur = 16; ctx.shadowColor = `hsl(${e.hue} 90% 55%)`; ctx.fillStyle = `hsl(${e.hue} 85% 55%)`;
        ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, 7); ctx.fill();
        if (e.boss) { // boss can barı
          ctx.shadowBlur = 0; ctx.fillStyle = "#000"; ctx.fillRect(e.x - 40, e.y - e.r - 14, 80, 6);
          ctx.fillStyle = "#ff2d75"; ctx.fillRect(e.x - 40, e.y - e.r - 14, 80 * (e.hp / e.max), 6);
        }
      }

      ctx.shadowBlur = 20; ctx.shadowColor = "#b6ff3b"; ctx.fillStyle = "#b6ff3b";
      const ang = Math.atan2(mouse.y - p.y, mouse.x - p.x);
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(ang);
      ctx.beginPath(); ctx.moveTo(16, 0); ctx.lineTo(-11, -10); ctx.lineTo(-6, 0); ctx.lineTo(-11, 10); ctx.closePath(); ctx.fill();
      ctx.restore(); ctx.shadowBlur = 0;

      if (t - lastHud > 110) { lastHud = t; setHud({ score, wave, level, hp: Math.max(0, Math.round(p.hp)), dmg: p.dmg }); }
    }

    function start() { reset(); setState("playing"); cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); }
    startRef.current = start;

    const kd = (e: KeyboardEvent) => { keys[e.key.toLowerCase()] = true; if (e.key === " ") e.preventDefault(); };
    const ku = (e: KeyboardEvent) => { keys[e.key.toLowerCase()] = false; };
    const mm = (e: MouseEvent) => { const r = canvas.getBoundingClientRect(); mouse.x = ((e.clientX - r.left) / r.width) * W; mouse.y = ((e.clientY - r.top) / r.height) * H; };
    const md = () => (mouse.down = true), mu = () => (mouse.down = false);
    window.addEventListener("keydown", kd); window.addEventListener("keyup", ku);
    canvas.addEventListener("mousemove", mm); canvas.addEventListener("mousedown", md); window.addEventListener("mouseup", mu);
    ctx.fillStyle = "#0a0a12"; ctx.fillRect(0, 0, W, H);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku);
      canvas.removeEventListener("mousemove", mm); canvas.removeEventListener("mousedown", md); window.removeEventListener("mouseup", mu);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[900px]">
      <div className="card-base overflow-hidden">
        <canvas ref={canvasRef} className="block aspect-[3/2] w-full cursor-crosshair bg-base" />
      </div>

      {state === "playing" && (
        <div className="pointer-events-none absolute left-0 right-0 top-0 flex flex-wrap items-center justify-between gap-2 p-3 font-display text-sm">
          <div className="flex gap-2">
            <span className="rounded-lg bg-black/50 px-2.5 py-1 text-neon">SKOR {hud.score}</span>
            <span className="rounded-lg bg-black/50 px-2.5 py-1 text-neon-purple">DALGA {hud.wave}</span>
            <span className="rounded-lg bg-black/50 px-2.5 py-1 text-neon-lime">SVY {hud.level}</span>
            <span className="rounded-lg bg-black/50 px-2.5 py-1 text-slate-300">⚔ {hud.dmg}</span>
          </div>
          <div className="w-36 rounded-full bg-black/50 p-1">
            <div className="h-3 rounded-full bg-neon-pink transition-all" style={{ width: `${hud.hp}%` }} />
          </div>
        </div>
      )}

      {state !== "playing" && (
        <div className="absolute inset-0 grid place-items-center rounded-2xl bg-base/85 backdrop-blur">
          <div className="px-6 text-center">
            {state === "intro" ? (
              <>
                <h2 className="font-display text-3xl font-black text-white neon-text">ZİNDAN AVCISI</h2>
                <p className="mx-auto mt-3 max-w-md text-sm text-slate-400">
                  Zindanı temizle, düşen ganimetleri (🪙 jeton, 💚 can, ✨ güç) topla, seviye atla.
                  Her 5. dalgada bir <b className="text-neon-purple">BOSS</b> seni bekliyor.
                  <br />
                  <b className="text-neon-lime">WASD</b> hareket · <b className="text-neon">Fare</b> nişan · <b className="text-neon">Tık/Boşluk</b> ateş
                </p>
              </>
            ) : (
              <>
                <h2 className="font-display text-3xl font-black text-neon-pink">ÖLDÜN</h2>
                <p className="mt-2 text-slate-300">Skor: <b className="text-white">{hud.score}</b> · Dalga {hud.wave} · Svy {hud.level}</p>
                {reward > 0 && <p className="mt-1 text-neon">🪙 +{reward} jeton kazandın!</p>}
              </>
            )}
            <button onClick={() => startRef.current()} className="btn-primary mt-6">
              {state === "intro" ? "▶ Zindana Gir" : "↻ Tekrar Dene"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

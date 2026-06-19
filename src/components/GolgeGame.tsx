"use client";

import { useEffect, useRef, useState } from "react";
import { useProfile } from "@/lib/useLocalProfile";

/**
 * "Gölge Savaşçısı" — Oynava Originals.
 * Tepeden görünüşlü, özgün (telifsiz) neon aksiyon-survival oyunu.
 * WASD/oklar: hareket • Fare: nişan • Sol tık / boşluk basılı: ateş.
 * Saf Canvas2D + requestAnimationFrame, harici varlık yok → her tarayıcıda akıcı.
 */

type V = { x: number; y: number };
type Enemy = V & { vx: number; vy: number; hp: number; r: number; kind: number; hue: number };
type Bullet = V & { vx: number; vy: number; life: number };
type Particle = V & { vx: number; vy: number; life: number; hue: number };

export function GolgeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { addCoins } = useProfile();
  const [state, setState] = useState<"intro" | "playing" | "over">("intro");
  const [hud, setHud] = useState({ score: 0, wave: 1, level: 1, hp: 100 });
  const [reward, setReward] = useState(0);
  const startRef = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const W = (canvas.width = 960);
    const H = (canvas.height = 600);

    const keys: Record<string, boolean> = {};
    const mouse: V & { down: boolean } = { x: W / 2, y: H / 2, down: false };

    let player: V & { hp: number; speed: number };
    let enemies: Enemy[];
    let bullets: Bullet[];
    let parts: Particle[];
    let score: number, wave: number, level: number, xp: number, xpNext: number;
    let fireCd: number, spawnCd: number, spawnRate: number, alive: boolean, raf = 0;
    let lastHud = 0;

    function reset() {
      player = { x: W / 2, y: H / 2, hp: 100, speed: 3.4 };
      enemies = [];
      bullets = [];
      parts = [];
      score = 0; wave = 1; level = 1; xp = 0; xpNext = 6;
      fireCd = 0; spawnCd = 0; spawnRate = 70; alive = true;
    }

    function burst(x: number, y: number, hue: number, n: number) {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = 1 + Math.random() * 4;
        parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, hue });
      }
    }

    function spawnEnemy() {
      const edge = Math.floor(Math.random() * 4);
      let x = 0, y = 0;
      if (edge === 0) { x = Math.random() * W; y = -20; }
      else if (edge === 1) { x = W + 20; y = Math.random() * H; }
      else if (edge === 2) { x = Math.random() * W; y = H + 20; }
      else { x = -20; y = Math.random() * H; }
      const kind = Math.random() < Math.min(0.15 + wave * 0.03, 0.5) ? (Math.random() < 0.5 ? 1 : 2) : 0;
      const base = { 0: { hp: 3, r: 14, hue: 320 }, 1: { hp: 1, r: 9, hue: 50 }, 2: { hp: 8, r: 22, hue: 270 } }[kind]!;
      enemies.push({ x, y, vx: 0, vy: 0, hp: base.hp + Math.floor(wave / 2), r: base.r, kind, hue: base.hue });
    }

    function loop(t: number) {
      raf = requestAnimationFrame(loop);
      if (!alive) return;

      // ── hareket ──
      let dx = 0, dy = 0;
      if (keys["w"] || keys["arrowup"]) dy -= 1;
      if (keys["s"] || keys["arrowdown"]) dy += 1;
      if (keys["a"] || keys["arrowleft"]) dx -= 1;
      if (keys["d"] || keys["arrowright"]) dx += 1;
      const len = Math.hypot(dx, dy) || 1;
      player.x = Math.max(16, Math.min(W - 16, player.x + (dx / len) * player.speed));
      player.y = Math.max(16, Math.min(H - 16, player.y + (dy / len) * player.speed));

      // ── ateş ──
      fireCd--;
      const firing = mouse.down || keys[" "];
      if (firing && fireCd <= 0) {
        const a = Math.atan2(mouse.y - player.y, mouse.x - player.x);
        const sp = 9;
        bullets.push({ x: player.x, y: player.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 70 });
        fireCd = Math.max(5, 14 - level);
      }

      // ── düşman üret ──
      spawnCd--;
      if (spawnCd <= 0) { spawnEnemy(); spawnCd = Math.max(14, spawnRate - wave * 2); }

      // ── güncelle: mermiler ──
      bullets = bullets.filter((b) => {
        b.x += b.vx; b.y += b.vy; b.life--;
        return b.life > 0 && b.x > -10 && b.x < W + 10 && b.y > -10 && b.y < H + 10;
      });

      // ── güncelle: düşmanlar + çarpışma ──
      for (const e of enemies) {
        const a = Math.atan2(player.y - e.y, player.x - e.x);
        const sp = e.kind === 1 ? 2.6 : e.kind === 2 ? 1.0 : 1.7;
        e.x += Math.cos(a) * sp; e.y += Math.sin(a) * sp;
        // oyuncuya değme
        if (Math.hypot(e.x - player.x, e.y - player.y) < e.r + 14) {
          player.hp -= e.kind === 2 ? 1.2 : 0.6;
          burst(player.x, player.y, 0, 3);
        }
      }

      // mermi-düşman
      for (const b of bullets) {
        for (const e of enemies) {
          if (e.hp > 0 && Math.hypot(b.x - e.x, b.y - e.y) < e.r) {
            e.hp -= 2; b.life = 0; burst(b.x, b.y, e.hue, 5);
          }
        }
      }
      const before = enemies.length;
      enemies = enemies.filter((e) => {
        if (e.hp <= 0) {
          score += e.kind === 2 ? 30 : e.kind === 1 ? 15 : 10;
          xp++; burst(e.x, e.y, e.hue, 16);
          return false;
        }
        return true;
      });
      if (enemies.length < before && xp >= xpNext) {
        level++; xp = 0; xpNext = Math.floor(xpNext * 1.5); player.hp = Math.min(100, player.hp + 12);
        burst(player.x, player.y, 180, 30);
      }
      if (score > wave * 200) { wave++; spawnRate = Math.max(14, spawnRate - 3); }

      // partiküller
      parts = parts.filter((p) => { p.x += p.vx; p.y += p.vy; p.vx *= 0.94; p.vy *= 0.94; p.life -= 0.03; return p.life > 0; });

      if (player.hp <= 0) { alive = false; endGame(score); }

      // ── çizim ──
      ctx.fillStyle = "#070912";
      ctx.fillRect(0, 0, W, H);
      // grid
      ctx.strokeStyle = "rgba(0,229,255,.06)"; ctx.lineWidth = 1;
      for (let gx = 0; gx < W; gx += 40) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke(); }
      for (let gy = 0; gy < H; gy += 40) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke(); }

      // partiküller
      for (const p of parts) {
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = `hsl(${p.hue} 100% 60%)`;
        ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
      }
      ctx.globalAlpha = 1;

      // mermiler
      ctx.shadowBlur = 12; ctx.shadowColor = "#00e5ff"; ctx.fillStyle = "#aef6ff";
      for (const b of bullets) { ctx.beginPath(); ctx.arc(b.x, b.y, 3, 0, 7); ctx.fill(); }

      // düşmanlar
      for (const e of enemies) {
        ctx.shadowBlur = 16; ctx.shadowColor = `hsl(${e.hue} 100% 55%)`;
        ctx.fillStyle = `hsl(${e.hue} 90% 55%)`;
        ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, 7); ctx.fill();
      }

      // oyuncu
      ctx.shadowBlur = 22; ctx.shadowColor = "#b6ff3b";
      ctx.fillStyle = "#b6ff3b";
      const ang = Math.atan2(mouse.y - player.y, mouse.x - player.x);
      ctx.save(); ctx.translate(player.x, player.y); ctx.rotate(ang);
      ctx.beginPath(); ctx.moveTo(16, 0); ctx.lineTo(-11, -10); ctx.lineTo(-6, 0); ctx.lineTo(-11, 10); ctx.closePath(); ctx.fill();
      ctx.restore();
      ctx.shadowBlur = 0;

      // HUD'u throttle ile React'e yansıt
      if (t - lastHud > 120) {
        lastHud = t;
        setHud({ score, wave, level, hp: Math.max(0, Math.round(player.hp)) });
      }
    }

    function endGame(finalScore: number) {
      cancelAnimationFrame(raf);
      const coins = Math.floor(finalScore / 20);
      setReward(coins);
      if (coins > 0) addCoins(coins);
      setState("over");
    }

    function start() {
      reset();
      setState("playing");
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);
    }
    startRef.current = start;

    const kd = (e: KeyboardEvent) => { keys[e.key.toLowerCase()] = true; if (e.key === " ") e.preventDefault(); };
    const ku = (e: KeyboardEvent) => { keys[e.key.toLowerCase()] = false; };
    const mm = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * W;
      mouse.y = ((e.clientY - r.top) / r.height) * H;
    };
    const md = () => (mouse.down = true);
    const mu = () => (mouse.down = false);

    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    canvas.addEventListener("mousemove", mm);
    canvas.addEventListener("mousedown", md);
    window.addEventListener("mouseup", mu);

    // ilk kare (intro arka planı)
    ctx.fillStyle = "#070912"; ctx.fillRect(0, 0, W, H);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
      canvas.removeEventListener("mousemove", mm);
      canvas.removeEventListener("mousedown", md);
      window.removeEventListener("mouseup", mu);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[960px]">
      <div className="card-base overflow-hidden">
        <canvas
          ref={canvasRef}
          className="block aspect-[8/5] w-full cursor-crosshair bg-base"
        />
      </div>

      {/* HUD */}
      {state === "playing" && (
        <div className="pointer-events-none absolute left-0 right-0 top-0 flex items-center justify-between p-3 font-display text-sm">
          <div className="flex gap-3">
            <span className="rounded-lg bg-black/50 px-3 py-1 text-neon">SKOR {hud.score}</span>
            <span className="rounded-lg bg-black/50 px-3 py-1 text-neon-purple">DALGA {hud.wave}</span>
            <span className="rounded-lg bg-black/50 px-3 py-1 text-neon-lime">SVY {hud.level}</span>
          </div>
          <div className="w-40 rounded-full bg-black/50 p-1">
            <div className="h-3 rounded-full bg-neon-pink transition-all" style={{ width: `${hud.hp}%` }} />
          </div>
        </div>
      )}

      {/* Intro / Game over katmanı */}
      {state !== "playing" && (
        <div className="absolute inset-0 grid place-items-center rounded-2xl bg-base/85 backdrop-blur">
          <div className="text-center">
            {state === "intro" ? (
              <>
                <h2 className="font-display text-3xl font-black text-white neon-text">GÖLGE SAVAŞÇISI</h2>
                <p className="mx-auto mt-3 max-w-md text-sm text-slate-400">
                  Dalga dalga gelen düşmanları yok et, seviye atla, hayatta kal.
                  <br />
                  <b className="text-neon-lime">WASD/Oklar</b> hareket · <b className="text-neon">Fare</b> nişan ·{" "}
                  <b className="text-neon">Sol tık / Boşluk</b> ateş
                </p>
              </>
            ) : (
              <>
                <h2 className="font-display text-3xl font-black text-neon-pink">OYUN BİTTİ</h2>
                <p className="mt-2 text-slate-300">Skor: <b className="text-white">{hud.score}</b> · Dalga {hud.wave}</p>
                {reward > 0 && <p className="mt-1 text-neon">🪙 +{reward} jeton kazandın!</p>}
              </>
            )}
            <button onClick={() => startRef.current()} className="btn-primary mt-6">
              {state === "intro" ? "▶ Başla" : "↻ Tekrar Oyna"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

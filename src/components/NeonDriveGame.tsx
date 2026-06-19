"use client";

import { useEffect, useRef, useState } from "react";
import { useProfile } from "@/lib/useLocalProfile";

/**
 * "Neon Sürüş" — Oynava Originals.
 * Özgün (telifsiz) sonsuz şerit-kaçış yarış oyunu. Saf Canvas2D.
 * ← → / A D : şerit değiştir. Engellere çarpma, jeton topla, hızlandıkça skor artar.
 */

type Obstacle = { lane: number; y: number; coin: boolean };

export function NeonDriveGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { addCoins } = useProfile();
  const [state, setState] = useState<"intro" | "playing" | "over">("intro");
  const [hud, setHud] = useState({ score: 0, coins: 0, speed: 1 });
  const [reward, setReward] = useState(0);
  const startRef = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const W = (canvas.width = 480);
    const H = (canvas.height = 640);
    const LANES = 3;
    const laneX = (l: number) => (W / LANES) * l + W / LANES / 2;

    let lane: number, targetX: number, carX: number;
    let obstacles: Obstacle[];
    let score: number, coins: number, speed: number, spawnCd: number, dash: number;
    let alive: boolean, raf = 0, lastHud = 0;

    function reset() {
      lane = 1; targetX = laneX(1); carX = targetX;
      obstacles = []; score = 0; coins = 0; speed = 3.2; spawnCd = 0; dash = 0; alive = true;
    }

    function spawn() {
      const l = Math.floor(Math.random() * LANES);
      const coin = Math.random() < 0.35;
      obstacles.push({ lane: l, y: -40, coin });
      // bazen ikinci şeride engel (boşluk bırakarak)
      if (!coin && Math.random() < 0.4) {
        let l2 = Math.floor(Math.random() * LANES);
        if (l2 === l) l2 = (l2 + 1) % LANES;
        obstacles.push({ lane: l2, y: -40, coin: false });
      }
    }

    function endGame() {
      alive = false;
      cancelAnimationFrame(raf);
      const earned = Math.floor(score / 15) + coins * 3;
      setReward(earned);
      if (earned > 0) addCoins(earned);
      setState("over");
    }

    function loop(t: number) {
      raf = requestAnimationFrame(loop);
      if (!alive) return;

      score += speed * 0.1;
      speed += 0.0016;
      dash = (dash + speed) % 40;
      carX += (targetX - carX) * 0.25;

      spawnCd -= speed;
      if (spawnCd <= 0) { spawn(); spawnCd = 120 + Math.random() * 60; }

      const carY = H - 90;
      const carW = W / LANES - 30;
      obstacles = obstacles.filter((o) => {
        o.y += speed;
        const ox = laneX(o.lane);
        // çarpışma
        if (o.y > carY - 40 && o.y < carY + 40 && Math.abs(ox - carX) < carW) {
          if (o.coin) { coins++; return false; }
          else { endGame(); return true; }
        }
        return o.y < H + 50;
      });

      // ── çizim ──
      ctx.fillStyle = "#070912";
      ctx.fillRect(0, 0, W, H);
      // şerit çizgileri (akan)
      ctx.strokeStyle = "rgba(0,229,255,.25)"; ctx.lineWidth = 3;
      for (let l = 1; l < LANES; l++) {
        const x = (W / LANES) * l;
        ctx.setLineDash([22, 18]); ctx.lineDashOffset = -dash;
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      ctx.setLineDash([]);

      // engeller / jetonlar
      for (const o of obstacles) {
        const ox = laneX(o.lane);
        if (o.coin) {
          ctx.shadowBlur = 16; ctx.shadowColor = "#b6ff3b"; ctx.fillStyle = "#b6ff3b";
          ctx.beginPath(); ctx.arc(ox, o.y, 12, 0, 7); ctx.fill();
        } else {
          ctx.shadowBlur = 16; ctx.shadowColor = "#ff2d75"; ctx.fillStyle = "#ff2d75";
          ctx.fillRect(ox - carW / 2, o.y - 22, carW, 44);
        }
      }

      // araba
      ctx.shadowBlur = 22; ctx.shadowColor = "#00e5ff"; ctx.fillStyle = "#00e5ff";
      ctx.fillRect(carX - carW / 2, carY - 26, carW, 52);
      ctx.shadowBlur = 0; ctx.fillStyle = "#aef6ff";
      ctx.fillRect(carX - carW / 2 + 6, carY - 14, carW - 12, 12);

      if (t - lastHud > 100) {
        lastHud = t;
        setHud({ score: Math.floor(score), coins, speed: +(speed / 3.2).toFixed(1) });
      }
    }

    function move(dir: number) {
      lane = Math.max(0, Math.min(LANES - 1, lane + dir));
      targetX = laneX(lane);
    }

    function start() {
      reset(); setState("playing");
      cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
    }
    startRef.current = start;

    const kd = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "arrowleft" || k === "a") { move(-1); e.preventDefault(); }
      if (k === "arrowright" || k === "d") { move(1); e.preventDefault(); }
    };
    // dokunmatik: sol/sağ yarıya dokun
    const tap = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      move((e.clientX - r.left) / r.width < 0.5 ? -1 : 1);
    };
    window.addEventListener("keydown", kd);
    canvas.addEventListener("mousedown", tap);

    ctx.fillStyle = "#070912"; ctx.fillRect(0, 0, W, H);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", kd);
      canvas.removeEventListener("mousedown", tap);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[480px]">
      <div className="card-base overflow-hidden">
        <canvas ref={canvasRef} className="block aspect-[3/4] w-full bg-base" />
      </div>

      {state === "playing" && (
        <div className="pointer-events-none absolute left-0 right-0 top-0 flex items-center justify-between p-3 font-display text-sm">
          <span className="rounded-lg bg-black/50 px-3 py-1 text-neon">SKOR {hud.score}</span>
          <span className="rounded-lg bg-black/50 px-3 py-1 text-neon-lime">🪙 {hud.coins}</span>
          <span className="rounded-lg bg-black/50 px-3 py-1 text-neon-pink">×{hud.speed}</span>
        </div>
      )}

      {state !== "playing" && (
        <div className="absolute inset-0 grid place-items-center rounded-2xl bg-base/85 backdrop-blur">
          <div className="px-6 text-center">
            {state === "intro" ? (
              <>
                <h2 className="font-display text-2xl font-black text-white neon-text">NEON SÜRÜŞ</h2>
                <p className="mx-auto mt-3 max-w-xs text-sm text-slate-400">
                  Engellerden kaç, jetonları topla, hızlandıkça skoru yükselt.
                  <br />
                  <b className="text-neon">← →</b> veya <b className="text-neon">A / D</b> ile şerit değiştir
                  <br />
                  (mobilde sol/sağ yarıya dokun)
                </p>
              </>
            ) : (
              <>
                <h2 className="font-display text-2xl font-black text-neon-pink">ÇARPTIN!</h2>
                <p className="mt-2 text-slate-300">Skor: <b className="text-white">{hud.score}</b> · 🪙 {hud.coins}</p>
                {reward > 0 && <p className="mt-1 text-neon">🪙 +{reward} jeton kazandın!</p>}
              </>
            )}
            <button onClick={() => startRef.current()} className="btn-primary mt-6">
              {state === "intro" ? "▶ Başla" : "↻ Tekrar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

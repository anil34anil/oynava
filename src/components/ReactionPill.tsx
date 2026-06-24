"use client";

import { useEffect, useState } from "react";

type Reactions = { count: number; dislikes: number; liked: boolean; disliked: boolean };

/** Sayıyı kısaltır: 1500 → 1,5B · 1.200.000 → 1,2M (YouTube/CrazyGames tarzı). */
function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(".0", "").replace(".", ",") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(".0", "").replace(".", ",") + "B";
  return String(n);
}

function ThumbIcon({ dir, filled, size = 16 }: { dir: "up" | "down"; filled: boolean; size?: number }) {
  // Material tarzı başparmak; aktifken dolu, değilken çizgi.
  const path =
    "M2 20h2V9H2v11zm19.83-7.12c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.65c.05-.22.02-.46-.08-.66a4.8 4.8 0 0 0-.66-.93L14 2 7.59 8.41C7.21 8.79 7 9.3 7 9.83v7.84A2.34 2.34 0 0 0 9.34 20h8.11c.7 0 1.36-.37 1.7-.97l2.68-6.15z";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.8}
      style={dir === "down" ? { transform: "rotate(180deg)" } : undefined}
      aria-hidden
    >
      <path d={path} strokeLinejoin="round" />
    </svg>
  );
}

/**
 * YouTube tarzı birleşik beğeni/beğenmeme pill'i: 👍 sayı | 👎 sayı.
 * Sayılar her zaman görünür; tüm ziyaretçiler arasında ortaktır (Redis).
 * size="sm" → kart altı kompakt; "md" → oyun videosu çubuğu.
 */
export function ReactionPill({ id, size = "md" }: { id: string; size?: "sm" | "md" }) {
  const [r, setR] = useState<Reactions>({ count: 0, dislikes: 0, liked: false, disliked: false });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch(`/api/likes/${id}`)
      .then((res) => res.json())
      .then((d) => alive && setR(d))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [id]);

  async function react(e: React.MouseEvent, type: "like" | "dislike") {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    setR((p) => {
      const n = { ...p };
      if (type === "like") {
        if (p.liked) n.count--;
        else {
          n.count++;
          if (p.disliked) n.dislikes--;
        }
        n.liked = !p.liked;
        if (n.liked) n.disliked = false;
      } else {
        if (p.disliked) n.dislikes--;
        else {
          n.dislikes++;
          if (p.liked) n.count--;
        }
        n.disliked = !p.disliked;
        if (n.disliked) n.liked = false;
      }
      return n;
    });
    try {
      const res = await fetch(`/api/likes/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      setR(await res.json());
    } catch {
      /* optimistik kalır */
    } finally {
      setBusy(false);
    }
  }

  const sm = size === "sm";
  const pad = sm ? "px-2 py-1" : "px-3.5 py-1.5";
  const icon = sm ? 14 : 18;
  const text = sm ? "text-xs" : "text-sm";

  return (
    <div className={`inline-flex shrink-0 items-center rounded-full bg-white/[0.08] ${text} font-semibold`}>
      <button
        onClick={(e) => react(e, "like")}
        disabled={busy}
        aria-label="Beğen"
        className={`flex items-center gap-1.5 rounded-l-full ${pad} transition hover:bg-white/[0.12] ${
          r.liked ? "text-neon" : "text-slate-300"
        }`}
      >
        <ThumbIcon dir="up" filled={r.liked} size={icon} />
        <span>{fmt(r.count)}</span>
      </button>

      <span className="h-4 w-px bg-white/15" />

      <button
        onClick={(e) => react(e, "dislike")}
        disabled={busy}
        aria-label="Beğenme"
        className={`flex items-center gap-1.5 rounded-r-full ${pad} transition hover:bg-white/[0.12] ${
          r.disliked ? "text-neon-pink" : "text-slate-300"
        }`}
      >
        <ThumbIcon dir="down" filled={r.disliked} size={icon} />
        <span>{fmt(r.dislikes)}</span>
      </button>
    </div>
  );
}

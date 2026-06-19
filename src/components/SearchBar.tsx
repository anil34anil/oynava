"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar() {
  const router = useRouter();
  const [q, setQ] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (q.trim()) router.push(`/ara?q=${encodeURIComponent(q.trim())}`);
      }}
      className="relative w-full"
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Oyun ara… (örn. yarış, futbol, zombi)"
        className="w-full rounded-xl border border-line bg-card/80 py-2.5 pl-11 pr-4 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-neon focus:shadow-glow"
      />
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
        🔍
      </span>
    </form>
  );
}

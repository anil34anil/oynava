"use client";

import { useFavorites } from "@/lib/useLocalProfile";

export function FavoriteButton({ id }: { id: string }) {
  const { has, toggle } = useFavorites();
  const active = has(id);

  return (
    <button
      aria-label={active ? "Favorilerden çıkar" : "Favorilere ekle"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(id);
      }}
      className={`absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full border backdrop-blur transition
        ${active
          ? "border-neon-pink bg-neon-pink/20 text-neon-pink"
          : "border-[#fff]/20 bg-black/40 text-[#fff]/70 hover:text-neon-pink"}`}
    >
      {active ? "♥" : "♡"}
    </button>
  );
}

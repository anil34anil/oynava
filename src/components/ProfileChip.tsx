"use client";

import Link from "next/link";
import { useProfile } from "@/lib/useLocalProfile";
import { useAuth } from "@/lib/auth";

export function ProfileChip() {
  const { profile, coins } = useProfile();
  const { user, ready } = useAuth();

  if (ready && !user) {
    return (
      <Link href="/giris" className="btn-primary py-2 text-xs">
        Giriş / Kayıt
      </Link>
    );
  }

  const name = user?.username ?? profile.username;
  const avatar = user?.avatar ?? profile.avatar;

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/magaza"
        className="hidden items-center gap-1 rounded-lg border border-line bg-card px-2.5 py-1.5 text-sm text-neon hover:border-neon sm:flex"
      >
        🪙 {coins}
      </Link>
      <Link
        href="/profil"
        className="flex items-center gap-2 rounded-lg border border-line bg-card px-2 py-1.5 hover:border-neon"
      >
        <span className="text-lg">{avatar}</span>
        <span className="hidden max-w-[100px] truncate text-sm text-slate-300 lg:inline">{name}</span>
      </Link>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { user, login, register, logout } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    const res = mode === "login" ? await login(email, pw) : await register(email, pw);
    setBusy(false);
    if (res.ok) router.push("/profil");
    else setErr(res.error ?? "Bir hata oluştu.");
  }

  if (user) {
    return (
      <div className="container-x grid max-w-md gap-4 py-16 text-center">
        <div className="text-5xl">{user.avatar}</div>
        <h1 className="font-display text-2xl font-black text-white">Giriş yapıldı</h1>
        <p className="text-slate-400">{user.email}</p>
        <div className="flex justify-center gap-3">
          <button onClick={() => router.push("/profil")} className="btn-primary">Profilim</button>
          <button onClick={logout} className="btn-ghost">Çıkış Yap</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x grid max-w-md gap-6 py-12">
      <div className="flex rounded-xl border border-line bg-card p-1 font-display text-sm">
        <button
          onClick={() => setMode("login")}
          className={`flex-1 rounded-lg py-2 ${mode === "login" ? "bg-neon text-base" : "text-slate-400"}`}
        >
          Giriş Yap
        </button>
        <button
          onClick={() => setMode("register")}
          className={`flex-1 rounded-lg py-2 ${mode === "register" ? "bg-neon text-base" : "text-slate-400"}`}
        >
          Kayıt Ol
        </button>
      </div>

      <form onSubmit={submit} className="card-base space-y-4 p-6">
        <h1 className="font-display text-xl font-bold text-white">
          {mode === "login" ? "Hesabına giriş yap" : "Yeni hesap oluştur"}
        </h1>

        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-slate-500">E-posta</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@eposta.com"
            autoComplete="email"
            required
            className="w-full rounded-xl border border-line bg-base/60 px-4 py-2.5 text-white outline-none focus:border-neon"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-slate-500">Şifre</label>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="En az 6 karakter"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            required
            className="w-full rounded-xl border border-line bg-base/60 px-4 py-2.5 text-white outline-none focus:border-neon"
          />
        </div>

        {err && <p className="text-sm text-neon-pink">⚠ {err}</p>}

        <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
          {busy ? "..." : mode === "login" ? "Giriş Yap" : "Kayıt Ol ve Başla"}
        </button>
      </form>

      <p className="text-center text-xs text-slate-600">
        Hesabın şu an bu cihazda güvenli (hash'li) saklanır. Cihazlar arası senkron ve
        sunucu güvenliği için ileride NextAuth + veritabanı eklenecek.
      </p>
    </div>
  );
}

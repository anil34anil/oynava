"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Giriş başarısız");
      return;
    }
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card-base mx-auto mt-20 max-w-sm space-y-3 p-6">
      <h1 className="font-display text-lg font-bold text-ink">Admin Girişi</h1>
      <input
        type="password"
        autoFocus
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Şifre"
        className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-neon"
      />
      {error && <p className="text-sm text-neon-pink">{error}</p>}
      <button type="submit" disabled={busy} className="btn-primary w-full justify-center">
        {busy ? "Kontrol ediliyor…" : "Giriş yap"}
      </button>
    </form>
  );
}

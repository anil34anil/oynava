"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SITE } from "@/lib/site";
import { useAuth, accountExists } from "@/lib/auth";
import { GoogleLoginButton } from "./GoogleLoginButton";
import { LOGIN_MODAL_EVENT } from "@/lib/useLoginModal";

type Step = "choose" | "password";

/**
 * CrazyGames tarzı sağdan açılan giriş paneli. Birden çok seçenek sunar:
 * Google (çalışır), Facebook/Apple (kimlik ayarlanınca aktifleşir), e-posta + şifre.
 * E-posta akışı iki adımlıdır: e-posta → "Devam et" → hesap varsa giriş, yoksa kayıt.
 */
export function LoginModal() {
  const router = useRouter();
  const { login, register } = useAuth();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("choose");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [isExisting, setIsExisting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onOpen = () => {
      reset();
      setOpen(true);
    };
    window.addEventListener(LOGIN_MODAL_EVENT, onOpen);
    return () => window.removeEventListener(LOGIN_MODAL_EVENT, onOpen);
  }, []);

  // Esc ile kapat + açıkken arka plan kaymasın
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  function reset() {
    setStep("choose");
    setEmail("");
    setPw("");
    setErr(null);
    setBusy(false);
  }

  function close() {
    setOpen(false);
  }

  function done() {
    close();
    router.refresh();
  }

  function continueEmail(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const mail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      setErr("Geçerli bir e-posta gir.");
      return;
    }
    setIsExisting(accountExists(mail));
    setStep("password");
  }

  async function submitPassword(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    const res = isExisting ? await login(email, pw) : await register(email, pw);
    setBusy(false);
    if (res.ok) done();
    else setErr(res.error ?? "Bir hata oluştu.");
  }

  const fbReady = Boolean(SITE.facebookAppId);
  const appleReady = Boolean(SITE.appleClientId);

  return (
    <>
      {/* Karartma */}
      <div
        onClick={close}
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      {/* Sağdan kayan panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Giriş yap veya kaydol"
        className={`fixed right-0 top-0 z-[61] flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-line bg-surface px-6 py-5 shadow-2xl transition-transform duration-300 sm:px-8 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="font-display text-sm font-semibold uppercase tracking-wider text-slate-500">
            {SITE.name}
          </span>
          <button
            onClick={close}
            aria-label="Kapat"
            className="grid h-9 w-9 place-items-center rounded-full text-slate-400 hover:bg-black/[0.05] hover:text-ink"
          >
            ✕
          </button>
        </div>

        <div className="mx-auto mt-8 w-full max-w-sm">
          <h2 className="text-center font-display text-2xl font-black text-ink">
            {step === "password"
              ? isExisting
                ? "Tekrar hoş geldin"
                : "Hesabını oluştur"
              : "Giriş yap veya kaydol"}
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            {step === "password"
              ? email
              : "Oyunlarını, favorilerini ve jetonlarını kaydet."}
          </p>

          {step === "choose" ? (
            <div className="mt-8 space-y-3">
              {SITE.googleClientId && (
                <div className="flex justify-center">
                  <GoogleLoginButton showDivider={false} onSuccess={done} />
                </div>
              )}

              <SocialButton
                icon="f"
                label="Facebook ile devam et"
                className="bg-[#1877f2] text-[#fff] hover:bg-[#1668d8]"
                ready={fbReady}
                onClick={() => setErr("Facebook ile giriş yakında — kurulum için Facebook uygulaması (App ID) gerekiyor.")}
              />
              <SocialButton
                icon=""
                label="Apple ile devam et"
                className="bg-white text-black hover:bg-slate-200"
                ready={appleReady}
                onClick={() => setErr("Apple ile giriş yakında — Apple Developer hesabı (Service ID) gerekiyor.")}
              />

              <div className="flex items-center gap-3 py-2 text-xs uppercase tracking-wider text-slate-600">
                <span className="h-px flex-1 bg-line" /> veya <span className="h-px flex-1 bg-line" />
              </div>

              <form onSubmit={continueEmail} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-postanı gir"
                  autoComplete="email"
                  autoFocus
                  className="w-full rounded-xl border border-line bg-base/60 px-4 py-3 text-ink outline-none focus:border-neon"
                />
                {err && <p className="text-sm text-neon-pink">⚠ {err}</p>}
                <button type="submit" className="btn-primary w-full justify-center py-3">
                  Devam et
                </button>
              </form>
            </div>
          ) : (
            <form onSubmit={submitPassword} className="mt-8 space-y-3">
              <input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder={isExisting ? "Şifren" : "Bir şifre belirle (en az 6 karakter)"}
                autoComplete={isExisting ? "current-password" : "new-password"}
                autoFocus
                className="w-full rounded-xl border border-line bg-base/60 px-4 py-3 text-ink outline-none focus:border-neon"
              />
              {err && <p className="text-sm text-neon-pink">⚠ {err}</p>}
              <button type="submit" disabled={busy} className="btn-primary w-full justify-center py-3 disabled:opacity-60">
                {busy ? "..." : isExisting ? "Giriş yap" : "Kayıt ol ve başla"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("choose");
                  setPw("");
                  setErr(null);
                }}
                className="w-full text-center text-sm text-slate-500 hover:text-slate-300"
              >
                ← E-postayı değiştir
              </button>
            </form>
          )}

          <p className="mt-8 text-center text-xs leading-relaxed text-slate-600">
            Devam ederek{" "}
            <a href="/yas-degerlendirmesi" className="underline hover:text-slate-400">
              kullanım koşullarını
            </a>{" "}
            kabul etmiş olursun. Hesabın şu an bu cihazda güvenli (hash&apos;li) saklanır.
          </p>
        </div>
      </aside>
    </>
  );
}

function SocialButton({
  icon,
  label,
  className,
  ready,
  onClick,
}: {
  icon: string;
  label: string;
  className: string;
  ready: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition ${className} ${
        ready ? "" : "opacity-90"
      }`}
    >
      <span className="font-bold">{icon}</span>
      {label}
      {!ready && (
        <span className="absolute right-3 rounded-full bg-black/20 px-1.5 py-0.5 text-[10px] font-medium">
          yakında
        </span>
      )}
    </button>
  );
}

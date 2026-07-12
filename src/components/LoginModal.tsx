"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SITE } from "@/lib/site";
import { useAuth, accountExists, usernameChecks, generateUsername } from "@/lib/auth";
import { GoogleLoginButton } from "./GoogleLoginButton";
import { LOGIN_MODAL_EVENT } from "@/lib/useLoginModal";
import { useAutoTr } from "@/lib/useLocaleClient";

type Step = "choose" | "password" | "username";

/**
 * CrazyGames tarzı sağdan açılan giriş paneli. Birden çok seçenek sunar:
 * Google (çalışır), Facebook/Apple (kimlik ayarlanınca aktifleşir), e-posta + şifre.
 * E-posta akışı iki adımlıdır: e-posta → "Devam et" → hesap varsa giriş, yoksa kayıt.
 */
export function LoginModal() {
  const router = useRouter();
  const { login, register, updateAccount } = useAuth();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("choose");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [username, setUsername] = useState("");
  const [isExisting, setIsExisting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const T = useAutoTr([
    /* 0 */ "Giriş yap veya kaydol",
    /* 1 */ "Hesabını oluştur",
    /* 2 */ "Tekrar hoş geldin",
    /* 3 */ "Kullanıcı adınızı ayarlayın",
    /* 4 */ "Oyunlarını, favorilerini ve jetonlarını kaydet.",
    /* 5 */ "Toplulukta seni bu isimle görecekler.",
    /* 6 */ "Facebook ile devam et",
    /* 7 */ "Apple ile devam et",
    /* 8 */ "veya",
    /* 9 */ "E-postanı gir",
    /* 10 */ "Devam et",
    /* 11 */ "Şifren",
    /* 12 */ "Bir şifre belirle (en az 6 karakter)",
    /* 13 */ "Giriş yap",
    /* 14 */ "Kayıt ol ve başla",
    /* 15 */ "← E-postayı değiştir",
    /* 16 */ "6 ila 20 karakter",
    /* 17 */ "Sadece harfler, sayılar, '.' ve '_'",
    /* 18 */ "Herhangi bir bildirimde bulunmadan toksik ve uygunsuz kullanıcı adlarına sahip hesapları kalıcı olarak yasaklarız. Topluluğu herkes için güvenli tutalım!",
    /* 19 */ "Devam ederek kullanım koşullarını kabul etmiş olursun. Hesabın şu an bu cihazda güvenli (hash'li) saklanır.",
    /* 20 */ "yakında",
    /* 21 */ "Geçerli bir e-posta gir.",
    /* 22 */ "Kullanıcı adı kurallara uymuyor.",
    /* 23 */ "Bir hata oluştu.",
    /* 24 */ "kullanım koşullarını",
  ]);

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
    setUsername("");
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
      setErr(T[21]);
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
    if (!res.ok) {
      setErr(res.error ?? T[23]);
      return;
    }
    // Yeni kayıt → CrazyGames gibi kullanıcı adı belirleme adımı; giriş → bitti
    if (isExisting) {
      done();
    } else {
      setUsername(generateUsername());
      setStep("username");
    }
  }

  function submitUsername(e: React.FormEvent) {
    e.preventDefault();
    const name = username.trim();
    if (!usernameChecks(name).valid) {
      setErr(T[22]);
      return;
    }
    updateAccount({ username: name });
    done();
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
            className="grid h-9 w-9 place-items-center rounded-full text-slate-400 hover:bg-white/[0.07] hover:text-ink"
          >
            ✕
          </button>
        </div>

        <div className="mx-auto mt-8 w-full max-w-sm">
          <h2 className="text-center font-display text-2xl font-black text-ink">
            {step === "username" ? T[3] : step === "password" ? (isExisting ? T[2] : T[1]) : T[0]}
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            {step === "username" ? T[5] : step === "password" ? email : T[4]}
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
                label={T[6]}
                soonLabel={T[20]}
                className="bg-[#1877f2] text-[#fff] hover:bg-[#1668d8]"
                ready={fbReady}
                onClick={() => setErr(`Facebook — ${T[20]}`)}
              />
              <SocialButton
                icon=""
                label={T[7]}
                soonLabel={T[20]}
                className="bg-[#fff] text-black hover:bg-[#e2e2e2]"
                ready={appleReady}
                onClick={() => setErr(`Apple — ${T[20]}`)}
              />

              <div className="flex items-center gap-3 py-2 text-xs uppercase tracking-wider text-slate-600">
                <span className="h-px flex-1 bg-line" /> {T[8]} <span className="h-px flex-1 bg-line" />
              </div>

              <form onSubmit={continueEmail} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={T[9]}
                  autoComplete="email"
                  autoFocus
                  className="w-full rounded-xl border border-line bg-base/60 px-4 py-3 text-ink outline-none focus:border-neon"
                />
                {err && <p className="text-sm text-neon-pink">⚠ {err}</p>}
                <button type="submit" className="btn-primary w-full justify-center py-3">
                  {T[10]}
                </button>
              </form>
            </div>
          ) : step === "password" ? (
            <form onSubmit={submitPassword} className="mt-8 space-y-3">
              <input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder={isExisting ? T[11] : T[12]}
                autoComplete={isExisting ? "current-password" : "new-password"}
                autoFocus
                className="w-full rounded-xl border border-line bg-base/60 px-4 py-3 text-ink outline-none focus:border-neon"
              />
              {err && <p className="text-sm text-neon-pink">⚠ {err}</p>}
              <button type="submit" disabled={busy} className="btn-primary w-full justify-center py-3 disabled:opacity-60">
                {busy ? "..." : isExisting ? T[13] : T[14]}
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
                {T[15]}
              </button>
            </form>
          ) : (
            <form onSubmit={submitUsername} className="mt-8 space-y-3">
              <div className="relative">
                <input
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setErr(null);
                  }}
                  maxLength={20}
                  autoFocus
                  aria-label="Kullanıcı adı"
                  className="w-full rounded-xl border border-line bg-base/60 px-4 py-3 pr-12 text-ink outline-none focus:border-neon"
                />
                <button
                  type="button"
                  onClick={() => {
                    setUsername(generateUsername());
                    setErr(null);
                  }}
                  aria-label="Rastgele kullanıcı adı"
                  title="Rastgele üret"
                  className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-slate-500 hover:bg-white/[0.07] hover:text-neon"
                >
                  🔀
                </button>
              </div>

              {(() => {
                const c = usernameChecks(username.trim());
                const Row = ({ ok, label }: { ok: boolean; label: string }) => (
                  <div
                    className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm ${
                      ok ? "bg-neon/10 text-neon" : "bg-white/[0.06] text-slate-500"
                    }`}
                  >
                    <span>{ok ? "✓" : "○"}</span> {label}
                  </div>
                );
                return (
                  <div className="space-y-1.5">
                    <Row ok={c.lengthOk} label={T[16]} />
                    <Row ok={c.charsOk} label={T[17]} />
                  </div>
                );
              })()}

              {err && <p className="text-sm text-neon-pink">⚠ {err}</p>}

              <button
                type="submit"
                disabled={!usernameChecks(username.trim()).valid}
                className="btn-primary w-full justify-center py-3 disabled:opacity-50"
              >
                {T[10]}
              </button>

              <p className="text-center text-xs leading-relaxed text-slate-500">{T[18]}</p>
            </form>
          )}

          {step !== "username" && (
            <p className="mt-8 text-center text-xs leading-relaxed text-slate-600">{T[19]}</p>
          )}
        </div>
      </aside>
    </>
  );
}

function SocialButton({
  icon,
  label,
  soonLabel,
  className,
  ready,
  onClick,
}: {
  icon: string;
  label: string;
  soonLabel: string;
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
          {soonLabel}
        </span>
      )}
    </button>
  );
}

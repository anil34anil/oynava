"use client";

import { useState } from "react";

/**
 * Hesap/veri silme — kullanıcının cihazındaki TÜM OYNAVA verisini (profil, favoriler,
 * jeton, başarım, oturum, çerezler) tek tıkla kalıcı siler. Sunucuda kalıcı hesap yoktur.
 */
export function AccountDeletion() {
  const [done, setDone] = useState(false);

  const clearAll = () => {
    if (!window.confirm("Bu cihazdaki tüm OYNAVA verilerin (profil, favoriler, jeton, başarımlar, oturum) kalıcı olarak silinecek. Devam edilsin mi?")) {
      return;
    }
    try {
      localStorage.clear();
      sessionStorage.clear();
      // Bu origin'deki çerezleri (oh_uid, çerez onayı vb.) sıfırla
      document.cookie.split(";").forEach((c) => {
        const name = c.split("=")[0].trim();
        if (name) document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      });
      window.dispatchEvent(new Event("oh:storage"));
    } catch {
      /* yoksay */
    }
    setDone(true);
  };

  if (done) {
    return (
      <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/[0.06] p-5 text-emerald-300">
        ✅ Tüm verilerin bu cihazdan silindi. Dilersen sayfayı kapatabilir veya{" "}
        <a href="/" className="underline">ana sayfaya</a> dönebilirsin.
      </div>
    );
  }

  return (
    <button onClick={clearAll} className="rounded-xl bg-neon-pink/90 px-6 py-3 font-semibold text-[#fff] transition hover:bg-neon-pink">
      🗑️ Tüm verilerimi sil
    </button>
  );
}

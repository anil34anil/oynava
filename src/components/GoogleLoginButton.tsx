"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { SITE } from "@/lib/site";
import { useAuth } from "@/lib/auth";

declare global {
  interface Window {
    google?: any;
  }
}

/** JWT payload'ını çözer (imza doğrulaması yok; cihaz-yerel profil için yeterli). */
function decodeJwt(token: string): any {
  try {
    const base = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(decodeURIComponent(escape(atob(base))));
  } catch {
    return null;
  }
}

export function GoogleLoginButton({
  showDivider = true,
  onSuccess,
}: {
  showDivider?: boolean;
  onSuccess?: () => void;
} = {}) {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();
  const ref = useRef<HTMLDivElement>(null);
  const clientId = SITE.googleClientId;

  useEffect(() => {
    if (!clientId) return;
    const SRC = "https://accounts.google.com/gsi/client";

    function init() {
      if (!window.google || !ref.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (resp: { credential: string }) => {
          const p = decodeJwt(resp.credential);
          if (p?.email) {
            loginWithGoogle({ email: p.email, name: p.name, picture: p.picture });
            if (onSuccess) onSuccess();
            else router.push("/profil");
          }
        },
      });
      window.google.accounts.id.renderButton(ref.current, {
        theme: "filled_black",
        size: "large",
        shape: "pill",
        text: "continue_with",
        locale: "tr",
        width: 280,
      });
    }

    if (window.google) {
      init();
    } else {
      let s = document.querySelector<HTMLScriptElement>(`script[src="${SRC}"]`);
      if (!s) {
        s = document.createElement("script");
        s.src = SRC;
        s.async = true;
        document.head.appendChild(s);
      }
      s.addEventListener("load", init);
      return () => s?.removeEventListener("load", init);
    }
  }, [clientId, loginWithGoogle, router, onSuccess]);

  if (!clientId) return null;

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div ref={ref} />
      {showDivider && (
        <div className="flex w-full items-center gap-3 text-xs text-slate-600">
          <span className="h-px flex-1 bg-line" /> veya <span className="h-px flex-1 bg-line" />
        </div>
      )}
    </div>
  );
}

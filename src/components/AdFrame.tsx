"use client";

import { usePathname } from "next/navigation";
import { AdSlot } from "./AdSlot";

/**
 * İçeriği ÜST + ALT yatay banner'larla sarar.
 *
 * ⚠️ AdSense politikası: reklamlar içeriği az olan sayfalarda (admin paneli, giriş)
 * GÖSTERİLMEZ — aksi hâlde "value/placement" ihlali olur. Bu sayfalarda banner gizlenir.
 * Ayrıca içerikten çok reklam olan sayfalar onaylanmaz; slot sayısı ölçülü tutulur.
 */
const NO_AD_RE = /(^|\/)(admin|giris)(\/|$)/;

export function AdFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  if (NO_AD_RE.test(pathname)) return <>{children}</>;

  return (
    <>
      {/* ÜST banner */}
      <div className="container-x">
        <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_TOP} className="mt-3 min-h-[90px]" />
      </div>

      {children}

      {/* ALT banner */}
      <div className="container-x">
        <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_BOTTOM} className="mb-4 min-h-[90px]" />
      </div>
    </>
  );
}

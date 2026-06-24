import { AdSlot } from "./AdSlot";

/**
 * İçeriği ÜST + ALT yatay banner'larla sarar.
 *
 * NOT: Eski "fixed" sol/sağ dikey raylar KALDIRILDI — sol Sidebar düzeniyle ve
 * içerikle üst üste biniyordu (fixed konum akışı yok sayıyor). AdSense onaylanınca
 * yan reklam, sidebar/içerik akışının İÇİNDE (fixed değil) yeniden eklenebilir.
 *
 * ⚠️ AdSense politikası: içerikten çok reklam olan sayfalar onaylanmaz; slot
 * sayısını ölçülü tut.
 */
export function AdFrame({ children }: { children: React.ReactNode }) {
  const env = process.env;
  return (
    <>
      {/* ÜST banner */}
      <div className="container-x">
        <AdSlot slot={env.NEXT_PUBLIC_AD_SLOT_TOP} className="mt-3 min-h-[90px]" />
      </div>

      {children}

      {/* ALT banner */}
      <div className="container-x">
        <AdSlot slot={env.NEXT_PUBLIC_AD_SLOT_BOTTOM} className="mb-4 min-h-[90px]" />
      </div>
    </>
  );
}

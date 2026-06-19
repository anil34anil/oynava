import { AdSlot } from "./AdSlot";

/**
 * İçeriği dört kenardan reklamla sarar:
 *  - ÜST + ALT: her zaman görünen yatay banner'lar.
 *  - SOL + SAĞ: ekran kenarına sabit (fixed) dikey raylar; SADECE 1920px+ ekranlarda
 *    görünür ki dar ekranlarda içeriğin üstünü örtmesin.
 *
 * ⚠️ AdSense politikası: içerikten çok reklam olan / reklam yığılı sayfalar
 * onaylanmaz ya da hesabı kapatır. Slot sayısını ihtiyacına göre azalt.
 */
export function AdFrame({ children }: { children: React.ReactNode }) {
  const env = process.env;
  return (
    <>
      {/* SOL sabit ray (1920px+) */}
      <aside className="fixed left-2 top-32 z-30 hidden w-[160px] space-y-4 3xl:block">
        <AdSlot slot={env.NEXT_PUBLIC_AD_SLOT_LEFT} format="vertical" className="min-h-[600px]" />
        <AdSlot slot={env.NEXT_PUBLIC_AD_SLOT_LEFT2} format="vertical" className="min-h-[250px]" />
      </aside>

      {/* SAĞ sabit ray (1920px+) */}
      <aside className="fixed right-2 top-32 z-30 hidden w-[160px] space-y-4 3xl:block">
        <AdSlot slot={env.NEXT_PUBLIC_AD_SLOT_RIGHT} format="vertical" className="min-h-[600px]" />
        <AdSlot slot={env.NEXT_PUBLIC_AD_SLOT_RIGHT2} format="vertical" className="min-h-[250px]" />
      </aside>

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

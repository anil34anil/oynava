"use client";

import Link from "next/link";
import { CATEGORIES } from "@/lib/catalog";
import { COLLECTIONS } from "@/lib/collections";
import { SITE } from "@/lib/site";
import { Logo } from "./Logo";
import { useT, useAutoTr } from "@/lib/useLocaleClient";

export function Footer() {
  const { t, href } = useT();
  const [slogan, tagline, info, faq, contact, partners, ageRating, dataProtection, privacyPrefs, accessibility, rights, popularSearches] =
    useAutoTr([
      "Bir tık, bin oyun",
      "Binlerce ücretsiz HTML5 oyun. İndirme yok, kurulum yok — tarayıcında akıcı oyna.",
      "Bilgi",
      "SSS",
      "Kontak ve Künye",
      "İş Birlikleri ve Ortaklar",
      "Yaş Değerlendirmesi",
      "Veri Koruma Kuralları",
      "Gizlilik Tercihleri",
      "Erişilebilirlik",
      "Tüm hakları saklıdır. Oyunlar GameMonetize, GameDistribution ve GamePix ağları üzerinden sunulmaktadır.",
      "Popüler Aramalar",
    ]);

  return (
    <footer className="mt-16 border-t border-line bg-surface/60">
      <div className="container-x grid gap-8 py-10 md:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-2 text-sm font-semibold text-neon">{slogan}</p>
          <p className="mt-2 max-w-xs text-sm text-slate-500">{tagline}</p>
        </div>

        <div className="md:col-span-2">
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-300">
            {t("nav.categories")}
          </h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={href(`/kategori/${c.slug}`)}
                className="rounded-lg border border-line px-2.5 py-1 text-xs text-slate-400 hover:border-neon hover:text-neon"
              >
                {t(`cat.${c.slug}`)}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-300">{info}</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li><Link href={href("/premium")} className="hover:text-neon">{t("nav.premium")}</Link></li>
            <li><Link href={href("/etiketler")} className="hover:text-neon">Etiketler</Link></li>
            <li><Link href={href("/blog")} className="hover:text-neon">{t("nav.blog")}</Link></li>
            <li><Link href={href("/sss")} className="hover:text-neon">{faq}</Link></li>
            <li><Link href={href("/kunye")} className="hover:text-neon">{contact}</Link></li>
            <li><Link href={href("/isbirlikleri")} className="hover:text-neon">{partners}</Link></li>
          </ul>
        </div>
      </div>

      {/* Popüler koleksiyonlar — sitewide iç linkleme (yetim sayfa yok) */}
      <div className="border-t border-line/60">
        <div className="container-x py-5">
          <h4 className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
            {popularSearches}
          </h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {COLLECTIONS.map((c) => (
              <Link
                key={c.slug}
                href={href(`/${c.slug}`)}
                className="rounded-lg border border-line px-2.5 py-1 text-xs text-slate-400 hover:border-secondary hover:text-secondary"
              >
                {c.title}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-line/60">
        <div className="container-x flex flex-wrap items-center justify-center gap-x-4 gap-y-2 py-4 text-xs text-slate-500">
          <Link href={href("/kunye")} className="hover:text-neon">{contact}</Link>
          <span className="text-line">·</span>
          <Link href={href("/sss")} className="hover:text-neon">{faq}</Link>
          <span className="text-line">·</span>
          <Link href={href("/isbirlikleri")} className="hover:text-neon">{partners}</Link>
          <span className="text-line">·</span>
          <Link href={href("/yas-degerlendirmesi")} className="hover:text-neon">{ageRating}</Link>
          <span className="text-line">·</span>
          <Link href={href("/veri-koruma")} className="hover:text-neon">{dataProtection}</Link>
          <span className="text-line">·</span>
          <Link href={href("/hesap-sil")} className="hover:text-neon">Hesap Silme</Link>
          <span className="text-line">·</span>
          <Link href={href("/gizlilik-tercihleri")} className="hover:text-neon">{privacyPrefs}</Link>
          <span className="text-line">·</span>
          <Link href={href("/erisilebilirlik")} className="hover:text-neon">{accessibility}</Link>
        </div>
      </div>

      <div className="border-t border-line/60 py-4 text-center text-xs text-slate-600">
        © {SITE.launchYear} - {new Date().getFullYear()} OYNAVA · {rights}
      </div>
    </footer>
  );
}

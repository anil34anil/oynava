import Link from "next/link";
import type { Metadata } from "next";
import { COLLECTIONS } from "@/lib/collections";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import { t, localePath } from "@/lib/i18n";
import { getLocale } from "@/lib/localize";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Oyun Koleksiyonları — Temaya Göre Ücretsiz Oyunlar",
  description:
    "Araba, yarış, .io, bulmaca, kız, çocuk ve daha fazlası. 50+ oyun koleksiyonu arasından ilgilendiğin temayı seç, en iyi ücretsiz oyunları keşfet.",
  alternates: { canonical: "/koleksiyonlar" },
};

export default function KoleksiyonlarPage() {
  const locale = getLocale();
  const L = (p: string) => localePath(p, locale);

  return (
    <div className="container-x space-y-6 py-6">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Oyun Koleksiyonları",
          url: `${SITE.url}/koleksiyonlar`,
          inLanguage: "tr-TR",
          isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
        }}
      />
      <nav className="font-mono text-xs uppercase tracking-wider text-slate-500">
        <Link href={L("/")} className="hover:text-secondary">{t(locale, "nav.home")}</Link>
        <span className="px-1.5">/</span>
        <span className="text-slate-300">Koleksiyonlar</span>
      </nav>

      <h1 className="font-display text-3xl font-black text-ink neon-text">Oyun Koleksiyonları</h1>
      <p className="max-w-3xl text-slate-400">
        İlgilendiğin temaya göre oyun keşfet. {COLLECTIONS.length}+ özenle seçilmiş koleksiyon: her biri o
        konudaki en iyi ücretsiz oyunları bir araya getirir — indirme yok, tarayıcıda anında oyna.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {COLLECTIONS.map((c) => (
          <Link
            key={c.slug}
            href={L(`/${c.slug}`)}
            className="group rounded-2xl border border-line bg-card/60 p-4 transition hover:-translate-y-0.5 hover:border-neon hover:bg-card"
          >
            <h2 className="font-display text-base font-bold text-ink group-hover:text-neon">{c.title}</h2>
            <p className="mt-1 line-clamp-2 text-xs text-slate-500">{c.intro}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

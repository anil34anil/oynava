import Link from "next/link";
import { CATEGORIES } from "@/lib/catalog";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-surface/60">
      <div className="container-x grid gap-8 py-10 md:grid-cols-4">
        <div>
          <div className="font-display text-lg font-black tracking-widest text-white neon-text">
            OYNAVA
          </div>
          <p className="mt-1 text-sm font-semibold text-neon">Bir tık, bin oyun</p>
          <p className="mt-2 max-w-xs text-sm text-slate-500">
            Binlerce ücretsiz HTML5 oyun. İndirme yok, kurulum yok — tarayıcında
            akıcı oyna.
          </p>
        </div>

        <div className="md:col-span-2">
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-300">
            Kategoriler
          </h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/kategori/${c.slug}`}
                className="rounded-lg border border-line px-2.5 py-1 text-xs text-slate-400 hover:border-neon hover:text-neon"
              >
                {c.tr}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-300">
            Bilgi
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li><Link href="/sss" className="hover:text-neon">SSS</Link></li>
            <li><Link href="/kunye" className="hover:text-neon">Kontak ve Künye</Link></li>
            <li><Link href="/isbirlikleri" className="hover:text-neon">İş Birlikleri ve Ortaklar</Link></li>
          </ul>
        </div>
      </div>

      {/* Yasal bilgilendirme satırı */}
      <div className="border-t border-line/60">
        <div className="container-x flex flex-wrap items-center justify-center gap-x-4 gap-y-2 py-4 text-xs text-slate-500">
          <Link href="/kunye" className="hover:text-neon">Kontak ve Künye</Link>
          <span className="text-line">·</span>
          <Link href="/sss" className="hover:text-neon">SSS</Link>
          <span className="text-line">·</span>
          <Link href="/isbirlikleri" className="hover:text-neon">İş Birlikleri ve Ortaklar</Link>
          <span className="text-line">·</span>
          <Link href="/yas-degerlendirmesi" className="hover:text-neon">Yaş Değerlendirmesi</Link>
          <span className="text-line">·</span>
          <Link href="/veri-koruma" className="hover:text-neon">Veri Koruma Kuralları</Link>
          <span className="text-line">·</span>
          <Link href="/gizlilik-tercihleri" className="hover:text-neon">Gizlilik Tercihleri</Link>
          <span className="text-line">·</span>
          <Link href="/erisilebilirlik" className="hover:text-neon">Erişilebilirlik</Link>
        </div>
      </div>

      <div className="border-t border-line/60 py-4 text-center text-xs text-slate-600">
        © {SITE.launchYear} - {new Date().getFullYear()} OYNAVA · Tüm hakları saklıdır.
        Oyunlar GameMonetize ve GameDistribution ağları üzerinden sunulmaktadır.
      </div>
    </footer>
  );
}

import Link from "next/link";

/** Tüm yasal/bilgi sayfaları için ortak çerçeve: başlık + okunaklı içerik bloğu. */
export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container-x max-w-3xl py-8">
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:text-neon">Ana Sayfa</Link> / {title}
      </nav>
      <h1 className="font-display text-3xl font-black text-white neon-text">{title}</h1>
      {updated && <p className="mt-2 text-xs text-slate-500">Son güncelleme: {updated}</p>}
      <div className="legal-prose mt-6 space-y-4 text-slate-300">{children}</div>
    </div>
  );
}

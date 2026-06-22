import type { Metadata } from "next";
import Link from "next/link";
import { POSTS } from "@/lib/blog";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog — Oyun Rehberleri ve İpuçları",
  description: "Tarayıcı oyunları, .io oyunları, güvenli oyun seçimi ve daha fazlası üzerine özgün Türkçe rehberler.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const posts = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div className="container-x max-w-3xl py-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Oynava Blog",
          url: `${SITE.url}/blog`,
          blogPost: posts.slice(0, 20).map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            datePublished: p.date,
            url: `${SITE.url}/blog/${p.slug}`,
          })),
        }}
      />
      <h1 className="font-display text-3xl font-black text-white neon-text">Blog</h1>
      <p className="mt-2 text-slate-400">Oyun rehberleri, ipuçları ve haberler.</p>

      <div className="mt-8 space-y-4">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="card-base block p-5 transition hover:border-neon hover:shadow-glow"
          >
            <p className="text-xs text-slate-500">
              {new Date(p.date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
            </p>
            <h2 className="mt-1 font-display text-xl font-bold text-white">{p.title}</h2>
            <p className="mt-2 text-slate-400">{p.excerpt}</p>
            <span className="mt-3 inline-block text-sm font-semibold text-neon">Devamını oku →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

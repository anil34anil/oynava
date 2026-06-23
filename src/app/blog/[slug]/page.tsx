import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { POSTS, getPost } from "@/lib/blog";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPost(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.excerpt, type: "article", publishedTime: post.date },
  };
}

/** Satır içi [metin](/yol) linklerini <Link>'e çevirir. */
function inline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0, m: RegExpExecArray | null, k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(
      <Link key={k++} href={m[2]}>
        {m[1]}
      </Link>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

/** body satırlarını biçimlendirir: "## " başlık, "- " madde, diğer paragraf; satır içi link destekli. */
function renderBody(body: string[]) {
  const out: React.ReactNode[] = [];
  let list: string[] = [];
  const flush = (key: number) => {
    if (list.length) {
      out.push(
        <ul key={`ul-${key}`}>
          {list.map((li, i) => (
            <li key={i}>{inline(li.replace(/^-\s*/, ""))}</li>
          ))}
        </ul>,
      );
      list = [];
    }
  };
  body.forEach((line, i) => {
    if (line.startsWith("## ")) {
      flush(i);
      out.push(<h2 key={i}>{line.replace(/^##\s*/, "")}</h2>);
    } else if (line.startsWith("- ")) {
      list.push(line);
    } else {
      flush(i);
      out.push(<p key={i}>{inline(line)}</p>);
    }
  });
  flush(body.length);
  return out;
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  return (
    <article className="container-x max-w-3xl py-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.date,
          dateModified: post.date,
          inLanguage: "tr-TR",
          mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
          author: { "@type": "Organization", name: SITE.name },
          publisher: { "@type": "Organization", name: SITE.name, logo: { "@type": "ImageObject", url: `${SITE.url}/icon.svg` } },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE.url },
            { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE.url}/blog` },
            { "@type": "ListItem", position: 3, name: post.title, item: `${SITE.url}/blog/${post.slug}` },
          ],
        }}
      />
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/blog" className="hover:text-neon">Blog</Link> / {post.title}
      </nav>
      <h1 className="font-display text-3xl font-black text-ink neon-text">{post.title}</h1>
      <p className="mt-2 text-xs text-slate-500">
        {new Date(post.date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
      </p>
      <div className="legal-prose mt-6 space-y-4">{renderBody(post.body)}</div>

      {(() => {
        const related = POSTS.filter((p) => p.slug !== post.slug)
          .sort((a, b) => b.date.localeCompare(a.date))
          .slice(0, 3);
        if (!related.length) return null;
        return (
          <div className="mt-10 border-t border-line pt-6">
            <h2 className="font-display text-lg font-bold text-ink">İlgili Yazılar</h2>
            <ul className="mt-3 space-y-2">
              {related.map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="text-neon hover:underline">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })()}

      <div className="mt-10 border-t border-line pt-6">
        <Link href="/oyunlar" className="btn-primary">🎮 Oyunlara Göz At</Link>
      </div>
    </article>
  );
}

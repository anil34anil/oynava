import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { POSTS, getPost } from "@/lib/blog";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPost(params.slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

/** body satırlarını basit biçimlendirir: "## " başlık, "- " madde, diğer paragraf. */
function renderBody(body: string[]) {
  const out: React.ReactNode[] = [];
  let list: string[] = [];
  const flush = (key: number) => {
    if (list.length) {
      out.push(
        <ul key={`ul-${key}`}>
          {list.map((li, i) => (
            <li key={i}>{li.replace(/^-\s*/, "")}</li>
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
      out.push(<p key={i}>{line}</p>);
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
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/blog" className="hover:text-neon">Blog</Link> / {post.title}
      </nav>
      <h1 className="font-display text-3xl font-black text-white neon-text">{post.title}</h1>
      <p className="mt-2 text-xs text-slate-500">
        {new Date(post.date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
      </p>
      <div className="legal-prose mt-6 space-y-4">{renderBody(post.body)}</div>

      <div className="mt-10 border-t border-line pt-6">
        <Link href="/oyunlar" className="btn-primary">🎮 Oyunlara Göz At</Link>
      </div>
    </article>
  );
}

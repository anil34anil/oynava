import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getByCategory, categoryBySlug, CATEGORIES } from "@/lib/games";
import { GameGrid } from "@/components/GameGrid";
import { AdSlot } from "@/components/AdSlot";

export const revalidate = 3600;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const cat = categoryBySlug(params.slug);
  if (!cat) return {};
  return {
    title: `${cat.tr} Oyunları — Ücretsiz Oyna`,
    description: `En iyi ${cat.tr.toLowerCase()} oyunları. Tarayıcında ücretsiz, indirmeden oyna.`,
  };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const cat = categoryBySlug(params.slug);
  if (!cat) notFound();

  const games = await getByCategory(params.slug);

  return (
    <div className="container-x space-y-6 py-6">
      <div className="flex items-center gap-3">
        <h1 className="font-display text-3xl font-black text-white neon-text">{cat.tr}</h1>
        <span className="rounded-full border border-line px-3 py-1 text-sm text-slate-400">
          {games.length} oyun
        </span>
      </div>

      <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_TOP} className="min-h-[90px]" />

      <GameGrid games={games} priorityCount={6} />
    </div>
  );
}

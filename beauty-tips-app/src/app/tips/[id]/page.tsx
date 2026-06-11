import Link from "next/link";
import { notFound } from "next/navigation";
import { getTipById, tips } from "@/data/tips";

interface TipDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return tips.map((tip) => ({
    id: tip.id.toString(),
  }));
}

export default async function TipDetailPage({ params }: TipDetailPageProps) {
  const { id } = await params;
  const tipId = parseInt(id, 10);
  const tip = getTipById(tipId);

  if (!tip) {
    notFound();
  }

  return (
    <main className="flex-1">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            href="/tips"
            className="text-sm text-[#8b7355] hover:text-[#d4a574] transition-colors"
          >
            ← Back to all tips
          </Link>
        </nav>

        {/* Category badge */}
        <span className="inline-block text-sm font-medium text-[#d4a574] bg-[#d4a574]/10 rounded-full px-4 py-1.5 mb-4">
          {tip.category}
        </span>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a1a2e] leading-tight mt-4">
          {tip.title}
        </h1>

        {/* Date */}
        <time className="block mt-4 text-sm text-[#8b7355]">
          Published on {tip.createdAt}
        </time>

        {/* Content */}
        <div className="mt-10">
          <p className="text-lg leading-relaxed text-[#1a1a2e] whitespace-pre-line">
            {tip.content}
          </p>
        </div>
      </article>
    </main>
  );
}

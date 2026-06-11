import { notFound } from "next/navigation";
import Link from "next/link";
import { tips, getTipById } from "@/lib/tips";
import type { Metadata } from "next";

interface TipPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return tips.map((tip) => ({
    id: tip.id,
  }));
}

export async function generateMetadata({
  params,
}: TipPageProps): Promise<Metadata> {
  const { id } = await params;
  const tip = getTipById(id);

  if (!tip) {
    return { title: "Tip Not Found" };
  }

  return {
    title: `${tip.title} | Beauty Tips`,
    description: tip.excerpt,
  };
}

export default async function TipDetailPage({ params }: TipPageProps) {
  const { id } = await params;
  const tip = getTipById(id);

  if (!tip) {
    notFound();
  }

  const categoryColorMap: Record<string, string> = {
    Skincare:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    Makeup: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
    Haircare:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    Wellness:
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    "Nail Care":
      "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  };

  const categoryClasses =
    categoryColorMap[tip.category] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/tips"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Back to all tips
        </Link>

        <article>
          <div className="mb-6">
            <span
              className={`inline-block rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${categoryClasses}`}
            >
              {tip.category}
            </span>
          </div>

          <h1 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            {tip.title}
          </h1>

          <div className="prose prose-zinc mx-auto max-w-none dark:prose-invert">
            <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
              {tip.content}
            </p>
          </div>

          <div className="mt-10 border-t border-zinc-200 pt-6 dark:border-zinc-700">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                  Source:
                </span>
                <span className="text-sm text-zinc-700 dark:text-zinc-300">
                  {tip.source}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                  Attribution:
                </span>
                <span className="text-sm text-zinc-700 dark:text-zinc-300">
                  {tip.attribution}
                </span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

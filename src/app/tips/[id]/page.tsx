import Link from "next/link";
import { notFound } from "next/navigation";
import { tips } from "@/data/tips";

export function generateStaticParams() {
  return tips.map((tip) => ({
    id: tip.id,
  }));
}

export default async function TipDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tip = tips.find((t) => t.id === id);

  if (!tip) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/tips/page/1"
        className="inline-flex items-center text-sm font-medium text-pink-600 hover:text-pink-700 mb-8"
      >
        ← Back to all tips
      </Link>

      <article>
        <span className="inline-block rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-700 mb-4">
          {tip.category}
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {tip.title}
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Source: {tip.source}
        </p>
        <div className="mt-8 prose prose-gray max-w-none">
          <p className="text-lg leading-8 text-gray-700">{tip.content}</p>
        </div>
      </article>
    </div>
  );
}

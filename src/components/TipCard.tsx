import Link from "next/link";
import type { Tip } from "@/data/tips";

interface TipCardProps {
  tip: Tip;
}

export default function TipCard({ tip }: TipCardProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
      <div className="flex-1 p-6">
        <span className="inline-block rounded-full bg-pink-50 dark:bg-pink-900/30 px-3 py-1 text-xs font-medium text-pink-600 dark:text-pink-300">
          {tip.category}
        </span>
        <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 dark:text-white">
          <Link href={`/tips/${tip.id}`}>
            <span className="absolute inset-0" />
            {tip.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
          {tip.excerpt}
        </p>
      </div>
      <div className="px-6 pb-4">
        <span className="text-sm font-medium text-pink-600 dark:text-pink-400 group-hover:underline">
          Read more →
        </span>
      </div>
    </article>
  );
}

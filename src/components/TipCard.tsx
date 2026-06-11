import Link from "next/link";
import type { Tip } from "@/data/tips";

interface TipCardProps {
  tip: Tip;
}

export default function TipCard({ tip }: TipCardProps) {
  return (
    <Link
      href={`/tips/${tip.id}`}
      className="group block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-gray-300"
    >
      <span className="inline-block rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-700 mb-3">
        {tip.category}
      </span>
      <h2 className="text-lg font-semibold text-gray-900 group-hover:text-pink-600 transition-colors mb-2">
        {tip.title}
      </h2>
      <p className="text-sm text-gray-600 line-clamp-2">{tip.excerpt}</p>
    </Link>
  );
}

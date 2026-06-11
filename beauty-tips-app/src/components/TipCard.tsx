import Link from "next/link";
import { Tip } from "@/types/tip";

interface TipCardProps {
  tip: Tip;
}

export default function TipCard({ tip }: TipCardProps) {
  return (
    <article className="group bg-white rounded-2xl shadow-sm border border-[#e8d5c4] overflow-hidden hover:shadow-md hover:border-[#d4a574] transition-all duration-300 hover:-translate-y-1">
      <div className="p-6">
        <span className="inline-block text-xs font-medium text-[#d4a574] bg-[#d4a574]/10 rounded-full px-3 py-1 mb-3">
          {tip.category}
        </span>
        <h3 className="text-lg font-semibold text-[#1a1a2e] group-hover:text-[#c4905e] transition-colors duration-200 leading-snug mb-2">
          <Link href={`/tips/${tip.id}`}>
            <span className="absolute inset-0" aria-hidden="true" />
            {tip.title}
          </Link>
        </h3>
        <p className="text-sm text-[#5c4a3a] leading-relaxed line-clamp-3">
          {tip.excerpt}
        </p>
      </div>
      <div className="px-6 pb-4">
        <span className="text-xs text-[#8b7355]">{tip.createdAt}</span>
      </div>
    </article>
  );
}

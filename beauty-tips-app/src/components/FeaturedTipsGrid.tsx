import Link from "next/link";
import TipCard from "./TipCard";
import { Tip } from "@/types/tip";

interface FeaturedTipsGridProps {
  tips: Tip[];
}

export default function FeaturedTipsGrid({ tips }: FeaturedTipsGridProps) {
  return (
    <section id="featured" className="w-full bg-white py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a2e]">
            Featured Beauty Tips
          </h2>
          <p className="mt-4 text-lg text-[#5c4a3a]">
            Handpicked advice to help you look and feel your best every day.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {tips.map((tip) => (
            <TipCard key={tip.id} tip={tip} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/tips"
            className="inline-flex items-center justify-center rounded-full bg-[#1a1a2e] px-8 py-3.5 text-base font-semibold text-white shadow-md hover:bg-[#2a2a3e] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1a2e]"
          >
            View All Tips
          </Link>
        </div>
      </div>
    </section>
  );
}

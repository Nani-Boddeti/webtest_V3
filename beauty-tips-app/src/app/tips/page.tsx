import Link from "next/link";
import { getPaginatedTips } from "@/data/tips";
import TipCard from "@/components/TipCard";

export default function TipsPage() {
  const { tips, totalPages, total } = getPaginatedTips(1, 10);

  return (
    <main className="flex-1">
      {/* Page Header */}
      <section className="w-full bg-gradient-to-br from-[#faf5f0] via-[#f0e6d8] to-[#e8d5c4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1a1a2e]">
              All Beauty Tips
            </h1>
            <p className="mt-4 text-lg text-[#5c4a3a]">
              Browse our complete collection of {total} expert-curated beauty
              tips.
            </p>
          </div>
        </div>
      </section>

      {/* Tips Grid */}
      <section className="w-full bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {tips.map((tip) => (
              <TipCard key={tip.id} tip={tip} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <span className="text-sm text-[#5c4a3a]">
                Page 1 of {totalPages}
              </span>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

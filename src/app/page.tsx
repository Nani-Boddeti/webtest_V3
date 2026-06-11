import Hero from "@/components/Hero";
import TipCard from "@/components/TipCard";
import Link from "next/link";
import { tips } from "@/data/tips";

export default function HomePage() {
  const featuredTips = tips.slice(0, 3);

  return (
    <>
      <Hero />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Featured Tips
              </h2>
              <p className="mt-2 text-gray-600">
                Hand-picked beauty advice to get you started.
              </p>
            </div>
            <Link
              href="/tips/page/1"
              className="hidden sm:inline-flex text-sm font-medium text-pink-600 hover:text-pink-700"
            >
              View all &rarr;
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTips.map((tip) => (
              <TipCard key={tip.id} tip={tip} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/tips/page/1"
              className="inline-flex items-center rounded-full border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              View all tips &rarr;
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

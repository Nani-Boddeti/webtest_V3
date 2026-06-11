import Hero from "@/components/Hero";
import TipCard from "@/components/TipCard";
import { tips } from "@/data/tips";
import Link from "next/link";

export default function Home() {
  // Show first 6 tips as featured
  const featuredTips = tips.slice(0, 6);

  return (
    <>
      <Hero />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Featured Beauty Tips
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Handpicked advice to elevate your beauty routine
            </p>
          </div>
          <Link
            href="/tips"
            className="hidden sm:inline-flex items-center rounded-full border border-gray-300 dark:border-gray-600 px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            View all tips
            <svg
              className="ml-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredTips.map((tip) => (
            <TipCard key={tip.id} tip={tip} />
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/tips"
            className="inline-flex items-center rounded-full border border-gray-300 dark:border-gray-600 px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            View all tips
            <svg
              className="ml-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}

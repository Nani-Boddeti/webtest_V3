import Hero from "@/components/Hero";
import TipCard from "@/components/TipCard";
import Link from "next/link";
import { tips } from "@/data/tips";

export default function HomePage() {
  const featuredTips = tips.slice(0, 3);
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
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
import { tips, getFeaturedTips, getCategories } from "@/data/tips";

export default function Home() {
  const featuredTips = getFeaturedTips();
  const categories = getCategories();

  return (
    <div className="flex flex-col min-h-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your Daily Dose of Beauty Wisdom
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Expert-backed beauty tips for skincare, haircare, makeup, and
            wellness. Discover your new beauty routine today.
          </p>
          <a
            href="/tips"
            className="inline-flex items-center px-8 py-3 rounded-full bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
          >
            Explore All Tips
          </a>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Browse by Category
          </h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <a
                key={category}
                href={`/tips?category=${category.toLowerCase()}`}
                className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                {category}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tips Section */}
      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">
            Featured Tips
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredTips.map((tip) => (
              <a
                key={tip.id}
                href={`/tips/${tip.id}`}
                className="block p-6 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-700 mb-3">
                  {tip.category}
                </span>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {tip.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-3">
                  {tip.content}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Footer */}
      <footer className="py-8 px-6 bg-white border-t border-gray-100 mt-auto">
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-400">
          <p>
            {tips.length} expert-curated beauty tips &middot;{" "}
            {categories.length} categories &middot; Updated daily
          </p>
        </div>
      </footer>
    </div>
  );
}

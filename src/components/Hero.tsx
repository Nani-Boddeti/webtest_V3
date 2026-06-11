import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
            Discover Your{" "}
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Beauty
            </span>{" "}
            Potential
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Expert beauty tips, skincare routines, makeup tutorials, and hair
            care advice curated to help you look and feel your best every day.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/tips"
              className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
            >
              Explore Tips
            </Link>
            <Link
              href="/tips?category=Skincare"
              className="rounded-full border border-gray-300 dark:border-gray-600 px-8 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 transition-all hover:bg-gray-100 dark:hover:bg-zinc-800 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
            >
              Skincare Guide
            </Link>
          </div>
        </div>
      </div>
      {/* Decorative elements */}
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br from-pink-200/30 to-purple-300/20 blur-3xl dark:from-pink-500/10 dark:to-purple-500/10" />
      <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-gradient-to-tr from-rose-200/30 to-pink-300/20 blur-3xl dark:from-rose-500/10 dark:to-pink-500/10" />
    </section>
  );
}

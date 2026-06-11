import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-pink-50 via-white to-purple-50 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
          Your Daily Dose of{" "}
          <span className="text-pink-600">Beauty Wisdom</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
          Discover expert-approved beauty tips for glowing skin, flawless makeup,
          and luscious hair. Curated by professionals, delivered daily.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/tips/page/1"
            className="rounded-full bg-pink-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-pink-700 transition"
          >
            Explore Tips
          </Link>
          <Link
            href="/tips/page/1"
            className="rounded-full border border-gray-300 px-8 py-3 text-base font-semibold text-gray-700 hover:bg-gray-100 transition"
          >
            Browse All
          </Link>
        </div>
      </div>
    </section>
  );
}

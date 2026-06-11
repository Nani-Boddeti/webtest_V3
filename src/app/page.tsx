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

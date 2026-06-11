import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      className="relative w-full bg-gradient-to-br from-[#faf5f0] via-[#f0e6d8] to-[#e8d5c4] overflow-hidden"
      aria-label="Hero banner"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4a574]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#c4905e]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1a1a2e] leading-tight">
            Your Daily Dose of
            <span className="block text-[#d4a574] mt-2">Beauty &amp; Glow</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-[#5c4a3a] max-w-2xl mx-auto leading-relaxed">
            Discover expert-curated beauty tips, skincare routines, makeup
            tutorials, and hair care secrets. Transform your daily routine with
            advice that actually works.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/tips"
              className="inline-flex items-center justify-center rounded-full bg-[#d4a574] px-8 py-3.5 text-base font-semibold text-white shadow-md hover:bg-[#c4905e] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4a574]"
            >
              Browse All Tips
            </Link>
            <Link
              href="#featured"
              className="inline-flex items-center justify-center rounded-full border-2 border-[#d4a574] px-8 py-3.5 text-base font-semibold text-[#1a1a2e] hover:bg-[#d4a574]/10 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4a574]"
            >
              Explore Featured
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

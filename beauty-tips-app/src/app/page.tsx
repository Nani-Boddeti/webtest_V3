import Link from "next/link";
import { getFeaturedTips } from "@/data/tips";
import HeroSection from "@/components/HeroSection";
import FeaturedTipsGrid from "@/components/FeaturedTipsGrid";

export default function Home() {
  const featuredTips = getFeaturedTips();

  return (
    <>
      <HeroSection />
      <main className="flex-1">
        <FeaturedTipsGrid tips={featuredTips} />
      </main>
    </>
  );
}

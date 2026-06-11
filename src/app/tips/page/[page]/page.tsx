import Link from "next/link";
import { tips } from "@/data/tips";
import TipCard from "@/components/TipCard";
import PaginationControls from "@/components/PaginationControls";

const TIPS_PER_PAGE = 10;

export function generateStaticParams() {
  const totalPages = Math.ceil(tips.length / TIPS_PER_PAGE);
  return Array.from({ length: totalPages }, (_, i) => ({
    page: String(i + 1),
  }));
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const currentPage = parseInt(page, 10);
  const totalPages = Math.ceil(tips.length / TIPS_PER_PAGE);

  if (isNaN(currentPage) || currentPage < 1 || currentPage > totalPages) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 py-24">
        <h1 className="text-2xl font-bold text-gray-900">Page not found</h1>
        <p className="mt-2 text-gray-600">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/tips/page/1"
          className="mt-6 rounded-lg bg-pink-600 px-6 py-3 text-sm font-medium text-white hover:bg-pink-700 transition"
        >
          Go to first page
        </Link>
      </div>
    );
  }

  const startIndex = (currentPage - 1) * TIPS_PER_PAGE;
  const pageTips = tips.slice(startIndex, startIndex + TIPS_PER_PAGE);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Beauty Tips
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Page {currentPage} of {totalPages}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pageTips.map((tip) => (
          <TipCard key={tip.id} tip={tip} />
        ))}
      </div>

      <PaginationControls currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}

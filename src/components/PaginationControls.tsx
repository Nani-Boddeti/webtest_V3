import Link from "next/link";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
}

export default function PaginationControls({
  currentPage,
  totalPages,
}: PaginationControlsProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex items-center justify-center gap-2"
    >
      {currentPage > 1 ? (
        <Link
          href={`/tips/page/${currentPage - 1}`}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
        >
          ← Previous
        </Link>
      ) : (
        <span className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
          ← Previous
        </span>
      )}

      <div className="hidden sm:flex gap-1">
        {pages.map((page) =>
          page === currentPage ? (
            <span
              key={page}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-600 text-sm font-bold text-white"
            >
              {page}
            </span>
          ) : (
            <Link
              key={page}
              href={`/tips/page/${page}`}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              {page}
            </Link>
          )
        )}
      </div>

      {currentPage < totalPages ? (
        <Link
          href={`/tips/page/${currentPage + 1}`}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
        >
          Next →
        </Link>
      ) : (
        <span className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
          Next →
        </span>
      )}
    </nav>
  );
}

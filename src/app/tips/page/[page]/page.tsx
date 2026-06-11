import Link from 'next/link';
import { getTipsForPage, TOTAL_PAGES, TIPS_PER_PAGE, TOTAL_TIPS } from '@/data';
import type { Tip } from '@/data/types';

interface PageProps {
  params: Promise<{ page: string }>;
}

export async function generateStaticParams() {
  const pages = Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1);
  return pages.map((p) => ({ page: String(p) }));
}

function TipCard({ tip }: { tip: Tip }) {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800">
      <span className="mb-3 inline-block rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
        {tip.category}
      </span>
      <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-white">
        {tip.title}
      </h2>
      <p className="mb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {tip.excerpt}
      </p>
      <p className="text-xs text-zinc-400 dark:text-zinc-500">
        Source: {tip.source}
      </p>
    </article>
  );
}

function PaginationControls({ currentPage }: { currentPage: number }) {
  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex items-center justify-center gap-2"
    >
      {currentPage > 1 ? (
        <Link
          href={`/tips/page/${currentPage - 1}`}
          className="flex h-10 items-center rounded-lg border border-zinc-300 px-4 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          ← Previous
        </Link>
      ) : (
        <span className="flex h-10 items-center rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-400 dark:border-zinc-700 dark:text-zinc-600">
          ← Previous
        </span>
      )}

      <div className="flex items-center gap-1">
        {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((p) => (
          <Link
            key={p}
            href={`/tips/page/${p}`}
            className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              p === currentPage
                ? 'bg-rose-600 text-white'
                : 'border border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700'
            }`}
          >
            {p}
          </Link>
        ))}
      </div>

      {currentPage < TOTAL_PAGES ? (
        <Link
          href={`/tips/page/${currentPage + 1}`}
          className="flex h-10 items-center rounded-lg border border-zinc-300 px-4 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          Next →
        </Link>
      ) : (
        <span className="flex h-10 items-center rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-400 dark:border-zinc-700 dark:text-zinc-600">
          Next →
        </span>
      )}
    </nav>
  );
}

export default async function TipsPage({ params }: PageProps) {
  const { page } = await params;
  const currentPage = Number(page);

  if (isNaN(currentPage) || currentPage < 1 || currentPage > TOTAL_PAGES) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Page Not Found
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            The page you are looking for does not exist.
          </p>
          <Link
            href="/tips/page/1"
            className="mt-4 inline-block rounded-lg bg-rose-600 px-6 py-2 text-sm font-medium text-white hover:bg-rose-700"
          >
            Go to first page
          </Link>
        </div>
      </div>
    );
  }

  const tips = getTipsForPage(currentPage);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-white">
        Beauty Tips
      </h1>
      <p className="mb-8 text-zinc-600 dark:text-zinc-400">
        Page {currentPage} of {TOTAL_PAGES} &middot; {TOTAL_TIPS} tips total
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        {tips.map((tip) => (
          <TipCard key={tip.id} tip={tip} />
        ))}
      </div>

      <PaginationControls currentPage={currentPage} />
    </div>
  );
}

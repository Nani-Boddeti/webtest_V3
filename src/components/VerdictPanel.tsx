'use client';

import type { Verdict } from '../lib/types';

interface VerdictPanelProps {
  verdict: Verdict;
}

export default function VerdictPanel({ verdict }: VerdictPanelProps) {
  return (
    <section
      aria-labelledby="verdict-heading"
      className="card mt-8 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-6 sm:p-8"
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
            />
          </svg>
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
            Verdict
          </p>
          <h2 id="verdict-heading" className="text-2xl font-bold tracking-tight text-slate-900">
            {verdict.winner}
          </h2>
        </div>
      </div>
      <p className="mt-4 text-lg font-medium text-slate-800">{verdict.summary}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{verdict.justification}</p>
    </section>
  );
}

'use client';

import { ATTRIBUTE_KEYS, ATTRIBUTE_LABELS, type WatchResult } from '../lib/types';

interface ResultsTableProps {
  results: WatchResult[];
}

function ScoreBar({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(100, score));
  return (
    <div
      role="progressbar"
      aria-label="Score"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200"
    >
      <div
        className="h-full rounded-full bg-indigo-500"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

function Warnings({ warnings }: { warnings: string[] }) {
  if (warnings.length === 0) {
    return <span className="text-sm text-emerald-600">No warnings</span>;
  }

  return (
    <ul className="space-y-1.5">
      {warnings.map((warning) => (
        <li key={warning} className="flex items-start gap-2 text-sm text-amber-700">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="mt-0.5 h-4 w-4 shrink-0 text-amber-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
            />
          </svg>
          <span>{warning}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ResultsTable({ results }: ResultsTableProps) {
  return (
    <section aria-labelledby="results-heading" className="mt-10">
      <h2 id="results-heading" className="text-2xl font-bold tracking-tight text-slate-900">
        Side-by-side comparison
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Scores range from 0 to 100; higher is better.
      </p>

      {/* Desktop comparison table */}
      <div className="mt-6 hidden overflow-x-auto md:block">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th scope="col" className="py-3 pr-4 font-semibold text-slate-500">
                Attribute
              </th>
              {results.map((result) => (
                <th scope="col" key={result.name} className="px-4 py-3">
                  <div className="font-semibold text-slate-900">{result.name}</div>
                  <div className="mt-1 text-xs font-medium text-slate-500">
                    Score <span className="font-semibold text-indigo-600">{result.totalScore}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ATTRIBUTE_KEYS.map((key) => (
              <tr key={key} className="border-b border-slate-100">
                <th scope="row" className="py-3 pr-4 font-medium text-slate-700">
                  {ATTRIBUTE_LABELS[key]}
                </th>
                {results.map((result) => {
                  const score = result.scores.find((entry) => entry.attribute === key);
                  if (!score) return null;
                  return (
                    <td key={result.name} className="px-4 py-3 align-top">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-slate-900">{score.score}</span>
                        <span className="text-right text-xs text-slate-500">{score.detail}</span>
                      </div>
                      <div className="mt-2">
                        <ScoreBar score={score.score} />
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr>
              <th scope="row" className="py-3 pr-4 font-medium text-slate-700">
                Warnings
              </th>
              {results.map((result) => (
                <td key={result.name} className="px-4 py-3 align-top">
                  <Warnings warnings={result.warnings} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile comparison cards */}
      <div className="mt-6 space-y-6 md:hidden">
        {results.map((result) => (
          <article key={result.name} className="card p-5">
            <header className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <h3 className="font-semibold text-slate-900">{result.name}</h3>
              <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
                {result.totalScore}
              </span>
            </header>
            <dl className="divide-y divide-slate-100">
              {result.scores.map((score) => (
                <div
                  key={score.attribute}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <dt className="text-sm text-slate-600">{score.label}</dt>
                  <dd className="text-right">
                    <span className="font-semibold text-slate-900">{score.score}</span>
                    <span className="ml-2 text-xs text-slate-500">{score.detail}</span>
                  </dd>
                </div>
              ))}
            </dl>
            <div className="border-t border-slate-100 pt-3">
              <h4 className="sr-only">Warnings</h4>
              <Warnings warnings={result.warnings} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

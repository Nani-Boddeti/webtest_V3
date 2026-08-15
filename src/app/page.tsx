'use client';

import { useState } from 'react';
import CompareForm from '../components/CompareForm';
import ResultsTable from '../components/ResultsTable';
import VerdictPanel from '../components/VerdictPanel';
import type { AttributeWeights, CompareResponse } from '../lib/types';
import { DEFAULT_WEIGHTS, normalizeWeights } from '../lib/weights';

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

export default function Home() {
  const [watches, setWatches] = useState<string[]>(['', '']);
  const [purpose, setPurpose] = useState('');
  const [weights, setWeights] = useState<AttributeWeights>(DEFAULT_WEIGHTS);
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [response, setResponse] = useState<CompareResponse | null>(null);

  async function handleSubmit() {
    const names = watches.map((watch) => watch.trim()).filter((watch) => watch.length > 0);
    setStatus('loading');
    setSubmitError(null);
    setResponse(null);

    try {
      const result = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          watches: names,
          weights: normalizeWeights(weights),
          purpose: purpose.trim() || undefined,
        }),
      });

      if (!result.ok) {
        const data = (await result.json().catch(() => null)) as { error?: string } | null;
        setStatus('error');
        setSubmitError(data?.error ?? `Request failed with status ${result.status}.`);
        return;
      }

      const data = (await result.json()) as CompareResponse;
      setResponse(data);
      setStatus('success');
    } catch {
      setStatus('error');
      setSubmitError('Could not reach the comparison service. Please try again.');
    }
  }

  return (
    <main className="page-container flex min-h-screen flex-col justify-center py-12 sm:py-16">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
          Smartwatch comparison
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Find the smartwatch that fits your life
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          Compare two or more watches across price, battery life, sleep tracking,
          durability, and subscription-free operation.
        </p>
      </header>

      <div className="mt-8">
        <CompareForm
          watches={watches}
          purpose={purpose}
          weights={weights}
          submitting={status === 'loading'}
          submitError={submitError}
          onWatchesChange={setWatches}
          onPurposeChange={setPurpose}
          onWeightsChange={setWeights}
          onSubmit={handleSubmit}
        />
      </div>

      {status === 'loading' && (
        <p role="status" className="mt-6 text-sm text-slate-500">
          Fetching the latest specs and comparing watches…
        </p>
      )}

      {status === 'success' && response && (
        <>
          <ResultsTable results={response.results} />
          <VerdictPanel verdict={response.verdict} />
        </>
      )}
    </main>
  );
}

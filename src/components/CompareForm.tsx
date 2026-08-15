'use client';

import { useState, type FormEvent } from 'react';
import type { AttributeWeights } from '../lib/types';
import { isValidWatchList } from '../lib/weights';
import WeightControls from './WeightControls';

interface CompareFormProps {
  watches: string[];
  purpose: string;
  weights: AttributeWeights;
  submitting: boolean;
  submitError: string | null;
  onWatchesChange: (watches: string[]) => void;
  onPurposeChange: (purpose: string) => void;
  onWeightsChange: (weights: AttributeWeights) => void;
  onSubmit: () => void;
}

export default function CompareForm({
  watches,
  purpose,
  weights,
  submitting,
  submitError,
  onWatchesChange,
  onPurposeChange,
  onWeightsChange,
  onSubmit,
}: CompareFormProps) {
  const [validationError, setValidationError] = useState<string | null>(null);

  function addWatch() {
    onWatchesChange([...watches, '']);
  }

  function updateWatch(index: number, value: string) {
    onWatchesChange(watches.map((watch, i) => (i === index ? value : watch)));
  }

  function removeWatch(index: number) {
    if (watches.length <= 2) return;
    onWatchesChange(watches.filter((_, i) => i !== index));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValidWatchList(watches)) {
      setValidationError('Enter at least two watch names to compare.');
      return;
    }
    setValidationError(null);
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="card p-6 sm:p-8">
      <section aria-labelledby="watches-heading">
        <h2 id="watches-heading" className="text-lg font-semibold text-slate-900">
          Watches to compare
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Add two or more smartwatches to compare them side by side.
        </p>

        <div className="mt-5 space-y-3">
          {watches.map((watch, index) => (
            <div key={index} className="flex items-end gap-2">
              <div className="flex-1">
                <label htmlFor={`watch-${index}`} className="field-label">
                  Watch {index + 1}
                </label>
                <input
                  id={`watch-${index}`}
                  type="text"
                  value={watch}
                  onChange={(event) => updateWatch(index, event.target.value)}
                  placeholder="e.g. Apple Watch Series 10"
                  autoComplete="off"
                  className="text-input mt-1"
                />
              </div>
              <button
                type="button"
                onClick={() => removeWatch(index)}
                disabled={watches.length <= 2}
                aria-label={`Remove watch ${index + 1}`}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-300 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4 w-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addWatch}
          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 transition hover:text-indigo-500"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
          </svg>
          Add another watch
        </button>

        {validationError && (
          <p role="alert" className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {validationError}
          </p>
        )}
      </section>

      <WeightControls weights={weights} onChange={onWeightsChange} />

      <section aria-labelledby="purpose-heading" className="mt-8 border-t border-slate-200 pt-6">
        <h2 id="purpose-heading" className="sr-only">
          Purpose
        </h2>
        <label htmlFor="purpose" className="field-label">
          What will you use it for?{' '}
          <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <textarea
          id="purpose"
          value={purpose}
          onChange={(event) => onPurposeChange(event.target.value)}
          rows={3}
          placeholder="e.g. marathon training, everyday health tracking, hiking"
          className="text-input mt-1 resize-y"
        />
      </section>

      {submitError && (
        <p role="alert" className="mt-6 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary mt-8 w-full sm:w-auto"
      >
        {submitting ? 'Comparing…' : 'Compare watches'}
      </button>
    </form>
  );
}

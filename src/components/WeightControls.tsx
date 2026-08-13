'use client';

import {
  ATTRIBUTE_KEYS,
  ATTRIBUTE_LABELS,
  type AttributeKey,
  type AttributeWeights,
} from '../lib/types';

interface WeightControlsProps {
  weights: AttributeWeights;
  onChange: (weights: AttributeWeights) => void;
}

export default function WeightControls({ weights, onChange }: WeightControlsProps) {
  function updateWeight(key: AttributeKey, value: number) {
    const next = { ...weights };
    next[key] = value;
    onChange(next);
  }

  return (
    <fieldset className="mt-8 border-t border-slate-200 pt-6">
      <legend className="text-lg font-semibold text-slate-900">Importance weights</legend>
      <p className="mt-1 text-sm text-slate-500">
        Drag the sliders to prioritize what matters most to you.
      </p>

      <div className="mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {ATTRIBUTE_KEYS.map((key) => {
          const value = weights[key];
          return (
            <div key={key}>
              <div className="flex items-center justify-between gap-4">
                <label htmlFor={`weight-${key}`} className="text-sm font-medium text-slate-700">
                  {ATTRIBUTE_LABELS[key]}
                </label>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                  {value}
                </span>
              </div>
              <input
                id={`weight-${key}`}
                type="range"
                min={0}
                max={100}
                step={1}
                value={value}
                onChange={(event) => updateWeight(key, Number(event.target.value))}
                aria-valuetext={`${value} out of 100`}
                className="mt-2 h-2 w-full cursor-pointer accent-indigo-600"
              />
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}

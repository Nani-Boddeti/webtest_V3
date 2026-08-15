import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { WatchResult } from '../lib/types';
import ResultsTable from './ResultsTable';

const results: WatchResult[] = [
  {
    name: 'Apple Watch Series 10',
    totalScore: 78,
    warnings: ['No durability data found for Apple Watch Series 10.'],
    scores: [
      { attribute: 'price', label: 'Price', score: 100, detail: '$399.00' },
      { attribute: 'batteryLife', label: 'Battery Life', score: 20, detail: '18 hours' },
      { attribute: 'sleepTracking', label: 'Sleep Tracking', score: 100, detail: 'Supported' },
      { attribute: 'durability', label: 'Durability', score: 50, detail: 'Not available' },
      {
        attribute: 'subscriptionFree',
        label: 'Subscription-Free',
        score: 100,
        detail: 'No subscription required',
      },
    ],
  },
  {
    name: 'Garmin Forerunner 265',
    totalScore: 85,
    warnings: [],
    scores: [
      { attribute: 'price', label: 'Price', score: 80, detail: '$449.99' },
      { attribute: 'batteryLife', label: 'Battery Life', score: 100, detail: '312 hours' },
      { attribute: 'sleepTracking', label: 'Sleep Tracking', score: 100, detail: 'Supported' },
      { attribute: 'durability', label: 'Durability', score: 60, detail: '5 ATM water resistance' },
      {
        attribute: 'subscriptionFree',
        label: 'Subscription-Free',
        score: 100,
        detail: 'No subscription required',
      },
    ],
  },
];

describe('ResultsTable', () => {
  it('renders both watch names and all five attribute labels', () => {
    render(<ResultsTable results={results} />);

    expect(screen.getAllByText('Apple Watch Series 10').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Garmin Forerunner 265').length).toBeGreaterThan(0);

    for (const label of [
      'Price',
      'Battery Life',
      'Sleep Tracking',
      'Durability',
      'Subscription-Free',
    ]) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
  });

  it('renders per-watch warnings and a clean state for watches without warnings', () => {
    render(<ResultsTable results={results} />);

    expect(
      screen.getAllByText(/no durability data found for apple watch series 10/i).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText('No warnings').length).toBeGreaterThan(0);
  });

  it('renders each watch total score', () => {
    render(<ResultsTable results={results} />);

    expect(screen.getAllByText('78').length).toBeGreaterThan(0);
    expect(screen.getAllByText('85').length).toBeGreaterThan(0);
  });
});

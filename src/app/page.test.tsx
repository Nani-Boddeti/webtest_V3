import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { CompareResponse } from '../lib/types';
import Home from './page';

const successResponse: CompareResponse = {
  results: [
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
        {
          attribute: 'durability',
          label: 'Durability',
          score: 60,
          detail: '5 ATM water resistance',
        },
        {
          attribute: 'subscriptionFree',
          label: 'Subscription-Free',
          score: 100,
          detail: 'No subscription required',
        },
      ],
    },
  ],
  verdict: {
    winner: 'Garmin Forerunner 265',
    summary: 'Garmin Forerunner 265 offers the best value.',
    justification:
      'Garmin Forerunner 265 earned a weighted score of 85, led by battery life (312 hours) and sleep tracking (Supported).',
  },
};

function jsonResponse(data: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
  } as unknown as Response;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

function fillTwoWatches(first = 'Apple Watch Series 10', second = 'Garmin Forerunner 265') {
  fireEvent.change(screen.getByLabelText('Watch 1'), { target: { value: first } });
  fireEvent.change(screen.getByLabelText('Watch 2'), { target: { value: second } });
}

function submitForm() {
  fireEvent.click(screen.getByRole('button', { name: /compare watches/i }));
}

describe('Home page', () => {
  it('renders the main heading', () => {
    render(<Home />);
    expect(
      screen.getByRole('heading', { name: /find the smartwatch that fits your life/i }),
    ).toBeInTheDocument();
  });

  it('shows an inline validation error when fewer than two watches are provided', () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    render(<Home />);

    submitForm();

    expect(screen.getByRole('alert')).toHaveTextContent(/at least two watch names/i);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('normalizes weights so they sum to one before sending the request', async () => {
    const fetchMock = vi.fn(async () => jsonResponse(successResponse));
    vi.stubGlobal('fetch', fetchMock);
    render(<Home />);

    fillTwoWatches();
    fireEvent.change(screen.getByLabelText('Price'), { target: { value: '50' } });
    submitForm();

    await screen.findByRole('heading', { name: 'Garmin Forerunner 265', level: 2 });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const request = fetchMock.mock.calls[0][1] as RequestInit;
    const body = JSON.parse(String(request.body)) as {
      watches: string[];
      weights: Record<string, number>;
    };

    expect(body.watches).toEqual(['Apple Watch Series 10', 'Garmin Forerunner 265']);
    const total = Object.values(body.weights).reduce((sum, value) => sum + value, 0);
    expect(total).toBeCloseTo(1);
    expect(body.weights.price).toBeCloseTo(50 / 130);
  });

  it('shows a loading state while the request is in flight', async () => {
    let resolveFetch: (value: Response) => void;
    const fetchMock = vi.fn(
      () =>
        new Promise<Response>((resolve) => {
          resolveFetch = resolve;
        }),
    );
    vi.stubGlobal('fetch', fetchMock);
    render(<Home />);

    fillTwoWatches();
    submitForm();

    const loadingButton = await screen.findByRole('button', { name: /comparing/i });
    expect(loadingButton).toBeDisabled();
    expect(screen.getByRole('status')).toHaveTextContent(/fetching the latest specs/i);

    resolveFetch!(jsonResponse(successResponse));
    await screen.findByRole('heading', { name: 'Garmin Forerunner 265', level: 2 });
  });

  it('shows an error state when the API responds with an error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => jsonResponse({ error: 'Server is missing the SERPER_API_KEY environment variable.' }, 500)),
    );
    render(<Home />);

    fillTwoWatches();
    submitForm();

    expect(await screen.findByRole('alert')).toHaveTextContent(/serper_api_key/i);
  });

  it('shows an error state when the network request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('network down');
      }),
    );
    render(<Home />);

    fillTwoWatches();
    submitForm();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /could not reach the comparison service/i,
    );
  });

  it('renders the comparison results and verdict on success', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse(successResponse)));
    render(<Home />);

    fillTwoWatches();
    submitForm();

    await waitFor(() => {
      expect(screen.getAllByText('Garmin Forerunner 265').length).toBeGreaterThan(0);
    });
    expect(screen.getByRole('heading', { name: 'Side-by-side comparison' })).toBeInTheDocument();
    expect(screen.getByText(/offers the best value/i)).toBeInTheDocument();
  });
});

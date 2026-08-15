import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import VerdictPanel from './VerdictPanel';

describe('VerdictPanel', () => {
  it('renders the winner, summary, and justification', () => {
    render(
      <VerdictPanel
        verdict={{
          winner: 'Garmin Forerunner 265',
          summary: 'Garmin Forerunner 265 offers the best value for marathon training.',
          justification:
            'Garmin Forerunner 265 earned a weighted score of 85, led by battery life (312 hours) and sleep tracking (Supported).',
        }}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Garmin Forerunner 265' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/offers the best value for marathon training/i)).toBeInTheDocument();
    expect(screen.getByText(/earned a weighted score of 85/i)).toBeInTheDocument();
  });
});

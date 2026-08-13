import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_WEIGHTS } from '../lib/weights';
import WeightControls from './WeightControls';

describe('WeightControls', () => {
  it('renders a slider for each of the five attributes', () => {
    render(<WeightControls weights={DEFAULT_WEIGHTS} onChange={() => {}} />);

    expect(screen.getAllByRole('slider')).toHaveLength(5);
    expect(screen.getByLabelText('Price')).toBeInTheDocument();
    expect(screen.getByLabelText('Battery Life')).toBeInTheDocument();
    expect(screen.getByLabelText('Sleep Tracking')).toBeInTheDocument();
    expect(screen.getByLabelText('Durability')).toBeInTheDocument();
    expect(screen.getByLabelText('Subscription-Free')).toBeInTheDocument();
  });

  it('reports an updated weight when a slider changes', () => {
    const onChange = vi.fn();
    render(<WeightControls weights={DEFAULT_WEIGHTS} onChange={onChange} />);

    fireEvent.change(screen.getByLabelText('Price'), { target: { value: '60' } });

    expect(onChange).toHaveBeenCalledWith({ ...DEFAULT_WEIGHTS, price: 60 });
  });

  it('does not mutate the weights object it receives', () => {
    const onChange = vi.fn();
    const weights = { ...DEFAULT_WEIGHTS };
    render(<WeightControls weights={weights} onChange={onChange} />);

    fireEvent.change(screen.getByLabelText('Durability'), { target: { value: '10' } });

    expect(weights.durability).toBe(20);
    expect(onChange).toHaveBeenCalledWith({ ...weights, durability: 10 });
  });
});

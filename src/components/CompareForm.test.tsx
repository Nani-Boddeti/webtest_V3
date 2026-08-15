import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_WEIGHTS } from '../lib/weights';
import CompareForm from './CompareForm';

function renderForm(overrides: Partial<Parameters<typeof CompareForm>[0]> = {}) {
  const props = {
    watches: ['', ''],
    purpose: '',
    weights: DEFAULT_WEIGHTS,
    submitting: false,
    submitError: null,
    onWatchesChange: vi.fn(),
    onPurposeChange: vi.fn(),
    onWeightsChange: vi.fn(),
    onSubmit: vi.fn(),
    ...overrides,
  };
  render(<CompareForm {...props} />);
  return props;
}

describe('CompareForm', () => {
  it('renders watch inputs, weight sliders, a purpose field, and a submit button', () => {
    renderForm();

    expect(screen.getByLabelText('Watch 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Watch 2')).toBeInTheDocument();
    expect(screen.getAllByRole('slider')).toHaveLength(5);
    expect(screen.getByLabelText(/what will you use it for/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /compare watches/i })).toBeInTheDocument();
  });

  it('shows an inline validation error and does not submit with fewer than two watches', () => {
    const props = renderForm();

    fireEvent.click(screen.getByRole('button', { name: /compare watches/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(/at least two watch names/i);
    expect(props.onSubmit).not.toHaveBeenCalled();
  });

  it('submits when at least two watch names are provided', () => {
    const props = renderForm({
      watches: ['Apple Watch Series 10', 'Garmin Forerunner 265'],
    });

    fireEvent.click(screen.getByRole('button', { name: /compare watches/i }));

    expect(props.onSubmit).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('adds a new watch input via the add button', () => {
    const props = renderForm();

    fireEvent.click(screen.getByRole('button', { name: /add another watch/i }));

    expect(props.onWatchesChange).toHaveBeenCalledWith(['', '', '']);
  });

  it('disables and relabels the submit button while submitting', () => {
    renderForm({ submitting: true });

    const button = screen.getByRole('button', { name: /comparing/i });
    expect(button).toBeDisabled();
  });

  it('renders a submit error when the API reports a failure', () => {
    renderForm({ submitError: 'Server is missing the SERPAPI_API_KEY environment variable.' });

    expect(screen.getByRole('alert')).toHaveTextContent(/serpapi_api_key/i);
  });
});

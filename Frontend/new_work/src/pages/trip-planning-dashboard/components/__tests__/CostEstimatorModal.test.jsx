import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CostEstimatorModal from '../CostEstimatorModal';
import { CurrencyProvider } from '../../../../contexts/CurrencyContext';

const trips = [
  { id: 1, name: 'Test Trip', departureDate: '2026-02-01', destinations: [{ country: 'France' }, { country: 'Germany' }] }
];

describe('CostEstimatorModal', () => {
  it('renders and shows converted totals', async () => {
    render(
      <CurrencyProvider>
        <CostEstimatorModal isOpen={true} onClose={() => {}} trips={trips} />
      </CurrencyProvider>
    );

    expect(screen.getByText(/Cost Estimator/i)).toBeInTheDocument();
    // default currency USD symbol present
    expect(screen.getByText(/USD/i)).toBeInTheDocument();
    // total approx should render
    expect(screen.getByText(/Total \(approx\)/i)).toBeInTheDocument();
  });
});
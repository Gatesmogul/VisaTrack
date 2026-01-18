import React from 'react';
import { render, screen } from '@testing-library/react';
import TimelinePanel from '../TimelinePanel';

const now = new Date();
const soon = new Date(); soon.setDate(now.getDate() + 10);
const later = new Date(); later.setDate(now.getDate() + 90);

const trips = [
  {
    id: 1,
    name: 'Impossible Trip',
    departureDate: soon.toISOString(),
    destinations: [{ country: 'Germany', flag: '🇩🇪', visaStatus: 'not_started' }]
  },
  {
    id: 2,
    name: 'Feasible Trip',
    departureDate: later.toISOString(),
    destinations: [{ country: 'France', flag: '🇫🇷', visaStatus: 'not_started' }]
  }
];

describe('TimelinePanel with feasibility', () => {
  test('renders warning banner for impossible trip', () => {
    render(<TimelinePanel trips={trips} />);
    expect(screen.getByText(/The following trips have impossible timelines/i)).toBeInTheDocument();
  });

  test('shows per-deadline impossible label', () => {
    render(<TimelinePanel trips={trips} />);
    expect(screen.getAllByText(/Impossible/i).length).toBeGreaterThan(0);
  });
});
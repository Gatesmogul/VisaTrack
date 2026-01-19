import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

describe('FullTimelineModal from TimelinePanel', () => {
  test('opens modal when View Full Timeline clicked and shows list', async () => {
    render(<TimelinePanel trips={trips} />);
    const btn = screen.getByRole('button', { name: /View Full Timeline/i });
    await userEvent.click(btn);
    expect(screen.getByText(/Full Timeline & Feasibility/i)).toBeInTheDocument();
    // impossible trip should be shown in modal
    expect(screen.getByText(/Impossible Trip/i)).toBeInTheDocument();
  });
});
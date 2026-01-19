import { assessDestinationFeasibility, assessTripFeasibility } from '../feasibility';
import { describe, it, expect } from 'vitest';

describe('feasibility utils', () => {
  it('marks destination impossible when not enough days remain', () => {
    const destination = { country: 'Germany' };
    // set departure to 10 days from now, Germany needs >= (45+7+7)=59 days
    const departure = new Date();
    departure.setDate(departure.getDate() + 10);

    const res = assessDestinationFeasibility(destination, departure.toISOString(), new Date());
    expect(res.status).toBe('impossible');
  });

  it('marks destination marginal when within margin', () => {
    const destination = { country: 'Italy' };
    // Italy default 30 + 7 + 7 = 44; set daysUntilDeparture = 47 (marginal within 7 days)
    const departure = new Date();
    departure.setDate(departure.getDate() + 47);

    const res = assessDestinationFeasibility(destination, departure.toISOString(), new Date());
    expect(res.status).toBe('marginal');
  });

  it('marks trip as impossible if any destination impossible', () => {
    const trip = {
      id: 1,
      name: 'Test trip',
      departureDate: (() => { const d = new Date(); d.setDate(d.getDate()+10); return d.toISOString(); })(),
      destinations: [{ country: 'Germany' }, { country: 'France' }]
    };

    const res = assessTripFeasibility(trip, new Date());
    expect(res.status).toBe('impossible');
  });
});
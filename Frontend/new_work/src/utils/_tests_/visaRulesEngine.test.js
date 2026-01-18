import { lookupVisaRequirement, getVisaTypeLabel } from '../visaRulesEngine';

describe('visaRulesEngine', () => {
  test('finds eVisa for Vietnam and returns evisa type', () => {
    const res = lookupVisaRequirement('IN', 'VN');
    expect(res.found).toBe(true);
    expect(res.type).toBe('evisa');
    expect(res.recommendation).toMatch(/eVisa/i);
  });

  test('returns visa_free for Singapore', () => {
    const res = lookupVisaRequirement('IN', 'SG');
    expect(res.found).toBe(true);
    expect(res.type).toBe('visa_free');
  });

  test('returns embassy for United States', () => {
    const res = lookupVisaRequirement('IN', 'US');
    expect(res.found).toBe(true);
    expect(res.type).toBe('embassy');
  });

  test('getVisaTypeLabel produces human label', () => {
    expect(getVisaTypeLabel('visa_free')).toBe('Visa-free');
    expect(getVisaTypeLabel('evisa')).toBe('eVisa');
  });
});

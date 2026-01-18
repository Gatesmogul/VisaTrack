import { saveBooking, getBookings, updateBooking, removeBooking } from '../bookings';

describe('bookings util', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('save and get booking', () => {
    const b = saveBooking({ destination: 'France', datetime: new Date().toISOString() });
    const all = getBookings();
    expect(all.length).toBe(1);
    expect(all[0].destination).toBe('France');
    expect(b.id).toBeDefined();
  });

  test('update booking', () => {
    const b = saveBooking({ destination: 'France', datetime: new Date().toISOString() });
    const updated = updateBooking(b.id, { notes: 'Bring documents' });
    expect(updated.notes).toBe('Bring documents');
  });

  test('remove booking', () => {
    const b = saveBooking({ destination: 'France', datetime: new Date().toISOString() });
    removeBooking(b.id);
    const all = getBookings();
    expect(all.length).toBe(0);
  });
});
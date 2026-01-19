import { initBookingScheduler } from '../bookingScheduler';
import { saveBooking, getBookings } from '../bookings';

describe('bookingScheduler', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  test('init scheduler sends immediate notification for past reminder', () => {
    const appointmentDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h from now
    const pastReminder = new Date(Date.now() - 60 * 60 * 1000).toISOString(); // 1 hour ago
    const booking = saveBooking({ destination: 'France', datetime: appointmentDate.toISOString(), reminderAt: pastReminder });

    const addNotification = jest.fn();
    initBookingScheduler(addNotification);

    // immediate sync expected
    expect(addNotification).toHaveBeenCalledWith(expect.objectContaining({ type: 'reminder' }));

    const updated = getBookings().find(b => b.id === booking.id);
    expect(updated.reminderSent).toBe(true);
  });
});
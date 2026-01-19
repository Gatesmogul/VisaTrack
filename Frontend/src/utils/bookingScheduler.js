import { getBookings, updateBooking } from './bookings.js';

const timers = new Map();

function msUntil(iso) {
  const t = new Date(iso).getTime();
  return Math.max(0, t - Date.now());
}

export function scheduleBookingReminder(booking, addNotification) {
  if (!booking || !booking.reminderAt) return;
  const id = booking.id;
  // clear existing timer
  if (timers.has(id)) {
    clearTimeout(timers.get(id));
  }

  const ms = msUntil(booking.reminderAt);
  if (ms <= 0) {
    // reminder time passed — send immediately if not sent
    if (!booking.reminderSent) {
      addNotification({ type: 'reminder', message: `Reminder: Appointment for ${booking.destination} on ${new Date(booking.datetime).toLocaleString()}`, time: new Date().toLocaleString() });
      updateBooking(id, { reminderSent: true });
    }
    return;
  }

  const timer = setTimeout(() => {
    addNotification({ type: 'reminder', message: `Reminder: Appointment for ${booking.destination} on ${new Date(booking.datetime).toLocaleString()}`, time: new Date().toLocaleString() });
    updateBooking(id, { reminderSent: true });
    timers.delete(id);
  }, ms);
  timers.set(id, timer);
}

export function initBookingScheduler(addNotification) {
  const bookings = getBookings();
  bookings.forEach(b => {
    if (!b.reminderSent && b.reminderAt) {
      scheduleBookingReminder(b, addNotification);
    }
  });
}

export function cancelScheduledReminder(bookingId) {
  if (timers.has(bookingId)) {
    clearTimeout(timers.get(bookingId));
    timers.delete(bookingId);
  }
}

export default { scheduleBookingReminder, initBookingScheduler, cancelScheduledReminder };

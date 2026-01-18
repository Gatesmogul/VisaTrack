const STORAGE_KEY = 'visa_bookings';

export function getBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveBooking(booking) {
  const bookings = getBookings();
  const newBooking = { id: Date.now().toString(), createdAt: new Date().toISOString(), reminderSent: false, ...booking };
  bookings.push(newBooking);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  return newBooking;
}

export function updateBooking(id, patch) {
  const bookings = getBookings();
  const updated = bookings.map(b => (b.id === id ? { ...b, ...patch } : b));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated.find(b => b.id === id);
}

export function removeBooking(id) {
  const bookings = getBookings();
  const filtered = bookings.filter(b => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

export default { getBookings, saveBooking, updateBooking, removeBooking };
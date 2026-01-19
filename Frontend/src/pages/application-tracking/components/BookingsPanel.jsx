import React, { useEffect, useState } from 'react';
import Button from '../../../components/ui/Button';
import { getBookings, removeBooking } from '../../../utils/bookings';
import { cancelScheduledReminder } from '../../../utils/bookingScheduler';
import { useNotifications } from '../../../contexts/NotificationsContext';

const BookingsPanel = () => {
  const [bookings, setBookings] = useState([]);
  const { addNotification } = useNotifications();

  useEffect(() => {
    setBookings(getBookings());
  }, []);

  const handleCancel = (id) => {
    removeBooking(id);
    cancelScheduledReminder(id);
    setBookings(getBookings());
    addNotification({ type: 'booking', message: 'Appointment cancelled', time: new Date().toLocaleString() });
  };

  if (!bookings || bookings.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-elevation-2">
      <h3 className="text-lg font-heading font-semibold text-foreground mb-3">Appointments</h3>
      <div className="space-y-3">
        {bookings.map(b => (
          <div key={b.id} className="p-3 border rounded flex items-start justify-between gap-3">
            <div>
              <div className="font-medium">{b.destination}</div>
              <div className="text-sm text-muted-foreground">{new Date(b.datetime).toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">{b.embassy?.office || b.embassy?.address}</div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => handleCancel(b.id)}>Cancel</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingsPanel;
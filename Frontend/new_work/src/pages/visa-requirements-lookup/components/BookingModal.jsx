import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { saveBooking } from '../../../utils/bookings';
import { scheduleBookingReminder } from '../../../utils/bookingScheduler';
import { useNotifications } from '../../../contexts/NotificationsContext';

const BookingModal = ({ isOpen, onClose, destination = '', embassy = {}, onSaved }) => {
  const [datetime, setDatetime] = useState('');
  const [notes, setNotes] = useState('');
  const { addNotification } = useNotifications();

  if (!isOpen) return null;

  const handleSave = () => {
    if (!datetime) return;
    const appointmentDate = new Date(datetime);
    const reminderAt = new Date(appointmentDate.getTime() - 48 * 60 * 60 * 1000).toISOString(); // 48 hours before

    const booking = saveBooking({ destination, embassy, datetime: appointmentDate.toISOString(), notes, reminderAt });

    // immediate confirmation notification
    addNotification({ type: 'booking', message: `Appointment booked for ${destination} on ${appointmentDate.toLocaleString()}` });

    // schedule the reminder
    scheduleBookingReminder(booking, addNotification);

    if (onSaved) onSaved(booking);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-400 flex items-start justify-center bg-black/40 pt-16">
      <div className="w-full max-w-md bg-card border border-border rounded-lg shadow-elevation-12 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Calendar" size={20} color="var(--color-primary)" />
            </div>
            <h3 className="text-lg font-medium">Book Embassy Appointment</h3>
            <span className="text-sm text-muted-foreground">{destination}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Embassy / Office</label>
            <div className="text-sm text-foreground">{embassy?.office || embassy?.address || 'Not specified'}</div>
            <div className="text-xs text-muted-foreground">{embassy?.phone}</div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Appointment date & time</label>
            <input type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} className="w-full border border-input rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes (optional)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border border-input rounded px-3 py-2" rows={3} />
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave}>Book Appointment</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
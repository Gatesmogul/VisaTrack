import React, { createContext, useContext, useEffect, useState } from 'react';

const NotificationsContext = createContext(null);

const STORAGE_KEY = 'visatrack.notifications';
const PREFS_KEY = 'visatrack.notificationPrefs';

const defaultNotifications = [
  { id: 1, type: 'deadline', message: 'Japan visa application due in 3 days', time: '2 hours ago', read: false },
  { id: 2, type: 'document', message: 'Passport copy required for UK application', time: '5 hours ago', read: false },
  { id: 3, type: 'policy', message: 'New visa policy update for Schengen area', time: '1 day ago', read: true },
];

const defaultPreferences = {
  emailNotifications: true,
  smsNotifications: false,
  policyUpdates: true,
  travelTips: true,
  preferredLanguage: 'en',
  // list of lowercased country names the user subscribed to for policy alerts
  subscribedCountries: []
};

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : defaultNotifications;
    } catch (e) {
      return defaultNotifications;
    }
  });

  const [preferences, setPreferences] = useState(() => {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      return raw ? JSON.parse(raw) : defaultPreferences;
    } catch (e) {
      return defaultPreferences;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (e) {}
  }, [notifications]);

  // Initialize booking reminder scheduler on mount
  useEffect(() => {
    // import scheduler lazily to avoid circular deps at module eval time
    const initScheduler = async () => {
      const { initBookingScheduler } = await import('../utils/bookingScheduler');
      initBookingScheduler(addNotification);
    };
    initScheduler();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(preferences));
    } catch (e) {}
  }, [preferences]);

  const addNotification = (payload) => {
    const n = { id: Date.now(), time: payload.time || 'just now', read: false, ...payload };
    setNotifications((prev) => [n, ...prev]);
  };

  const markRead = (id) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const toggleRead = (id) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));
  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const clearAll = () => setNotifications([]);

  const updatePreferences = (newPrefs) => setPreferences((p) => ({ ...p, ...newPrefs }));

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Subscription helpers (store country names lowercased)
  const subscribeToCountry = (country) => {
    const key = (country || '').toString().toLowerCase();
    setPreferences((p) => ({ ...p, subscribedCountries: Array.from(new Set([...(p.subscribedCountries || []), key])) }));
  };

  const unsubscribeFromCountry = (country) => {
    const key = (country || '').toString().toLowerCase();
    setPreferences((p) => ({ ...p, subscribedCountries: (p.subscribedCountries || []).filter((c) => c !== key) }));
  };

  const toggleCountrySubscription = (country) => {
    const key = (country || '').toString().toLowerCase();
    setPreferences((p) => ({ ...p, subscribedCountries: (p.subscribedCountries || []).includes(key) ? (p.subscribedCountries || []).filter((c) => c !== key) : [...(p.subscribedCountries || []), key] }));
  };

  const isSubscribed = (country) => {
    const key = (country || '').toString().toLowerCase();
    return (preferences?.subscribedCountries || []).includes(key);
  };

  // Listen for policy broadcasts dispatched elsewhere in the app
  useEffect(() => {
    const handler = (e) => {
      try {
        const update = e?.detail;
        const country = (update?.country || '').toString().toLowerCase();
        if (!country) return;
        // Only notify if user opted into policy updates and subscribed to this country
        if (!preferences?.policyUpdates) return;
        const subs = preferences?.subscribedCountries || [];
        if (subs.includes(country)) {
          addNotification({ type: 'policy', message: `${update?.title} — ${update?.country}`, time: new Date().toLocaleString(), meta: { update } });
        }
      } catch (err) {
        // ignore
      }
    };

    window.addEventListener('policy-update', handler);
    return () => window.removeEventListener('policy-update', handler);
  }, [preferences]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        preferences,
        addNotification,
        markRead,
        toggleRead,
        markAllRead,
        clearAll,
        updatePreferences,
        unreadCount,
        // subscription API
        subscribeToCountry,
        unsubscribeFromCountry,
        toggleCountrySubscription,
        isSubscribed
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider');
  return ctx;
};

export default NotificationsContext;

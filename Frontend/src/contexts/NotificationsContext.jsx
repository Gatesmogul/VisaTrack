import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import notificationApi from '../api/notification.api';

const NotificationsContext = createContext(null);

const STORAGE_KEY = 'visatrack.notifications';
const PREFS_KEY = 'visatrack.notificationPrefs';

const defaultPreferences = {
  emailNotifications: true,
  smsNotifications: false,
  policyUpdates: true,
  travelTips: true,
  preferredLanguage: 'en',
  subscribedCountries: []
};

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState(() => {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      return raw ? JSON.parse(raw) : defaultPreferences;
    } catch (e) {
      return defaultPreferences;
    }
  });

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await notificationApi.getNotifications();
      setNotifications(res.data || res || []);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    // Poll every 5 minutes or use websockets? For now, fetch on mount.
  }, [fetchNotifications]);


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

  const markRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id || n._id === id ? { ...n, read: true } : n)));
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  const markAllRead = async () => {
    // Backend mark-all-read endpoint integration
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

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

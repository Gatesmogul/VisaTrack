import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import { useNotifications } from '../../contexts/NotificationsContext';
import { Checkbox, CheckboxGroup } from '../../components/ui/Checkbox';
import Icon from '../../components/AppIcon';

const NotificationsPage = () => {
  const { notifications, preferences, markRead, markAllRead, clearAll, updatePreferences, unreadCount } = useNotifications();

  const notificationPreferences = [
    { key: 'emailNotifications', label: 'Email Notifications', description: 'Visa policy updates and deadline reminders' },
    { key: 'smsNotifications', label: 'SMS Alerts', description: 'Urgent deadline warnings (requires phone number)' },
    { key: 'policyUpdates', label: 'Policy Change Alerts', description: 'Instant notifications when visa rules change' },
    { key: 'travelTips', label: 'Travel Tips & Guides', description: 'Helpful visa application advice and success stories' },
  ];

  return (
    <>
      <Helmet>
        <title>Notifications - VisaTrack</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-heading font-semibold">Notifications</h1>
            <div className="flex items-center gap-3">
              <button onClick={() => markAllRead()} className="text-sm text-muted-foreground hover:text-foreground">Mark all read</button>
              <button onClick={() => clearAll()} className="text-sm text-error hover:underline">Clear all</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <section className="md:col-span-2 bg-card border border-border rounded-lg overflow-hidden">
              <div className="p-4 border-b border-border font-medium">Recent ({unreadCount} unread)</div>
              <div className="max-h-96 overflow-y-auto">
                {notifications?.length === 0 ? (
                  <div className="p-6 text-sm text-muted-foreground">You're all caught up.</div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className={`p-4 border-b border-border ${!n.read ? 'bg-accent/5' : ''}`}>
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${n.type === 'deadline' ? 'bg-warning/10' : n.type === 'document' ? 'bg-accent/10' : 'bg-primary/10'}`}>
                          <Icon name={n.type === 'deadline' ? 'Clock' : n.type === 'document' ? 'FileText' : 'Info'} size={16} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-4">
                            <p className="text-sm font-medium text-foreground">{n.message}</p>
                            <div className="text-xs text-muted-foreground">{n.time}</div>
                          </div>
                          <div className="mt-3 flex items-center gap-2">
                            {!n.read && (
                              <button onClick={() => markRead(n.id)} className="text-sm text-primary">Mark read</button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <aside className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-medium mb-3">Notification Preferences</h3>
              <CheckboxGroup>
                <div className="space-y-3">
                  {notificationPreferences.map((pref) => (
                    <Checkbox
                      key={pref.key}
                      label={pref.label}
                      description={pref.description}
                      checked={!!preferences?.[pref.key]}
                      onChange={(e) => updatePreferences({ [pref.key]: e.target.checked })}
                    />
                  ))}
                </div>
              </CheckboxGroup>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
};

export default NotificationsPage;

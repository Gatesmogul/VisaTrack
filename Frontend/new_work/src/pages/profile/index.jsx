import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationsContext';
import { useToast } from '../../contexts/ToastContext';
import { useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Checkbox } from '../../components/ui/Checkbox';
import ConfirmModal from '../../components/ui/ConfirmModal';
import PassportsModal from '../../components/ui/PassportsModal';
import ManageSubscriptionsModal from '../../components/ui/ManageSubscriptionsModal';

const ProfileSettings = () => {
  const { user, updateProfile, logout } = useAuth();
  const { preferences, updatePreferences, clearAll, notifications, subscribeToCountry, unsubscribeFromCountry, toggleCountrySubscription, isSubscribed } = useNotifications();
  const { showToast } = useToast();

  const location = useLocation();
  const [highlightPassports, setHighlightPassports] = useState(false);
  const [highlightPreferences, setHighlightPreferences] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    primaryPassport: '',
    passportNumber: '',
    passportExpiry: '',
    // notification prefs
    emailNotifications: true,
    smsNotifications: false,
    policyUpdates: true,
    travelTips: false,
    preferredLanguage: 'en',
  });

  const [passports, setPassports] = useState(user?.passports || []);
  const [showPassportsModal, setShowPassportsModal] = useState(false);
  const [showManageSubscriptions, setShowManageSubscriptions] = useState(false);

  useEffect(() => {
    if (user) {
      setForm((f) => ({ ...f, name: user?.name || '', email: user?.email || '', phone: user?.phone || '' }));
      if (user?.passports) setPassports(user.passports);
    }
    if (preferences) {
      setForm((f) => ({
        ...f,
        emailNotifications: preferences?.emailNotifications ?? f.emailNotifications,
        smsNotifications: preferences?.smsNotifications ?? f.smsNotifications,
        policyUpdates: preferences?.policyUpdates ?? f.policyUpdates,
        travelTips: preferences?.travelTips ?? f.travelTips,
        preferredLanguage: preferences?.preferredLanguage ?? f.preferredLanguage,
      }));
    }

    const doFocus = (focus) => {
      if (focus === 'passports') {
        const el = document.getElementById('passport-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => {
            setHighlightPassports(true);
            setTimeout(() => setHighlightPassports(false), 2000);
          }, 250);
        }
      }

      if (focus === 'preferences') {
        const el = document.getElementById('preferences-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => {
            setHighlightPreferences(true);
            setTimeout(() => setHighlightPreferences(false), 2000);
          }, 250);
        }
      }
    };

    // handle focus from header (navigate with state)
    const focus = location?.state?.focus;
    if (focus) doFocus(focus);

    // handle focus via dispatched events (when already on /profile)
    const handler = (e) => {
      const f = e?.detail?.focus;
      if (f) doFocus(f);
    };
    window.addEventListener('profile-focus', handler);
    return () => window.removeEventListener('profile-focus', handler);
  }, [user, preferences, location]);

  const handleChange = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const handleSave = (e) => {
    e?.preventDefault();
    // Update auth profile
    try {
      const primaryFromPassports = passports?.find((p) => p.primary) || passports?.[0];
      const passportToSave = primaryFromPassports
        ? { country: primaryFromPassports.country, number: primaryFromPassports.number, expiry: primaryFromPassports.expiry }
        : { country: form.primaryPassport, number: form.passportNumber, expiry: form.passportExpiry };

      updateProfile({
        name: form.name,
        email: form.email,
        phone: form.phone,
        passport: passportToSave,
        passports: passports || [],
      });
    } catch (e) {
      console.error('Failed to update profile', e);
      showToast({ message: 'Failed to save profile', type: 'error' });
      return;
    }

    // Sync notification preferences
    try {
      updatePreferences({
        emailNotifications: !!form.emailNotifications,
        smsNotifications: !!form.smsNotifications,
        policyUpdates: !!form.policyUpdates,
        travelTips: !!form.travelTips,
        preferredLanguage: form.preferredLanguage || 'en',
      });
    } catch (e) {
      // ignore
    }

    try {
      showToast({ message: 'Profile saved', type: 'success', duration: 3000 });
    } catch (e) {
      // fallback
      console.log('Profile saved');
    }
  };

  const handleExport = () => {
    try {
      const payload = { user, preferences, notifications: notifications || [] };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `visatrack-export-${user?.email || 'profile'}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast({ message: 'Export started', type: 'success' });
    } catch (e) {
      showToast({ message: 'Export failed', type: 'error' });
    }
  };

  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const handleDelete = () => {
    // This now opens the modal; actual delete action is performed in performDelete
    setShowDeleteModal(true);
  };

  const performDelete = () => {
    try {
      // For now this is a mock delete: clear auth and notifications and show toast
      clearAll();
      logout();
      showToast({ message: 'Account deleted (mock)', type: 'error' });
      setShowDeleteModal(false);
      // redirect to home
      setTimeout(() => (window.location.href = '/'), 800);
    } catch (e) {
      showToast({ message: 'Failed to delete account', type: 'error' });
    }
  };

  return (
    <>
      <Helmet>
        <title>Profile Settings - VisaTrack</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-heading font-semibold mb-6">Profile Settings</h1>
          <form onSubmit={handleSave} className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <section className="md:col-span-2 bg-card border border-border rounded-lg p-6">
              <h2 className="font-medium mb-4">Account</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input label="Full name" value={form.name} onChange={(e) => handleChange('name', e.target.value)} />
                <Input label="Email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
                <Input label="Phone" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} />
              </div>

              <h2 id="passport-section" className={`font-medium mt-6 mb-4 ${highlightPassports ? 'ring-2 ring-primary/40 rounded-md p-2' : ''}`}>Passports</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                <div className="md:col-span-2">
                  {passports?.length ? (
                    <div className="space-y-2">
                      {passports.map((p) => (
                        <div key={p.id} className={`flex items-center justify-between p-2 border rounded ${p.primary ? 'bg-primary/5' : ''}`}>
                          <div>
                            <div className="font-medium">{p.country} {p.primary ? <span className="text-xs text-primary-foreground bg-primary/10 px-2 py-0.5 rounded ml-2">Primary</span> : null}</div>
                            <div className="text-sm text-muted-foreground">{p.number} • {p.expiry}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">No passports added. Use Manage passports to add.</div>
                  )}
                </div>
                <div className="flex gap-2 justify-end">
                  <Button onClick={() => setShowPassportsModal(true)}>Manage passports</Button>
                </div>
              </div>
            </section>

            <aside className="bg-card border border-border rounded-lg p-6">
              <h2 id="preferences-section" className={`font-medium mb-4 ${highlightPreferences ? 'ring-2 ring-primary/40 rounded-md p-2' : ''}`}>Notification Preferences</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <Checkbox checked={form.emailNotifications} onChange={(e) => handleChange('emailNotifications', e.target.checked)} />
                  <div>
                    <div className="text-sm font-medium">Email Notifications</div>
                    <div className="text-xs text-muted-foreground">Visa policy updates and deadline reminders</div>
                  </div>
                </label>

                <label className="flex items-center gap-3">
                  <Checkbox checked={form.smsNotifications} onChange={(e) => handleChange('smsNotifications', e.target.checked)} />
                  <div>
                    <div className="text-sm font-medium">SMS Alerts</div>
                    <div className="text-xs text-muted-foreground">Urgent deadline warnings (requires phone number)</div>
                  </div>
                </label>

                <label className="flex items-center gap-3">
                  <Checkbox checked={form.policyUpdates} onChange={(e) => handleChange('policyUpdates', e.target.checked)} />
                  <div>
                    <div className="text-sm font-medium">Policy Change Alerts</div>
                    <div className="text-xs text-muted-foreground">Instant notifications when visa rules change</div>
                  </div>
                </label>

                <label className="flex items-center gap-3">
                  <Checkbox checked={form.travelTips} onChange={(e) => handleChange('travelTips', e.target.checked)} />
                  <div>
                    <div className="text-sm font-medium">Travel Tips & Guides</div>
                    <div className="text-xs text-muted-foreground">Helpful visa application advice and success stories</div>
                  </div>
                </label>

                <div className="pt-3">
                  <label className="block text-sm font-medium mb-2">Policy Subscriptions</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(preferences?.subscribedCountries || []).map((c) => (
                      <div key={c} className="flex items-center gap-2 bg-muted px-2 py-1 rounded">
                        <span className="text-sm font-medium">{c}</span>
                        <button type="button" className="text-xs text-destructive underline" onClick={() => toggleCountrySubscription(c)}>Unsubscribe</button>
                      </div>
                    ))}

                    {(!preferences?.subscribedCountries || preferences?.subscribedCountries.length === 0) && (
                      <div className="text-sm text-muted-foreground">You are not subscribed to any countries.</div>
                    )}
                  </div>

                  <div className="mb-4">
                    <Button variant="outline" onClick={() => setShowManageSubscriptions(true)}>Manage Subscriptions</Button>
                  </div>

                  <label className="block text-sm font-medium mb-2">Preferred Language</label>
                  <select value={form.preferredLanguage} onChange={(e) => handleChange('preferredLanguage', e.target.value)} className="w-full border border-input rounded-lg px-3 py-2">
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="zh">中文</option>
                    <option value="ja">日本語</option>
                    <option value="ar">العربية</option>
                  </select>
                </div>

                <div className="mt-6">
                  <Button type="submit" fullWidth>Save profile</Button>
                </div>

                <div className="mt-6 border-t pt-4">
                  <h3 className="font-medium text-destructive mb-3">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground mb-3">Export your data or delete your account. These are mock actions (no real backend).</p>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleExport}>Export data</Button>
                    <Button variant="destructive" onClick={() => setShowDeleteModal(true)}>Delete account</Button>
                  </div>
                </div>
              </div>
            </aside>
          </form>
        </main>
      </div>

      <ManageSubscriptionsModal isOpen={showManageSubscriptions} onClose={() => setShowManageSubscriptions(false)} />

      <PassportsModal
        isOpen={showPassportsModal}
        passports={passports}
        onClose={() => setShowPassportsModal(false)}
        onSave={(items) => {
          setPassports(items);
          const primary = items.find((p) => p.primary) || items[0] || null;
          if (primary) {
            setForm((f) => ({ ...f, primaryPassport: primary.country, passportNumber: primary.number, passportExpiry: primary.expiry }));
            updateProfile({ passports: items, passport: { country: primary.country, number: primary.number, expiry: primary.expiry } });
          } else {
            updateProfile({ passports: items });
          }
          try { showToast({ message: 'Passports saved', type: 'success' }); } catch (e) {}
          setShowPassportsModal(false);
        }}
      />

      {/* Confirm modal for delete */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete account"
        description="Deleting your account will remove your profile locally. This is a mock action and won't affect a backend."
        confirmLabel="Delete account"
        cancelLabel="Cancel"
        danger
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={() => performDelete()}
      />
    </>
  );
};

export default ProfileSettings;
